// Simple login.js file for KhelConnect website

// DOM elements
const loginTab = document.getElementById('login-tab');
const signupTab = document.getElementById('signup-tab');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const loginError = document.getElementById('login-error');
const signupError = document.getElementById('signup-error');

// Tab switching functionality
loginTab.addEventListener('click', function() {
    loginTab.classList.add('active');
    signupTab.classList.remove('active');
    loginForm.classList.remove('hidden');
    signupForm.classList.add('hidden');
});

signupTab.addEventListener('click', function() {
    signupTab.classList.add('active');
    loginTab.classList.remove('active');
    signupForm.classList.remove('hidden');
    loginForm.classList.add('hidden');
});

// Login form submission
loginForm.querySelector('form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    // Check if fields are empty
    if (!email || !password) {
        showError(loginError, 'Please fill in all fields');
        return;
    }
    
    // Check if credentials match demo users
    if ((email === 'virat@example.com' && password === 'Cricket@123') || 
        (email === 'admin@khelconnect.gov.in' && password === 'Admin@123')) {
        
        // Store user info in localStorage
        const user = {
            email: email,
            name: email === 'virat@example.com' ? 'Virat Kohli' : 'Admin User',
            isLoggedIn: true
        };
        
        localStorage.setItem('khelconnect_user', JSON.stringify(user));
        
        // Redirect to home page
        window.location.href = 'index.html';
    } else {
        showError(loginError, 'Invalid email or password');
    }
});

// Signup form submission
signupForm.querySelector('form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const firstName = document.getElementById('first-name').value;
    const lastName = document.getElementById('last-name').value;
    const email = document.getElementById('signup-email').value;
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const termsAgree = document.getElementById('terms-agree').checked;
    
    // Check if fields are empty
    if (!firstName || !lastName || !email || !phone || !password || !confirmPassword) {
        showError(signupError, 'Please fill in all fields');
        return;
    }
    
    // Check if passwords match
    if (password !== confirmPassword) {
        showError(signupError, 'Passwords do not match');
        return;
    }
    
    // Check if terms are agreed
    if (!termsAgree) {
        showError(signupError, 'You must agree to the Terms and Conditions');
        return;
    }
    
    // Create new user
    const user = {
        email: email,
        name: firstName + ' ' + lastName,
        isLoggedIn: true
    };
    
    localStorage.setItem('khelconnect_user', JSON.stringify(user));
    
    // Redirect to home page
    window.location.href = 'index.html';
});

// Helper function to show error messages
function showError(element, message) {
    element.textContent = message;
    element.style.display = 'block';
    
    // Hide error after 3 seconds
    setTimeout(function() {
        element.style.display = 'none';
    }, 3000);
}

// Check if user is already logged in
document.addEventListener('DOMContentLoaded', function() {
    const user = JSON.parse(localStorage.getItem('khelconnect_user'));
    
    if (user && user.isLoggedIn) {
        // If on login page, redirect to home
        if (window.location.pathname.includes('login.html')) {
            window.location.href = 'index.html';
        }
    }
});
