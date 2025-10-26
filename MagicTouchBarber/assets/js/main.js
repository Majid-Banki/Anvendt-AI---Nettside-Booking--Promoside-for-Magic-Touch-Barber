/**
 * Magic Touch Barber - Main JavaScript
 * Handles mobile navigation, smooth scrolling, and gallery lightbox
 */

(function() {
  'use strict';
  
  // ============================================
  // Mobile Navigation
  // ============================================
    const initMobileNav = () => {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (!navToggle || !navMenu) return;
    
    let focusableElements = [];
    let firstFocusableElement = null;
    let lastFocusableElement = null;
    
    const updateFocusableElements = () => {
      focusableElements = Array.from(
        navMenu.querySelectorAll('a[href], button:not([disabled])')
      ).filter(el => el.offsetParent !== null);
      
      firstFocusableElement = focusableElements[0];
      lastFocusableElement = focusableElements[focusableElements.length - 1];
    };
    
    const openMenu = () => {
      navMenu.classList.add('active');
      navToggle.setAttribute('aria-expanded', 'true');
      updateFocusableElements();
      
      if (firstFocusableElement) {
        setTimeout(() => firstFocusableElement.focus(), 100);
      }
      
      document.addEventListener('keydown', handleMenuKeydown);
      document.addEventListener('click', handleOutsideClick);
    };
    
    const closeMenu = () => {
      navMenu.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.focus();
      
      document.removeEventListener('keydown', handleMenuKeydown);
      document.removeEventListener('click', handleOutsideClick);
    };
    
    const toggleMenu = () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      
      if (isExpanded) {
        closeMenu();
      } else {
        openMenu();
      }
    };
    
    const handleMenuKeydown = (e) => {
      if (e.key === 'Escape') {
        closeMenu();
        return;
      }
      
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstFocusableElement) {
            e.preventDefault();
            lastFocusableElement.focus();
          }
        } else {
          if (document.activeElement === lastFocusableElement) {
            e.preventDefault();
            firstFocusableElement.focus();
          }
        }
      }
    };
    
    const handleOutsideClick = (e) => {
      if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
        closeMenu();
      }
    };
    
    navToggle.addEventListener('click', toggleMenu);
    
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          closeMenu();
        }
      });
    });
    
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
        closeMenu();
      }
    });
  };
  
  // ============================================
  // Smooth Scrolling
  // ============================================
   const initSkipLink = () => {
    const skipLink = document.querySelector('.skip-link');
    
    if (!skipLink) return;
    
    skipLink.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      if (href && href.startsWith('#')) {
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          e.preventDefault();
          
          const headerOffset = 80;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          
          const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: prefersReducedMotion ? 'auto' : 'smooth'
          });
          
          setTimeout(() => {
            targetElement.focus({ preventScroll: true });
            
            if (!targetElement.hasAttribute('tabindex')) {
              targetElement.setAttribute('tabindex', '-1');
            }
          }, prefersReducedMotion ? 0 : 500);
        }
      }
    });
  };
  // ============================================
  // Gallery Lightbox
  // ============================================
  const initGalleryLightbox = () => {
    const lightbox = document.getElementById('lightbox');
    
    if (!lightbox) return;
    
    const lightboxImage = lightbox.querySelector('.lightbox-image');
    const closeButton = lightbox.querySelector('.lightbox-close');
    const prevButton = lightbox.querySelector('.lightbox-prev');
    const nextButton = lightbox.querySelector('.lightbox-next');
    const overlay = lightbox.querySelector('.lightbox-overlay');
    
    let galleryImages = [];
    let currentIndex = 0;
    let previousFocusElement = null;
    
    const updateGalleryImages = () => {
      galleryImages = Array.from(
        document.querySelectorAll('.gallery-button')
      ).map(btn => btn.getAttribute('data-image'));
    };
    
    const openLightbox = (imageSrc) => {
      previousFocusElement = document.activeElement;
      
      currentIndex = galleryImages.indexOf(imageSrc);
      lightboxImage.src = imageSrc;
      lightboxImage.alt = `Galleri bilde ${currentIndex + 1} av ${galleryImages.length}`;
      
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
      
      setTimeout(() => closeButton.focus(), 100);
      
      document.addEventListener('keydown', handleLightboxKeydown);
    };
    
    const closeLightbox = () => {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
      
      document.removeEventListener('keydown', handleLightboxKeydown);
      
      if (previousFocusElement) {
        previousFocusElement.focus();
      }
    };
    
    const showNextImage = () => {
      currentIndex = (currentIndex + 1) % galleryImages.length;
      lightboxImage.src = galleryImages[currentIndex];
      lightboxImage.alt = `Galleri bilde ${currentIndex + 1} av ${galleryImages.length}`;
    };
    
    const showPrevImage = () => {
      currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
      lightboxImage.src = galleryImages[currentIndex];
      lightboxImage.alt = `Galleri bilde ${currentIndex + 1} av ${galleryImages.length}`;
    };
    
    const handleLightboxKeydown = (e) => {
      switch(e.key) {
        case 'Escape':
          closeLightbox();
          break;
        case 'ArrowRight':
          showNextImage();
          break;
        case 'ArrowLeft':
          showPrevImage();
          break;
        case 'Tab':
          e.preventDefault();
          const focusableElements = [closeButton, prevButton, nextButton].filter(el => el);
          const currentFocusIndex = focusableElements.indexOf(document.activeElement);
          
          if (e.shiftKey) {
            const prevIndex = (currentFocusIndex - 1 + focusableElements.length) % focusableElements.length;
            focusableElements[prevIndex].focus();
          } else {
            const nextIndex = (currentFocusIndex + 1) % focusableElements.length;
            focusableElements[nextIndex].focus();
          }
          break;
      }
    };
    
    updateGalleryImages();
    
    document.querySelectorAll('.gallery-button').forEach(button => {
      button.addEventListener('click', function() {
        const imageSrc = this.getAttribute('data-image');
        openLightbox(imageSrc);
      });
    });
    
    if (closeButton) {
      closeButton.addEventListener('click', closeLightbox);
    }
    
    if (overlay) {
      overlay.addEventListener('click', closeLightbox);
    }
    
    if (prevButton) {
      prevButton.addEventListener('click', showPrevImage);
    }
    
    if (nextButton) {
      nextButton.addEventListener('click', showNextImage);
    }
  };
  
  // ============================================
  // Lazy Loading Enhancement (IntersectionObserver)
  // ============================================
  const initLazyLoadObserver = () => {
    if (!('IntersectionObserver' in window)) return;
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          
          img.classList.add('loaded');
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px 0px',
      threshold: 0.01
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  };
  
  // ============================================
  // Initialize All
  // ============================================
const init = () => {
    initMobileNav();
    initSkipLink();
  };
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();