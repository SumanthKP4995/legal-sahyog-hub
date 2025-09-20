package com.legalsahyog.legalsahyoghub.controller;

import com.legalsahyog.legalsahyoghub.entity.Service;
import com.legalsahyog.legalsahyoghub.entity.ServiceCategory;
import com.legalsahyog.legalsahyoghub.service.ServiceCategoryService;
import com.legalsahyog.legalsahyoghub.service.ServiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/services")
@CrossOrigin(origins = "*")
public class ServiceController {
    
    @Autowired
    private ServiceService serviceService;
    
    @Autowired
    private ServiceCategoryService serviceCategoryService;
    
    @GetMapping
    public ResponseEntity<List<Service>> getAllServices() {
        List<Service> services = serviceService.getAvailableServices();
        return ResponseEntity.ok(services);
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<Service>> searchServices(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) String practiceArea) {
        
        List<Service> services;
        
        if (keyword != null && !keyword.trim().isEmpty()) {
            services = serviceService.searchServicesByKeyword(keyword);
        } else if (categoryId != null) {
            ServiceCategory category = serviceCategoryService.getCategoryById(categoryId).orElse(null);
            if (category != null) {
                services = serviceService.getServicesByCategory(category);
            } else {
                services = serviceService.getAvailableServices();
            }
        } else if (city != null && !city.trim().isEmpty()) {
            services = serviceService.getServicesByProviderCity(city);
        } else if (minPrice != null && maxPrice != null) {
            services = serviceService.getServicesByPriceRange(minPrice, maxPrice);
        } else {
            services = serviceService.getAvailableServices();
        }
        
        return ResponseEntity.ok(services);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Service> getServiceById(@PathVariable Long id) {
        return serviceService.getServiceById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<Service> createService(@RequestBody Service service) {
        try {
            // Get current provider from authentication
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String email = auth.getName();
            
            // In a real implementation, you would get the provider by email
            // For now, we'll assume the service has the provider set
            Service createdService = serviceService.createService(service);
            return ResponseEntity.ok(createdService);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Service> updateService(@PathVariable Long id, @RequestBody Service service) {
        try {
            Service updatedService = serviceService.updateService(id, service);
            return ResponseEntity.ok(updatedService);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteService(@PathVariable Long id) {
        try {
            serviceService.deleteService(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/{id}/toggle-availability")
    public ResponseEntity<Service> toggleServiceAvailability(@PathVariable Long id) {
        try {
            Service service = serviceService.toggleServiceAvailability(id);
            return ResponseEntity.ok(service);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/provider/{providerId}")
    public ResponseEntity<List<Service>> getServicesByProvider(@PathVariable Long providerId) {
        // In a real implementation, you would get the provider by ID
        // For now, return empty list
        return ResponseEntity.ok(List.of());
    }
}
