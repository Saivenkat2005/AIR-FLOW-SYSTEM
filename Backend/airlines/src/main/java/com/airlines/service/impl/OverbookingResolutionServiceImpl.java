package com.airlines.service.impl;

import com.airlines.entity.Booking;
import com.airlines.entity.BumpCompensation;
import com.airlines.entity.ManifestRecord;
import com.airlines.entity.SeatDetails;
import com.airlines.handlers.ResourceNotAvailableException;
import com.airlines.repository.BookingRepository;
import com.airlines.repository.BumpCompensationRepository;
import com.airlines.repository.ManifestRecordRepository;
import com.airlines.repository.SeatDetailsRepository;
import com.airlines.service.CheckInService;
import com.airlines.service.OverbookingResolutionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OverbookingResolutionServiceImpl implements OverbookingResolutionService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private SeatDetailsRepository seatDetailsRepository;

    @Autowired
    private ManifestRecordRepository manifestRecordRepository;

    @Autowired
    private BumpCompensationRepository bumpCompensationRepository;

    @Autowired
    private CheckInService checkInService;

    @Override
    public ManifestRecord resolveOverbooking(Long bookingId) throws ResourceNotAvailableException {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotAvailableException("Booking not found"));

        List<SeatDetails> flightSeats = seatDetailsRepository.getSeatDetailsByFlightId(booking.getFlightId());

        // Try to upgrade
        for (SeatDetails seat : flightSeats) {
            if (!seat.getSeatType().equalsIgnoreCase(booking.getSeatType()) && seat.getAvailableSeats() >= booking.getNop()) {
                // Perform upgrade
                seat.setAvailableSeats(seat.getAvailableSeats() - booking.getNop());
                seatDetailsRepository.save(seat);

                SeatDetails oldSeat = seatDetailsRepository.getAvailableSeatsByFlightIdAndSeatType(booking.getFlightId(), booking.getSeatType());
                if (oldSeat != null) {
                    oldSeat.setAvailableSeats(oldSeat.getAvailableSeats() + booking.getNop());
                    seatDetailsRepository.save(oldSeat);
                }

                booking.setSeatType(seat.getSeatType());
                bookingRepository.save(booking);

                // Re-attempt check-in. Note: if totalCapacity is the issue, upgrade won't fix it unless capacity is per-seat.
                // Assuming we can just force the manifest record since we found a physical seat in a higher class.
                ManifestRecord upgradedRecord = new ManifestRecord();
                upgradedRecord.setBookingId(bookingId);
                upgradedRecord.setFlightId(booking.getFlightId());
                upgradedRecord.setStatus("UPGRADED");
                return manifestRecordRepository.save(upgradedRecord);
            }
        }

        // If upgrade fails, we need to bump someone
        List<ManifestRecord> confirmedPassengers = manifestRecordRepository.findByFlightIdAndStatus(booking.getFlightId(), "CONFIRMED");
        if (!confirmedPassengers.isEmpty()) {
            ManifestRecord volunteer = confirmedPassengers.get(0); // Pick the first one as volunteer for simplicity
            volunteer.setStatus("BUMPED");
            manifestRecordRepository.save(volunteer);

            BumpCompensation compensation = new BumpCompensation();
            compensation.setBookingId(volunteer.getBookingId());
            compensation.setFlightId(volunteer.getFlightId());
            compensation.setCompensationAmount(500.0); // Flat compensation
            bumpCompensationRepository.save(compensation);

            // Now that a slot is open, check in the current passenger
            ManifestRecord currentPassengerRecord = new ManifestRecord();
            currentPassengerRecord.setBookingId(bookingId);
            currentPassengerRecord.setFlightId(booking.getFlightId());
            currentPassengerRecord.setStatus("CONFIRMED");
            return manifestRecordRepository.save(currentPassengerRecord);
        }

        throw new ResourceNotAvailableException("Cannot resolve overbooking, no volunteers available and no upgrade possible.");
    }
}
