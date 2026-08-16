/**
 * KhelConnect - Main Application Script
 * Implements the functionality and interaction for the KhelConnect portal
 */

// Use strict mode for better error handling and performance
'use strict';

// Main application object using IIFE pattern
const KhelConnect = (function() {
    // Private variables
    let _events = [];
    let _athletes = [];
    let _news = [];
    let _medalTally = [];
    let _teams = [];
    let _matches = [];
    
    // DOM Elements cache
    const DOM = {
        featuredEvents: document.getElementById('featured-events'),
        athleteSpotlight: document.getElementById('athlete-spotlight'),
        latestNews: document.getElementById('latest-news'),
        medalTable: document.getElementById('medal-table'),
        newsletterForm: document.getElementById('newsletter-form')
    };
    
    /**
     * Initialize the application
     */
    function init() {
        console.log('KhelConnect initializing...');
        
        try {
            // Load data from the data module
            const dataLoaded = loadData();
            
            if (dataLoaded === false) {
                console.error('Failed to load data. KhelConnect initialization aborted.');
                return;
            }
            
            // Make sure window.KhelConnect is set for other scripts to access
            window.KhelConnect = {
                getEvents: () => [..._events],
                getAthletes: () => [..._athletes],
                getNews: () => [..._news],
                getMedalTally: () => [..._medalTally],
                getTeams: () => [..._teams],
                getMatches: () => [..._matches],
                search
            };
            
            // Render components if on homepage
            if (document.getElementById('featured-events')) {
                renderFeaturedEvents();
            }
            
            if (document.getElementById('athlete-spotlight')) {
                renderAthleteSpotlight();
            }
            
            if (document.getElementById('latest-news')) {
                renderLatestNews();
            }
            
            if (document.getElementById('medal-table')) {
                renderMedalTally();
            }
            
            // Set up event listeners
            setupEventListeners();
            
            console.log('KhelConnect initialized successfully');
        } catch (error) {
            console.error('Error initializing KhelConnect:', error);
        }
    }
    
    /**
     * Load data from the data module and create class instances
     */
    function loadData() {
        try {
            console.log('Loading data from appData...');
            
            // Check if appData is available
            if (typeof appData === 'undefined') {
                console.error('appData is not defined. Make sure data.js is loaded before main.js');
                return false;
            }
            
            console.log('appData found:', appData);
            
            // Load events
            _events = appData.events.map(eventData => {
                // Create appropriate event subclass based on sport
                if (eventData.sport === 'Cricket') {
                    return new CricketEvent({
                        ...eventData,
                        format: 'T20', // Default values for cricket-specific properties
                        teams: ['India', 'Australia', 'England', 'South Africa'],
                        matchType: 'International'
                    });
                } else if (eventData.sport === 'Athletics') {
                    return new AthleticsEvent({
                        ...eventData,
                        disciplines: ['100m Sprint', 'Long Jump', 'Javelin Throw', 'Marathon'],
                        ageCategories: ['Under-18', 'Senior'],
                        recordsSet: ['National Record - 100m Sprint', 'Meet Record - Javelin Throw']
                    });
                } else {
                    return new Event(eventData);
                }
            });
            
            // Load athletes
            _athletes = appData.athletes.map(athleteData => new Athlete(athleteData));
            
            // Load news
            _news = appData.news.map(newsData => new News(newsData));
            
            // Load medal tally
            _medalTally = appData.medalTally;
            
            // Create some teams
            _teams = [
                new Team({
                    id: 1,
                    name: 'Indian Cricket Team',
                    sport: 'Cricket',
                    coach: 'Rahul Dravid',
                    members: _athletes.filter(athlete => athlete.sport === 'Cricket'),
                    achievements: ['World Cup Winners', 'T20 World Cup Winners', 'Asia Cup Champions'],
                    logo: 'images/emblem.png'
                }),
                new Team({
                    id: 2,
                    name: 'Indian Athletics Team',
                    sport: 'Athletics',
                    coach: 'Pullela Gopichand',
                    members: _athletes.filter(athlete => athlete.sport === 'Athletics'),
                    achievements: ['Olympic Gold Medal', 'Asian Games Gold Medals', 'Commonwealth Games Champions'],
                    logo: 'images/emblem.png'
                })
            ];
            
            // Create some matches
            _matches = [
                new Match({
                    id: 1,
                    event: _events.find(event => event.sport === 'Cricket'),
                    teams: [_teams[0], { name: 'Australia', logo: '' }],
                    date: '2025-06-18',
                    venue: 'Wankhede Stadium, Mumbai',
                    status: 'Scheduled'
                }),
                new Match({
                    id: 2,
                    event: _events.find(event => event.sport === 'Cricket'),
                    teams: [_teams[0], { name: 'England', logo: '' }],
                    date: '2025-06-22',
                    venue: 'Eden Gardens, Kolkata',
                    status: 'Scheduled'
                })
            ];
            
            console.log('Data loaded successfully');
        } catch (error) {
            console.error('Error loading data:', error);
        }
    }
    
    /**
     * Render featured events on the homepage
     */
    function renderFeaturedEvents() {
        if (!DOM.featuredEvents) return;
        
        try {
            // Filter featured events
            const featuredEvents = _events.filter(event => event.featured);
            
            // Use destructuring to get the first 3 events
            const [first, second, third, ...rest] = featuredEvents;
            const eventsToShow = [first, second, third].filter(Boolean);
            
            // Generate HTML using map and join
            const html = eventsToShow.map(event => event.createCard()).join('');
            
            // Set inner HTML
            DOM.featuredEvents.innerHTML = html;
            
            // Add animation class
            DOM.featuredEvents.querySelectorAll('.card').forEach(card => {
                card.classList.add('fade-in');
            });
            
            console.log('Featured events rendered successfully');
        } catch (error) {
            console.error('Error rendering featured events:', error);
            DOM.featuredEvents.innerHTML = '<div class="col-12"><div class="alert alert-danger">Error loading events</div></div>';
        }
    }
    
    /**
     * Render athlete spotlight on the homepage
     */
    function renderAthleteSpotlight() {
        if (!DOM.athleteSpotlight) return;
        
        try {
            // Filter featured athletes
            const featuredAthletes = _athletes.filter(athlete => athlete.featured);
            
            // Use destructuring to get the first 3 athletes
            const [first, second, third, ...rest] = featuredAthletes;
            const athletesToShow = [first, second, third].filter(Boolean);
            
            // Generate HTML using map and join
            const html = athletesToShow.map(athlete => athlete.createCard()).join('');
            
            // Set inner HTML
            DOM.athleteSpotlight.innerHTML = html;
            
            // Add animation class with delay
            DOM.athleteSpotlight.querySelectorAll('.card').forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add('fade-in');
                }, index * 200);
            });
            
            console.log('Athlete spotlight rendered successfully');
        } catch (error) {
            console.error('Error rendering athlete spotlight:', error);
            DOM.athleteSpotlight.innerHTML = '<div class="col-12"><div class="alert alert-danger">Error loading athletes</div></div>';
        }
    }
    
    /**
     * Render latest news on the homepage
     */
    function renderLatestNews() {
        if (!DOM.latestNews) return;
        
        try {
            // Sort news by date (newest first)
            const sortedNews = [..._news].sort((a, b) => b.date - a.date);
            
            // Use destructuring to get the first 3 news items
            const [first, second, third, ...rest] = sortedNews;
            const newsToShow = [first, second, third].filter(Boolean);
            
            // Generate HTML using map and join
            const html = newsToShow.map(news => news.createCard()).join('');
            
            // Set inner HTML
            DOM.latestNews.innerHTML = html;
            
            // Add animation class with delay
            DOM.latestNews.querySelectorAll('.card').forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add('slide-up');
                }, index * 200);
            });
            
            // Add event handlers for Read More buttons
            DOM.latestNews.querySelectorAll('.read-more-btn').forEach(button => {
                button.addEventListener('click', function(e) {
                    e.preventDefault();
                    const newsId = parseInt(this.getAttribute('data-news-id'));
                    window.location.href = `news-detail.html?id=${newsId}`;
                });
            });
            
            console.log('Latest news rendered successfully');
        } catch (error) {
            console.error('Error rendering latest news:', error);
            DOM.latestNews.innerHTML = '<div class="col-12"><div class="alert alert-danger">Error loading news</div></div>';
        }
    }
    
    /**
     * Render medal tally table
     */
    function renderMedalTally() {
        if (!DOM.medalTable) return;
        
        try {
            const tbody = DOM.medalTable.querySelector('tbody');
            if (!tbody) return;
            
            // Sort medal tally by total medals (descending)
            const sortedMedalTally = [..._medalTally].sort((a, b) => b.total - a.total);
            
            // Generate HTML using map and join
            const html = sortedMedalTally.map(medal => `
                <tr>
                    <td>${medal.sport}</td>
                    <td>${medal.gold}</td>
                    <td>${medal.silver}</td>
                    <td>${medal.bronze}</td>
                    <td><strong>${medal.total}</strong></td>
                </tr>
            `).join('');
            
            // Set inner HTML
            tbody.innerHTML = html;
            
            console.log('Medal tally rendered successfully');
        } catch (error) {
            console.error('Error rendering medal tally:', error);
            if (DOM.medalTable.querySelector('tbody')) {
                DOM.medalTable.querySelector('tbody').innerHTML = '<tr><td colspan="5" class="text-center text-danger">Error loading medal data</td></tr>';
            }
        }
    }
    
    /**
     * Set up event listeners for interactive elements
     */
    function setupEventListeners() {
        // Newsletter form submission
        if (DOM.newsletterForm) {
            DOM.newsletterForm.addEventListener('submit', handleNewsletterSubmit);
        }
        
        // Event registration buttons
        document.addEventListener('click', function(event) {
            // Event registration
            if (event.target.classList.contains('register-btn') || 
                event.target.closest('.register-btn')) {
                
                const button = event.target.classList.contains('register-btn') ? 
                               event.target : event.target.closest('.register-btn');
                
                const eventId = button.dataset.eventId;
                if (eventId) {
                    handleEventRegistration(eventId);
                }
            }
            
            // Read more buttons are now handled directly on the elements
            // No delegation needed here
        });
        
        // Add jQuery event handlers
        setupJQueryEvents();
    }
    
    /**
     * Set up jQuery-specific event handlers
     */
    function setupJQueryEvents() {
        // Use jQuery for animations and effects
        $(document).ready(function() {
            // Smooth scrolling for anchor links
            $('a[href^="#"]').on('click', function(event) {
                event.preventDefault();
                
                $('html, body').animate({
                    scrollTop: $($.attr(this, 'href')).offset().top - 70
                }, 500);
            });
            
            // Tooltip initialization
            $('[data-toggle="tooltip"]').tooltip();
            
            // Card hover effects
            $('.card').hover(
                function() {
                    $(this).addClass('shadow-lg').css('cursor', 'pointer');
                },
                function() {
                    $(this).removeClass('shadow-lg');
                }
            );
            
            // Animate section titles on scroll
            $(window).scroll(function() {
                $('.section-title').each(function() {
                    if ($(this).offset().top < $(window).scrollTop() + $(window).height() - 100) {
                        $(this).addClass('slide-up');
                    }
                });
            });
            
            // Newsletter form validation and styling
            $('#newsletter-form input').on('focus', function() {
                $(this).parent().addClass('border-primary');
            }).on('blur', function() {
                $(this).parent().removeClass('border-primary');
            });
            
            // Custom dropdown animation
            $('.navbar-nav .dropdown').on('show.bs.dropdown', function() {
                $(this).find('.dropdown-menu').first().stop(true, true).slideDown(200);
            }).on('hide.bs.dropdown', function() {
                $(this).find('.dropdown-menu').first().stop(true, true).slideUp(100);
            });
        });
    }
    
    /**
     * Handle newsletter form submission
     * @param {Event} event - Form submit event
     */
    function handleNewsletterSubmit(event) {
        event.preventDefault();
        
        try {
            const emailInput = document.getElementById('email');
            const consentCheckbox = document.getElementById('consent');
            
            // Validate email
            if (!emailInput || !emailInput.value) {
                throw new Error('Please enter your email address');
            }
            
            const email = emailInput.value;
            if (!validateEmail(email)) {
                throw new Error('Please enter a valid email address');
            }
            
            // Validate consent
            if (!consentCheckbox || !consentCheckbox.checked) {
                throw new Error('You must agree to receive emails');
            }
            
            // Simulate API call to subscribe
            console.log(`Subscribing email: ${email}`);
            
            // Show success message using jQuery
            $(DOM.newsletterForm).slideUp(300, function() {
                const successMessage = $('<div class="alert alert-success mt-3" role="alert">')
                    .html('<i class="fas fa-check-circle"></i> Thank you for subscribing to our newsletter!')
                    .hide();
                
                $(this).after(successMessage);
                successMessage.slideDown(300);
                
                // Reset form
                this.reset();
                setTimeout(() => {
                    successMessage.slideUp(300, function() {
                        $(this).remove();
                        $(DOM.newsletterForm).slideDown(300);
                    });
                }, 4000);
            });
        } catch (error) {
            console.error('Newsletter submission error:', error);
            
            // Show error message using jQuery
            const errorMessage = $('<div class="alert alert-danger mt-2" role="alert">')
                .html(`<i class="fas fa-exclamation-circle"></i> ${error.message}`)
                .hide();
            
            $('#newsletter-form .alert-danger').remove(); // Remove any existing error
            $('#newsletter-form').append(errorMessage);
            errorMessage.slideDown(300);
            
            setTimeout(() => {
                errorMessage.slideUp(300, function() {
                    $(this).remove();
                });
            }, 3000);
        }
    }
    
    /**
     * Handle event registration
     * @param {string} eventId - ID of the event
     */
    function handleEventRegistration(eventId) {
        try {
            // Find the event
            const event = _events.find(event => event.id === parseInt(eventId));
            if (!event) {
                throw new Error('Event not found');
            }
            
            // Create registration modal using jQuery
            const modal = $(`
                <div class="modal fade" id="registrationModal" tabindex="-1" aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header bg-primary text-white">
                                <h5 class="modal-title">Register for ${event.title}</h5>
                                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <form id="event-registration-form">
                                    <div class="mb-3">
                                        <label for="reg-name" class="form-label">Full Name</label>
                                        <input type="text" class="form-control" id="reg-name" required>
                                    </div>
                                    <div class="mb-3">
                                        <label for="reg-email" class="form-label">Email Address</label>
                                        <input type="email" class="form-control" id="reg-email" required>
                                    </div>
                                    <div class="mb-3">
                                        <label for="reg-phone" class="form-label">Phone Number</label>
                                        <input type="tel" class="form-control" id="reg-phone" required>
                                    </div>
                                    <div class="mb-3">
                                        <label for="reg-age" class="form-label">Age</label>
                                        <input type="number" class="form-control" id="reg-age" min="5" max="100" required>
                                    </div>
                                    <div class="mb-3">
                                        <label for="reg-category" class="form-label">Category</label>
                                        <select class="form-select" id="reg-category" required>
                                            <option value="">Select Category</option>
                                            <option value="junior">Junior</option>
                                            <option value="senior">Senior</option>
                                            <option value="professional">Professional</option>
                                        </select>
                                    </div>
                                    <div class="form-check mb-3">
                                        <input class="form-check-input" type="checkbox" id="reg-terms" required>
                                        <label class="form-check-label" for="reg-terms">
                                            I agree to the terms and conditions
                                        </label>
                                    </div>
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                <button type="button" class="btn btn-primary" id="submit-registration">Register</button>
                            </div>
                        </div>
                    </div>
                </div>
            `);
            
            // Add to DOM and show
            $('body').append(modal);
            const modalElement = new bootstrap.Modal(document.getElementById('registrationModal'));
            modalElement.show();
            
            // Handle form submission
            $('#submit-registration').on('click', function() {
                const form = document.getElementById('event-registration-form');
                
                // Check form validity
                if (form.checkValidity()) {
                    // Get form data
                    const formData = {
                        name: $('#reg-name').val(),
                        email: $('#reg-email').val(),
                        phone: $('#reg-phone').val(),
                        age: $('#reg-age').val(),
                        category: $('#reg-category').val(),
                        eventId: eventId
                    };
                    
                    // Simulate API call
                    console.log('Registration data:', formData);
                    
                    // Hide modal
                    modalElement.hide();
                    
                    // Show success message
                    const toast = $(`
                        <div class="position-fixed bottom-0 end-0 p-3" style="z-index: 11">
                            <div class="toast" role="alert" aria-live="assertive" aria-atomic="true">
                                <div class="toast-header bg-success text-white">
                                    <strong class="me-auto">Registration Successful</strong>
                                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
                                </div>
                                <div class="toast-body">
                                    You have successfully registered for ${event.title}. Check your email for confirmation.
                                </div>
                            </div>
                        </div>
                    `);
                    
                    $('body').append(toast);
                    const toastElement = new bootstrap.Toast(toast.find('.toast')[0]);
                    toastElement.show();
                    
                    // Remove modal from DOM when hidden
                    $('#registrationModal').on('hidden.bs.modal', function() {
                        $(this).remove();
                    });
                } else {
                    // Trigger browser's native form validation
                    form.reportValidity();
                }
            });
            
            // Remove modal from DOM when hidden
            $('#registrationModal').on('hidden.bs.modal', function() {
                $(this).remove();
            });
        } catch (error) {
            console.error('Event registration error:', error);
            alert(`Registration error: ${error.message}`);
        }
    }
    
    /**
     * Handle read more button for news
     * @param {string} newsId - ID of the news item
     */
    function handleReadMoreNews(newsId) {
        try {
            // Find the news item
            const newsItem = _news.find(news => news.id === parseInt(newsId));
            if (!newsItem) {
                throw new Error('News item not found');
            }
            
            // Create modal using jQuery
            const modal = $(`
                <div class="modal fade" id="newsModal" tabindex="-1" aria-hidden="true">
                    <div class="modal-dialog modal-lg">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">${newsItem.title}</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                ${newsItem.createFullArticle()}
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
            const modalElement = new bootstrap.Modal(document.getElementById('newsModal'));
            modalElement.show();
            
            // Remove modal from DOM when hidden
            $('#newsModal').on('hidden.bs.modal', function() {
                $(this).remove();
            });
        } catch (error) {
            console.error('Read more news error:', error);
            alert(`Error: ${error.message}`);
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
     * Search functionality
     * @param {string} query - Search query
     * @returns {Object} Search results
     */
    function search(query) {
        if (!query || query.trim() === '') {
            return {
                events: [],
                athletes: [],
                news: []
            };
        }
        
        query = query.toLowerCase().trim();
        
        // Search in events
        const events = _events.filter(event => 
            event.title.toLowerCase().includes(query) || 
            event.description.toLowerCase().includes(query) ||
            event.sport.toLowerCase().includes(query) ||
            event.location.toLowerCase().includes(query)
        );
        
        // Search in athletes
        const athletes = _athletes.filter(athlete => 
            athlete.name.toLowerCase().includes(query) || 
            athlete.sport.toLowerCase().includes(query) ||
            athlete.bio.toLowerCase().includes(query) ||
            athlete.state.toLowerCase().includes(query)
        );
        
        // Search in news
        const news = _news.filter(newsItem => 
            newsItem.title.toLowerCase().includes(query) || 
            newsItem.summary.toLowerCase().includes(query) ||
            newsItem.content.toLowerCase().includes(query) ||
            newsItem.category.toLowerCase().includes(query)
        );
        
        return {
            events,
            athletes,
            news
        };
    }
    
    // Public API
    return {
        init,
        search,
        getEvents: () => [..._events],
        getAthletes: () => [..._athletes],
        getNews: () => [..._news],
        getMedalTally: () => [..._medalTally],
        getTeams: () => [..._teams],
        getMatches: () => [..._matches]
    };
})();

// Initialize the application when DOM is fully loaded
document.addEventListener('DOMContentLoaded', KhelConnect.init);
