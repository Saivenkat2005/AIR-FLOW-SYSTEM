package com.airlines.repository;

import com.airlines.entity.ManifestRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ManifestRecordRepository extends JpaRepository<ManifestRecord, Long> {
    List<ManifestRecord> findByFlightIdAndStatus(Long flightId, String status);
    Optional<ManifestRecord> findByBookingId(Long bookingId);
}
