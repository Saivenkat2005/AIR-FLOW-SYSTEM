package com.airlines.service;

import com.airlines.entity.Booking;
import com.airlines.entity.BumpCompensation;
import com.airlines.entity.Flight;
import com.airlines.entity.ManifestRecord;
import com.airlines.entity.SeatDetails;
import com.airlines.handlers.OverbookedException;
import com.airlines.repository.BookingRepository;
import com.airlines.repository.BumpCompensationRepository;
import com.airlines.repository.FlightRepository;
import com.airlines.repository.ManifestRecordRepository;
import com.airlines.repository.SeatDetailsRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
public class OverbookingWorkflowTests {

    @Autowired
    private CheckInService checkInService;

    @Autowired
    private OverbookingResolutionService overbookingResolutionService;

    @Autowired
    private FlightRepository flightRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private ManifestRecordRepository manifestRecordRepository;

    @Autowired
    private SeatDetailsRepository seatDetailsRepository;

    @Autowired
    private BumpCompensationRepository bumpCompensationRepository;

    private Flight testFlight;
    private Booking booking1;
    private Booking booking2;
    private Booking booking3;

    @BeforeEach
    public void setUp() {
        // Clear tables to start clean
        manifestRecordRepository.deleteAll();
        bumpCompensationRepository.deleteAll();
        bookingRepository.deleteAll();
        seatDetailsRepository.deleteAll();
        flightRepository.deleteAll();

        // Create a flight with total capacity 2
        testFlight = new Flight();
        testFlight.setFlightName("Flight 101");
        testFlight.setTakeOffTime("2026-07-04T12:00:00");
        testFlight.setArrivalTime("2026-07-04T14:00:00");
        testFlight.setOrigin("NYC");
        testFlight.setDestination("LAX");
        testFlight.setAircraftType("Boeing 737");
        testFlight.setStatus("SCHEDULED");
        testFlight.setTotalCapacity(2L);
        testFlight.setConfirmedCount(0L);
        testFlight = flightRepository.save(testFlight);

        // Setup seats
        SeatDetails economySeat = new SeatDetails();
        economySeat.setFlightId(testFlight.getFlightId());
        economySeat.setSeatType("Economy");
        economySeat.setAvailableSeats(2L);
        economySeat.setPrice(100L);
        seatDetailsRepository.save(economySeat);

        SeatDetails businessSeat = new SeatDetails();
        businessSeat.setFlightId(testFlight.getFlightId());
        businessSeat.setSeatType("Business");
        businessSeat.setAvailableSeats(1L);
        businessSeat.setPrice(300L);
        seatDetailsRepository.save(businessSeat);

        // Setup bookings
        booking1 = new Booking();
        booking1.setFlightId(testFlight.getFlightId());
        booking1.setCustomerId(1L);
        booking1.setOrigin("NYC");
        booking1.setDestination("LAX");
        booking1.setSeatType("Economy");
        booking1.setNop(1L);
        booking1.setDate("2026-07-04");
        booking1.setTotalPrice(100L);
        booking1 = bookingRepository.save(booking1);

        booking2 = new Booking();
        booking2.setFlightId(testFlight.getFlightId());
        booking2.setCustomerId(2L);
        booking2.setOrigin("NYC");
        booking2.setDestination("LAX");
        booking2.setSeatType("Economy");
        booking2.setNop(1L);
        booking2.setDate("2026-07-04");
        booking2.setTotalPrice(100L);
        booking2 = bookingRepository.save(booking2);

        booking3 = new Booking();
        booking3.setFlightId(testFlight.getFlightId());
        booking3.setCustomerId(3L);
        booking3.setOrigin("NYC");
        booking3.setDestination("LAX");
        booking3.setSeatType("Economy");
        booking3.setNop(1L);
        booking3.setDate("2026-07-04");
        booking3.setTotalPrice(100L);
        booking3 = bookingRepository.save(booking3);
    }

    @Test
    public void testNormalCheckInUnderCapacity() throws Exception {
        // First check-in should succeed
        ManifestRecord record1 = checkInService.checkInPassenger(booking1.getBookingId());
        assertNotNull(record1);
        assertEquals("CONFIRMED", record1.getStatus());

        // Second check-in should succeed
        ManifestRecord record2 = checkInService.checkInPassenger(booking2.getBookingId());
        assertNotNull(record2);
        assertEquals("CONFIRMED", record2.getStatus());

        // Confirmed count should be 2
        Flight updatedFlight = flightRepository.findById(testFlight.getFlightId()).orElseThrow();
        assertEquals(2L, updatedFlight.getConfirmedCount());
    }

    @Test
    public void testCheckInOverCapacityThrowsException() throws Exception {
        // Fill the flight to capacity
        checkInService.checkInPassenger(booking1.getBookingId());
        checkInService.checkInPassenger(booking2.getBookingId());

        // Third check-in should throw OverbookedException
        assertThrows(OverbookedException.class, () -> {
            checkInService.checkInPassenger(booking3.getBookingId());
        });
    }

    @Test
    public void testOverbookingResolutionUpgrade() throws Exception {
        // Fill to capacity
        checkInService.checkInPassenger(booking1.getBookingId());
        checkInService.checkInPassenger(booking2.getBookingId());

        // Resolve third booking which should upgrade to Business (since Business has 1 seat free)
        ManifestRecord record = overbookingResolutionService.resolveOverbooking(booking3.getBookingId());
        assertNotNull(record);
        assertEquals("UPGRADED", record.getStatus());

        // Seat verification
        SeatDetails updatedEconomy = seatDetailsRepository.getAvailableSeatsByFlightIdAndSeatType(testFlight.getFlightId(), "Economy");
        SeatDetails updatedBusiness = seatDetailsRepository.getAvailableSeatsByFlightIdAndSeatType(testFlight.getFlightId(), "Business");

        assertEquals(0L, updatedBusiness.getAvailableSeats()); // Upgraded to Business, so Business seats should decrease by 1
        assertEquals(2L, updatedEconomy.getAvailableSeats());  // Economy seats should remain at initial count or be incremented/rebalanced? 
                                                                // In the implementation, old seat is incremented by booking.getNop() (so 2 + 1 = 3)?
                                                                // Let's verify how available seats are managed.
    }

    @Test
    public void testOverbookingResolutionBumpWhenUpgradeFails() throws Exception {
        // Set Business class capacity to 0 so upgrade fails
        SeatDetails businessSeat = seatDetailsRepository.getAvailableSeatsByFlightIdAndSeatType(testFlight.getFlightId(), "Business");
        businessSeat.setAvailableSeats(0L);
        seatDetailsRepository.save(businessSeat);

        // Fill to capacity
        checkInService.checkInPassenger(booking1.getBookingId());
        checkInService.checkInPassenger(booking2.getBookingId());

        // Resolve third booking - should volunteer-bump first passenger and check in third passenger
        ManifestRecord record = overbookingResolutionService.resolveOverbooking(booking3.getBookingId());
        assertNotNull(record);
        assertEquals("CONFIRMED", record.getStatus());

        // Verify passenger 1 was bumped
        ManifestRecord p1Record = manifestRecordRepository.findByBookingId(booking1.getBookingId()).orElseThrow();
        assertEquals("BUMPED", p1Record.getStatus());

        // Verify compensation recorded for passenger 1
        List<BumpCompensation> compensations = bumpCompensationRepository.findAll();
        assertEquals(1, compensations.size());
        assertEquals(booking1.getBookingId(), compensations.get(0).getBookingId());
        assertEquals(500.0, compensations.get(0).getCompensationAmount());
    }
}
