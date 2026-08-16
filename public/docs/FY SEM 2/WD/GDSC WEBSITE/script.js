document.addEventListener('DOMContentLoaded', () => {
    // Hero section animations
    gsap.to('.hero-content h1', {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out'
    });

    gsap.to('.hero-content h2', {
        opacity: 1,
        y: 0,
        duration: 1,
        delay: 0.2,
        ease: 'power3.out'
    });

    gsap.to('.hero-content p', {
        opacity: 1,
        y: 0,
        duration: 1,
        delay: 0.4,
        ease: 'power3.out'
    });

    gsap.to('.cta-button', {
        opacity: 1,
        y: 0,
        duration: 1,
        delay: 0.6,
        ease: 'power3.out'
    });

    gsap.to('.hero-image', {
        opacity: 1,
        duration: 1,
        delay: 0.8,
        ease: 'power3.out'
    });

    // Loading animation sequence
    const loadingScreen = document.querySelector('.loading-screen');
    const mainContent = document.querySelector('main');

    // Make sure main content is initially visible
    mainContent.style.display = 'block';
    
    const loadingTimeline = gsap.timeline();

    loadingTimeline
        .to('.loading-logo', {
            opacity: 1,
            duration: 1,
            ease: 'power2.out'
        })
        .to('.loading-text', {
            opacity: 1,
            duration: 1,
            ease: 'power2.out'
        })
        .to(loadingScreen, {
            opacity: 0,
            duration: 0.5,
            delay: 0.5,
            onComplete: () => {
                loadingScreen.style.display = 'none'; // Hide loading screen completely
            }
        });

    // Rest of your animations...
});

// Main content animations
function startMainAnimations() {
    const mainTimeline = gsap.timeline();

    mainTimeline
        .to('nav', {
            opacity: 1,
            duration: 1,
            ease: 'power2.out'
        })
        .to('main', {
            opacity: 1,
            duration: 1,
            ease: 'power2.out'
        }, '-=0.5')
        .from('.hero-content h1', {
            opacity: 0,
            y: 30,
            duration: 1,
            ease: 'power3.out'
        })
        .from('.hero-content h2', {
            opacity: 0,
            y: 30,
            duration: 1,
            ease: 'power3.out'
        }, '-=0.7')
        .from('.hero-content p', {
            opacity: 0,
            y: 30,
            duration: 1,
            ease: 'power3.out'
        }, '-=0.7')
        .from('.cta-button', {
            opacity: 0,
            y: 30,
            duration: 1,
            ease: 'power3.out'
        }, '-=0.7')
        .from('.hero-image', {
            opacity: 0,
            x: 50,
            duration: 1,
            ease: 'power3.out'
        }, '-=0.7');

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Add scroll animations for sections
    const sections = document.querySelectorAll('section');

    const observerOptions = {
        threshold: 0.2
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Animate specific elements within the section
                if (entry.target.id === 'about') {
                    gsap.from('.about-text p', {
                        opacity: 0,
                        y: 30,
                        duration: 0.8,
                        stagger: 0.2
                    });
                    gsap.from('.stat-item', {
                        opacity: 0,
                        y: 30,
                        duration: 0.8,
                        stagger: 0.2
                    });
                }

                if (entry.target.id === 'team') {
                    gsap.from('.team-member', {
                        opacity: 0,
                        y: 30,
                        duration: 0.8,
                        stagger: 0.2
                    });
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });

    // Form submission handling
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Add your form submission logic here
            alert('Message sent successfully!');
            contactForm.reset();
        });
    }
}

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Add scroll animations for sections
const sections = document.querySelectorAll('section');

const observerOptions = {
    threshold: 0.2
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            // Animate specific elements within the section
            if (entry.target.id === 'about') {
                gsap.from('.about-text p', {
                    opacity: 0,
                    y: 30,
                    duration: 0.8,
                    stagger: 0.2
                });
                gsap.from('.stat-item', {
                    opacity: 0,
                    y: 30,
                    duration: 0.8,
                    stagger: 0.2
                });
            }

            if (entry.target.id === 'team') {
                gsap.from('.team-member', {
                    opacity: 0,
                    y: 30,
                    duration: 0.8,
                    stagger: 0.2
                });
            }
        }
    });
}, observerOptions);

sections.forEach(section => {
    observer.observe(section);
});

// Form submission handling
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Add your form submission logic here
        alert('Message sent successfully!');
        contactForm.reset();
    });
} 