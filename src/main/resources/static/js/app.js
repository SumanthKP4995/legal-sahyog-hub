// Legal Sahyog Hub - Main Application JavaScript

// API Configuration
const API_BASE_URL = 'http://localhost:8080/api';

// Utility Functions
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

function getAuthToken() {
    return localStorage.getItem('authToken');
}

function setAuthToken(token) {
    localStorage.setItem('authToken', token);
}

function removeAuthToken() {
    localStorage.removeItem('authToken');
}

function getCurrentUser() {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
}

function setCurrentUser(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
}

function removeCurrentUser() {
    localStorage.removeItem('currentUser');
}

// API Helper Functions
async function apiRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = getAuthToken();
    
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
        },
    };
    
    if (token) {
        defaultOptions.headers['Authorization'] = `Bearer ${token}`;
    }
    
    const finalOptions = { ...defaultOptions, ...options };
    
    try {
        const response = await fetch(url, finalOptions);
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API Request failed:', error);
        throw error;
    }
}

// Service Categories
const serviceCategories = [
    { id: 1, name: 'Criminal Law', icon: 'fas fa-gavel', description: 'Legal assistance for criminal cases and proceedings' },
    { id: 2, name: 'Civil Law', icon: 'fas fa-balance-scale', description: 'Civil disputes, property matters, and contractual issues' },
    { id: 3, name: 'Family Law', icon: 'fas fa-heart', description: 'Divorce, custody, marriage, and family disputes' },
    { id: 4, name: 'Corporate Law', icon: 'fas fa-building', description: 'Business law, company formation, and corporate governance' },
    { id: 5, name: 'Property Law', icon: 'fas fa-home', description: 'Real estate transactions and property disputes' },
    { id: 6, name: 'Tax Law', icon: 'fas fa-calculator', description: 'Income tax, GST, and other tax-related matters' },
    { id: 7, name: 'Immigration Law', icon: 'fas fa-passport', description: 'Visa, citizenship, and immigration services' },
    { id: 8, name: 'Intellectual Property', icon: 'fas fa-lightbulb', description: 'Patents, trademarks, and copyright issues' },
    { id: 9, name: 'Labor Law', icon: 'fas fa-briefcase', description: 'Employment disputes and labor rights' },
    { id: 10, name: 'Constitutional Law', icon: 'fas fa-flag', description: 'Fundamental rights and constitutional matters' }
];

// Load Services on Home Page
async function loadServices() {
    const servicesGrid = document.getElementById('services-grid');
    if (!servicesGrid) return;
    
    try {
        // For now, use static data. Later this will be replaced with API call
        const servicesHTML = serviceCategories.map(category => `
            <div class="col-md-6 col-lg-4">
                <div class="service-card">
                    <div class="service-icon">
                        <i class="${category.icon}"></i>
                    </div>
                    <h5 class="fw-bold">${category.name}</h5>
                    <p class="text-muted">${category.description}</p>
                    <a href="services.html?category=${category.id}" class="btn btn-outline-primary btn-sm">
                        View Services
                    </a>
                </div>
            </div>
        `).join('');
        
        servicesGrid.innerHTML = servicesHTML;
    } catch (error) {
        console.error('Error loading services:', error);
        servicesGrid.innerHTML = '<div class="col-12 text-center"><p class="text-muted">Unable to load services at this time.</p></div>';
    }
}

// Load Legal Content
async function loadLegalContent() {
    const contentGrid = document.getElementById('legal-content-grid');
    if (!contentGrid) return;
    
    try {
        // Sample legal content - in real app this would come from API
        const sampleContent = [
            {
                id: 1,
                title: 'Understanding Your Rights as a Citizen',
                type: 'BLOG',
                category: 'Constitutional Law',
                excerpt: 'Learn about your fundamental rights guaranteed by the Indian Constitution...'
            },
            {
                id: 2,
                title: 'How to File a Consumer Complaint',
                type: 'FAQ',
                category: 'Consumer Rights',
                excerpt: 'Step-by-step guide to filing consumer complaints in India...'
            },
            {
                id: 3,
                title: 'Property Registration Process',
                type: 'BLOG',
                category: 'Property Law',
                excerpt: 'Complete guide to property registration and documentation...'
            }
        ];
        
        const contentHTML = sampleContent.map(content => `
            <div class="col-md-6 col-lg-4">
                <div class="card h-100">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <span class="badge bg-primary">${content.type}</span>
                            <small class="text-muted">${content.category}</small>
                        </div>
                        <h6 class="card-title fw-bold">${content.title}</h6>
                        <p class="card-text text-muted small">${content.excerpt}</p>
                        <a href="#" class="btn btn-outline-primary btn-sm">Read More</a>
                    </div>
                </div>
            </div>
        `).join('');
        
        contentGrid.innerHTML = contentHTML;
    } catch (error) {
        console.error('Error loading legal content:', error);
        contentGrid.innerHTML = '<div class="col-12 text-center"><p class="text-muted">Unable to load content at this time.</p></div>';
    }
}

// Check Authentication Status
function checkAuthStatus() {
    const token = getAuthToken();
    const user = getCurrentUser();
    
    if (token && user) {
        // User is logged in, update navigation
        updateNavigationForLoggedInUser(user);
    }
}

// Update Navigation for Logged In User
function updateNavigationForLoggedInUser(user) {
    const navbarNav = document.querySelector('#navbarNav .navbar-nav:last-child');
    if (!navbarNav) return;
    
    const userRole = user.role.toLowerCase();
    let dashboardLink = '';
    
    switch (userRole) {
        case 'user':
            dashboardLink = '<a class="nav-link" href="user-dashboard.html"><i class="fas fa-tachometer-alt me-1"></i>Dashboard</a>';
            break;
        case 'provider':
            dashboardLink = '<a class="nav-link" href="provider-dashboard.html"><i class="fas fa-tachometer-alt me-1"></i>Dashboard</a>';
            break;
        case 'admin':
        case 'super_admin':
            dashboardLink = '<a class="nav-link" href="admin-dashboard.html"><i class="fas fa-tachometer-alt me-1"></i>Dashboard</a>';
            break;
    }
    
    navbarNav.innerHTML = `
        <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                <i class="fas fa-user me-1"></i>${user.firstName}
            </a>
            <ul class="dropdown-menu">
                <li>${dashboardLink}</li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item" href="#" onclick="logout()"><i class="fas fa-sign-out-alt me-2"></i>Logout</a></li>
            </ul>
        </li>
    `;
}

// Logout Function
function logout() {
    removeAuthToken();
    removeCurrentUser();
    window.location.href = 'index.html';
}

// Smooth Scrolling for Navigation Links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    // Load services and content on home page
    if (window.location.pathname === '/' || window.location.pathname.includes('index.html')) {
        loadServices();
        loadLegalContent();
    }
    
    // Check authentication status
    checkAuthStatus();
    
    // Initialize smooth scrolling
    initSmoothScrolling();
    
    // Add loading states to buttons
    document.querySelectorAll('button[type="submit"]').forEach(button => {
        button.addEventListener('click', function() {
            if (this.form && this.form.checkValidity()) {
                this.innerHTML = '<span class="spinner"></span> Processing...';
                this.disabled = true;
            }
        });
    });
});

// Export functions for use in other scripts
window.LegalSahyogHub = {
    showAlert,
    apiRequest,
    getAuthToken,
    setAuthToken,
    removeAuthToken,
    getCurrentUser,
    setCurrentUser,
    removeCurrentUser,
    logout
};
