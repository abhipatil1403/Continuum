/**
 * KhelConnect - News Detail Page Script
 * Handles displaying a single news article in detail
 */

// Use strict mode for better error handling and performance
'use strict';

// News Detail page module using IIFE pattern
const NewsDetail = (function() {
    // Private variables
    let _newsId = null;
    let _currentNews = null;
    let _allNews = [];
    let _relatedNews = [];
    
    // DOM Elements cache
    const DOM = {
        newsDetailContainer: document.getElementById('news-detail-container'),
        relatedNewsContainer: document.getElementById('related-news-container'),
        shareButtons: {
            twitter: document.querySelector('.share-twitter'),
            facebook: document.querySelector('.share-facebook'),
            linkedin: document.querySelector('.share-linkedin'),
            email: document.querySelector('.share-email')
        }
    };
    
    /**
     * Initialize the news detail page
     */
    function init() {
        console.log('News detail page initializing...');
        
        // Get news ID from URL parameter
        _newsId = getNewsIdFromUrl();
        
        if (!_newsId) {
            showError('News article not found. Please return to the news page.');
            return;
        }
        
        // Get news data from the main application
        if (window.KhelConnect && KhelConnect.getNews) {
            _allNews = KhelConnect.getNews();
            _currentNews = _allNews.find(news => news.id === parseInt(_newsId));
            
            if (!_currentNews) {
                showError(`News article with ID ${_newsId} not found.`);
                return;
            }
            
            // Set page title
            document.title = `${_currentNews.title} - KhelConnect`;
            
            // Render news detail
            renderNewsDetail();
            
            // Find related news (same category)
            let sameCategory = _allNews.filter(news => 
                news.id !== parseInt(_newsId) && news.category === _currentNews.category
            );
            
            // If we don't have enough news in the same category, add some random news
            if (sameCategory.length < 5) {
                // Get random news from other categories
                const otherNews = _allNews.filter(news => 
                    news.id !== parseInt(_newsId) && news.category !== _currentNews.category
                );
                
                // Shuffle the other news array
                const shuffled = [...otherNews].sort(() => 0.5 - Math.random());
                
                // Take enough random news to have 5 total related news
                const randomNews = shuffled.slice(0, 5 - sameCategory.length);
                
                // Combine same category and random news
                _relatedNews = [...sameCategory, ...randomNews];
            } else {
                // We have enough news in the same category
                _relatedNews = sameCategory.slice(0, 5); // Get up to 5 related news items
            }
            
            // Render related news
            renderRelatedNews();
            
            // No upcoming events section as requested
            
            // Set up share buttons
            setupShareButtons();
            
            console.log('News detail page initialized successfully');
        } else {
            console.error('KhelConnect main module not found');
            showError('Failed to load news data. Please refresh the page.');
        }
    }
    
    /**
     * Get news ID from URL parameter
     * @returns {number|null} News ID or null if not found
     */
    function getNewsIdFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        return id ? parseInt(id) : null;
    }
    
    /**
     * Render news detail
     */
    function renderNewsDetail() {
        if (!_currentNews) return;
        
        // Update document title
        document.title = `${_currentNews.title} - KhelConnect`;
        
        // Use the createFullArticle method from the News class
        if (DOM.newsDetailContainer) {
            // Add custom header with title and date before the article content
            const formattedDate = _currentNews.formatDate();
            const readingTime = _currentNews.getReadingTime();
            
            const articleHTML = `
                <div class="mb-4">
                    <h1 class="mb-3">${_currentNews.title}</h1>
                    <div class="d-flex align-items-center text-muted mb-4">
                        <span class="me-3"><i class="far fa-calendar-alt me-1"></i> ${formattedDate}</span>
                        <span class="me-3"><i class="far fa-clock me-1"></i> ${readingTime} min read</span>
                        <span><i class="far fa-user me-1"></i> ${_currentNews.author}</span>
                    </div>
                    <div class="mb-4">
                        <span class="badge bg-primary">${_currentNews.category}</span>
                    </div>
                </div>
                ${_currentNews.createFullArticle()}
            `;
            
            DOM.newsDetailContainer.innerHTML = articleHTML;
            
            // Add animation
            setTimeout(() => {
                DOM.newsDetailContainer.classList.add('fade-in');
            }, 100);
        }
    }
    
    /**
     * Render related news
     */
    function renderRelatedNews() {
        if (!DOM.relatedNewsContainer) return;
        
        if (_relatedNews.length === 0) {
            DOM.relatedNewsContainer.innerHTML = `
                <p class="text-muted small">No related news found.</p>
            `;
            return;
        }
        
        let html = '';
        
        // First news item is larger
        const firstNews = _relatedNews[0];
        html += `
            <div class="related-news-item mb-4 cursor-pointer featured-related" data-news-id="${firstNews.id}">
                <div class="position-relative">
                    <img src="${firstNews.image}" class="img-fluid rounded w-100" alt="${firstNews.title}">
                    <div class="position-absolute bottom-0 start-0 w-100 p-2 bg-dark bg-opacity-75 rounded-bottom">
                        <h6 class="text-white mb-1">${firstNews.title}</h6>
                        <div class="d-flex justify-content-between align-items-center">
                            <div class="small text-light">${firstNews.formatDate()}</div>
                            <div class="badge bg-${firstNews.category === _currentNews.category ? 'primary' : 'secondary'} rounded-pill">
                                ${firstNews.category}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <hr class="my-3">
        `;
        
        // Remaining news items in a list
        _relatedNews.slice(1).forEach(news => {
            html += `
                <div class="related-news-item mb-3 cursor-pointer" data-news-id="${news.id}">
                    <div class="row g-0">
                        <div class="col-4">
                            <img src="${news.image}" class="img-fluid rounded" alt="${news.title}">
                        </div>
                        <div class="col-8 ps-3">
                            <h6 class="mb-1">${news.title}</h6>
                            <div class="d-flex justify-content-between align-items-center">
                                <div class="small text-muted">${news.formatDate()}</div>
                                <div class="badge bg-${news.category === _currentNews.category ? 'primary' : 'secondary'} rounded-pill small">
                                    ${news.category}
                                </div>
                            </div>
                            <div class="small text-primary mt-1">Read more <i class="fas fa-arrow-right"></i></div>
                        </div>
                    </div>
                </div>
                ${news !== _relatedNews[_relatedNews.length - 1] ? '<hr class="my-2">' : ''}
            `;
        });
        
        DOM.relatedNewsContainer.innerHTML = html;
        
        // Add click event handlers to related news items
        setupRelatedNewsEvents();
    }
    
    // Upcoming events section removed as requested
    
    /**
     * Set up event handlers for related news items
     */
    function setupRelatedNewsEvents() {
        if (!DOM.relatedNewsContainer) return;
        
        // Add click event handlers to related news items
        DOM.relatedNewsContainer.querySelectorAll('.related-news-item').forEach(item => {
            item.addEventListener('click', function() {
                const newsId = this.getAttribute('data-news-id');
                if (newsId) {
                    // Navigate to the news detail page with the selected news ID
                    window.location.href = `news-detail.html?id=${newsId}`;
                }
            });
        });
    }
    
    /**
     * Set up share buttons
     */
    function setupShareButtons() {
        if (!_currentNews) return;
        
        const pageUrl = window.location.href;
        const title = _currentNews.title;
        const summary = _currentNews.summary;
        
        // Twitter share
        if (DOM.shareButtons.twitter) {
            DOM.shareButtons.twitter.addEventListener('click', function(e) {
                e.preventDefault();
                const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(pageUrl)}`;
                window.open(twitterUrl, '_blank');
            });
        }
        
        // Facebook share
        if (DOM.shareButtons.facebook) {
            DOM.shareButtons.facebook.addEventListener('click', function(e) {
                e.preventDefault();
                const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`;
                window.open(facebookUrl, '_blank');
            });
        }
        
        // LinkedIn share
        if (DOM.shareButtons.linkedin) {
            DOM.shareButtons.linkedin.addEventListener('click', function(e) {
                e.preventDefault();
                const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`;
                window.open(linkedinUrl, '_blank');
            });
        }
        
        // Email share
        if (DOM.shareButtons.email) {
            DOM.shareButtons.email.addEventListener('click', function(e) {
                e.preventDefault();
                const emailSubject = `Check out this article: ${title}`;
                const emailBody = `I thought you might be interested in this article from KhelConnect:\n\n${title}\n\n${summary}\n\nRead more: ${pageUrl}`;
                const emailUrl = `mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
                window.location.href = emailUrl;
            });
        }
    }
    
    /**
     * Show error message
     * @param {string} message - Error message
     */
    function showError(message) {
        if (DOM.newsDetailContainer) {
            DOM.newsDetailContainer.innerHTML = `
                <div class="alert alert-danger">
                    <i class="fas fa-exclamation-circle me-2"></i> ${message}
                </div>
                <div class="mt-4">
                    <a href="news.html" class="btn btn-primary">
                        <i class="fas fa-arrow-left me-2"></i> Back to News
                    </a>
                </div>
            `;
        } else {
            alert(message);
        }
    }
    
    // Initialize when DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
        init();
    });
    
    // Public API
    return {
        init
    };
})();
