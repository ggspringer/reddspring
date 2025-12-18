/**
 * ReddSpring Landing Page - JavaScript
 * Handles: Theme toggling, animations, mobile menu, and scroll effects
 */

// DOM Elements
const themeToggle = document.getElementById('themeToggle');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const navbar = document.querySelector('.navbar');
const contactForm = document.getElementById('contactForm');

// ===================================
// Theme Management
// ===================================

const ThemeManager = {
    STORAGE_KEY: 'reddspring-theme',
    
    init() {
        // Check for saved theme preference or system preference
        const savedTheme = localStorage.getItem(this.STORAGE_KEY);
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        const theme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
        this.setTheme(theme);
        
        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem(this.STORAGE_KEY)) {
                this.setTheme(e.matches ? 'dark' : 'light');
            }
        });
    },
    
    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem(this.STORAGE_KEY, theme);
    },
    
    toggle() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
    }
};

// ===================================
// Mobile Menu
// ===================================

const MobileMenu = {
    isOpen: false,
    
    init() {
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isOpen && !mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                this.close();
            }
        });
        
        // Close menu on link click
        const mobileLinks = mobileMenu.querySelectorAll('.mobile-link');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => this.close());
        });
        
        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
    },
    
    toggle() {
        this.isOpen ? this.close() : this.open();
    },
    
    open() {
        this.isOpen = true;
        mobileMenuBtn.classList.add('active');
        mobileMenu.classList.add('active');
        document.body.style.overflow = 'hidden';
    },
    
    close() {
        this.isOpen = false;
        mobileMenuBtn.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
};

// ===================================
// Scroll Effects
// ===================================

const ScrollEffects = {
    lastScrollY: 0,
    ticking: false,
    
    init() {
        window.addEventListener('scroll', () => this.onScroll(), { passive: true });
        this.initIntersectionObserver();
    },
    
    onScroll() {
        this.lastScrollY = window.scrollY;
        
        if (!this.ticking) {
            window.requestAnimationFrame(() => {
                this.updateNavbar();
                this.ticking = false;
            });
            this.ticking = true;
        }
    },
    
    updateNavbar() {
        if (this.lastScrollY > 50) {
            navbar.style.padding = '0.75rem 2rem';
        } else {
            navbar.style.padding = '1rem 2rem';
        }
    },
    
    initIntersectionObserver() {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);
        
        // Observe elements with animation class
        document.querySelectorAll('.service-card, .testimonial-card, .approach-step').forEach(el => {
            el.classList.add('animate-on-scroll');
            observer.observe(el);
        });
    }
};

// ===================================
// Animated Counter
// ===================================

const AnimatedCounter = {
    init() {
        const counters = document.querySelectorAll('.stat-number');
        
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.5
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animate(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        counters.forEach(counter => observer.observe(counter));
    },
    
    animate(element) {
        const target = parseInt(element.getAttribute('data-count'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 16);
    }
};

// ===================================
// Smooth Scroll
// ===================================

const SmoothScroll = {
    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    const headerOffset = 80;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
};

// ===================================
// Form Handling
// ===================================

const FormHandler = {
    init() {
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => this.handleSubmit(e));
        }
    },
    
    handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData.entries());
        
        // Show success state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalContent = submitBtn.innerHTML;
        
        submitBtn.innerHTML = `
            <span>Message Sent!</span>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 6L9 17l-5-5"/>
            </svg>
        `;
        submitBtn.disabled = true;
        
        // Reset form
        setTimeout(() => {
            contactForm.reset();
            submitBtn.innerHTML = originalContent;
            submitBtn.disabled = false;
        }, 3000);
        
        // In production, you would send the data to your backend here
        console.log('Form submitted:', data);
    }
};

// ===================================
// Typing Effect for Code Window
// ===================================

const TypingEffect = {
    init() {
        const cursor = document.querySelector('.cursor');
        if (cursor) {
            // The cursor blink is handled by CSS animation
            // This could be extended for actual typing effect
        }
    }
};

// ===================================
// Parallax Effects (subtle)
// ===================================

const ParallaxEffects = {
    init() {
        const orbs = document.querySelectorAll('.orb');
        
        window.addEventListener('mousemove', (e) => {
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;
            
            orbs.forEach((orb, index) => {
                const speed = (index + 1) * 10;
                const x = (mouseX - 0.5) * speed;
                const y = (mouseY - 0.5) * speed;
                
                orb.style.transform = `translate(${x}px, ${y}px)`;
            });
        });
    }
};

// ===================================
// Code Window Tilt Effect
// ===================================

const TiltEffect = {
    init() {
        const codeWindow = document.querySelector('.code-window');
        if (!codeWindow) return;
        
        const container = codeWindow.parentElement;
        
        container.addEventListener('mousemove', (e) => {
            const rect = container.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            codeWindow.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        
        container.addEventListener('mouseleave', () => {
            codeWindow.style.transform = 'perspective(1000px) rotateY(-5deg) rotateX(5deg)';
        });
    }
};

// ===================================
// Initialize Everything
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    ThemeManager.init();
    MobileMenu.init();
    ScrollEffects.init();
    AnimatedCounter.init();
    SmoothScroll.init();
    FormHandler.init();
    TypingEffect.init();
    ParallaxEffects.init();
    TiltEffect.init();
});

// Event Listeners
themeToggle.addEventListener('click', () => ThemeManager.toggle());
mobileMenuBtn.addEventListener('click', () => MobileMenu.toggle());

// Prevent flash of unstyled content
document.documentElement.style.visibility = 'visible';
