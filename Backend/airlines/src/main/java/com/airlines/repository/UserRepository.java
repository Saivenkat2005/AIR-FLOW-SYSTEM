package com.airlines.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

import com.airlines.entity.ApplicationUser;

public interface UserRepository extends JpaRepository<ApplicationUser, Long> {
    Optional<ApplicationUser> findByUsername(String username);
    Optional<ApplicationUser> findByUserEmail(String userEmail);
}
