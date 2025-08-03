/* ===================================================
   PORTFOLIO LAMAH MAA EUNICE - JAVASCRIPT
   Animations fluides et interactions modernes
   =================================================== */

// ===== VARIABLES GLOBALES =====
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// Variables pour les performances
let lastScrollTop = 0;
let isScrolling = false;
let resizeTimer = null;

// ===== UTILITAIRES =====
/**
 * Fonction de throttle pour optimiser les performances
 */
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

/**
 * Fonction de debounce pour les événements de redimensionnement
 */
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

/**
 * Vérification du support des animations CSS
 */
function supportsAnimations() {
    const el = document.createElement('div');
    return typeof el.style.animationName !== 'undefined';
}

/**
 * Détection de la préférence utilisateur pour les animations réduites
 */
function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// ===== NAVIGATION STICKY =====
/**
 * Toggle du menu mobile avec animations fluides
 */
function toggleMobileMenu() {
    const isActive = hamburger.classList.contains('active');
    
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    
    // Prévenir le scroll du body quand le menu est ouvert
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    
    // Améliorer l'accessibilité
    hamburger.setAttribute('aria-expanded', !isActive);
    navMenu.setAttribute('aria-hidden', isActive);
}

/**
 * Fermeture du menu mobile
 */
function closeMobileMenu() {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
    document.body.style.overflow = '';
    
    // Accessibilité
    hamburger.setAttribute('aria-expanded', 'false');
    navMenu.setAttribute('aria-hidden', 'true');
}

/**
 * Gestion optimisée des effets de scroll sur la navbar sticky
 */
function handleNavbarScroll() {
    if (isScrolling) return;
    
    isScrolling = true;
    requestAnimationFrame(() => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollThreshold = 50;
        
        // Effet glassmorphism au scroll - plus rapide pour sticky
        if (scrollTop > scrollThreshold) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        isScrolling = false;
    });
}

/**
 * Mise à jour optimisée du lien de navigation actif pour sticky
 */
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        const correspondingLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        // Ajustement pour le comportement sticky
        if (scrollPos >= sectionTop - 50 && scrollPos < sectionTop + sectionHeight - 50) {
            navLinks.forEach(link => link.classList.remove('active'));
            if (correspondingLink) {
                correspondingLink.classList.add('active');
            }
        }
    });
}

// ===== SMOOTH SCROLLING OPTIMISÉ POUR STICKY =====
/**
 * Calcul dynamique des offsets pour sticky navbar
 */
function calculateScrollOffset(targetElement) {
    const navbarHeight = navbar.offsetHeight;
    return navbarHeight + 10;
}

/**
 * Smooth scrolling optimisé pour navbar sticky
 */
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
                
                // Focus management pour l'accessibilité
                targetSection.setAttribute('tabindex', '-1');
                targetSection.focus();
                setTimeout(() => {
                    targetSection.removeAttribute('tabindex');
                }, 1000);
            }
        });
    });
}

// ===== ANIMATIONS AU SCROLL =====
/**
 * Configuration de l'Intersection Observer pour les animations
 */
const observerOptions = {
    threshold: [0.1, 0.3],
    rootMargin: '-80px 0px -50px 0px'
};

/**
 * Callback pour l'Intersection Observer
 */
function handleIntersection(entries) {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.1) {
            const element = entry.target;
            const delay = parseInt(element.dataset.delay) || 0;
            
            // Animation avec délai personnalisé
            setTimeout(() => {
                element.classList.add('animate');
                
                // Animations spéciales pour certains éléments
                if (element.classList.contains('expertise-card')) {
                    animateExpertiseCard(element);
                } else if (element.classList.contains('quality-item')) {
                    animateQualityItem(element);
                } else if (element.classList.contains('contact-card') || element.classList.contains('streamlit-form')) {
                    animateContactCard(element);
                } else if (element.classList.contains('portfolio-item')) {
                    animatePortfolioItem(element);
                } else if (element.classList.contains('journey-item')) {
                    animateJourneyItem(element);
                } else if (element.classList.contains('about-text')) {
                    animateAboutText(element);
                } else if (element.classList.contains('about-highlights')) {
                    animateAboutHighlights(element);
                } else if (element.classList.contains('approach-item')) {
                    animateApproachItem(element);
                } else if (element.classList.contains('highlight-card')) {
                    animateHighlightCard(element);
                } else if (element.classList.contains('about-quote')) {
                    animateAboutQuote(element);
                }
            }, delay);
            
            // Ne plus observer cet élément
            scrollObserver.unobserve(element);
        }
    });
}

