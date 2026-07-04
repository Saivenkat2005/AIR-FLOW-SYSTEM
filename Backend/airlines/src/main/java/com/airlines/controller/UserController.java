package com.airlines.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.airlines.entity.ApplicationUser;
import com.airlines.service.impl.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/user")
@CrossOrigin("*")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/userbyid/{userid}")
    public ResponseEntity<ApplicationUser> getUserById(@PathVariable("userid") Long userId) {
        ApplicationUser user =  userService.getUserById(userId);
        return new ResponseEntity<>(user,HttpStatus.OK);
    }

    @GetMapping("/getallusers")
    public ResponseEntity<List<ApplicationUser>> getAllUsers() {
        List<ApplicationUser> user =  userService.getAllUsers();
        return new ResponseEntity<>(user,HttpStatus.OK);
    }

    @PutMapping("/update")
    public ResponseEntity<ApplicationUser> updateUserById(@Valid @RequestBody ApplicationUser applicationUser){
        ApplicationUser user=userService.updateUserById(applicationUser,applicationUser.getUserId());
        return new ResponseEntity<>(user,HttpStatus.OK);
    }

    @DeleteMapping("/delete/{userid}")
    public ResponseEntity<String> deleteUserById(@PathVariable("userid") Long userId){
        userService.deleteUserById(userId);
        return new ResponseEntity<>("User deleted!",HttpStatus.OK);
    }

}
