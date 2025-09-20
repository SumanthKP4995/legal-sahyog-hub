// Services Page JavaScript

let currentServices = [];
let currentPage = 1;
let itemsPerPage = 12;
let totalPages = 1;

// Initialize services page
document.addEventListener('DOMContentLoaded', function() {
    loadCategories();
    loadServices();
    setupEventListeners();
    checkAuthStatus();
});

function setupEventListeners() {
    // Filter form submission
    document.getElementById('filterForm').addEventListener('submit', function(e) {
        e.preventDefault();
        currentPage = 1;
        loadServices();
    });
    
    // View mode toggle
    document.querySelectorAll('input[name="viewMode"]').forEach(radio => {
        radio.addEventListener('change', function() {
            renderServices();
        });
    });
    
    // Real-time search
    document.getElementById('searchKeyword').addEventListener('input', debounce(function() {
        currentPage = 1;
        loadServices();
    }, 500));
}

function loadCategories() {
    fetch('http://localhost:8080/api/public/categories')
        .then(response => response.json())
        .then(categories => {
            const categorySelect = document.getElementById('categoryFilter');
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.id;
                option.textContent = category.name;
                categorySelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error loading categories:', error);
        });
}

function loadServices() {
    showLoading();
    
    const params = new URLSearchParams();
    
    // Get filter values
    const keyword = document.getElementById('searchKeyword').value;
    const categoryId = document.getElementById('categoryFilter').value;
    const city = document.getElementById('cityFilter').value;
    const practiceArea = document.getElementById('practiceAreaFilter').value;
    const minPrice = document.getElementById('minPrice').value;
    const maxPrice = document.getElementById('maxPrice').value;
    
    if (keyword) params.append('keyword', keyword);
    if (categoryId) params.append('categoryId', categoryId);
    if (city) params.append('city', city);
    if (practiceArea) params.append('practiceArea', practiceArea);
    if (minPrice) params.append('minPrice', minPrice);
    if (maxPrice) params.append('maxPrice', maxPrice);
    
    const queryString = params.toString();
    const url = queryString ? 
        `http://localhost:8080/api/services/search?${queryString}` : 
        'http://localhost:8080/api/services';
    
    fetch(url)
        .then(response => response.json())
        .then(services => {
            currentServices = services;
            totalPages = Math.ceil(services.length / itemsPerPage);
            renderServices();
            updateResultsCount();
            hideLoading();
        })
        .catch(error => {
            console.error('Error loading services:', error);
            hideLoading();
            showError('Failed to load services. Please try again.');
        });
}

function renderServices() {
    const servicesGrid = document.getElementById('servicesGrid');
    const noResults = document.getElementById('noResults');
    
    if (currentServices.length === 0) {
        servicesGrid.style.display = 'none';
        noResults.style.display = 'block';
        return;
    }
    
    servicesGrid.style.display = 'block';
    noResults.style.display = 'none';
    
    // Paginate services
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedServices = currentServices.slice(startIndex, endIndex);
    
    const viewMode = document.querySelector('input[name="viewMode"]:checked').id;
    
    if (viewMode === 'gridView') {
        renderGridView(paginatedServices);
    } else {
        renderListView(paginatedServices);
    }
    
    renderPagination();
}

function renderGridView(services) {
    const servicesGrid = document.getElementById('servicesGrid');
    servicesGrid.className = 'row g-4';
    
    const servicesHTML = services.map(service => `
        <div class="col-md-6 col-lg-4">
            <div class="card h-100 service-card" onclick="showServiceDetails(${service.id})">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <span class="badge bg-primary">${service.category?.name || 'Legal Service'}</span>
                        <div class="text-warning">
                            <i class="fas fa-star"></i>
                            <small>4.5</small>
                        </div>
                    </div>
                    <h5 class="card-title">${service.title}</h5>
                    <p class="card-text text-muted small">${service.description?.substring(0, 100)}...</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <strong class="text-primary">₹${service.price}</strong>
                            <small class="text-muted d-block">${service.durationMinutes} min</small>
                        </div>
                        <button class="btn btn-outline-primary btn-sm">
                            <i class="fas fa-eye me-1"></i>View
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
    
    servicesGrid.innerHTML = servicesHTML;
}

function renderListView(services) {
    const servicesGrid = document.getElementById('servicesGrid');
    servicesGrid.className = 'row g-3';
    
    const servicesHTML = services.map(service => `
        <div class="col-12">
            <div class="card service-card" onclick="showServiceDetails(${service.id})">
                <div class="card-body">
                    <div class="row align-items-center">
                        <div class="col-md-8">
                            <div class="d-flex justify-content-between align-items-start mb-2">
                                <span class="badge bg-primary">${service.category?.name || 'Legal Service'}</span>
                                <div class="text-warning">
                                    <i class="fas fa-star"></i>
                                    <small>4.5</small>
                                </div>
                            </div>
                            <h5 class="card-title mb-1">${service.title}</h5>
                            <p class="card-text text-muted">${service.description?.substring(0, 150)}...</p>
                            <div class="d-flex align-items-center text-muted small">
                                <i class="fas fa-clock me-1"></i>
                                <span class="me-3">${service.durationMinutes} minutes</span>
                                <i class="fas fa-map-marker-alt me-1"></i>
                                <span>${service.provider?.city || 'Online'}</span>
                            </div>
                        </div>
                        <div class="col-md-4 text-end">
                            <div class="mb-2">
                                <strong class="text-primary fs-4">₹${service.price}</strong>
                            </div>
                            <button class="btn btn-primary">
                                <i class="fas fa-calendar-plus me-1"></i>Book Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
    
    servicesGrid.innerHTML = servicesHTML;
}

function renderPagination() {
    const pagination = document.getElementById('pagination');
    
    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }
    
    let paginationHTML = '';
    
    // Previous button
    paginationHTML += `
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="changePage(${currentPage - 1})">Previous</a>
        </li>
    `;
    
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
            paginationHTML += `
                <li class="page-item ${i === currentPage ? 'active' : ''}">
                    <a class="page-link" href="#" onclick="changePage(${i})">${i}</a>
                </li>
            `;
        } else if (i === currentPage - 3 || i === currentPage + 3) {
            paginationHTML += '<li class="page-item disabled"><span class="page-link">...</span></li>';
        }
    }
    
    // Next button
    paginationHTML += `
        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="changePage(${currentPage + 1})">Next</a>
        </li>
    `;
    
    pagination.innerHTML = paginationHTML;
}

