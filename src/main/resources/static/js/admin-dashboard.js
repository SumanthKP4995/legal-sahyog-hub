// Admin Dashboard JavaScript

let currentSection = 'dashboard';

// Initialize admin dashboard
document.addEventListener('DOMContentLoaded', function() {
    checkAdminAuthentication();
    loadDashboardData();
    setupEventListeners();
});

function setupEventListeners() {
    // Add any specific event listeners here
}

function checkAdminAuthentication() {
    const user = LegalSahyogHub.getCurrentUser();
    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
        showAlert('Access denied. Admin privileges required.', 'error');
        window.location.href = 'login.html';
        return;
    }
    
    document.getElementById('adminName').textContent = user.firstName;
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
        case 'providers':
            loadProvidersData();
            break;
        case 'users':
            loadUsersData();
            break;
        case 'bookings':
            loadBookingsData();
            break;
        case 'payments':
            loadPaymentsData();
            break;
        case 'reviews':
            loadReviewsData();
            break;
        case 'content':
            loadContentData();
            break;
        case 'analytics':
            loadAnalyticsData();
            break;
    }
}

function loadDashboardData() {
    // Load dashboard statistics
    loadDashboardStats();
    loadRecentBookings();
    loadPendingApprovals();
}

function loadDashboardStats() {
    // Simulate loading dashboard statistics
    // In a real implementation, these would come from API calls
    
    setTimeout(() => {
        document.getElementById('totalUsers').textContent = '1,234';
        document.getElementById('activeProviders').textContent = '89';
        document.getElementById('totalBookings').textContent = '2,456';
        document.getElementById('platformRevenue').textContent = '₹1,23,456';
    }, 500);
}

function loadRecentBookings() {
    const tableBody = document.querySelector('#recentBookingsTable tbody');
    
    // Simulate recent bookings data
    const recentBookings = [
        {
            user: 'John Doe',
            provider: 'Dr. Smith',
            service: 'Criminal Law Consultation',
            date: '2024-01-15',
            status: 'COMPLETED'
        },
        {
            user: 'Jane Smith',
            provider: 'Adv. Johnson',
            service: 'Family Law Consultation',
            date: '2024-01-15',
            status: 'CONFIRMED'
        },
        {
            user: 'Mike Wilson',
            provider: 'Dr. Brown',
            service: 'Corporate Law Consultation',
            date: '2024-01-14',
            status: 'PENDING'
        }
    ];
    
    tableBody.innerHTML = recentBookings.map(booking => `
        <tr>
            <td>${booking.user}</td>
            <td>${booking.provider}</td>
            <td>${booking.service}</td>
            <td>${booking.date}</td>
            <td><span class="status-badge status-${booking.status.toLowerCase()}">${booking.status}</span></td>
        </tr>
    `).join('');
}

function loadPendingApprovals() {
    const container = document.getElementById('pendingApprovals');
    
    // Simulate pending approvals
    const pendingApprovals = [
        {
            type: 'Provider Verification',
            name: 'Adv. Sarah Johnson',
            date: '2024-01-15',
            action: 'Verify'
        },
        {
            type: 'Document Review',
            name: 'Dr. Michael Brown',
            date: '2024-01-14',
            action: 'Review'
        }
    ];
    
    container.innerHTML = pendingApprovals.map(approval => `
        <div class="d-flex justify-content-between align-items-center mb-3 p-2 border rounded">
            <div>
                <div class="fw-bold">${approval.name}</div>
                <small class="text-muted">${approval.type}</small>
                <div class="small text-muted">${approval.date}</div>
            </div>
            <button class="btn btn-sm btn-primary">${approval.action}</button>
        </div>
    `).join('');
}

