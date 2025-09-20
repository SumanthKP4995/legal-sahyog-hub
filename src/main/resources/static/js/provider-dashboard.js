// Provider Dashboard JavaScript

let currentSection = 'dashboard';

// Initialize provider dashboard
document.addEventListener('DOMContentLoaded', function() {
    checkProviderAuthentication();
    loadDashboardData();
    setupEventListeners();
});

function setupEventListeners() {
    // Add any specific event listeners here
}

function checkProviderAuthentication() {
    const user = LegalSahyogHub.getCurrentUser();
    if (!user || user.role !== 'PROVIDER') {
        showAlert('Access denied. Provider privileges required.', 'error');
        window.location.href = 'login.html';
        return;
    }
    
    document.getElementById('providerName').textContent = user.firstName;
}

function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.style.display = 'none';
    });
    
    // Show selected section
    document.getElementById(sectionName + 'Section').style.display = 'block';
    
    // Update navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    document.querySelector(`[href="#${sectionName}"]`).classList.add('active');
    
    currentSection = sectionName;
    
    // Load section-specific data
    switch (sectionName) {
        case 'dashboard':
            loadDashboardData();
            break;
        case 'bookings':
            loadBookingsData();
            break;
        case 'services':
            loadServicesData();
            break;
        case 'availability':
            loadAvailabilityData();
            break;
        case 'earnings':
            loadEarningsData();
            break;
        case 'reviews':
            loadReviewsData();
            break;
        case 'profile':
            loadProfileData();
            break;
    }
}

function loadDashboardData() {
    // Load dashboard statistics
    loadDashboardStats();
    loadRecentBookings();
}

function loadDashboardStats() {
    // Simulate loading dashboard statistics
    setTimeout(() => {
        document.getElementById('totalBookings').textContent = '45';
        document.getElementById('completedSessions').textContent = '38';
        document.getElementById('averageRating').textContent = '4.7';
        document.getElementById('totalEarnings').textContent = '₹1,25,000';
        document.getElementById('monthlyEarnings').textContent = '₹15,500';
    }, 500);
}

