/**
 * AS TECH STUDIO — CLIENT SCRIPT
 * Handles mobile navigation, header scroll effects, dynamic year,
 * client-side form validation, and structured mailto generation.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Navigation & Accessible Toggle
  const toggleBtn = document.getElementById('toggle');
  const navMenu = document.getElementById('nav');
  const header = document.getElementById('header');

  if (toggleBtn && navMenu) {
    const toggleNav = (forceState) => {
      const isExpanded = forceState !== undefined ? forceState : !navMenu.classList.contains('open');
      navMenu.classList.toggle('open', isExpanded);
      toggleBtn.classList.toggle('open', isExpanded);
      toggleBtn.setAttribute('aria-expanded', String(isExpanded));
    };

    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleNav();
    });

    // Close mobile nav on link click
    navMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        toggleNav(false);
      });
    });

    // Close mobile nav on outside click
    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('open') && !navMenu.contains(e.target) && !toggleBtn.contains(e.target)) {
        toggleNav(false);
      }
    });

    // Close mobile nav on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) {
        toggleNav(false);
        toggleBtn.focus();
      }
    });
  }

  // 2. Header Elevation on Scroll
  if (header) {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // 3. Dynamic Footer Copyright Year
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // 4. Contact Form Validation & Mailto Generation
  const contactForm = document.getElementById('contactForm');
  const nameInput = document.getElementById('clientName');
  const emailInput = document.getElementById('clientEmail');
  const typeSelect = document.getElementById('projectType');
  const platformSelect = document.getElementById('platform');
  const budgetSelect = document.getElementById('budget');
  const detailsInput = document.getElementById('details');
  const statusEl = document.getElementById('status');

  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  const typeError = document.getElementById('typeError');
  const platformError = document.getElementById('platformError');
  const budgetError = document.getElementById('budgetError');
  const detailsError = document.getElementById('detailsError');

  // Helper to show/hide errors
  const setFieldError = (inputEl, errorEl, message) => {
    if (!inputEl) return;
    const formGroup = inputEl.closest('.form-group');
    if (message) {
      if (formGroup) formGroup.classList.add('has-error');
      if (errorEl) errorEl.textContent = message;
      inputEl.setAttribute('aria-invalid', 'true');
    } else {
      if (formGroup) formGroup.classList.remove('has-error');
      if (errorEl) errorEl.textContent = '';
      inputEl.removeAttribute('aria-invalid');
    }
  };

  // Real-time error clearing as user interacts
  if (nameInput) {
    nameInput.addEventListener('input', () => setFieldError(nameInput, nameError, ''));
  }
  if (emailInput) {
    emailInput.addEventListener('input', () => setFieldError(emailInput, emailError, ''));
  }
  if (typeSelect) {
    typeSelect.addEventListener('change', () => setFieldError(typeSelect, typeError, ''));
  }
  if (platformSelect) {
    platformSelect.addEventListener('change', () => setFieldError(platformSelect, platformError, ''));
  }
  if (budgetSelect) {
    budgetSelect.addEventListener('change', () => setFieldError(budgetSelect, budgetError, ''));
  }
  if (detailsInput) {
    detailsInput.addEventListener('input', () => setFieldError(detailsInput, detailsError, ''));
  }

  // Strict email format validator (RFC-compliant clean regex)
  const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = nameInput ? nameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const type = typeSelect ? typeSelect.value : '';
      const platform = platformSelect ? platformSelect.value : '';
      const budget = budgetSelect ? budgetSelect.value : '';
      const details = detailsInput ? detailsInput.value.trim() : '';

      let isValid = true;
      let firstInvalidEl = null;

      // Validate Name
      if (!name || name.length < 2) {
        setFieldError(nameInput, nameError, 'Please provide your name or company name.');
        isValid = false;
        if (!firstInvalidEl) firstInvalidEl = nameInput;
      } else {
        setFieldError(nameInput, nameError, '');
      }

      // Validate Email
      if (!email) {
        setFieldError(emailInput, emailError, 'Please provide your email address.');
        isValid = false;
        if (!firstInvalidEl) firstInvalidEl = emailInput;
      } else if (!isValidEmail(email)) {
        setFieldError(emailInput, emailError, 'Please enter a valid email format (e.g. name@company.com).');
        isValid = false;
        if (!firstInvalidEl) firstInvalidEl = emailInput;
      } else {
        setFieldError(emailInput, emailError, '');
      }

      // Validate Service Category
      if (!type) {
        setFieldError(typeSelect, typeError, 'Please choose a primary service category.');
        isValid = false;
        if (!firstInvalidEl) firstInvalidEl = typeSelect;
      } else {
        setFieldError(typeSelect, typeError, '');
      }

      // Validate Target Platform
      if (!platform) {
        setFieldError(platformSelect, platformError, 'Please choose a target platform for your project.');
        isValid = false;
        if (!firstInvalidEl) firstInvalidEl = platformSelect;
      } else {
        setFieldError(platformSelect, platformError, '');
      }

      // Validate Budget
      if (!budget) {
        setFieldError(budgetSelect, budgetError, 'Please choose an approximate investment range.');
        isValid = false;
        if (!firstInvalidEl) firstInvalidEl = budgetSelect;
      } else {
        setFieldError(budgetSelect, budgetError, '');
      }

      // Validate Details
      if (!details || details.length < 10) {
        setFieldError(detailsInput, detailsError, 'Please share at least a sentence or two (10+ characters) about your project vision.');
        isValid = false;
        if (!firstInvalidEl) firstInvalidEl = detailsInput;
      } else {
        setFieldError(detailsInput, detailsError, '');
      }

      if (!isValid) {
        if (statusEl) {
          statusEl.className = 'status-box active error';
          statusEl.textContent = 'Please complete the highlighted required fields above.';
        }
        if (firstInvalidEl) {
          firstInvalidEl.focus();
        }
        return;
      }

      // Clear any previous error status
      if (statusEl) {
        statusEl.className = 'status-box active success';
      }

      // Construct Structured Mailto URI
      const subject = encodeURIComponent(`[Project Enquiry] ${type} - ${name}`);
      const bodyText =
`Hello AS Tech Studio,

I would like to discuss a project with you.

--------------------------------------------------
CLIENT & PROJECT OVERVIEW
--------------------------------------------------
Name / Company   : ${name}
Email Address    : ${email}
Service Category : ${type}
Target Platform  : ${platform}
Estimated Budget : ${budget}

Project Goals, Scope & Timeline:
${details}

--------------------------------------------------
Sent via AS Tech Studio Website (https://anshumansutharweb-web.github.io/Personal-portfolio/)`;

      const body = encodeURIComponent(bodyText);
      const recipient = 'anshumansuthar.web@gmail.com';
      const mailtoUrl = `mailto:${recipient}?subject=${subject}&body=${body}`;

      // Show user-friendly feedback
      if (statusEl) {
        statusEl.innerHTML = `
          <strong>✓ Enquiry Prepared Successfully!</strong><br>
          Opening your email application now... If it doesn't open automatically,
          <a href="${mailtoUrl}">click here to launch your email client</a> or send directly to
          <strong>${recipient}</strong>.
        `;
      }

      // Open email client
      try {
        window.location.href = mailtoUrl;
      } catch (err) {
        console.warn('Could not trigger mailto automatically:', err);
      }
    });
  }
});