// Ініціалізація анімацій
AOS.init({
    duration: 800,
    once: true,
    offset: 50
});

// Глобальні змінні для зберігання посилань
let downloadLinks = {
    windows: null,
    macos: null,
    linux: null,
    version: null
};

// --- Функція для отримання останнього релізу з GitHub ---
async function fetchLatestRelease() {
    try {
        // Отримуємо останній реліз для версії та посилань
        const latestResponse = await fetch('https://api.github.com/repos/Vadko/littlebit-launcher/releases/latest');
        if (!latestResponse.ok) throw new Error('Failed to fetch latest release');
        
        const latestData = await latestResponse.json();
        downloadLinks.version = latestData.tag_name.replace('v', '');
        
        // Оновлюємо badge з версією та датою
        const versionText = document.getElementById('version-text');
        if (versionText) {
            const releaseDate = new Date(latestData.published_at);
            const formattedDate = releaseDate.toLocaleDateString('uk-UA', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
            versionText.textContent = `Версія ${latestData.tag_name} від ${formattedDate}`;
        }
        
        // Отримуємо всі релізи для підрахунку загальних завантажень
        const allReleasesResponse = await fetch('https://api.github.com/repos/Vadko/littlebit-launcher/releases?per_page=100');
        const downloadCountEl = document.getElementById('download-count');

        if (allReleasesResponse.ok) {
            const allReleases = await allReleasesResponse.json();

            // Підраховуємо загальну кількість завантажень з усіх релізів
            let totalDownloads = 0;
            allReleases.forEach(release => {
                release.assets.forEach(asset => {
                    // Рахуємо тільки основні файли (не blockmap, не yml, не source code)
                    const name = asset.name.toLowerCase();
                    if (!name.includes('blockmap') &&
                        !name.endsWith('.yml') &&
                        !name.includes('source code') &&
                        !name.endsWith('.zip') &&
                        !name.endsWith('.tar.gz')) {
                        totalDownloads += asset.download_count || 0;
                    }
                });
            });

            // Оновлюємо лічильник завантажень
            if (downloadCountEl && totalDownloads > 0) {
                downloadCountEl.setAttribute('data-target', totalDownloads);
                animateCounter(downloadCountEl);
            }
        } else {
            // Fallback - показуємо приблизне значення якщо API недоступний
            if (downloadCountEl) {
                downloadCountEl.setAttribute('data-target', 1000);
                animateCounter(downloadCountEl);
            }
        }
        
        // Парсимо assets останнього релізу для пошуку правильних файлів
        latestData.assets.forEach(asset => {
            const name = asset.name.toLowerCase();
            const url = asset.browser_download_url;
            
            // Windows - шукаємо Installer .exe (не Portable)
            if (name.includes('win') && name.endsWith('.exe') && !name.includes('portable')) {
                // Перевага Setup/Installer, потім будь-який .exe для Windows
                if (name.includes('setup') || name.includes('installer')) {
                    downloadLinks.windows = url;
                } else if (!downloadLinks.windows) {
                    downloadLinks.windows = url;
                }
            }
            // macOS - шукаємо .dmg файли (не blockmap)
            else if (name.endsWith('.dmg') && !name.includes('blockmap')) {
                // Перевага arm64 (Apple Silicon), потім x64 (Intel)
                if (name.includes('arm64')) {
                    downloadLinks.macos = url;
                } else if (name.includes('x64') && !downloadLinks.macos) {
                    downloadLinks.macos = url;
                } else if (!downloadLinks.macos) {
                    // Якщо немає специфікації архітектури, використовуємо будь-який .dmg
                    downloadLinks.macos = url;
                }
            }
            // Linux - перевага AppImage, потім .rpm
            else if (name.includes('linux')) {
                if (name.includes('appimage')) {
                    downloadLinks.linux = url;
                } else if (name.includes('.rpm') && !downloadLinks.linux) {
                    downloadLinks.linux = url;
                }
            }
        });
        
        // Після отримання посилань, оновлюємо UI
        updateDownloadButtons();
    } catch (error) {
        console.error('Помилка при завантаженні інформації про реліз:', error);
        // Fallback посилання на сторінку релізів
        const fallbackUrl = 'https://github.com/Vadko/littlebit-launcher/releases/latest';
        downloadLinks.windows = fallbackUrl;
        downloadLinks.macos = fallbackUrl;
        downloadLinks.linux = fallbackUrl;
        updateDownloadButtons();

        // Fallback для лічильника завантажень
        const downloadCountEl = document.getElementById('download-count');
        if (downloadCountEl) {
            downloadCountEl.setAttribute('data-target', 1000);
            animateCounter(downloadCountEl);
        }
    }
}

// --- Функція детекту ОС ---
function detectOS() {
    const userAgent = navigator.userAgent.toLowerCase();
    const platform = navigator.platform.toLowerCase();
    
    // macOS детекція (виключаємо мобільні пристрої)
    if ((/mac/.test(userAgent) || /mac/.test(platform)) && !/iphone|ipad|ipod/.test(userAgent)) {
        return 'macOS';
    }
    // Linux детекція (виключаємо Android)
    else if (/linux/.test(userAgent) && !/android/.test(userAgent)) {
        return 'Linux';
    }
    // Windows (за замовчуванням)
    return 'Windows';
}

// --- Функція оновлення кнопок завантаження ---
function updateDownloadButtons() {
    const detectedOS = detectOS();
    
    // Елементи
    const mainBtn = document.getElementById('main-download-btn');
    if (!mainBtn) return; // Якщо кнопка ще не завантажилася
    
    const mainText = document.getElementById('main-download-text');
    const mainSubtitle = document.getElementById('main-download-subtitle');
    const mainIcon = mainBtn.querySelector('i');
    
    // Міні-кнопки
    const linuxMini = document.getElementById('linux-mini-btn');
    const macosMini = document.getElementById('macos-mini-btn');
    
    let osConfig = {
        iconClass: 'fa-brands fa-windows',
        title: 'Завантажити для Windows',
        subtitle: 'Installer (.exe)',
        link: downloadLinks.windows || 'https://github.com/Vadko/littlebit-launcher/releases/latest'
    };
    
    // Налаштування для виявленої ОС
    if (detectedOS === 'macOS') {
        osConfig = {
            iconClass: 'fa-brands fa-apple',
            title: 'Завантажити для macOS',
            subtitle: 'Universal (.dmg)',
            link: downloadLinks.macos || 'https://github.com/Vadko/littlebit-launcher/releases/latest'
        };
    } else if (detectedOS === 'Linux') {
        osConfig = {
            iconClass: 'fa-brands fa-linux',
            title: 'Завантажити для Linux',
            subtitle: 'AppImage / .rpm',
            link: downloadLinks.linux || 'https://github.com/Vadko/littlebit-launcher/releases/latest'
        };
    }
    
    // Оновлення основної кнопки
    mainBtn.href = osConfig.link;
    mainBtn.target = '_blank';
    mainBtn.rel = 'noopener noreferrer';
    mainIcon.className = osConfig.iconClass;
    mainText.textContent = osConfig.title;
    mainSubtitle.textContent = osConfig.subtitle;
    
    // Налаштування міні-кнопок
    if (linuxMini) {
        linuxMini.href = downloadLinks.linux || 'https://github.com/Vadko/littlebit-launcher/releases/latest';
        linuxMini.target = '_blank';
        linuxMini.rel = 'noopener noreferrer';
        linuxMini.style.display = detectedOS === 'Linux' ? 'none' : 'flex';
    }
    
    if (macosMini) {
        macosMini.href = downloadLinks.macos || 'https://github.com/Vadko/littlebit-launcher/releases/latest';
        macosMini.target = '_blank';
        macosMini.rel = 'noopener noreferrer';
        macosMini.style.display = detectedOS === 'macOS' ? 'none' : 'flex';
    }
    
    // Підсвічування міні-кнопок
    [linuxMini, macosMini].forEach(btn => {
        if (btn) btn.classList.remove('active');
    });
    
    // Підсвітити альтернативні платформи
    if (detectedOS === 'Windows') {
        if (linuxMini) linuxMini.classList.add('active');
        if (macosMini) macosMini.classList.add('active');
    } else if (detectedOS === 'Linux' && macosMini) {
        macosMini.classList.add('active');
    } else if (detectedOS === 'macOS' && linuxMini) {
        linuxMini.classList.add('active');
    }
}

// Запускаємо при завантаженні сторінки
document.addEventListener('DOMContentLoaded', () => {
    // Спочатку встановлюємо fallback посилання, щоб кнопки працювали одразу
    updateDownloadButtons();
    // Потім завантажуємо актуальні посилання з GitHub
    fetchLatestRelease();
});


// --- Функція анімації лічильника ---
function animateCounter(counter) {
    const target = +counter.getAttribute('data-target');
    if (target <= 0) return; // Немає чого анімувати

    const duration = 1500; // 1.5 секунди
    const startTime = performance.now();

    // Скидаємо на 0 перед анімацією
    counter.innerText = '0';

    const updateCount = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Використовуємо easeOutCubic для плавного сповільнення
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.floor(easeProgress * target);

        counter.innerText = currentValue;

        if (progress < 1) {
            requestAnimationFrame(updateCount);
        } else {
            counter.innerText = target;
        }
    };

    requestAnimationFrame(updateCount);
}

