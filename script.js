
"use strict";

// AS Tech Studio — Website JavaScript

const toggle = document.getElementById("toggle");
const nav = document.getElementById("nav");
const year = document.getElementById("year");
const contactForm = document.getElementById("contactForm");
const status = document.getElementById("status");

const contactEmail = "anshumansuthar.web@gmail.com";

// Mobile navigation
if (toggle && nav) {
  toggle.setAttribute("aria-expanded", "false");

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");

    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });
}

// Automatic copyright year
if (year) {
  year.textContent = String(new Date().getFullYear());
}

// Project enquiry form
if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const nameField = document.getElementById("clientName");
    const emailField = document.getElementById("clientEmail");
    const typeField = document.getElementById("projectType");
    const detailsField = document.getElementById("details");

    // Check that all required fields exist
    if (!nameField || !emailField || !typeField || !detailsField) {
      if (status) {
        status.textContent =
          "The form could not be loaded correctly. Please email us directly.";
      }
      return;
    }

    const name = nameField.value.trim();
    const email = emailField.value.trim();
    const type = typeField.value.trim();
    const details = detailsField.value.trim();

    // Validate required fields
    if (!name || !email || !type || !details) {
      if (status) {
        status.textContent =
          "Please complete all fields before continuing.";
      }
      return;
    }

    // Validate email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      if (status) {
        status.textContent =
          "Please enter a valid email address.";
      }

      emailField.focus();
      return;
    }

    const subject = encodeURIComponent(
      `AS Tech Studio Project Enquiry: ${type}`
    );

    const body = encodeURIComponent(
      `Hello AS Tech Studio,

I would like to discuss a project.

Name: ${name}
Email: ${email}
Project type: ${type}

Project details:
${details}

Regards,
${name}`
    );

    if (status) {
      status.textContent =
        "Opening your email application. If it does not open, email us directly at " +
        contactEmail;
    }

    window.location.href =
      `mailto:${contactEmail}?subject=${subject}&body=${body}`;
  });
}
