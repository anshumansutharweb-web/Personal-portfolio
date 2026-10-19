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

  // 4. Accessible FAQ Accordion: Close other open questions when one is expanded
  const faqItems = document.querySelectorAll('.faq-item');
  if (faqItems.length > 0) {
    faqItems.forEach((item) => {
      item.addEventListener('toggle', () => {
        if (item.open) {
          faqItems.forEach((other) => {
            if (other !== item && other.open) {
              other.removeAttribute('open');
            }
          });
        }
      });
    });
  }

  // 5. Contact Form Validation, Anti-Spam & Mailto Generation
  const contactForm = document.getElementById('contactForm');
  const nameInput = document.getElementById('clientName');
  const emailInput = document.getElementById('clientEmail');
  const companyInput = document.getElementById('companyName');
  const typeSelect = document.getElementById('projectType');
  const budgetSelect = document.getElementById('budget');
  const timelineSelect = document.getElementById('timeline');
  const detailsInput = document.getElementById('details');
  const honeyInput = document.getElementById('formHoney');
  const submitBtn = document.getElementById('submitBtn');
  const statusEl = document.getElementById('status');

  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  const typeError = document.getElementById('typeError');
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
  if (detailsInput) {
    detailsInput.addEventListener('input', () => setFieldError(detailsInput, detailsError, ''));
  }

  // Strict email format validator (RFC-compliant clean regex)
  const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  if (contactForm) {
    let isSubmitting = false;

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Basic Anti-Spam Honeypot check
      if (honeyInput && honeyInput.value.trim() !== '') {
        console.warn('Spam detected via honeypot.');
        return;
      }

      if (isSubmitting) return;

      const name = nameInput ? nameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const company = companyInput ? companyInput.value.trim() : '';
      const type = typeSelect ? typeSelect.value : '';
      const budget = budgetSelect && budgetSelect.value ? budgetSelect.value : 'Not specified / Flexible';
      const timeline = timelineSelect && timelineSelect.value ? timelineSelect.value : 'Flexible';
      const details = detailsInput ? detailsInput.value.trim() : '';

      let isValid = true;
      let firstInvalidEl = null;

      // Validate Name (required)
      if (!name || name.length < 2) {
        setFieldError(nameInput, nameError, 'Please provide your full name or company contact.');
        isValid = false;
        if (!firstInvalidEl) firstInvalidEl = nameInput;
      } else {
        setFieldError(nameInput, nameError, '');
      }

      // Validate Email (required + strict regex)
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

      // Validate Service Required (required)
      if (!type) {
        setFieldError(typeSelect, typeError, 'Please choose a primary service required.');
        isValid = false;
        if (!firstInvalidEl) firstInvalidEl = typeSelect;
      } else {
        setFieldError(typeSelect, typeError, '');
      }

      // Validate Project Description (required, min 10 chars)
      if (!details || details.length < 10) {
        setFieldError(detailsInput, detailsError, 'Please describe your project vision or requirements (at least 10 characters).');
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

      // Indicate loading state & prevent duplicate submission
      isSubmitting = true;
      if (submitBtn) {
        submitBtn.classList.add('is-loading');
        submitBtn.disabled = true;
      }

      if (statusEl) {
        statusEl.className = 'status-box active';
        statusEl.textContent = 'Preparing your project enquiry draft...';
      }

      // Construct Structured Mailto URI
      const subject = encodeURIComponent(`[Project Enquiry] ${type} - ${name}`);
      const bodyText =
`Hello AS Tech Studio,

I would like to discuss a project with you.

--------------------------------------------------
CLIENT & PROJECT DETAILS
--------------------------------------------------
Full Name        : ${name}
Email Address    : ${email}
Company / Entity : ${company ? company : 'Not provided'}
Service Required : ${type}
Budget Range     : ${budget}
Expected Timeline: ${timeline}

Project Description & Requirements:
${details}

--------------------------------------------------
Sent via AS Tech Studio Website (https://anshumansutharweb-web.github.io/Personal-portfolio/)`;

      const body = encodeURIComponent(bodyText);
      const recipient = 'anshumansuthar.web@gmail.com';
      const mailtoUrl = `mailto:${recipient}?subject=${subject}&body=${body}`;

      setTimeout(() => {
        // Reset loading state
        isSubmitting = false;
        if (submitBtn) {
          submitBtn.classList.remove('is-loading');
          submitBtn.disabled = false;
        }

        // Display transparent status messaging
        if (statusEl) {
          statusEl.className = 'status-box active success';
          statusEl.innerHTML = `
            <strong>✓ Enquiry Draft Prepared Successfully!</strong><br>
            Opening your default email application with your project details...<br>
            <div class="status-details-pre">${bodyText.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
            <div class="status-actions-row">
              <a class="btn-demo btn-demo-primary" href="${mailtoUrl}">Launch Email Client ↗</a>
              <button type="button" class="btn-copy-msg" id="copyMsgBtn">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                <span id="copyBtnText">Copy Details to Clipboard</span>
              </button>
            </div>
            <p style="margin-top:10px; font-size:11.5px; color:#cbd5e1;">
              If an email app doesn't open automatically, copy the details above and send directly to <strong>${recipient}</strong>.
            </p>
          `;

          // Handle Copy to Clipboard
          const copyBtn = document.getElementById('copyMsgBtn');
          const copyBtnText = document.getElementById('copyBtnText');
          if (copyBtn && copyBtnText) {
            copyBtn.addEventListener('click', async () => {
              try {
                await navigator.clipboard.writeText(bodyText);
                copyBtnText.textContent = '✓ Copied to Clipboard!';
                setTimeout(() => {
                  copyBtnText.textContent = 'Copy Details to Clipboard';
                }, 3000);
              } catch (err) {
                // Fallback for older browsers
                const tempTextArea = document.createElement('textarea');
                tempTextArea.value = bodyText;
                document.body.appendChild(tempTextArea);
                tempTextArea.select();
                document.execCommand('copy');
                document.body.removeChild(tempTextArea);
                copyBtnText.textContent = '✓ Copied!';
                setTimeout(() => {
                  copyBtnText.textContent = 'Copy Details to Clipboard';
                }, 3000);
              }
            });
          }
        }

        // Open email client via mailto
        try {
          window.location.href = mailtoUrl;
        } catch (err) {
          console.warn('Could not launch mailto client automatically:', err);
        }
      }, 500);
    });
  }
});