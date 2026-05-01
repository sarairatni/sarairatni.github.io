document.addEventListener('DOMContentLoaded', () => {

    /* ══════════════════════════════════════
       CUSTOM CURSOR — dot (instant) + ring (lerp lag)
    ══════════════════════════════════════ */
    const dot  = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    const isTouch = !window.matchMedia('(pointer:fine)').matches;

    if (isTouch) {
        dot.style.display  = 'none';
        ring.style.display = 'none';
    } else {
        let mx = window.innerWidth / 2;
        let my = window.innerHeight / 2;
        let rx = mx, ry = my;

        /* Dot follows instantly */
        document.addEventListener('mousemove', e => {
            mx = e.clientX; my = e.clientY;
            dot.style.left = mx + 'px';
            dot.style.top  = my + 'px';
        });

        /* Ring follows with LERP — the "lag" effect */
        const LERP = 0.095;
        (function animateRing() {
            rx += (mx - rx) * LERP;
            ry += (my - ry) * LERP;
            ring.style.left = rx + 'px';
            ring.style.top  = ry + 'px';
            requestAnimationFrame(animateRing);
        })();

        /* Ring reacts to interactive elements */
        document.querySelectorAll('a, button, .tech-box, .proj-card, .stat-box, .edu-card').forEach(el => {
            el.addEventListener('mouseenter', () => ring.classList.add('ring-hover'));
            el.addEventListener('mouseleave', () => ring.classList.remove('ring-hover'));
        });

        /* Click pulse */
        document.addEventListener('mousedown', () => {
            ring.classList.add('ring-click');
            dot.style.width = '4px'; dot.style.height = '4px';
        });
        document.addEventListener('mouseup', () => {
            ring.classList.remove('ring-click');
            dot.style.width = ''; dot.style.height = '';
        });

        /* Detect dark sections to invert cursor color */
        const darkSections = document.querySelectorAll('section.dark');
        const cursorColorObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) document.body.classList.add('on-dark');
                else {
                    /* only remove if no dark section is visible */
                    const anyDark = [...darkSections].some(s => {
                        const r = s.getBoundingClientRect();
                        return r.top < window.innerHeight / 2 && r.bottom > window.innerHeight / 2;
                    });
                    if (!anyDark) document.body.classList.remove('on-dark');
                }
            });
        }, { threshold: 0.3 });
        darkSections.forEach(s => cursorColorObserver.observe(s));
    }

    /* ══════════════════════════════════════
       SECTION STICKY TOPS
       Short sections (≤ 100vh): top:0 — freeze when fully in view.
       Tall sections (> 100vh):  top = vh - height — scroll through all
       content first, freeze only when section bottom hits viewport bottom.
    ══════════════════════════════════════ */
    function setSectionTops() {
        const vh = window.innerHeight;
        document.querySelectorAll('main > section').forEach(section => {
            const h = section.offsetHeight;
            section.style.top = h > vh ? `${vh - h}px` : '0px';
        });
    }
    setSectionTops();
    window.addEventListener('resize', setSectionTops, { passive: true });

    /* ══════════════════════════════════════
       SCROLL PROGRESS BAR
    ══════════════════════════════════════ */
    const progressBar = document.getElementById('scrollProgress');
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
        progressBar.style.width = (scrolled * 100) + '%';
    }, { passive: true });

    /* ══════════════════════════════════════
       NAVBAR — scroll class + pill blob
    ══════════════════════════════════════ */
    const navbar       = document.getElementById('navbar');
    const blob         = document.getElementById('navBlob');
    const navItemsWrap = document.getElementById('navItemsWrap');
    const navItems     = document.querySelectorAll('.nav-item');

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });

    function moveBlob(el) {
        blob.style.opacity = '1';
        blob.style.width   = el.offsetWidth + 'px';
        blob.style.left    = el.offsetLeft  + 'px';
    }

    navItems.forEach(item => item.addEventListener('mouseenter', () => moveBlob(item)));
    navItemsWrap.addEventListener('mouseleave', () => {
        const active = navItemsWrap.querySelector('.nav-item.active');
        if (active) moveBlob(active); else blob.style.opacity = '0';
    });

    /* ══════════════════════════════════════
       ACTIVE SECTION — updates nav + blob
    ══════════════════════════════════════ */
    const sections = document.querySelectorAll('section[id]');

    const sectionObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const id = entry.target.id;
            navItems.forEach(item => {
                const active = item.dataset.sec === id;
                item.classList.toggle('active', active);
                if (active && !navItemsWrap.matches(':hover')) moveBlob(item);
            });
        });
    }, { threshold: 0.35 });

    sections.forEach(s => sectionObserver.observe(s));

    /* ══════════════════════════════════════
       MOBILE BURGER
    ══════════════════════════════════════ */
    const burger    = document.getElementById('navBurger');
    const navMobile = document.getElementById('navMobile');
    burger.addEventListener('click', () => navMobile.classList.toggle('open'));
    navMobile.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => navMobile.classList.remove('open'));
    });

    /* ══════════════════════════════════════
       TYPING ANIMATION
    ══════════════════════════════════════ */
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
        setTimeout(type, deleting ? 50 : 90);
    }
    setTimeout(type, 800);

    /* ══════════════════════════════════════
       SCROLL REVEAL — stagger in groups
    ══════════════════════════════════════ */
    document.querySelectorAll('.tech-grid, .projects-grid, .about-stats-grid').forEach(parent => {
        parent.querySelectorAll('.reveal, .tech-box').forEach((el, i) => {
            el.style.transitionDelay = `${i * 65}ms`;
        });
    });

    const revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.07, rootMargin: '0px 0px -30px 0px' });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    /* ══════════════════════════════════════
       COUNTER ANIMATION
    ══════════════════════════════════════ */
    const counterObserver = new IntersectionObserver(entries => {
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
            }, 32);
            counterObserver.unobserve(el);
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-n').forEach(el => counterObserver.observe(el));

    /* ══════════════════════════════════════
       SMOOTH SCROLL
    ══════════════════════════════════════ */
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
