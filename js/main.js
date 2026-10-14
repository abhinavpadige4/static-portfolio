/* main.js — Akash Portfolio interactions */

(function () {
  'use strict';

  /* ── 1. IntersectionObserver: scroll-reveal ── */
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && revealEls.length) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    revealEls.forEach((el) => revealObserver.observe(el));
  } else {
    /* Fallback: show everything immediately */
    revealEls.forEach((el) => el.classList.add('visible'));
  }

  /* ── 2. Mobile nav toggle (hamburger) ── */
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      navToggle.classList.toggle('active', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    /* Close menu when a nav link is clicked */
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });

    /* Close menu on Escape key */
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ── 3. Active nav link highlight on scroll ── */
  const sections = document.querySelectorAll('section[id]');

  function updateActiveNav() {
    const scrollY = window.scrollY + 120;

    let currentId = '';
    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollY >= top && scrollY < top + height) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href && href === '#' + currentId) {
        link.classList.add('active');
      }
    });
  }

  let scrollTicking = false;
  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      window.requestAnimationFrame(() => {
        updateActiveNav();
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  }, { passive: true });

  /* Run once on load */
  updateActiveNav();

  /* ── 4. Contact form validation + fake submit ── */
  const contactForm = document.querySelector('#contact form');
  const formStatus = document.querySelector('.form-status');

  if (contactForm) {
    const fields = {
      name: contactForm.querySelector('#name'),
      email: contactForm.querySelector('#email'),
      message: contactForm.querySelector('#message')
    };

    /* Remove error state on input */
    Object.values(fields).forEach((field) => {
      if (field) {
        field.addEventListener('input', () => {
          field.classList.remove('error');
          const errorEl = field.parentElement.querySelector('.field-error');
          if (errorEl) errorEl.textContent = '';
        });
      }
    });

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let valid = true;

      /* Validate name */
      if (fields.name) {
        if (!fields.name.value.trim()) {
          fields.name.classList.add('error');
          const err = fields.name.parentElement.querySelector('.field-error');
          if (err) err.textContent = 'Please enter your name.';
          valid = false;
        }
      }

      /* Validate email */
      if (fields.email) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!fields.email.value.trim() || !emailPattern.test(fields.email.value.trim())) {
          fields.email.classList.add('error');
          const err = fields.email.parentElement.querySelector('.field-error');
          if (err) err.textContent = 'Please enter a valid email address.';
          valid = false;
        }
      }

      /* Validate message */
      if (fields.message) {
        if (!fields.message.value.trim() || fields.message.value.trim().length < 10) {
          fields.message.classList.add('error');
          const err = fields.message.parentElement.querySelector('.field-error');
          if (err) err.textContent = 'Message must be at least 10 characters.';
          valid = false;
        }
      }

      if (!valid) return;

      /* Fake submit: show success message */
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
      }

      setTimeout(() => {
        contactForm.reset();
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send Message';
        }
        if (formStatus) {
          formStatus.textContent = '✓ Message sent successfully! I\'ll get back to you soon.';
          formStatus.classList.add('show');
          formStatus.classList.remove('error-status');
          setTimeout(() => {
            formStatus.classList.remove('show');
          }, 5000);
        }
      }, 1200);
    });
  }

  /* ── 5. Header background on scroll ── */
  const header = document.querySelector('.site-header');
  if (header) {
    const headerScroll = () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', headerScroll, { passive: true });
    headerScroll();
  }

  /* ── 6. Smooth scroll for anchor links (fallback for older browsers) ── */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

})();
