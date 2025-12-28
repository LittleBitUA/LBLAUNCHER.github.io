/**
 * CatLocTeam - Main JavaScript
 */

// Site Version for cache busting
const SITE_VERSION = '1.0.0';

// ===========================
// Language System (i18n)
// ===========================
let currentLanguage = 'ua';
let translations = {};

// Fallback translations for file:// protocol
const FALLBACK_TRANSLATIONS = {
    ua: {
        lang: "ua",
        meta: { title: "CatLocTeam - Українська локалізація ігор", description: "CatLocTeam - жіноча аматорська команда локалізації ігор українською мовою" },
        nav: { about: "Про нас", projects: "Проєкти", team: "Команда", values: "Цінності", faq: "FAQ", join: "Долучитись", support: "Підтримати", contact: "Контакти" },
        theme: { label: "Тема" },
        hero: { title: "CatLocTeam", subtitle: "Жіноча аматорська команда локалізації ігор", description: "Ми - котяча команда ентузіасток, які працюють день і ніч, щоб українські геймери могли насолоджуватися іграми рідною мовою", btnProjects: "Наші проєкти", btnSupport: "Підтримати" },
        about: { title: "Чим ми <span>займаємось</span>", subtitle: "Наша місія - зробити ігровий світ доступнішим для українців", localization: { title: "Локалізація", description: "Повний переклад ігор українською мовою з збереженням атмосфери та характеру персонажів" }, technical: { title: "Технічна робота", description: "Інтеграція перекладів у гри, адаптація шрифтів та інтерфейсу для української мови" }, quality: { title: "Якість", description: "Ретельна перевірка кожного рядка тексту та тестування на різних платформах" } },
        projects: { title: "Наші <span>проєкти</span>", subtitle: "Ігри, які ми локалізували з любов'ю для української спільноти", download: "Завантажити", statusCompleted: "Завершено", statusComing: "Скоро" },
        team: { title: "Наша <span>команда</span>", subtitle: "Ентузіастки, об'єднані спільною метою", quote: "Ми віримо, що кожен українець заслуговує грати в ігри рідною мовою. Наша робота - це не просто переклад, це любов до геймінгу та української культури.", stats: { projects: "Завершених проєкти", working: "Працюємо для вас", love: "Любові до справи" } },
        support: { title: "Підтримайте <span>команду</span>", subtitle: "Ваша підтримка допомагає нам створювати нові локалізації", cardTitle: "Донат на розвиток", cardDescription: "Кожна гривня наближає нас до нових перекладів та покращення якості існуючих робіт", btnDonate: "Підтримати через Monobank" },
        values: { title: "Наші <span>цінності</span>", subtitle: "Принципи, які визначають нашу роботу та спільноту", nationalism: { title: "Український націоналізм", description: "Розвиток національної свідомості та українізація суспільства є для нас надважливими. Ми українізуємо ігровий простір та підтримуємо ЗСУ, волонтерів і постраждалих від агресії." }, feminism: { title: "Фемінізм", description: "Ми створені як безпечний жіночий простір. Пріоритизуємо розвиток жінок у геймінгу, відкрито підтримуємо фемінізм, використовуємо фемінітиви та активно протидіємо мізогінії." }, equality: { title: "Відсутність дискримінації", description: "Ми проти гомофобії, сексизму, ейблізму, ейджизму та будь-яких форм дискримінації. Україна має бути комфортним місцем, де кожен почувається однаково безпечно." } },
        faq: { title: "Часті <span>запитання</span>", subtitle: "Відповіді на популярні питання про нашу роботу", q1: { question: "Як встановити українську локалізацію?", answer: "Інструкція з встановлення додається до кожного релізу. Зазвичай потрібно скопіювати файли локалізації у папку гри та обрати українську мову в налаштуваннях. Детальні інструкції є на нашому Telegram каналі." }, q2: { question: "Чи можу я допомогти з перекладом?", answer: "Так! Ми завжди раді новим учасникам команди. Напишіть нам у Telegram, і ми обговоримо можливості співпраці. Потрібні перекладачі, редактори та тестувальники." }, q3: { question: "Чи працює локалізація з ліцензійною версією гри?", answer: "Так, наші локалізації розроблені для офіційних версій ігор зі Steam та інших платформ. Ми тестуємо сумісність з останніми оновленнями ігор." }, q4: { question: "Як дізнатися про нові локалізації?", answer: "Підпишіться на наш Telegram канал — там ми публікуємо всі анонси, релізи та новини проєктів. Також слідкуйте за нами на YouTube та X (Twitter)." } },
        join: { title: "Як <span>допомогти</span>", subtitle: "Є багато способів підтримати українську локалізацію ігор", translator: { title: "Перекладач", description: "Допомагай перекладати тексти ігор українською мовою, зберігаючи атмосферу та характер оригіналу." }, editor: { title: "Редактор", description: "Перевіряй якість перекладу, виправляй помилки та слідкуй за консистентністю термінології." }, tester: { title: "Тестувальник", description: "Тестуй локалізації в грі, шукай баги та допомагай покращувати якість перекладів." }, cta: "Хочеш приєднатися до нашої котячої команди?", btnJoin: "Написати в Telegram" },
        social: { title: "Слідкуйте за <span>нами</span>", subtitle: "Будьте в курсі новин та анонсів нових локалізацій" },
        footer: { copyright: "CatLocTeam" }
    },
    en: {
        lang: "en",
        meta: { title: "CatLocTeam - Ukrainian Game Localization", description: "CatLocTeam - a women's amateur team localizing games into Ukrainian" },
        nav: { about: "About", projects: "Projects", team: "Team", values: "Values", faq: "FAQ", join: "Join Us", support: "Support", contact: "Contact" },
        theme: { label: "Theme" },
        hero: { title: "CatLocTeam", subtitle: "Women's amateur game localization team", description: "We are a cat-loving team of enthusiasts working day and night so Ukrainian gamers can enjoy games in their native language", btnProjects: "Our Projects", btnSupport: "Support Us" },
        about: { title: "What We <span>Do</span>", subtitle: "Our mission is to make gaming more accessible for Ukrainians", localization: { title: "Localization", description: "Complete game translations into Ukrainian while preserving the atmosphere and character personalities" }, technical: { title: "Technical Work", description: "Integration of translations into games, font adaptation and interface adjustments for Ukrainian language" }, quality: { title: "Quality", description: "Thorough review of every text line and testing across different platforms" } },
        projects: { title: "Our <span>Projects</span>", subtitle: "Games we've localized with love for the Ukrainian community", download: "Download", statusCompleted: "Completed", statusComing: "Coming Soon" },
        team: { title: "Our <span>Team</span>", subtitle: "Enthusiasts united by a common goal", quote: "We believe every Ukrainian deserves to play games in their native language. Our work is not just translation — it's a love for gaming and Ukrainian culture.", stats: { projects: "Completed projects", working: "Working for you", love: "Love for our craft" } },
        support: { title: "Support the <span>Team</span>", subtitle: "Your support helps us create new localizations", cardTitle: "Donate for Development", cardDescription: "Every donation brings us closer to new translations and improving the quality of existing work", btnDonate: "Support via Monobank" },
        values: { title: "Our <span>Values</span>", subtitle: "Principles that define our work and community", nationalism: { title: "Ukrainian Nationalism", description: "Development of national consciousness and Ukrainization of society are extremely important to us. We Ukrainize the gaming space and support the Armed Forces, volunteers, and victims of aggression." }, feminism: { title: "Feminism", description: "We were created as a safe women's space. We prioritize women's development in gaming, openly support feminism, use feminine word forms, and actively oppose misogyny." }, equality: { title: "Anti-Discrimination", description: "We oppose homophobia, sexism, ableism, ageism, and any forms of discrimination. Ukraine should be a comfortable place where everyone feels equally safe." } },
        faq: { title: "Frequently Asked <span>Questions</span>", subtitle: "Answers to popular questions about our work", q1: { question: "How do I install the Ukrainian localization?", answer: "Installation instructions are included with each release. Usually, you need to copy the localization files to the game folder and select Ukrainian in the settings. Detailed instructions are available on our Telegram channel." }, q2: { question: "Can I help with translation?", answer: "Yes! We're always happy to welcome new team members. Write to us on Telegram, and we'll discuss collaboration opportunities. We need translators, editors, and testers." }, q3: { question: "Does the localization work with the licensed version of the game?", answer: "Yes, our localizations are designed for official game versions from Steam and other platforms. We test compatibility with the latest game updates." }, q4: { question: "How can I learn about new localizations?", answer: "Subscribe to our Telegram channel — we publish all announcements, releases, and project news there. Also follow us on YouTube and X (Twitter)." } },
        join: { title: "How to <span>Help</span>", subtitle: "There are many ways to support Ukrainian game localization", translator: { title: "Translator", description: "Help translate game texts into Ukrainian while preserving the atmosphere and character of the original." }, editor: { title: "Editor", description: "Check translation quality, fix errors, and ensure terminology consistency." }, tester: { title: "Tester", description: "Test localizations in-game, find bugs, and help improve translation quality." }, cta: "Want to join our cat team?", btnJoin: "Message us on Telegram" },
        social: { title: "Follow <span>Us</span>", subtitle: "Stay updated on news and announcements of new localizations" },
        footer: { copyright: "CatLocTeam" }
    }
};

