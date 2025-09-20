package com.legalsahyog.legalsahyoghub.service;

import com.legalsahyog.legalsahyoghub.entity.Provider;
import com.legalsahyog.legalsahyoghub.entity.Service;
import com.legalsahyog.legalsahyoghub.entity.ServiceCategory;
import com.legalsahyog.legalsahyoghub.repository.ServiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class ServiceService {
    
    @Autowired
    private ServiceRepository serviceRepository;
    
    public List<Service> getAllServices() {
        return serviceRepository.findAll();
    }
    
    public List<Service> getAvailableServices() {
        return serviceRepository.findAvailableServicesFromVerifiedProviders();
    }
    
    public Optional<Service> getServiceById(Long id) {
        return serviceRepository.findById(id);
    }
    
    public List<Service> getServicesByProvider(Provider provider) {
        return serviceRepository.findByProviderAndIsAvailableTrue(provider);
    }
    
    public List<Service> getServicesByCategory(ServiceCategory category) {
        return serviceRepository.findAvailableServicesByCategory(category);
    }
    
    public List<Service> getServicesByPriceRange(BigDecimal minPrice, BigDecimal maxPrice) {
        return serviceRepository.findByPriceRange(minPrice, maxPrice);
    }
    
    public List<Service> getServicesByProviderCity(String city) {
        return serviceRepository.findByProviderCity(city);
    }
    
    public List<Service> searchServicesByKeyword(String keyword) {
        return serviceRepository.findByKeyword(keyword);
    }
    
    public Service createService(Service service) {
        return serviceRepository.save(service);
    }
    
    public Service updateService(Long id, Service serviceDetails) {
        Optional<Service> serviceOptional = serviceRepository.findById(id);
        if (serviceOptional.isPresent()) {
            Service service = serviceOptional.get();
            service.setTitle(serviceDetails.getTitle());
            service.setDescription(serviceDetails.getDescription());
            service.setPrice(serviceDetails.getPrice());
            service.setDurationMinutes(serviceDetails.getDurationMinutes());
            service.setIsAvailable(serviceDetails.getIsAvailable());
            service.setLanguages(serviceDetails.getLanguages());
            return serviceRepository.save(service);
        }
        throw new RuntimeException("Service not found with id: " + id);
    }
    
    public void deleteService(Long id) {
        serviceRepository.deleteById(id);
    }
    
    public Service toggleServiceAvailability(Long id) {
        Optional<Service> serviceOptional = serviceRepository.findById(id);
        if (serviceOptional.isPresent()) {
            Service service = serviceOptional.get();
            service.setIsAvailable(!service.getIsAvailable());
            return serviceRepository.save(service);
        }
        throw new RuntimeException("Service not found with id: " + id);
    }
}