// --- Анімація лічильника цифр ---
const counters = document.querySelectorAll('.counter');
counters.forEach(counter => {
    // Пропускаємо download-count, бо він оновлюється з API
    if (counter.id === 'download-count') return;

    const observer = new IntersectionObserver((entries) => {
        if(entries[0].isIntersecting) {
            animateCounter(counter);
            observer.disconnect();
        }
    });
    observer.observe(counter);
});

// Плавний скрол (тільки для внутрішніх посилань)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    // Пропускаємо кнопки завантаження
    if (anchor.id && (anchor.id.includes('download') || anchor.id.includes('linux') || anchor.id.includes('macos'))) {
        return;
    }
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// --- Анімація рамки для карток функцій ---
function addCardAnimation(selector) {
    document.querySelectorAll(selector).forEach(card => {
        let angle = 0;
        let animationId = null;
        let isHovered = false;

        // Обертання градієнта
        const rotateGradient = () => {
            if (!isHovered) return;
            angle += 0.5;
            if (angle >= 360) angle = 0;
            card.style.setProperty('--gradient-angle', angle);
            animationId = requestAnimationFrame(rotateGradient);
        };

        card.addEventListener('mouseenter', function() {
            isHovered = true;
            rotateGradient();
        });

        card.addEventListener('mousemove', function(e) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const posX = (x / rect.width) * 100;
            const posY = (y / rect.height) * 100;

            card.style.setProperty('--mouse-x', `${posX}%`);
            card.style.setProperty('--mouse-y', `${posY}%`);
        });

        card.addEventListener('mouseleave', function() {
            isHovered = false;
            if (animationId) {
                cancelAnimationFrame(animationId);
                animationId = null;
            }
            card.style.setProperty('--mouse-x', '50%');
            card.style.setProperty('--mouse-y', '50%');
            angle = 0;
            card.style.setProperty('--gradient-angle', '0');
        });
    });
}

