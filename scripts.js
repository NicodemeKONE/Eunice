/* ===================================================
   PORTFOLIO LAMAH MAA EUNICE - ANIMATIONS COMPLÈTES
   Toutes les animations mobile + desktop avec protection spéciale
   =================================================== */

// ===== VARIABLES GLOBALES =====
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// État global optimisé
let isMobile = false;
let scrollObserver = null;
let isScrolling = false;
let lastScrollTop = 0;
let resizeTimer = null;
let animationsReady = false;
let highlightCardsProtected = false;

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

function supportsAnimations() {
    const el = document.createElement('div');
    return typeof el.style.animationName !== 'undefined';
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

// ===== PROTECTION SPÉCIALE HIGHLIGHT CARDS =====
function protectHighlightCards() {
    const highlightCards = document.querySelectorAll('.highlight-card');
    
    highlightCards.forEach((card, index) => {
        // Protection immédiate
        card.style.setProperty('opacity', '1', 'important');
        card.style.setProperty('transform', 'none', 'important');
        card.style.setProperty('display', 'block', 'important');
        card.classList.add('highlight-protected');
        
        // Protection des éléments internes
        const icon = card.querySelector('.highlight-icon');
        const texts = card.querySelectorAll('h4, p');
        
        if (icon) {
            icon.style.setProperty('transform', 'scale(1) rotate(0deg)', 'important');
        }
        
        texts.forEach(text => {
            text.style.setProperty('opacity', '1', 'important');
            text.style.setProperty('transform', 'translateY(0)', 'important');
        });
    });
    
    highlightCardsProtected = true;
    console.log(`🛡️ Protection spéciale activée pour ${highlightCards.length} highlight cards`);
}

function ensureHighlightCardsVisibility() {
    setTimeout(() => {
        protectHighlightCards();
    }, 100);
    
    setTimeout(() => {
        protectHighlightCards();
    }, 500);
    
    setTimeout(() => {
        protectHighlightCards();
    }, 1000);
}

// ===== SYSTÈME D'ANIMATION AVEC PROTECTION =====
function createSafeAnimation(element, animationFunc, protectionDelay = 300) {
    if (!element) return;
    
    // Pour les highlight cards : protection immédiate + animation
    if (element.classList.contains('highlight-card')) {
        // 1. Protection immédiate
        element.style.setProperty('opacity', '1', 'important');
        element.style.setProperty('display', 'block', 'important');
        element.classList.add('highlight-protected');
        
        // 2. Animation (si desktop et pas reduced motion)
        if (!isMobile && !prefersReducedMotion() && animationFunc) {
            // Reset pour animation sur desktop
            if (!element.classList.contains('highlight-protected')) {
                element.style.removeProperty('opacity');
                element.style.removeProperty('transform');
            }
            animationFunc();
        }
        
        // 3. Protection finale garantie
        setTimeout(() => {
            protectHighlightCards();
        }, protectionDelay);
        
        return;
    }
    
    // Pour les autres éléments : animation normale avec fallback
    if (animationFunc && typeof animationFunc === 'function') {
        animationFunc();
        
        // Fallback de sécurité
        setTimeout(() => {
            if (!element.classList.contains('animate')) {
                element.style.setProperty('opacity', '1', 'important');
                element.style.setProperty('transform', 'none', 'important');
                element.classList.add('animate');
            }
        }, isMobile ? 400 : 600);
    }
}

// ===== NAVIGATION STICKY =====
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
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
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
function calculateScrollOffset(targetElement) {
    const navbarHeight = navbar.offsetHeight;
    return navbarHeight + 10;
}

function initSmoothScrolling() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offset = calculateScrollOffset(targetSection);
                const offsetTop = targetSection.offsetTop - offset;
                
                closeMobileMenu();
                
                window.scrollTo({
                    top: Math.max(0, offsetTop),
                    behavior: 'smooth'
                });
                
                targetSection.setAttribute('tabindex', '-1');
                targetSection.focus();
                setTimeout(() => {
                    targetSection.removeAttribute('tabindex');
                }, 1000);
            }
        });
    });
}

