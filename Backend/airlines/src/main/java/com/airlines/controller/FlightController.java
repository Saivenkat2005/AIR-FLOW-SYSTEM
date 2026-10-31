package com.airlines.controller;

import org.springframework.web.bind.annotation.*;

import com.airlines.entity.Flight;
import com.airlines.service.FlightService;

import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/flights")
@CrossOrigin("*")
public class FlightController {

    private final FlightService flightService;

    public FlightController(FlightService flightService) {
        this.flightService = flightService;
    }

    @PostMapping("/add")
    public Flight insertFlight(@Valid @RequestBody Flight flight) {
        System.out.println("Here");
        return flightService.insertFlight(flight);
    }

    @GetMapping("/all")
    public List<Flight> getAllFlights() {
        return flightService.getAllFlights();
    }

    @GetMapping("/all/{flightId}")
    public Flight getFlightById(@PathVariable("flightId") Long flightId) {
        return flightService.getFlightById(flightId);
    }

    @DeleteMapping("/delete/{flightId}")
    public String deleteFlightById(@PathVariable("flightId") Long flightId) {
        flightService.deleteFlightById(flightId);
        return "Flight record deleted";
    }

    @PutMapping("/update")
    public Flight updateFlightById(@Valid @RequestBody Flight flight) {
        return flightService.updateFlightById(flight, flight.getFlightId());
    }
}
