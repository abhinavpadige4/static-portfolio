/* script.js — Vanilla ES6, no dependencies, progressive enhancement */
(function () {
  'use strict';

  /* ── 1. Mobile Nav Toggle ─────────────────────────────────────── */
  var navToggle = document.querySelector('.nav-toggle');
  var navMenu = document.querySelector('.nav-menu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      var expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      navMenu.classList.toggle('nav-open');
    });

    /* Close menu when a nav link is clicked (mobile) */
    var navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        navToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('nav-open');
      });
    });
  }

  /* ── 2. Smooth Scroll for Anchor Links ────────────────────────── */
  var anchorLinks = document.querySelectorAll('a[href^="#"]');
  anchorLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      var targetId = link.getAttribute('href');
      if (targetId === '#') return;
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        /* Update URL hash without jump */
        if (history.pushState) {
          history.pushState(null, '', targetId);
        }
      }
    });
  });

  /* ── 3. IntersectionObserver — Reveal Sections on Scroll ──────── */
  var revealSections = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && revealSections.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    revealSections.forEach(function (section) {
      observer.observe(section);
    });
  } else {
    /* Fallback: show everything immediately */
    revealSections.forEach(function (section) {
      section.classList.add('reveal-visible');
    });
  }

  /* ── 4. Contact Form Validation + Mailto Fallback ─────────────── */
  var form = document.getElementById('contact-form');

  if (form) {
    var nameInput = form.querySelector('#name');
    var emailInput = form.querySelector('#email');
    var messageInput = form.querySelector('#message');
    var errorContainer = form.querySelector('.form-errors');
    var successMessage = form.querySelector('.form-success');

    /* Validation rules */
    var validators = {
      name: function (value) {
        if (!value.trim()) return 'Please enter your name.';
        if (value.trim().length < 2) return 'Name must be at least 2 characters.';
        return '';
      },
      email: function (value) {
        if (!value.trim()) return 'Please enter your email address.';
        var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(value.trim())) return 'Please enter a valid email address.';
        return '';
      },
      message: function (value) {
        if (!value.trim()) return 'Please enter a message.';
        if (value.trim().length < 10) return 'Message must be at least 10 characters.';
        return '';
      }
    };

    function clearErrors() {
      if (errorContainer) {
        errorContainer.innerHTML = '';
        errorContainer.setAttribute('aria-live', 'polite');
      }
      if (successMessage) {
        successMessage.classList.remove('visible');
      }
      [nameInput, emailInput, messageInput].forEach(function (input) {
        if (input) {
          input.classList.remove('input-error');
          input.removeAttribute('aria-invalid');
        }
      });
    }

    function showError(field, message) {
      if (errorContainer) {
        var p = document.createElement('p');
        p.className = 'error-message';
        p.textContent = message;
        errorContainer.appendChild(p);
      }
      if (field) {
        field.classList.add('input-error');
        field.setAttribute('aria-invalid', 'true');
      }
    }

    function validateField(input, validatorFn) {
      var error = validatorFn(input.value);
      if (error) {
        showError(input, error);
        return false;
      }
      input.classList.remove('input-error');
      input.removeAttribute('aria-invalid');
      return true;
    }

    /* Real-time validation on blur */
    if (nameInput) {
      nameInput.addEventListener('blur', function () {
        validateField(nameInput, validators.name);
      });
    }
    if (emailInput) {
      emailInput.addEventListener('blur', function () {
        validateField(emailInput, validators.email);
      });
    }
    if (messageInput) {
      messageInput.addEventListener('blur', function () {
        validateField(messageInput, validators.message);
      });
    }

    /* Clear error on input */
    [nameInput, emailInput, messageInput].forEach(function (input) {
      if (input) {
        input.addEventListener('input', function () {
          input.classList.remove('input-error');
          input.removeAttribute('aria-invalid');
          if (errorContainer && errorContainer.children.length) {
            errorContainer.innerHTML = '';
          }
        });
      }
    });

    /* Form submission */
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      clearErrors();

      var isValid = true;

      if (nameInput) {
        if (!validateField(nameInput, validators.name)) isValid = false;
      }
      if (emailInput) {
        if (!validateField(emailInput, validators.email)) isValid = false;
      }
      if (messageInput) {
        if (!validateField(messageInput, validators.message)) isValid = false;
      }

      if (!isValid) {
        /* Focus first invalid field */
        var firstError = form.querySelector('.input-error');
        if (firstError) firstError.focus();
        return;
      }

      /* Build mailto URL */
      var name = nameInput ? nameInput.value.trim() : '';
      var email = emailInput ? emailInput.value.trim() : '';
      var message = messageInput ? messageInput.value.trim() : '';

      var subject = encodeURIComponent('Portfolio Contact from ' + name);
      var body = encodeURIComponent(
        'Name: ' + name + '\nEmail: ' + email + '\n\nMessage:\n' + message
      );
      var mailtoUrl = 'mailto:you@example.com?subject=' + subject + '&body=' + body;

      /* Open mail client */
      window.location.href = mailtoUrl;

      /* Show success message */
      if (successMessage) {
        successMessage.textContent =
          'Your email client should open shortly. If not, please email you@example.com directly.';
        successMessage.classList.add('visible');
      }

      /* Reset form */
      form.reset();
    });
  }

  /* ── 5. Sticky Header Shadow on Scroll ────────────────────────── */
  var header = document.querySelector('.site-header');
  if (header) {
    var scrollThreshold = 10;
    var ticking = false;

    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          if (window.scrollY > scrollThreshold) {
            header.classList.add('header-scrolled');
          } else {
            header.classList.remove('header-scrolled');
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ── 6. Active Nav Link Highlighting ──────────────────────────── */
  var sections = document.querySelectorAll('main section[id]');
  var navLinkMap = {};

  if (sections.length && navMenu) {
    var navAnchors = navMenu.querySelectorAll('a[href^="#"]');
    navAnchors.forEach(function (a) {
      var id = a.getAttribute('href').replace('#', '');
      navLinkMap[id] = a;
    });

    if ('IntersectionObserver' in window) {
      var sectionObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              var id = entry.target.id;
              Object.keys(navLinkMap).forEach(function (key) {
                navLinkMap[key].classList.remove('nav-active');
              });
              if (navLinkMap[id]) {
                navLinkMap[id].classList.add('nav-active');
              }
            }
          });
        },
        { threshold: 0.3, rootMargin: '-80px 0px -50% 0px' }
      );

      sections.forEach(function (section) {
        sectionObserver.observe(section);
      });
    }
  }
})();