// Get nested value from object by path (e.g., "about.localization.title")
function getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => current && current[key], obj);
}

// Apply translations to all elements with data-i18n attribute
function applyLanguage(lang) {
    const langData = translations[lang] || FALLBACK_TRANSLATIONS[lang];
    if (!langData) return;

    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const value = getNestedValue(langData, key);

        if (value) {
            if (element.hasAttribute('data-i18n-html')) {
                element.innerHTML = value;
            } else {
                element.textContent = value;
            }
        }
    });

    // Update HTML lang attribute
    document.documentElement.lang = lang === 'ua' ? 'uk' : 'en';

    // Update page title
    if (langData.meta && langData.meta.title) {
        document.title = langData.meta.title;
    }

    // Update meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && langData.meta && langData.meta.description) {
        metaDesc.setAttribute('content', langData.meta.description);
    }

    // Update language toggle button
    const langText = document.querySelector('.lang-text');
    if (langText) {
        langText.textContent = lang.toUpperCase();
    }

    // Update flag visibility
    document.querySelectorAll('.lang-flag').forEach(flag => {
        flag.classList.toggle('active', flag.getAttribute('data-lang') === lang);
    });
}

// Toggle between UA and EN
function toggleLanguage() {
    currentLanguage = currentLanguage === 'ua' ? 'en' : 'ua';
    localStorage.setItem('language', currentLanguage);
    applyLanguage(currentLanguage);
}

