/**
 * KhelConnect - Gallery Page Script
 * Handles displaying and filtering gallery images
 */

// Use strict mode for better error handling and performance
'use strict';

// Gallery module using IIFE pattern
const Gallery = (function() {
    // Private variables
    let _galleryItems = [];
    let _currentFilter = 'all';
    let _itemsPerPage = 9;
    let _currentPage = 1;
    let _totalPages = 1;
    
    // DOM Elements cache
    const DOM = {
        galleryContainer: document.getElementById('gallery-container'),
        galleryLoading: document.getElementById('gallery-loading'),
        filterButtons: document.querySelectorAll('.gallery-filter-btn'),
        pagination: document.getElementById('gallery-pagination')
    };
    
    /**
     * Initialize the gallery page
     */
    function init() {
        console.log('Gallery page initializing...');
        
        try {
            // Create gallery items from static images
            createGalleryItems();
            
            // Set up event listeners
            setupEventListeners();
            
            // Render gallery with initial filter (all)
            renderGallery();
        } catch (error) {
            console.error('Error initializing gallery:', error);
            showError('Failed to initialize gallery. Please try refreshing the page.');
        }
    }
    
    /**
     * Create gallery items from static images
     */
    function createGalleryItems() {
        // Define static gallery items
        _galleryItems = [
            {
                id: 'athlete-1',
                title: 'Cricket Star in Action',
                description: 'National Cricket Championship 2025',
                image: 'images/athlete1.jpg',
                category: 'athletes',
                badge: 'Athletes'
            },
            {
                id: 'athlete-2',
                title: 'Javelin Throw Champion',
                description: 'Olympic Gold Medalist',
                image: 'images/athlete2.jpg',
                category: 'athletes',
                badge: 'Athletes'
            },
            {
                id: 'athlete-3',
                title: 'Badminton Champion',
                description: 'All England Open 2025',
                image: 'images/athlete3.jpg',
                category: 'athletes',
                badge: 'Athletes'
            },
            {
                id: 'event-1',
                title: 'Cricket World Cup',
                description: 'Mumbai, India - 2023',
                image: 'images/cricket-event.jpg',
                category: 'events',
                badge: 'Events'
            },
            {
                id: 'event-2',
                title: 'National Athletics Championship',
                description: 'Delhi, India - 2024',
                image: 'images/athletics-event.jpg',
                category: 'events',
                badge: 'Events'
            },
            {
                id: 'event-3',
                title: 'India Open Badminton',
                description: 'Hyderabad, India - 2024',
                image: 'images/badminton-event.jpg',
                category: 'events',
                badge: 'Events'
            },
            {
                id: 'facility-1',
                title: 'National Cricket Stadium',
                description: 'Mumbai, India',
                image: 'images/news1.jpg',
                category: 'facilities',
                badge: 'Facilities'
            },
            {
                id: 'facility-2',
                title: 'Sports Authority Training Center',
                description: 'Bengaluru, India',
                image: 'images/news2.jpg',
                category: 'facilities',
                badge: 'Facilities'
            },
            {
                id: 'facility-3',
                title: 'Indira Gandhi Sports Complex',
                description: 'New Delhi, India',
                image: 'images/news3.jpg',
                category: 'facilities',
                badge: 'Facilities'
            }
        ];
        
        // Calculate total pages
        _totalPages = Math.ceil(_galleryItems.length / _itemsPerPage);
    }
    
    /**
     * Set up event listeners
     */
    function setupEventListeners() {
        // Filter buttons
        if (DOM.filterButtons) {
            DOM.filterButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const filter = this.getAttribute('data-filter');
                    
                    // Update active button
                    DOM.filterButtons.forEach(btn => btn.classList.remove('active'));
                    this.classList.add('active');
                    
                    // Apply filter
                    _currentFilter = filter;
                    _currentPage = 1; // Reset to first page when filter changes
                    renderGallery();
                });
            });
        }
        
        // Lightbox settings
        if (typeof lightbox !== 'undefined') {
            try {
                lightbox.option({
                    'resizeDuration': 200,
                    'wrapAround': true,
                    'albumLabel': 'Image %1 of %2'
                });
            } catch (error) {
                console.error('Error setting up lightbox:', error);
            }
        }
    }
    
    /**
     * Render gallery with current filter and pagination
     */
    function renderGallery() {
        try {
            if (!DOM.galleryContainer) {
                console.error('Gallery container not found');
                return;
            }
            
            // Show loading spinner
            if (DOM.galleryLoading) {
                DOM.galleryLoading.style.display = 'block';
            }
            
            // Clear container
            DOM.galleryContainer.innerHTML = '';
            
            // Filter items
            let filteredItems = _galleryItems;
            if (_currentFilter !== 'all') {
                filteredItems = _galleryItems.filter(item => item.category === _currentFilter);
            }
            
            // Calculate pagination
            _totalPages = Math.ceil(filteredItems.length / _itemsPerPage);
            const startIndex = (_currentPage - 1) * _itemsPerPage;
            const endIndex = startIndex + _itemsPerPage;
            const currentPageItems = filteredItems.slice(startIndex, endIndex);
            
            // Check if no items found
            if (filteredItems.length === 0) {
                DOM.galleryContainer.innerHTML = `
                    <div class="col-12 text-center">
                        <div class="alert alert-info">
                            <i class="fas fa-info-circle me-2"></i> No gallery items found matching your filter.
                        </div>
                    </div>
                `;
                
                // Hide pagination
                if (DOM.pagination) {
                    DOM.pagination.innerHTML = '';
                }
                
                // Hide loading spinner
                if (DOM.galleryLoading) {
                    DOM.galleryLoading.style.display = 'none';
                }
                
                return;
            }
            
            // Render gallery items
            currentPageItems.forEach(item => {
                const galleryItemHTML = createGalleryItemHTML(item);
                DOM.galleryContainer.innerHTML += galleryItemHTML;
            });
            
            // Render pagination
            renderPagination(_totalPages);
            
            // Hide loading spinner
            if (DOM.galleryLoading) {
                DOM.galleryLoading.style.display = 'none';
            }
            
            console.log('Gallery rendered successfully with', currentPageItems.length, 'items');
            
            // Add animation with delay
            const galleryItems = DOM.galleryContainer.querySelectorAll('.gallery-item');
            galleryItems.forEach((item, index) => {
                setTimeout(() => {
                    item.classList.add('fade-in');
                }, index * 100);
            });
        } catch (error) {
            console.error('Error rendering gallery:', error);
            showError('Failed to render gallery. Please try refreshing the page.');
        }
    }
    
    /**
     * Create HTML for a gallery item
     * @param {Object} item - Gallery item object
     * @returns {string} HTML for the gallery item
     */
    function createGalleryItemHTML(item) {
        let badgeClass = 'bg-secondary';
        if (item.category === 'events') badgeClass = 'bg-primary';
        if (item.category === 'facilities') badgeClass = 'bg-info';
        
        return `
            <div class="col-md-4 gallery-item" data-category="${item.category}">
                <a href="${item.image}" data-lightbox="sports-gallery" data-title="${item.title}">
                    <img src="${item.image}" alt="${item.title}" class="img-fluid">
                </a>
                <div class="gallery-caption">
                    <h5>${item.title}</h5>
                    <p>${item.description}</p>
                    <span class="badge ${badgeClass}">${item.badge}</span>
                </div>
            </div>
        `;
    }
    
    /**
     * Render pagination
     * @param {number} totalPages - Total number of pages
     */
    function renderPagination(totalPages) {
        if (!DOM.pagination) return;
        
        // Clear pagination
        DOM.pagination.innerHTML = '';
        
        // Don't show pagination if only one page
        if (totalPages <= 1) return;
        
        // Previous button
        const prevDisabled = _currentPage === 1 ? 'disabled' : '';
        DOM.pagination.innerHTML += `
            <li class="page-item ${prevDisabled}">
                <a class="page-link" href="#" data-page="${_currentPage - 1}" aria-label="Previous">
                    <span aria-hidden="true">&laquo;</span>
                </a>
            </li>
        `;
        
        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            const active = i === _currentPage ? 'active' : '';
            DOM.pagination.innerHTML += `
                <li class="page-item ${active}">
                    <a class="page-link" href="#" data-page="${i}">${i}</a>
                </li>
            `;
        }
        
        // Next button
        const nextDisabled = _currentPage === totalPages ? 'disabled' : '';
        DOM.pagination.innerHTML += `
            <li class="page-item ${nextDisabled}">
                <a class="page-link" href="#" data-page="${_currentPage + 1}" aria-label="Next">
                    <span aria-hidden="true">&raquo;</span>
                </a>
            </li>
        `;
        
        // Add event listeners to pagination links
        DOM.pagination.querySelectorAll('.page-link').forEach(link => {
            link.addEventListener('click', function(event) {
                event.preventDefault();
                
                const page = parseInt(this.dataset.page);
                if (page && page !== _currentPage && page >= 1 && page <= totalPages) {
                    _currentPage = page;
                    renderGallery();
                    
                    // Scroll to top of gallery container
                    DOM.galleryContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }
    
    /**
     * Show error message
     * @param {string} message - Error message to display
     */
    function showError(message) {
        if (DOM.galleryContainer) {
            DOM.galleryContainer.innerHTML = `
                <div class="col-12">
                    <div class="alert alert-danger">
                        <i class="fas fa-exclamation-circle me-2"></i> ${message}
                    </div>
                </div>
            `;
        }
        
        // Hide loading spinner
        if (DOM.galleryLoading) {
            DOM.galleryLoading.style.display = 'none';
        }
    }
    
    // Initialize when DOM is loaded
    document.addEventListener('DOMContentLoaded', init);
    
    // Public API
    return {
        init: init,
        renderGallery: renderGallery
    };
})();
