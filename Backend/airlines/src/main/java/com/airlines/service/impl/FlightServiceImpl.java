package com.airlines.service.impl;

import com.airlines.repository.BookingRepository;
import com.airlines.repository.FlightRepository;
import com.airlines.repository.SeatDetailsRepository;
import com.airlines.service.FlightService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import com.airlines.entity.Flight;

import java.util.List;
import java.util.Objects;

@Service
@SuppressWarnings("null")
public class FlightServiceImpl implements FlightService {

    private final FlightRepository flightRepository;
    private final SeatDetailsRepository seatDetailsRepository;
    private final BookingRepository bookingRepository;

    public FlightServiceImpl(
            FlightRepository flightRepository,
            SeatDetailsRepository seatDetailsRepository,
            BookingRepository bookingRepository) {
        this.flightRepository = flightRepository;
        this.seatDetailsRepository = seatDetailsRepository;
        this.bookingRepository = bookingRepository;
    }

    @Override
    public Flight insertFlight(Flight flight) {
        return flightRepository.save(java.util.Objects.requireNonNull(flight));
    }

    @Override
    public List<Flight> getAllFlights() {
        return flightRepository.findAll();
    }

    @Override
    public Flight getFlightById(Long flightId) {
        return flightRepository.findById(java.util.Objects.requireNonNull(flightId)).get();
    }

    @Transactional
    @Override
    public void deleteFlightById(Long flightId) {
        bookingRepository.deleteAllBookingsByFlightId(flightId);
        seatDetailsRepository.deleteAllSeatsByFlightId(flightId);
        flightRepository.deleteById(java.util.Objects.requireNonNull(flightId));
    }

    @Override
    public Flight updateFlightById(Flight flight, Long flightId) {
        Flight flightDB = flightRepository.findById(java.util.Objects.requireNonNull(flightId)).get();
        if (Objects.nonNull(flight.getFlightName()) && !"".equalsIgnoreCase(flight.getFlightName()))
            flightDB.setFlightName(flight.getFlightName());
        if (Objects.nonNull(flight.getTakeOffTime()) && !"".equalsIgnoreCase(flight.getTakeOffTime()))
            flightDB.setTakeOffTime(flight.getTakeOffTime());
        if (Objects.nonNull(flight.getOrigin()) && !"".equalsIgnoreCase(flight.getOrigin()))
            flightDB.setOrigin(flight.getOrigin());
        if (Objects.nonNull(flight.getDestination()) && !"".equalsIgnoreCase(flight.getDestination()))
            flightDB.setDestination(flight.getDestination());
        if (Objects.nonNull(flight.getArrivalTime()) && !"".equalsIgnoreCase(flight.getArrivalTime()))
            flightDB.setArrivalTime(flight.getArrivalTime());
        if (Objects.nonNull(flight.getAircraftType()) && !"".equalsIgnoreCase(flight.getAircraftType()))
            flightDB.setAircraftType(flight.getAircraftType());
        if (Objects.nonNull(flight.getStatus()) && !"".equalsIgnoreCase(flight.getStatus()))
            flightDB.setStatus(flight.getStatus());
        if (Objects.nonNull(flight.getTotalCapacity()))
            flightDB.setTotalCapacity(flight.getTotalCapacity());
        return flightRepository.save(java.util.Objects.requireNonNull(flightDB));
    }

}
