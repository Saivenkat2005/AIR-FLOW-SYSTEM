package com.airlines.entity;

import java.util.ArrayList;
import java.util.List;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "users")
public class ApplicationUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;
    
    @Column(unique = true)
    private String username;
    
    @Email
    private String userEmail;
    
    @Size(max=10,min=10)
    private String userPhno;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "user_role_junction", joinColumns = { @JoinColumn(name = "user_id") }, inverseJoinColumns = {
            @JoinColumn(name = "role_id") })
    private List<Role> authorities;

    public ApplicationUser() {
        super();
        authorities = new ArrayList<>();
    }

    public ApplicationUser(Long userId, String username, String userEmail, String userPhno,
                           List<Role> authorities) {
        super();
        this.userId = userId;
        this.username = username;
        this.userEmail = userEmail;
        this.userPhno = userPhno;
        this.authorities = authorities;
    }

    public Long getUserId() {
        return this.userId;
    }

    public void setId(Long userId) {
        this.userId = userId;
    }

    public List<Role> getAuthorities() {
        return this.authorities;
    }

    public void setAuthorities(List<Role> authorities) {
        this.authorities = authorities;
    }

    public String getUsername() {
        return this.username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getUserEmail() {
        return this.userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getUserPhno() {
        return this.userPhno;
    }

    public void setUserPhno(String userPhno) {
        this.userPhno = userPhno;
    }
}