// ===== ANIMATIONS COMPLÈTES AVEC PROTECTION =====

/**
 * Animation des cartes d'expertise
 */
function animateExpertiseCard(card) {
    const skillItems = card.querySelectorAll('.skill-item');
    const icon = card.querySelector('.expertise-icon');
    
    if (icon && !prefersReducedMotion()) {
        icon.style.transform = 'scale(0)';
        icon.style.transition = 'transform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        
        setTimeout(() => {
            icon.style.transform = 'scale(1)';
        }, isMobile ? 100 : 200);
    }
    
    skillItems.forEach((item, index) => {
        if (!prefersReducedMotion()) {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-20px)';
            item.style.transition = `all 0.4s ease ${index * (isMobile ? 50 : 100)}ms`;
            
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
            }, (isMobile ? 150 : 300) + (index * (isMobile ? 50 : 100)));
        }
    });
    
    setTimeout(() => {
        card.classList.add('animate');
    }, isMobile ? 300 : 600);
}

/**
 * Animation des highlight cards - PROTECTION SPÉCIALE
 */
function animateHighlightCard(card) {
    // PROTECTION IMMÉDIATE ABSOLUE
    card.style.setProperty('opacity', '1', 'important');
    card.style.setProperty('display', 'block', 'important');
    card.classList.add('highlight-protected');
    
    const icon = card.querySelector('.highlight-icon');
    const textElements = card.querySelectorAll('h4, p');
    
    // Protection des éléments internes
    if (icon) {
        icon.style.setProperty('transform', 'scale(1) rotate(0deg)', 'important');
    }
    textElements.forEach(text => {
        text.style.setProperty('opacity', '1', 'important');
        text.style.setProperty('transform', 'translateY(0)', 'important');
    });
    
    // Animation SEULEMENT sur desktop et si pas de reduced motion
    if (!isMobile && !prefersReducedMotion()) {
        // Animation de l'icône (sans risquer de la cacher)
        if (icon && !icon.classList.contains('highlight-protected')) {
            icon.style.transform = 'scale(0) rotate(180deg)';
            icon.style.transition = 'transform 0.7s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            
            setTimeout(() => {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }, 100);
        }
        
        // Animation du texte (avec protection)
        textElements.forEach((el, index) => {
            if (!el.classList.contains('highlight-protected')) {
                el.style.opacity = '0';
                el.style.transform = 'translateY(15px)';
                el.style.transition = `all 0.4s ease ${index * 100}ms`;
                
                setTimeout(() => {
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }, 400 + (index * 100));
            }
        });
    }
    
    // PROTECTION FINALE GARANTIE
    setTimeout(() => {
        card.style.setProperty('opacity', '1', 'important');
        card.style.setProperty('display', 'block', 'important');
        if (icon) icon.style.setProperty('transform', 'scale(1) rotate(0deg)', 'important');
        textElements.forEach(text => {
            text.style.setProperty('opacity', '1', 'important');
            text.style.setProperty('transform', 'translateY(0)', 'important');
        });
        card.classList.add('animate');
    }, isMobile ? 200 : 800);
}

/**
 * Animation des highlights - GESTION ULTRA-SÉCURISÉE
 */
function animateAboutHighlights(highlightsElement) {
    // PROTECTION IMMÉDIATE DE TOUS LES HIGHLIGHT CARDS
    protectHighlightCards();
    
    const cards = highlightsElement.querySelectorAll('.highlight-card');
    
    cards.forEach((card, index) => {
        // Protection immédiate pour chaque carte
        card.style.setProperty('opacity', '1', 'important');
        card.style.setProperty('display', 'block', 'important');
        
        setTimeout(() => {
            createSafeAnimation(card, () => animateHighlightCard(card), 200);
        }, index * (isMobile ? 100 : 200));
    });
    
    // Protections multiples dans le temps
    setTimeout(() => protectHighlightCards(), 500);
    setTimeout(() => protectHighlightCards(), 1000);
    setTimeout(() => protectHighlightCards(), 1500);
}

