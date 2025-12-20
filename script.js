
// Typing effect for hero subtitle
const roles = [
    "AI Engineering Lead",
    "AI Consultant",
    "Product Engineer",
    "Software Architect",
    "Transformational Leader & Mentor",
    "Tech Community Mentor"
];

const typingElement = document.getElementById("typing-text");
const cursorElement = document.querySelector(".cursor");

let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;

function type() {
    const currentRole = roles[roleIndex];
    const displayedText = currentRole.substring(0, charIndex);

    if (typingElement) {
        typingElement.textContent = displayedText;
    }

    if (!isDeleting && charIndex < currentRole.length) {
        charIndex++;
        setTimeout(type, 90);
    } else if (!isDeleting && charIndex === currentRole.length) {
        setTimeout(() => {
            isDeleting = true;
            type();
        }, 1500);
    } else if (isDeleting && charIndex > 0) {
        charIndex--;
        setTimeout(type, 60);
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        setTimeout(type, 300);
    }
}

// Start typing effect
type();

// Theme toggle
const themeToggle = document.getElementById("theme-toggle");
const body = document.body;

// Initialize theme from localStorage
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "light") {
    body.classList.remove("dark-mode");
    body.classList.add("light-mode");
    if (themeToggle) themeToggle.textContent = "☀";
} else {
    body.classList.add("dark-mode");
    if (themeToggle) themeToggle.textContent = "☾";
}

if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        if (body.classList.contains("dark-mode")) {
            body.classList.remove("dark-mode");
            body.classList.add("light-mode");
            themeToggle.textContent = "☀";
            localStorage.setItem("theme", "light");
        } else {
            body.classList.remove("light-mode");
            body.classList.add("dark-mode");
            themeToggle.textContent = "☾";
            localStorage.setItem("theme", "dark");
        }
    });
}

// Mobile menu toggle behavior
const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');
const mobileThemeToggle = document.getElementById('mobile-theme-toggle');

function closeMobileMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.remove('open');
    mobileMenu.classList.add('closing');
    mobileMenu.setAttribute('aria-hidden', 'true');
    if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
    // after animation, ensure no pointer events
    setTimeout(() => {
        if (mobileMenu) mobileMenu.classList.remove('closing');
    }, 220);
    releaseFocusTrap();
}

function openMobileMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.add('open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    if (menuToggle) menuToggle.setAttribute('aria-expanded', 'true');
    activateFocusTrap(mobileMenu);
}

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        if (!mobileMenu) return;
        const isOpen = mobileMenu.getAttribute('aria-hidden') === 'false';
        if (isOpen) closeMobileMenu(); else openMobileMenu();
    });
}

// Close mobile menu when any link inside it is clicked
if (mobileMenu) {
    mobileMenu.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
            closeMobileMenu();
        });
    });
}

// Sync theme toggle inside mobile menu
if (mobileThemeToggle) {
    mobileThemeToggle.addEventListener('click', () => {
        if (themeToggle) themeToggle.click();
    });
}

// Close on resize or ESC
window.addEventListener('resize', () => {
    if (window.innerWidth > 720) {
        closeMobileMenu();
    }
});

window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMobileMenu();
    if (e.key === 'Tab') maintainFocus(e);
});

// Focus trap implementation
let lastFocusedElement = null;
let trapElements = [];

function activateFocusTrap(container) {
    lastFocusedElement = document.activeElement;
    trapElements = Array.from(container.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])')).filter(el => !el.disabled);
    if (trapElements.length) trapElements[0].focus();
}

function releaseFocusTrap() {
    trapElements = [];
    if (lastFocusedElement) lastFocusedElement.focus();
    lastFocusedElement = null;
}

function maintainFocus(e) {
    if (!mobileMenu) return;
    const isOpen = mobileMenu.getAttribute('aria-hidden') === 'false';
    if (!isOpen || trapElements.length === 0) return;
    const first = trapElements[0];
    const last = trapElements[trapElements.length - 1];
    if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
    }
}

// Scroll reveal for sections
const observersTargets = document.querySelectorAll(".fade-in");

const observer = new IntersectionObserver(
    entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    },
    {
        threshold: 0.15
    }
);

observersTargets.forEach(el => observer.observe(el));

// Dynamic year in footer
const yearSpan = document.getElementById("year");
if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
}
