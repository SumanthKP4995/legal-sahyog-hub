// Legal Literacy Center JavaScript

let currentContent = [];
let currentPage = 1;
let itemsPerPage = 9;
let totalPages = 1;

// Initialize legal literacy page
document.addEventListener('DOMContentLoaded', function() {
    loadContent();
    setupEventListeners();
    checkAuthStatus();
});

function setupEventListeners() {
    // Search input
    document.getElementById('searchInput').addEventListener('input', debounce(function() {
        currentPage = 1;
        loadContent();
    }, 500));
    
    // Category filter
    document.getElementById('categoryFilter').addEventListener('change', function() {
        currentPage = 1;
        loadContent();
    });
    
    // Type filter
    document.getElementById('typeFilter').addEventListener('change', function() {
        currentPage = 1;
        loadContent();
    });
}

function loadContent() {
    const searchKeyword = document.getElementById('searchInput').value;
    const category = document.getElementById('categoryFilter').value;
    const type = document.getElementById('typeFilter').value;
    
    // Simulate content loading
    const mockContent = [
        {
            id: 1,
            title: 'Understanding Your Rights as a Citizen',
            summary: 'A comprehensive guide to fundamental rights guaranteed by the Indian Constitution.',
            content: 'Full article content here...',
            category: 'Constitutional Law',
            contentType: 'BLOG',
            author: 'Legal Expert',
            createdAt: '2024-01-15',
            viewCount: 1250,
            isFeatured: true
        },
        {
            id: 2,
            title: 'How to File a Consumer Complaint',
            summary: 'Step-by-step guide to filing consumer complaints in India.',
            content: 'Full article content here...',
            category: 'Consumer Rights',
            contentType: 'FAQ',
            author: 'Consumer Rights Expert',
            createdAt: '2024-01-14',
            viewCount: 890,
            isFeatured: false
        },
        {
            id: 3,
            title: 'Property Registration Process',
            summary: 'Complete guide to property registration in India.',
            content: 'Full article content here...',
            category: 'Property Law',
            contentType: 'GUIDE',
            author: 'Property Law Expert',
            createdAt: '2024-01-13',
            viewCount: 2100,
            isFeatured: false
        },
        {
            id: 4,
            title: 'Criminal Law Basics',
            summary: 'Understanding the basics of criminal law in India.',
            content: 'Full article content here...',
            category: 'Criminal Law',
            contentType: 'VIDEO',
            author: 'Criminal Law Expert',
            createdAt: '2024-01-12',
            viewCount: 1500,
            isFeatured: false
        },
        {
            id: 5,
            title: 'Family Law and Divorce',
            summary: 'Everything you need to know about family law and divorce procedures.',
            content: 'Full article content here...',
            category: 'Family Law',
            contentType: 'BLOG',
            author: 'Family Law Expert',
            createdAt: '2024-01-11',
            viewCount: 1800,
            isFeatured: false
        },
        {
            id: 6,
            title: 'Labor Rights in India',
            summary: 'Understanding your rights as an employee in India.',
            content: 'Full article content here...',
            category: 'Labor Law',
            contentType: 'FAQ',
            author: 'Labor Law Expert',
            createdAt: '2024-01-10',
            viewCount: 950,
            isFeatured: false
        }
    ];
    
    // Filter content based on search and filters
    let filteredContent = mockContent;
    
    if (searchKeyword) {
        filteredContent = filteredContent.filter(content => 
            content.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
            content.summary.toLowerCase().includes(searchKeyword.toLowerCase())
        );
    }
    
    if (category) {
        filteredContent = filteredContent.filter(content => content.category === category);
    }
    
    if (type) {
        filteredContent = filteredContent.filter(content => content.contentType === type);
    }
    
    currentContent = filteredContent;
    totalPages = Math.ceil(currentContent.length / itemsPerPage);
    
    renderContent();
    renderPagination();
}

function renderContent() {
    const contentContainer = document.getElementById('content');
    
    if (currentContent.length === 0) {
        contentContainer.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fas fa-search fa-3x text-muted mb-3"></i>
                <h4 class="text-muted">No content found</h4>
                <p class="text-muted">Try adjusting your search criteria or browse all content.</p>
            </div>
        `;
        return;
    }
    
    // Paginate content
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedContent = currentContent.slice(startIndex, endIndex);
    
    const contentHTML = paginatedContent.map(content => `
        <div class="col-lg-4 col-md-6 mb-4">
            <div class="card content-card h-100 position-relative" onclick="viewContent(${content.id})">
                <span class="content-type-badge badge-${content.contentType.toLowerCase()}">
                    ${content.contentType}
                </span>
                <div class="card-body">
                    <h5 class="card-title">${content.title}</h5>
                    <p class="card-text text-muted">${content.summary}</p>
                    <div class="content-meta">
                        <span><i class="fas fa-user me-1"></i>${content.author}</span>
                        <span><i class="fas fa-calendar me-1"></i>${formatDate(content.createdAt)}</span>
                        <span><i class="fas fa-eye me-1"></i>${content.viewCount}</span>
                    </div>
                </div>
                <div class="card-footer bg-transparent">
                    <div class="d-flex justify-content-between align-items-center">
                        <span class="badge bg-secondary">${content.category}</span>
                        <button class="btn btn-outline-primary btn-sm">
                            <i class="fas fa-arrow-right me-1"></i>Read More
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
    
    contentContainer.innerHTML = contentHTML;
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
    renderContent();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function viewContent(contentId) {
    const content = currentContent.find(c => c.id === contentId);
    if (!content) return;
    
    const modal = new bootstrap.Modal(document.getElementById('contentModal'));
    const modalTitle = document.getElementById('contentModalTitle');
    const modalBody = document.getElementById('contentModalBody');
    
    modalTitle.textContent = content.title;
    
    modalBody.innerHTML = `
        <div class="mb-3">
            <span class="badge bg-primary me-2">${content.contentType}</span>
            <span class="badge bg-secondary">${content.category}</span>
        </div>
        
        <div class="content-meta mb-3">
            <span><i class="fas fa-user me-1"></i>${content.author}</span>
            <span><i class="fas fa-calendar me-1"></i>${formatDate(content.createdAt)}</span>
            <span><i class="fas fa-eye me-1"></i>${content.viewCount} views</span>
        </div>
        
        <div class="content-body">
            <p class="lead">${content.summary}</p>
            <div class="content-text">
                ${content.content}
            </div>
        </div>
        
        <div class="mt-4">
            <h6>Related Topics</h6>
            <div class="d-flex flex-wrap gap-2">
                <span class="badge bg-light text-dark">${content.category}</span>
                <span class="badge bg-light text-dark">Legal Rights</span>
                <span class="badge bg-light text-dark">Indian Law</span>
            </div>
        </div>
    `;
    
    modal.show();
}

function viewFeaturedContent() {
    const featuredContent = currentContent.find(c => c.isFeatured);
    if (featuredContent) {
        viewContent(featuredContent.id);
    }
}

function shareContent() {
    if (navigator.share) {
        navigator.share({
            title: document.getElementById('contentModalTitle').textContent,
            text: 'Check out this legal content from Legal Sahyog Hub',
            url: window.location.href
        });
    } else {
        // Fallback for browsers that don't support Web Share API
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
            showAlert('Link copied to clipboard!', 'success');
        });
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
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
