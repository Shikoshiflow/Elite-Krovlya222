// ===== MAIN JAVASCRIPT FOR ELITE KROVLYA =====

document.addEventListener('DOMContentLoaded', function() {
    
    // ===== RAIN ANIMATION =====
    function createRain() {
        const rainContainer = document.createElement('div');
        rainContainer.classList.add('rain-container');
        document.body.appendChild(rainContainer);
        
        function createRaindrop() {
            const drop = document.createElement('div');
            drop.classList.add('raindrop');
            drop.style.left = Math.random() * 100 + '%';
            drop.style.animationDelay = Math.random() * 2 + 's';
            drop.style.animationDuration = (Math.random() * 1 + 0.5) + 's';
            rainContainer.appendChild(drop);
            
            setTimeout(() => {
                if (drop.parentNode) {
                    drop.parentNode.removeChild(drop);
                }
            }, 3000);
        }
        
        // Create raindrops periodically
        setInterval(createRaindrop, 100);
    }
    
    // Start rain animation on special sections
    const hotOffersSection = document.querySelector('.hot-offers');
    if (hotOffersSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    createRain();
                    observer.unobserve(entry.target);
                }
            });
        });
        observer.observe(hotOffersSection);
    }
    
    // ===== HEADER SCROLL EFFECT =====
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // ===== HERO SLIDER =====
    const slider = {
        slides: document.querySelectorAll('.slide'),
        dots: document.querySelectorAll('.dot'),
        prevBtn: document.querySelector('.slider-btn.prev'),
        nextBtn: document.querySelector('.slider-btn.next'),
        currentSlide: 0,
        slideInterval: null,

        init() {
            this.showSlide(0);
            this.autoPlay();
            this.bindEvents();
        },

        showSlide(index) {
            // Remove active class from all slides and dots
            this.slides.forEach(slide => slide.classList.remove('active'));
            this.dots.forEach(dot => dot.classList.remove('active'));

            // Add active class to current slide and dot
            this.slides[index].classList.add('active');
            this.dots[index].classList.add('active');

            this.currentSlide = index;
        },

        nextSlide() {
            const next = (this.currentSlide + 1) % this.slides.length;
            this.showSlide(next);
        },

        prevSlide() {
            const prev = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
            this.showSlide(prev);
        },

        autoPlay() {
            this.slideInterval = setInterval(() => {
                this.nextSlide();
            }, 5000);
        },

        stopAutoPlay() {
            clearInterval(this.slideInterval);
        },

        bindEvents() {
            // Next/Previous buttons
            this.nextBtn.addEventListener('click', () => {
                this.stopAutoPlay();
                this.nextSlide();
                this.autoPlay();
            });

            this.prevBtn.addEventListener('click', () => {
                this.stopAutoPlay();
                this.prevSlide();
                this.autoPlay();
            });

            // Dots navigation
            this.dots.forEach((dot, index) => {
                dot.addEventListener('click', () => {
                    this.stopAutoPlay();
                    this.showSlide(index);
                    this.autoPlay();
                });
            });

            // Pause on hover
            const heroSection = document.querySelector('.hero');
            heroSection.addEventListener('mouseenter', () => {
                this.stopAutoPlay();
            });

            heroSection.addEventListener('mouseleave', () => {
                this.autoPlay();
            });
        }
    };

    // Initialize slider
    slider.init();

    // ===== SMOOTH SCROLLING =====
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===== ACTIVE NAVIGATION =====
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY + header.offsetHeight + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                });
                if (navLink) {
                    navLink.classList.add('active');
                }
            }
        });
    });

    // ===== MODAL FUNCTIONALITY =====
    const modal = document.getElementById('consultationModal');
    const modalTriggers = document.querySelectorAll('.cta-button, .btn-primary');
    const closeBtn = document.querySelector('.close');

    // Open modal
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', function(e) {
            e.preventDefault();
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    });

    // Close modal
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // ===== FORM HANDLING =====
    const consultationForm = document.querySelector('.consultation-form');
    
    consultationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const name = this.querySelector('input[type="text"]').value;
        const phone = this.querySelector('input[type="tel"]').value;
        const comment = this.querySelector('textarea').value;
        
        // Basic validation
        if (!name.trim() || !phone.trim()) {
            alert('Пожалуйста, заполните обязательные поля');
            return;
        }
        
        // Phone validation
        const phoneRegex = /^[\+]?[7|8][\s\-]?\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}$/;
        if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
            alert('Пожалуйста, введите корректный номер телефона');
            return;
        }
        
        // Simulate form submission
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Отправка...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            alert('Спасибо! Ваша заявка отправлена. Мы свяжемся с вами в ближайшее время.');
            this.reset();
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);
    });

    // ===== PHONE NUMBER FORMATTING =====
    const phoneInput = document.querySelector('input[type="tel"]');
    
    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.startsWith('8')) {
            value = '7' + value.slice(1);
        }
        
        if (value.startsWith('7')) {
            value = value.slice(0, 11);
            const formatted = value.replace(/(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})/, '+$1 ($2) $3-$4-$5');
            e.target.value = formatted;
        } else if (value.length > 0) {
            value = '7' + value;
            value = value.slice(0, 11);
            const formatted = value.replace(/(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})/, '+$1 ($2) $3-$4-$5');
            e.target.value = formatted;
        }
    });

    // ===== MOBILE MENU =====
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    mobileMenuToggle.addEventListener('click', function() {
        mainNav.classList.toggle('mobile-open');
        this.classList.toggle('active');
    });

    // ===== SCROLL ANIMATIONS =====
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => observer.observe(card));

    // Observe product cards
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => observer.observe(card));

    // ===== LAZY LOADING FOR IMAGES =====
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));

    // ===== PARALLAX EFFECT =====
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            heroSection.style.transform = `translateY(${rate}px)`;
        }
    });

    // ===== BUTTON RIPPLE EFFECT =====
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // ===== SCROLL TO TOP =====
    const scrollToTop = document.createElement('button');
    scrollToTop.innerHTML = '<i class="fas fa-chevron-up"></i>';
    scrollToTop.className = 'scroll-to-top';
    scrollToTop.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border: none;
        border-radius: 50%;
        background: var(--gradient-gold);
        color: var(--deep-black);
        font-size: 18px;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
    `;
    
    document.body.appendChild(scrollToTop);
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            scrollToTop.style.opacity = '1';
            scrollToTop.style.visibility = 'visible';
        } else {
            scrollToTop.style.opacity = '0';
            scrollToTop.style.visibility = 'hidden';
        }
    });
    
    scrollToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // ===== PERFORMANCE OPTIMIZATION =====
    // Debounce function for scroll events
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Apply debounce to scroll events
    const debouncedScrollHandler = debounce(function() {
        // Scroll-dependent operations
    }, 10);

    window.addEventListener('scroll', debouncedScrollHandler);

    // ===== PRELOADER =====
    window.addEventListener('load', function() {
        const preloader = document.querySelector('.preloader');
        if (preloader) {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }
    });

    // ===== CONSOLE LOG =====
    console.log('%cElite Krovlya Website Loaded Successfully!', 'color: #d4af37; font-size: 16px; font-weight: bold;');
    console.log('%cДобро пожаловать на сайт Elite Krovlya - Премиальные кровельные материалы', 'color: #f5f5f5; font-size: 12px;');
});

// ===== UTILITY FUNCTIONS =====

// Format phone number
function formatPhoneNumber(phoneNumber) {
    const cleaned = phoneNumber.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})$/);
    if (match) {
        return `+${match[1]} (${match[2]}) ${match[3]}-${match[4]}-${match[5]}`;
    }
    return phoneNumber;
}

// Validate email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Get cookie
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

// Set cookie
function setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

// ===== ERROR HANDLING =====
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled Promise Rejection:', e.reason);
});