// Création de l'observer
const scrollObserver = new IntersectionObserver(handleIntersection, observerOptions);

/**
 * Animation spéciale pour les cartes d'expertise
 */
function animateExpertiseCard(card) {
    const skillItems = card.querySelectorAll('.skill-item');
    const icon = card.querySelector('.expertise-icon');
    
    // Animation de l'icône
    if (icon && !prefersReducedMotion()) {
        icon.style.transform = 'scale(0)';
        icon.style.transition = 'transform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        
        setTimeout(() => {
            icon.style.transform = 'scale(1)';
        }, 200);
    }
    
    // Animation en cascade des skill items
    skillItems.forEach((item, index) => {
        if (!prefersReducedMotion()) {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-20px)';
            item.style.transition = `all 0.4s ease ${index * 100}ms`;
            
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
            }, 300 + (index * 100));
        }
    });
}

/**
 * Animation spéciale pour les éléments de qualités
 */
function animateQualityItem(item) {
    const icon = item.querySelector('.quality-icon');
    
    if (icon && !prefersReducedMotion()) {
        icon.style.transform = 'scale(0) rotate(-180deg)';
        icon.style.transition = 'transform 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        
        setTimeout(() => {
            icon.style.transform = 'scale(1) rotate(0deg)';
        }, 100);
    }
}

/**
 * Animation spéciale pour les éléments de portfolio
 */
function animatePortfolioItem(item) {
    const image = item.querySelector('.project-image');
    const content = item.querySelector('.project-content');
    const tags = item.querySelectorAll('.tag');
    
    if (!prefersReducedMotion()) {
        // Animation de l'image avec un effet de slide
        if (image) {
            image.style.transform = 'translateY(-20px)';
            image.style.opacity = '0.8';
            image.style.transition = 'all 0.6s ease';
            
            setTimeout(() => {
                image.style.transform = 'translateY(0)';
                image.style.opacity = '1';
            }, 200);
        }
        
        // Animation du contenu
        if (content) {
            content.style.transform = 'translateY(20px)';
            content.style.opacity = '0';
            content.style.transition = 'all 0.5s ease';
            
            setTimeout(() => {
                content.style.transform = 'translateY(0)';
                content.style.opacity = '1';
            }, 400);
        }
        
        // Animation des tags en cascade
        tags.forEach((tag, index) => {
            tag.style.opacity = '0';
            tag.style.transform = 'scale(0.8)';
            tag.style.transition = `all 0.3s ease ${index * 50}ms`;
            
            setTimeout(() => {
                tag.style.opacity = '1';
                tag.style.transform = 'scale(1)';
            }, 600 + (index * 50));
        });
    }
}

/**
 * Animation spéciale pour les éléments de parcours
 */
function animateJourneyItem(item) {
    const marker = item.querySelector('.journey-marker');
    const content = item.querySelector('.journey-content');
    const badges = item.querySelectorAll('.tech-badge');
    
    if (!prefersReducedMotion()) {
        // Animation du marqueur avec bounce
        if (marker) {
            marker.style.transform = 'scale(0)';
            marker.style.transition = 'transform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            
            setTimeout(() => {
                marker.style.transform = 'scale(1)';
            }, 100);
        }
        
        // Animation du contenu avec slide
        if (content) {
            content.style.opacity = '0';
            content.style.transform = 'translateX(-30px)';
            content.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            
            setTimeout(() => {
                content.style.opacity = '1';
                content.style.transform = 'translateX(0)';
            }, 300);
        }
        
        // Animation des badges technologiques
        badges.forEach((badge, index) => {
            badge.style.opacity = '0';
            badge.style.transform = 'translateY(10px)';
            badge.style.transition = `all 0.3s ease ${index * 100}ms`;
            
            setTimeout(() => {
                badge.style.opacity = '1';
                badge.style.transform = 'translateY(0)';
            }, 800 + (index * 100));
        });
    }
}

