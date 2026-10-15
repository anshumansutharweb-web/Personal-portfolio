```javascript
const toggle = document.getElementById("toggle");
const nav = document.getElementById("nav");
const year = document.getElementById("year");
const contactForm = document.getElementById("contactForm");
const status = document.getElementById("status");

const contactEmail = "anshumansuthar.web@gmail.com";

// Mobile navigation
if (toggle && nav) {
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
}

// Automatic copyright year
if (year) {
  year.textContent = new Date().getFullYear();
}

// Project enquiry form
if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document.getElementById("clientName").value.trim();
    const email = document.getElementById("clientEmail").value.trim();
    const type = document.getElementById("projectType").value;
    const details = document.getElementById("details").value.trim();

    if (!name || !email || !type || !details) {
      if (status) {
        status.textContent = "Please complete all fields before continuing.";
      }
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
        "Your email application should open with the project enquiry prepared.";
    }

    window.location.href =
      `mailto:${contactEmail}?subject=${subject}&body=${body}`;
  });
}
```
