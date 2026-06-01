/* ================================================
   main.js — Shared JavaScript for All Pages
   Hafidh Portfolio Website
   ================================================ */

/* -----------------------------------------------
   1. PAGE LOADER
   ----------------------------------------------- */
(function () {
    // Inject loader styles if not already in CSS
    const loaderStyle = document.createElement('style');
    loaderStyle.textContent = `
        #page-loader {
            position: fixed;
            inset: 0;
            background: #0f172a;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            transition: opacity 0.5s ease, visibility 0.5s ease;
        }
        #page-loader.hidden {
            opacity: 0;
            visibility: hidden;
        }
        .loader-inner {
            width: 48px;
            height: 48px;
            border: 4px solid rgba(0,212,255,0.15);
            border-top-color: #00d4ff;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(loaderStyle);

    window.addEventListener('load', function () {
        const loader = document.getElementById('page-loader');
        if (loader) {
            loader.classList.add('hidden');
            setTimeout(() => loader.remove(), 500);
        }
    });
})();


/* -----------------------------------------------
   2. ACTIVE NAV LINK (Highlight current page)
   ----------------------------------------------- */
(function () {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('nav ul li a');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.style.color = '#00d4ff';
            link.style.fontWeight = '700';
        }
    });
})();


/* -----------------------------------------------
   3. NAVBAR SCROLL EFFECT (Shrink on scroll)
   ----------------------------------------------- */
(function () {
    const navStyle = document.createElement('style');
    navStyle.textContent = `
        nav {
            transition: all 0.35s ease;
        }
        nav.scrolled {
            padding: 10px 50px !important;
            background: rgba(228,232,233,0.97) !important;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        }
    `;
    document.head.appendChild(navStyle);

    window.addEventListener('scroll', function () {
        const nav = document.querySelector('nav');
        if (!nav) return;
        if (window.scrollY > 60) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });
})();


/* -----------------------------------------------
   4. SCROLL REVEAL (Animate elements into view)
   ----------------------------------------------- */
(function () {
    const revealStyle = document.createElement('style');
    revealStyle.textContent = `
        .reveal {
            opacity: 0;
            transform: translateY(40px);
            transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .reveal.visible {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(revealStyle);

    // Add reveal class to target elements
    const targets = document.querySelectorAll('.card, .project-card, .info-item, .contact-form-wrap, .portfolio-cta, .stats-section');
    targets.forEach(el => el.classList.add('reveal'));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();


/* -----------------------------------------------
   5. ANIMATED COUNTER (Stats numbers counting up)
   ----------------------------------------------- */
(function () {
    function animateCounter(el) {
        const target = parseInt(el.dataset.target);
        const duration = 1800;
        const step = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                el.textContent = target + '+';
                clearInterval(timer);
            } else {
                el.textContent = Math.floor(current);
            }
        }, 16);
    }

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.counter').forEach(el => counterObserver.observe(el));
})();


/* -----------------------------------------------
   6. SMOOTH SCROLL (Internal anchor links)
   ----------------------------------------------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});


/* -----------------------------------------------
   7. MOBILE NAV TOGGLE
   ----------------------------------------------- */
(function () {
    const mobileStyle = document.createElement('style');
    mobileStyle.textContent = `
        .menu-toggle {
            display: none;
            background: none;
            border: none;
            cursor: pointer;
            flex-direction: column;
            gap: 5px;
            padding: 5px;
        }
        .menu-toggle span {
            display: block;
            width: 25px;
            height: 2px;
            background: #1a1b1b;
            border-radius: 2px;
            transition: all 0.3s ease;
        }
        .menu-toggle.open span:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); }
        .menu-toggle.open span:nth-child(2) { opacity: 0; }
        .menu-toggle.open span:nth-child(3) { transform: rotate(-45deg) translate(5px, -5px); }

        @media (max-width: 600px) {
            .menu-toggle { display: flex !important; }
            nav {
                flex-wrap: wrap;
                padding: 15px 20px !important;
            }
            nav ul {
                width: 100%;
                flex-direction: column;
                max-height: 0;
                overflow: hidden;
                transition: max-height 0.4s ease;
            }
            nav ul.open {
                max-height: 300px;
            }
            nav ul li {
                margin: 8px 0;
            }
        }
    `;
    document.head.appendChild(mobileStyle);

    const nav = document.querySelector('nav');
    if (!nav) return;

    const ul = nav.querySelector('ul');

    const toggle = document.createElement('button');
    toggle.className = 'menu-toggle';
    toggle.setAttribute('aria-label', 'Toggle menu');
    toggle.innerHTML = '<span></span><span></span><span></span>';
    nav.insertBefore(toggle, ul);

    toggle.addEventListener('click', () => {
        toggle.classList.toggle('open');
        ul.classList.toggle('open');
    });

    // Close on link click
    ul.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('open');
            ul.classList.remove('open');
        });
    });
})();


