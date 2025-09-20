package com.legalsahyog.legalsahyoghub.service;

import com.legalsahyog.legalsahyoghub.entity.Booking;
import com.legalsahyog.legalsahyoghub.entity.Provider;
import com.legalsahyog.legalsahyoghub.entity.Service;
import com.legalsahyog.legalsahyoghub.entity.User;
import com.legalsahyog.legalsahyoghub.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Service
public class BookingService {
    
    @Autowired
    private BookingRepository bookingRepository;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private ProviderService providerService;
    
    @Autowired
    private ServiceService serviceService;
    
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }
    
    public Optional<Booking> getBookingById(Long id) {
        return bookingRepository.findById(id);
    }
    
    public List<Booking> getBookingsByUser(User user) {
        return bookingRepository.findByUser(user);
    }
    
    public List<Booking> getBookingsByProvider(Provider provider) {
        return bookingRepository.findByProvider(provider);
    }
    
    public List<Booking> getBookingsByUserAndStatus(User user, Booking.BookingStatus status) {
        return bookingRepository.findByUserAndStatus(user, status);
    }
    
    public List<Booking> getBookingsByProviderAndStatus(Provider provider, Booking.BookingStatus status) {
        return bookingRepository.findByProviderAndStatus(provider, status);
    }
    
    public List<Booking> getActiveBookingsByProviderAndDate(Provider provider, LocalDate date) {
        return bookingRepository.findActiveBookingsByProviderAndDate(provider, date);
    }
    
    public List<Booking> getConfirmedBookingsByDate(LocalDate date) {
        return bookingRepository.findConfirmedBookingsByDate(date);
    }
    
    public Booking createBooking(Long userId, Long providerId, Long serviceId, 
                                LocalDate bookingDate, LocalTime startTime, LocalTime endTime, 
                                String notes) {
        
        User user = userService.getUserById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Provider provider = providerService.getProviderById(providerId)
                .orElseThrow(() -> new RuntimeException("Provider not found"));
        
        Service service = serviceService.getServiceById(serviceId)
                .orElseThrow(() -> new RuntimeException("Service not found"));
        
        // Check for conflicts
        List<Booking> conflicts = bookingRepository.findConflictingBookings(provider, bookingDate, startTime);
        if (!conflicts.isEmpty()) {
            throw new RuntimeException("Time slot is not available");
        }
        
        // Calculate amounts (platform fee is 15% of service price)
        BigDecimal totalAmount = service.getPrice();
        BigDecimal platformFee = totalAmount.multiply(new BigDecimal("0.15"));
        BigDecimal providerEarnings = totalAmount.subtract(platformFee);
        
        Booking booking = new Booking();
        booking.setUser(user);
        booking.setProvider(provider);
        booking.setService(service);
        booking.setBookingDate(bookingDate);
        booking.setStartTime(startTime);
        booking.setEndTime(endTime);
        booking.setNotes(notes);
        booking.setTotalAmount(totalAmount);
        booking.setPlatformFee(platformFee);
        booking.setProviderEarnings(providerEarnings);
        booking.setStatus(Booking.BookingStatus.PENDING);
        
        return bookingRepository.save(booking);
    }
    
    public Booking updateBookingStatus(Long id, Booking.BookingStatus status) {
        Optional<Booking> bookingOptional = bookingRepository.findById(id);
        if (bookingOptional.isPresent()) {
            Booking booking = bookingOptional.get();
            booking.setStatus(status);
            
            // Generate meeting link if confirmed
            if (status == Booking.BookingStatus.CONFIRMED) {
                booking.setMeetingLink(generateMeetingLink(booking));
            }
            
            return bookingRepository.save(booking);
        }
        throw new RuntimeException("Booking not found with id: " + id);
    }
    
    public Booking confirmBooking(Long id) {
        return updateBookingStatus(id, Booking.BookingStatus.CONFIRMED);
    }
    
    public Booking completeBooking(Long id) {
        Booking booking = updateBookingStatus(id, Booking.BookingStatus.COMPLETED);
        
        // Update provider statistics
        providerService.incrementSessionCount(booking.getProvider().getId());
        providerService.updateEarnings(booking.getProvider().getId(), booking.getProviderEarnings());
        
        return booking;
    }
    
    public Booking cancelBooking(Long id) {
        return updateBookingStatus(id, Booking.BookingStatus.CANCELLED);
    }
    
    public void deleteBooking(Long id) {
        bookingRepository.deleteById(id);
    }
    
    public List<LocalTime> getAvailableTimeSlots(Long providerId, LocalDate date) {
        Provider provider = providerService.getProviderById(providerId)
                .orElseThrow(() -> new RuntimeException("Provider not found"));
        
        // Get existing bookings for the date
        List<Booking> existingBookings = getActiveBookingsByProviderAndDate(provider, date);
        
        // Generate available time slots (9 AM to 6 PM, 1-hour slots)
        List<LocalTime> availableSlots = List.of(
            LocalTime.of(9, 0), LocalTime.of(10, 0), LocalTime.of(11, 0),
            LocalTime.of(12, 0), LocalTime.of(14, 0), LocalTime.of(15, 0),
            LocalTime.of(16, 0), LocalTime.of(17, 0)
        );
        
        // Filter out booked slots
        return availableSlots.stream()
                .filter(slot -> existingBookings.stream()
                        .noneMatch(booking -> booking.getStartTime().equals(slot)))
                .toList();
    }
    
    private String generateMeetingLink(Booking booking) {
        // Generate a unique meeting room ID
        String roomId = "legal-" + booking.getId() + "-" + System.currentTimeMillis();
        return "https://meet.jit.si/" + roomId;
    }
}