function loadRecentBookings() {
    const container = document.getElementById('recentBookings');
    
    // Simulate recent bookings data
    const recentBookings = [
        {
            id: 'BK001',
            client: 'John Doe',
            service: 'Criminal Law Consultation',
            date: '2024-01-15',
            time: '10:00 AM',
            status: 'CONFIRMED'
        },
        {
            id: 'BK002',
            client: 'Jane Smith',
            service: 'Family Law Consultation',
            date: '2024-01-15',
            time: '2:00 PM',
            status: 'PENDING'
        },
        {
            id: 'BK003',
            client: 'Mike Wilson',
            service: 'Corporate Law Consultation',
            date: '2024-01-14',
            time: '11:00 AM',
            status: 'COMPLETED'
        }
    ];
    
    container.innerHTML = recentBookings.map(booking => `
        <div class="booking-card">
            <div class="card-body">
                <div class="row align-items-center">
                    <div class="col-md-6">
                        <h6 class="card-title">${booking.service}</h6>
                        <p class="card-text text-muted mb-1">
                            <i class="fas fa-user me-1"></i>${booking.client}
                        </p>
                        <p class="card-text text-muted mb-0">
                            <i class="fas fa-calendar me-1"></i>${booking.date} at ${booking.time}
                        </p>
                    </div>
                    <div class="col-md-3">
                        <span class="status-badge status-${booking.status.toLowerCase()}">${booking.status}</span>
                    </div>
                    <div class="col-md-3 text-end">
                        <div class="btn-group btn-group-sm">
                            <button class="btn btn-outline-primary" onclick="viewBooking('${booking.id}')">
                                <i class="fas fa-eye"></i>
                            </button>
                            ${booking.status === 'PENDING' ? `
                                <button class="btn btn-outline-success" onclick="confirmBooking('${booking.id}')">
                                    <i class="fas fa-check"></i>
                                </button>
                            ` : ''}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function loadBookingsData() {
    const container = document.getElementById('bookingsList');
    
    // Simulate bookings data
    const bookings = [
        {
            id: 'BK001',
            client: 'John Doe',
            service: 'Criminal Law Consultation',
            date: '2024-01-15',
            time: '10:00 AM',
            status: 'CONFIRMED',
            amount: '₹2,500'
        },
        {
            id: 'BK002',
            client: 'Jane Smith',
            service: 'Family Law Consultation',
            date: '2024-01-15',
            time: '2:00 PM',
            status: 'PENDING',
            amount: '₹3,000'
        },
        {
            id: 'BK003',
            client: 'Mike Wilson',
            service: 'Corporate Law Consultation',
            date: '2024-01-14',
            time: '11:00 AM',
            status: 'COMPLETED',
            amount: '₹4,000'
        }
    ];
    
    container.innerHTML = bookings.map(booking => `
        <div class="booking-card">
            <div class="card-body">
                <div class="row align-items-center">
                    <div class="col-md-3">
                        <h6 class="card-title">${booking.service}</h6>
                        <p class="card-text text-muted mb-0">
                            <i class="fas fa-user me-1"></i>${booking.client}
                        </p>
                    </div>
                    <div class="col-md-2">
                        <p class="card-text mb-0">
                            <i class="fas fa-calendar me-1"></i>${booking.date}
                        </p>
                        <p class="card-text mb-0">
                            <i class="fas fa-clock me-1"></i>${booking.time}
                        </p>
                    </div>
                    <div class="col-md-2">
                        <span class="status-badge status-${booking.status.toLowerCase()}">${booking.status}</span>
                    </div>
                    <div class="col-md-2">
                        <strong>${booking.amount}</strong>
                    </div>
                    <div class="col-md-3 text-end">
                        <div class="btn-group btn-group-sm">
                            <button class="btn btn-outline-primary" onclick="viewBooking('${booking.id}')">
                                <i class="fas fa-eye"></i>
                            </button>
                            ${booking.status === 'PENDING' ? `
                                <button class="btn btn-outline-success" onclick="confirmBooking('${booking.id}')">
                                    <i class="fas fa-check"></i>
                                </button>
                                <button class="btn btn-outline-danger" onclick="rejectBooking('${booking.id}')">
                                    <i class="fas fa-times"></i>
                                </button>
                            ` : ''}
                            ${booking.status === 'CONFIRMED' ? `
                                <button class="btn btn-outline-info" onclick="startConsultation('${booking.id}')">
                                    <i class="fas fa-video"></i>
                                </button>
                            ` : ''}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function loadServicesData() {
    const container = document.getElementById('servicesList');
    
    // Simulate services data
    const services = [
        {
            id: 1,
            title: 'Criminal Law Consultation',
            description: 'Expert advice on criminal law matters',
            price: '₹2,500',
            duration: '60 minutes',
            status: 'ACTIVE'
        },
        {
            id: 2,
            title: 'Family Law Consultation',
            description: 'Comprehensive family law guidance',
            price: '₹3,000',
            duration: '90 minutes',
            status: 'ACTIVE'
        },
        {
            id: 3,
            title: 'Corporate Law Consultation',
            description: 'Business law and corporate matters',
            price: '₹4,000',
            duration: '120 minutes',
            status: 'INACTIVE'
        }
    ];
    
    container.innerHTML = services.map(service => `
        <div class="card mb-3">
            <div class="card-body">
                <div class="row align-items-center">
                    <div class="col-md-6">
                        <h5 class="card-title">${service.title}</h5>
                        <p class="card-text text-muted">${service.description}</p>
                    </div>
                    <div class="col-md-2">
                        <strong>${service.price}</strong>
                    </div>
                    <div class="col-md-2">
                        <span class="text-muted">${service.duration}</span>
                    </div>
                    <div class="col-md-2">
                        <span class="status-badge status-${service.status.toLowerCase()}">${service.status}</span>
                    </div>
                    <div class="col-md-2 text-end">
                        <div class="btn-group btn-group-sm">
                            <button class="btn btn-outline-primary" onclick="editService(${service.id})">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-outline-danger" onclick="deleteService(${service.id})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function loadAvailabilityData() {
    const container = document.getElementById('weeklySchedule');
    
    // Simulate weekly schedule
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const timeSlots = ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'];
    
    let scheduleHTML = '<div class="row">';
    
    days.forEach(day => {
        scheduleHTML += `
            <div class="col-md-3 mb-3">
                <h6 class="text-center">${day}</h6>
                <div class="d-flex flex-wrap">
        `;
        
        timeSlots.forEach(slot => {
            const isAvailable = Math.random() > 0.3; // 70% availability
            scheduleHTML += `
                <div class="availability-slot ${isAvailable ? 'available' : 'unavailable'}" 
                     onclick="toggleAvailability('${day}', '${slot}')">
                    ${slot}
                </div>
            `;
        });
        
        scheduleHTML += `
                </div>
            </div>
        `;
    });
    
    scheduleHTML += '</div>';
    container.innerHTML = scheduleHTML;
}

function loadEarningsData() {
    // Load earnings statistics
    document.getElementById('totalEarningsAmount').textContent = '₹1,25,000';
    document.getElementById('pendingEarnings').textContent = '₹8,500';
    document.getElementById('rewardsEarned').textContent = '₹2,300';
    
    // Load payments table
    const tableBody = document.querySelector('#paymentsTable tbody');
    
    const payments = [
        {
            date: '2024-01-15',
            service: 'Criminal Law Consultation',
            client: 'John Doe',
            amount: '₹2,500',
            status: 'PAID'
        },
        {
            date: '2024-01-14',
            service: 'Family Law Consultation',
            client: 'Jane Smith',
            amount: '₹3,000',
            status: 'PENDING'
        }
    ];
    
    tableBody.innerHTML = payments.map(payment => `
        <tr>
            <td>${payment.date}</td>
            <td>${payment.service}</td>
            <td>${payment.client}</td>
            <td>${payment.amount}</td>
            <td><span class="status-badge status-${payment.status.toLowerCase()}">${payment.status}</span></td>
        </tr>
    `).join('');
}

function loadReviewsData() {
    // Load review statistics
    document.getElementById('overallRating').textContent = '4.7';
    document.getElementById('totalReviews').textContent = '24';
    
    // Load rating breakdown
    const ratingBreakdown = document.getElementById('ratingBreakdown');
    ratingBreakdown.innerHTML = `
        <div class="d-flex justify-content-between mb-1">
            <span>5★</span>
            <span>15</span>
        </div>
        <div class="d-flex justify-content-between mb-1">
            <span>4★</span>
            <span>7</span>
        </div>
        <div class="d-flex justify-content-between mb-1">
            <span>3★</span>
            <span>2</span>
        </div>
        <div class="d-flex justify-content-between mb-1">
            <span>2★</span>
            <span>0</span>
        </div>
        <div class="d-flex justify-content-between">
            <span>1★</span>
            <span>0</span>
        </div>
    `;
    
    // Load recent reviews
    const recentReviews = document.getElementById('recentReviews');
    const reviews = [
        {
            client: 'John Doe',
            rating: 5,
            review: 'Excellent consultation, very helpful and professional.',
            date: '2024-01-15'
        },
        {
            client: 'Jane Smith',
            rating: 4,
            review: 'Good service, got the advice I needed.',
            date: '2024-01-14'
        }
    ];
    
    recentReviews.innerHTML = reviews.map(review => `
        <div class="border-bottom pb-3 mb-3">
            <div class="d-flex justify-content-between align-items-start">
                <div>
                    <h6 class="mb-1">${review.client}</h6>
                    <div class="text-warning mb-2">
                        ${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}
                    </div>
                </div>
                <small class="text-muted">${review.date}</small>
            </div>
            <p class="mb-0">${review.review}</p>
        </div>
    `).join('');
}

function loadProfileData() {
    // Load profile information
    document.getElementById('providerFullName').textContent = 'Dr. Sarah Johnson';
    document.getElementById('providerPracticeArea').textContent = 'Criminal Law';
    
    const profileInfo = document.getElementById('profileInfo');
    profileInfo.innerHTML = `
        <div class="row">
            <div class="col-md-6">
                <div class="mb-3">
                    <label class="form-label">First Name</label>
                    <input type="text" class="form-control" value="Sarah" readonly>
                </div>
            </div>
            <div class="col-md-6">
                <div class="mb-3">
                    <label class="form-label">Last Name</label>
                    <input type="text" class="form-control" value="Johnson" readonly>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-md-6">
                <div class="mb-3">
                    <label class="form-label">Email</label>
                    <input type="email" class="form-control" value="sarah@example.com" readonly>
                </div>
            </div>
            <div class="col-md-6">
                <div class="mb-3">
                    <label class="form-label">Phone</label>
                    <input type="tel" class="form-control" value="+91 9876543210" readonly>
                </div>
            </div>
        </div>
        <div class="mb-3">
            <label class="form-label">Practice Area</label>
            <input type="text" class="form-control" value="Criminal Law" readonly>
        </div>
        <div class="mb-3">
            <label class="form-label">Experience</label>
            <input type="text" class="form-control" value="5 years" readonly>
        </div>
        <div class="mb-3">
            <label class="form-label">Bio</label>
            <textarea class="form-control" rows="4" readonly>Experienced criminal lawyer with 5+ years of practice...</textarea>
        </div>
    `;
}

// Action functions
function confirmBooking(bookingId) {
    showAlert(`Booking ${bookingId} has been confirmed`, 'success');
    loadBookingsData(); // Refresh data
}

function rejectBooking(bookingId) {
    if (confirm(`Are you sure you want to reject booking ${bookingId}?`)) {
        showAlert(`Booking ${bookingId} has been rejected`, 'warning');
        loadBookingsData(); // Refresh data
    }
}

function startConsultation(bookingId) {
    showAlert(`Starting consultation for booking ${bookingId}`, 'info');
    // In a real implementation, this would redirect to the video consultation page
}

function viewBooking(bookingId) {
    showAlert(`Viewing details for booking ${bookingId}`, 'info');
}

function editService(serviceId) {
    showAlert(`Editing service ${serviceId}`, 'info');
}

function deleteService(serviceId) {
    if (confirm(`Are you sure you want to delete service ${serviceId}?`)) {
        showAlert(`Service ${serviceId} has been deleted`, 'warning');
        loadServicesData(); // Refresh data
    }
}

function toggleAvailability(day, time) {
    showAlert(`Toggling availability for ${day} at ${time}`, 'info');
}

function showAddServiceModal() {
    showAlert('Add service modal would open here', 'info');
}

function showAddAvailabilityModal() {
    showAlert('Add availability modal would open here', 'info');
}

function editProfile() {
    showAlert('Edit profile modal would open here', 'info');
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
