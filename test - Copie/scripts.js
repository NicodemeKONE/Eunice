/* ===================================================
   PORTFOLIO LAMAH MAA EUNICE - JAVASCRIPT OPTIMISÉ MOBILE-FIRST
   Version simplifiée et robuste
   =================================================== */

// ===== VARIABLES GLOBALES =====
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// État global
let isMobile = false;
let scrollObserver = null;
let isScrolling = false;

// ===== UTILITAIRES =====
function throttle(func, wait) {
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

function detectMobile() {
    return window.innerWidth <= 767 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function safeExecute(func, errorMessage = 'Erreur') {
    try {
        func();
    } catch (error) {
        console.warn(errorMessage + ':', error);
    }
}

// ===== CORRECTION MOBILE DÉFINITIVE =====
function forceVisibilityOnMobile() {
    if (!detectMobile()) return;
    
    // Sélecteurs de tous les éléments qui peuvent être cachés
    const hiddenElements = document.querySelectorAll(`
        .about-text,
        .about-highlights,
        .about-quote,
        .approach-item,
        .highlight-card,
        .expertise-card,
        .portfolio-item,
        .journey-item,
        .quality-item,
        .contact-card,
        .streamlit-form,
        .scroll-animate
    `);
    
    // Forcer la visibilité immédiate sur mobile
    hiddenElements.forEach(element => {
        element.style.opacity = '1';
        element.style.transform = 'none';
        element.style.transition = 'none';
        element.classList.add('animate');
    });
    
    // Corrections spécifiques pour les sections
    const aboutSection = document.querySelector('.about');
    const expertiseSection = document.querySelector('.expertise');
    
    if (aboutSection) {
        aboutSection.style.paddingBottom = '8px';
        aboutSection.style.marginBottom = '0';
    }
    
    if (expertiseSection) {
        expertiseSection.style.paddingTop = '8px';
        expertiseSection.style.marginTop = '0';
    }
    
    // Supprimer les animations des formes flottantes
    const shapes = document.querySelectorAll('.shape, .floating-shapes');
    shapes.forEach(shape => {
        shape.style.animation = 'none';
        shape.style.transform = 'none';
    });
}

// ===== NAVIGATION =====
function toggleMobileMenu() {
    const isActive = hamburger.classList.contains('active');
    
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    
    hamburger.setAttribute('aria-expanded', !isActive);
    navMenu.setAttribute('aria-hidden', isActive);
}

function closeMobileMenu() {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
    document.body.style.overflow = '';
    
    hamburger.setAttribute('aria-expanded', 'false');
    navMenu.setAttribute('aria-hidden', 'true');
}

function handleNavbarScroll() {
    if (isScrolling) return;
    
    isScrolling = true;
    requestAnimationFrame(() => {
        const scrollTop = window.pageYOffset;
        
        if (scrollTop > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        isScrolling = false;
    });
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        const correspondingLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (scrollPos >= sectionTop - 50 && scrollPos < sectionTop + sectionHeight - 50) {
            navLinks.forEach(link => link.classList.remove('active'));
            if (correspondingLink) {
                correspondingLink.classList.add('active');
            }
        }
    });
}

// ===== SMOOTH SCROLLING =====
function initSmoothScrolling() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const navbarHeight = navbar.offsetHeight;
                const offsetTop = targetSection.offsetTop - navbarHeight - 10;
                
                closeMobileMenu();
                
                window.scrollTo({
                    top: Math.max(0, offsetTop),
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== ANIMATIONS - VERSION MOBILE-FIRST =====
function createIntersectionObserver() {
    // Configuration différente selon l'appareil
    const config = {
        threshold: isMobile ? 0.1 : 0.2,
        rootMargin: isMobile ? '-20px' : '-50px'
    };
    
    return new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                
                // Sur mobile : affichage immédiat, sur desktop : animation
                if (isMobile) {
                    element.style.opacity = '1';
                    element.style.transform = 'none';
                    element.style.transition = 'none';
                } else {
                    // Animation desktop seulement
                    element.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                    setTimeout(() => {
                        element.classList.add('animate');
                    }, 100);
                }
                
                scrollObserver.unobserve(element);
            }
        });
    }, config);
}

