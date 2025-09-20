// Payment Page JavaScript

let currentBooking = null;
let currentPayment = null;
let selectedPaymentMethod = null;

// Initialize payment page
document.addEventListener('DOMContentLoaded', function() {
    checkAuthentication();
    loadBookingFromURL();
    setupEventListeners();
});

function setupEventListeners() {
    // Terms checkbox
    document.getElementById('agreeTerms').addEventListener('change', function() {
        updatePayButton();
    });
    
    // Payment method radio buttons
    document.querySelectorAll('input[name="paymentMethod"]').forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.checked) {
                selectPaymentMethod(this.value);
            }
        });
    });
}

function checkAuthentication() {
    const user = LegalSahyogHub.getCurrentUser();
    if (!user) {
        showAlert('Please login to make payment', 'error');
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
        window.location.href = 'services.html';
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
        updatePaymentSummary(booking);
    })
    .catch(error => {
        console.error('Error loading booking:', error);
        showAlert('Failed to load booking details', 'error');
    });
}

function displayBookingDetails(booking) {
    document.getElementById('bookingService').textContent = booking.service.title;
    document.getElementById('bookingProvider').textContent = 
        `${booking.provider.firstName} ${booking.provider.lastName}`;
    document.getElementById('bookingDateTime').textContent = 
        `${new Date(booking.bookingDate).toLocaleDateString()} at ${booking.startTime}`;
    document.getElementById('bookingDuration').textContent = 
        `${booking.service.durationMinutes} minutes`;
}

function updatePaymentSummary(booking) {
    const serviceFee = booking.totalAmount;
    const platformFee = booking.platformFee;
    const totalAmount = serviceFee;
    
    document.getElementById('summaryServiceFee').textContent = `₹${serviceFee}`;
    document.getElementById('summaryPlatformFee').textContent = `₹${platformFee}`;
    document.getElementById('summaryTotalAmount').textContent = `₹${totalAmount}`;
}

function selectPaymentMethod(method) {
    selectedPaymentMethod = method;
    
    // Update card selection
    document.querySelectorAll('.payment-method-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    const selectedCard = document.querySelector(`[data-method="${method}"]`);
    if (selectedCard) {
        selectedCard.classList.add('selected');
    }
    
    // Show payment details form
    document.getElementById('paymentDetailsForm').style.display = 'block';
    
    // Hide all payment detail forms
    document.querySelectorAll('.payment-details').forEach(form => {
        form.style.display = 'none';
    });
    
    // Show relevant form
    switch (method) {
        case 'UPI':
            document.getElementById('upiForm').style.display = 'block';
            break;
        case 'CREDIT_CARD':
        case 'DEBIT_CARD':
            document.getElementById('cardForm').style.display = 'block';
            break;
        case 'NET_BANKING':
            document.getElementById('netBankingForm').style.display = 'block';
            break;
    }
    
    updatePayButton();
}

function updatePayButton() {
    const payBtn = document.getElementById('payNowBtn');
    const termsChecked = document.getElementById('agreeTerms').checked;
    
    if (selectedPaymentMethod && termsChecked) {
        payBtn.disabled = false;
        payBtn.innerHTML = `<i class="fas fa-lock me-2"></i>Pay ₹${currentBooking?.totalAmount || 0}`;
    } else {
        payBtn.disabled = true;
        payBtn.innerHTML = '<i class="fas fa-lock me-2"></i>Pay Securely';
    }
}

function processPayment() {
    if (!selectedPaymentMethod || !currentBooking) {
        showAlert('Please select a payment method', 'warning');
        return;
    }
    
    const payBtn = document.getElementById('payNowBtn');
    const originalText = payBtn.innerHTML;
    
    payBtn.innerHTML = '<span class="spinner"></span> Processing...';
    payBtn.disabled = true;
    
    // Create payment
    const paymentData = {
        bookingId: currentBooking.id,
        paymentMethod: selectedPaymentMethod
    };
    
    fetch('http://localhost:8080/api/payments', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${LegalSahyogHub.getAuthToken()}`
        },
        body: JSON.stringify(paymentData)
    })
    .then(response => response.json())
    .then(payment => {
        currentPayment = payment;
        
        // Simulate payment gateway processing
        return simulatePaymentGateway(payment);
    })
    .then(payment => {
        showPaymentSuccess(payment);
    })
    .catch(error => {
        console.error('Payment error:', error);
        showAlert('Payment failed. Please try again.', 'error');
    })
    .finally(() => {
        payBtn.innerHTML = originalText;
        payBtn.disabled = false;
    });
}

function simulatePaymentGateway(payment) {
    // Simulate payment gateway processing
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulate successful payment
            const paymentGatewayResponse = JSON.stringify({
                status: 'SUCCESS',
                transactionId: payment.transactionId,
                amount: payment.amount,
                timestamp: new Date().toISOString()
            });
            
            // Process payment
            fetch(`http://localhost:8080/api/payments/${payment.id}/process`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${LegalSahyogHub.getAuthToken()}`
                },
                body: JSON.stringify({
                    paymentGatewayResponse: paymentGatewayResponse
                })
            })
            .then(response => response.json())
            .then(processedPayment => {
                resolve(processedPayment);
            })
            .catch(error => {
                reject(error);
            });
        }, 3000); // Simulate 3-second processing time
    });
}

function showPaymentSuccess(payment) {
    // Hide payment form
    document.getElementById('paymentForm').style.display = 'none';
    
    // Show success screen
    document.getElementById('paymentSuccess').style.display = 'block';
    
    // Update success details
    document.getElementById('successTransactionId').textContent = payment.transactionId;
    document.getElementById('successAmount').textContent = `₹${payment.amount}`;
    
    // Show success alert
    showAlert('Payment completed successfully!', 'success');
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

// Card number formatting
document.getElementById('cardNumber').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
    let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
    e.target.value = formattedValue;
});

// Expiry date formatting
document.getElementById('expiryDate').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    e.target.value = value;
});

// CVV formatting
document.getElementById('cvv').addEventListener('input', function(e) {
    e.target.value = e.target.value.replace(/\D/g, '').substring(0, 4);
});