// Load language files
async function loadLanguage() {
    // Load saved language preference
    currentLanguage = localStorage.getItem('language') || 'ua';

    // Use fallback for local file:// protocol
    if (window.location.protocol === 'file:') {
        translations = FALLBACK_TRANSLATIONS;
        applyLanguage(currentLanguage);
        return;
    }

    try {
        const [uaResponse, enResponse] = await Promise.all([
            fetch(`data/lang/UA.json?v=${SITE_VERSION}`),
            fetch(`data/lang/ENG.json?v=${SITE_VERSION}`)
        ]);

        if (uaResponse.ok && enResponse.ok) {
            translations.ua = await uaResponse.json();
            translations.en = await enResponse.json();
        } else {
            throw new Error('Failed to load language files');
        }
    } catch (error) {
        console.log('Using fallback translations');
        translations = FALLBACK_TRANSLATIONS;
    }

    applyLanguage(currentLanguage);
}

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
// Load Team from JSON
// ===========================

const FALLBACK_TEAM = {
    team: [
        { id: "vika", name: "Віка", role: "Начальниця", info: "Координує роботу команди", image: "", placeholder: "👩‍💼" },
        { id: "anya", name: "Аня", role: "Заступниця", info: "Заступниця начальниці", image: "", placeholder: "👩‍💻" },
        { id: "marina", name: "Марина", role: "Програмістка", info: "Технічна реалізація", image: "", placeholder: "💻" },
        { id: "olya", name: "Оля", role: "Перекладачка", info: "Переклад текстів", image: "", placeholder: "📝" },
        { id: "katya", name: "Катя", role: "Редакторка", info: "Редагування та коректура", image: "", placeholder: "✏️" },
        { id: "dasha", name: "Даша", role: "Текстурниця", info: "Робота з текстурами", image: "", placeholder: "🎨" },
        { id: "yulya", name: "Юля", role: "Тестувальниця", info: "Тестування локалізацій", image: "", placeholder: "🐛" },
        { id: "sonya", name: "Соня", role: "SMM", info: "Соціальні мережі", image: "", placeholder: "📱" }
    ]
};

function renderTeamMember(member) {
    return `
        <div class="team-member">
            <div class="team-avatar">
                ${member.image
                    ? `<img src="${member.image}" alt="${member.name}" loading="lazy">`
                    : `<div class="team-avatar-placeholder">${member.placeholder}</div>`}
            </div>
            <div class="team-name">${member.name}</div>
            <div class="team-role">${member.role}</div>
            <div class="team-info">${member.info}</div>
        </div>
    `;
}

function renderTeam(data) {
    const carousel = document.getElementById('teamCarousel');
    if (!carousel) return;

    // Render team twice for seamless infinite scroll
    const teamHTML = data.team.map(renderTeamMember).join('');
    carousel.innerHTML = teamHTML + teamHTML;
}

