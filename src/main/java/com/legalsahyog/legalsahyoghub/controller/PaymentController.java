package com.legalsahyog.legalsahyoghub.controller;

import com.legalsahyog.legalsahyoghub.entity.Payment;
import com.legalsahyog.legalsahyoghub.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*")
public class PaymentController {
    
    @Autowired
    private PaymentService paymentService;
    
    @GetMapping
    public ResponseEntity<List<Payment>> getAllPayments() {
        List<Payment> payments = paymentService.getAllPayments();
        return ResponseEntity.ok(payments);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Payment> getPaymentById(@PathVariable Long id) {
        return paymentService.getPaymentById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/user")
    public ResponseEntity<List<Payment>> getUserPayments() {
        // In a real implementation, you would get the user from authentication
        // For now, return empty list
        return ResponseEntity.ok(List.of());
    }
    
    @GetMapping("/provider")
    public ResponseEntity<List<Payment>> getProviderPayments() {
        // In a real implementation, you would get the provider from authentication
        // For now, return empty list
        return ResponseEntity.ok(List.of());
    }
    
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Payment>> getPaymentsByStatus(@PathVariable String status) {
        try {
            Payment.PaymentStatus paymentStatus = Payment.PaymentStatus.valueOf(status.toUpperCase());
            List<Payment> payments = paymentService.getPaymentsByStatus(paymentStatus);
            return ResponseEntity.ok(payments);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping
    public ResponseEntity<Payment> createPayment(@RequestBody Map<String, Object> paymentData) {
        try {
            Long bookingId = Long.valueOf(paymentData.get("bookingId").toString());
            Payment.PaymentMethod paymentMethod = Payment.PaymentMethod.valueOf(
                paymentData.get("paymentMethod").toString().toUpperCase()
            );
            
            Payment payment = paymentService.createPayment(bookingId, paymentMethod);
            return ResponseEntity.ok(payment);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping("/{id}/process")
    public ResponseEntity<Payment> processPayment(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        try {
            String paymentGatewayResponse = request.get("paymentGatewayResponse");
            Payment payment = paymentService.processPayment(id, paymentGatewayResponse);
            return ResponseEntity.ok(payment);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping("/{id}/refund")
    public ResponseEntity<Payment> refundPayment(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        try {
            String reason = request.get("reason");
            Payment payment = paymentService.refundPayment(id, reason);
            return ResponseEntity.ok(payment);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/provider/{providerId}/earnings")
    public ResponseEntity<BigDecimal> getProviderEarnings(@PathVariable Long providerId) {
        try {
            // In a real implementation, you would get the provider by ID
            // For now, return zero
            return ResponseEntity.ok(BigDecimal.ZERO);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/platform/revenue")
    public ResponseEntity<BigDecimal> getPlatformRevenue(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        try {
            BigDecimal revenue = paymentService.getPlatformRevenueByDateRange(startDate, endDate);
            return ResponseEntity.ok(revenue);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/successful")
    public ResponseEntity<List<Payment>> getSuccessfulPayments(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        try {
            List<Payment> payments = paymentService.getSuccessfulPaymentsByDateRange(startDate, endDate);
            return ResponseEntity.ok(payments);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
