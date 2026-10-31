package com.airlines.payload.request;
import java.util.Set;
import jakarta.validation.constraints.*;
public class SignupRequest {
    @NotBlank @Size(max = 50) private String username;
    @NotBlank @Size(max = 50) @Email private String email;
    private Set<String> role;
    @NotBlank @Size(min = 6, max = 40) private String password;
    @Size(max=10, min=10) private String phone;
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public Set<String> getRole() { return this.role; }
    public void setRole(Set<String> role) { this.role = role; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
}