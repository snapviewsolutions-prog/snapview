document.addEventListener('DOMContentLoaded', () => {
    // Navigation Toggle for Mobile
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });

    // Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // Scroll Animations (Intersection Observer)
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.card, .feature-card, .section-header, .stat-item, .contact-wrapper');
    fadeElements.forEach(el => {
        el.classList.add('fade-in-scroll');
        observer.observe(el);
    });

    // Number Counter Animation for Results
    const statsSection = document.querySelector('#result');
    let counted = false;

    const countUp = () => {
        const counters = document.querySelectorAll('.number');
        const speed = 200;

        counters.forEach(counter => {
            const updateCount = () => {
                const target = +counter.getAttribute('data-target');
                const count = +counter.innerText.replace(/[^0-9]/g, ''); // Remove non-numeric chars

                // Determine suffix (%, +, M+)
                const originalText = counter.innerText;
                const suffix = originalText.replace(/[0-9]/g, '');

                const inc = target / speed;

                if (count < target) {
                    counter.innerText = Math.ceil(count + inc) + suffix;
                    setTimeout(updateCount, 20);
                } else {
                    counter.innerText = target + suffix;
                }
            };
            updateCount();
        });
    };

    const statsObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !counted) {
            countUp();
            counted = true;
        }
    }, { threshold: 0.5 });

    if (statsSection) {
        statsObserver.observe(statsSection);
    }

    // Contact Form Handling
    const contactForm = document.getElementById('contact-form');
    const hiddenIframe = document.getElementById('hidden_iframe');
    const modal = document.getElementById('confirmation-modal');
    const closeBtn = document.querySelector('.close-modal');
    const closeBtnBtn = document.querySelector('.close-btn');
    let submitted = false;

    if (contactForm) {
        contactForm.addEventListener('submit', () => {
            submitted = true;
        });
    }

    if (hiddenIframe) {
        hiddenIframe.addEventListener('load', () => {
            if (submitted) {
                if (modal) {
                    modal.classList.add('show');
                    modal.style.display = 'flex'; // Ensure flex for centering
                }
                if (contactForm) contactForm.reset();
                submitted = false;
            }
        });
    }

    function closeModal() {
        if (modal) {
            modal.classList.remove('show');
            setTimeout(() => { modal.style.display = 'none'; }, 300); // Wait for transition
        }
    }

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (closeBtnBtn) closeBtnBtn.addEventListener('click', closeModal);
    window.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });


    // Intro Video Logic
    const introOverlay = document.getElementById('intro-overlay');
    const introVideo = document.getElementById('intro-video');

    // Initially prevent animations
    document.body.classList.add('video-active');

    const finishIntro = () => {
        if (introOverlay) {
            introOverlay.classList.add('fade-out');

            // Enable animations
            document.body.classList.remove('video-active');
            document.body.classList.add('animations-active');

            setTimeout(() => {
                introOverlay.style.display = 'none';
            }, 500);
        }
    };

    if (introVideo) {
        // Attempt autoplay
        introVideo.play().catch(error => {
            console.log("Autoplay prevented:", error);
            // If autoplay fails, user interaction (click) will dismiss/start it
        });

        introVideo.addEventListener('ended', finishIntro);
    }

    if (introOverlay) {
        // Click anywhere to skip
        introOverlay.addEventListener('click', () => {
            if (introVideo) introVideo.pause();
            finishIntro();
        });
    }
});
