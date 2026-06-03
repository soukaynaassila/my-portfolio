/**
 * SOUKAYNA ASSILA — PORTFOLIO 2026
 * Main JavaScript — Interactions, Animations & Utilities
 */

'use strict';

/* ══════════════════════════════════════════════════════════
   1. DOM READY
══════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initScrollReveal();
  initActiveNavLink();
  initSkillBars();
  initCounters();
  initRoleRotator();
  initProjectFilter();
  initContactForm();
  initSmoothScroll();
});

/* ══════════════════════════════════════════════════════════
   2. NAVBAR — scroll effect
══════════════════════════════════════════════════════════ */
function initNavbar() {
  const header = document.getElementById('header');
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run on load
}

/* ══════════════════════════════════════════════════════════
   3. MOBILE MENU
══════════════════════════════════════════════════════════ */
function initMobileMenu() {
  const toggle  = document.getElementById('menuToggle');
  const mobileNav = document.getElementById('mobileNav');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (!toggle || !mobileNav) return;

  const openMenu = () => {
    toggle.classList.add('open');
    mobileNav.classList.add('open');
    mobileNav.setAttribute('aria-hidden', 'false');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  const closeMenu = () => {
    toggle.classList.remove('open');
    mobileNav.classList.remove('open');
    mobileNav.setAttribute('aria-hidden', 'true');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  toggle.addEventListener('click', () => {
    const isOpen = toggle.classList.contains('open');
    isOpen ? closeMenu() : openMenu();
  });

  // Close on link click
  mobileLinks.forEach(link => link.addEventListener('click', closeMenu));

  // Close on outside click (Escape)
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
  });
}

/* ══════════════════════════════════════════════════════════
   4. SCROLL REVEAL — Intersection Observer
══════════════════════════════════════════════════════════ */
function initScrollReveal() {
  const targets = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // animate once
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  targets.forEach(el => observer.observe(el));
}

