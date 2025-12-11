// Ініціалізація анімацій
AOS.init({
    duration: 800,
    once: true,
    offset: 50
});

// --- Функція детекту ОС та оновлення кнопки ---
function detectOS() {
    const userAgent = navigator.userAgent;
    let os = 'Windows'; // За замовчуванням
    let iconClass = 'fa-brands fa-windows';
    let link = '#'; // Твої реальні посилання
    let title = 'Завантажити для Windows';
    let subtitle = 'x64 Installer (.exe)';

    if (/(Mac|iPhone|iPad|iPod)/.test(userAgent)) {
        os = 'macOS';
        iconClass = 'fa-brands fa-apple';
        title = 'Завантажити для macOS';
        subtitle = 'Apple Silicon / Intel (.dmg)';
        // Приклад: link = 'https://link-to-macos.dmg';
    } else if (/Linux/.test(userAgent)) {
        os = 'Linux';
        iconClass = 'fa-brands fa-linux';
        title = 'Завантажити для Linux';
        subtitle = '.deb / .rpm package';
        // Приклад: link = 'https://link-to-linux.deb';
    }
    
    // Елементи
    const mainBtn = document.getElementById('main-download-btn');
    const mainText = document.getElementById('main-download-text');
    const mainSubtitle = document.getElementById('main-download-subtitle');
    const mainIcon = mainBtn.querySelector('i');
    
    // Міні-кнопки
    const linuxMini = document.getElementById('linux-mini-btn');
    const macosMini = document.getElementById('macos-mini-btn');
    
    // Оновлення основної кнопки
    mainBtn.href = link;
    mainIcon.className = iconClass;
    mainText.textContent = title;
    mainSubtitle.textContent = subtitle;

    // Підсвічування міні-кнопок
    [linuxMini, macosMini].forEach(btn => btn.classList.remove('active'));
    
    // Приховати міні-кнопку, яка відповідає головній
    if (os === 'Linux') {
        linuxMini.style.display = 'none';
        macosMini.classList.add('active'); // Підсвітити іншу
    } else if (os === 'macOS') {
        macosMini.style.display = 'none';
        linuxMini.classList.add('active'); // Підсвітити іншу
    } else { // Windows
        linuxMini.classList.add('active');
        macosMini.classList.add('active');
        // На Windows краще підсвітити обидві альтернативи
    }
}

// Запускаємо визначення ОС при завантаженні сторінки
document.addEventListener('DOMContentLoaded', detectOS);


// --- Анімація лічильника цифр ---
const counters = document.querySelectorAll('.counter');
const speed = 200;

counters.forEach(counter => {
    const updateCount = () => {
        const target = +counter.getAttribute('data-target');
        const count = +counter.innerText;
        const inc = target / speed;

        if (count < target) {
            counter.innerText = Math.ceil(count + inc);
            setTimeout(updateCount, 20);
        } else {
            counter.innerText = target;
        }
    };
    
    const observer = new IntersectionObserver((entries) => {
        if(entries[0].isIntersecting) {
            updateCount();
            observer.disconnect();
        }
    });
    observer.observe(counter);
});

// Плавний скрол
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});