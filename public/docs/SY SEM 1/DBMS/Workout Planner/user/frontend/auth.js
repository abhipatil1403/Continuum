// Authentication JavaScript for My Workout Planner
// Handles login, signup, and session management

class AuthManager {
    constructor() {
        this.supabase = null;
        this.currentUser = null;
        this.init();
    }

    async init() {
        try {
            // Initialize Supabase immediately
            
            this.supabase = window.getSupabase();
            if (!this.supabase) {
                console.warn('Supabase not available - running in demo mode');
            }

            this.setupEventListeners();
            this.checkExistingSession();
        } catch (error) {
            console.error('Auth initialization error:', error);
        }
    }

    setupEventListeners() {
        // Login form
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }

        // Signup form
        const signupForm = document.getElementById('signup-form');
        if (signupForm) {
            signupForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSignup();
            });
        }

        // Forgot password form
        const forgotForm = document.getElementById('forgot-form');
        if (forgotForm) {
            forgotForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleForgotPassword();
            });
        }

        // Password toggle
        window.togglePassword = this.togglePassword.bind(this);
        window.showSignup = this.showSignup.bind(this);
        window.closeSignup = this.closeSignup.bind(this);
        window.showForgotPassword = this.showForgotPassword.bind(this);
        window.closeForgotPassword = this.closeForgotPassword.bind(this);
        window.loginAsDemo = this.loginAsDemo.bind(this);
        window.showTerms = this.showTerms.bind(this);
        window.showPrivacy = this.showPrivacy.bind(this);
    }

    async checkExistingSession() {
        try {
            const rememberUser = localStorage.getItem('rememberUser') === 'true';
            const sessionUserStr = sessionStorage.getItem('currentUser');
            const localUserStr = localStorage.getItem('currentUser');

            if (!this.supabase) {
                // Demo mode - prefer localStorage if remember me was used
                const stored = rememberUser ? localUserStr : sessionUserStr;
                if (stored) {
                    this.currentUser = JSON.parse(stored);
                    // Only redirect if we're on login page, not if we're already on index
                    if (window.location.pathname.includes('login.html') || window.location.pathname.includes('signup.html')) {
                        this.redirectToApp();
                    }
                }
                return;
            }

            const { data: { session } } = await this.supabase.auth.getSession();
            // Redirect if we have a persisted Supabase session OR a session user stored
            if (session) {
                this.currentUser = session.user;
                // Only redirect if we're on login page, not if we're already on index
                if (window.location.pathname.includes('login.html') || window.location.pathname.includes('signup.html')) {
                    this.redirectToApp();
                }
                return;
            }

            // Fallback to previously stored user
            const stored = rememberUser ? localUserStr : sessionUserStr;
            if (stored) {
                this.currentUser = JSON.parse(stored);
                // Only redirect if we're on login page, not if we're already on index
                if (window.location.pathname.includes('login.html') || window.location.pathname.includes('signup.html')) {
                    this.redirectToApp();
                }
                return;
            }
        } catch (error) {
            console.error('Error checking session:', error);
        }
    }

    async handleLogin() {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('remember-me').checked;

        if (!this.validateLoginForm(email, password)) {
            return;
        }

        this.setLoading('login-btn', true);

        try {
            if (!this.supabase) {
                // Demo mode - simulate login
                await this.simulateLogin(email);
                return;
            }

            const { data, error } = await this.supabase.auth.signInWithPassword({
                email: email,
                password: password
            });

            if (error) {
                throw error;
            }

            this.currentUser = data.user;
            this.showMessage('Login successful!', 'success');
            
            // Store session preference
            if (rememberMe) {
                localStorage.setItem('rememberUser', 'true');
            } else {
                localStorage.removeItem('rememberUser');
                localStorage.removeItem('currentUser');
            }

            this.redirectToApp();

        } catch (error) {
            console.error('Login error:', error);
            this.showMessage(this.getErrorMessage(error), 'error');
        } finally {
            this.setLoading('login-btn', false);
        }
    }

    async handleSignup() {
        const formData = this.getSignupFormData();
        
        if (!this.validateSignupForm(formData)) {
            return;
        }

        this.setLoading('signup-btn', true);

        try {
            if (!this.supabase) {
                // Demo mode - simulate signup
                await this.simulateSignup(formData);
                return;
            }

            // Create user account
            const { data: authData, error: authError } = await this.supabase.auth.signUp({
                email: formData.email,
                password: formData.password
            });

            if (authError) {
                throw authError;
            }

            // Create user profile using stored procedure
            // The procedure validates all mandatory fields and the trigger also performs validation
            const { data: profileData, error: profileError } = await this.supabase
                .rpc('insert_user_profile', {
                    p_user_id: authData.user.id,
                    p_name: formData.name,
                    p_age: parseInt(formData.age),
                    p_gender: formData.gender,
                    p_height: parseFloat(formData.height),
                    p_weight: parseFloat(formData.weight),
                    p_email: formData.email
                });

            if (profileError) {
                throw profileError;
            }

            // Check if the procedure returned an error
            if (profileData && !profileData.success) {
                throw new Error(profileData.error || 'Failed to create user profile');
            }

            this.currentUser = authData.user;
            this.showMessage('Account created successfully! Please check your email to verify your account.', 'success');
            this.redirectToApp();

        } catch (error) {
            console.error('Signup error:', error);
            this.showMessage(this.getErrorMessage(error), 'error');
        } finally {
            this.setLoading('signup-btn', false);
        }
    }

    async handleForgotPassword() {
        const email = document.getElementById('forgot-email').value;

        if (!email) {
            this.showMessage('Please enter your email address', 'error');
            return;
        }

        this.setLoading('forgot-btn', true);

        try {
            if (!this.supabase) {
                this.showMessage('Password reset not available in demo mode', 'info');
                return;
            }

            const { error } = await this.supabase.auth.resetPasswordForEmail(email);

            if (error) {
                throw error;
            }

            this.showMessage('Password reset email sent! Check your inbox.', 'success');
            this.closeForgotPassword();

        } catch (error) {
            console.error('Forgot password error:', error);
            this.showMessage(this.getErrorMessage(error), 'error');
        } finally {
            this.setLoading('forgot-btn', false);
        }
    }

    // Demo mode functions
    async simulateLogin(email) {
        // Simulate minimal processing delay
        // (removed long artificial delay)
        
        this.currentUser = {
            id: '00000000-0000-0000-0000-000000000001', // Use UUID for database compatibility
            email: email,
            user_metadata: {
                name: 'Demo User'
            }
        };

        this.showMessage('Demo login successful!', 'success');
        this.redirectToApp();
    }

    async simulateSignup(formData) {
        // Simulate minimal processing delay
        // (removed long artificial delay)
        
        this.currentUser = {
            id: '00000000-0000-0000-0000-000000000001', // Use UUID for database compatibility
            email: formData.email,
            user_metadata: {
                name: formData.name
            }
        };

        this.showMessage('Demo account created successfully!', 'success');
        this.redirectToApp();
    }

    async loginAsDemo() {
        this.setLoading('demo-btn', true);
        
        try {
            await this.simulateLogin('demo@example.com');
        } finally {
            this.setLoading('demo-btn', false);
        }
    }

    // Form validation
    validateLoginForm(email, password) {
        let isValid = true;

        if (!email) {
            this.showFieldError('email', 'Email is required');
            isValid = false;
        } else if (!this.isValidEmail(email)) {
            this.showFieldError('email', 'Please enter a valid email address');
            isValid = false;
        } else {
            this.clearFieldError('email');
        }

        if (!password) {
            this.showFieldError('password', 'Password is required');
            isValid = false;
        } else if (password.length < 6) {
            this.showFieldError('password', 'Password must be at least 6 characters');
            isValid = false;
        } else {
            this.clearFieldError('password');
        }

        return isValid;
    }

    validateSignupForm(formData) {
        let isValid = true;

        // Name validation
        if (!formData.name) {
            this.showFieldError('signup-name', 'Name is required');
            isValid = false;
        } else {
            this.clearFieldError('signup-name');
        }

        // Email validation
        if (!formData.email) {
            this.showFieldError('signup-email', 'Email is required');
            isValid = false;
        } else if (!this.isValidEmail(formData.email)) {
            this.showFieldError('signup-email', 'Please enter a valid email address');
            isValid = false;
        } else {
            this.clearFieldError('signup-email');
        }

        // Password validation
        if (!formData.password) {
            this.showFieldError('signup-password', 'Password is required');
            isValid = false;
        } else if (formData.password.length < 6) {
            this.showFieldError('signup-password', 'Password must be at least 6 characters');
            isValid = false;
        } else {
            this.clearFieldError('signup-password');
        }

        // Confirm password validation
        if (!formData.confirm) {
            this.showFieldError('signup-confirm', 'Please confirm your password');
            isValid = false;
        } else if (formData.password !== formData.confirm) {
            this.showFieldError('signup-confirm', 'Passwords do not match');
            isValid = false;
        } else {
            this.clearFieldError('signup-confirm');
        }

        // Age validation
        if (!formData.age) {
            this.showFieldError('signup-age', 'Age is required');
            isValid = false;
        } else if (formData.age < 13 || formData.age > 120) {
            this.showFieldError('signup-age', 'Age must be between 13 and 120');
            isValid = false;
        } else {
            this.clearFieldError('signup-age');
        }

        // Gender validation
        if (!formData.gender) {
            this.showFieldError('signup-gender', 'Gender is required');
            isValid = false;
        } else {
            this.clearFieldError('signup-gender');
        }

        // Height validation
        if (!formData.height) {
            this.showFieldError('signup-height', 'Height is required');
            isValid = false;
        } else if (formData.height < 100 || formData.height > 250) {
            this.showFieldError('signup-height', 'Height must be between 100 and 250 cm');
            isValid = false;
        } else {
            this.clearFieldError('signup-height');
        }

        // Weight validation
        if (!formData.weight) {
            this.showFieldError('signup-weight', 'Weight is required');
            isValid = false;
        } else if (formData.weight < 30 || formData.weight > 300) {
            this.showFieldError('signup-weight', 'Weight must be between 30 and 300 kg');
            isValid = false;
        } else {
            this.clearFieldError('signup-weight');
        }

        // Terms validation
        if (!document.getElementById('signup-terms').checked) {
            this.showMessage('You must agree to the terms and conditions', 'error');
            isValid = false;
        }

        return isValid;
    }

    // Utility functions
    getSignupFormData() {
        return {
            name: document.getElementById('signup-name').value,
            email: document.getElementById('signup-email').value,
            password: document.getElementById('signup-password').value,
            confirm: document.getElementById('signup-confirm').value,
            age: parseInt(document.getElementById('signup-age').value),
            gender: document.getElementById('signup-gender').value,
            height: parseFloat(document.getElementById('signup-height').value),
            weight: parseFloat(document.getElementById('signup-weight').value)
        };
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showFieldError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const formGroup = field.closest('.form-group');
        
        formGroup.classList.add('error');
        
        // Remove existing error message
        const existingError = formGroup.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Add new error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        formGroup.appendChild(errorDiv);
    }

    clearFieldError(fieldId) {
        const field = document.getElementById(fieldId);
        const formGroup = field.closest('.form-group');
        
        formGroup.classList.remove('error');
        
        const errorMessage = formGroup.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }

    setLoading(buttonId, isLoading) {
        const button = document.getElementById(buttonId);
        if (!button) return;

        const btnText = button.querySelector('.btn-text');
        const btnLoading = button.querySelector('.btn-loading');

        if (isLoading) {
            button.disabled = true;
            if (btnText) btnText.style.display = 'none';
            if (btnLoading) btnLoading.style.display = 'flex';
        } else {
            button.disabled = false;
            if (btnText) btnText.style.display = 'flex';
            if (btnLoading) btnLoading.style.display = 'none';
        }
    }

    showMessage(message, type = 'info') {
        // Remove existing messages
        const existingMessages = document.querySelectorAll('.auth-message');
        existingMessages.forEach(msg => msg.remove());

        // Create new message
        const messageDiv = document.createElement('div');
        messageDiv.className = `auth-message message ${type}`;
        messageDiv.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            ${message}
        `;

        // Insert at top of auth card
        const authCard = document.querySelector('.auth-card');
        if (authCard) {
            authCard.insertBefore(messageDiv, authCard.firstChild);
        }

        // Auto-remove after 5 seconds
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }

    getErrorMessage(error) {
        if (error.message) {
            return error.message;
        }
        
        switch (error.code) {
            case 'invalid_credentials':
                return 'Invalid email or password';
            case 'email_not_confirmed':
                return 'Please check your email and click the confirmation link';
            case 'user_not_found':
                return 'No account found with this email address';
            case 'weak_password':
                return 'Password is too weak. Please choose a stronger password';
            case 'email_address_invalid':
                return 'Please enter a valid email address';
            default:
                return 'An error occurred. Please try again.';
        }
    }

    redirectToApp() {
        // Store user session
        if (this.currentUser) {
            const rememberUser = localStorage.getItem('rememberUser') === 'true';
            const serialized = JSON.stringify(this.currentUser);
            if (rememberUser) {
                localStorage.setItem('currentUser', serialized);
                // Also clear sessionStorage to avoid conflicts
                sessionStorage.removeItem('currentUser');
            } else {
                sessionStorage.setItem('currentUser', serialized);
                // Also clear localStorage to avoid conflicts
                localStorage.removeItem('currentUser');
            }
        }
        
        // Redirect to main app
        window.location.href = 'index.html';
    }

    // UI Functions
    togglePassword() {
        const passwordInput = document.getElementById('password');
        const passwordIcon = document.getElementById('password-icon');
        
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            passwordIcon.className = 'fas fa-eye-slash';
        } else {
            passwordInput.type = 'password';
            passwordIcon.className = 'fas fa-eye';
        }
    }

    showSignup() {
        // Redirect to signup page
        window.location.href = 'signup.html';
    }

    closeSignup() {
        // Not needed for separate signup page
    }

    showForgotPassword() {
        document.getElementById('forgot-modal').classList.add('active');
    }

    closeForgotPassword() {
        document.getElementById('forgot-modal').classList.remove('active');
        document.getElementById('forgot-form').reset();
        this.clearAllErrors();
    }

    showTerms() {
        this.showMessage('Terms of Service not implemented in demo', 'info');
    }

    showPrivacy() {
        this.showMessage('Privacy Policy not implemented in demo', 'info');
    }

    clearAllErrors() {
        document.querySelectorAll('.form-group.error').forEach(group => {
            group.classList.remove('error');
        });
        document.querySelectorAll('.error-message').forEach(msg => {
            msg.remove();
        });
    }
}

// Initialize authentication when DOM is loaded
let authManager;
document.addEventListener('DOMContentLoaded', () => {
    authManager = new AuthManager();
});
