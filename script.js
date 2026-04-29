document.addEventListener('DOMContentLoaded', () => {

    /* ── Custom cursor ── */
    const cursorDot = document.getElementById('cursorDot');
    if (cursorDot && window.matchMedia('(pointer:fine)').matches) {
        document.addEventListener('mousemove', e => {
            cursorDot.style.left = e.clientX + 'px';
            cursorDot.style.top  = e.clientY + 'px';
        });
        document.querySelectorAll('a, button, .tech-box, .proj-card, .stat-box, .edu-card').forEach(el => {
            el.addEventListener('mouseenter', () => cursorDot.style.transform = 'translate(-50%,-50%) scale(2)');
            el.addEventListener('mouseleave', () => cursorDot.style.transform = 'translate(-50%,-50%) scale(1)');
        });
    } else if (cursorDot) {
        cursorDot.style.display = 'none';
    }

    /* ── Navbar scroll class ── */
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });

    /* ── PILL NAV: floating blob that follows hover / active section ── */
    const blob          = document.getElementById('navBlob');
    const navItemsWrap  = document.getElementById('navItemsWrap');
    const navItems      = document.querySelectorAll('.nav-item');

    function moveBlob(el) {
        blob.style.opacity = '1';
        blob.style.width   = el.offsetWidth + 'px';
        blob.style.left    = el.offsetLeft  + 'px';
    }

    navItems.forEach(item => {
        item.addEventListener('mouseenter', () => moveBlob(item));
    });

    navItemsWrap.addEventListener('mouseleave', () => {
        const active = navItemsWrap.querySelector('.nav-item.active');
        if (active) moveBlob(active);
        else blob.style.opacity = '0';
    });

    /* ── Active section tracking (updates blob + item color) ── */
    const sections = document.querySelectorAll('section[id]');

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const id = entry.target.id;
            navItems.forEach(item => {
                const isActive = item.dataset.sec === id;
                item.classList.toggle('active', isActive);
                if (isActive && !navItemsWrap.matches(':hover')) moveBlob(item);
            });
        });
    }, { threshold: 0.35 });

    sections.forEach(s => sectionObserver.observe(s));

    /* ── Mobile burger toggle ── */
    const burger    = document.getElementById('navBurger');
    const navMobile = document.getElementById('navMobile');

    burger.addEventListener('click', () => {
        navMobile.classList.toggle('open');
    });

    navMobile.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => navMobile.classList.remove('open'));
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
    const staggerParents = document.querySelectorAll('.skill-pills, .tech-grid, .projects-grid, .about-stats-grid');
    staggerParents.forEach(parent => {
        parent.querySelectorAll('.reveal, .tech-box').forEach((el, i) => {
            el.style.transitionDelay = `${i * 70}ms`;
        });
    });

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.07, rootMargin: '0px 0px -30px 0px' });

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

});
