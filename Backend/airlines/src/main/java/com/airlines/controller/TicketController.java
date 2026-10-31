package com.airlines.controller;

import com.airlines.entity.ApplicationUser;
import com.airlines.entity.Booking;
import com.airlines.entity.Flight;
import com.airlines.repository.BookingRepository;
import com.airlines.repository.FlightRepository;
import com.airlines.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping({"/tickets", "/api/v1/tickets", "/api/tickets"})
@CrossOrigin("*")
public class TicketController {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final FlightRepository flightRepository;

    public TicketController(BookingRepository bookingRepository,
                            UserRepository userRepository,
                            FlightRepository flightRepository) {
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.flightRepository = flightRepository;
    }

    @GetMapping("/verify/{pnr}")
    public ResponseEntity<Map<String, Object>> verifyTicket(@PathVariable("pnr") String pnr) {
        Map<String, Object> response = new HashMap<>();

        Long bookingId = null;
        try {
            String cleanPnr = pnr.replaceAll("[^0-9]", "");
            if (!cleanPnr.isEmpty()) {
                bookingId = Long.parseLong(cleanPnr);
            }
        } catch (Exception ignored) {}

        if (bookingId == null) {
            response.put("verified", false);
            response.put("pnr", pnr);
            response.put("error", "Invalid PNR format.");
            return ResponseEntity.status(404).body(response);
        }

        Optional<Booking> bookingOpt = bookingRepository.findById(bookingId);
        if (bookingOpt.isEmpty()) {
            response.put("verified", false);
            response.put("pnr", pnr);
            response.put("error", "Ticket record not found for PNR " + pnr);
            return ResponseEntity.status(404).body(response);
        }

        Booking booking = bookingOpt.get();
        ApplicationUser user = booking.getCustomerId() != null
                ? userRepository.findById(booking.getCustomerId()).orElse(null)
                : null;
        Flight flight = booking.getFlightId() != null
                ? flightRepository.findById(booking.getFlightId()).orElse(null)
                : null;

        String passengerName = (user != null && user.getUsername() != null) ? user.getUsername() : "Passenger";
        String flightName = (flight != null && flight.getFlightName() != null) ? flight.getFlightName() : "FL-" + booking.getFlightId();
        String departure = (flight != null && flight.getTakeOffTime() != null) ? flight.getTakeOffTime() : "06:00";

        response.put("verified", true);
        response.put("pnr", pnr.startsWith("NX-") ? pnr : "NX-" + booking.getBookingId());
        response.put("bookingId", booking.getBookingId());
        response.put("passenger", passengerName);
        response.put("flight", flightName);
        response.put("flightId", booking.getFlightId());
        response.put("seat", booking.getSeatType() != null ? booking.getSeatType() + "-12A" : "12A");
        response.put("seatType", booking.getSeatType());
        response.put("origin", booking.getOrigin() != null ? booking.getOrigin() : (flight != null ? flight.getOrigin() : "DEL"));
        response.put("destination", booking.getDestination() != null ? booking.getDestination() : (flight != null ? flight.getDestination() : "BOM"));
        response.put("departure", departure);
        response.put("date", booking.getDate());
        response.put("nop", booking.getNop());
        response.put("totalPrice", booking.getTotalPrice());
        response.put("status", "CONFIRMED");

        return ResponseEntity.ok(response);
    }
}
