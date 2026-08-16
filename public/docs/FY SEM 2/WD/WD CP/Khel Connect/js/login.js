// Simple login validation
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const errorMessage = document.getElementById('errorMessage');
            
            // Very simple validation - in a real app, this would be server-side
            if (username === 'admin' && password === 'password123') {
                // Successful login
                errorMessage.textContent = '';
                alert('Login successful! Redirecting to dashboard...');
                window.location.href = 'dashboard.html';
            } else {
                // Failed login
                errorMessage.textContent = 'Invalid username or password. Please try again.';
            }
        });
    }
});
