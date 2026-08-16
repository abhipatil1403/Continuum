/**
 * KhelConnect - News Page Script
 * Implements the functionality for the news page
 */

// Use strict mode for better error handling and performance
'use strict';

// News page module using IIFE pattern
const NewsPage = (function() {
    // Private variables
    let _news = [];
    let _filteredNews = [];
    let _currentPage = 1;
    let _newsPerPage = 6;
    let _currentFilters = {
        category: '',
        dateRange: '',
        author: ''
    };
    
    // DOM Elements cache
    const DOM = {
        newsContainer: document.getElementById('news-container'),
        pagination: document.getElementById('news-pagination'),
        filterForm: document.getElementById('news-filter-form'),
        categoryFilter: document.getElementById('category-filter'),
        dateFilter: document.getElementById('date-filter'),
        authorFilter: document.getElementById('author-filter'),
        readFeaturedArticle: document.getElementById('read-featured-article')
    };
    
    /**
     * Initialize the news page
     */
    function init() {
        console.log('News page initializing...');
        
        // Get news from the main application
        if (window.KhelConnect && KhelConnect.getNews) {
            _news = KhelConnect.getNews();
            _filteredNews = [..._news];
            
            // Render news
            renderNews();
            
            // Set up event listeners
            setupEventListeners();
            
            console.log('News page initialized successfully');
        } else {
            console.error('KhelConnect main module not found');
            showError('Failed to load news data. Please refresh the page.');
        }
    }
    
    /**
     * Set up event listeners for interactive elements
     */
    function setupEventListeners() {
        // Filter form submission
        if (DOM.filterForm) {
            DOM.filterForm.addEventListener('submit', function(e) {
                e.preventDefault();
                applyFilters();
            });
            
            // Reset button
            DOM.filterForm.addEventListener('reset', function() {
                setTimeout(() => {
                    _currentFilters = {
                        category: '',
                        dateRange: '',
                        author: ''
                    };
                    applyFilters();
                }, 10); // Small timeout to ensure form reset completes
            });
        }
        
        // Read featured article button
        if (DOM.readFeaturedArticle) {
            DOM.readFeaturedArticle.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Find featured article
                const featuredNews = _news.find(news => news.featured);
                if (featuredNews) {
                    showFullArticle(featuredNews.id);
                }
            });
        }
        
        // Pagination click events will be set up when pagination is rendered
    }
    
    /**
     * Set up event handlers for news cards
     */
    function setupNewsCardEvents() {
        // Use direct event binding instead of jQuery delegation
        document.querySelectorAll('.read-more-btn').forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const newsId = parseInt(this.getAttribute('data-news-id'));
                showFullArticle(newsId);
            });
        });
    }
    
    /**
     * Apply filters to news
     */
    function applyFilters() {
        // Get filter values
        if (DOM.categoryFilter) _currentFilters.category = DOM.categoryFilter.value;
        if (DOM.dateFilter) _currentFilters.dateRange = DOM.dateFilter.value;
        if (DOM.authorFilter) _currentFilters.author = DOM.authorFilter.value;
        
        // Filter news
        _filteredNews = _news.filter(news => {
            // Category filter
            if (_currentFilters.category && news.category !== _currentFilters.category) {
                return false;
            }
            
            // Author filter
            if (_currentFilters.author && news.author !== _currentFilters.author) {
                return false;
            }
            
            // Date range filter
            if (_currentFilters.dateRange) {
                const today = new Date();
                const newsDate = new Date(news.date);
                
                if (_currentFilters.dateRange === 'today') {
                    return newsDate.toDateString() === today.toDateString();
                }
                
                if (_currentFilters.dateRange === 'this-week') {
                    const weekStart = new Date(today);
                    weekStart.setDate(today.getDate() - today.getDay());
                    return newsDate >= weekStart;
                }
                
                if (_currentFilters.dateRange === 'this-month') {
                    return newsDate.getMonth() === today.getMonth() && 
                           newsDate.getFullYear() === today.getFullYear();
                }
                
                if (_currentFilters.dateRange === 'this-year') {
                    return newsDate.getFullYear() === today.getFullYear();
                }
            }
            
            return true;
        });
        
        // Reset to first page
        _currentPage = 1;
        
        // Update section title
        updateSectionTitle();
        
        // Render filtered news
        renderNews();
    }
    
    /**
     * Update section title based on filters
     */
    function updateSectionTitle() {
        const sectionTitle = document.querySelector('.section-title');
        if (!sectionTitle) return;
        
        let title = 'Latest News';
        
        if (_currentFilters.category) {
            title = `${_currentFilters.category} News`;
        }
        
        if (_currentFilters.dateRange) {
            let dateText = '';
            
            switch(_currentFilters.dateRange) {
                case 'today':
                    dateText = 'Today';
                    break;
                case 'this-week':
                    dateText = 'This Week';
                    break;
                case 'this-month':
                    dateText = 'This Month';
                    break;
                case 'this-year':
                    dateText = 'This Year';
                    break;
            }
            
            title = `${title} - ${dateText}`;
        }
        
        if (_currentFilters.author) {
            title = `${title} by ${_currentFilters.author}`;
        }
        
        sectionTitle.textContent = title;
    }
    
    /**
     * Render news with pagination
     */
    function renderNews() {
        if (!DOM.newsContainer) return;
        
        // Calculate pagination
        const totalPages = Math.ceil(_filteredNews.length / _newsPerPage);
        const startIndex = (_currentPage - 1) * _newsPerPage;
        const endIndex = startIndex + _newsPerPage;
        const currentPageNews = _filteredNews.slice(startIndex, endIndex);
        
        // Clear container
        DOM.newsContainer.innerHTML = '';
        
        // Check if no news found
        if (_filteredNews.length === 0) {
            DOM.newsContainer.innerHTML = `
                <div class="col-12 text-center">
                    <div class="alert alert-info">
                        <i class="fas fa-info-circle me-2"></i> No news found matching your filters.
                    </div>
                </div>
            `;
            
            // Hide pagination
            if (DOM.pagination) {
                DOM.pagination.innerHTML = '';
            }
            
            return;
        }
        
        // Render news cards
        currentPageNews.forEach(news => {
            DOM.newsContainer.innerHTML += news.createCard();
        });
        
        // Set up event handlers for the newly added news cards
        setupNewsCardEvents();
        
        // Render pagination
        renderPagination(totalPages);
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
                    renderNews();
                    
                    // Scroll to top of news container
                    DOM.newsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }
    
    /**
     * Redirect to news detail page
     * @param {number} newsId - ID of the news item
     */
    function showFullArticle(newsId) {
        const news = _news.find(item => item.id === newsId);
        
        if (!news) {
            console.error(`News with ID ${newsId} not found`);
            return;
        }
        
        // Redirect to news detail page
        window.location.href = `news-detail.html?id=${newsId}`;
    }
    
    /**
     * Show error message
     * @param {string} message - Error message
     */
    function showError(message) {
        if (DOM.newsContainer) {
            DOM.newsContainer.innerHTML = `
                <div class="col-12">
                    <div class="alert alert-danger">
                        <i class="fas fa-exclamation-circle me-2"></i> ${message}
                    </div>
                </div>
            `;
        } else {
            alert(message);
        }
    }
    
    // Initialize when DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
        init();
        // Event handlers for news cards will be set up in renderNews
    });
    
    // Public API
    return {
        init,
        applyFilters,
        showFullArticle
    };
})();
