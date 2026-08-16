/**
 * KhelConnect - Event Registration Module
 * Handles event registration functionality
 */

// Use strict mode for better error handling and performance
'use strict';

// Create a simple registration page redirect instead of using modals
document.addEventListener('DOMContentLoaded', function() {
    // Add click event listeners to all register buttons
    setupRegisterButtons();
});

/**
 * Set up event listeners for register buttons
 */
function setupRegisterButtons() {
    // Use event delegation for all register buttons
    document.addEventListener('click', function(event) {
        // Check if the clicked element or its parent is a register button
        const registerBtn = event.target.closest('.register-btn');
        
        if (registerBtn) {
            event.preventDefault();
            const eventId = registerBtn.getAttribute('data-event-id');
            
            // Redirect to a dedicated registration page with the event ID
            window.location.href = `register.html?event=${eventId}`;
        }
    });
}

/**
 * Handle registration form on the register.html page
 */
function initRegistrationForm() {
    // Only run this on the registration page
    if (!window.location.href.includes('register.html')) return;
    
    // Get event ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get('event');
    
    if (!eventId) {
        showError('No event specified for registration');
        return;
    }
    
    // Get event data
    const event = getEventById(parseInt(eventId));
    if (!event) {
        showError('Event not found');
        return;
    }
    
    // Display event details
    displayEventDetails(event);
    
    // Set up form handlers
    setupFormHandlers();
}

/**
 * Get event by ID
 * @param {number} id - Event ID
 * @returns {Object|null} - Event object or null if not found
 */
function getEventById(id) {
    // Check if appData is available in the global scope
    if (typeof appData === 'undefined' || !appData.events) {
        console.error('Event data not available');
        return null;
    }
    
    // Find the event with the matching ID
    const event = appData.events.find(event => event.id === id);
    
    if (!event) {
        console.error('Event not found with ID:', id);
    }
    
    return event || null;
}

/**
 * Display event details on the registration page
 * @param {Object} event - Event object
 */
function displayEventDetails(event) {
    const eventDetailsContainer = document.getElementById('event-details');
    if (!eventDetailsContainer) return;
    
    // Update page title
    document.title = `Register for ${event.title} - KhelConnect`;
    
    // Set heading
    const pageHeading = document.querySelector('.page-heading');
    if (pageHeading) {
        pageHeading.textContent = `Register for ${event.title}`;
    }
    
    // Display event details
    eventDetailsContainer.innerHTML = `
        <div class="card mb-4">
            <div class="row g-0">
                <div class="col-md-4">
                    <img src="${event.image}" class="img-fluid rounded-start" alt="${event.title}">
                </div>
                <div class="col-md-8">
                    <div class="card-body">
                        <h5 class="card-title">${event.title}</h5>
                        <p class="card-text">${event.description}</p>
                        <div class="event-details">
                            <p><i class="far fa-calendar-alt text-primary me-2"></i> <strong>Date:</strong> ${formatDate(event.date)} to ${formatDate(event.endDate)}</p>
                            <p><i class="fas fa-map-marker-alt text-primary me-2"></i> <strong>Venue:</strong> ${event.venue}, ${event.location}</p>
                            <p><i class="fas fa-running text-primary me-2"></i> <strong>Sport:</strong> ${event.sport}</p>
                            <p><i class="fas fa-clock text-primary me-2"></i> <strong>Registration Deadline:</strong> ${formatDate(event.registrationDeadline)}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * Set up form handlers for the registration form
 */
function setupFormHandlers() {
    const registrationForm = document.getElementById('registration-form');
    const categorySelect = document.getElementById('category');
    
    if (!registrationForm || !categorySelect) return;
    
    // Handle category change
    categorySelect.addEventListener('change', function() {
        toggleTeamFields(this.value);
    });
    
    // Handle form submission
    registrationForm.addEventListener('submit', function(event) {
        event.preventDefault();
        handleFormSubmission(this);
    });
}

/**
 * Toggle team fields visibility based on selected category
 * @param {string} category - Selected category
 */
function toggleTeamFields(category) {
    const teamFields = document.querySelectorAll('.team-details');
    const teamNameInput = document.getElementById('team-name');
    const teamMembersInput = document.getElementById('team-members');
    
    if (!teamFields.length || !teamNameInput || !teamMembersInput) return;
    
    if (category === 'Individual') {
        teamFields.forEach(field => field.classList.add('d-none'));
        teamNameInput.removeAttribute('required');
        teamMembersInput.removeAttribute('required');
    } else {
        teamFields.forEach(field => field.classList.remove('d-none'));
        teamNameInput.setAttribute('required', 'required');
        teamMembersInput.setAttribute('required', 'required');
    }
}

/**
 * Handle form submission
 * @param {HTMLFormElement} form - Registration form
 */
function handleFormSubmission(form) {
    // Validate form
    if (!form.checkValidity()) {
        form.classList.add('was-validated');
        return;
    }
    
    // Show loading state
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Submitting...';
    
    // Simulate API call
    setTimeout(() => {
        // Hide form
        form.classList.add('d-none');
        
        // Show success message
        const successMessage = document.getElementById('registration-success');
        if (successMessage) {
            successMessage.classList.remove('d-none');
            
            // Get event name from URL
            const urlParams = new URLSearchParams(window.location.search);
            const eventId = urlParams.get('event');
            const event = getEventById(parseInt(eventId));
            
            // Update success message
            const eventNameElement = document.getElementById('success-event-name');
            if (eventNameElement && event) {
                eventNameElement.textContent = event.title;
            }
            
            // Generate random registration ID
            const registrationId = `REG-${Date.now().toString().substring(5)}-${Math.floor(Math.random() * 1000)}`;
            const registrationIdElement = document.getElementById('registration-id');
            if (registrationIdElement) {
                registrationIdElement.textContent = registrationId;
            }
        }
        
        // Reset button state
        submitButton.disabled = false;
        submitButton.innerHTML = originalText;
    }, 1500);
}

/**
 * Show error message
 * @param {string} message - Error message
 */
function showError(message) {
    // Target the main content container instead of the first container
    const mainContainer = document.querySelector('main.container');
    if (!mainContainer) return;
    
    // Remove any existing error messages
    const existingErrors = mainContainer.querySelectorAll('.alert-danger');
    existingErrors.forEach(error => error.remove());
    
    // Create the error message element
    const errorDiv = document.createElement('div');
    errorDiv.className = 'alert alert-danger';
    errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    
    // Insert at the beginning of the main container
    mainContainer.insertBefore(errorDiv, mainContainer.firstChild);
}

/**
 * Format date string to a more readable format
 * @param {string} dateString - Date string in format YYYY-MM-DD
 * @returns {string} - Formatted date string
 */
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Initialize registration form when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Wait a short time to ensure data.js has been loaded and processed
    setTimeout(function() {
        initRegistrationForm();
    }, 100);
});
