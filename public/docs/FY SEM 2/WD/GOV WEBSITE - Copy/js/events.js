/**
 * KhelConnect - Events Page Script
 * Implements the functionality for the events page
 */

// Use strict mode for better error handling and performance
'use strict';

// Events page module using IIFE pattern
const EventsPage = (function() {
    // Private variables
    let _events = [];
    let _filteredEvents = [];
    let _currentPage = 1;
    let _eventsPerPage = 6;
    let _currentFilters = {
        status: 'all', // all, upcoming, ongoing
        sport: '',
        location: '',
        dateRange: ''
    };
    
    // DOM Elements cache
    const DOM = {
        eventsContainer: document.getElementById('events-container'),
        pagination: document.getElementById('events-pagination'),
        filterForm: document.getElementById('event-filter-form'),
        sportFilter: document.getElementById('sport-filter'),
        locationFilter: document.getElementById('location-filter'),
        dateFilter: document.getElementById('date-filter'),
        allEventsBtn: document.getElementById('all-events-btn'),
        upcomingEventsBtn: document.getElementById('upcoming-events-btn'),
        ongoingEventsBtn: document.getElementById('ongoing-events-btn'),
        calendarMonths: document.getElementById('calendar-months'),
        calendarBody: document.getElementById('calendar-body'),
        submitEventForm: document.getElementById('submit-event-form')
    };
    
    /**
     * Initialize the events page
     */
    function init() {
        console.log('Events page initializing...');
        
        // Get events from the main application
        if (window.KhelConnect && KhelConnect.getEvents) {
            _events = KhelConnect.getEvents();
            _filteredEvents = [..._events];
            
            // Render events
            renderEvents();
            
            // Set up event listeners
            setupEventListeners();
            
            // Initialize calendar
            initCalendar();
            
            console.log('Events page initialized successfully');
        } else {
            console.error('KhelConnect main module not found');
            showError('Failed to load events data. Please refresh the page.');
        }
    }
    
    /**
     * Set up event listeners for interactive elements
     */
    function setupEventListeners() {
        // Filter form submission
        if (DOM.filterForm) {
            DOM.filterForm.addEventListener('submit', function(event) {
                event.preventDefault();
                applyFilters();
            });
            
            // Reset button
            DOM.filterForm.addEventListener('reset', function() {
                setTimeout(() => {
                    _currentFilters = {
                        status: 'all',
                        sport: '',
                        location: '',
                        dateRange: ''
                    };
                    applyFilters();
                }, 10);
            });
        }
        
        // Status filter buttons
        if (DOM.allEventsBtn) {
            DOM.allEventsBtn.addEventListener('click', function() {
                setActiveStatusButton(this);
                _currentFilters.status = 'all';
                applyFilters();
            });
        }
        
        if (DOM.upcomingEventsBtn) {
            DOM.upcomingEventsBtn.addEventListener('click', function() {
                setActiveStatusButton(this);
                _currentFilters.status = 'upcoming';
                applyFilters();
            });
        }
        
        if (DOM.ongoingEventsBtn) {
            DOM.ongoingEventsBtn.addEventListener('click', function() {
                setActiveStatusButton(this);
                _currentFilters.status = 'ongoing';
                applyFilters();
            });
        }
        
        // Calendar month selection
        if (DOM.calendarMonths) {
            DOM.calendarMonths.addEventListener('click', function(event) {
                event.preventDefault();
                
                if (event.target.tagName === 'A') {
                    // Remove active class from all months
                    DOM.calendarMonths.querySelectorAll('a').forEach(a => {
                        a.classList.remove('active');
                    });
                    
                    // Add active class to clicked month
                    event.target.classList.add('active');
                    
                    // Get month and year
                    const month = parseInt(event.target.dataset.month);
                    const year = parseInt(event.target.dataset.year);
                    
                    // Generate calendar
                    generateCalendar(month, year);
                }
            });
        }
        
        // Submit event form
        if (DOM.submitEventForm) {
            DOM.submitEventForm.addEventListener('submit', function(event) {
                event.preventDefault();
                handleEventSubmission();
            });
        }
        
        // Set up jQuery event handlers
        setupJQueryEvents();
    }
    
    /**
     * Set up jQuery-specific event handlers
     */
    function setupJQueryEvents() {
        $(document).ready(function() {
            // Tooltip initialization
            $('[data-toggle="tooltip"]').tooltip();
            
            // Form validation styling
            $('#submit-event-form input, #submit-event-form select, #submit-event-form textarea').on('focus', function() {
                $(this).removeClass('is-invalid').addClass('is-valid');
            }).on('blur', function() {
                if ($(this).val() === '') {
                    $(this).removeClass('is-valid').addClass('is-invalid');
                } else {
                    $(this).removeClass('is-invalid').addClass('is-valid');
                }
            });
            
            // Date range validation
            $('#event-end-date').on('change', function() {
                const startDate = new Date($('#event-start-date').val());
                const endDate = new Date($(this).val());
                
                if (endDate < startDate) {
                    $(this).addClass('is-invalid');
                    $('<div class="invalid-feedback">End date must be after start date</div>').insertAfter($(this));
                } else {
                    $(this).removeClass('is-invalid').addClass('is-valid');
                    $(this).next('.invalid-feedback').remove();
                }
            });
            
            // Calendar day hover effect
            $(document).on('mouseenter', '.calendar-day', function() {
                $(this).addClass('bg-light');
            }).on('mouseleave', '.calendar-day', function() {
                $(this).removeClass('bg-light');
            });
            
            // Pagination click animation
            $('#events-pagination').on('click', '.page-link', function() {
                $('.page-item').removeClass('active');
                $(this).parent().addClass('active');
                
                // Smooth scroll to top of events container
                $('html, body').animate({
                    scrollTop: $('#events-container').offset().top - 100
                }, 500);
            });
        });
    }
    
    /**
     * Set active status button
     * @param {HTMLElement} button - Button to set as active
     */
    function setActiveStatusButton(button) {
        // Remove active class from all status buttons
        document.querySelectorAll('#all-events-btn, #upcoming-events-btn, #ongoing-events-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Add active class to clicked button
        button.classList.add('active');
    }
    
    /**
     * Apply filters to events
     */
    function applyFilters() {
        // Get filter values
        if (DOM.sportFilter) _currentFilters.sport = DOM.sportFilter.value;
        if (DOM.locationFilter) _currentFilters.location = DOM.locationFilter.value;
        if (DOM.dateFilter) _currentFilters.dateRange = DOM.dateFilter.value;
        
        // Filter events
        _filteredEvents = _events.filter(event => {
            // Status filter
            if (_currentFilters.status === 'upcoming') {
                // For upcoming filter, only show events that are upcoming AND have registration open
                if (!event.isUpcoming() || !event.isRegistrationActive()) {
                    return false;
                }
            }
            
            if (_currentFilters.status === 'ongoing' && !event.isOngoing()) {
                return false;
            }
            
            // Sport filter
            if (_currentFilters.sport && event.sport !== _currentFilters.sport) {
                return false;
            }
            
            // Location filter
            if (_currentFilters.location && !event.location.includes(_currentFilters.location)) {
                return false;
            }
            
            // Date range filter
            if (_currentFilters.dateRange) {
                const today = new Date();
                const eventDate = new Date(event.date);
                
                if (_currentFilters.dateRange === 'this-month') {
                    return eventDate.getMonth() === today.getMonth() && 
                           eventDate.getFullYear() === today.getFullYear();
                }
                
                if (_currentFilters.dateRange === 'next-month') {
                    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
                    return eventDate.getMonth() === nextMonth.getMonth() && 
                           eventDate.getFullYear() === nextMonth.getFullYear();
                }
                
                if (_currentFilters.dateRange === 'next-3-months') {
                    const threeMonthsLater = new Date(today);
                    threeMonthsLater.setMonth(today.getMonth() + 3);
                    return eventDate >= today && eventDate <= threeMonthsLater;
                }
                
                if (_currentFilters.dateRange === 'next-6-months') {
                    const sixMonthsLater = new Date(today);
                    sixMonthsLater.setMonth(today.getMonth() + 6);
                    return eventDate >= today && eventDate <= sixMonthsLater;
                }
            }
            
            return true;
        });
        
        // Reset to first page
        _currentPage = 1;
        
        // Render filtered events
        renderEvents();
        
        // Update section title
        updateSectionTitle();
    }
    
    /**
     * Update section title based on filters
     */
    function updateSectionTitle() {
        const sectionTitle = document.querySelector('.section-title');
        if (!sectionTitle) return;
        
        let title = 'All Events';
        
        if (_currentFilters.status === 'upcoming') {
            title = 'Upcoming Events';
        } else if (_currentFilters.status === 'ongoing') {
            title = 'Ongoing Events';
        }
        
        if (_currentFilters.sport) {
            title = `${_currentFilters.sport} ${title}`;
        }
        
        if (_currentFilters.location) {
            title += ` in ${_currentFilters.location}`;
        }
        
        sectionTitle.textContent = title;
    }
    
    /**
     * Render events with pagination
     */
    function renderEvents() {
        if (!DOM.eventsContainer) return;
        
        try {
            // Calculate pagination
            const totalPages = Math.ceil(_filteredEvents.length / _eventsPerPage);
            const startIndex = (_currentPage - 1) * _eventsPerPage;
            const endIndex = startIndex + _eventsPerPage;
            const eventsToShow = _filteredEvents.slice(startIndex, endIndex);
            
            // Generate HTML
            if (eventsToShow.length > 0) {
                const html = eventsToShow.map(event => event.createCard()).join('');
                DOM.eventsContainer.innerHTML = html;
                
                // Add animation with staggered delay
                DOM.eventsContainer.querySelectorAll('.card').forEach((card, index) => {
                    setTimeout(() => {
                        card.classList.add('fade-in');
                    }, index * 100);
                });
            } else {
                DOM.eventsContainer.innerHTML = `
                    <div class="col-12">
                        <div class="alert alert-info">
                            <i class="fas fa-info-circle"></i> No events found matching your criteria.
                        </div>
                    </div>
                `;
            }
            
            // Render pagination
            renderPagination(totalPages);
            
            console.log('Events rendered successfully');
        } catch (error) {
            console.error('Error rendering events:', error);
            showError('Error loading events. Please try again.');
        }
    }
    
    /**
     * Render pagination controls
     * @param {number} totalPages - Total number of pages
     */
    function renderPagination(totalPages) {
        if (!DOM.pagination) return;
        
        // Hide pagination if only one page
        if (totalPages <= 1) {
            DOM.pagination.style.display = 'none';
            return;
        }
        
        DOM.pagination.style.display = 'flex';
        
        // Generate pagination HTML
        let html = `
            <li class="page-item ${_currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" data-page="${_currentPage - 1}" aria-label="Previous">
                    <span aria-hidden="true">&laquo;</span>
                </a>
            </li>
        `;
        
        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            html += `
                <li class="page-item ${i === _currentPage ? 'active' : ''}">
                    <a class="page-link" href="#" data-page="${i}">${i}</a>
                </li>
            `;
        }
        
        html += `
            <li class="page-item ${_currentPage === totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#" data-page="${_currentPage + 1}" aria-label="Next">
                    <span aria-hidden="true">&raquo;</span>
                </a>
            </li>
        `;
        
        // Set inner HTML
        DOM.pagination.innerHTML = html;
        
        // Add event listeners
        DOM.pagination.querySelectorAll('.page-link').forEach(link => {
            link.addEventListener('click', function(event) {
                event.preventDefault();
                
                const page = parseInt(this.dataset.page);
                if (page && page !== _currentPage && page >= 1 && page <= totalPages) {
                    _currentPage = page;
                    renderEvents();
                    
                    // Scroll to top of events container
                    DOM.eventsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }
    
    /**
     * Initialize calendar
     */
    function initCalendar() {
        console.log('Initializing calendar...');
        
        // Check if calendar elements exist
        if (!DOM.calendarBody || !DOM.calendarMonths) {
            console.error('Calendar DOM elements not found');
            return;
        }
        
        // Get current month and year
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        
        console.log(`Generating calendar for ${currentMonth + 1}/${currentYear}`);
        
        // Generate calendar for current month
        generateCalendar(currentMonth, currentYear);
        
        // Set active month in sidebar
        const activeMonthLink = DOM.calendarMonths.querySelector(`[data-month="${currentMonth}"][data-year="${currentYear}"]`);
        if (activeMonthLink) {
            activeMonthLink.classList.add('active');
        }
        
        // Set up calendar navigation event listeners
        DOM.calendarMonths.querySelectorAll('.calendar-month').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Remove active class from all month links
                DOM.calendarMonths.querySelectorAll('.calendar-month').forEach(item => {
                    item.classList.remove('active');
                });
                
                // Add active class to clicked month
                this.classList.add('active');
                
                // Get month and year from data attributes
                const month = parseInt(this.getAttribute('data-month'));
                const year = parseInt(this.getAttribute('data-year'));
                
                // Generate calendar for selected month
                generateCalendar(month, year);
            });
        });
        
        console.log('Calendar initialized successfully');
    }
    
    /**
     * Generate calendar for specific month and year
     * @param {number} month - Month (0-11)
     * @param {number} year - Year
     */
    function generateCalendar(month, year) {
        if (!DOM.calendarBody) {
            console.error('Calendar body element not found');
            return;
        }
        
        console.log(`Generating calendar for month ${month + 1}, year ${year}`);
        
        // Get first day of month and number of days
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        // Clear previous calendar
        DOM.calendarBody.innerHTML = '';
        
        // Update calendar header
        if (DOM.calendarHeader) {
            DOM.calendarHeader.textContent = new Date(year, month, 1).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
        }
        
        // Create calendar rows
        let date = 1;
        for (let i = 0; i < 6; i++) {
            // Create table row
            const row = document.createElement('tr');
            
            // Create table cells
            for (let j = 0; j < 7; j++) {
                // Create table cell
                const cell = document.createElement('td');
                
                if (i === 0 && j < firstDay) {
                    // Empty cells before first day of month
                    cell.classList.add('empty');
                    cell.innerHTML = '&nbsp;';
                } else if (date > daysInMonth) {
                    // Empty cells after last day of month
                    cell.classList.add('empty');
                    cell.innerHTML = '&nbsp;';
                } else {
                    // Day cells
                    const dayDiv = document.createElement('div');
                    dayDiv.className = 'calendar-day';
                    dayDiv.textContent = date;
                    
                    cell.appendChild(dayDiv);
                    cell.setAttribute('data-date', date);
                    cell.setAttribute('data-month', month);
                    cell.setAttribute('data-year', year);
                    
                    // Check if day has events
                    const eventsOnDay = getEventsOnDay(date, month, year);
                    
                    if (eventsOnDay.length > 0) {
                        cell.classList.add('has-events');
                        
                        // Add event indicators
                        const eventIndicators = document.createElement('div');
                        eventIndicators.className = 'event-indicators';
                        
                        // Add indicators for up to 3 events
                        eventsOnDay.slice(0, 3).forEach(event => {
                            const indicator = document.createElement('div');
                            indicator.className = 'event-indicator';
                            indicator.setAttribute('data-toggle', 'tooltip');
                            indicator.setAttribute('title', event.title);
                            eventIndicators.appendChild(indicator);
                        });
                        
                        // Show more indicator if more than 3 events
                        if (eventsOnDay.length > 3) {
                            const moreIndicator = document.createElement('div');
                            moreIndicator.className = 'more-events';
                            moreIndicator.textContent = `+${eventsOnDay.length - 3}`;
                            eventIndicators.appendChild(moreIndicator);
                        }
                        
                        cell.appendChild(eventIndicators);
                        
                        // Add click event to show events
                        cell.addEventListener('click', function() {
                            showEventsForDay(eventsOnDay);
                        });
                    }
                    
                    // Highlight today
                    const today = new Date();
                    if (date === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                        cell.classList.add('today');
                    }
                    
                    date++;
                }
                
                row.appendChild(cell);
            }
            
            DOM.calendarBody.appendChild(row);
            
            // Stop if we've used all days
            if (date > daysInMonth) {
                break;
            }
        }
        
        // Initialize tooltips
        if (typeof $ !== 'undefined' && $.fn.tooltip) {
            $('[data-toggle="tooltip"]').tooltip();
        }
    }
    
    /**
     * Get events on a specific day
     * @param {number} day - Day of month
     * @param {number} month - Month (0-11)
     * @param {number} year - Year
     * @returns {Array} Events on the day
     */
    function getEventsOnDay(day, month, year) {
        console.log(`Getting events for ${day}/${month + 1}/${year}`);
        
        // Create a date object for the target day (midnight)
        const targetDate = new Date(year, month, day);
        // Reset time to start of day
        targetDate.setHours(0, 0, 0, 0);
        
        // Filter events that occur on or span this day
        const eventsOnDay = _events.filter(event => {
            // Parse event start and end dates
            let eventStart, eventEnd;
            
            try {
                // Handle different date formats (YYYY-MM-DD or Date object)
                if (typeof event.date === 'string') {
                    // Split the date string and create a new Date object
                    const [startYear, startMonth, startDay] = event.date.split('-').map(Number);
                    eventStart = new Date(startYear, startMonth - 1, startDay);
                } else if (event.date instanceof Date) {
                    eventStart = new Date(event.date);
                } else {
                    console.error('Invalid date format for event:', event);
                    return false;
                }
                
                // Set time to start of day
                eventStart.setHours(0, 0, 0, 0);
                
                // Handle end date (if available)
                if (event.endDate) {
                    if (typeof event.endDate === 'string') {
                        const [endYear, endMonth, endDay] = event.endDate.split('-').map(Number);
                        eventEnd = new Date(endYear, endMonth - 1, endDay);
                    } else if (event.endDate instanceof Date) {
                        eventEnd = new Date(event.endDate);
                    } else {
                        console.error('Invalid end date format for event:', event);
                        eventEnd = eventStart; // Fallback to start date
                    }
                } else {
                    // If no end date, use start date
                    eventEnd = eventStart;
                }
                
                // Set time to end of day
                eventEnd.setHours(23, 59, 59, 999);
                
                // Debug logging
                console.log(`Event: ${event.title}`);
                console.log(`  Start: ${eventStart.toDateString()}`);
                console.log(`  End: ${eventEnd.toDateString()}`);
                console.log(`  Target: ${targetDate.toDateString()}`);
                console.log(`  Is on day: ${eventStart <= targetDate && eventEnd >= targetDate}`);
                
                // Check if the target date falls within the event's date range
                return eventStart <= targetDate && eventEnd >= targetDate;
                
            } catch (error) {
                console.error('Error parsing event dates:', error, event);
                return false;
            }
        });
        
        console.log(`Found ${eventsOnDay.length} events on ${targetDate.toDateString()}:`, eventsOnDay);
        return eventsOnDay;
    }
    
    /**
     * Show events for a specific day in a modal
     * @param {Array} events - Events to show
     */
    function showEventsForDay(events) {
        if (events.length === 0) return;
        
        console.log('Showing events for day:', events);
        
        // Get the date from the first event
        let eventDate;
        let formattedDate;
        
        try {
            if (typeof events[0].date === 'string') {
                const [year, month, day] = events[0].date.split('-').map(Number);
                eventDate = new Date(year, month - 1, day);
            } else if (events[0].date instanceof Date) {
                eventDate = new Date(events[0].date);
            } else {
                // Fallback to current date if date format is invalid
                console.error('Invalid date format for event:', events[0]);
                eventDate = new Date();
            }
            
            // Format date
            formattedDate = eventDate.toLocaleDateString('en-IN', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
        } catch (error) {
            console.error('Error formatting date:', error);
            formattedDate = 'Events';
        }
        
        // Create modal using jQuery
        const modal = $(`
            <div class="modal fade" id="dayEventsModal" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header bg-primary text-white">
                            <h5 class="modal-title">Events on ${formattedDate}</h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="list-group">
                                ${events.map(event => `
                                    <div class="list-group-item list-group-item-action">
                                        <div class="d-flex w-100 justify-content-between">
                                            <h5 class="mb-1">${event.title}</h5>
                                            <span class="badge badge-sport">${event.sport}</span>
                                        </div>
                                        <p class="mb-1">${event.description.substring(0, 150)}${event.description.length > 150 ? '...' : ''}</p>
                                        <div class="d-flex justify-content-between align-items-center">
                                            <small><i class="fas fa-map-marker-alt"></i> ${event.venue}, ${event.location}</small>
                                            ${event.isRegistrationActive() ? 
                                                `<button class="btn btn-sm btn-success register-btn" data-event-id="${event.id}">
                                                    <i class="fas fa-user-plus"></i> Register
                                                </button>` : 
                                                `<button class="btn btn-sm btn-outline-secondary" disabled>
                                                    <i class="fas fa-times-circle"></i> Registration Closed
                                                </button>`
                                            }
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        `);
        
        // Add to DOM and show
        $('body').append(modal);
        const modalElement = new bootstrap.Modal(document.getElementById('dayEventsModal'));
        modalElement.show();
        
        // Remove modal from DOM when hidden
        $('#dayEventsModal').on('hidden.bs.modal', function() {
            $(this).remove();
        });
    }
    
    /**
     * Get color for sport category
     * @param {string} sport - Sport name
     * @returns {string} Color code
     */
    function getSportColor(sport) {
        const colors = {
            'Cricket': '#4CAF50',
            'Athletics': '#2196F3',
            'Badminton': '#FF9800',
            'Swimming': '#00BCD4',
            'Hockey': '#F44336',
            'Football': '#9C27B0'
        };
        
        return colors[sport] || '#607D8B';
    }
    
    /**
     * Handle event submission
     */
    function handleEventSubmission() {
        try {
            // Get form data
            const formData = {
                title: document.getElementById('event-title').value,
                sport: document.getElementById('event-sport').value,
                startDate: document.getElementById('event-start-date').value,
                endDate: document.getElementById('event-end-date').value,
                location: document.getElementById('event-location').value,
                venue: document.getElementById('event-venue').value,
                description: document.getElementById('event-description').value,
                organizerName: document.getElementById('organizer-name').value,
                organizerEmail: document.getElementById('organizer-email').value,
                organizerPhone: document.getElementById('organizer-phone').value
            };
            
            // Validate dates
            const startDate = new Date(formData.startDate);
            const endDate = new Date(formData.endDate);
            const today = new Date();
            
            if (startDate < today) {
                throw new Error('Start date cannot be in the past');
            }
            
            if (endDate < startDate) {
                throw new Error('End date must be after start date');
            }
            
            // Validate email
            if (!validateEmail(formData.organizerEmail)) {
                throw new Error('Please enter a valid email address');
            }
            
            // Simulate API call
            console.log('Event submission data:', formData);
            
            // Show success message using jQuery
            const form = $('#submit-event-form');
            form.slideUp(300, function() {
                const successMessage = $(`
                    <div class="alert alert-success" role="alert">
                        <h4 class="alert-heading"><i class="fas fa-check-circle"></i> Event Submitted Successfully!</h4>
                        <p>Thank you for submitting your event. Our team will review your submission and get back to you shortly.</p>
                        <hr>
                        <p class="mb-0">Reference ID: EVT-${Math.floor(Math.random() * 10000)}</p>
                    </div>
                `).hide();
                
                form.after(successMessage);
                successMessage.slideDown(300);
                
                // Add button to submit another event
                const submitAnotherBtn = $(`
                    <button class="btn btn-primary mt-3">Submit Another Event</button>
                `).hide();
                
                successMessage.after(submitAnotherBtn);
                submitAnotherBtn.slideDown(300);
                
                // Reset form
                form[0].reset();
                
                // Handle submit another button
                submitAnotherBtn.on('click', function() {
                    successMessage.slideUp(300, function() {
                        $(this).remove();
                    });
                    submitAnotherBtn.slideUp(300, function() {
                        $(this).remove();
                    });
                    form.slideDown(300);
                });
            });
        } catch (error) {
            console.error('Event submission error:', error);
            
            // Show error message using jQuery
            const errorMessage = $(`
                <div class="alert alert-danger alert-dismissible fade show" role="alert">
                    <strong>Error!</strong> ${error.message}
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            `).hide();
            
            $('#submit-event-form .alert-danger').remove(); // Remove any existing error
            $('#submit-event-form').prepend(errorMessage);
            errorMessage.slideDown(300);
            
            // Auto-dismiss after 5 seconds
            setTimeout(() => {
                errorMessage.alert('close');
            }, 5000);
        }
    }
    
    /**
     * Validate email format
     * @param {string} email - Email to validate
     * @returns {boolean} Is valid email
     */
    function validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    
    /**
     * Show error message
     * @param {string} message - Error message
     */
    function showError(message) {
        if (!DOM.eventsContainer) return;
        
        DOM.eventsContainer.innerHTML = `
            <div class="col-12">
                <div class="alert alert-danger">
                    <i class="fas fa-exclamation-circle"></i> ${message}
                </div>
            </div>
        `;
    }
    
    // Initialize when DOM is loaded
    document.addEventListener('DOMContentLoaded', init);
    
    // Public API
    return {
        init,
        applyFilters,
        generateCalendar
    };
})();