/**
 * Animation des approach items
 */
function animateApproachItem(item) {
    const icon = item.querySelector('.approach-icon');
    const text = item.querySelector('.approach-text');
    
    if (!prefersReducedMotion()) {
        if (icon) {
            icon.style.transform = 'scale(0) rotate(-90deg)';
            icon.style.transition = 'transform 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            
            setTimeout(() => {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }, isMobile ? 100 : 200);
        }
        
        if (text) {
            text.style.opacity = '0';
            text.style.transform = 'translateX(20px)';
            text.style.transition = 'all 0.5s ease';
            
            setTimeout(() => {
                text.style.opacity = '1';
                text.style.transform = 'translateX(0)';
            }, isMobile ? 150 : 300);
        }
    }
    
    setTimeout(() => {
        item.classList.add('animate');
        if (icon) icon.style.transform = 'scale(1) rotate(0deg)';
        if (text) {
            text.style.opacity = '1';
            text.style.transform = 'translateX(0)';
        }
    }, isMobile ? 300 : 600);
}

/**
 * Animation du texte À propos
 */
function animateAboutText(textElement) {
    const sections = textElement.querySelectorAll('.about-intro, .about-philosophy, .about-approach');
    
    sections.forEach((section, index) => {
        if (!prefersReducedMotion()) {
            section.style.opacity = '0';
            section.style.transform = 'translateY(30px)';
            section.style.transition = `all 0.6s ease ${index * (isMobile ? 100 : 200)}ms`;
            
            setTimeout(() => {
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }, index * (isMobile ? 100 : 200));
        }
    });
    
    const approachItems = textElement.querySelectorAll('.approach-item');
    approachItems.forEach((item, index) => {
        setTimeout(() => {
            createSafeAnimation(item, () => animateApproachItem(item));
        }, (isMobile ? 300 : 600) + (index * (isMobile ? 75 : 150)));
    });
    
    setTimeout(() => {
        sections.forEach(section => {
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        });
        approachItems.forEach(item => {
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
            item.classList.add('animate');
        });
    }, isMobile ? 800 : 1500);
}

/**
 * Animation de la citation
 */
function animateAboutQuote(quoteElement) {
    const blockquote = quoteElement.querySelector('blockquote');
    
    if (!prefersReducedMotion() && blockquote) {
        blockquote.style.transform = 'scale(0.95)';
        blockquote.style.opacity = '0';
        blockquote.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        
        setTimeout(() => {
            blockquote.style.transform = 'scale(1)';
            blockquote.style.opacity = '1';
        }, isMobile ? 100 : 200);
        
        const text = blockquote.querySelector('p');
        const cite = blockquote.querySelector('cite');
        
        if (text) {
            text.style.opacity = '0';
            text.style.transform = 'translateY(20px)';
            text.style.transition = `all 0.6s ease ${isMobile ? '0.2s' : '0.4s'}`;
            
            setTimeout(() => {
                text.style.opacity = '1';
                text.style.transform = 'translateY(0)';
            }, isMobile ? 200 : 400);
        }
        
        if (cite) {
            cite.style.opacity = '0';
            cite.style.transform = 'translateY(10px)';
            cite.style.transition = `all 0.4s ease ${isMobile ? '0.4s' : '0.8s'}`;
            
            setTimeout(() => {
                cite.style.opacity = '1';
                cite.style.transform = 'translateY(0)';
            }, isMobile ? 400 : 800);
        }
    }
    
    setTimeout(() => {
        if (blockquote) {
            blockquote.style.opacity = '1';
            blockquote.style.transform = 'scale(1)';
        }
        quoteElement.classList.add('animate');
    }, isMobile ? 600 : 1200);
}

/**
 * Autres animations (portfolio, parcours, etc.)
 */