/**
 * Animation spéciale pour le texte À propos
 */
function animateAboutText(textElement) {
    const sections = textElement.querySelectorAll('.about-intro, .about-philosophy, .about-approach');
    
    sections.forEach((section, index) => {
        if (!prefersReducedMotion()) {
            section.style.opacity = '0';
            section.style.transform = 'translateY(30px)';
            section.style.transition = `all 0.6s ease ${index * 200}ms`;
            
            setTimeout(() => {
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }, index * 200);
        }
    });
    
    // Animation spéciale pour les approach items
    const approachItems = textElement.querySelectorAll('.approach-item');
    approachItems.forEach((item, index) => {
        setTimeout(() => {
            animateApproachItem(item);
        }, 600 + (index * 150));
    });
}

/**
 * Animation spéciale pour les éléments d'approche
 */
function animateApproachItem(item) {
    const icon = item.querySelector('.approach-icon');
    
    if (!prefersReducedMotion()) {
        // Animation de l'icône avec rotation
        if (icon) {
            icon.style.transform = 'scale(0) rotate(-90deg)';
            icon.style.transition = 'transform 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            
            setTimeout(() => {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }, 200);
        }
        
        // Effet de glissement du contenu
        const text = item.querySelector('.approach-text');
        if (text) {
            text.style.opacity = '0';
            text.style.transform = 'translateX(20px)';
            text.style.transition = 'all 0.5s ease';
            
            setTimeout(() => {
                text.style.opacity = '1';
                text.style.transform = 'translateX(0)';
            }, 300);
        }
    }
}

/**
 * Animation spéciale pour les highlights
 */
function animateAboutHighlights(highlightsElement) {
    const cards = highlightsElement.querySelectorAll('.highlight-card');
    
    cards.forEach((card, index) => {
        setTimeout(() => {
            animateHighlightCard(card);
        }, index * 200);
    });
}

/**
 * Animation spéciale pour une carte highlight
 */
function animateHighlightCard(card) {
    const icon = card.querySelector('.highlight-icon');
    
    if (!prefersReducedMotion()) {
        // Animation de l'icône avec effet élastique
        if (icon) {
            icon.style.transform = 'scale(0) rotate(180deg)';
            icon.style.transition = 'transform 0.7s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            
            setTimeout(() => {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }, 100);
        }
        
        // Animation du contenu avec fade
        const content = card.querySelector('h4, p');
        if (content) {
            const textElements = card.querySelectorAll('h4, p');
            textElements.forEach((el, index) => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(15px)';
                el.style.transition = `all 0.4s ease ${index * 100}ms`;
                
                setTimeout(() => {
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }, 400 + (index * 100));
            });
        }
    }
}

/**
 * Animation spéciale pour la citation
 */
function animateAboutQuote(quoteElement) {
    const blockquote = quoteElement.querySelector('blockquote');
    
    if (!prefersReducedMotion() && blockquote) {
        // Animation avec effet de pulsation
        blockquote.style.transform = 'scale(0.95)';
        blockquote.style.opacity = '0';
        blockquote.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        
        setTimeout(() => {
            blockquote.style.transform = 'scale(1)';
            blockquote.style.opacity = '1';
        }, 200);
        
        // Animation du texte interne
        const text = blockquote.querySelector('p');
        const cite = blockquote.querySelector('cite');
        
        if (text) {
            text.style.opacity = '0';
            text.style.transform = 'translateY(20px)';
            text.style.transition = 'all 0.6s ease 0.4s';
            
            setTimeout(() => {
                text.style.opacity = '1';
                text.style.transform = 'translateY(0)';
            }, 400);
        }
        
        if (cite) {
            cite.style.opacity = '0';
            cite.style.transform = 'translateY(10px)';
            cite.style.transition = 'all 0.4s ease 0.8s';
            
            setTimeout(() => {
                cite.style.opacity = '1';
                cite.style.transform = 'translateY(0)';
            }, 800);
        }
    }
}

/**
 * Animation spéciale pour les cartes de contact
 */
