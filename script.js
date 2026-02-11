// ==========================================
// SMOOTH SCROLLING & NAVIGATION
// ==========================================

document.addEventListener('DOMContentLoaded', function() {

    // Mobile Navigation Toggle
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle mobile menu
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');

            // Animate hamburger icon
            const spans = navToggle.querySelectorAll('span');
            if (navMenu.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }

    // Close mobile menu when clicking on a nav link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                navMenu.classList.remove('active');
                const spans = navToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInsideNav = navMenu.contains(event.target) || navToggle.contains(event.target);

        if (!isClickInsideNav && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            const spans = navToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });

    // ==========================================
    // NAVBAR SCROLL EFFECT
    // ==========================================

    const navbar = document.getElementById('navbar');
    let lastScrollTop = 0;

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // Add shadow when scrolled
        if (scrollTop > 50) {
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
        }

        lastScrollTop = scrollTop;
    });

    // ==========================================
    // ACTIVE SECTION HIGHLIGHTING
    // ==========================================

    const sections = document.querySelectorAll('section[id]');

    function highlightNavOnScroll() {
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (navLink) {
                    navLink.classList.add('active');
                }
            }
        });
    }

    window.addEventListener('scroll', highlightNavOnScroll);

    // ==========================================
    // EXPANDABLE DESCRIPTIONS
    // ==========================================

    const seeMoreButtons = document.querySelectorAll('.see-more-btn');

    seeMoreButtons.forEach(button => {
        button.addEventListener('click', function() {
            const wrapper = this.closest('.project-description-wrapper');
            const description = wrapper.querySelector('.project-description');

            if (description.classList.contains('expanded')) {
                description.classList.remove('expanded');
                this.textContent = 'See more';
                this.setAttribute('aria-expanded', 'false');
            } else {
                description.classList.add('expanded');
                this.textContent = 'See less';
                this.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // ==========================================
    // INTERSECTION OBSERVER FOR ANIMATIONS
    // ==========================================

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe project cards for fade-in animation
    const projectCards = document.querySelectorAll('.project-card, .feature-project');
    projectCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });

    // ==========================================
    // SMOOTH SCROLL POLYFILL
    // ==========================================

    // Enhanced smooth scrolling with offset for fixed navbar
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const navHeight = navbar.offsetHeight;
                const targetPosition = targetSection.offsetTop - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ==========================================
    // BUTTON RIPPLE EFFECT
    // ==========================================

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

    // CSS for ripple effect (injected)
    const style = document.createElement('style');
    style.textContent = `
        .btn {
            position: relative;
            overflow: hidden;
        }

        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple-animation 0.6s ease-out;
            pointer-events: none;
        }

        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // ==========================================
    // AUDIO VISUALIZER
    // ==========================================
    document.addEventListener('DOMContentLoaded', () => {
      const tracks = document.querySelectorAll('.audio-track');

      tracks.forEach(track => {
        const audio = track.querySelector('.audio-player');

        if (!audio) return;

        audio.addEventListener('play', () => {
          // Stop animation on all other tracks
          tracks.forEach(t => {
            if (t !== track) {
              t.classList.remove('playing');
              const otherAudio = t.querySelector('.audio-player');
              if (otherAudio && !otherAudio.paused) {
                otherAudio.pause();
              }
            }
          });
          track.classList.add('playing');
        });

        audio.addEventListener('pause', () => {
          track.classList.remove('playing');
        });

        audio.addEventListener('ended', () => {
          track.classList.remove('playing');
        });
      });
    });

    // ==========================================
    // YOUTUBE VIDEO OPTIMIZATION
    // ==========================================

    // Add loading="lazy" to YouTube iframes for better performance
    const youtubeIframes = document.querySelectorAll('.project-video iframe');
    youtubeIframes.forEach(iframe => {
        iframe.setAttribute('loading', 'lazy');
    });

    // ==========================================
    // CONSOLE MESSAGE
    // ==========================================

    console.log('%cWelcome to my portfolio! 🎵', 'color: #2563eb; font-size: 20px; font-weight: bold;');
    console.log('%cInterested in the code? Check out the GitHub repo!', 'color: #64748b; font-size: 14px;');
});