function initScrollAnimations() {
    // Créer un nouvel observer
    if (scrollObserver) {
        scrollObserver.disconnect();
    }
    
    scrollObserver = createIntersectionObserver();
    
    // Sélectionner tous les éléments à animer
    const animatedElements = document.querySelectorAll(`
        .about-text,
        .about-highlights,
        .about-quote,
        .approach-item,
        .highlight-card,
        .expertise-card,
        .portfolio-item,
        .journey-item,
        .quality-item,
        .contact-card,
        .streamlit-form,
        .scroll-animate
    `);
    
    if (isMobile) {
        // Mobile : forcer l'affichage immédiat
        forceVisibilityOnMobile();
    } else {
        // Desktop : observer pour les animations
        animatedElements.forEach(element => {
            scrollObserver.observe(element);
        });
    }
}

// ===== PORTFOLIO FILTERS =====
function initPortfolioFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    if (filterButtons.length === 0) return;
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            
            portfolioItems.forEach((item, index) => {
                const categories = item.getAttribute('data-category');
                const shouldShow = filter === 'all' || categories.includes(filter);
                
                if (shouldShow) {
                    item.style.display = 'block';
                    if (!isMobile) {
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'translateY(0)';
                        }, index * 50);
                    }
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 200);
                }
            });
        });
    });
}

// ===== EFFETS PARALLAX (DESKTOP SEULEMENT) =====
function initParallaxEffect() {
    if (isMobile || prefersReducedMotion()) return;
    
    const shapes = document.querySelectorAll('.shape');
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.2;
        
        shapes.forEach((shape, index) => {
            const speed = (index + 1) * 0.1;
            const translateY = rate * speed;
            shape.style.transform = `translateY(${translateY}px)`;
        });
    }
    
    window.addEventListener('scroll', throttle(updateParallax, 16));
}

// ===== EFFETS HOVER (DESKTOP SEULEMENT) =====
function initHoverEffects() {
    if (isMobile) return;
    
    const cards = document.querySelectorAll('.expertise-card, .portfolio-item, .highlight-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            if (!prefersReducedMotion()) {
                this.style.transform = 'translateY(-4px)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// ===== GESTION DU REDIMENSIONNEMENT =====
function handleResize() {
    const wasMobile = isMobile;
    isMobile = detectMobile();
    
    // Fermer le menu mobile si on passe en desktop
    if (!isMobile && navMenu.classList.contains('active')) {
        closeMobileMenu();
    }
    
    // Si changement mobile/desktop, réinitialiser les animations
    if (wasMobile !== isMobile) {
        setTimeout(() => {
            initScrollAnimations();
            if (isMobile) {
                forceVisibilityOnMobile();
            }
        }, 100);
    }
}

// ===== ACCESSIBILITÉ =====
function initAccessibility() {
    // Navigation clavier
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMobileMenu();
        }
        
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-navigation');
    });
    
    // Focus trap pour menu mobile
    const focusableElements = navMenu.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
    
    if (focusableElements.length > 0) {
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        navMenu.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                if (e.shiftKey && document.activeElement === firstElement) {
                    lastElement.focus();
                    e.preventDefault();
                } else if (!e.shiftKey && document.activeElement === lastElement) {
                    firstElement.focus();
                    e.preventDefault();
                }
            }
        });
    }
}