async function loadTeam() {
    const carousel = document.getElementById('teamCarousel');
    if (!carousel) return;

    // Use fallback for local file:// protocol
    if (window.location.protocol === 'file:') {
        renderTeam(FALLBACK_TEAM);
        return;
    }

    try {
        const response = await fetch(`data/team.json?v=${SITE_VERSION}`);
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        renderTeam(data);
    } catch (error) {
        console.log('Using fallback team data');
        renderTeam(FALLBACK_TEAM);
    }
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

    // Use fallback for local file:// protocol
    if (window.location.protocol === 'file:') {
        renderGames(FALLBACK_GAMES);
        return;
    }

    try {
        const response = await fetch(`data/games.json?v=${SITE_VERSION}`);
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        renderGames(data);
    } catch (error) {
        console.log('Using fallback games data');
        renderGames(FALLBACK_GAMES);
    }
}

// ===========================
// Parallax Effect on Hero
// ===========================
function initParallax() {
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');
    const heroLogo = document.querySelector('.hero-logo');

    if (!hero || !heroContent) return;

    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrolled = window.scrollY;
                const heroHeight = hero.offsetHeight;

                // Only apply parallax when hero is visible
                if (scrolled < heroHeight) {
                    const parallaxSpeed = 0.4;
                    const opacity = 1 - (scrolled / heroHeight) * 0.8;

                    heroContent.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
                    heroContent.style.opacity = Math.max(opacity, 0.2);

                    if (heroLogo) {
                        heroLogo.style.transform = `translateY(${scrolled * 0.2}px)`;
                    }
                }
                ticking = false;
            });
            ticking = true;
        }
    });
}

// ===========================
// Typing Effect for Slogan
// ===========================
function initTypingEffect() {
    const subtitle = document.querySelector('.hero-subtitle');
    if (!subtitle) return;

    const text = subtitle.textContent;
    subtitle.innerHTML = '<span class="typing-cursor"></span>';

    let charIndex = 0;
    const typingSpeed = 50;

    function type() {
        if (charIndex < text.length) {
            const cursor = subtitle.querySelector('.typing-cursor');
            const textSpan = subtitle.querySelector('.typed-text') || document.createElement('span');

            if (!textSpan.classList.contains('typed-text')) {
                textSpan.classList.add('typed-text');
                subtitle.insertBefore(textSpan, cursor);
            }

            textSpan.textContent = text.substring(0, charIndex + 1);
            charIndex++;
            setTimeout(type, typingSpeed);
        } else {
            // Remove cursor after typing is done
            const cursor = subtitle.querySelector('.typing-cursor');
            if (cursor) {
                setTimeout(() => {
                    cursor.style.animation = 'blink 0.7s infinite';
                    // Keep cursor visible for a while, then hide
                    setTimeout(() => {
                        cursor.style.opacity = '0';
                    }, 3000);
                }, 500);
            }
        }
    }

    // Start typing after a short delay
    setTimeout(type, 500);
}

// ===========================
// Confetti on Donate Button
// ===========================
function createConfetti() {
    const colors = ['#E91E8C', '#FF4DB2', '#7ED321', '#50E3C2', '#9B59B6', '#FFD700'];
    const confettiCount = 60;
    const container = document.body;

    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti-piece';

        const color = colors[Math.floor(Math.random() * colors.length)];
        const size = Math.random() * 10 + 5;
        const startX = Math.random() * window.innerWidth;
        const startY = -20;
        const endX = startX + (Math.random() - 0.5) * 400;
        const endY = window.innerHeight + 100;
        const rotation = Math.random() * 720 - 360;
        const duration = Math.random() * 2 + 2;
        const delay = Math.random() * 0.5;

        confetti.style.cssText = `
            position: fixed;
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            left: ${startX}px;
            top: ${startY}px;
            pointer-events: none;
            z-index: 10000;
            border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
            animation: confettiFall ${duration}s ease-out ${delay}s forwards;
            --endX: ${endX - startX}px;
            --endY: ${endY}px;
            --rotation: ${rotation}deg;
        `;

        container.appendChild(confetti);

        // Remove confetti after animation
        setTimeout(() => {
            confetti.remove();
        }, (duration + delay) * 1000 + 100);
    }
}

function initConfetti() {
    const donateBtn = document.querySelector('.btn-donate');
    if (!donateBtn) return;

    donateBtn.addEventListener('click', (e) => {
        e.preventDefault();
        createConfetti();

        // Delay before opening link so users can see confetti
        const href = donateBtn.getAttribute('href');
        setTimeout(() => {
            window.open(href, '_blank');
        }, 500);
    });
}

// ===========================
// Initialize All
// ===========================
document.addEventListener('DOMContentLoaded', () => {
    loadTheme();
    loadLanguage();
    loadTeam();
    loadGames();
    initScrollAnimations();
    initSmoothScroll();
    initNavbarScroll();
    initScrollTopButton();
    initParallax();
    initTypingEffect();
    initConfetti();
});
