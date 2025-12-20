// Typing effect for hero subtitle
const roles = [
    "AI Engineering Lead",
    "Product Consultant",
    "Software Architect",
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
