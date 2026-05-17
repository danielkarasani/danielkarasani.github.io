// ==========================================
// 1. DYNAMIC TAB TITLE (UX Retention)
// ==========================================
let originalTitle = document.title;
window.addEventListener("blur", () => {
    document.title = "Come back! 👀";
	// Optional: Swap the favicon to a different SVG here
});
window.addEventListener("focus", () => {
    document.title = originalTitle;
});

// ==========================================
// 2. CMD+K COMMAND PALETTE
// ==========================================
const palette = document.getElementById('command-palette');
const paletteInput = document.getElementById('palette-input');

if (palette && paletteInput) {
    document.addEventListener('keydown', (e) => {
        // Listen for Cmd+K (Mac) or Ctrl+K (Windows)
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault(); 
            palette.classList.toggle('palette-visible');
            if (palette.classList.contains('palette-visible')) {
                paletteInput.value = '';
                const items = document.querySelectorAll('#palette-results li');
                items.forEach(item => item.style.display = 'block');
                paletteInput.focus();
            }
        }
        // Close on Escape key
        if (e.key === 'Escape' && palette.classList.contains('palette-visible')) {
            palette.classList.remove('palette-visible');
        }
    });

    palette.addEventListener('click', (e) => {
        if (e.target === palette) palette.classList.remove('palette-visible');
    });

    // Instant Search Filter Logic
    paletteInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        const items = document.querySelectorAll('#palette-results li');
        items.forEach(item => {
            const text = item.textContent.toLowerCase();
            if (text.includes(query)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    });
}

// ==========================================
// 3. HARDWARE ACCELERATED SCROLL REVEAL
// ==========================================
// Close when clicking outside the box
if (document.readyState === 'complete') {
    document.body.classList.add('loaded');
} else {
    window.addEventListener('load', () => { document.body.classList.add('loaded'); });
}

const revealOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15 
};

const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target); 
        }
    });
}, revealOptions);

document.querySelectorAll('.reveal').forEach(element => {
    revealObserver.observe(element);
});

// ==========================================
// 4. CUSTOM CURSOR LOGIC
// ==========================================
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');
let mouseX = 0, mouseY = 0, outlineX = 0, outlineY = 0;

if (cursorDot && cursorOutline) {
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX; mouseY = e.clientY;
        cursorDot.style.left = `${mouseX}px`; cursorDot.style.top = `${mouseY}px`;
    });

    function animateCursor() {
        if (!cursorOutline) return;
        let distX = mouseX - outlineX; let distY = mouseY - outlineY;
        outlineX += distX * 0.15; outlineY += distY * 0.15;
        cursorOutline.style.left = `${outlineX}px`; cursorOutline.style.top = `${outlineY}px`;
        if (window.innerWidth > 990) { requestAnimationFrame(animateCursor); }
    }

    if (window.innerWidth > 990) { animateCursor(); }
    window.addEventListener('resize', () => { 
        if (window.innerWidth > 990 && cursorOutline.style.left === "") { animateCursor(); } 
    });

    const hoverTargets = document.querySelectorAll('.hover-target, a, button, input, textarea');
    hoverTargets.forEach(target => {
        target.addEventListener('mouseenter', () => { document.body.classList.add('cursor-hover'); });
        target.addEventListener('mouseleave', () => { document.body.classList.remove('cursor-hover'); });
    });
}

// ==========================================
// 5. TYPEWRITER EFFECT (Multi-Language)
// ==========================================
const pageLang = document.documentElement.lang; // Detects 'en', 'de', or 'it'
let words = [];

// Load the correct words based on the HTML lang attribute
if (pageLang === 'de') {
    words = ["Realität optimieren.", "Prozesse automatisieren.", "Effizienz steigern.", "Daten transformieren."];
} else if (pageLang === 'it') {
    words = ["Ottimizzare la realtà.", "Automatizzare i processi.", "Guidare l'efficienza.", "Trasformare i dati."];
} else {
    words = ["Optimizing reality.", "Automating processes.", "Driving efficiency.", "Transforming data."]; // Default English
}

let wordIndex = 0; let charIndex = 0; let isDeleting = false;
const typeTarget = document.getElementById("typewriter");

function type() {
    if (!typeTarget) return; 
    const currentWord = words[wordIndex];
    if (isDeleting) { charIndex--; } else { charIndex++; }
    typeTarget.textContent = currentWord.substring(0, charIndex) || "\u200B";
    
    let typeSpeed = isDeleting ? 50 : 100;
    if (!isDeleting && charIndex === currentWord.length) {
        typeSpeed = 2000; isDeleting = true; 
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false; wordIndex = (wordIndex + 1) % words.length; typeSpeed = 500; 
    }
    setTimeout(type, typeSpeed);
}
if (typeTarget) { setTimeout(type, 2500); }

// ==========================================
// 6. 3D TILT CARDS
// ==========================================
const tiltCards = document.querySelectorAll('.tilt-card');
tiltCards.forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left; const y = e.clientY - rect.top;
        const centerX = rect.width / 2; const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -10; 
        const rotateY = ((x - centerX) / centerX) * 10;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    });
});

// ==========================================
// 7. DARK MODE TOGGLE LOGIC
// ==========================================
const themeToggleBtn = document.getElementById('theme-toggle');
const currentTheme = localStorage.getItem('theme');

if (currentTheme === 'dark' && themeToggleBtn) {
    themeToggleBtn.textContent = '☀️';
}

if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        document.documentElement.classList.toggle('dark-theme'); // Backup toggle
        let theme = 'light';
        
        if (document.body.classList.contains('dark-theme')) {
            theme = 'dark';
            themeToggleBtn.textContent = '☀️';
        } else {
            themeToggleBtn.textContent = '🌙';
        }
        localStorage.setItem('theme', theme);
    });
}