// Застосовуємо анімацію до обох типів карток
addCardAnimation('.g-card');
addCardAnimation('.why-card');

// --- Lightbox для галереї ---
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');
const lightboxClose = document.getElementById('lightbox-close');
const lightboxPrev = document.getElementById('lightbox-prev');
const lightboxNext = document.getElementById('lightbox-next');

const galleryItems = document.querySelectorAll('.gallery-item');
let currentImageIndex = 0;

// Збираємо всі зображення галереї
const galleryImages = Array.from(galleryItems).map(item => ({
    src: item.querySelector('img').src,
    caption: item.querySelector('.gallery-overlay span').textContent
}));

// Відкриття lightbox при кліку на зображення
galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
        currentImageIndex = index;
        openLightbox();
    });
});

function openLightbox() {
    lightboxImg.src = galleryImages[currentImageIndex].src;
    lightboxCaption.textContent = galleryImages[currentImageIndex].caption;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

function showPrevImage() {
    currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
    lightboxImg.src = galleryImages[currentImageIndex].src;
    lightboxCaption.textContent = galleryImages[currentImageIndex].caption;
}

function showNextImage() {
    currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
    lightboxImg.src = galleryImages[currentImageIndex].src;
    lightboxCaption.textContent = galleryImages[currentImageIndex].caption;
}

// Event listeners для кнопок
lightboxClose.addEventListener('click', closeLightbox);
lightboxPrev.addEventListener('click', showPrevImage);
lightboxNext.addEventListener('click', showNextImage);

// Закриття при кліку на фон
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        closeLightbox();
    }
});

