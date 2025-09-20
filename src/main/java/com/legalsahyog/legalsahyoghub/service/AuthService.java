package com.legalsahyog.legalsahyoghub.service;

import com.legalsahyog.legalsahyoghub.dto.LoginRequest;
import com.legalsahyog.legalsahyoghub.dto.LoginResponse;
import com.legalsahyog.legalsahyoghub.dto.ProviderRegistrationRequest;
import com.legalsahyog.legalsahyoghub.dto.UserRegistrationRequest;
import com.legalsahyog.legalsahyoghub.entity.Admin;
import com.legalsahyog.legalsahyoghub.entity.Provider;
import com.legalsahyog.legalsahyoghub.entity.User;
import com.legalsahyog.legalsahyoghub.repository.AdminRepository;
import com.legalsahyog.legalsahyoghub.repository.ProviderRepository;
import com.legalsahyog.legalsahyoghub.repository.UserRepository;
import com.legalsahyog.legalsahyoghub.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ProviderRepository providerRepository;
    
    @Autowired
    private AdminRepository adminRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    public LoginResponse login(LoginRequest loginRequest) {
        String email = loginRequest.getEmail();
        String password = loginRequest.getPassword();
        
        // Try to authenticate as user
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isPresent() && passwordEncoder.matches(password, user.get().getPassword())) {
            String token = jwtUtil.generateToken(email, "USER", user.get().getId());
            return new LoginResponse(token, "USER", user.get().getId(), 
                user.get().getEmail(), user.get().getFirstName(), user.get().getLastName());
        }
        
        // Try to authenticate as provider
        Optional<Provider> provider = providerRepository.findByEmail(email);
        if (provider.isPresent() && passwordEncoder.matches(password, provider.get().getPassword())) {
            String token = jwtUtil.generateToken(email, "PROVIDER", provider.get().getId());
            return new LoginResponse(token, "PROVIDER", provider.get().getId(), 
                provider.get().getEmail(), provider.get().getFirstName(), provider.get().getLastName());
        }
        
        // Try to authenticate as admin
        Optional<Admin> admin = adminRepository.findByEmail(email);
        if (admin.isPresent() && passwordEncoder.matches(password, admin.get().getPassword())) {
            String role = admin.get().getRole() == Admin.Role.SUPER_ADMIN ? "SUPER_ADMIN" : "ADMIN";
            String token = jwtUtil.generateToken(email, role, admin.get().getId());
            return new LoginResponse(token, role, admin.get().getId(), 
                admin.get().getEmail(), admin.get().getFirstName(), admin.get().getLastName());
        }
        
        throw new RuntimeException("Invalid email or password");
    }
    
    public User registerUser(UserRegistrationRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPhone(request.getPhone());
        user.setAddress(request.getAddress());
        user.setCity(request.getCity());
        user.setState(request.getState());
        user.setPincode(request.getPincode());
        
        return userRepository.save(user);
    }
    
    public Provider registerProvider(ProviderRegistrationRequest request) {
        if (providerRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        
        if (providerRepository.existsByBarCouncilNumber(request.getBarCouncilNumber())) {
            throw new RuntimeException("Bar Council Number already exists");
        }
        
        Provider provider = new Provider();
        provider.setEmail(request.getEmail());
        provider.setPassword(passwordEncoder.encode(request.getPassword()));
        provider.setFirstName(request.getFirstName());
        provider.setLastName(request.getLastName());
        provider.setPhone(request.getPhone());
        provider.setBarCouncilNumber(request.getBarCouncilNumber());
        provider.setPracticeArea(request.getPracticeArea());
        provider.setExperienceYears(request.getExperienceYears());
        provider.setQualification(request.getQualification());
        provider.setBio(request.getBio());
        provider.setAddress(request.getAddress());
        provider.setCity(request.getCity());
        provider.setState(request.getState());
        provider.setPincode(request.getPincode());
        
        return providerRepository.save(provider);
    }
}
