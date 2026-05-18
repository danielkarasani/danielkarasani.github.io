// ==========================================
// 0. CENTRALIZED CONFIGURATION ("JS Brain")
// ==========================================
const APP_CONFIG = {
    cloudCvLink: "https://e.pcloud.link/publink/show?code=XZpKJrZH5ORGlFrt08s2ydJNPalt48JPirV",
    cloudDocLink: "https://e.pcloud.link/publink/show?code=XZRdJrZip1FWlOLtK87Iev3mcasHJQRvYPk",
    localCvPath: "Daniel_Karasani_CV.pdf"
};

function initDynamicLinks() {
    // Inject hrefs
    document.querySelectorAll(".js-cloud-cv-link").forEach(el => {
        el.href = APP_CONFIG.cloudCvLink;
    });
    document.querySelectorAll(".js-cloud-doc-link").forEach(el => {
        el.href = APP_CONFIG.cloudDocLink;
    });
    document.querySelectorAll(".js-local-cv-link").forEach(el => {
        el.href = APP_CONFIG.localCvPath;
    });

    // Centralized Google Analytics Event Tracking
    const pageLang = document.documentElement.lang || "en";
    
    document.querySelectorAll(".js-cloud-cv-link").forEach(el => {
        el.addEventListener("click", () => {
            if (typeof gtag === "function") {
                gtag("event", "click", {
                    "event_category": "Outbound Link",
                    "event_label": `Cloud CV View ${pageLang.toUpperCase()}`
                });
            }
        });
    });

    document.querySelectorAll(".js-local-cv-link").forEach(el => {
        el.addEventListener("click", () => {
            if (typeof gtag === "function") {
                gtag("event", "click", {
                    "event_category": "Download",
                    "event_label": `Local CV Download ${pageLang.toUpperCase()}`
                });
            }
        });
    });

    document.querySelectorAll(".js-cloud-doc-link").forEach(el => {
        el.addEventListener("click", () => {
            if (typeof gtag === "function") {
                gtag("event", "click", {
                    "event_category": "Outbound Link",
                    "event_label": `Air Analyzer Doc Download ${pageLang.toUpperCase()}`
                });
            }
        });
    });
}

// Run link initialization once DOM is parsed
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDynamicLinks);
} else {
    initDynamicLinks();
}

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
const hidePreloader = () => {
    if (!document.body.classList.contains('loaded')) {
        document.body.classList.add('loaded');
    }
};

if (document.readyState === 'complete') {
    hidePreloader();
} else {
    window.addEventListener('load', hidePreloader);
    // Failsafe timeout to prevent preloader lock if external assets hang
    setTimeout(hidePreloader, 2000);
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

const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (window.matchMedia("(pointer: coarse)").matches);

if (cursorDot && cursorOutline) {
    if (isTouchDevice || window.innerWidth <= 990) {
        cursorDot.style.display = 'none';
        cursorOutline.style.display = 'none';
    } else {
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

        animateCursor();

        window.addEventListener('resize', () => { 
            if (window.innerWidth > 990 && cursorOutline.style.left === "") { animateCursor(); } 
        });

        const hoverTargets = document.querySelectorAll('.hover-target, a, button, input, textarea');
        hoverTargets.forEach(target => {
            target.addEventListener('mouseenter', () => { document.body.classList.add('cursor-hover'); });
            target.addEventListener('mouseleave', () => { document.body.classList.remove('cursor-hover'); });
        });
    }
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

// ==========================================
// 8. DYNAMIC BLOG MARKDOWN READER
// ==========================================
window.openPost = async function(filename) {
    const modal = document.getElementById('blog-modal');
    const reader = document.getElementById('md-reader');
    
    if (!modal || !reader) return;
    
    const pageLang = document.documentElement.lang || "en";
    let loadingText = '<i>Fetching data from repository...</i>';
    let errorHTML = '<h2 style="color: red;">Error 404</h2><p>Could not load the requested document. Ensure the markdown file exists in the /posts directory.</p>';
    
    if (pageLang === 'de') {
        loadingText = '<i>Lade Daten aus Repository...</i>';
        errorHTML = '<h2 style="color: red;">Fehler 404</h2><p>Das angeforderte Dokument konnte nicht geladen werden. Stellen Sie sicher, dass die Markdown-Datei im Verzeichnis /posts existiert.</p>';
    } else if (pageLang === 'it') {
        loadingText = '<i>Caricamento in corso dal repository...</i>';
        errorHTML = '<h2 style="color: red;">Errore 404</h2><p>Impossibile caricare il documento richiesto. Assicurati che il file markdown esista nella cartella /posts.</p>';
    }
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; 
    reader.innerHTML = loadingText;

    try {
        const response = await fetch(`posts/${filename}`);
        if (!response.ok) throw new Error('Post not found on server.');
        
        const markdownText = await response.text();
        if (typeof marked !== 'undefined') {
            reader.innerHTML = marked.parse(markdownText);
        } else {
            reader.innerHTML = `<pre style="white-space: pre-wrap; font-family: monospace;">${markdownText}</pre>`;
        }

        // --- NEW: RE-APPLY CURSOR HOVER EFFECT TO DYNAMIC LINKS ---
        const newLinks = reader.querySelectorAll('a');
        newLinks.forEach(link => {
            link.addEventListener('mouseenter', () => { document.body.classList.add('cursor-hover'); });
            link.addEventListener('mouseleave', () => { document.body.classList.remove('cursor-hover'); });
        });
    } catch (error) {
        console.error(error);
        reader.innerHTML = errorHTML;
    }
};


window.closePost = function() {
    const modal = document.getElementById('blog-modal');
    const reader = document.getElementById('md-reader');
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = 'auto'; 
    if (reader) {
        setTimeout(() => { reader.innerHTML = ''; }, 500);
    }
};

// ==========================================
// 9. DYNAMIC MOBILE NAVIGATION
// ==========================================
function initMobileNav() {
    const navContainer = document.querySelector('.nav-container');
    const navLinks = document.querySelector('.nav-links');
    
    if (!navContainer || !navLinks) return;

    // 1. Create Hamburger Button
    const hamburger = document.createElement('button');
    hamburger.className = 'hamburger-menu hover-target';
    hamburger.setAttribute('aria-label', 'Toggle Menu');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.innerHTML = `
        <span></span>
        <span></span>
        <span></span>
    `;

    // Add cursor hover listeners for custom cursor
    hamburger.addEventListener('mouseenter', () => {
        document.body.classList.add('cursor-hover');
    });
    hamburger.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-hover');
    });



    // Append Hamburger to Navigation Container
    navContainer.appendChild(hamburger);

    // 3. Toggle Menu Function
    function toggleMenu() {
        const isActive = navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
        hamburger.setAttribute('aria-expanded', isActive ? 'true' : 'false');
    }

    // 4. Close Menu Function
    function closeMenu() {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
        document.body.classList.remove('no-scroll');
        hamburger.setAttribute('aria-expanded', 'false');
    }

    // Toggle on Hamburger Click
    hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
    });

    // Close menu when clicking navigation links
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            closeMenu();
        });
    });

    // Close menu when clicking outside of the active menu drawer
    document.addEventListener('click', (e) => {
        if (navLinks.classList.contains('active') && 
            !navLinks.contains(e.target) && 
            !hamburger.contains(e.target)) {
            closeMenu();
        }
    });

    // Close menu on Escape key press
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            closeMenu();
        }
    });
}

// Run mobile nav initialization
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileNav);
} else {
    initMobileNav();
}