/**
 * KhelConnect - Search Module
 * Handles search functionality across the website
 */

document.addEventListener('DOMContentLoaded', function() {
    // Get search query from URL
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('q') || '';
    
    // Display search query in the page
    document.getElementById('search-query').textContent = searchQuery;
    document.querySelectorAll('.search-query-text').forEach(el => {
        el.textContent = searchQuery;
    });
    
    // Set the search input value to the query
    document.getElementById('search-input').value = searchQuery;
    
    // If no search query, show no results
    if (!searchQuery) {
        document.getElementById('loading').classList.add('d-none');
        document.getElementById('no-results').classList.remove('d-none');
        document.getElementById('search-summary').textContent = 'Please enter a search term';
        return;
    }
    
    // Perform search
    setTimeout(() => {
        performSearch(searchQuery);
    }, 500); // Simulate loading for better UX
    
    // Set up filter buttons
    document.querySelectorAll('.filter-btn').forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Filter results
            const filter = this.getAttribute('data-filter');
            filterResults(filter);
        });
    });
});

/**
 * Perform search across all data
 * @param {string} query - Search query
 */
function performSearch(query) {
    // Normalize query for case-insensitive search
    const normalizedQuery = query.toLowerCase();
    
    // Arrays to store search results
    let eventResults = [];
    let athleteResults = [];
    let newsResults = [];
    
    // Search in events data
    appData.events.forEach(event => {
        if (
            event.title.toLowerCase().includes(normalizedQuery) ||
            event.description.toLowerCase().includes(normalizedQuery) ||
            event.location.toLowerCase().includes(normalizedQuery) ||
            event.sport.toLowerCase().includes(normalizedQuery)
        ) {
            eventResults.push({
                type: 'event',
                id: event.id,
                title: event.title,
                description: event.description.substring(0, 150) + '...',
                image: event.image,
                link: `events.html?id=${event.id}`,
                date: event.date,
                location: event.location,
                sport: event.sport
            });
        }
    });
    
    // Search in athletes data
    appData.athletes.forEach(athlete => {
        if (
            athlete.name.toLowerCase().includes(normalizedQuery) ||
            athlete.sport.toLowerCase().includes(normalizedQuery) ||
            athlete.state.toLowerCase().includes(normalizedQuery) ||
            athlete.bio.toLowerCase().includes(normalizedQuery) ||
            athlete.achievements.some(achievement => achievement.toLowerCase().includes(normalizedQuery))
        ) {
            athleteResults.push({
                type: 'athlete',
                id: athlete.id,
                title: athlete.name,
                description: athlete.bio.substring(0, 150) + '...',
                image: athlete.image,
                link: `athletes.html?id=${athlete.id}`,
                sport: athlete.sport,
                state: athlete.state
            });
        }
    });
    
    // Search in news data
    appData.news.forEach(article => {
        if (
            article.title.toLowerCase().includes(normalizedQuery) ||
            article.summary.toLowerCase().includes(normalizedQuery) ||
            article.content.toLowerCase().includes(normalizedQuery) ||
            article.author.toLowerCase().includes(normalizedQuery) ||
            article.category.toLowerCase().includes(normalizedQuery)
        ) {
            newsResults.push({
                type: 'news',
                id: article.id,
                title: article.title,
                description: article.summary,
                image: article.image,
                link: `news.html?id=${article.id}`,
                date: article.date,
                author: article.author,
                category: article.category
            });
        }
    });
    
    // Combine all results
    const allResults = [...eventResults, ...athleteResults, ...newsResults];
    
    // Update search summary
    document.getElementById('search-summary').textContent = 
        `Found ${allResults.length} results for "${query}"`;
    
    // Display results
    displaySearchResults(allResults);
}

/**
 * Display search results in the page
 * @param {Array} results - Array of search results
 */
