/**
 * KhelConnect - Athletes Page Script
 * Implements the functionality for the athletes page
 */

// Use strict mode for better error handling and performance
'use strict';

// Athletes page module using IIFE pattern
const AthletesPage = (function() {
    // Private variables
    let _athletes = [];
    let _filteredAthletes = [];
    let _currentPage = 1;
    let _athletesPerPage = 6;
    let _currentFilters = {
        category: 'all', // all, medal-winners
        sport: '',
        state: '',
        medalType: ''
    };
    
    // DOM Elements cache
    const DOM = {
        athletesContainer: document.getElementById('athletes-container'),
        pagination: document.getElementById('athletes-pagination'),
        filterForm: document.getElementById('athlete-filter-form'),
        sportFilter: document.getElementById('sport-filter'),
        stateFilter: document.getElementById('state-filter'),
        medalFilter: document.getElementById('medal-filter'),
        allAthletesBtn: document.getElementById('all-athletes-btn'),
        medalWinnersBtn: document.getElementById('medal-winners-btn'),
        topMedalists: document.getElementById('top-medalists'),
        medalChart: document.getElementById('medal-chart'),
        nominationForm: document.getElementById('athlete-nomination-form')
    };
    
    // Chart instance
    let _medalChart = null;
    
    /**
     * Initialize the athletes page
     */
    function init() {
        console.log('Athletes page initializing...');
        
        // Get athletes from the main application
        if (window.KhelConnect && KhelConnect.getAthletes) {
            _athletes = KhelConnect.getAthletes();
            _filteredAthletes = [..._athletes];
            
            // Render athletes
            renderAthletes();
            
            // Set up event listeners
            setupEventListeners();
            
            // Initialize medal statistics
            initMedalStatistics();
            
            console.log('Athletes page initialized successfully');
        } else {
            console.error('KhelConnect main module not found');
            showError('Failed to load athletes data. Please refresh the page.');
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
                        category: _currentFilters.category, // Keep the current category
                        sport: '',
                        state: '',
                        medalType: ''
                    };
                    applyFilters();
                }, 10);
            });
        }
        
        // Category filter buttons
        if (DOM.allAthletesBtn) {
            DOM.allAthletesBtn.addEventListener('click', function() {
                setActiveCategoryButton(this);
                _currentFilters.category = 'all';
                applyFilters();
            });
        }
        
        if (DOM.medalWinnersBtn) {
            DOM.medalWinnersBtn.addEventListener('click', function() {
                setActiveCategoryButton(this);
                _currentFilters.category = 'medal-winners';
                applyFilters();
            });
        }
        
        // Nomination form
        if (DOM.nominationForm) {
            DOM.nominationForm.addEventListener('submit', function(event) {
                event.preventDefault();
                handleNominationSubmission();
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
            $('#athlete-nomination-form input, #athlete-nomination-form select, #athlete-nomination-form textarea').on('focus', function() {
                $(this).removeClass('is-invalid').addClass('is-valid');
            }).on('blur', function() {
                if ($(this).val() === '') {
                    $(this).removeClass('is-valid').addClass('is-invalid');
                } else {
                    $(this).removeClass('is-invalid').addClass('is-valid');
                }
            });
            
            // Athlete card hover effects
            $(document).on('mouseenter', '.athlete-card', function() {
                $(this).find('.card-img-top').css('transform', 'scale(1.05)');
                $(this).find('.card-img-top').css('transition', 'transform 0.3s ease');
            }).on('mouseleave', '.athlete-card', function() {
                $(this).find('.card-img-top').css('transform', 'scale(1)');
            });
            
            // Pagination click animation
            $('#athletes-pagination').on('click', '.page-link', function() {
                $('.page-item').removeClass('active');
                $(this).parent().addClass('active');
                
                // Smooth scroll to top of athletes container
                $('html, body').animate({
                    scrollTop: $('#athletes-container').offset().top - 100
                }, 500);
            });
            
            // Medal filter change
            $('#medal-filter').on('change', function() {
                // Highlight the chart segment that corresponds to the selected medal type
                if (_medalChart) {
                    const medalType = $(this).val();
                    const datasets = _medalChart.data.datasets[0];
                    
                    // Reset all segments to normal
                    datasets.backgroundColor = [
                        'rgba(255, 215, 0, 0.7)',  // Gold
                        'rgba(192, 192, 192, 0.7)', // Silver
                        'rgba(205, 127, 50, 0.7)'   // Bronze
                    ];
                    
                    // Highlight selected segment
                    if (medalType === 'gold') {
                        datasets.backgroundColor[0] = 'rgba(255, 215, 0, 1)';
                    } else if (medalType === 'silver') {
                        datasets.backgroundColor[1] = 'rgba(192, 192, 192, 1)';
                    } else if (medalType === 'bronze') {
                        datasets.backgroundColor[2] = 'rgba(205, 127, 50, 1)';
                    }
                    
                    _medalChart.update();
                }
            });
        });
    }
    
    /**
     * Set active category button
     * @param {HTMLElement} button - Button to set as active
     */
    function setActiveCategoryButton(button) {
        // Remove active class from all category buttons
        document.querySelectorAll('#all-athletes-btn, #medal-winners-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Add active class to clicked button
        button.classList.add('active');
    }
    
    /**
     * Apply filters to athletes
     */
    function applyFilters() {
        // Get filter values
        if (DOM.sportFilter) _currentFilters.sport = DOM.sportFilter.value;
        if (DOM.stateFilter) _currentFilters.state = DOM.stateFilter.value;
        if (DOM.medalFilter) _currentFilters.medalType = DOM.medalFilter.value;
        
        // Filter athletes
        _filteredAthletes = _athletes.filter(athlete => {
            // Category filter
            if (_currentFilters.category === 'medal-winners') {
                const totalMedals = athlete.getTotalMedals();
                if (totalMedals === 0) {
                    return false;
                }
            }
            
            // Sport filter
            if (_currentFilters.sport && athlete.sport !== _currentFilters.sport) {
                return false;
            }
            
            // State filter
            if (_currentFilters.state && athlete.state !== _currentFilters.state) {
                return false;
            }
            
            // Medal type filter
            if (_currentFilters.medalType) {
                const medals = athlete.medals;
                if (_currentFilters.medalType === 'gold' && medals.gold === 0) {
                    return false;
                }
                if (_currentFilters.medalType === 'silver' && medals.silver === 0) {
                    return false;
                }
                if (_currentFilters.medalType === 'bronze' && medals.bronze === 0) {
                    return false;
                }
            }
            
            return true;
        });
        
        // Reset to first page
        _currentPage = 1;
        
        // Render filtered athletes
        renderAthletes();
        
        // Update section title
        updateSectionTitle();
    }
    
    /**
     * Update section title based on filters
     */
    function updateSectionTitle() {
        const sectionTitle = document.querySelector('.section-title');
        if (!sectionTitle) return;
        
        let title = 'All Athletes';
        
        if (_currentFilters.category === 'medal-winners') {
            title = 'Medal Winners';
        }
        
        if (_currentFilters.sport) {
            title = `${_currentFilters.sport} ${title}`;
        }
        
        if (_currentFilters.state) {
            title += ` from ${_currentFilters.state}`;
        }
        
        if (_currentFilters.medalType) {
            const medalType = _currentFilters.medalType.charAt(0).toUpperCase() + _currentFilters.medalType.slice(1);
            title += ` (${medalType} Medalists)`;
        }
        
        sectionTitle.textContent = title;
    }
    
    /**
     * Render athletes with pagination
     */
    function renderAthletes() {
        if (!DOM.athletesContainer) return;
        
        try {
            // Calculate pagination
            const totalPages = Math.ceil(_filteredAthletes.length / _athletesPerPage);
            const startIndex = (_currentPage - 1) * _athletesPerPage;
            const endIndex = startIndex + _athletesPerPage;
            const athletesToShow = _filteredAthletes.slice(startIndex, endIndex);
            
            // Generate HTML
            if (athletesToShow.length > 0) {
                const html = athletesToShow.map(athlete => athlete.createCard()).join('');
                DOM.athletesContainer.innerHTML = html;
                
                // Add animation with staggered delay
                DOM.athletesContainer.querySelectorAll('.card').forEach((card, index) => {
                    setTimeout(() => {
                        card.classList.add('fade-in');
                    }, index * 100);
                });
                
                // Add event listeners to athlete cards
                DOM.athletesContainer.querySelectorAll('.card').forEach(card => {
                    card.addEventListener('click', function() {
                        const athleteId = this.dataset.athleteId;
                        if (athleteId) {
                            showAthleteDetails(parseInt(athleteId));
                        }
                    });
                });
            } else {
                DOM.athletesContainer.innerHTML = `
                    <div class="col-12">
                        <div class="alert alert-info">
                            <i class="fas fa-info-circle"></i> No athletes found matching your criteria.
                        </div>
                    </div>
                `;
            }
            
            // Render pagination
            renderPagination(totalPages);
            
            console.log('Athletes rendered successfully');
        } catch (error) {
            console.error('Error rendering athletes:', error);
            showError('Error loading athletes. Please try again.');
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
                    renderAthletes();
                    
                    // Scroll to top of athletes container
                    DOM.athletesContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }
    
    /**
     * Initialize medal statistics
     */
    function initMedalStatistics() {
        renderTopMedalists();
        renderMedalChart();
    }
    
    /**
     * Render top medalists
     */
    function renderTopMedalists() {
        if (!DOM.topMedalists) return;
        
        try {
            // Sort athletes by total medals (descending)
            const sortedAthletes = [..._athletes].sort((a, b) => b.getTotalMedals() - a.getTotalMedals());
            
            // Get top 5 medalists
            const topMedalists = sortedAthletes.slice(0, 5);
            
            // Generate HTML
            if (topMedalists.length > 0) {
                const html = topMedalists.map(athlete => `
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                            <strong>${athlete.name}</strong> (${athlete.sport})
                            <div class="small text-muted">${athlete.state}</div>
                        </div>
                        <div>
                            <span class="badge bg-warning rounded-pill" title="Gold">${athlete.medals.gold}</span>
                            <span class="badge bg-secondary rounded-pill" title="Silver">${athlete.medals.silver}</span>
                            <span class="badge bg-danger rounded-pill" title="Bronze">${athlete.medals.bronze}</span>
                        </div>
                    </li>
                `).join('');
                
                DOM.topMedalists.innerHTML = html;
            } else {
                DOM.topMedalists.innerHTML = '<li class="list-group-item">No medalists found</li>';
            }
            
            console.log('Top medalists rendered successfully');
        } catch (error) {
            console.error('Error rendering top medalists:', error);
            DOM.topMedalists.innerHTML = '<li class="list-group-item text-danger">Error loading medalists</li>';
        }
    }
    
    /**
     * Render medal chart
     */
    function renderMedalChart() {
        if (!DOM.medalChart) return;
        
        try {
            // Calculate total medals by type
            const totalMedals = {
                gold: 0,
                silver: 0,
                bronze: 0
            };
            
            _athletes.forEach(athlete => {
                totalMedals.gold += athlete.medals.gold;
                totalMedals.silver += athlete.medals.silver;
                totalMedals.bronze += athlete.medals.bronze;
            });
            
            // Create chart
            if (typeof Chart !== 'undefined') {
                // Destroy existing chart if it exists
                if (_medalChart) {
                    _medalChart.destroy();
                }
                
                const ctx = DOM.medalChart.getContext('2d');
                _medalChart = new Chart(ctx, {
                    type: 'doughnut',
                    data: {
                        labels: ['Gold', 'Silver', 'Bronze'],
                        datasets: [{
                            data: [totalMedals.gold, totalMedals.silver, totalMedals.bronze],
                            backgroundColor: [
                                'rgba(255, 215, 0, 0.7)',  // Gold
                                'rgba(192, 192, 192, 0.7)', // Silver
                                'rgba(205, 127, 50, 0.7)'   // Bronze
                            ],
                            borderColor: [
                                'rgba(255, 215, 0, 1)',
                                'rgba(192, 192, 192, 1)',
                                'rgba(205, 127, 50, 1)'
                            ],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: true,
                        aspectRatio: 1,
                        layout: {
                            padding: {
                                left: 10,
                                right: 10,
                                top: 10,
                                bottom: 10
                            }
                        },
                        plugins: {
                            legend: {
                                position: 'bottom',
                                labels: {
                                    boxWidth: 12,
                                    padding: 10,
                                    font: {
                                        size: 12
                                    }
                                }
                            },
                            title: {
                                display: true,
                                text: 'Medal Distribution',
                                font: {
                                    size: 14
                                },
                                padding: {
                                    top: 5,
                                    bottom: 5
                                }
                            },
                            tooltip: {
                                callbacks: {
                                    label: function(context) {
                                        const label = context.label || '';
                                        const value = context.raw || 0;
                                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                        const percentage = Math.round((value / total) * 100);
                                        return `${label}: ${value} (${percentage}%)`;
                                    }
                                }
                            }
                        }
                    }
                });
                
                console.log('Medal chart rendered successfully');
            } else {
                console.error('Chart.js not found');
                showChartError();
            }
        } catch (error) {
            console.error('Error rendering medal chart:', error);
            showChartError();
        }
    }
    
    /**
     * Show error message for chart
     */
    function showChartError() {
        if (!DOM.medalChart) return;
        
        const parent = DOM.medalChart.parentElement;
        if (parent) {
            parent.innerHTML = `
                <div class="alert alert-danger">
                    <i class="fas fa-exclamation-circle"></i> Error loading medal chart
                </div>
            `;
        }
    }
    
    /**
     * Show athlete details
     * @param {number} athleteId - ID of the athlete
     */
    function showAthleteDetails(athleteId) {
        try {
            // Find the athlete
            const athlete = _athletes.find(athlete => athlete.id === athleteId);
            if (!athlete) {
                throw new Error('Athlete not found');
            }
            
            // Create modal using jQuery
            const modal = $(`
                <div class="modal fade" id="athleteModal" tabindex="-1" aria-hidden="true">
                    <div class="modal-dialog modal-lg">
                        <div class="modal-content">
                            <div class="modal-header bg-primary text-white">
                                <h5 class="modal-title">${athlete.name}</h5>
                                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <div class="row">
                                    <div class="col-md-4">
                                        <img src="${athlete.image}" class="img-fluid rounded" alt="${athlete.name}">
                                        <div class="mt-3">
                                            <span class="badge badge-sport">${athlete.sport}</span>
                                            <p class="mt-2"><strong>Age:</strong> ${athlete.age}</p>
                                            <p><strong>State:</strong> ${athlete.state}</p>
                                        </div>
                                        <div class="athlete-social mt-3">
                                            ${athlete.socialMedia.twitter ? `<a href="${athlete.socialMedia.twitter}" target="_blank" class="btn btn-outline-primary btn-sm me-2"><i class="fab fa-twitter"></i> Twitter</a>` : ''}
                                            ${athlete.socialMedia.instagram ? `<a href="${athlete.socialMedia.instagram}" target="_blank" class="btn btn-outline-danger btn-sm"><i class="fab fa-instagram"></i> Instagram</a>` : ''}
                                        </div>
                                    </div>
                                    <div class="col-md-8">
                                        <h5>Biography</h5>
                                        <p>${athlete.bio}</p>
                                        
                                        <h5 class="mt-4">Achievements</h5>
                                        <ul class="list-group list-group-flush">
                                            ${athlete.achievements.map(achievement => `
                                                <li class="list-group-item">
                                                    <i class="fas fa-trophy text-warning me-2"></i> ${achievement}
                                                </li>
                                            `).join('')}
                                        </ul>
                                        
                                        <h5 class="mt-4">Medal Count</h5>
                                        <div class="row text-center">
                                            <div class="col-4">
                                                <div class="p-3 bg-warning bg-opacity-25 rounded">
                                                    <h1 class="display-4">${athlete.medals.gold}</h1>
                                                    <p>Gold</p>
                                                </div>
                                            </div>
                                            <div class="col-4">
                                                <div class="p-3 bg-secondary bg-opacity-25 rounded">
                                                    <h1 class="display-4">${athlete.medals.silver}</h1>
                                                    <p>Silver</p>
                                                </div>
                                            </div>
                                            <div class="col-4">
                                                <div class="p-3 bg-danger bg-opacity-25 rounded">
                                                    <h1 class="display-4">${athlete.medals.bronze}</h1>
                                                    <p>Bronze</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
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
            const modalElement = new bootstrap.Modal(document.getElementById('athleteModal'));
            modalElement.show();
            
            // Remove modal from DOM when hidden
            $('#athleteModal').on('hidden.bs.modal', function() {
                $(this).remove();
            });
        } catch (error) {
            console.error('Show athlete details error:', error);
            alert(`Error: ${error.message}`);
        }
    }
    
    /**
     * Handle nomination submission
     */
    function handleNominationSubmission() {
        try {
            // Get form data
            const formData = {
                name: document.getElementById('athlete-name').value,
                sport: document.getElementById('athlete-sport').value,
                state: document.getElementById('athlete-state').value,
                age: document.getElementById('athlete-age').value,
                achievements: document.getElementById('athlete-achievements').value,
                nominatorName: document.getElementById('nominator-name').value,
                nominatorEmail: document.getElementById('nominator-email').value
            };
            
            // Validate email
            if (!validateEmail(formData.nominatorEmail)) {
                throw new Error('Please enter a valid email address');
            }
            
            // Simulate API call
            console.log('Nomination data:', formData);
            
            // Show success message using jQuery
            const form = $('#athlete-nomination-form');
            form.slideUp(300, function() {
                const successMessage = $(`
                    <div class="alert alert-success" role="alert">
                        <h4 class="alert-heading"><i class="fas fa-check-circle"></i> Nomination Submitted Successfully!</h4>
                        <p>Thank you for nominating ${formData.name}. Our team will review the nomination and get back to you shortly.</p>
                        <hr>
                        <p class="mb-0">Reference ID: NOM-${Math.floor(Math.random() * 10000)}</p>
                    </div>
                `).hide();
                
                form.after(successMessage);
                successMessage.slideDown(300);
                
                // Add button to submit another nomination
                const submitAnotherBtn = $(`
                    <button class="btn btn-primary mt-3">Submit Another Nomination</button>
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
            console.error('Nomination submission error:', error);
            
            // Show error message using jQuery
            const errorMessage = $(`
                <div class="alert alert-danger alert-dismissible fade show" role="alert">
                    <strong>Error!</strong> ${error.message}
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            `).hide();
            
            $('#athlete-nomination-form .alert-danger').remove(); // Remove any existing error
            $('#athlete-nomination-form').prepend(errorMessage);
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
        if (!DOM.athletesContainer) return;
        
        DOM.athletesContainer.innerHTML = `
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
        showAthleteDetails
    };
})();