// Навігація клавіатурою
document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;

    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showPrevImage();
    if (e.key === 'ArrowRight') showNextImage();
});

// --- FAQ Accordion ---
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');

    question.addEventListener('click', () => {
        // Закриваємо інші відкриті елементи
        faqItems.forEach(otherItem => {
            if (otherItem !== item && otherItem.classList.contains('active')) {
                otherItem.classList.remove('active');
            }
        });

        // Перемикаємо поточний елемент
        item.classList.toggle('active');
    });
});

// --- Кнопка "Наверх" ---
const scrollTopBtn = document.getElementById('scroll-top');

window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }
});

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// --- Preloader ---
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');

    // Невелика затримка для плавності
    setTimeout(() => {
        preloader.classList.add('hidden');

        // Видаляємо preloader з DOM після анімації
        setTimeout(() => {
            preloader.remove();
        }, 500);
    }, 500);
});

// --- Parallax Effect for Orbs (тільки на десктопі) ---
const orb1 = document.querySelector('.orb-1');
const orb2 = document.querySelector('.orb-2');
const isDesktop = window.innerWidth >= 968;

if (isDesktop) {
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        if (orb1) {
            orb1.style.transform = `translateY(${scrollY * 0.3}px)`;
        }
        if (orb2) {
            orb2.style.transform = `translateY(${scrollY * -0.2}px)`;
        }
    }, { passive: true });
}

// --- Typewriter Effect ---
const typewriterElement = document.getElementById('typewriter');
const phrases = [
    'без зусиль!',
    'в один клац!',
    'це просто!',
    'це топ!'
];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typewriterTimeout;

function typeWriter() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
        // Видалення символів
        typewriterElement.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
    } else {
        // Додавання символів
        typewriterElement.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
    }

    // Швидкість друку/видалення
    let delay = isDeleting ? 50 : 100;

    // Логіка переходу
    if (!isDeleting && charIndex === currentPhrase.length) {
        // Пауза після завершення слова
        delay = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        delay = 500;
    }

    typewriterTimeout = setTimeout(typeWriter, delay);
}

// Запуск typewriter після завантаження
if (typewriterElement) {
    setTimeout(typeWriter, 1000);
}

// --- Particles.js Configuration ---
// Вимикаємо на мобільних для продуктивності
const isMobile = window.innerWidth < 768;

if (typeof particlesJS !== 'undefined' && !isMobile) {
    particlesJS('particles-js', {
        particles: {
            number: {
                value: 20,
                density: {
                    enable: true,
                    value_area: 1200
                }
            },
            color: {
                value: '#00C2FF'
            },
            shape: {
                type: 'circle'
            },
            opacity: {
                value: 0.3,
                random: false,
                anim: {
                    enable: false
                }
            },
            size: {
                value: 2,
                random: true,
                anim: {
                    enable: false
                }
            },
            line_linked: {
                enable: true,
                distance: 150,
                color: '#00C2FF',
                opacity: 0.15,
                width: 1
            },
            move: {
                enable: true,
                speed: 0.3,
                direction: 'none',
                random: false,
                straight: false,
                out_mode: 'out',
                bounce: false
            }
        },
        interactivity: {
            detect_on: 'canvas',
            events: {
                onhover: {
                    enable: false
                },
                onclick: {
                    enable: false
                },
                resize: true
            }
        },
        retina_detect: false
    });
}
