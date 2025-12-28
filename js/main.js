/**
 * CatLocTeam - Main JavaScript
 */

// Site Version for cache busting
const SITE_VERSION = '1.0.0';

// ===========================
// Theme Toggle
// ===========================
function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

// Load saved theme on page load
function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

// ===========================
// Mobile Menu
// ===========================
function toggleMenu() {
    const navLinks = document.getElementById('navLinks');
    navLinks.classList.toggle('active');
}

// ===========================
// Scroll Animations
// ===========================
function initScrollAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in');

    if (!fadeElements.length) return;

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    fadeElements.forEach(el => {
        // Check if element is already in viewport
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            el.classList.add('visible');
        }
        observer.observe(el);
    });
}

// ===========================
// Smooth Scroll Navigation
// ===========================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // Close mobile menu if open
                document.getElementById('navLinks').classList.remove('active');
            }
        });
    });
}

// ===========================
// FAQ Toggle
// ===========================
function toggleFaq(button) {
    const faqItem = button.parentElement;
    const isActive = faqItem.classList.contains('active');

    // Close all FAQ items
    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
    });

    // Open clicked item if it wasn't active
    if (!isActive) {
        faqItem.classList.add('active');
    }
}

// ===========================
// Navbar Shadow on Scroll
// ===========================
function initNavbarScroll() {
    window.addEventListener('scroll', () => {
        const nav = document.querySelector('nav');
        if (window.scrollY > 50) {
            nav.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            nav.style.boxShadow = 'none';
        }
    });
}

// ===========================
// Scroll to Top Button
// ===========================
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function initScrollTopButton() {
    const scrollBtn = document.getElementById('scrollTop');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    });
}

// ===========================
// Load Games from JSON
// ===========================

// Fallback games data for local testing (when fetch fails due to CORS)
const FALLBACK_GAMES = {
    games: [
        {
            id: "wolf-among-us",
            title: "The Wolf Among Us",
            description: "Повна українська локалізація обох епізодів культової пригодницької гри від Telltale Games. Зануртеся у темний світ казкових персонажів рідною мовою!",
            image: "",
            placeholder: "🐺",
            status: "completed",
            statusText: "Завершено",
            tags: ["Епізод 1", "Епізод 2", "Adventure", "Telltale"],
            downloadUrl: "https://lblauncher.com"
        },
        {
            id: "game-placeholder-2",
            title: "Скоро",
            description: "Нова локалізація вже в розробці. Слідкуйте за оновленнями на наших соціальних мережах!",
            image: "",
            placeholder: "🎮",
            status: "coming",
            statusText: "Скоро",
            tags: ["В розробці"],
            downloadUrl: ""
        },
        {
            id: "game-placeholder-3",
            title: "Скоро",
            description: "Нова локалізація вже в розробці. Слідкуйте за оновленнями на наших соціальних мережах!",
            image: "",
            placeholder: "🎮",
            status: "coming",
            statusText: "Скоро",
            tags: ["В розробці"],
            downloadUrl: ""
        },
        {
            id: "game-placeholder-4",
            title: "Скоро",
            description: "Нова локалізація вже в розробці. Слідкуйте за оновленнями на наших соціальних мережах!",
            image: "",
            placeholder: "🎮",
            status: "coming",
            statusText: "Скоро",
            tags: ["В розробці"],
            downloadUrl: ""
        }
    ]
};

function renderGames(data) {
    const grid = document.getElementById('projectsGrid');
    if (!grid) return;

    grid.innerHTML = data.games.map(game => `
        <div class="project-card fade-in">
            <div class="project-image">
                ${game.image ? `<img src="${game.image}" alt="${game.title}">` : `<span class="project-placeholder">${game.placeholder}</span>`}
            </div>
            <div class="project-content">
                <span class="project-badge ${game.status === 'coming' ? 'coming' : ''}">${game.statusText}</span>
                <h3 class="project-title">${game.title}</h3>
                <p class="project-description">${game.description}</p>
                <div class="project-tags">
                    ${game.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
                </div>
                ${game.downloadUrl ? `
                <div class="project-actions">
                    <a href="${game.downloadUrl}" target="_blank" class="btn-download">
                        <svg viewBox="0 0 24 24"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>
                        Завантажити
                    </a>
                </div>
                ` : ''}
            </div>
        </div>
    `).join('');

    // Re-init scroll animations for new elements
    initScrollAnimations();
}

async function loadGames() {
    const grid = document.getElementById('projectsGrid');
    if (!grid) return;

    try {
        const response = await fetch(`data/games.json?v=${SITE_VERSION}`);
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        renderGames(data);
    } catch (error) {
        console.log('Using fallback games data (local development)');
        renderGames(FALLBACK_GAMES);
    }
}

// ===========================
// Initialize All
// ===========================
document.addEventListener('DOMContentLoaded', () => {
    loadTheme();
    loadGames();
    initScrollAnimations();
    initSmoothScroll();
    initNavbarScroll();
    initScrollTopButton();
});
