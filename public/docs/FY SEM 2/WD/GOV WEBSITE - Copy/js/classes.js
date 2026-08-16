/**
 * KhelConnect - Classes Module
 * Object-Oriented implementation of the application's core classes
 * Using ECMA 2024 features and OOP principles
 */

/**
 * Base Person class
 * @class
 */
class Person {
    #id;
    #name;
    #age;
    #state;
    
    /**
     * Create a person
     * @param {Object} data - Person data
     * @param {number} data.id - Unique identifier
     * @param {string} data.name - Full name
     * @param {number} data.age - Age in years
     * @param {string} data.state - State of origin
     */
    constructor(data) {
        this.#id = data.id;
        this.#name = data.name;
        this.#age = data.age || 0;
        this.#state = data.state || '';
    }
    
    // Getters
    get id() { return this.#id; }
    get name() { return this.#name; }
    get age() { return this.#age; }
    get state() { return this.#state; }
    
    // Methods
    getDetails() {
        return {
            id: this.#id,
            name: this.#name,
            age: this.#age,
            state: this.#state
        };
    }
    
    toString() {
        return `${this.#name} (${this.#age} years)`;
    }
}

/**
 * Athlete class extending Person
 * @class
 * @extends Person
 */
class Athlete extends Person {
    #sport;
    #achievements;
    #medals;
    #bio;
    #image;
    #featured;
    #socialMedia;
    
    /**
     * Create an athlete
     * @param {Object} data - Athlete data
     * @param {string} data.sport - Sport discipline
     * @param {Array<string>} data.achievements - List of achievements
     * @param {Object} data.medals - Medal counts
     * @param {string} data.bio - Athlete biography
     * @param {string} data.image - Image URL
     * @param {boolean} data.featured - Whether athlete is featured
     * @param {Object} data.socialMedia - Social media links
     */
    constructor(data) {
        super(data);
        this.#sport = data.sport || '';
        this.#achievements = data.achievements || [];
        this.#medals = data.medals || { gold: 0, silver: 0, bronze: 0 };
        this.#bio = data.bio || '';
        this.#image = data.image || '';
        this.#featured = data.featured || false;
        this.#socialMedia = data.socialMedia || {};
    }
    
    // Getters
    get sport() { return this.#sport; }
    get achievements() { return [...this.#achievements]; }
    get medals() { return {...this.#medals}; }
    get bio() { return this.#bio; }
    get image() { return this.#image; }
    get featured() { return this.#featured; }
    get socialMedia() { return {...this.#socialMedia}; }
    
    // Methods
    getTotalMedals() {
        return this.#medals.gold + this.#medals.silver + this.#medals.bronze;
    }
    
    getPointsValue() {
        // Gold = 5 points, Silver = 3 points, Bronze = 1 point
        return (this.#medals.gold * 5) + (this.#medals.silver * 3) + this.#medals.bronze;
    }
    
    addMedal(type) {
        try {
            if (!['gold', 'silver', 'bronze'].includes(type)) {
                throw new Error('Invalid medal type');
            }
            this.#medals[type]++;
            return true;
        } catch (error) {
            console.error(`Error adding medal: ${error.message}`);
            return false;
        }
    }
    
    /**
     * Create HTML card for the athlete
     * @returns {string} HTML string
     */
    createCard() {
        const totalMedals = this.getTotalMedals();
        const pointsValue = this.getPointsValue();
        
        return `
        <div class="col-md-4 mb-4">
            <div class="card athlete-card h-100">
                <img src="${this.image}" class="card-img-top" alt="${this.name}">
                <div class="card-body">
                    <h5 class="card-title">${this.name}</h5>
                    <span class="badge badge-sport mb-2">${this.sport}</span>
                    <p class="card-text">${this.bio.substring(0, 100)}${this.bio.length > 100 ? '...' : ''}</p>
                    <div class="athlete-stats">
                        <span><i class="fas fa-medal text-warning"></i> ${totalMedals} medals</span>
                        <span><i class="fas fa-trophy text-primary"></i> ${pointsValue} points</span>
                    </div>
                </div>
                <div class="card-footer bg-white">
                    <div class="athlete-social">
                        ${this.socialMedia.twitter ? `<a href="${this.socialMedia.twitter}" target="_blank"><i class="fab fa-twitter"></i></a>` : ''}
                        ${this.socialMedia.instagram ? `<a href="${this.socialMedia.instagram}" target="_blank"><i class="fab fa-instagram"></i></a>` : ''}
                    </div>
                </div>
            </div>
        </div>`;
    }
}

/**
 * Event class
 * @class
 */
class Event {
    #id;
    #title;
    #description;
    #date;
    #endDate;
    #location;
    #venue;
    #sport;
    #registrationOpen;
    #registrationDeadline;
    #image;
    #featured;
    
    /**
     * Create an event
     * @param {Object} data - Event data
     */
    constructor(data) {
        this.#id = data.id;
        this.#title = data.title;
        this.#description = data.description || '';
        this.#date = new Date(data.date);
        this.#endDate = data.endDate ? new Date(data.endDate) : null;
        this.#location = data.location || '';
        this.#venue = data.venue || '';
        this.#sport = data.sport || '';
        this.#registrationOpen = data.registrationOpen || false;
        this.#registrationDeadline = data.registrationDeadline ? new Date(data.registrationDeadline) : null;
        this.#image = data.image || '';
        this.#featured = data.featured || false;
    }
    
    // Getters
    get id() { return this.#id; }
    get title() { return this.#title; }
    get description() { return this.#description; }
    get date() { return this.#date; }
    get endDate() { return this.#endDate; }
    get location() { return this.#location; }
    get venue() { return this.#venue; }
    get sport() { return this.#sport; }
    get registrationOpen() { return this.#registrationOpen; }
    get registrationDeadline() { return this.#registrationDeadline; }
    get image() { return this.#image; }
    get featured() { return this.#featured; }
    
    // Methods
    /**
     * Format date in readable format
     * @param {Date} date - Date to format
     * @returns {string} Formatted date
     */
    formatDate(date) {
        if (!date) return '';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-IN', options);
    }
    
    /**
     * Check if event is ongoing
     * @returns {boolean} True if event is ongoing
     */
    isOngoing() {
        const today = new Date();
        return (this.#date <= today && (this.#endDate >= today || !this.#endDate));
    }
    
    /**
     * Check if event is upcoming
     * @returns {boolean} True if event is upcoming
     */
    isUpcoming() {
        const today = new Date();
        return this.#date > today;
    }
    
    /**
     * Check if registration is still open
     * @returns {boolean} True if registration is open
     */
    isRegistrationActive() {
        if (!this.#registrationOpen) return false;
        if (!this.#registrationDeadline) return true;
        
        const today = new Date();
        return today <= this.#registrationDeadline;
    }
    
    /**
     * Get days remaining until event
     * @returns {number} Days remaining
     */
    getDaysRemaining() {
        const today = new Date();
        const timeDiff = this.#date.getTime() - today.getTime();
        return Math.ceil(timeDiff / (1000 * 3600 * 24));
    }
    
    /**
     * Create HTML card for the event
     * @returns {string} HTML string
     */
    createCard() {
        const formattedDate = this.formatDate(this.#date);
        const daysRemaining = this.isUpcoming() ? this.getDaysRemaining() : 0;
        
        // Determine status text and class based on event status and registration status
        let statusClass, statusText;
        
        if (this.isOngoing()) {
            statusClass = 'bg-success';
            statusText = 'Ongoing';
        } else if (this.isUpcoming()) {
            if (this.isRegistrationActive()) {
                statusClass = 'bg-primary';
                statusText = 'Upcoming';
            } else {
                statusClass = 'bg-warning text-dark';
                statusText = 'Registration Closed';
            }
        } else {
            statusClass = 'bg-secondary';
            statusText = 'Completed';
        }
        
        return `
        <div class="col-md-4 mb-4">
            <div class="card event-card h-100">
                <div class="position-relative">
                    <img src="${this.image}" class="card-img-top" alt="${this.title}">
                    <span class="badge ${statusClass} position-absolute" style="top: 10px; right: 10px;">${statusText}</span>
                </div>
                <div class="card-body">
                    <h5 class="card-title">${this.title}</h5>
                    <span class="badge badge-sport mb-2">${this.sport}</span>
                    <p class="card-text">${this.description.substring(0, 100)}${this.description.length > 100 ? '...' : ''}</p>
                    <div class="event-date"><i class="far fa-calendar-alt"></i> ${formattedDate}</div>
                    <div class="event-location"><i class="fas fa-map-marker-alt"></i> ${this.venue}, ${this.location}</div>
                    ${this.isUpcoming() && this.isRegistrationActive() ? `<div class="mt-2"><strong>${daysRemaining}</strong> days remaining</div>` : ''}
                </div>
                <div class="card-footer bg-white">
                    ${this.isRegistrationActive() ? 
                        `<a href="register.html?event=${this.id}" class="btn btn-sm btn-success w-100">
                            <i class="fas fa-user-plus"></i> Register Now
                        </a>` : 
                        `<button class="btn btn-sm btn-outline-secondary w-100" disabled>
                            <i class="fas fa-times-circle"></i> Registration Closed
                        </button>`
                    }
                </div>
            </div>
        </div>`;
    }
}

/**
 * Sport-specific event classes
 */
class CricketEvent extends Event {
    #format;
    #teams;
    #matchType;
    
    /**
     * Create a cricket event
     * @param {Object} data - Event data
     * @param {string} data.format - Cricket format (T20, ODI, Test)
     * @param {Array} data.teams - Participating teams
     * @param {string} data.matchType - Type of match (International, Domestic)
     */
    constructor(data) {
        super(data);
        this.#format = data.format || 'T20';
        this.#teams = data.teams || [];
        this.#matchType = data.matchType || 'Domestic';
    }
    
    // Getters
    get format() { return this.#format; }
    get teams() { return [...this.#teams]; }
    get matchType() { return this.#matchType; }
    
    /**
     * Create HTML card with cricket-specific details
     * @returns {string} HTML string
     */
    createCard() {
        const baseCard = super.createCard();
        // Insert cricket-specific details before the card footer
        return baseCard.replace('</div>\n                <div class="card-footer', 
            `<div class="mt-2 p-2 bg-light rounded">
                <div><strong>Format:</strong> ${this.#format}</div>
                <div><strong>Match Type:</strong> ${this.#matchType}</div>
                ${this.#teams.length > 0 ? `<div><strong>Teams:</strong> ${this.#teams.join(', ')}</div>` : ''}
            </div></div>\n                <div class="card-footer`);
    }
}

class AthleticsEvent extends Event {
    #disciplines;
    #ageCategories;
    #recordsSet;
    
    /**
     * Create an athletics event
     * @param {Object} data - Event data
     * @param {Array} data.disciplines - Athletics disciplines
     * @param {Array} data.ageCategories - Age categories
     * @param {Array} data.recordsSet - Records set in this event
     */
    constructor(data) {
        super(data);
        this.#disciplines = data.disciplines || [];
        this.#ageCategories = data.ageCategories || [];
        this.#recordsSet = data.recordsSet || [];
    }
    
    // Getters
    get disciplines() { return [...this.#disciplines]; }
    get ageCategories() { return [...this.#ageCategories]; }
    get recordsSet() { return [...this.#recordsSet]; }
    
    /**
     * Create HTML card with athletics-specific details
     * @returns {string} HTML string
     */
    createCard() {
        const baseCard = super.createCard();
        // Insert athletics-specific details before the card footer
        return baseCard.replace('</div>\n                <div class="card-footer', 
            `<div class="mt-2 p-2 bg-light rounded">
                ${this.#disciplines.length > 0 ? `<div><strong>Disciplines:</strong> ${this.#disciplines.join(', ')}</div>` : ''}
                ${this.#ageCategories.length > 0 ? `<div><strong>Age Categories:</strong> ${this.#ageCategories.join(', ')}</div>` : ''}
                ${this.#recordsSet.length > 0 ? `<div><strong>Records:</strong> ${this.#recordsSet.length} new records set</div>` : ''}
            </div></div>\n                <div class="card-footer`);
    }
}

/**
 * News class
 * @class
 */
class News {
    #id;
    #title;
    #summary;
    #content;
    #date;
    #author;
    #image;
    #category;
    #featured;
    
    /**
     * Create a news item
     * @param {Object} data - News data
     */
    constructor(data) {
        this.#id = data.id;
        this.#title = data.title;
        this.#summary = data.summary || '';
        this.#content = data.content || '';
        this.#date = new Date(data.date);
        this.#author = data.author || '';
        this.#image = data.image || '';
        this.#category = data.category || '';
        this.#featured = data.featured || false;
    }
    
    // Getters
    get id() { return this.#id; }
    get title() { return this.#title; }
    get summary() { return this.#summary; }
    get content() { return this.#content; }
    get date() { return this.#date; }
    get author() { return this.#author; }
    get image() { return this.#image; }
    get category() { return this.#category; }
    get featured() { return this.#featured; }
    
    // Methods
    /**
     * Format date in readable format
     * @returns {string} Formatted date
     */
    formatDate() {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return this.#date.toLocaleDateString('en-IN', options);
    }
    
    /**
     * Get reading time in minutes
     * @returns {number} Reading time
     */
    getReadingTime() {
        const wordsPerMinute = 200;
        const wordCount = this.#content.split(/\s+/).length;
        return Math.ceil(wordCount / wordsPerMinute);
    }
    
    /**
     * Create HTML card for the news item
     * @returns {string} HTML string
     */
    createCard() {
        const formattedDate = this.formatDate();
        const readingTime = this.getReadingTime();
        
        return `
        <div class="col-md-4 mb-4">
            <div class="card news-card h-100">
                <img src="${this.image}" class="card-img-top" alt="${this.title}">
                <div class="card-body">
                    <div class="news-date mb-2">
                        <i class="far fa-calendar-alt"></i> ${formattedDate} | 
                        <i class="far fa-clock"></i> ${readingTime} min read
                    </div>
                    <h5 class="card-title">${this.title}</h5>
                    <span class="badge bg-info mb-2">${this.category}</span>
                    <p class="card-text">${this.summary}</p>
                </div>
                <div class="card-footer bg-white">
                    <button class="btn btn-sm btn-outline-primary w-100 read-more-btn" data-news-id="${this.id}">
                        <i class="fas fa-book-open"></i> Read More
                    </button>
                </div>
            </div>
        </div>`;
    }
    
    /**
     * Create full article HTML
     * @returns {string} HTML string
     */
    createFullArticle() {
        const formattedDate = this.formatDate();
        const readingTime = this.getReadingTime();
        
        return `
        <article class="news-article">
            <div class="article-header mb-4">
                <h2 class="article-title">${this.title}</h2>
                <div class="article-meta">
                    <span><i class="far fa-calendar-alt"></i> ${formattedDate}</span>
                    <span><i class="far fa-user"></i> ${this.author}</span>
                    <span><i class="far fa-clock"></i> ${readingTime} min read</span>
                    <span class="badge bg-info">${this.category}</span>
                </div>
            </div>
            <div class="article-image mb-4">
                <img src="${this.image}" class="img-fluid rounded" alt="${this.title}">
            </div>
            <div class="article-content">
                ${this.content.split('\n').map(paragraph => `<p>${paragraph}</p>`).join('')}
            </div>
            <!-- Share buttons removed from here as requested -->
        </article>`;
    }
}

/**
 * Team class
 * @class
 */
class Team {
    #id;
    #name;
    #sport;
    #coach;
    #members;
    #achievements;
    #logo;
    
    /**
     * Create a team
     * @param {Object} data - Team data
     */
    constructor(data) {
        this.#id = data.id;
        this.#name = data.name;
        this.#sport = data.sport || '';
        this.#coach = data.coach || '';
        this.#members = data.members || [];
        this.#achievements = data.achievements || [];
        this.#logo = data.logo || '';
    }
    
    // Getters
    get id() { return this.#id; }
    get name() { return this.#name; }
    get sport() { return this.#sport; }
    get coach() { return this.#coach; }
    get members() { return [...this.#members]; }
    get achievements() { return [...this.#achievements]; }
    get logo() { return this.#logo; }
    
    // Methods
    /**
     * Add a member to the team
     * @param {Athlete} athlete - Athlete to add
     * @returns {boolean} Success status
     */
    addMember(athlete) {
        try {
            if (!(athlete instanceof Athlete)) {
                throw new Error('Member must be an Athlete');
            }
            
            // Check if athlete is already in the team
            const exists = this.#members.some(member => member.id === athlete.id);
            if (exists) {
                throw new Error('Athlete is already a team member');
            }
            
            this.#members.push(athlete);
            return true;
        } catch (error) {
            console.error(`Error adding team member: ${error.message}`);
            return false;
        }
    }
    
    /**
     * Get team size
     * @returns {number} Team size
     */
    getTeamSize() {
        return this.#members.length;
    }
    
    /**
     * Create HTML card for the team
     * @returns {string} HTML string
     */
    createCard() {
        return `
        <div class="col-md-4 mb-4">
            <div class="card team-card h-100">
                ${this.#logo ? `<img src="${this.logo}" class="card-img-top team-logo" alt="${this.name} Logo">` : ''}
                <div class="card-body">
                    <h5 class="card-title">${this.name}</h5>
                    <span class="badge badge-sport mb-2">${this.sport}</span>
                    <p class="card-text"><strong>Coach:</strong> ${this.coach}</p>
                    <p class="card-text"><strong>Team Size:</strong> ${this.getTeamSize()} members</p>
                    ${this.#achievements.length > 0 ? 
                        `<div class="mt-2">
                            <strong>Key Achievements:</strong>
                            <ul class="list-unstyled">
                                ${this.#achievements.slice(0, 3).map(achievement => `<li><i class="fas fa-trophy text-warning"></i> ${achievement}</li>`).join('')}
                            </ul>
                        </div>` : ''
                    }
                </div>
                <div class="card-footer bg-white">
                    <button class="btn btn-sm btn-outline-primary w-100 team-details-btn" data-team-id="${this.id}">
                        <i class="fas fa-users"></i> View Team
                    </button>
                </div>
            </div>
        </div>`;
    }
}

/**
 * Match class
 * @class
 */
class Match {
    #id;
    #event;
    #teams;
    #date;
    #venue;
    #status;
    #result;
    
    /**
     * Create a match
     * @param {Object} data - Match data
     */
    constructor(data) {
        this.#id = data.id;
        this.#event = data.event;
        this.#teams = data.teams || [];
        this.#date = new Date(data.date);
        this.#venue = data.venue || '';
        this.#status = data.status || 'Scheduled'; // Scheduled, Live, Completed
        this.#result = data.result || null;
    }
    
    // Getters
    get id() { return this.#id; }
    get event() { return this.#event; }
    get teams() { return [...this.#teams]; }
    get date() { return this.#date; }
    get venue() { return this.#venue; }
    get status() { return this.#status; }
    get result() { return this.#result; }
    
    // Setters
    set status(status) {
        if (['Scheduled', 'Live', 'Completed'].includes(status)) {
            this.#status = status;
        } else {
            throw new Error('Invalid match status');
        }
    }
    
    set result(result) {
        this.#result = result;
        if (result) {
            this.#status = 'Completed';
        }
    }
    
    // Methods
    /**
     * Format date in readable format
     * @returns {string} Formatted date
     */
    formatDate() {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return this.#date.toLocaleDateString('en-IN', options);
    }
    
    /**
     * Check if match is upcoming
     * @returns {boolean} True if match is upcoming
     */
    isUpcoming() {
        return this.#date > new Date() && this.#status === 'Scheduled';
    }
    
    /**
     * Create HTML card for the match
     * @returns {string} HTML string
     */
    createCard() {
        const formattedDate = this.formatDate();
        const statusClass = this.#status === 'Live' ? 'bg-danger' : 
                           (this.#status === 'Completed' ? 'bg-success' : 'bg-primary');
        
        return `
        <div class="col-md-6 mb-4">
            <div class="card match-card h-100">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <span>${this.#event ? this.#event.title : 'Match'}</span>
                    <span class="badge ${statusClass}">${this.#status}</span>
                </div>
                <div class="card-body">
                    <div class="match-teams d-flex justify-content-between align-items-center mb-3">
                        ${this.#teams.length >= 2 ? `
                            <div class="team-a text-center">
                                <h5>${this.#teams[0].name}</h5>
                                ${this.#teams[0].logo ? `<img src="${this.#teams[0].logo}" alt="${this.#teams[0].name}" class="team-logo-sm">` : ''}
                            </div>
                            <div class="vs">VS</div>
                            <div class="team-b text-center">
                                <h5>${this.#teams[1].name}</h5>
                                ${this.#teams[1].logo ? `<img src="${this.#teams[1].logo}" alt="${this.#teams[1].name}" class="team-logo-sm">` : ''}
                            </div>
                        ` : '<p>Teams TBA</p>'}
                    </div>
                    <div class="match-info">
                        <p><i class="far fa-calendar-alt"></i> ${formattedDate}</p>
                        <p><i class="fas fa-map-marker-alt"></i> ${this.#venue}</p>
                    </div>
                    ${this.#result ? `
                        <div class="match-result p-2 bg-light rounded mt-2">
                            <h6 class="text-center">Result</h6>
                            <p class="text-center mb-0">${this.#result}</p>
                        </div>
                    ` : ''}
                </div>
                <div class="card-footer bg-white">
                    <button class="btn btn-sm btn-outline-primary w-100 match-details-btn" data-match-id="${this.id}">
                        <i class="fas fa-info-circle"></i> Match Details
                    </button>
                </div>
            </div>
        </div>`;
    }
}

// Export classes for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        Person,
        Athlete,
        Event,
        CricketEvent,
        AthleticsEvent,
        News,
        Team,
        Match
    };
}
