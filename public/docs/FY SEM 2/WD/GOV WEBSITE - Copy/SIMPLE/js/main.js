// Simple main.js file for KhelConnect website

// Check if user is logged in
document.addEventListener('DOMContentLoaded', function() {
    const loginLink = document.getElementById('login-link');
    const user = JSON.parse(localStorage.getItem('khelconnect_user'));
    
    if (user && user.isLoggedIn) {
        // User is logged in, change login link to user's name with dropdown
        loginLink.textContent = user.name;
        loginLink.classList.add('logged-in');
        loginLink.href = '#';
        
        // Create dropdown menu
        const dropdown = document.createElement('div');
        dropdown.className = 'dropdown-menu';
        
        // Add dropdown items
        const profileLink = document.createElement('a');
        profileLink.href = '#';
        profileLink.textContent = 'My Profile';
        
        const logoutLink = document.createElement('a');
        logoutLink.href = '#';
        logoutLink.textContent = 'Logout';
        logoutLink.addEventListener('click', function(e) {
            e.preventDefault();
            // Clear user data from localStorage
            localStorage.removeItem('khelconnect_user');
            // Reload page
            window.location.reload();
        });
        
        // Append items to dropdown
        dropdown.appendChild(profileLink);
        dropdown.appendChild(logoutLink);
        
        // Add dropdown to login link
        loginLink.parentNode.appendChild(dropdown);
        
        // Show dropdown on click
        loginLink.addEventListener('click', function(e) {
            e.preventDefault();
            dropdown.classList.toggle('show');
        });
        
        // Hide dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!loginLink.contains(e.target)) {
                dropdown.classList.remove('show');
            }
        });
    }
    
    // Handle newsletter form submission
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Check if user is logged in
            if (!user || !user.isLoggedIn) {
                alert('Please log in to subscribe to our newsletter.');
                window.location.href = 'login.html';
                return;
            }
            
            // Show success message
            alert('Thank you for subscribing to our newsletter!');
        });
    }
    
    // Handle contact form submission
    const contactForm = document.getElementById('contact-form');
    const loginRequiredMessage = document.getElementById('login-required-message');
    
    if (contactForm) {
        // Check if user is logged in and show/hide message accordingly
        if (!user || !user.isLoggedIn) {
            if (loginRequiredMessage) {
                loginRequiredMessage.classList.remove('hidden');
            }
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                alert('Please log in to submit the contact form.');
                window.location.href = 'login.html';
            });
        } else {
            // User is logged in, hide the message and handle normal submission
            if (loginRequiredMessage) {
                loginRequiredMessage.classList.add('hidden');
            }
            
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Get form values
                const name = document.getElementById('name').value;
                const email = document.getElementById('email').value;
                const subject = document.getElementById('subject').value;
                const message = document.getElementById('message').value;
                
                // In a real application, you would send this data to a server
                // For now, just show a success message
                alert('Thank you for your message! We will get back to you soon.');
                
                // Reset the form
                contactForm.reset();
            });
        }
    }
});
