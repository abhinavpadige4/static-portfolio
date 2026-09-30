document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('header');
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelectorAll('nav a');
  const contactForm = document.querySelector('#contact form');
  const formFields = contactForm.querySelectorAll('input, textarea');
  const formErrors = {};
  const ariaLiveRegion = document.createElement('div');
  ariaLiveRegion.setAttribute('aria-live', 'assertive');
  ariaLiveRegion.style.position = 'absolute';
  ariaLiveRegion.style.clip = 'rect(0 0 0 0)';
  contactForm.appendChild(ariaLiveRegion);

  navToggle.addEventListener('click', () => {
    header.classList.toggle('nav-open');
    navToggle.setAttribute('aria-expanded', header.classList.contains('nav-open'));
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      header.classList.remove('nav-open');
      navToggle.setAttribute('aria-expanded', false);
    });
  });

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
      });
    });
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
  });

  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    formFields.forEach(field => {
      field.classList.remove('error');
      field.nextElementSibling?.remove();
      delete formErrors[field.name];
    });

    let isValid = true;
    formFields.forEach(field => {
      if (!field.value.trim()) {
        isValid = false;
        formErrors[field.name] = `${field.name} is required.`;
      }
    });

    if (!isValid) {
      Object.keys(formErrors).forEach(fieldName => {
        const field = contactForm.querySelector(`[name="${fieldName}"]`);
        field.classList.add('error');
        const errorElement = document.createElement('span');
        errorElement.textContent = formErrors[fieldName];
        errorElement.style.color = 'red';
        field.insertAdjacentElement('afterend', errorElement);
      });
      ariaLiveRegion.textContent = 'There are errors in the form. Please correct them.';
    } else {
      ariaLiveRegion.textContent = 'Form submitted successfully!';
      contactForm.reset();
    }
  });
});