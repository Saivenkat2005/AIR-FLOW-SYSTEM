package com.airlines.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.airlines.entity.Flight;

public interface FlightRepository extends JpaRepository<Flight, Long> {
}
