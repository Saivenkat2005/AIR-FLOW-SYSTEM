package com.airlines.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long bookingId;
    private Long customerId;
    private Long flightId;
    private String seatType;
    private String origin;
    private String destination;
    private String date;
    private Long nop;
    private Long totalPrice;
    private String pnr;
    private String ticketEmailStatus;
}
