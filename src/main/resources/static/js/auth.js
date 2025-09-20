// Authentication JavaScript for Legal Sahyog Hub

// Login Form Handler
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const providerRegisterForm = document.getElementById('providerRegisterForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', handleUserRegistration);
    }
    
    if (providerRegisterForm) {
        providerRegisterForm.addEventListener('submit', handleProviderRegistration);
    }
});

// Handle User Login
async function handleLogin(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const loginData = {
        email: formData.get('email'),
        password: formData.get('password')
    };
    
    const submitButton = event.target.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    
    try {
        submitButton.innerHTML = '<span class="spinner"></span> Signing In...';
        submitButton.disabled = true;
        
        const response = await fetch('http://localhost:8080/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginData)
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Login failed');
        }
        
        const loginResponse = await response.json();
        
        // Store authentication data
        localStorage.setItem('authToken', loginResponse.token);
        localStorage.setItem('currentUser', JSON.stringify({
            id: loginResponse.userId,
            email: loginResponse.email,
            firstName: loginResponse.firstName,
            lastName: loginResponse.lastName,
            role: loginResponse.role
        }));
        
        // Show success message
        showAlert('Login successful! Redirecting...', 'success');
        
        // Redirect based on role
        setTimeout(() => {
            switch (loginResponse.role) {
                case 'USER':
                    window.location.href = 'user-dashboard.html';
                    break;
                case 'PROVIDER':
                    window.location.href = 'provider-dashboard.html';
                    break;
                case 'ADMIN':
                case 'SUPER_ADMIN':
                    window.location.href = 'admin-dashboard.html';
                    break;
                default:
                    window.location.href = 'index.html';
            }
        }, 1500);
        
    } catch (error) {
        console.error('Login error:', error);
        showAlert(error.message || 'Login failed. Please try again.', 'danger');
    } finally {
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
    }
}

// Handle User Registration
async function handleUserRegistration(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');
    
    // Validate password confirmation
    if (password !== confirmPassword) {
        showAlert('Passwords do not match', 'danger');
        return;
    }
    
    const registrationData = {
        email: formData.get('email'),
        password: password,
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        phone: formData.get('phone'),
        address: formData.get('address'),
        city: formData.get('city'),
        state: formData.get('state'),
        pincode: formData.get('pincode')
    };
    
    const submitButton = event.target.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    
    try {
        submitButton.innerHTML = '<span class="spinner"></span> Creating Account...';
        submitButton.disabled = true;
        
        const response = await fetch('http://localhost:8080/api/auth/register/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(registrationData)
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Registration failed');
        }
        
        const user = await response.json();
        
        showAlert('Account created successfully! Please login to continue.', 'success');
        
        // Redirect to login page after a delay
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        
    } catch (error) {
        console.error('Registration error:', error);
        showAlert(error.message || 'Registration failed. Please try again.', 'danger');
    } finally {
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
    }
}

// Handle Provider Registration
async function handleProviderRegistration(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');
    
    // Validate password confirmation
    if (password !== confirmPassword) {
        showAlert('Passwords do not match', 'danger');
        return;
    }
    
    const registrationData = {
        email: formData.get('email'),
        password: password,
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        phone: formData.get('phone'),
        barCouncilNumber: formData.get('barCouncilNumber'),
        practiceArea: formData.get('practiceArea'),
        experienceYears: parseInt(formData.get('experienceYears')) || 0,
        qualification: formData.get('qualification'),
        bio: formData.get('bio'),
        address: formData.get('address'),
        city: formData.get('city'),
        state: formData.get('state'),
        pincode: formData.get('pincode')
    };
    
    const submitButton = event.target.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    
    try {
        submitButton.innerHTML = '<span class="spinner"></span> Registering...';
        submitButton.disabled = true;
        
        const response = await fetch('http://localhost:8080/api/auth/register/provider', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(registrationData)
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Registration failed');
        }
        
        const provider = await response.json();
        
        showAlert('Registration successful! Your account is pending verification. You will be notified once approved.', 'success');
        
        // Redirect to login page after a delay
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 3000);
        
    } catch (error) {
        console.error('Provider registration error:', error);
        showAlert(error.message || 'Registration failed. Please try again.', 'danger');
    } finally {
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
    }
}

// Show Alert Function
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

// Form Validation
function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.classList.add('is-invalid');
            isValid = false;
        } else {
            field.classList.remove('is-invalid');
        }
    });
    
    return isValid;
}

// Add form validation listeners
document.addEventListener('DOMContentLoaded', function() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                if (this.hasAttribute('required') && !this.value.trim()) {
                    this.classList.add('is-invalid');
                } else {
                    this.classList.remove('is-invalid');
                }
            });
            
            input.addEventListener('input', function() {
                if (this.classList.contains('is-invalid') && this.value.trim()) {
                    this.classList.remove('is-invalid');
                }
            });
        });
    });
});
