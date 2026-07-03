package com.airlines.handlers;

import com.airlines.entity.Booking;
import lombok.Getter;

@Getter
public class OverbookedException extends RuntimeException {
    private final Booking booking;
    
    public OverbookedException(String message, Booking booking) {
        super(message);
        this.booking = booking;
    }
}
