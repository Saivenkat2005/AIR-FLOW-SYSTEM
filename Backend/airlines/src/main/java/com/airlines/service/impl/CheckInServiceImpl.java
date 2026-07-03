package com.airlines.service.impl;

import com.airlines.entity.Booking;
import com.airlines.entity.Flight;
import com.airlines.entity.ManifestRecord;
import com.airlines.handlers.OverbookedException;
import com.airlines.handlers.ResourceNotAvailableException;
import com.airlines.repository.BookingRepository;
import com.airlines.repository.FlightRepository;
import com.airlines.repository.ManifestRecordRepository;
import com.airlines.service.CheckInService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CheckInServiceImpl implements CheckInService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private FlightRepository flightRepository;

    @Autowired
    private ManifestRecordRepository manifestRecordRepository;

    @Override
    public ManifestRecord checkInPassenger(Long bookingId) throws ResourceNotAvailableException {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotAvailableException("Booking not found"));

        Flight flight = flightRepository.findById(booking.getFlightId())
                .orElseThrow(() -> new ResourceNotAvailableException("Flight not found"));

        Optional<ManifestRecord> existingRecord = manifestRecordRepository.findByBookingId(bookingId);
        if (existingRecord.isPresent()) {
            return existingRecord.get();
        }

        if (flight.getConfirmedCount() >= flight.getTotalCapacity()) {
            throw new OverbookedException("Flight is overbooked. Capacity reached.", booking);
        }

        flight.setConfirmedCount(flight.getConfirmedCount() + 1);
        flightRepository.save(flight);

        ManifestRecord record = new ManifestRecord();
        record.setBookingId(bookingId);
        record.setFlightId(flight.getFlightId());
        record.setStatus("CONFIRMED");
        return manifestRecordRepository.save(record);
    }
}