function animateContactCard(card) {
    const methods = card.querySelectorAll('.contact-method');
    
    methods.forEach((method, index) => {
        if (!prefersReducedMotion()) {
            method.style.opacity = '0';
            method.style.transform = 'translateY(20px)';
            method.style.transition = `all 0.5s ease ${index * 150}ms`;
            
            setTimeout(() => {
                method.style.opacity = '1';
                method.style.transform = 'translateY(0)';
            }, index * 150);
        }
    });
}

/**
 * Initialisation des animations au scroll
 */
function initScrollAnimations() {
    if (!supportsAnimations()) return;
    
    const animatedElements = document.querySelectorAll('.scroll-animate');
    animatedElements.forEach((element, index) => {
        // Attribution d'un délai automatique si non spécifié
        if (!element.dataset.delay) {
            element.dataset.delay = (index % 3) * 100;
        }
        scrollObserver.observe(element);
    });
}

// ===== ANIMATIONS HÉRO =====
/**
 * Animation de chargement pour la section héro
 */
function initHeroAnimations() {
    if (prefersReducedMotion()) return;
    
    // Animation des éléments du héro
    const heroElements = document.querySelectorAll('.animate-slide-up');
    heroElements.forEach((element, index) => {
        element.style.animationDelay = `${index * 200}ms`;
    });
    
    // Animation de la carte profil
    const profileCard = document.querySelector('.profile-card');
    if (profileCard) {
        profileCard.style.opacity = '0';
        profileCard.style.transform = 'translateY(30px) scale(0.9)';
        profileCard.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        
        setTimeout(() => {
            profileCard.style.opacity = '1';
            profileCard.style.transform = 'translateY(0) scale(1)';
        }, 100);
    }
}

// ===== EFFETS PARALLAX =====
/**
 * Effet parallax subtil sur les formes flottantes
 */
function initParallaxEffect() {
    if (prefersReducedMotion()) return;
    
    const shapes = document.querySelectorAll('.shape');
    
    function updateParallax() {
        if (isScrolling) return;
        
        isScrolling = true;
        requestAnimationFrame(() => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.3;
            
            shapes.forEach((shape, index) => {
                const speed = (index + 1) * 0.2;
                const translateY = rate * speed;
                const rotate = scrolled * 0.02;
                
                shape.style.transform = `translateY(${translateY}px) rotate(${rotate}deg)`;
            });
            
            isScrolling = false;
        });
    }
    
    window.addEventListener('scroll', throttle(updateParallax, 16));
}

// ===== INTERACTIONS AVANCÉES =====
/**
 * Effets hover avancés pour les cartes
 */
function initAdvancedHoverEffects() {
    // Cartes d'expertise avec effet de rotation 3D
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
        
        // Effet de suivi de la souris
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

    // Effets hover pour les cartes À propos
    const aboutCards = document.querySelectorAll('.approach-item, .highlight-card');
    aboutCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            if (!prefersReducedMotion()) {
                const icon = this.querySelector('.approach-icon, .highlight-icon');
                if (icon) {
                    icon.style.transform = 'scale(1.1) rotate(5deg)';
                }
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.approach-icon, .highlight-icon');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
        });
    });
}

/**
 * Animation des boutons avec effet de vague
 */
function initButtonAnimations() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            if (prefersReducedMotion()) return;
            
            // Effet de vague (ripple)
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
/**
 * Initialisation des filtres de portfolio
 */
function initPortfolioFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    if (filterButtons.length === 0 || portfolioItems.length === 0) return;
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Mettre à jour les boutons actifs
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            
            // Filtrer les éléments
            portfolioItems.forEach((item, index) => {
                const categories = item.getAttribute('data-category');
                const shouldShow = filter === 'all' || categories.includes(filter);
                
                if (shouldShow) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, index * 100);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// ===== INTERACTIONS SPÉCIALES SECTION À PROPOS =====
/**
 * Effet de parallax sur la section À propos
 */
function initAboutParallax() {
    if (prefersReducedMotion()) return;
    
    const aboutSection = document.querySelector('#about');
    const aboutHighlights = document.querySelector('.about-highlights');
    
    if (!aboutSection || !aboutHighlights) return;
    
    function updateAboutParallax() {
        const scrolled = window.pageYOffset;
        const aboutTop = aboutSection.offsetTop;
        const aboutHeight = aboutSection.offsetHeight;
        const windowHeight = window.innerHeight;
        
        // Calculer si nous sommes dans la section À propos
        if (scrolled + windowHeight > aboutTop && scrolled < aboutTop + aboutHeight) {
            const progress = (scrolled + windowHeight - aboutTop) / (aboutHeight + windowHeight);
            const translateY = (progress - 0.5) * 50;
            
            aboutHighlights.style.transform = `translateY(${translateY}px)`;
        }
    }
    
    window.addEventListener('scroll', throttle(updateAboutParallax, 16));
}

/**
 * Animation au survol de la citation
 */
function initQuoteInteraction() {
    const quote = document.querySelector('.about-quote blockquote');
    
    if (!quote) return;
    
    quote.addEventListener('mouseenter', function() {
        if (!prefersReducedMotion()) {
            this.style.transform = 'scale(1.02)';
            this.style.boxShadow = '0 16px 48px rgba(0, 122, 255, 0.25)';
        }
    });
    
    quote.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
        this.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.12)';
    });
}