function animatePortfolioItem(item) {
    const image = item.querySelector('.project-image');
    const content = item.querySelector('.project-content');
    const tags = item.querySelectorAll('.tag');
    
    if (!prefersReducedMotion()) {
        if (image) {
            image.style.transform = 'translateY(-20px)';
            image.style.opacity = '0.8';
            image.style.transition = 'all 0.6s ease';
            
            setTimeout(() => {
                image.style.transform = 'translateY(0)';
                image.style.opacity = '1';
            }, isMobile ? 100 : 200);
        }
        
        if (content) {
            content.style.transform = 'translateY(20px)';
            content.style.opacity = '0';
            content.style.transition = 'all 0.5s ease';
            
            setTimeout(() => {
                content.style.transform = 'translateY(0)';
                content.style.opacity = '1';
            }, isMobile ? 200 : 400);
        }
        
        tags.forEach((tag, index) => {
            tag.style.opacity = '0';
            tag.style.transform = 'scale(0.8)';
            tag.style.transition = `all 0.3s ease ${index * (isMobile ? 25 : 50)}ms`;
            
            setTimeout(() => {
                tag.style.opacity = '1';
                tag.style.transform = 'scale(1)';
            }, (isMobile ? 300 : 600) + (index * (isMobile ? 25 : 50)));
        });
    }
    
    setTimeout(() => {
        item.classList.add('animate');
    }, isMobile ? 400 : 800);
}

function animateJourneyItem(item) {
    const marker = item.querySelector('.journey-marker');
    const content = item.querySelector('.journey-content');
    const badges = item.querySelectorAll('.tech-badge');
    
    if (!prefersReducedMotion()) {
        if (marker) {
            marker.style.transform = 'scale(0)';
            marker.style.transition = 'transform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            
            setTimeout(() => {
                marker.style.transform = 'scale(1)';
            }, isMobile ? 50 : 100);
        }
        
        if (content) {
            content.style.opacity = '0';
            content.style.transform = 'translateX(-30px)';
            content.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            
            setTimeout(() => {
                content.style.opacity = '1';
                content.style.transform = 'translateX(0)';
            }, isMobile ? 150 : 300);
        }
        
        badges.forEach((badge, index) => {
            badge.style.opacity = '0';
            badge.style.transform = 'translateY(10px)';
            badge.style.transition = `all 0.3s ease ${index * (isMobile ? 50 : 100)}ms`;
            
            setTimeout(() => {
                badge.style.opacity = '1';
                badge.style.transform = 'translateY(0)';
            }, (isMobile ? 300 : 600) + (index * (isMobile ? 50 : 100)));
        });
    }
    
    setTimeout(() => {
        item.classList.add('animate');
    }, isMobile ? 500 : 1000);
}

function animateQualityItem(item) {
    const icon = item.querySelector('.quality-icon');
    
    if (icon && !prefersReducedMotion()) {
        icon.style.transform = 'scale(0) rotate(-180deg)';
        icon.style.transition = 'transform 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        
        setTimeout(() => {
            icon.style.transform = 'scale(1) rotate(0deg)';
        }, isMobile ? 50 : 100);
    }
    
    setTimeout(() => {
        item.classList.add('animate');
    }, isMobile ? 200 : 400);
}

function animateContactCard(card) {
    const methods = card.querySelectorAll('.contact-method');
    
    methods.forEach((method, index) => {
        if (!prefersReducedMotion()) {
            method.style.opacity = '0';
            method.style.transform = 'translateY(20px)';
            method.style.transition = `all 0.5s ease ${index * (isMobile ? 75 : 150)}ms`;
            
            setTimeout(() => {
                method.style.opacity = '1';
                method.style.transform = 'translateY(0)';
            }, index * (isMobile ? 75 : 150));
        }
    });
    
    setTimeout(() => {
        card.classList.add('animate');
    }, isMobile ? 300 : 600);
}

