package com.legalsahyog.legalsahyoghub.service;

import com.legalsahyog.legalsahyoghub.entity.Notification;
import com.legalsahyog.legalsahyoghub.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {
    
    @Autowired
    private NotificationRepository notificationRepository;
    
    public List<Notification> getUserNotifications(Long userId) {
        return notificationRepository.findByUserIdAndStatusOrderByCreatedAtDesc(userId, Notification.NotificationStatus.ACTIVE);
    }
    
    public List<Notification> getProviderNotifications(Long providerId) {
        return notificationRepository.findByProviderIdAndStatusOrderByCreatedAtDesc(providerId, Notification.NotificationStatus.ACTIVE);
    }
    
    public List<Notification> getAdminNotifications(Long adminId) {
        return notificationRepository.findByAdminIdAndStatusOrderByCreatedAtDesc(adminId, Notification.NotificationStatus.ACTIVE);
    }
    
    public List<Notification> getUnreadUserNotifications(Long userId) {
        return notificationRepository.findByUserIdAndIsReadFalseAndStatusOrderByCreatedAtDesc(userId, Notification.NotificationStatus.ACTIVE);
    }
    
    public List<Notification> getUnreadProviderNotifications(Long providerId) {
        return notificationRepository.findByProviderIdAndIsReadFalseAndStatusOrderByCreatedAtDesc(providerId, Notification.NotificationStatus.ACTIVE);
    }
    
    public List<Notification> getUnreadAdminNotifications(Long adminId) {
        return notificationRepository.findByAdminIdAndIsReadFalseAndStatusOrderByCreatedAtDesc(adminId, Notification.NotificationStatus.ACTIVE);
    }
    
    public Long getUnreadCountForUser(Long userId) {
        return notificationRepository.countUnreadByUserId(userId, Notification.NotificationStatus.ACTIVE);
    }
    
    public Long getUnreadCountForProvider(Long providerId) {
        return notificationRepository.countUnreadByProviderId(providerId, Notification.NotificationStatus.ACTIVE);
    }
    
    public Long getUnreadCountForAdmin(Long adminId) {
        return notificationRepository.countUnreadByAdminId(adminId, Notification.NotificationStatus.ACTIVE);
    }
    
    public Notification createNotification(String title, String message, Notification.NotificationType type) {
        Notification notification = new Notification(title, message, type);
        return notificationRepository.save(notification);
    }
    
    public Notification createUserNotification(Long userId, String title, String message, Notification.NotificationType type) {
        Notification notification = new Notification(title, message, type);
        notification.setUserId(userId);
        return notificationRepository.save(notification);
    }
    
    public Notification createProviderNotification(Long providerId, String title, String message, Notification.NotificationType type) {
        Notification notification = new Notification(title, message, type);
        notification.setProviderId(providerId);
        return notificationRepository.save(notification);
    }
    
    public Notification createAdminNotification(Long adminId, String title, String message, Notification.NotificationType type) {
        Notification notification = new Notification(title, message, type);
        notification.setAdminId(adminId);
        return notificationRepository.save(notification);
    }
    
    public Notification createRelatedNotification(Long userId, Long providerId, Long adminId, 
                                                 String title, String message, Notification.NotificationType type,
                                                 String relatedEntityType, Long relatedEntityId) {
        Notification notification = new Notification(title, message, type);
        notification.setUserId(userId);
        notification.setProviderId(providerId);
        notification.setAdminId(adminId);
        notification.setRelatedEntityType(relatedEntityType);
        notification.setRelatedEntityId(relatedEntityId);
        return notificationRepository.save(notification);
    }
    
    public Notification markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setIsRead(true);
        return notificationRepository.save(notification);
    }
    
    public void markAllAsReadForUser(Long userId) {
        List<Notification> unreadNotifications = getUnreadUserNotifications(userId);
        unreadNotifications.forEach(notification -> {
            notification.setIsRead(true);
            notificationRepository.save(notification);
        });
    }
    
    public void markAllAsReadForProvider(Long providerId) {
        List<Notification> unreadNotifications = getUnreadProviderNotifications(providerId);
        unreadNotifications.forEach(notification -> {
            notification.setIsRead(true);
            notificationRepository.save(notification);
        });
    }
    
    public void markAllAsReadForAdmin(Long adminId) {
        List<Notification> unreadNotifications = getUnreadAdminNotifications(adminId);
        unreadNotifications.forEach(notification -> {
            notification.setIsRead(true);
            notificationRepository.save(notification);
        });
    }
    
    public Notification archiveNotification(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setStatus(Notification.NotificationStatus.ARCHIVED);
        return notificationRepository.save(notification);
    }
    
    public void deleteNotification(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setStatus(Notification.NotificationStatus.DELETED);
        notificationRepository.save(notification);
    }
    
    public void cleanupExpiredNotifications() {
        List<Notification> expiredNotifications = notificationRepository.findExpiredNotifications(
                LocalDateTime.now(), Notification.NotificationStatus.ACTIVE);
        expiredNotifications.forEach(notification -> {
            notification.setStatus(Notification.NotificationStatus.ARCHIVED);
            notificationRepository.save(notification);
        });
    }
    
    // Specific notification creation methods
    public void notifyBookingConfirmed(Long userId, Long providerId, Long bookingId) {
        createRelatedNotification(userId, providerId, null,
                "Booking Confirmed",
                "Your legal consultation has been confirmed. Please join the meeting at the scheduled time.",
                Notification.NotificationType.BOOKING_CONFIRMED,
                "BOOKING", bookingId);
    }
    
    public void notifyBookingCancelled(Long userId, Long providerId, Long bookingId) {
        createRelatedNotification(userId, providerId, null,
                "Booking Cancelled",
                "Your legal consultation has been cancelled.",
                Notification.NotificationType.BOOKING_CANCELLED,
                "BOOKING", bookingId);
    }
    
    public void notifyPaymentSuccess(Long userId, Long providerId, Long paymentId) {
        createRelatedNotification(userId, providerId, null,
                "Payment Successful",
                "Your payment has been processed successfully.",
                Notification.NotificationType.PAYMENT_SUCCESS,
                "PAYMENT", paymentId);
    }
    
    public void notifyReviewReceived(Long providerId, Long reviewId) {
        createProviderNotification(providerId,
                "New Review Received",
                "You have received a new review from a client.",
                Notification.NotificationType.REVIEW_RECEIVED);
    }
    
    public void notifyProviderVerification(Long providerId, boolean approved) {
        String title = approved ? "Verification Approved" : "Verification Rejected";
        String message = approved ? 
                "Congratulations! Your provider verification has been approved." :
                "Your provider verification has been rejected. Please contact support for more information.";
        
        createProviderNotification(providerId, title, message,
                approved ? Notification.NotificationType.PROVIDER_VERIFIED : Notification.NotificationType.PROVIDER_REJECTED);
    }
}
