package com.airlines.service.impl;

import java.util.List;
import java.util.Objects;

import com.airlines.repository.BookingRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.airlines.entity.ApplicationUser;
import com.airlines.repository.UserRepository;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private BookingRepository bookingRepository;
    
    public ApplicationUser getUserById(Long userId) {
        return userRepository.findById(userId).get();
    }
    
    public List<ApplicationUser> getAllUsers() {
        return userRepository.findAll();
    }
    
    public ApplicationUser updateUserById(ApplicationUser applicationUser, Long userId) {
        ApplicationUser applicationUserDB = userRepository.findById(userId).get();
        if (Objects.nonNull(applicationUser.getUsername()) && !"".equalsIgnoreCase(applicationUser.getUsername()))
            applicationUserDB.setUsername(applicationUser.getUsername());
        if (Objects.nonNull(applicationUser.getUserEmail()) && !"".equalsIgnoreCase(applicationUser.getUserEmail()))
            applicationUserDB.setUserEmail(applicationUser.getUserEmail());
        if (Objects.nonNull(applicationUser.getUserPhno()) && !"".equalsIgnoreCase(applicationUser.getUserPhno()))
            applicationUserDB.setUserPhno(applicationUser.getUserPhno());
        return userRepository.save(applicationUserDB);
    }
    
    @Transactional
    public void deleteUserById(Long userId) {
        bookingRepository.deleteAllBookingsByCustomerId(userId);
        userRepository.deleteById(userId);
    }
}
