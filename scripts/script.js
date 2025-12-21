// Useful Resources: fetch resources.json and render resource cards
async function loadResources(jsonUrl = 'scripts/data/resources.json') {
    const container = document.getElementById('resources-grid');
    if (!container) return;
    try {
        container.textContent = 'Loading resources…';
        const res = await fetch(jsonUrl);
        if (!res.ok) throw new Error('Failed to fetch resources');
        const resources = await res.json();
        if (!Array.isArray(resources) || resources.length === 0) {
            container.textContent = 'No resources found.';
            return;
        }
        container.innerHTML = '';
        resources.forEach(item => {
            const card = document.createElement('div');
            card.className = 'resource-card';

            const title = document.createElement('h3');
            title.textContent = item.title;
            card.appendChild(title);

            const desc = document.createElement('p');
            desc.textContent = item.description;
            card.appendChild(desc);

            if (item.tags && item.tags.length) {
                const meta = document.createElement('div');
                meta.className = 'resource-meta';
                item.tags.forEach(tag => {
                    const tagEl = document.createElement('span');
                    tagEl.className = 'resource-tag';
                    tagEl.textContent = tag;
                    meta.appendChild(tagEl);
                });
                card.appendChild(meta);
            }

            const actions = document.createElement('div');
            actions.className = 'resource-actions';
            const downloadBtn = document.createElement('a');
            downloadBtn.className = 'btn primary';
            downloadBtn.textContent = 'Download';
            downloadBtn.href = item.link;
            downloadBtn.target = '_blank';
            downloadBtn.rel = 'noopener noreferrer';
            downloadBtn.setAttribute('aria-label', `Download ${item.title}`);
            actions.appendChild(downloadBtn);
            card.appendChild(actions);

            container.appendChild(card);
        });
    } catch (err) {
        container.textContent = 'Could not load resources.';
        console.error(err);
    }
}

// Load resources on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    loadResources();
});

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

// Initialize theme from localStorage and wire icon swapping
const savedTheme = localStorage.getItem("theme");
const moonIcon = themeToggle ? themeToggle.querySelector('.theme-moon') : null;
const sunIcon = themeToggle ? themeToggle.querySelector('.theme-sun') : null;
function showIcon(isLight) {
    if (moonIcon) moonIcon.style.display = isLight ? 'none' : '';
    if (sunIcon) sunIcon.style.display = isLight ? '' : 'none';
}

if (savedTheme === "light") {
    body.classList.remove("dark-mode");
    body.classList.add("light-mode");
    if (themeToggle) themeToggle.setAttribute('aria-pressed', 'false');
    showIcon(true);
} else {
    body.classList.add("dark-mode");
    if (themeToggle) themeToggle.setAttribute('aria-pressed', 'true');
    showIcon(false);
}

