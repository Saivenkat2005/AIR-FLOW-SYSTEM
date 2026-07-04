package com.airlines.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Flight {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long flightId;
    @NotBlank
    private String takeOffTime;
    private String flightName;
    private Long totalCapacity = 0L;
    private Long confirmedCount = 0L;
    private String origin;
    private String destination;
    private String arrivalTime;
    private String aircraftType;
    private String status;
}
