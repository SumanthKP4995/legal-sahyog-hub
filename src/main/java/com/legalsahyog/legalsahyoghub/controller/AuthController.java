package com.legalsahyog.legalsahyoghub.controller;

import com.legalsahyog.legalsahyoghub.dto.LoginRequest;
import com.legalsahyog.legalsahyoghub.dto.LoginResponse;
import com.legalsahyog.legalsahyoghub.dto.ProviderRegistrationRequest;
import com.legalsahyog.legalsahyoghub.dto.UserRegistrationRequest;
import com.legalsahyog.legalsahyoghub.entity.Provider;
import com.legalsahyog.legalsahyoghub.entity.User;
import com.legalsahyog.legalsahyoghub.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    
    @Autowired
    private AuthService authService;
    
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            LoginResponse response = authService.login(loginRequest);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping("/register/user")
    public ResponseEntity<User> registerUser(@Valid @RequestBody UserRegistrationRequest request) {
        try {
            User user = authService.registerUser(request);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping("/register/provider")
    public ResponseEntity<Provider> registerProvider(@Valid @RequestBody ProviderRegistrationRequest request) {
        try {
            Provider provider = authService.registerProvider(request);
            return ResponseEntity.ok(provider);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
