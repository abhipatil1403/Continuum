// Import classes
import { Event, CricketEvent, AthleticsEvent, Athlete, News, Team, Match } from './models.js';

// Sample data (in a real application, this would come from an API)
const sampleEvents = [
    new CricketEvent(
        1,
        'National Cricket Championship',
        '2024-06-15',
        'Eden Gardens, Kolkata',
        'Annual national cricket championship featuring top teams from across India',
        'images/cricket-event.jpg',
        ['Mumbai', 'Delhi', 'Kolkata', 'Chennai'],
        'T20'
    ),
    new AthleticsEvent(
        2,
        'National Athletics Meet',
        '2024-07-20',
        'Jawaharlal Nehru Stadium, Delhi',
        'National level athletics competition featuring various track and field events',
        'images/athletics-event.jpg',
        ['100m', '200m', 'Long Jump', 'High Jump', 'Shot Put']
    )
];

const sampleAthletes = [
    new Athlete(
        1,
        'Rahul Sharma',
        'Cricket',
        ['National Player of the Year 2023', 'Best Batsman Award 2023'],
        'images/athlete1.jpg',
        'Professional cricketer with 10 years of experience'
    ),
    new Athlete(
        2,
        'Priya Patel',
        'Athletics',
        ['National Long Jump Champion 2023', 'Asian Games Silver Medalist'],
        'images/athlete2.jpg',
        'Elite long jumper representing India internationally'
    )
];

const sampleNews = [
    new News(
        1,
        'India Wins Gold in Asian Games',
        'The Indian team secured a historic gold medal in the team event...',
        '2024-03-15',
        'images/news1.jpg',
        'Achievements'
    ),
    new News(
        2,
        'New Sports Policy Announced',
        'The government has announced a new sports policy focusing on grassroots development...',
        '2024-03-10',
        'images/news2.jpg',
        'Policy'
    )
];

// DOM Elements
const eventsContainer = document.getElementById('featured-events');
const athletesContainer = document.getElementById('athletes-grid');
const newsContainer = document.getElementById('news-container');
const contactForm = document.getElementById('contact-form');

// Event Handlers
document.addEventListener('DOMContentLoaded', () => {
    loadEvents();
    loadAthletes();
    loadNews();
    setupEventListeners();
});

// Load Events
function loadEvents() {
    if (!eventsContainer) return;

    const eventsHTML = sampleEvents.map(event => `
        <div class="col-md-6 col-lg-4">
            <div class="card event-card fade-in">
                <div class="card-img-top" style="height: 200px; background: linear-gradient(45deg, var(--primary-color), var(--secondary-color));"></div>
                <div class="card-body">
                    <h5 class="card-title">${event.name}</h5>
                    <p class="card-text">${event.description}</p>
                    <p class="card-text">
                        <small class="text-muted">
                            <i class="fas fa-calendar"></i> ${event.formattedDate}
                        </small>
                    </p>
                    <p class="card-text">
                        <small class="text-muted">
                            <i class="fas fa-map-marker-alt"></i> ${event.location}
                        </small>
                    </p>
                    ${event instanceof CricketEvent ? 
                        `<p class="card-text"><small class="text-muted">${event.matchDetails}</small></p>` :
                        event instanceof AthleticsEvent ?
                        `<p class="card-text"><small class="text-muted">Events: ${event.eventCategories}</small></p>` :
                        ''
                    }
                    <button class="btn btn-primary" onclick="showEventDetails(${event.id})">
                        View Details
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    eventsContainer.innerHTML = eventsHTML;
}

// Load Athletes
function loadAthletes() {
    if (!athletesContainer) return;

    const athletesHTML = sampleAthletes.map(athlete => `
        <div class="col-md-6 col-lg-4">
            <div class="athlete-card fade-in">
                <div style="width: 150px; height: 150px; border-radius: 50%; margin: 0 auto 1rem; background: linear-gradient(45deg, var(--primary-color), var(--secondary-color));"></div>
                <h4>${athlete.name}</h4>
                <p class="text-muted">${athlete.sport}</p>
                <p>${athlete.bio}</p>
                <div class="achievements">
                    <h5>Achievements</h5>
                    <ul class="list-unstyled">
                        ${athlete.achievements.map(achievement => 
                            `<li><i class="fas fa-trophy"></i> ${achievement}</li>`
                        ).join('')}
                    </ul>
                </div>
            </div>
        </div>
    `).join('');

    athletesContainer.innerHTML = athletesHTML;
}

// Load News
function loadNews() {
    if (!newsContainer) return;

    const newsHTML = sampleNews.map(news => `
        <div class="col-md-6">
            <div class="card news-card fade-in">
                <div class="card-img-top" style="height: 200px; background: linear-gradient(45deg, var(--primary-color), var(--secondary-color));"></div>
                <div class="card-body">
                    <h5 class="card-title">${news.title}</h5>
                    <p class="card-text">${news.excerpt}</p>
                    <p class="card-text">
                        <small class="text-muted">
                            <i class="fas fa-calendar"></i> ${news.formattedDate}
                        </small>
                    </p>
                    <button class="btn btn-primary" onclick="showNewsDetails(${news.id})">
                        Read More
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    newsContainer.innerHTML = newsHTML;
}

// Setup Event Listeners
function setupEventListeners() {
    // Contact Form Submission
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactFormSubmit);
    }

    // Smooth Scrolling for Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Contact Form Handler
function handleContactFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    // Validate form data
    try {
        validateFormData(data);
        
        // Show success message
        showAlert('Message sent successfully!', 'success');
        e.target.reset();
    } catch (error) {
        showAlert(error.message, 'danger');
    }
}

// Form Validation
function validateFormData(data) {
    if (!data.name.trim()) {
        throw new Error('Name is required');
    }
    
    if (!data.email.trim()) {
        throw new Error('Email is required');
    }
    
    if (!isValidEmail(data.email)) {
        throw new Error('Please enter a valid email address');
    }
    
    if (!data.message.trim()) {
        throw new Error('Message is required');
    }
}

// Email Validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Alert Message
function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    const container = document.querySelector('.container');
    container.insertBefore(alertDiv, container.firstChild);
    
    // Auto dismiss after 5 seconds
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

// Event Details Modal
function showEventDetails(eventId) {
    const event = sampleEvents.find(e => e.id === eventId);
    if (!event) return;

    const modal = new bootstrap.Modal(document.getElementById('eventModal'));
    const modalContent = document.querySelector('#eventModal .modal-body');
    
    modalContent.innerHTML = `
        <div style="height: 200px; background: linear-gradient(45deg, var(--primary-color), var(--secondary-color)); margin-bottom: 1rem;"></div>
        <h4>${event.name}</h4>
        <p>${event.description}</p>
        <p><strong>Date:</strong> ${event.formattedDate}</p>
        <p><strong>Location:</strong> ${event.location}</p>
        ${event instanceof CricketEvent ? 
            `<p><strong>Match Details:</strong> ${event.matchDetails}</p>` :
            event instanceof AthleticsEvent ?
            `<p><strong>Categories:</strong> ${event.eventCategories}</p>` :
            ''
        }
    `;
    
    modal.show();
}

// News Details Modal
function showNewsDetails(newsId) {
    const news = sampleNews.find(n => n.id === newsId);
    if (!news) return;

    const modal = new bootstrap.Modal(document.getElementById('newsModal'));
    const modalContent = document.querySelector('#newsModal .modal-body');
    
    modalContent.innerHTML = `
        <div style="height: 200px; background: linear-gradient(45deg, var(--primary-color), var(--secondary-color)); margin-bottom: 1rem;"></div>
        <h4>${news.title}</h4>
        <p class="text-muted">${news.formattedDate}</p>
        <p>${news.content}</p>
    `;
    
    modal.show();
}

// Add modals to the DOM
document.body.insertAdjacentHTML('beforeend', `
    <!-- Event Modal -->
    <div class="modal fade" id="eventModal" tabindex="-1">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Event Details</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body"></div>
            </div>
        </div>
    </div>

    <!-- News Modal -->
    <div class="modal fade" id="newsModal" tabindex="-1">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">News Details</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body"></div>
            </div>
        </div>
    </div>
`); 