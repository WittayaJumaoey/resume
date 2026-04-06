document.addEventListener('DOMContentLoaded', () => {

    /* ── Typed.js Animation ── */
    const typedTextElement = document.querySelector('#typed-text');
    if (typedTextElement) {
        new Typed('#typed-text', {
            strings: ['Developer', 'Admin Server', 'Freelancer'],
            typeSpeed: 60,
            backSpeed: 40,
            backDelay: 1500,
            loop: true,
            showCursor: true,
            cursorChar: '|'
        });
    }

    /* ── Nav scroll effect ── */
    const nav = document.querySelector('nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.style.background = 'rgba(15, 23, 42, 0.95)';
            nav.style.boxShadow = '0 5px 30px rgba(0,0,0,0.4)';
        } else {
            nav.style.background = 'rgba(15, 23, 42, 0.8)';
            nav.style.boxShadow = 'none';
        }
    });

    /* ── Smooth scroll ── */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
            }
        });
    });

    /* ── Reveal on scroll (IntersectionObserver — no jank) ── */
    const revealElements = document.querySelectorAll('.skill-card, .section-title, .glass');

    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.7s cubic-bezier(0.4,0,0.2,1), transform 0.7s cubic-bezier(0.4,0,0.2,1)';
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                /* Stagger cards that appear together */
                const delay = entry.target.classList.contains('skill-card') ? i * 80 : 0;
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

    revealElements.forEach(el => observer.observe(el));

    /* ── Stat counter animation ── */
    const statNumbers = document.querySelectorAll('.stat-number');
    const countObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const raw = el.textContent.trim();          // e.g. "3+" or "10+"
            const num = parseInt(raw);
            const suffix = raw.replace(/[0-9]/g, '');   // keep "+"

            if (isNaN(num)) return;

            let start = null;
            const duration = 1400;

            const step = (timestamp) => {
                if (!start) start = timestamp;
                const progress = Math.min((timestamp - start) / duration, 1);
                // Ease-out cubic
                const eased = 1 - Math.pow(1 - progress, 3);
                el.textContent = Math.floor(eased * num) + suffix;
                if (progress < 1) requestAnimationFrame(step);
                else el.textContent = num + suffix;
            };
            requestAnimationFrame(step);
            countObserver.unobserve(el);
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => countObserver.observe(el));

    /* ── Ability rows stagger on scroll ── */
    const abilityRows = document.querySelectorAll('.abilities-list > div > div');
    abilityRows.forEach(row => {
        row.style.opacity = '0';
        row.style.transform = 'translateX(-16px)';
        row.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });

    const abilityObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const idx = [...abilityRows].indexOf(entry.target);
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0)';
                }, idx * 70);
                abilityObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    abilityRows.forEach(row => abilityObserver.observe(row));

    /* ── Tilt effect on skill cards ── */
    document.querySelectorAll('.skill-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            const tiltX = (y / rect.height) * 10;
            const tiltY = -(x / rect.width) * 10;
            card.style.transform = `translateY(-12px) scale(1.04) perspective(600px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

});
