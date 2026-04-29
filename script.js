document.addEventListener('DOMContentLoaded', () => {

    /* ── Custom cursor ── */
    const cursorDot = document.getElementById('cursorDot');
    if (cursorDot && window.matchMedia('(pointer:fine)').matches) {
        document.addEventListener('mousemove', e => {
            cursorDot.style.left = e.clientX + 'px';
            cursorDot.style.top  = e.clientY + 'px';
        });
        document.querySelectorAll('a, button, .skill-pill, .proj-card, .stat-box').forEach(el => {
            el.addEventListener('mouseenter', () => cursorDot.style.transform = 'translate(-50%,-50%) scale(2)');
            el.addEventListener('mouseleave', () => cursorDot.style.transform = 'translate(-50%,-50%) scale(1)');
        });
    } else if (cursorDot) {
        cursorDot.style.display = 'none';
    }

    /* ── Navbar scroll class ── */
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });

    /* ── Hamburger menu ── */
    const hamburger = document.getElementById('hamburger');
    const navLinks  = document.getElementById('navLinks');
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => navLinks.classList.remove('open'));
    });

    /* ── Typing animation ── */
    const typedEl = document.getElementById('typed-role');
    const phrases = ['Full-Stack Developer', 'AI Engineer', 'Flutter Developer', 'Problem Solver'];
    let pi = 0, ci = 0, deleting = false;

    function type() {
        const phrase = phrases[pi];
        if (!deleting) {
            typedEl.textContent = phrase.slice(0, ++ci);
            if (ci === phrase.length) { deleting = true; setTimeout(type, 2000); return; }
        } else {
            typedEl.textContent = phrase.slice(0, --ci);
            if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; }
        }
        setTimeout(type, deleting ? 55 : 95);
    }
    setTimeout(type, 800);

    /* ── Scroll reveal with stagger ── */
    const staggerParents = document.querySelectorAll('.skill-pills, .projects-grid, .about-stats-grid');
    staggerParents.forEach(parent => {
        parent.querySelectorAll('.reveal').forEach((el, i) => {
            el.style.transitionDelay = `${i * 75}ms`;
        });
    });

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    /* ── Counter animation ── */
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el     = entry.target;
            const target = +el.dataset.target;
            const suffix = el.dataset.suffix || '';
            let count = 0;
            const step = Math.ceil(target / 45);
            const interval = setInterval(() => {
                count = Math.min(count + step, target);
                el.textContent = count + suffix;
                if (count >= target) clearInterval(interval);
            }, 35);
            counterObserver.unobserve(el);
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-n').forEach(el => counterObserver.observe(el));

    /* ── Smooth scroll ── */
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            const href = a.getAttribute('href');
            if (href === '#') return;
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    /* ── Active nav link on scroll ── */
    const sections = document.querySelectorAll('section[id]');
    const navAnchors = document.querySelectorAll('nav a');
    const activeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navAnchors.forEach(a => a.style.color = '');
                const active = document.querySelector(`nav a[href="#${entry.target.id}"]`);
                if (active) active.style.color = 'var(--violet)';
            }
        });
    }, { threshold: 0.4 });
    sections.forEach(s => activeObserver.observe(s));

});
