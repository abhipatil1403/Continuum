/**
 * KhelConnect Authentication Module
 * Handles user registration, login, and session management
 */

const Auth = (function() {
    // DOM Elements
    const DOM = {};
    
    // Local storage keys
    const STORAGE_KEYS = {
        USER: 'khelconnect_user',
        AUTH_TOKEN: 'khelconnect_auth_token'
    };
    
    /**
     * Initialize the authentication module
     */
    function init() {
        console.log('Auth module initializing...');
        
        // Cache DOM elements
        cacheDOM();
        
        // Set up event listeners
        setupEventListeners();
        
        // Check if user is logged in
        checkAuthStatus();
        
        console.log('Auth module initialized');
    }
    
    /**
     * Cache DOM elements
     */
    function cacheDOM() {
        // Login form elements
        DOM.loginForm = document.getElementById('login-form');
        DOM.loginError = document.getElementById('login-error');
        DOM.errorMessage = document.getElementById('error-message');
        
        // Signup form elements (may exist if admin creates users)
        DOM.signupForm = document.getElementById('signup-form');
        
        // Form submission elements
        DOM.submissionForms = document.querySelectorAll('.requires-auth');
        
        // Forms that require authentication
        DOM.authForms = document.querySelectorAll('.needs-authentication');
        
        // Login required messages
        DOM.loginRequiredMessages = document.querySelectorAll('.login-required-message');
    }
    
    /**
     * Set up event listeners
     */
    function setupEventListeners() {
        // Login form submission
        if (DOM.loginForm) {
            DOM.loginForm.addEventListener('submit', handleLogin);
        }
        
        // Signup form submission
        if (DOM.signupForm) {
            DOM.signupForm.addEventListener('submit', handleSignup);
        }
        
        // Check for protected forms that require authentication
        if (DOM.submissionForms) {
            DOM.submissionForms.forEach(form => {
                form.addEventListener('submit', checkAuthBeforeSubmit);
            });
        }
        
        // Logout button
        document.addEventListener('click', function(e) {
            if (e.target && e.target.id === 'logout-btn') {
                logout();
                e.preventDefault();
            }
        });
    }
    
    /**
     * Handle login form submission
     * @param {Event} e - Form submission event
     */
    function handleLogin(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('remember-me').checked;
        
        try {
            // Use the UserManager from users.js to find the user
            const user = UserManager.findUser(email, password);
            
            if (user) {
                // Create a session
                const session = {
                    userId: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    userType: user.userType,
                    expiresAt: rememberMe ? Date.now() + (30 * 24 * 60 * 60 * 1000) : Date.now() + (24 * 60 * 60 * 1000)
                };
                
                // Generate a fake auth token (in a real app, this would come from the server)
                const authToken = btoa(JSON.stringify({
                    userId: user.id,
                    timestamp: Date.now()
                }));
                
                // Store in local storage
                localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(session));
                localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, authToken);
                
                // Redirect to home page
                window.location.href = 'index.html';
            } else {
                showError('Invalid email or password. Please try again.');
            }
        } catch (error) {
            console.error('Login error:', error);
            showError('An error occurred during login. Please try again.');
        }
    }
    
    /**
     * Handle signup form submission
     * @param {Event} e - Form submission event
     */
    function handleSignup(e) {
        e.preventDefault();
        
        const firstName = document.getElementById('first-name').value;
        const lastName = document.getElementById('last-name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        const userType = document.querySelector('input[name="user-type"]:checked').value;
        const termsAgreed = document.getElementById('terms-agree').checked;
        
        // Validate form
        if (password !== confirmPassword) {
            showError('Passwords do not match. Please try again.');
            return;
        }
        
        if (!termsAgreed) {
            showError('You must agree to the Terms and Conditions to create an account.');
            return;
        }
        
        try {
            // Check if email already exists using UserManager
            if (UserManager.emailExists(email)) {
                showError('An account with this email already exists. Please login instead.');
                return;
            }
            
            // Create a new user using UserManager
            const userData = {
                firstName,
                lastName,
                email,
                password,
                userType,
                phone
            };
            
            // Add the new user to our user management system
            const newUser = UserManager.addUser(userData);
            
            // Create a session
            const session = {
                userId: newUser.id,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email,
                userType: newUser.userType,
                expiresAt: Date.now() + (24 * 60 * 60 * 1000)
            };
            
            // Generate a fake auth token (in a real app, this would come from the server)
            const authToken = btoa(JSON.stringify({
                userId: newUser.id,
                timestamp: Date.now()
            }));
            
            // Store in local storage
            localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(session));
            localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, authToken);
            
            // Show success message and redirect
            alert('Account created successfully! You are now logged in.');
            window.location.href = 'index.html';
        } catch (error) {
            console.error('Signup error:', error);
            showError('An error occurred during signup. Please try again.');
        }
    }
    
    /**
     * Check if user is authenticated before form submission
     * @param {Event} e - Form submission event
     */
    function checkAuthBeforeSubmit(e) {
        if (!isAuthenticated()) {
            e.preventDefault();
            
            // Store the current URL to redirect back after login
            sessionStorage.setItem('redirect_after_login', window.location.href);
            
            // Show login required message
            alert('Please log in to submit this form.');
            
            // Redirect to login page
            window.location.href = 'login.html';
        }
    }
    
    /**
     * Check authentication status and update UI accordingly
     */
    function checkAuthStatus() {
        const user = getCurrentUser();
        
        if (user && isAuthenticated()) {
            // User is logged in
            updateUIForLoggedInUser(user);
            
            // Check for redirect after login
            const redirectUrl = sessionStorage.getItem('redirect_after_login');
            if (redirectUrl && window.location.pathname.includes('login.html')) {
                sessionStorage.removeItem('redirect_after_login');
                window.location.href = redirectUrl;
            }
        } else {
            // User is not logged in
            updateUIForLoggedOutUser();
            
            // If on a protected page, redirect to login
            if (document.querySelector('.protected-page')) {
                window.location.href = 'login.html';
            }
        }
    }
    
    /**
     * Update UI for logged in user
     * @param {Object} user - User object
     */
    function updateUIForLoggedInUser(user) {
        // Update navigation - find the login button in the navbar
        const loginBtn = document.querySelector('.navbar .btn-outline-light[href="login.html"]');
        
        if (loginBtn) {
            // Get the parent container (usually a div with d-flex class)
            const navBtnsContainer = loginBtn.parentElement;
            
            // Create elements manually instead of using innerHTML
            // This avoids the Bootstrap dropdown initialization issues
            
            // First, clear the container
            navBtnsContainer.innerHTML = '';
            
            // Create dropdown div
            const dropdownDiv = document.createElement('div');
            dropdownDiv.className = 'dropdown';
            
            // Create dropdown button
            const dropdownButton = document.createElement('button');
            dropdownButton.className = 'btn btn-outline-light dropdown-toggle';
            dropdownButton.type = 'button';
            dropdownButton.id = 'userDropdown';
            dropdownButton.innerHTML = `<i class="fas fa-user-circle"></i> ${user.firstName}`;
            
            // Create dropdown menu
            const dropdownMenu = document.createElement('ul');
            dropdownMenu.className = 'dropdown-menu dropdown-menu-end';
            dropdownMenu.setAttribute('aria-labelledby', 'userDropdown');
            
            // Add only logout functionality to the menu
            dropdownMenu.innerHTML = `
                <li><a class="dropdown-item" href="#" id="logout-btn"><i class="fas fa-sign-out-alt"></i> Logout</a></li>
            `;
            
            // Append elements to the DOM
            dropdownDiv.appendChild(dropdownButton);
            dropdownDiv.appendChild(dropdownMenu);
            navBtnsContainer.appendChild(dropdownDiv);
            
            // Set up the dropdown manually without using Bootstrap's data attributes
            dropdownButton.addEventListener('click', function(e) {
                e.preventDefault();
                dropdownMenu.classList.toggle('show');
                dropdownButton.setAttribute('aria-expanded', dropdownMenu.classList.contains('show'));
            });
            
            // Close dropdown when clicking outside
            document.addEventListener('click', function(e) {
                if (!dropdownDiv.contains(e.target)) {
                    dropdownMenu.classList.remove('show');
                    dropdownButton.setAttribute('aria-expanded', 'false');
                }
            });
        }
        
        // Enable submission forms
        if (DOM.submissionForms) {
            DOM.submissionForms.forEach(form => {
                form.classList.remove('disabled');
                const submitBtn = form.querySelector('button[type="submit"]');
                if (submitBtn) {
                    submitBtn.disabled = false;
                }
            });
        }
        
        // Enable forms that need authentication
        if (DOM.authForms) {
            DOM.authForms.forEach(form => {
                form.classList.remove('disabled');
                const submitBtn = form.querySelector('button[type="submit"]');
                if (submitBtn) {
                    submitBtn.disabled = false;
                }
            });
        }
        
        // Hide login required messages
        if (DOM.loginRequiredMessages) {
            DOM.loginRequiredMessages.forEach(message => {
                message.style.display = 'none';
            });
        }
        
        // Show user-specific content
        document.querySelectorAll('.auth-content').forEach(el => {
            el.classList.remove('d-none');
        });
        
        // Hide non-authenticated content
        document.querySelectorAll('.non-auth-content').forEach(el => {
            el.classList.add('d-none');
        });
    }
    
    /**
     * Update UI for logged out user
     */
    function updateUIForLoggedOutUser() {
        // Find user dropdown if it exists
        const userDropdown = document.querySelector('.navbar .dropdown');
        
        if (userDropdown) {
            // Get the parent container
            const navBtnsContainer = userDropdown.parentElement;
            
            // Replace user dropdown with login button
            navBtnsContainer.innerHTML = `
                <a href="login.html" class="btn btn-outline-light"><i class="fas fa-sign-in-alt"></i> Login</a>
            `;
        }
        
        // Disable submission forms
        if (DOM.submissionForms) {
            DOM.submissionForms.forEach(form => {
                form.classList.add('disabled');
                const submitBtn = form.querySelector('button[type="submit"]');
                if (submitBtn) {
                    submitBtn.disabled = true;
                }
            });
        }
        
        // Disable forms that need authentication
        if (DOM.authForms) {
            DOM.authForms.forEach(form => {
                form.classList.add('disabled');
                const submitBtn = form.querySelector('button[type="submit"]');
                if (submitBtn) {
                    submitBtn.disabled = true;
                }
            });
        }
        
        // Show login required messages
        if (DOM.loginRequiredMessages) {
            DOM.loginRequiredMessages.forEach(message => {
                message.style.display = 'block';
            });
        }
        
        // Hide user-specific content
        document.querySelectorAll('.auth-content').forEach(el => {
            el.classList.add('d-none');
        });
        
        // Show non-authenticated content
        document.querySelectorAll('.non-auth-content').forEach(el => {
            el.classList.remove('d-none');
        });
    }
    
    /**
     * Get current user from local storage
     * @returns {Object|null} User object or null if not logged in
     */
    function getCurrentUser() {
        try {
            const userJson = localStorage.getItem(STORAGE_KEYS.USER);
            if (!userJson) return null;
            
            const user = JSON.parse(userJson);
            
            // Check if session has expired
            if (user.expiresAt && user.expiresAt < Date.now()) {
                // Session expired, clear storage
                logout();
                return null;
            }
            
            return user;
        } catch (error) {
            console.error('Error getting current user:', error);
            return null;
        }
    }
    
    /**
     * Check if user is authenticated
     * @returns {boolean} True if authenticated, false otherwise
     */
    function isAuthenticated() {
        const user = getCurrentUser();
        const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        
        return !!(user && token);
    }
    
    /**
     * Logout user
     */
    function logout() {
        // Clear local storage
        localStorage.removeItem(STORAGE_KEYS.USER);
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        
        // Update UI
        updateUIForLoggedOutUser();
        
        // Redirect to home page
        window.location.href = 'index.html';
    }
    
    /**
     * Show error message
     * @param {string} message - Error message to display
     */
    function showError(message) {
        if (DOM.loginError && DOM.errorMessage) {
            DOM.errorMessage.textContent = message;
            DOM.loginError.classList.remove('d-none');
            
            // Hide after 5 seconds
            setTimeout(() => {
                DOM.loginError.classList.add('d-none');
            }, 5000);
        } else {
            // Fallback to alert if DOM elements not found
            alert(message);
        }
    }
    
    // Public API
    return {
        init,
        isAuthenticated,
        getCurrentUser,
        logout
    };
})();

// Initialize auth module when DOM is ready
document.addEventListener('DOMContentLoaded', Auth.init);