function changePage(page) {
    if (page < 1 || page > totalPages) return;
    currentPage = page;
    renderServices();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showServiceDetails(serviceId) {
    const service = currentServices.find(s => s.id === serviceId);
    if (!service) return;
    
    const modal = new bootstrap.Modal(document.getElementById('serviceModal'));
    const modalTitle = document.getElementById('serviceModalTitle');
    const modalBody = document.getElementById('serviceModalBody');
    const bookBtn = document.getElementById('bookServiceBtn');
    
    modalTitle.textContent = service.title;
    
    modalBody.innerHTML = `
        <div class="row">
            <div class="col-md-8">
                <div class="mb-3">
                    <span class="badge bg-primary me-2">${service.category?.name || 'Legal Service'}</span>
                    <div class="text-warning d-inline">
                        <i class="fas fa-star"></i>
                        <span>4.5 (24 reviews)</span>
                    </div>
                </div>
                
                <h6>Description</h6>
                <p class="text-muted">${service.description || 'No description available.'}</p>
                
                <h6>Service Details</h6>
                <ul class="list-unstyled">
                    <li><i class="fas fa-clock text-primary me-2"></i>Duration: ${service.durationMinutes} minutes</li>
                    <li><i class="fas fa-language text-primary me-2"></i>Languages: ${service.languages || 'English, Hindi'}</li>
                    <li><i class="fas fa-map-marker-alt text-primary me-2"></i>Location: ${service.provider?.city || 'Online Consultation'}</li>
                </ul>
            </div>
            <div class="col-md-4">
                <div class="card bg-light">
                    <div class="card-body text-center">
                        <h4 class="text-primary">₹${service.price}</h4>
                        <p class="text-muted small">per consultation</p>
                        <button class="btn btn-primary w-100 mb-2" onclick="bookService(${service.id})">
                            <i class="fas fa-calendar-plus me-2"></i>Book Now
                        </button>
                        <button class="btn btn-outline-primary w-100">
                            <i class="fas fa-heart me-2"></i>Save for Later
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    bookBtn.onclick = () => bookService(service.id);
    
    modal.show();
}

function bookService(serviceId) {
    const user = LegalSahyogHub.getCurrentUser();
    if (!user) {
        showAlert('Please login to book a service', 'warning');
        window.location.href = 'login.html';
        return;
    }
    
    // Redirect to booking page
    window.location.href = `booking.html?serviceId=${serviceId}`;
}

function clearFilters() {
    document.getElementById('filterForm').reset();
    currentPage = 1;
    loadServices();
}

function updateResultsCount() {
    const count = currentServices.length;
    const startIndex = (currentPage - 1) * itemsPerPage + 1;
    const endIndex = Math.min(currentPage * itemsPerPage, count);
    
    let text = '';
    if (count === 0) {
        text = 'No services found';
    } else if (count <= itemsPerPage) {
        text = `${count} service${count !== 1 ? 's' : ''} found`;
    } else {
        text = `Showing ${startIndex}-${endIndex} of ${count} services`;
    }
    
    document.getElementById('resultsCount').textContent = text;
}

function showLoading() {
    document.getElementById('loadingSpinner').style.display = 'block';
    document.getElementById('servicesGrid').style.display = 'none';
    document.getElementById('noResults').style.display = 'none';
}

function hideLoading() {
    document.getElementById('loadingSpinner').style.display = 'none';
}

function showError(message) {
    LegalSahyogHub.showAlert(message, 'danger');
}

// Utility function for debouncing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function checkAuthStatus() {
    const user = LegalSahyogHub.getCurrentUser();
    const authNav = document.getElementById('authNav');
    
    if (user) {
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
