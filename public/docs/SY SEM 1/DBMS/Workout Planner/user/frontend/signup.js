// Signup JavaScript for My Workout Planner
// Handles user registration and form validation

class SignupManager {
    constructor() {
        this.supabase = null;
        this.init();
    }

    async init() {
        try {
            // Wait for Supabase to load
            await new Promise(resolve => setTimeout(resolve, 100));
            
            this.supabase = window.getSupabase();
            if (!this.supabase) {
                console.warn('Supabase not available - running in demo mode');
            }

            this.setupEventListeners();
            this.setupPasswordStrength();
            this.setupBMICalculation();
        } catch (error) {
            console.error('Signup initialization error:', error);
        }
    }

    setupEventListeners() {
        // Signup form
        const signupForm = document.getElementById('signup-form');
        if (signupForm) {
            signupForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSignup();
            });
        }

        // Password strength monitoring
        const passwordInput = document.getElementById('signup-password');
        if (passwordInput) {
            passwordInput.addEventListener('input', () => {
                this.updatePasswordStrength();
            });
        }

        // BMI calculation
        const heightInput = document.getElementById('signup-height');
        const weightInput = document.getElementById('signup-weight');
        
        if (heightInput && weightInput) {
            heightInput.addEventListener('input', () => this.calculateBMI());
            weightInput.addEventListener('input', () => this.calculateBMI());
        }

        // Global functions
        window.toggleSignupPassword = this.toggleSignupPassword.bind(this);
        window.toggleConfirmPassword = this.toggleConfirmPassword.bind(this);
        window.loginAsDemo = this.loginAsDemo.bind(this);
        window.showTerms = this.showTerms.bind(this);
        window.showPrivacy = this.showPrivacy.bind(this);
    }

    setupPasswordStrength() {
        // Password strength indicator setup
        const strengthBar = document.getElementById('strength-fill');
        const strengthText = document.getElementById('strength-text');
        
        if (strengthBar && strengthText) {
            // Already set up in HTML, just need to update on input
        }
    }

    setupBMICalculation() {
        // BMI calculation setup
        const heightInput = document.getElementById('signup-height');
        const weightInput = document.getElementById('signup-weight');
        
        if (heightInput && weightInput) {
            // Event listeners already set up in setupEventListeners
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

            // Create user account with Supabase Auth
            const { data: authData, error: authError } = await this.supabase.auth.signUp({
                email: formData.email,
                password: formData.password
            });

            if (authError) {
                throw authError;
            }

            // Create user profile in our database
            const { error: profileError } = await this.supabase
                .from('user_profile')
                .insert([{
                    user_id: authData.user.id, // Use the actual user ID from Supabase Auth
                    name: formData.name,
                    age: formData.age,
                    gender: formData.gender,
                    height: formData.height,
                    weight: formData.weight,
                    email: formData.email
                }]);

            if (profileError) {
                throw profileError;
            }

            this.currentUser = authData.user;
            this.showMessage('Account created successfully!', 'success');
            
            setTimeout(() => {
                this.redirectToApp();
            }, 1500);

        } catch (error) {
            console.error('Signup error:', error);
            this.showMessage(this.getErrorMessage(error), 'error');
        } finally {
            this.setLoading('signup-btn', false);
        }
    }

    async simulateSignup(formData) {
        // Simulate signup delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        this.currentUser = {
            id: '00000000-0000-0000-0000-000000000001', // Use UUID for database compatibility
            email: formData.email,
            user_metadata: {
                name: formData.name
            }
        };

        this.showMessage('Demo account created successfully!', 'success');
        setTimeout(() => {
            this.redirectToApp();
        }, 1500);
    }

    async loginAsDemo() {
        this.setLoading('demo-btn', true);
        
        try {
            // Simulate demo login
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            this.currentUser = {
                id: '1',
                email: 'demo@example.com',
                user_metadata: {
                    name: 'Demo User'
                }
            };

            this.showMessage('Demo login successful!', 'success');
            setTimeout(() => {
                this.redirectToApp();
            }, 1000);
        } finally {
            this.setLoading('demo-btn', false);
        }
    }

    // Form validation
    validateSignupForm(formData) {
        let isValid = true;

        // Name validation
        if (!formData.name) {
            this.showFieldError('signup-name', 'Name is required');
            isValid = false;
        } else if (formData.name.length < 2) {
            this.showFieldError('signup-name', 'Name must be at least 2 characters');
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

        // Password validation
        if (!formData.password) {
            this.showFieldError('signup-password', 'Password is required');
            isValid = false;
        } else if (formData.password.length < 6) {
            this.showFieldError('signup-password', 'Password must be at least 6 characters');
            isValid = false;
        } else if (!this.isStrongPassword(formData.password)) {
            this.showFieldError('signup-password', 'Password must contain uppercase, lowercase, number, and special character');
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


        return isValid;
    }

    // Password strength calculation
    updatePasswordStrength() {
        const password = document.getElementById('signup-password').value;
        const strengthFill = document.getElementById('strength-fill');
        const strengthText = document.getElementById('strength-text');
        
        if (!strengthFill || !strengthText) return;

        const strength = this.calculatePasswordStrength(password);
        
        // Update visual indicator
        strengthFill.style.width = strength.score + '%';
        strengthFill.className = 'strength-fill ' + strength.level;
        strengthText.textContent = strength.text;
        strengthText.className = 'strength-text ' + strength.level;
    }

    calculatePasswordStrength(password) {
        let score = 0;
        let feedback = [];

        if (password.length >= 8) score += 20;
        else feedback.push('at least 8 characters');

        if (/[a-z]/.test(password)) score += 20;
        else feedback.push('lowercase letters');

        if (/[A-Z]/.test(password)) score += 20;
        else feedback.push('uppercase letters');

        if (/[0-9]/.test(password)) score += 20;
        else feedback.push('numbers');

        if (/[^A-Za-z0-9]/.test(password)) score += 20;
        else feedback.push('special characters');

        let level, text;
        if (score < 40) {
            level = 'weak';
            text = 'Weak password';
        } else if (score < 80) {
            level = 'medium';
            text = 'Medium strength';
        } else {
            level = 'strong';
            text = 'Strong password';
        }

        return { score, level, text, feedback };
    }

    // BMI calculation
    calculateBMI() {
        const height = parseFloat(document.getElementById('signup-height').value);
        const weight = parseFloat(document.getElementById('signup-weight').value);
        const bmiPreview = document.getElementById('bmi-preview');
        const bmiValue = document.getElementById('bmi-value');
        const bmiCategory = document.getElementById('bmi-category');

        if (height && weight && height > 0 && weight > 0) {
            const bmi = weight / Math.pow(height / 100, 2);
            const category = this.getBMICategory(bmi);
            
            bmiValue.textContent = bmi.toFixed(1);
            bmiCategory.textContent = category.text;
            bmiCategory.className = 'bmi-category ' + category.level;
            bmiPreview.style.display = 'block';
        } else {
            bmiPreview.style.display = 'none';
        }
    }

    getBMICategory(bmi) {
        if (bmi < 18.5) {
            return { text: 'Underweight', level: 'underweight' };
        } else if (bmi < 25) {
            return { text: 'Normal weight', level: 'normal' };
        } else if (bmi < 30) {
            return { text: 'Overweight', level: 'overweight' };
        } else {
            return { text: 'Obese', level: 'obese' };
        }
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

    isStrongPassword(password) {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(password);
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
            // Handle rate limiting specifically
            if (error.message.includes('Too Many Requests') || error.message.includes('request this after')) {
                return 'Too many signup attempts. Please wait a moment and try again, or use Demo Mode for immediate access.';
            }
            return error.message;
        }
        
        switch (error.code) {
            case 'weak_password':
                return 'Password is too weak. Please choose a stronger password';
            case 'email_address_invalid':
                return 'Please enter a valid email address';
            case 'user_already_exists':
                return 'An account with this email already exists';
            case 'rate_limit_exceeded':
                return 'Too many signup attempts. Please wait a moment and try again, or use Demo Mode for immediate access.';
            default:
                return 'An error occurred. Please try again or use Demo Mode for immediate access.';
        }
    }

    redirectToApp() {
        // Store user session
        if (this.currentUser) {
            sessionStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        }
        
        // Redirect to main app
        window.location.href = 'index.html';
    }

    // UI Functions
    toggleSignupPassword() {
        const passwordInput = document.getElementById('signup-password');
        const passwordIcon = document.getElementById('signup-password-icon');
        
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            passwordIcon.className = 'fas fa-eye-slash';
        } else {
            passwordInput.type = 'password';
            passwordIcon.className = 'fas fa-eye';
        }
    }

    toggleConfirmPassword() {
        const passwordInput = document.getElementById('signup-confirm');
        const passwordIcon = document.getElementById('confirm-password-icon');
        
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            passwordIcon.className = 'fas fa-eye-slash';
        } else {
            passwordInput.type = 'password';
            passwordIcon.className = 'fas fa-eye';
        }
    }

    showTerms() {
        this.showMessage('Terms of Service not implemented in demo', 'info');
    }

    showPrivacy() {
        this.showMessage('Privacy Policy not implemented in demo', 'info');
    }
}

// Initialize signup when DOM is loaded
let signupManager;
document.addEventListener('DOMContentLoaded', () => {
    signupManager = new SignupManager();
});