if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        const isDark = body.classList.contains("dark-mode");
        if (isDark) {
            body.classList.remove("dark-mode");
            body.classList.add("light-mode");
            themeToggle.setAttribute('aria-pressed', 'false');
            localStorage.setItem("theme", "light");
            showIcon(true);
        } else {
            body.classList.remove("light-mode");
            body.classList.add("dark-mode");
            themeToggle.setAttribute('aria-pressed', 'true');
            localStorage.setItem("theme", "dark");
            showIcon(false);
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
    if (menuToggle) {
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.classList.remove('open');
    }
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
    if (menuToggle) {
        menuToggle.setAttribute('aria-expanded', 'true');
        menuToggle.classList.add('open');
    }
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

// Featured work: fetch top repositories and render cards
async function loadFeaturedWork(username = 'riteshsingh84', limit = 6) {
    const container = document.getElementById('featured-grid');
    if (!container) return;
    try {
        container.textContent = 'Loading featured projects…';

        // Fetch public repos
        const res = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`);
        if (!res.ok) throw new Error('GitHub API error');
        const repos = await res.json();

        // Sort by stargazers_count desc
        repos.sort((a, b) => b.stargazers_count - a.stargazers_count);

        const featured = repos.slice(0, limit);
        container.innerHTML = '';

        if (featured.length === 0) {
            container.textContent = 'No public repositories found.';
            return;
        }

        featured.forEach(repo => {
            const card = document.createElement('div');
            card.className = 'featured-card';
            card.style.position = 'relative';

            const title = document.createElement('h4');
            const link = document.createElement('a');
            link.href =  repo.homepage ? repo.homepage : repo.html_url;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.textContent = repo.name;
            title.appendChild(link);

            const desc = document.createElement('p');
            desc.textContent = repo.description || '';
            desc.title = repo.description || '';

            // Show full description on click/hover only if more than 6 lines
            let expanded = false;
            let expandedDiv = null;
            // Helper to count lines in a string (approximate)
            function countLines(str) {
                if (!str) return 0;
                // Assume about 80 chars per line for this card
                return Math.ceil(str.length / 80);
            }
            const descLineCount = countLines(repo.description);
            if (descLineCount > 6) {
                function showFullDesc(e) {
                    if (expanded) return;
                    expanded = true;
                    expandedDiv = document.createElement('div');
                    expandedDiv.className = 'featured-card p expanded';
                    expandedDiv.textContent = repo.description || '';
                    expandedDiv.style.position = 'absolute';
                    expandedDiv.style.left = '0';
                    expandedDiv.style.right = '0';
                    expandedDiv.style.top = desc.offsetTop + desc.offsetHeight + 8 + 'px';
                    expandedDiv.style.background = 'rgba(20,24,40,0.98)';
                    expandedDiv.style.color = '#fff';
                    expandedDiv.style.padding = '18px 16px';
                    expandedDiv.style.borderRadius = '10px';
                    expandedDiv.style.zIndex = '100';
                    expandedDiv.style.boxShadow = '0 8px 32px rgba(0,0,0,0.28)';
                    expandedDiv.style.minWidth = '220px';
                    expandedDiv.style.maxWidth = '440px';
                    expandedDiv.style.fontSize = '1rem';
                    expandedDiv.style.lineHeight = '1.6';
                    expandedDiv.style.cursor = 'pointer';
                    expandedDiv.addEventListener('mouseleave', hideFullDesc);
                    expandedDiv.addEventListener('click', hideFullDesc);
                    card.appendChild(expandedDiv);
                }
                function hideFullDesc() {
                    if (expandedDiv && expandedDiv.parentNode) expandedDiv.parentNode.removeChild(expandedDiv);
                    expanded = false;
                }
                desc.addEventListener('mouseenter', showFullDesc);
                desc.addEventListener('mouseleave', hideFullDesc);
                desc.addEventListener('click', function(e) {
                    if (!expanded) showFullDesc(e);
                    else hideFullDesc();
                });
            }

            const meta = document.createElement('div');
            meta.className = 'featured-meta';

            const lang = document.createElement('span');
            const langDot = document.createElement('span');
            langDot.className = 'lang-dot';
            const langName = document.createElement('span');
            langName.textContent = repo.language || '';

            // Simple mapping for a few common languages
            const langColors = {
                'JavaScript': '#f1e05a',
                'TypeScript': '#3178c6',
                'Python': '#3572A5',
                'C#': '#178600',
                'C++': '#f34b7d',
                'Java': '#b07219',
                'HTML': '#e34c26',
                'CSS': '#563d7c',
            };

            const color = langColors[repo.language] || '#9aa4b2';
            langDot.style.background = color;
            lang.appendChild(langDot);
            lang.appendChild(langName);

            const stars = document.createElement('span');
            stars.className = 'featured-stars';
            stars.innerHTML = `⭐ ${repo.stargazers_count}`;

            meta.appendChild(lang);
            meta.appendChild(stars);

            card.appendChild(title);
            if (desc.textContent) card.appendChild(desc);
            card.appendChild(meta);

            // Add Learn more button at bottom right
            const actions = document.createElement('div');
            actions.className = 'project-actions';
            actions.style.marginTop = 'auto';
            actions.style.display = 'flex';
            actions.style.justifyContent = 'flex-end';
            actions.style.alignItems = 'flex-end';

            const learnMore = document.createElement('a');
            learnMore.className = 'btn primary';
            learnMore.textContent = 'Learn more';
            learnMore.href = repo.homepage ? repo.homepage : repo.html_url;
            learnMore.target = '_blank';
            learnMore.rel = 'noopener noreferrer';
            learnMore.setAttribute('aria-label', `Learn more about ${repo.name}`);

            actions.appendChild(learnMore);
            card.appendChild(actions);

            container.appendChild(card);
        });

    } catch (err) {
        container.textContent = 'Could not load featured projects.';
        console.error(err);
    }
}

// Load featured work on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    loadFeaturedWork();
});

// Achievements: fetch badges markdown and render badge cards
async function loadAchievements(mdUrl = 'https://raw.githubusercontent.com/riteshsingh84/CopilotLearningPath/main/docs/badges/Ritesh-Badges.md') {
    const container = document.getElementById('achievements-grid');
    if (!container) return;
    try {
        container.textContent = 'Loading achievements…';
        const res = await fetch(mdUrl);
        if (!res.ok) throw new Error('Failed to fetch badges markdown');
        const md = await res.text();

        // Simple regex to find markdown image/link blocks like: [<img ... src="..." />](link)
        const badgeRegex = /\[<img[^>]*src="([^"]+)"[^>]*>\]\(([^)]+)\)/g;
        let match;
        const badges = [];
        while ((match = badgeRegex.exec(md)) !== null) {
            const imgSrc = match[1];
            const link = match[2];
            badges.push({ imgSrc, link });
        }

        if (badges.length === 0) {
            container.textContent = 'No badges found.';
            return;
        }

        container.innerHTML = '';
        badges.forEach(b => {
            const card = document.createElement('a');
            card.className = 'achievement-card';
            card.href = b.link;
            card.target = '_blank';
            card.rel = 'noopener noreferrer';

            const img = document.createElement('img');
            // Convert blob URL to raw GitHub content URL if necessary
            let src = b.imgSrc;
            if (src.includes('github.com') && !src.includes('raw.githubusercontent.com')) {
                src = src.replace('github.com', 'raw.githubusercontent.com').replace('/blob/', '/');
            }
            img.src = src;

            const title = document.createElement('div');
            title.textContent = '';

            card.appendChild(img);
            card.appendChild(title);
            container.appendChild(card);
        });

    } catch (err) {
        container.textContent = 'Could not load achievements.';
        console.error(err);
    }
}

// Load achievements on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    loadAchievements();
});

// Subscription handling for Planned Projects
document.addEventListener('DOMContentLoaded', () => {
    const emailInput = document.getElementById('subscribe-email');
    const subscribeBtn = document.getElementById('subscribe-btn');
    const msg = document.getElementById('subscribe-msg');

    function validateEmail(e) {
        const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\\.,;:\s@\"]+\.)+[^<>()[\]\\.,;:\s@\"]{2,})$/i;
        return re.test(String(e).toLowerCase());
    }

    if (subscribeBtn && emailInput) {
        subscribeBtn.addEventListener('click', async () => {
            const email = emailInput.value.trim();
            if (!validateEmail(email)) {
                msg.textContent = 'Please enter a valid email address.';
                msg.style.color = 'var(--accent-secondary)';
                return;
            }
            // If an endpoint is configured (e.g., Cloudflare Worker), POST there
            const endpoint = window.SUBSCRIBE_ENDPOINT || null;
            if (endpoint) {
                try {
                    const r = await fetch(endpoint, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email })
                    });
                    if (r.ok) {
                        msg.textContent = 'Subscribed — thanks! Check your inbox for confirmation.';
                        msg.style.color = 'var(--accent)';
                        emailInput.value = '';
                    } else {
                        const txt = await r.text();
                        msg.textContent = 'Subscription failed: ' + txt;
                        msg.style.color = 'var(--accent-secondary)';
                    }
                } catch (err) {
                    msg.textContent = 'Subscription failed (network). Saved locally.';
                    msg.style.color = 'var(--accent-secondary)';
                    saveLocal(email);
                    emailInput.value = '';
                }
            } else {
                saveLocal(email);
                msg.textContent = 'Subscribed locally — stored in browser.';
                msg.style.color = 'var(--accent)';
                emailInput.value = '';
            }
        });
    }
});

function saveLocal(email) {
    let subs = [];
    try { subs = JSON.parse(localStorage.getItem('subs') || '[]'); } catch (e) { subs = []; }
    if (!subs.includes(email)) subs.push(email);
    localStorage.setItem('subs', JSON.stringify(subs));
}