// ===== INITIALISATION DES ÉVÉNEMENTS =====
function initEventListeners() {
    // Navigation
    if (hamburger) hamburger.addEventListener('click', toggleMobileMenu);
    
    navLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
    
    // Fermer menu en cliquant à l'extérieur
    document.addEventListener('click', (e) => {
        if (!navbar.contains(e.target) && navMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });
    
    // Scroll
    window.addEventListener('scroll', throttle(handleNavbarScroll, 16));
    window.addEventListener('scroll', throttle(updateActiveNavLink, 100));
    
    // Redimensionnement
    window.addEventListener('resize', debounce(handleResize, 250));
    
    // Correction mobile après chargement
    window.addEventListener('load', () => {
        if (isMobile) {
            setTimeout(forceVisibilityOnMobile, 100);
        }
    });
    
    // Changement d'orientation mobile
    window.addEventListener('orientationchange', () => {
        setTimeout(() => {
            if (detectMobile()) {
                forceVisibilityOnMobile();
            }
        }, 300);
    });
}

// ===== CSS DYNAMIQUE =====
function injectDynamicStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* Navbar */
        .navbar {
            transition: all 0.3s ease;
        }
        
        /* Focus accessibilité */
        .keyboard-navigation *:focus {
            outline: 2px solid #007aff !important;
            outline-offset: 2px !important;
        }
        
        /* CORRECTION MOBILE DÉFINITIVE */
        @media (max-width: 767px) {
            .about-text,
            .about-highlights,
            .about-quote,
            .approach-item,
            .highlight-card,
            .scroll-animate {
                opacity: 1 !important;
                transform: none !important;
                animation: none !important;
                transition: none !important;
            }
            
            .about {
                padding-bottom: 8px !important;
                margin-bottom: 0 !important;
            }
            
            .expertise {
                padding-top: 8px !important;
                margin-top: 0 !important;
            }
            
            .shape, .floating-shapes {
                animation: none !important;
                transform: none !important;
            }
            
            .about-highlights {
                position: static !important;
                top: auto !important;
            }
        }
        
        /* Animations desktop */
        @media (min-width: 768px) {
            .approach-item:hover .approach-icon,
            .highlight-card:hover .highlight-icon {
                transform: scale(1.1) rotate(5deg);
            }
            
            .expertise-card:hover,
            .portfolio-item:hover,
            .highlight-card:hover {
                transform: translateY(-6px);
                box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
            }
        }
    `;
    document.head.appendChild(style);
}

// ===== FALLBACK DE SÉCURITÉ =====
function emergencyFallback() {
    // Si après 2 secondes il y a encore des éléments cachés, les forcer
    setTimeout(() => {
        const hiddenElements = document.querySelectorAll('[style*="opacity: 0"], .scroll-animate:not(.animate)');
        
        if (hiddenElements.length > 0) {
            console.warn('Fallback activé : éléments cachés détectés');
            hiddenElements.forEach(element => {
                element.style.opacity = '1';
                element.style.transform = 'none';
                element.classList.add('animate');
            });
        }
    }, 2000);
}

// ===== INITIALISATION PRINCIPALE =====
function initPortfolio() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPortfolio);
        return;
    }
    
    // Détection mobile immédiate
    isMobile = detectMobile();
    
    // Injection CSS
    injectDynamicStyles();
    
    // Correction mobile prioritaire
    if (isMobile) {
        forceVisibilityOnMobile();
    }
    
    // Initialisation des fonctionnalités
    safeExecute(initEventListeners, 'Erreur événements');
    safeExecute(initSmoothScrolling, 'Erreur smooth scroll');
    safeExecute(initScrollAnimations, 'Erreur animations');
    safeExecute(initPortfolioFilters, 'Erreur filtres');
    safeExecute(initAccessibility, 'Erreur accessibilité');
    
    // Effets desktop seulement
    if (!isMobile) {
        safeExecute(initParallaxEffect, 'Erreur parallax');
        safeExecute(initHoverEffects, 'Erreur hover');
    }
    
    // Fallback de sécurité
    emergencyFallback();
    
    // Marquer comme chargé
    document.body.classList.add('portfolio-loaded');
}

// ===== DÉMARRAGE =====
// Correction mobile immédiate
if (detectMobile()) {
    document.addEventListener('DOMContentLoaded', forceVisibilityOnMobile);
}

// Initialisation principale
initPortfolio();

// Export pour débogage
if (typeof window !== 'undefined') {
    window.portfolioDebug = {
        forceVisibilityOnMobile,
        detectMobile,
        toggleMobileMenu,
        closeMobileMenu,
        initScrollAnimations,
        isMobile
    };
}