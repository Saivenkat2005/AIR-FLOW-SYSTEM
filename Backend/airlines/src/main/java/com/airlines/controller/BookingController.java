package com.airlines.controller;

import com.airlines.handlers.ResourceNotAvailableException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.airlines.dto.BookingDto;
import com.airlines.entity.Booking;
import com.airlines.service.BookingService;

import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/booking")
@CrossOrigin("*")
public class BookingController {
    @Autowired
    private BookingService bookingService;

    @PostMapping("/add")
    public Booking addBooking(@Valid @RequestBody Booking booking) throws ResourceNotAvailableException {
        return bookingService.addBooking(booking);
    }

    @GetMapping("/get")
    public List<BookingDto> getBookings() {
        return bookingService.getBookings();
    }

    @GetMapping("/getbooking/{bookingId}")
    public BookingDto getBookingById(@PathVariable("bookingId") Long bookingId) {
        return bookingService.getBookingById(bookingId);
    }

    @GetMapping("/get/{customerId}")
    public List<BookingDto> getBookingByUserId(@PathVariable("customerId") Long customerId) {
        return bookingService.getBookingByUserId(customerId);
    }

    @PutMapping("/update")
    public Booking updateBookingById(@Valid @RequestBody Booking booking) {
        return bookingService.updateBookingById(booking, booking.getBookingId());
    }

    @DeleteMapping("/delete/{bookingId}")
    public String deleteBookingById(@PathVariable("bookingId") Long bookingId) {
        bookingService.deleteBookingById(bookingId);
        return "Booking deleted";
    }
}
