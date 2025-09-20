// Feedback Page JavaScript

let currentBooking = null;
let selectedRating = 0;
let selectedCategories = [];

// Initialize feedback page
document.addEventListener('DOMContentLoaded', function() {
    checkAuthentication();
    loadBookingFromURL();
    setupEventListeners();
});

function setupEventListeners() {
    // Star rating
    document.querySelectorAll('.rating-stars').forEach(star => {
        star.addEventListener('click', function() {
            const rating = parseInt(this.dataset.rating);
            setRating(rating);
        });
        
        star.addEventListener('mouseenter', function() {
            const rating = parseInt(this.dataset.rating);
            highlightStars(rating);
        });
    });
    
    // Clear star highlighting on mouse leave
    document.querySelector('.star-rating').addEventListener('mouseleave', function() {
        highlightStars(selectedRating);
    });
    
    // Category selection
    document.querySelectorAll('.category-item').forEach(item => {
        item.addEventListener('click', function() {
            toggleCategory(this);
        });
    });
    
    // Review text change
    document.getElementById('reviewText').addEventListener('input', function() {
        updateSubmitButton();
    });
}

function checkAuthentication() {
    const user = LegalSahyogHub.getCurrentUser();
    if (!user) {
        showAlert('Please login to provide feedback', 'error');
        window.location.href = 'login.html';
        return;
    }
    
    document.getElementById('userName').textContent = user.firstName;
}

function loadBookingFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const bookingId = urlParams.get('bookingId');
    
    if (!bookingId) {
        showAlert('No booking ID provided', 'error');
        window.location.href = 'user-dashboard.html';
        return;
    }
    
    fetch(`http://localhost:8080/api/bookings/${bookingId}`, {
        headers: {
            'Authorization': `Bearer ${LegalSahyogHub.getAuthToken()}`
        }
    })
    .then(response => response.json())
    .then(booking => {
        currentBooking = booking;
        displayBookingDetails(booking);
    })
    .catch(error => {
        console.error('Error loading booking:', error);
        showAlert('Failed to load booking details', 'error');
    });
}

function displayBookingDetails(booking) {
    document.getElementById('consultationProvider').textContent = 
        `${booking.provider.firstName} ${booking.provider.lastName}`;
    document.getElementById('consultationService').textContent = booking.service.title;
    document.getElementById('consultationDate').textContent = 
        new Date(booking.bookingDate).toLocaleDateString();
    document.getElementById('consultationDuration').textContent = 
        `${booking.service.durationMinutes} minutes`;
}

function setRating(rating) {
    selectedRating = rating;
    highlightStars(rating);
    updateRatingDescription(rating);
    updateSubmitButton();
}

function highlightStars(rating) {
    document.querySelectorAll('.rating-stars').forEach((star, index) => {
        if (index < rating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}

function updateRatingDescription(rating) {
    const descriptions = {
        1: "Poor - Very dissatisfied",
        2: "Fair - Somewhat dissatisfied", 
        3: "Good - Satisfied",
        4: "Very Good - Very satisfied",
        5: "Excellent - Completely satisfied"
    };
    
    document.getElementById('ratingDescription').textContent = descriptions[rating] || 
        "Click on a star to rate your experience";
}

function toggleCategory(categoryElement) {
    const category = categoryElement.dataset.category;
    
    if (categoryElement.classList.contains('selected')) {
        categoryElement.classList.remove('selected');
        selectedCategories = selectedCategories.filter(c => c !== category);
    } else {
        categoryElement.classList.add('selected');
        selectedCategories.push(category);
    }
    
    updateSubmitButton();
}

function updateSubmitButton() {
    const submitBtn = document.getElementById('submitFeedbackBtn');
    const hasRating = selectedRating > 0;
    const hasContent = document.getElementById('reviewText').value.trim().length > 0 || selectedCategories.length > 0;
    
    if (hasRating && hasContent) {
        submitBtn.disabled = false;
    } else {
        submitBtn.disabled = true;
    }
}

function submitFeedback() {
    if (selectedRating === 0) {
        showAlert('Please select a rating', 'warning');
        return;
    }
    
    const reviewText = document.getElementById('reviewText').value.trim();
    const isPublic = document.getElementById('isPublic').checked;
    
    // Add selected categories to review text
    let fullReviewText = reviewText;
    if (selectedCategories.length > 0) {
        const categoryText = `\n\nPositive aspects: ${selectedCategories.join(', ')}`;
        fullReviewText += categoryText;
    }
    
    const reviewData = {
        bookingId: currentBooking.id,
        rating: selectedRating,
        reviewText: fullReviewText,
        isPublic: isPublic
    };
    
    const submitBtn = document.getElementById('submitFeedbackBtn');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.innerHTML = '<span class="spinner"></span> Submitting...';
    submitBtn.disabled = true;
    
    fetch('http://localhost:8080/api/reviews', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${LegalSahyogHub.getAuthToken()}`
        },
        body: JSON.stringify(reviewData)
    })
    .then(response => response.json())
    .then(review => {
        showThankYouScreen();
    })
    .catch(error => {
        console.error('Error submitting feedback:', error);
        showAlert('Failed to submit feedback. Please try again.', 'error');
    })
    .finally(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    });
}

function showThankYouScreen() {
    // Hide feedback form
    document.getElementById('feedbackForm').style.display = 'none';
    
    // Show thank you screen
    document.getElementById('thankYouScreen').style.display = 'block';
    
    // Show success alert
    showAlert('Thank you for your feedback!', 'success');
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
