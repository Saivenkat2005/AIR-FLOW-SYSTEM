package com.airlines.repository;

import com.airlines.entity.BumpCompensation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BumpCompensationRepository extends JpaRepository<BumpCompensation, Long> {
}
