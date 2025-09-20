package com.legalsahyog.legalsahyoghub.controller;

import com.legalsahyog.legalsahyoghub.entity.Booking;
import com.legalsahyog.legalsahyoghub.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {
    
    @Autowired
    private BookingService bookingService;
    
    @GetMapping
    public ResponseEntity<List<Booking>> getAllBookings() {
        List<Booking> bookings = bookingService.getAllBookings();
        return ResponseEntity.ok(bookings);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Booking> getBookingById(@PathVariable Long id) {
        return bookingService.getBookingById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/user")
    public ResponseEntity<List<Booking>> getUserBookings() {
        // In a real implementation, you would get the user from authentication
        // For now, return empty list
        return ResponseEntity.ok(List.of());
    }
    
    @GetMapping("/provider")
    public ResponseEntity<List<Booking>> getProviderBookings() {
        // In a real implementation, you would get the provider from authentication
        // For now, return empty list
        return ResponseEntity.ok(List.of());
    }
    
    @GetMapping("/available-slots/{providerId}")
    public ResponseEntity<List<LocalTime>> getAvailableTimeSlots(
            @PathVariable Long providerId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        try {
            List<LocalTime> slots = bookingService.getAvailableTimeSlots(providerId, date);
            return ResponseEntity.ok(slots);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping
    public ResponseEntity<Booking> createBooking(@RequestBody Map<String, Object> bookingData) {
        try {
            Long userId = Long.valueOf(bookingData.get("userId").toString());
            Long providerId = Long.valueOf(bookingData.get("providerId").toString());
            Long serviceId = Long.valueOf(bookingData.get("serviceId").toString());
            LocalDate bookingDate = LocalDate.parse(bookingData.get("bookingDate").toString());
            LocalTime startTime = LocalTime.parse(bookingData.get("startTime").toString());
            LocalTime endTime = LocalTime.parse(bookingData.get("endTime").toString());
            String notes = bookingData.get("notes") != null ? bookingData.get("notes").toString() : "";
            
            Booking booking = bookingService.createBooking(
                userId, providerId, serviceId, bookingDate, startTime, endTime, notes
            );
            
            return ResponseEntity.ok(booking);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/{id}/confirm")
    public ResponseEntity<Booking> confirmBooking(@PathVariable Long id) {
        try {
            Booking booking = bookingService.confirmBooking(id);
            return ResponseEntity.ok(booking);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/{id}/complete")
    public ResponseEntity<Booking> completeBooking(@PathVariable Long id) {
        try {
            Booking booking = bookingService.completeBooking(id);
            return ResponseEntity.ok(booking);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/{id}/cancel")
    public ResponseEntity<Booking> cancelBooking(@PathVariable Long id) {
        try {
            Booking booking = bookingService.cancelBooking(id);
            return ResponseEntity.ok(booking);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/{id}/status")
    public ResponseEntity<Booking> updateBookingStatus(
            @PathVariable Long id, 
            @RequestBody Map<String, String> statusData) {
        try {
            Booking.BookingStatus status = Booking.BookingStatus.valueOf(statusData.get("status"));
            Booking booking = bookingService.updateBookingStatus(id, status);
            return ResponseEntity.ok(booking);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBooking(@PathVariable Long id) {
        try {
            bookingService.deleteBooking(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