// ===== INTERSECTION OBSERVER ADAPTATIF =====
const observerOptions = {
    threshold: isMobile ? [0.05, 0.1] : [0.1, 0.3],
    rootMargin: isMobile ? '-10px 0px -10px 0px' : '-50px 0px -50px 0px'
};

function handleIntersection(entries) {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting && entry.intersectionRatio > (isMobile ? 0.05 : 0.1)) {
            const element = entry.target;
            const delay = parseInt(element.dataset.delay) || 0;
            
            setTimeout(() => {
                element.classList.add('animate');
                
                // Animations avec protection spéciale pour highlight cards
                if (element.classList.contains('expertise-card')) {
                    createSafeAnimation(element, () => animateExpertiseCard(element));
                } else if (element.classList.contains('quality-item')) {
                    createSafeAnimation(element, () => animateQualityItem(element));
                } else if (element.classList.contains('contact-card') || element.classList.contains('streamlit-form')) {
                    createSafeAnimation(element, () => animateContactCard(element));
                } else if (element.classList.contains('portfolio-item')) {
                    createSafeAnimation(element, () => animatePortfolioItem(element));
                } else if (element.classList.contains('journey-item')) {
                    createSafeAnimation(element, () => animateJourneyItem(element));
                } else if (element.classList.contains('about-text')) {
                    createSafeAnimation(element, () => animateAboutText(element), 1500);
                } else if (element.classList.contains('about-highlights')) {
                    createSafeAnimation(element, () => animateAboutHighlights(element), 1500);
                } else if (element.classList.contains('approach-item')) {
                    createSafeAnimation(element, () => animateApproachItem(element));
                } else if (element.classList.contains('highlight-card')) {
                    createSafeAnimation(element, () => animateHighlightCard(element), 300);
                } else if (element.classList.contains('about-quote')) {
                    createSafeAnimation(element, () => animateAboutQuote(element));
                }
            }, delay);
            
            scrollObserver.unobserve(element);
        }
    });
}

function initScrollAnimations() {
    if (!supportsAnimations()) {
        protectHighlightCards();
        return;
    }
    
    // Protection immédiate des highlight cards
    ensureHighlightCardsVisibility();
    
    if (scrollObserver) {
        scrollObserver.disconnect();
    }
    
    scrollObserver = new IntersectionObserver(handleIntersection, observerOptions);
    
    const animatedElements = document.querySelectorAll('.scroll-animate');
    
    animatedElements.forEach((element, index) => {
        if (!element.dataset.delay) {
            element.dataset.delay = (index % 3) * (isMobile ? 50 : 100);
        }
        scrollObserver.observe(element);
    });
    
    animationsReady = true;
    
    console.log(`🎬 Animations complètes initialisées (${isMobile ? 'Mobile' : 'Desktop'}) - ${animatedElements.length} éléments`);
}

// ===== ANIMATIONS HÉRO =====
function initHeroAnimations() {
    if (prefersReducedMotion()) return;
    
    const heroElements = document.querySelectorAll('.animate-slide-up');
    heroElements.forEach((element, index) => {
        element.style.animationDelay = `${index * (isMobile ? 100 : 200)}ms`;
    });
    
    const profileCard = document.querySelector('.profile-card');
    if (profileCard) {
        profileCard.style.opacity = '0';
        profileCard.style.transform = 'translateY(30px) scale(0.9)';
        profileCard.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        
        setTimeout(() => {
            profileCard.style.opacity = '1';
            profileCard.style.transform = 'translateY(0) scale(1)';
        }, isMobile ? 50 : 100);
    }
}

// ===== EFFETS PARALLAX (DESKTOP SEULEMENT) =====
function initParallaxEffect() {
    if (prefersReducedMotion() || isMobile) return;
    
    const shapes = document.querySelectorAll('.shape');
    
    function updateParallax() {
        if (isScrolling) return;
        
        isScrolling = true;
        requestAnimationFrame(() => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.2;
            
            shapes.forEach((shape, index) => {
                const speed = (index + 1) * 0.15;
                const translateY = rate * speed;
                const rotate = scrolled * 0.01;
                
                shape.style.transform = `translateY(${translateY}px) rotate(${rotate}deg)`;
            });
            
            isScrolling = false;
        });
    }
    
    window.addEventListener('scroll', throttle(updateParallax, 16));
}