// ===== GESTION STICKY NAVBAR =====
/**
 * Optimisation spéciale pour mobile avec navbar sticky
 */
function initMobileStickyFix() {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    if (isTouchDevice && window.innerWidth <= 768) {
        // Sur mobile, s'assurer que le comportement sticky fonctionne bien
        navbar.style.position = 'sticky';
        navbar.style.top = '0';
        navbar.style.zIndex = '1000';
    }
}

/**
 * Fonction d'initialisation complète pour sticky navbar
 */
function initStickyNavbar() {
    // Initialiser les fixes mobile
    initMobileStickyFix();
    
    // Marquer comme initialisé
    navbar.classList.add('sticky-initialized');
    
    console.log('✅ Navbar sticky initialisée');
}

// ===== LAZY LOADING =====
/**
 * Lazy loading pour les images avec placeholder
 */
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                
                // Effet de fade in
                img.style.opacity = '0';
                img.style.transition = 'opacity 0.5s ease';
                
                img.src = img.dataset.src;
                img.onload = () => {
                    img.style.opacity = '1';
                    img.classList.add('loaded');
                };
                
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// ===== ACCESSIBILITÉ =====
/**
 * Gestion de la navigation au clavier
 */
function initKeyboardNavigation() {
    document.addEventListener('keydown', function(e) {
        // Fermer le menu mobile avec Échap
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMobileMenu();
        }
        
        // Indicateur de navigation clavier
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    // Retirer l'indicateur lors du clic
    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-navigation');
    });
}

/**
 * Focus trap pour le menu mobile
 */
function initFocusTrap() {
    const focusableElements = navMenu.querySelectorAll(
        'a, button, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length === 0) return;
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    navMenu.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    lastElement.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastElement) {
                    firstElement.focus();
                    e.preventDefault();
                }
            }
        }
    });
}

// ===== GESTION DES ERREURS =====
/**
 * Exécution sécurisée avec gestion d'erreurs
 */
function safeExecute(func, errorMessage = 'Erreur dans l\'exécution') {
    try {
        func();
    } catch (error) {
        console.warn(errorMessage + ':', error);
    }
}

// ===== PERFORMANCE ET MONITORING =====
/**
 * Monitoring des performances
 */
function initPerformanceMonitoring() {
    if ('performance' in window) {
        window.addEventListener('load', () => {
            const loadTime = performance.now();
            console.log(`⚡ Portfolio chargé en ${Math.round(loadTime)}ms`);
            
            // Mesures de performance avancées
            if (performance.getEntriesByType) {
                const paintEntries = performance.getEntriesByType('paint');
                paintEntries.forEach(entry => {
                    console.log(`🎨 ${entry.name}: ${Math.round(entry.startTime)}ms`);
                });
            }
        });
    }
}

/**
 * Optimisation des redimensionnements
 */
function handleResize() {
    // Fermer le menu mobile lors du redimensionnement
    if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
        closeMobileMenu();
    }
    
    // Reset des transformations lors du redimensionnement
    if (navbar) {
        navbar.style.transform = 'translateY(0)';
    }
    
    // Recalculer les positions pour les animations
    if (scrollObserver) {
        const hiddenElements = document.querySelectorAll('.scroll-animate:not(.animate)');
        hiddenElements.forEach(el => scrollObserver.observe(el));
    }
}

