document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const menuToggle = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // --- Auth Check for Navigation ---
    const updateNav = () => {
        const userStr = localStorage.getItem('sf_user_session');
        const user = userStr ? JSON.parse(userStr) : null;
        const navList = document.querySelector('.nav-links');

        // Remove existing Login/Dashboard links to prevent duplicates
        const existingAuthLink = document.querySelector('.auth-link-item');
        if (existingAuthLink) existingAuthLink.remove();

        const li = document.createElement('li');
        li.className = 'auth-link-item';

        if (user) {
            li.innerHTML = `<a href="dashboard.html" class="btn-nav">My Dashboard (${user.role})</a>`;
        } else {
            li.innerHTML = `<a href="auth.html" class="btn-nav">Login / Register</a>`;
        }

        if (navList) navList.appendChild(li);
    };
    updateNav();

    // Header Scroll Effect
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Smooth Scroll for Anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
                // Close mobile menu if open
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                }
            }
        });
    });

    // Simple Intersection Observer for Fade-in effects on scroll
    const sections = document.querySelectorAll('.section');
    const observerOptions = {
        threshold: 0.1
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(50px)';
        section.style.transition = 'all 0.8s ease-out';
        sectionObserver.observe(section);
    });
});