function loadProvidersData() {
    const tableBody = document.querySelector('#providersTable tbody');
    
    // Simulate providers data
    const providers = [
        {
            name: 'Adv. Sarah Johnson',
            email: 'sarah@example.com',
            practiceArea: 'Criminal Law',
            experience: '5 years',
            rating: '4.8',
            status: 'VERIFIED'
        },
        {
            name: 'Dr. Michael Brown',
            email: 'michael@example.com',
            practiceArea: 'Corporate Law',
            experience: '8 years',
            rating: '4.6',
            status: 'PENDING'
        },
        {
            name: 'Adv. Emily Davis',
            email: 'emily@example.com',
            practiceArea: 'Family Law',
            experience: '3 years',
            rating: '4.9',
            status: 'VERIFIED'
        }
    ];
    
    tableBody.innerHTML = providers.map(provider => `
        <tr>
            <td>${provider.name}</td>
            <td>${provider.email}</td>
            <td>${provider.practiceArea}</td>
            <td>${provider.experience}</td>
            <td>
                <div class="d-flex align-items-center">
                    <i class="fas fa-star text-warning me-1"></i>
                    ${provider.rating}
                </div>
            </td>
            <td><span class="status-badge status-${provider.status.toLowerCase()}">${provider.status}</span></td>
            <td>
                <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-primary" onclick="viewProvider(${provider.name})">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-outline-success" onclick="verifyProvider(${provider.name})">
                        <i class="fas fa-check"></i>
                    </button>
                    <button class="btn btn-outline-danger" onclick="rejectProvider(${provider.name})">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function loadUsersData() {
    const tableBody = document.querySelector('#usersTable tbody');
    
    // Simulate users data
    const users = [
        {
            name: 'John Doe',
            email: 'john@example.com',
            phone: '+91 9876543210',
            city: 'Mumbai',
            status: 'ACTIVE'
        },
        {
            name: 'Jane Smith',
            email: 'jane@example.com',
            phone: '+91 9876543211',
            city: 'Delhi',
            status: 'ACTIVE'
        },
        {
            name: 'Mike Wilson',
            email: 'mike@example.com',
            phone: '+91 9876543212',
            city: 'Bangalore',
            status: 'INACTIVE'
        }
    ];
    
    tableBody.innerHTML = users.map(user => `
        <tr>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.phone}</td>
            <td>${user.city}</td>
            <td><span class="status-badge status-${user.status.toLowerCase()}">${user.status}</span></td>
            <td>
                <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-primary" onclick="viewUser('${user.name}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-outline-warning" onclick="editUser('${user.name}')">
                        <i class="fas fa-edit"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function loadBookingsData() {
    const tableBody = document.querySelector('#bookingsTable tbody');
    
    // Simulate bookings data
    const bookings = [
        {
            id: 'BK001',
            user: 'John Doe',
            provider: 'Adv. Sarah Johnson',
            service: 'Criminal Law Consultation',
            dateTime: '2024-01-15 10:00',
            amount: '₹2,500',
            status: 'COMPLETED'
        },
        {
            id: 'BK002',
            user: 'Jane Smith',
            provider: 'Dr. Michael Brown',
            service: 'Corporate Law Consultation',
            dateTime: '2024-01-15 14:00',
            amount: '₹3,000',
            status: 'CONFIRMED'
        }
    ];
    
    tableBody.innerHTML = bookings.map(booking => `
        <tr>
            <td>${booking.id}</td>
            <td>${booking.user}</td>
            <td>${booking.provider}</td>
            <td>${booking.service}</td>
            <td>${booking.dateTime}</td>
            <td>${booking.amount}</td>
            <td><span class="status-badge status-${booking.status.toLowerCase()}">${booking.status}</span></td>
            <td>
                <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-primary" onclick="viewBooking('${booking.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function loadPaymentsData() {
    const tableBody = document.querySelector('#paymentsTable tbody');
    
    // Simulate payments data
    const payments = [
        {
            transactionId: 'TXN123456789',
            user: 'John Doe',
            provider: 'Adv. Sarah Johnson',
            amount: '₹2,500',
            platformFee: '₹375',
            status: 'SUCCESS',
            date: '2024-01-15'
        },
        {
            transactionId: 'TXN123456790',
            user: 'Jane Smith',
            provider: 'Dr. Michael Brown',
            amount: '₹3,000',
            platformFee: '₹450',
            status: 'SUCCESS',
            date: '2024-01-15'
        }
    ];
    
    tableBody.innerHTML = payments.map(payment => `
        <tr>
            <td>${payment.transactionId}</td>
            <td>${payment.user}</td>
            <td>${payment.provider}</td>
            <td>${payment.amount}</td>
            <td>${payment.platformFee}</td>
            <td><span class="status-badge status-${payment.status.toLowerCase()}">${payment.status}</span></td>
            <td>${payment.date}</td>
        </tr>
    `).join('');
}

function loadReviewsData() {
    const tableBody = document.querySelector('#reviewsTable tbody');
    
    // Simulate reviews data
    const reviews = [
        {
            user: 'John Doe',
            provider: 'Adv. Sarah Johnson',
            rating: 5,
            review: 'Excellent consultation, very helpful and professional.',
            date: '2024-01-15'
        },
        {
            user: 'Jane Smith',
            provider: 'Dr. Michael Brown',
            rating: 4,
            review: 'Good service, got the advice I needed.',
            date: '2024-01-14'
        }
    ];
    
    tableBody.innerHTML = reviews.map(review => `
        <tr>
            <td>${review.user}</td>
            <td>${review.provider}</td>
            <td>
                <div class="d-flex align-items-center">
                    ${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}
                    <span class="ms-1">(${review.rating})</span>
                </div>
            </td>
            <td>${review.review}</td>
            <td>${review.date}</td>
            <td>
                <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-primary" onclick="viewReview('${review.user}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-outline-danger" onclick="deleteReview('${review.user}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function loadContentData() {
    const tableBody = document.querySelector('#contentTable tbody');
    
    // Simulate content data
    const content = [
        {
            title: 'Understanding Your Rights as a Citizen',
            type: 'BLOG',
            category: 'Constitutional Law',
            author: 'Admin',
            status: 'PUBLISHED',
            views: 1250
        },
        {
            title: 'How to File a Consumer Complaint',
            type: 'FAQ',
            category: 'Consumer Rights',
            author: 'Admin',
            status: 'PUBLISHED',
            views: 890
        }
    ];
    
    tableBody.innerHTML = content.map(item => `
        <tr>
            <td>${item.title}</td>
            <td><span class="badge bg-primary">${item.type}</span></td>
            <td>${item.category}</td>
            <td>${item.author}</td>
            <td><span class="status-badge status-${item.status.toLowerCase()}">${item.status}</span></td>
            <td>${item.views}</td>
            <td>
                <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-primary" onclick="viewContent('${item.title}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-outline-warning" onclick="editContent('${item.title}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-outline-danger" onclick="deleteContent('${item.title}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function loadAnalyticsData() {
    // Analytics data loading would be implemented here
    console.log('Loading analytics data...');
}

// Action functions
function verifyProvider(providerName) {
    showAlert(`Provider ${providerName} has been verified`, 'success');
    loadProvidersData(); // Refresh data
}

function rejectProvider(providerName) {
    if (confirm(`Are you sure you want to reject ${providerName}?`)) {
        showAlert(`Provider ${providerName} has been rejected`, 'warning');
        loadProvidersData(); // Refresh data
    }
}

function viewProvider(providerName) {
    showAlert(`Viewing details for ${providerName}`, 'info');
}

function viewUser(userName) {
    showAlert(`Viewing details for ${userName}`, 'info');
}

function editUser(userName) {
    showAlert(`Editing user ${userName}`, 'info');
}

function viewBooking(bookingId) {
    showAlert(`Viewing booking ${bookingId}`, 'info');
}

function viewReview(userName) {
    showAlert(`Viewing review by ${userName}`, 'info');
}

function deleteReview(userName) {
    if (confirm(`Are you sure you want to delete the review by ${userName}?`)) {
        showAlert(`Review by ${userName} has been deleted`, 'warning');
        loadReviewsData(); // Refresh data
    }
}

function viewContent(title) {
    showAlert(`Viewing content: ${title}`, 'info');
}

function editContent(title) {
    showAlert(`Editing content: ${title}`, 'info');
}

function deleteContent(title) {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
        showAlert(`Content "${title}" has been deleted`, 'warning');
        loadContentData(); // Refresh data
    }
}

function showAddContentModal() {
    showAlert('Add content modal would open here', 'info');
}

function exportProviders() {
    showAlert('Exporting providers data...', 'info');
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