// ===== INTERACTIONS AVANCÉES =====
function initAdvancedHoverEffects() {
    if (isMobile) return;
    
    const expertiseCards = document.querySelectorAll('.expertise-card');
    expertiseCards.forEach(card => {
        card.addEventListener('mouseenter', function(e) {
            if (!prefersReducedMotion()) {
                this.style.transform = 'translateY(-8px) rotateX(5deg)';
                this.style.transformStyle = 'preserve-3d';
                this.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) rotateX(0deg)';
        });
        
        card.addEventListener('mousemove', function(e) {
            if (prefersReducedMotion()) return;
            
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            this.style.transform = `translateY(-8px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
    });

    // Effets hover SANS risque pour les highlight cards
    const highlightCards = document.querySelectorAll('.highlight-card');
    highlightCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            if (!prefersReducedMotion()) {
                this.style.transform = 'translateY(-4px)';
                this.style.boxShadow = '0 8px 24px rgba(0, 122, 255, 0.15)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '';
        });
    });

    const otherCards = document.querySelectorAll('.approach-item, .portfolio-item, .journey-item, .quality-item');
    otherCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            if (!prefersReducedMotion()) {
                const icon = this.querySelector('.approach-icon, .quality-icon');
                if (icon) {
                    icon.style.transform = 'scale(1.1) rotate(5deg)';
                }
                this.style.transform = 'translateY(-4px)';
                this.style.boxShadow = '0 8px 24px rgba(0, 122, 255, 0.15)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.approach-icon, .quality-icon');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '';
        });
    });
}

function initButtonAnimations() {
    if (isMobile) return;
    
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            if (prefersReducedMotion()) return;
            
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// ===== FILTRES PORTFOLIO =====
function initPortfolioFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    if (filterButtons.length === 0 || portfolioItems.length === 0) return;
    
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
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, index * (isMobile ? 50 : 100));
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

// ===== ACCESSIBILITÉ =====
function initAccessibility() {
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

// ===== GESTION DU REDIMENSIONNEMENT =====
function handleResize() {
    const wasMobile = isMobile;
    isMobile = detectMobile();
    
    if (!isMobile && navMenu.classList.contains('active')) {
        closeMobileMenu();
    }
    
    if (navbar) {
        navbar.style.transform = 'translateY(0)';
    }
    
    // Toujours protéger les highlight cards
    protectHighlightCards();
    
    if (wasMobile !== isMobile) {
        console.log(`📱➡️💻 Changement de mode: ${isMobile ? 'Desktop vers Mobile' : 'Mobile vers Desktop'}`);
        
        setTimeout(() => {
            initScrollAnimations();
            if (!isMobile) {
                initAdvancedHoverEffects();
            }
        }, 100);
        
        setTimeout(() => {
            protectHighlightCards();
        }, 200);
    }
}

// ===== PERFORMANCE =====
function initPerformanceMonitoring() {
    if ('performance' in window) {
        window.addEventListener('load', () => {
            const loadTime = performance.now();
            console.log(`⚡ Portfolio chargé en ${Math.round(loadTime)}ms`);
            
            if (performance.getEntriesByType) {
                const paintEntries = performance.getEntriesByType('paint');
                paintEntries.forEach(entry => {
                    console.log(`🎨 ${entry.name}: ${Math.round(entry.startTime)}ms`);
                });
            }
        });
    }
}

// ===== FALLBACK DE SÉCURITÉ RENFORCÉ =====
function emergencyFallback() {
    // Fallback rapide pour highlight cards
    setTimeout(() => {
        protectHighlightCards();
    }, 500);
    
    // Fallback général
    setTimeout(() => {
        const hiddenElements = document.querySelectorAll('[style*="opacity: 0"], .scroll-animate:not(.animate)');
        
        if (hiddenElements.length > 0) {
            console.warn(`🚨 Fallback d'urgence activé pour ${hiddenElements.length} éléments`);
            hiddenElements.forEach(element => {
                element.style.setProperty('opacity', '1', 'important');
                element.style.setProperty('transform', 'none', 'important');
                element.classList.add('animate');
            });
        }
    }, 1000);
    
    // Fallback spécial highlight cards
    setTimeout(() => {
        const highlightCards = document.querySelectorAll('.highlight-card');
        let fixedCount = 0;
        
        highlightCards.forEach(card => {
            const styles = window.getComputedStyle(card);
            if (styles.opacity === '0' || styles.display === 'none') {
                protectHighlightCards();
                fixedCount++;
            }
        });
        
        if (fixedCount > 0) {
            console.log(`🛡️ Protection d'urgence highlight cards: ${fixedCount} éléments`);
        }
    }, 1500);
    
    // Fallback final
    setTimeout(() => {
        protectHighlightCards();
        document.querySelectorAll('.scroll-animate:not(.animate)').forEach(element => {
            element.style.setProperty('opacity', '1', 'important');
            element.style.setProperty('transform', 'none', 'important');
            element.classList.add('animate');
        });
    }, 3000);
}

// ===== ÉVÉNEMENTS =====
function initEventListeners() {
    if (hamburger) hamburger.addEventListener('click', toggleMobileMenu);
    
    navLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
    
    document.addEventListener('click', (e) => {
        if (!navbar.contains(e.target) && navMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });
    
    window.addEventListener('scroll', throttle(handleNavbarScroll, 16));
    window.addEventListener('scroll', throttle(updateActiveNavLink, 100));
    window.addEventListener('resize', debounce(handleResize, 250));
    window.addEventListener('load', initPerformanceMonitoring);
    
    // Protection highlight cards lors des événements
    window.addEventListener('load', () => {
        setTimeout(protectHighlightCards, 100);
    });
    
    window.addEventListener('orientationchange', () => {
        setTimeout(() => {
            handleResize();
            protectHighlightCards();
        }, 300);
    });
}

// ===== CSS DYNAMIQUE AVEC PROTECTION SPÉCIALE =====
function injectDynamicStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
        
        .keyboard-navigation *:focus {
            outline: 2px solid #007aff !important;
            outline-offset: 2px !important;
        }
        
        .portfolio-loaded .animate-slide-up {
            opacity: 1;
        }
        
        /* PROTECTION SPÉCIALE HIGHLIGHT CARDS */
        .highlight-card,
        .highlight-protected {
            opacity: 1 !important;
            display: block !important;
            visibility: visible !important;
        }
        
        .highlight-card .highlight-icon,
        .highlight-protected .highlight-icon {
            transform: scale(1) rotate(0deg) !important;
        }
        
        .highlight-card h4,
        .highlight-card p,
        .highlight-protected h4,
        .highlight-protected p {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
        
        /* Styles pour navbar sticky */
        .navbar {
            transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            z-index: 1000;
            isolation: isolate;
        }
        
        body.portfolio-loaded {
            scroll-padding-top: 80px;
        }
        
        /* Optimisations responsive */
        @media (max-width: 767px) {
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
            
            /* PROTECTION MOBILE RENFORCÉE HIGHLIGHT CARDS */
            .highlight-card {
                opacity: 1 !important;
                display: block !important;
                transform: none !important;
                animation: none !important;
                transition: opacity 0.3s ease !important;
            }
            
            .highlight-card .highlight-icon {
                transform: scale(1) rotate(0deg) !important;
                animation: none !important;
            }
            
            .highlight-card h4,
            .highlight-card p {
                opacity: 1 !important;
                transform: translateY(0) !important;
                animation: none !important;
            }
        }
        
        /* Animations desktop */
        @media (min-width: 768px) {
            .approach-item:hover .approach-icon,
            .quality-item:hover .quality-icon {
                transform: scale(1.1) rotate(5deg);
            }
            
            .highlight-card:hover {
                transform: translateY(-4px);
                box-shadow: 0 8px 24px rgba(0, 122, 255, 0.15);
            }
            
            .expertise-card:hover,
            .portfolio-item:hover,
            .journey-item:hover {
                transform: translateY(-6px);
                box-shadow: 0 16px 48px rgba(0, 122, 255, 0.2);
            }
        }
        
        /* Performance optimizations */
        .expertise-card,
        .portfolio-item,
        .journey-item,
        .quality-item,
        .contact-method,
        .social-link,
        .approach-item,
        .highlight-card {
            will-change: transform;
        }
    `;
    document.head.appendChild(style);
    
    console.log('🎨 CSS avec protection spéciale highlight cards injecté');
}

// ===== INITIALISATION PRINCIPALE =====
function initPortfolio() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPortfolio);
        return;
    }
    
    console.log('🚀 Initialisation du portfolio avec animations complètes...');
    
    isMobile = detectMobile();
    
    // PROTECTION IMMÉDIATE DES HIGHLIGHT CARDS
    protectHighlightCards();
    
    // Injection CSS avec protection spéciale
    injectDynamicStyles();
    
    // Initialisation séquentielle
    safeExecute(initEventListeners, 'Erreur événements');
    safeExecute(initSmoothScrolling, 'Erreur smooth scroll');
    safeExecute(initScrollAnimations, 'Erreur animations');
    safeExecute(initPortfolioFilters, 'Erreur filtres');
    safeExecute(initHeroAnimations, 'Erreur animations héro');
    safeExecute(initParallaxEffect, 'Erreur parallax');
    safeExecute(initAdvancedHoverEffects, 'Erreur hover');
    safeExecute(initButtonAnimations, 'Erreur animations boutons');
    safeExecute(initAccessibility, 'Erreur accessibilité');
    
    // Protection continue des highlight cards
    ensureHighlightCardsVisibility();
    
    // Fallback de sécurité
    emergencyFallback();
    
    document.body.classList.add('portfolio-loaded');
    
    console.log(`✅ Portfolio avec animations complètes initialisé! Mode: ${isMobile ? '📱 Mobile' : '💻 Desktop'}`);
    console.log(`🛡️ Protection highlight cards: ${highlightCardsProtected ? 'Active' : 'Standby'}`);
}

// ===== DÉMARRAGE AVEC PROTECTION IMMÉDIATE =====
// Protection immédiate avant même l'initialisation
document.addEventListener('DOMContentLoaded', () => {
    console.log('🛡️ Protection immédiate highlight cards');
    protectHighlightCards();
});

window.addEventListener('load', () => {
    console.log('🛡️ Protection post-load highlight cards');
    protectHighlightCards();
});

// Initialisation principale
initPortfolio();

// ===== EXPORT POUR DÉBOGAGE =====
if (typeof window !== 'undefined') {
    window.portfolioDebug = {
        // Protection spéciale
        protectHighlightCards,
        ensureHighlightCardsVisibility,
        createSafeAnimation,
        
        // Fonctions principales
        detectMobile,
        toggleMobileMenu,
        closeMobileMenu,
        initScrollAnimations,
        
        // Animations complètes
        animateExpertiseCard,
        animateHighlightCard,
        animateAboutHighlights,
        animateApproachItem,
        animateAboutText,
        animateAboutQuote,
        animatePortfolioItem,
        animateJourneyItem,
        animateQualityItem,
        animateContactCard,
        
        // Effets avancés
        initAdvancedHoverEffects,
        initButtonAnimations,
        initParallaxEffect,
        
        // Variables globales
        isMobile,
        animationsReady,
        highlightCardsProtected,
        navbar,
        hamburger,
        navMenu
    };
}

// ===== FIN DU FICHIER =====