/* ══════════════════════════════════════════════════════════
   5. ACTIVE NAV LINK — section highlighting
══════════════════════════════════════════════════════════ */
function initActiveNavLink() {
  const navLinks   = document.querySelectorAll('.nav-link');
  const sections   = document.querySelectorAll('section[id]');

  const setActive = () => {
    const scrollY = window.scrollY + 100;

    sections.forEach(section => {
      const top    = section.offsetTop;
      const height = section.offsetHeight;
      const id     = section.getAttribute('id');

      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('data-section') === id) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', setActive, { passive: true });
  setActive();
}

/* ══════════════════════════════════════════════════════════
   6. SKILL BARS — animate on scroll
══════════════════════════════════════════════════════════ */
function initSkillBars() {
  const fills = document.querySelectorAll('.skill-fill');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el    = entry.target;
        const width = el.dataset.width || '0';
        // Small delay for stagger feel
        setTimeout(() => {
          el.style.width = width + '%';
        }, 150);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  fills.forEach(fill => {
    fill.style.width = '0';
    observer.observe(fill);
  });
}

/* ══════════════════════════════════════════════════════════
   7. ANIMATED COUNTERS
══════════════════════════════════════════════════════════ */
function initCounters() {
  const counters = document.querySelectorAll('.stat-number');
  if (!counters.length) return;

  const animateCounter = (el) => {
    const target   = parseInt(el.dataset.target, 10) || 0;
    const duration = 1800;
    const step     = 16; // ms per frame
    const totalSteps = Math.ceil(duration / step);
    let current = 0;

    const timer = setInterval(() => {
      current++;
      const progress = current / totalSteps;
      const eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = Math.round(eased * target);

      if (current >= totalSteps) {
        el.textContent = target;
        clearInterval(timer);
      }
    }, step);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

/* ══════════════════════════════════════════════════════════
   8. ROLE ROTATING TEXT
══════════════════════════════════════════════════════════ */
function initRoleRotator() {
  const words   = document.querySelectorAll('.role-word');
  const wrap    = document.querySelector('.role-rotating');
  if (!words.length || !wrap) return;

  let current = 0;
  let maxWidth = 0;

  // Pre-measure all words to set a stable container width
  words.forEach(w => {
    w.style.position = 'static';
    w.style.opacity  = '1';
    w.style.transform = 'none';
    maxWidth = Math.max(maxWidth, w.offsetWidth);
    w.style.position = '';
    w.style.opacity  = '';
    w.style.transform = '';
  });
  wrap.style.width = maxWidth + 'px';

  const rotate = () => {
    const current_el = words[current];
    current_el.classList.remove('active');
    current_el.classList.add('exit');

    setTimeout(() => {
      current_el.classList.remove('exit');
      current = (current + 1) % words.length;
      words[current].classList.add('active');
    }, 400);
  };

  setInterval(rotate, 2500);
}

/* ══════════════════════════════════════════════════════════
   9. PROJECT FILTER TABS
══════════════════════════════════════════════════════════ */
function initProjectFilter() {
  const filterBtns  = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active state
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filter = btn.dataset.filter;

      projectCards.forEach(card => {
        const categories = card.dataset.category || '';
        const show = filter === 'all' || categories.split(' ').includes(filter);

        if (show) {
          card.style.display = '';
          // Re-trigger reveal animation
          card.classList.remove('visible');
          requestAnimationFrame(() => {
            card.classList.add('visible');
          });
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ══════════════════════════════════════════════════════════
   10. CONTACT FORM — validation + feedback
══════════════════════════════════════════════════════════ */
function initContactForm() {
  const form        = document.getElementById('contactForm');
  const submitBtn   = document.getElementById('submitBtn');
  const formSuccess = document.getElementById('formSuccess');
  if (!form) return;

  const fields = {
    contactName:    { error: 'nameError',    validate: v => v.trim().length >= 2   ? '' : 'Please enter your name (min. 2 chars).' },
    contactEmail:   { error: 'emailError',   validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'Please enter a valid email address.' },
    contactSubject: { error: 'subjectError', validate: v => v.trim().length >= 3   ? '' : 'Subject must be at least 3 characters.' },
    contactMessage: { error: 'messageError', validate: v => v.trim().length >= 10  ? '' : 'Message must be at least 10 characters.' },
  };

  const showError = (id, msg) => {
    const el = document.getElementById(id);
    if (el) el.textContent = msg;
  };

  const clearErrors = () => {
    Object.values(fields).forEach(f => showError(f.error, ''));
  };

  // Live validation on blur
  Object.entries(fields).forEach(([id, cfg]) => {
    const input = document.getElementById(id);
    if (!input) return;
    input.addEventListener('blur', () => {
      const msg = cfg.validate(input.value);
      showError(cfg.error, msg);
    });
    input.addEventListener('input', () => {
      const msg = cfg.validate(input.value);
      showError(cfg.error, msg);
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors();

    let valid = true;
    Object.entries(fields).forEach(([id, cfg]) => {
      const input = document.getElementById(id);
      if (!input) return;
      const msg = cfg.validate(input.value);
      if (msg) {
        showError(cfg.error, msg);
        valid = false;
      }
    });

    if (!valid) return;

    // Simulate loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    await new Promise(resolve => setTimeout(resolve, 1800)); // Simulate network

    // Show success
    submitBtn.classList.remove('loading');
    submitBtn.disabled = false;
    form.reset();

    if (formSuccess) {
      formSuccess.hidden = false;
      setTimeout(() => { formSuccess.hidden = true; }, 5000);
    }
  });
}

/* ══════════════════════════════════════════════════════════
   11. SMOOTH SCROLL — for all anchor links
══════════════════════════════════════════════════════════ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      const headerHeight = document.getElementById('header')?.offsetHeight || 72;
      const top = target.getBoundingClientRect().top + window.scrollY - headerHeight;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}
