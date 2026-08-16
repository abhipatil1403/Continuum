/**
 * KhelConnect Profile Module
 * Handles user profile functionality
 */

const profile = (function() {
    // DOM elements cache
    const DOM = {
        profileName: document.getElementById('profile-name'),
        profileEmail: document.getElementById('profile-email'),
        profilePicture: document.getElementById('profile-picture'),
        firstName: document.getElementById('first-name'),
        lastName: document.getElementById('last-name'),
        email: document.getElementById('email'),
        personalInfoForm: document.getElementById('personal-info-form'),
        securityForm: document.getElementById('security-form'),
        notificationsForm: document.getElementById('notifications-form'),
        activityLog: document.getElementById('activity-log')
    };

    /**
     * Initialize the profile module
     */
    function init() {
        console.log('Profile module initializing...');
        loadUserProfile();
        setupEventListeners();
    }

    /**
     * Set up event listeners for forms
     */
    function setupEventListeners() {
        // Personal info form submission
        if (DOM.personalInfoForm) {
            DOM.personalInfoForm.addEventListener('submit', function(e) {
                e.preventDefault();
                savePersonalInfo();
            });
        }

        // Security form submission
        if (DOM.securityForm) {
            DOM.securityForm.addEventListener('submit', function(e) {
                e.preventDefault();
                updatePassword();
            });
        }

        // Notifications form submission
        if (DOM.notificationsForm) {
            DOM.notificationsForm.addEventListener('submit', function(e) {
                e.preventDefault();
                saveNotificationPreferences();
            });
        }
    }

    /**
     * Load user profile data from localStorage
     */
    function loadUserProfile() {
        // Check if user is logged in
        const user = JSON.parse(localStorage.getItem('currentUser'));
        
        if (!user) {
            // Redirect to login page if not logged in
            window.location.href = 'login.html';
            return;
        }

        // Update profile header
        if (DOM.profileName) DOM.profileName.textContent = `${user.firstName} ${user.lastName}`;
        if (DOM.profileEmail) DOM.profileEmail.textContent = user.email;
        
        // Set profile picture based on user type (demo purposes)
        if (DOM.profilePicture) {
            if (user.email === 'admin@khelconnect.gov.in') {
                DOM.profilePicture.src = 'images/admin-avatar.jpg';
            } else if (user.email === 'virat@example.com') {
                DOM.profilePicture.src = 'images/virat-avatar.jpg';
            } else {
                DOM.profilePicture.src = 'images/user-placeholder.jpg';
            }
        }

        // Fill form fields
        if (DOM.firstName) DOM.firstName.value = user.firstName;
        if (DOM.lastName) DOM.lastName.value = user.lastName;
        if (DOM.email) DOM.email.value = user.email;

        // Add a mock activity entry
        addActivityEntry();
    }

    /**
     * Save personal information
     */
    function savePersonalInfo() {
        // Get current user
        const user = JSON.parse(localStorage.getItem('currentUser'));
        if (!user) return;

        // Get form values
        const phone = document.getElementById('phone').value;
        const bio = document.getElementById('bio').value;

        // Update user object
        user.phone = phone;
        user.bio = bio;

        // Save updated user to localStorage
        localStorage.setItem('currentUser', JSON.stringify(user));

        // Show success message
        showAlert('Personal information updated successfully!', 'success');
    }

    /**
     * Update password
     */
    function updatePassword() {
        // Get form values
        const currentPassword = document.getElementById('current-password').value;
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        // Get current user
        const user = JSON.parse(localStorage.getItem('currentUser'));
        if (!user) return;

        // Validate current password
        if (currentPassword !== user.password) {
            showAlert('Current password is incorrect.', 'danger');
            return;
        }

        // Validate new password
        if (newPassword !== confirmPassword) {
            showAlert('New passwords do not match.', 'danger');
            return;
        }

        // Update password
        user.password = newPassword;

        // Save updated user to localStorage
        localStorage.setItem('currentUser', JSON.stringify(user));

        // Clear form
        document.getElementById('current-password').value = '';
        document.getElementById('new-password').value = '';
        document.getElementById('confirm-password').value = '';

        // Show success message
        showAlert('Password updated successfully!', 'success');
    }

    /**
     * Save notification preferences
     */
    function saveNotificationPreferences() {
        // Get form values
        const emailNotifications = document.getElementById('email-notifications').checked;
        const newsletter = document.getElementById('newsletter').checked;

        // Get current user
        const user = JSON.parse(localStorage.getItem('currentUser'));
        if (!user) return;

        // Update user preferences
        user.preferences = {
            emailNotifications,
            newsletter
        };

        // Save updated user to localStorage
        localStorage.setItem('currentUser', JSON.stringify(user));

        // Show success message
        showAlert('Notification preferences saved!', 'success');
    }

    /**
     * Add a mock activity entry to the activity log
     */
    function addActivityEntry() {
        if (!DOM.activityLog) return;

        // Clear "No recent activity" message
        DOM.activityLog.innerHTML = '';

        // Add current login
        const now = new Date();
        const dateString = now.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        const entry = document.createElement('tr');
        entry.innerHTML = `
            <td>${dateString}</td>
            <td>Account login</td>
            <td>192.168.1.${Math.floor(Math.random() * 255)}</td>
        `;
        DOM.activityLog.appendChild(entry);

        // Add a previous activity for demo purposes
        const previousDate = new Date();
        previousDate.setDate(previousDate.getDate() - 1);
        const prevDateString = previousDate.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        const prevEntry = document.createElement('tr');
        prevEntry.innerHTML = `
            <td>${prevDateString}</td>
            <td>Profile updated</td>
            <td>192.168.1.${Math.floor(Math.random() * 255)}</td>
        `;
        DOM.activityLog.appendChild(prevEntry);
    }

    /**
     * Show alert message
     * @param {string} message - Alert message
     * @param {string} type - Alert type (success, danger, warning, info)
     */
    function showAlert(message, type) {
        // Create alert element
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
        alertDiv.role = 'alert';
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;

        // Find the form that was submitted
        const targetForm = document.querySelector('form:focus-within');
        if (targetForm) {
            // Insert alert before the form
            targetForm.parentNode.insertBefore(alertDiv, targetForm);
        } else {
            // Insert at the top of the profile container as fallback
            const profileContainer = document.querySelector('.profile-container');
            if (profileContainer) {
                profileContainer.insertBefore(alertDiv, profileContainer.firstChild);
            }
        }

        // Auto-dismiss after 5 seconds
        setTimeout(() => {
            alertDiv.classList.remove('show');
            setTimeout(() => alertDiv.remove(), 150);
        }, 5000);
    }

    // Public API
    return {
        init: init
    };
})();

// Initialize profile module when DOM is ready
document.addEventListener('DOMContentLoaded', profile.init);