// ===== ÉVÉNEMENTS =====
/**
 * Initialisation de tous les événements
 */
function initEventListeners() {
    // Navigation
    hamburger?.addEventListener('click', toggleMobileMenu);
    navLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
    
    // Fermer le menu en cliquant à l'extérieur
    document.addEventListener('click', (e) => {
        if (!navbar.contains(e.target) && navMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });
    
    // Scroll événements avec throttling
    window.addEventListener('scroll', throttle(handleNavbarScroll, 16));
    window.addEventListener('scroll', throttle(updateActiveNavLink, 100));
    
    // Redimensionnement avec debouncing
    window.addEventListener('resize', debounce(handleResize, 250));
    
    // Chargement de la page
    window.addEventListener('load', initPerformanceMonitoring);
}

// ===== INITIALISATION PRINCIPALE =====
/**
 * Fonction principale d'initialisation
 */
function initPortfolio() {
    // Vérifier que le DOM est prêt
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPortfolio);
        return;
    }
    
    console.log('🚀 Initialisation du portfolio...');
    
    // Initialisation dans l'ordre optimal
    safeExecute(initEventListeners, 'Erreur lors de l\'initialisation des événements');
    safeExecute(initSmoothScrolling, 'Erreur lors de l\'initialisation du smooth scrolling');
    safeExecute(initScrollAnimations, 'Erreur lors de l\'initialisation des animations de scroll');
    safeExecute(initPortfolioFilters, 'Erreur lors de l\'initialisation des filtres portfolio');
    safeExecute(initHeroAnimations, 'Erreur lors de l\'initialisation des animations du héro');
    safeExecute(initParallaxEffect, 'Erreur lors de l\'initialisation du parallax');
    safeExecute(initAdvancedHoverEffects, 'Erreur lors de l\'initialisation des effets hover');
    safeExecute(initButtonAnimations, 'Erreur lors de l\'initialisation des animations de boutons');
    safeExecute(initLazyLoading, 'Erreur lors de l\'initialisation du lazy loading');
    safeExecute(initKeyboardNavigation, 'Erreur lors de l\'initialisation de la navigation clavier');
    safeExecute(initFocusTrap, 'Erreur lors de l\'initialisation du focus trap');
    safeExecute(initAboutParallax, 'Erreur lors de l\'initialisation du parallax À propos');
    safeExecute(initQuoteInteraction, 'Erreur lors de l\'initialisation des interactions citation');
    safeExecute(initStickyNavbar, 'Erreur lors de l\'initialisation de la navbar sticky');
    
    // Marquer le portfolio comme initialisé
    document.body.classList.add('portfolio-loaded');
    
    console.log('✅ Portfolio initialisé avec succès!');
}

// ===== CSS DYNAMIQUE =====
/**
 * Ajout des styles CSS pour les animations dynamiques
 */
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
        
        .approach-item:hover .approach-icon {
            transform: scale(1.1) rotate(5deg) !important;
        }
        
        .highlight-card:hover .highlight-icon {
            transform: scale(1.1) rotate(5deg) !important;
        }
        
        /* Styles pour navbar sticky */
        .navbar {
            transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        /* Compensation pour éviter le jump initial */
        body.portfolio-loaded {
            scroll-padding-top: 80px;
        }
        
        /* Amélioration du z-index pour sticky */
        .navbar {
            z-index: 1000;
            isolation: isolate;
        }
    `;
    document.head.appendChild(style);
}

// ===== DÉMARRAGE =====
// Injecter les styles dynamiques
injectDynamicStyles();

// Initialiser le portfolio
initPortfolio();

// ===== EXPORT POUR DÉBOGAGE =====
// Fonctions disponibles globalement pour le débogage
if (typeof window !== 'undefined') {
    window.portfolioDebug = {
        toggleMobileMenu,
        closeMobileMenu,
        initScrollAnimations,
        initPortfolioFilters,
        initHeroAnimations,
        updateActiveNavLink,
        animateAboutText,
        animateAboutHighlights,
        animateApproachItem,
        animateHighlightCard,
        animateAboutQuote,
        initStickyNavbar,
        navbar,
        hamburger,
        navMenu
    };
}

// ===== FIN DU FICHIER =====