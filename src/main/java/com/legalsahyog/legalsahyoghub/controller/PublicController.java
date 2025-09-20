package com.legalsahyog.legalsahyoghub.controller;

import com.legalsahyog.legalsahyoghub.entity.Provider;
import com.legalsahyog.legalsahyoghub.entity.ServiceCategory;
import com.legalsahyog.legalsahyoghub.service.ProviderService;
import com.legalsahyog.legalsahyoghub.service.ServiceCategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/public")
@CrossOrigin(origins = "*")
public class PublicController {
    
    @Autowired
    private ServiceCategoryService serviceCategoryService;
    
    @Autowired
    private ProviderService providerService;
    
    @GetMapping("/categories")
    public ResponseEntity<List<ServiceCategory>> getPublicCategories() {
        List<ServiceCategory> categories = serviceCategoryService.getActiveCategories();
        return ResponseEntity.ok(categories);
    }
    
    @GetMapping("/providers")
    public ResponseEntity<List<Provider>> getPublicProviders() {
        List<Provider> providers = providerService.getVerifiedProviders();
        return ResponseEntity.ok(providers);
    }
    
    @GetMapping("/providers/top-rated")
    public ResponseEntity<List<Provider>> getTopRatedProviders() {
        List<Provider> providers = providerService.getTopRatedProviders();
        return ResponseEntity.ok(providers);
    }
    
    @GetMapping("/providers/experienced")
    public ResponseEntity<List<Provider>> getMostExperiencedProviders() {
        List<Provider> providers = providerService.getMostExperiencedProviders();
        return ResponseEntity.ok(providers);
    }
    
    @GetMapping("/providers/city/{city}")
    public ResponseEntity<List<Provider>> getProvidersByCity(@PathVariable String city) {
        List<Provider> providers = providerService.getProvidersByCity(city);
        return ResponseEntity.ok(providers);
    }
    
    @GetMapping("/providers/state/{state}")
    public ResponseEntity<List<Provider>> getProvidersByState(@PathVariable String state) {
        List<Provider> providers = providerService.getProvidersByState(state);
        return ResponseEntity.ok(providers);
    }
    
    @GetMapping("/providers/practice-area/{practiceArea}")
    public ResponseEntity<List<Provider>> getProvidersByPracticeArea(@PathVariable String practiceArea) {
        List<Provider> providers = providerService.getProvidersByPracticeArea(practiceArea);
        return ResponseEntity.ok(providers);
    }
}
