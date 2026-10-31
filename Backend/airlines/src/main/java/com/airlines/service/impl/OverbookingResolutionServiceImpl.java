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
import com.airlines.service.OverbookingResolutionService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@SuppressWarnings("null")
public class OverbookingResolutionServiceImpl implements OverbookingResolutionService {

    private final BookingRepository bookingRepository;
    private final SeatDetailsRepository seatDetailsRepository;
    private final ManifestRecordRepository manifestRecordRepository;
    private final BumpCompensationRepository bumpCompensationRepository;

    public OverbookingResolutionServiceImpl(
            BookingRepository bookingRepository,
            SeatDetailsRepository seatDetailsRepository,
            ManifestRecordRepository manifestRecordRepository,
            BumpCompensationRepository bumpCompensationRepository) {
        this.bookingRepository = bookingRepository;
        this.seatDetailsRepository = seatDetailsRepository;
        this.manifestRecordRepository = manifestRecordRepository;
        this.bumpCompensationRepository = bumpCompensationRepository;
    }

    @Override
    public ManifestRecord resolveOverbooking(Long bookingId) throws ResourceNotAvailableException {
        Booking booking = bookingRepository.findById(java.util.Objects.requireNonNull(bookingId))
                .orElseThrow(() -> new ResourceNotAvailableException("Booking not found"));

        List<SeatDetails> flightSeats = seatDetailsRepository.getSeatDetailsByFlightId(booking.getFlightId());

        // Try to upgrade
        for (SeatDetails seat : flightSeats) {
            if (!seat.getSeatType().equalsIgnoreCase(booking.getSeatType()) && seat.getAvailableSeats() >= booking.getNop()) {
                // Perform upgrade
                seat.setAvailableSeats(seat.getAvailableSeats() - booking.getNop());
                seatDetailsRepository.save(java.util.Objects.requireNonNull(seat));

                SeatDetails oldSeat = seatDetailsRepository.getAvailableSeatsByFlightIdAndSeatType(booking.getFlightId(), booking.getSeatType());
                if (oldSeat != null) {
                    oldSeat.setAvailableSeats(oldSeat.getAvailableSeats() + booking.getNop());
                    seatDetailsRepository.save(java.util.Objects.requireNonNull(oldSeat));
                }

                booking.setSeatType(seat.getSeatType());
                bookingRepository.save(java.util.Objects.requireNonNull(booking));

                // Re-attempt check-in. Note: if totalCapacity is the issue, upgrade won't fix it unless capacity is per-seat.
                // Assuming we can just force the manifest record since we found a physical seat in a higher class.
                ManifestRecord upgradedRecord = new ManifestRecord();
                upgradedRecord.setBookingId(bookingId);
                upgradedRecord.setFlightId(booking.getFlightId());
                upgradedRecord.setStatus("UPGRADED");
                return manifestRecordRepository.save(java.util.Objects.requireNonNull(upgradedRecord));
            }
        }

        // If upgrade fails, we need to bump someone
        List<ManifestRecord> confirmedPassengers = manifestRecordRepository.findByFlightIdAndStatus(booking.getFlightId(), "CONFIRMED");
        if (!confirmedPassengers.isEmpty()) {
            ManifestRecord volunteer = confirmedPassengers.get(0); // Pick the first one as volunteer for simplicity
            volunteer.setStatus("BUMPED");
            manifestRecordRepository.save(java.util.Objects.requireNonNull(volunteer));

            BumpCompensation compensation = new BumpCompensation();
            compensation.setBookingId(volunteer.getBookingId());
            compensation.setFlightId(volunteer.getFlightId());
            compensation.setCompensationAmount(500.0); // Flat compensation
            bumpCompensationRepository.save(java.util.Objects.requireNonNull(compensation));

            // Now that a slot is open, check in the current passenger
            ManifestRecord currentPassengerRecord = new ManifestRecord();
            currentPassengerRecord.setBookingId(bookingId);
            currentPassengerRecord.setFlightId(booking.getFlightId());
            currentPassengerRecord.setStatus("CONFIRMED");
            return manifestRecordRepository.save(java.util.Objects.requireNonNull(currentPassengerRecord));
        }

        throw new ResourceNotAvailableException("Cannot resolve overbooking, no volunteers available and no upgrade possible.");
    }
}
