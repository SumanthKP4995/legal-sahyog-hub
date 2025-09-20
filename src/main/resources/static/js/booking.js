// Booking Page JavaScript

let currentService = null;
let currentProvider = null;
let selectedTimeSlot = null;
let selectedDate = null;

// Initialize booking page
document.addEventListener('DOMContentLoaded', function() {
    checkAuthentication();
    loadServiceFromURL();
    setupEventListeners();
});

function setupEventListeners() {
    // Date selection
    document.getElementById('bookingDate').addEventListener('change', function() {
        selectedDate = this.value;
        if (selectedDate && currentProvider) {
            loadAvailableTimeSlots();
        }
    });
    
    // Booking form submission
    document.getElementById('bookingForm').addEventListener('submit', handleBookingSubmission);
}

function checkAuthentication() {
    const user = LegalSahyogHub.getCurrentUser();
    if (!user) {
        showAlert('Please login to book a service', 'warning');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        return;
    }
    
    // Update navigation for logged in user
    updateNavigationForLoggedInUser(user);
}

function loadServiceFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const serviceId = urlParams.get('serviceId');
    
    if (!serviceId) {
        showAlert('No service selected', 'error');
        window.location.href = 'services.html';
        return;
    }
    
    loadServiceDetails(serviceId);
}

function loadServiceDetails(serviceId) {
    fetch(`http://localhost:8080/api/services/${serviceId}`)
        .then(response => response.json())
        .then(service => {
            currentService = service;
            displayServiceDetails(service);
            loadProviderDetails(service.provider.id);
        })
        .catch(error => {
            console.error('Error loading service:', error);
            showAlert('Failed to load service details', 'error');
        });
}

function displayServiceDetails(service) {
    document.getElementById('serviceTitle').textContent = service.title;
    document.getElementById('serviceDescription').textContent = service.description || 'No description available';
    document.getElementById('serviceDuration').textContent = `${service.durationMinutes} minutes`;
    document.getElementById('servicePrice').textContent = `₹${service.price}`;
    document.getElementById('serviceId').value = service.id;
    document.getElementById('providerId').value = service.provider.id;
    
    // Show service details card
    document.getElementById('serviceDetailsCard').style.display = 'block';
    
    // Update booking summary
    updateBookingSummary(service.price);
}

function loadProviderDetails(providerId) {
    fetch(`http://localhost:8080/api/public/providers`)
        .then(response => response.json())
        .then(providers => {
            const provider = providers.find(p => p.id === providerId);
            if (provider) {
                currentProvider = provider;
                displayProviderDetails(provider);
            }
        })
        .catch(error => {
            console.error('Error loading provider:', error);
        });
}

function displayProviderDetails(provider) {
    document.getElementById('providerName').textContent = `${provider.firstName} ${provider.lastName}`;
    document.getElementById('providerLocation').textContent = provider.city || 'Online Consultation';
    document.getElementById('providerFullName').textContent = `${provider.firstName} ${provider.lastName}`;
    document.getElementById('providerPracticeArea').textContent = provider.practiceArea || 'Legal Services';
    document.getElementById('providerExperience').textContent = `${provider.experienceYears || 0}+ years`;
    document.getElementById('providerSessions').textContent = `${provider.totalSessions || 0}+ sessions`;
    
    // Show provider info card
    document.getElementById('providerInfoCard').style.display = 'block';
}

function loadAvailableTimeSlots() {
    if (!selectedDate || !currentProvider) return;
    
    const timeSlotsContainer = document.getElementById('timeSlotsContainer');
    timeSlotsContainer.innerHTML = `
        <div class="col-12 text-center">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-2 text-muted">Loading available slots...</p>
        </div>
    `;
    
    fetch(`http://localhost:8080/api/bookings/available-slots/${currentProvider.id}?date=${selectedDate}`)
        .then(response => response.json())
        .then(timeSlots => {
            displayTimeSlots(timeSlots);
        })
        .catch(error => {
            console.error('Error loading time slots:', error);
            timeSlotsContainer.innerHTML = `
                <div class="col-12 text-center text-muted">
                    <i class="fas fa-exclamation-triangle fa-2x mb-2"></i>
                    <p>Failed to load time slots. Please try again.</p>
                </div>
            `;
        });
}