function displaySearchResults(results) {
    const resultsContainer = document.getElementById('search-results');
    
    // Hide loading indicator
    document.getElementById('loading').classList.add('d-none');
    
    // If no results, show no results message
    if (results.length === 0) {
        document.getElementById('no-results').classList.remove('d-none');
        return;
    }
    
    // Clear previous results
    resultsContainer.innerHTML = '';
    
    // Add each result to the container
    results.forEach(result => {
        const resultCard = createResultCard(result);
        resultsContainer.appendChild(resultCard);
    });
    
    // Add data attributes to the container for filtering
    resultsContainer.setAttribute('data-total', results.length);
    resultsContainer.setAttribute('data-events', results.filter(r => r.type === 'event').length);
    resultsContainer.setAttribute('data-athletes', results.filter(r => r.type === 'athlete').length);
    resultsContainer.setAttribute('data-news', results.filter(r => r.type === 'news').length);
}

/**
 * Create a card element for a search result
 * @param {Object} result - Result object
 * @returns {HTMLElement} - Card element
 */
function createResultCard(result) {
    const col = document.createElement('div');
    col.className = 'col-md-6 col-lg-4 mb-4 search-result-item';
    col.setAttribute('data-type', result.type);
    
    let cardContent = `
        <div class="card h-100">
            <div class="position-relative">
                <img src="${result.image}" class="card-img-top" alt="${result.title}">
                <span class="badge bg-primary position-absolute top-0 end-0 m-2 text-capitalize">${result.type}</span>
            </div>
            <div class="card-body">
                <h5 class="card-title">${result.title}</h5>
                <p class="card-text">${result.description}</p>
    `;
    
    // Add specific details based on result type
    if (result.type === 'event') {
        cardContent += `
                <div class="mt-3">
                    <p class="mb-1"><i class="fas fa-calendar-alt text-primary me-2"></i> ${formatDate(result.date)}</p>
                    <p class="mb-1"><i class="fas fa-map-marker-alt text-primary me-2"></i> ${result.location}</p>
                    <p class="mb-1"><i class="fas fa-running text-primary me-2"></i> ${result.sport}</p>
                </div>
        `;
    } else if (result.type === 'athlete') {
        cardContent += `
                <div class="mt-3">
                    <p class="mb-1"><i class="fas fa-running text-primary me-2"></i> ${result.sport}</p>
                    <p class="mb-1"><i class="fas fa-map-marker-alt text-primary me-2"></i> ${result.state}</p>
                </div>
        `;
    } else if (result.type === 'news') {
        cardContent += `
                <div class="mt-3">
                    <p class="mb-1"><i class="fas fa-calendar-alt text-primary me-2"></i> ${formatDate(result.date)}</p>
                    <p class="mb-1"><i class="fas fa-user text-primary me-2"></i> ${result.author}</p>
                    <p class="mb-1"><i class="fas fa-tag text-primary me-2"></i> ${result.category}</p>
                </div>
        `;
    }
    
    cardContent += `
            </div>
            <div class="card-footer">
                <a href="${result.link}" class="btn btn-primary">View Details</a>
            </div>
        </div>
    `;
    
    col.innerHTML = cardContent;
    return col;
}

/**
 * Filter search results by type
 * @param {string} filter - Filter type (all, events, athletes, news)
 */
function filterResults(filter) {
    const resultsContainer = document.getElementById('search-results');
    const resultItems = document.querySelectorAll('.search-result-item');
    
    // Update search summary based on filter
    const totalResults = parseInt(resultsContainer.getAttribute('data-total') || '0');
    const query = document.getElementById('search-query').textContent;
    
    let summaryText = '';
    if (filter === 'all') {
        summaryText = `Found ${totalResults} results for "${query}"`;
    } else {
        const filterCount = parseInt(resultsContainer.getAttribute(`data-${filter}`) || '0');
        summaryText = `Found ${filterCount} ${filter} for "${query}"`;
    }
    
    document.getElementById('search-summary').textContent = summaryText;
    
    // Show/hide results based on filter
    resultItems.forEach(item => {
        if (filter === 'all' || item.getAttribute('data-type') === filter.slice(0, -1)) {
            item.classList.remove('d-none');
        } else {
            item.classList.add('d-none');
        }
    });
    
    // Show no results message if no visible results
    const visibleResults = document.querySelectorAll('.search-result-item:not(.d-none)');
    if (visibleResults.length === 0) {
        document.getElementById('no-results').classList.remove('d-none');
    } else {
        document.getElementById('no-results').classList.add('d-none');
    }
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