/* -----------------------------------------------
   8. BACK TO TOP BUTTON
   ----------------------------------------------- */
(function () {
    const btn = document.createElement('button');
    btn.id = 'back-to-top';
    btn.innerHTML = '↑';
    btn.setAttribute('aria-label', 'Back to top');
    document.body.appendChild(btn);

    const style = document.createElement('style');
    style.textContent = `
        #back-to-top {
            position: fixed;
            bottom: 100px;
            right: 25px;
            width: 44px;
            height: 44px;
            border-radius: 50%;
            background: rgba(0,212,255,0.15);
            border: 2px solid rgba(0,212,255,0.4);
            color: #00d4ff;
            font-size: 20px;
            cursor: pointer;
            z-index: 999;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            line-height: 1;
        }
        #back-to-top.show {
            opacity: 1;
            visibility: visible;
        }
        #back-to-top:hover {
            background: #00d4ff;
            color: #0f172a;
            transform: translateY(-4px);
            box-shadow: 0 8px 20px rgba(0,212,255,0.3);
        }
    `;
    document.head.appendChild(style);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            btn.classList.add('show');
        } else {
            btn.classList.remove('show');
        }
    });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
})();


/* -----------------------------------------------
   9. TYPING EFFECT (for hero heading on index.html)
   ----------------------------------------------- */
(function () {
    const heroH2 = document.querySelector('.hero-text h2');
    if (!heroH2) return;

    const texts = [
        'Web Developer & Problem Solver',
        'UI/UX Enthusiast',
        'Responsive Design Expert',
        'Freelancer for Hire'
    ];

    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const current = texts[textIndex];
        heroH2.textContent = isDeleting
            ? current.substring(0, charIndex--)
            : current.substring(0, charIndex++);

        let speed = isDeleting ? 60 : 100;

        if (!isDeleting && charIndex === current.length + 1) {
            isDeleting = true;
            speed = 1800; // Pause before deleting
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            speed = 400;
        }

        setTimeout(type, speed);
    }

    // Add cursor
    heroH2.style.borderRight = '2px solid #00d4ff';
    heroH2.style.paddingRight = '4px';
    heroH2.style.whiteSpace = 'nowrap';
    heroH2.style.overflow = 'hidden';
    heroH2.style.display = 'inline-block';

    type();
})();


/* -----------------------------------------------
   10. CURSOR GLOW EFFECT (subtle neon dot)
   ----------------------------------------------- */
(function () {
    // Only on desktop
    if (window.innerWidth < 900) return;

    const cursor = document.createElement('div');
    cursor.id = 'cursor-glow';
    document.body.appendChild(cursor);

    const style = document.createElement('style');
    style.textContent = `
        #cursor-glow {
            pointer-events: none;
            position: fixed;
            width: 300px;
            height: 300px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(0,212,255,0.06) 0%, transparent 70%);
            transform: translate(-50%, -50%);
            z-index: 0;
            transition: opacity 0.3s;
        }
    `;
    document.head.appendChild(style);

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top  = e.clientY  + 'px';
    });
})();

console.log('%c👋 Built by Hafidh Omar', 'color:#00d4ff; font-size:14px; font-weight:bold;');
