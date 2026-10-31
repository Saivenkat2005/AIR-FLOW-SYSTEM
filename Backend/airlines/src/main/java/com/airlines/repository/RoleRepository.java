package com.airlines.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.airlines.entity.Role;

public interface RoleRepository extends JpaRepository<Role, Integer> {
    Optional<Role> findByAuthority(String authority);
}
