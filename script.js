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
        
        // Оновлюємо badge з версією
        const versionText = document.getElementById('version-text');
        if (versionText) {
            versionText.textContent = `${latestData.tag_name} Вже доступна`;
        }
        
        // Отримуємо всі релізи для підрахунку загальних завантажень
        const allReleasesResponse = await fetch('https://api.github.com/repos/Vadko/littlebit-launcher/releases?per_page=100');
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
            const downloadCountEl = document.getElementById('download-count');
            if (downloadCountEl) {
                downloadCountEl.setAttribute('data-target', totalDownloads);
                // Запускаємо анімацію лічильника
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
    const current = +counter.innerText || 0;
    const speed = 200;
    const inc = target / speed;
    
    const updateCount = () => {
        const count = +counter.innerText || 0;
        if (count < target) {
            counter.innerText = Math.ceil(count + inc);
            setTimeout(updateCount, 20);
        } else {
            counter.innerText = target;
        }
    };
    
    if (current < target) {
        updateCount();
    }
}

// --- Анімація лічильника цифр ---
const counters = document.querySelectorAll('.counter');
counters.forEach(counter => {
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

// --- Анімація рамки для карток функцій (як на littlebitua.github.io) ---
document.querySelectorAll('.g-card').forEach(card => {
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