function displayTimeSlots(timeSlots) {
    const timeSlotsContainer = document.getElementById('timeSlotsContainer');
    
    if (timeSlots.length === 0) {
        timeSlotsContainer.innerHTML = `
            <div class="col-12 text-center text-muted">
                <i class="fas fa-calendar-times fa-2x mb-2"></i>
                <p>No available slots for this date. Please select another date.</p>
            </div>
        `;
        return;
    }
    
    const slotsHTML = timeSlots.map(slot => {
        const timeStr = slot.substring(0, 5); // Format as HH:MM
        const endTime = new Date(`2000-01-01T${slot}`);
        endTime.setHours(endTime.getHours() + 1);
        const endTimeStr = endTime.toTimeString().substring(0, 5);
        
        return `
            <div class="col-md-4 col-sm-6">
                <button type="button" class="btn btn-outline-primary w-100 time-slot-btn" 
                        data-time="${slot}" onclick="selectTimeSlot('${slot}')">
                    <i class="fas fa-clock me-1"></i>
                    ${timeStr} - ${endTimeStr}
                </button>
            </div>
        `;
    }).join('');
    
    timeSlotsContainer.innerHTML = slotsHTML;
}

function selectTimeSlot(time) {
    selectedTimeSlot = time;
    
    // Update button states
    document.querySelectorAll('.time-slot-btn').forEach(btn => {
        btn.classList.remove('btn-primary');
        btn.classList.add('btn-outline-primary');
    });
    
    // Highlight selected slot
    const selectedBtn = document.querySelector(`[data-time="${time}"]`);
    if (selectedBtn) {
        selectedBtn.classList.remove('btn-outline-primary');
        selectedBtn.classList.add('btn-primary');
    }
    
    // Enable form submission
    document.querySelector('button[type="submit"]').disabled = false;
}

function updateBookingSummary(servicePrice) {
    const platformFee = servicePrice * 0.15;
    const totalAmount = servicePrice;
    
    document.getElementById('summaryServiceFee').textContent = `₹${servicePrice}`;
    document.getElementById('summaryPlatformFee').textContent = `₹${platformFee.toFixed(2)}`;
    document.getElementById('summaryTotalAmount').textContent = `₹${totalAmount}`;
}

function handleBookingSubmission(event) {
    event.preventDefault();
    
    if (!selectedTimeSlot) {
        showAlert('Please select a time slot', 'warning');
        return;
    }
    
    const user = LegalSahyogHub.getCurrentUser();
    if (!user) {
        showAlert('Please login to continue', 'error');
        return;
    }
    
    const formData = new FormData(event.target);
    const bookingData = {
        userId: user.id,
        providerId: parseInt(formData.get('providerId')),
        serviceId: parseInt(formData.get('serviceId')),
        bookingDate: formData.get('bookingDate'),
        startTime: selectedTimeSlot,
        endTime: calculateEndTime(selectedTimeSlot),
        notes: formData.get('notes')
    };
    
    const submitButton = event.target.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    
    submitButton.innerHTML = '<span class="spinner"></span> Creating Booking...';
    submitButton.disabled = true;
    
    fetch('http://localhost:8080/api/bookings', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${LegalSahyogHub.getAuthToken()}`
        },
        body: JSON.stringify(bookingData)
    })
    .then(response => response.json())
    .then(booking => {
        showAlert('Booking created successfully! Redirecting to payment...', 'success');
        setTimeout(() => {
            window.location.href = `payment.html?bookingId=${booking.id}`;
        }, 2000);
    })
    .catch(error => {
        console.error('Error creating booking:', error);
        showAlert('Failed to create booking. Please try again.', 'error');
    })
    .finally(() => {
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
    });
}

function calculateEndTime(startTime) {
    const start = new Date(`2000-01-01T${startTime}`);
    start.setHours(start.getHours() + 1);
    return start.toTimeString().substring(0, 8);
}

function updateNavigationForLoggedInUser(user) {
    const authNav = document.getElementById('authNav');
    if (authNav) {
        authNav.innerHTML = `
            <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                    <i class="fas fa-user me-1"></i>${user.firstName}
                </a>
                <ul class="dropdown-menu">
                    <li><a class="dropdown-item" href="${user.role.toLowerCase()}-dashboard.html">
                        <i class="fas fa-tachometer-alt me-2"></i>Dashboard
                    </a></li>
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item" href="#" onclick="LegalSahyogHub.logout()">
                        <i class="fas fa-sign-out-alt me-2"></i>Logout
                    </a></li>
                </ul>
            </li>
        `;
    }
}

function showAlert(message, type = 'info') {
    const alertContainer = document.getElementById('alertContainer');
    if (!alertContainer) return;
    
    const alertId = 'alert-' + Date.now();
    const alertHTML = `
        <div id="${alertId}" class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    
    alertContainer.insertAdjacentHTML('beforeend', alertHTML);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        const alert = document.getElementById(alertId);
        if (alert) {
            alert.remove();
        }
    }, 5000);
}

// Set minimum date to today
document.addEventListener('DOMContentLoaded', function() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('bookingDate').setAttribute('min', today);
});
