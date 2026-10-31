package com.airlines.service.impl;

import java.util.List;
import java.util.Objects;

import com.airlines.repository.BookingRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import com.airlines.entity.ApplicationUser;
import com.airlines.repository.UserRepository;

@Service
@SuppressWarnings("null")
public class UserService {
    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;

    public UserService(UserRepository userRepository, BookingRepository bookingRepository) {
        this.userRepository = userRepository;
        this.bookingRepository = bookingRepository;
    }
    
    public ApplicationUser getUserById(Long userId) {
        return userRepository.findById(java.util.Objects.requireNonNull(userId)).get();
    }
    
    public List<ApplicationUser> getAllUsers() {
        return userRepository.findAll();
    }
    
    public ApplicationUser updateUserById(ApplicationUser applicationUser, Long userId) {
        ApplicationUser applicationUserDB = userRepository.findById(java.util.Objects.requireNonNull(userId)).get();
        if (Objects.nonNull(applicationUser.getUsername()) && !"".equalsIgnoreCase(applicationUser.getUsername()))
            applicationUserDB.setUsername(applicationUser.getUsername());
        if (Objects.nonNull(applicationUser.getUserEmail()) && !"".equalsIgnoreCase(applicationUser.getUserEmail()))
            applicationUserDB.setUserEmail(applicationUser.getUserEmail());
        if (Objects.nonNull(applicationUser.getUserPhno()) && !"".equalsIgnoreCase(applicationUser.getUserPhno()))
            applicationUserDB.setUserPhno(applicationUser.getUserPhno());
        return userRepository.save(java.util.Objects.requireNonNull(applicationUserDB));
    }
    
    @Transactional
    public void deleteUserById(Long userId) {
        bookingRepository.deleteAllBookingsByCustomerId(userId);
        userRepository.deleteById(java.util.Objects.requireNonNull(userId));
    }
}
