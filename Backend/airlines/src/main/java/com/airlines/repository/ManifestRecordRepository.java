package com.airlines.repository;

import com.airlines.entity.ManifestRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ManifestRecordRepository extends JpaRepository<ManifestRecord, Long> {
    List<ManifestRecord> findByFlightIdAndStatus(Long flightId, String status);
    Optional<ManifestRecord> findByBookingId(Long bookingId);
}
