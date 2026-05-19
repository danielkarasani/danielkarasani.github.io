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
// 2. CMD+K COMMAND PALETTE & SEARCH TOGGLE
// ==========================================
function initCommandPalette() {
    let palette = document.getElementById('command-palette');
    
    // Clear any static/pre-existing command palette to ensure unified dynamic links
    if (palette) {
        palette.remove();
    }
    
    // 1. Dynamically Create & Inject Command Palette
    palette = document.createElement('div');
    palette.id = 'command-palette';
    palette.className = 'palette-hidden';
        
        const pageLang = document.documentElement.lang || "en";
        let placeholder = "Search... (e.g. 'Contact', 'CV', 'About')";
        let itemsHTML = '';
        
        if (pageLang === 'de') {
            placeholder = "Suche... (z.B. 'Kontakt', 'Lebenslauf', 'Über mich')";
            itemsHTML = `
                <li><a href="index-de.html">Startseite / Home</a></li>
                <li><a href="about-de.html">Über mich</a></li>
                <li><a href="blog-de.html">Blog</a></li>
                <li><a href="air-analyzer-de.html">Projekt: Air Analyzer</a></li>
                <li><a href="index-de.html#contact">Zum Kontaktformular springen</a></li>
                <li><a href="Daniel_Karasani_CV.pdf" target="_blank" rel="noopener noreferrer" class="js-local-cv-link">Lebenslauf (CV) PDF herunterladen</a></li>
                <li><a href="index.html">Sprache wechseln: Englisch (English)</a></li>
                <li><a href="index-it.html">Sprache wechseln: Italienisch (Italiano)</a></li>
            `;
        } else if (pageLang === 'it') {
            placeholder = "Cerca... (es. 'Contatti', 'CV', 'Chi Sono')";
            itemsHTML = `
                <li><a href="index-it.html">Home Page</a></li>
                <li><a href="about-it.html">Chi sono</a></li>
                <li><a href="blog-it.html">Blog</a></li>
                <li><a href="air-analyzer-it.html">Progetto: Air Analyzer</a></li>
                <li><a href="index-it.html#contact">Vai al modulo di contatto</a></li>
                <li><a href="Daniel_Karasani_CV.pdf" target="_blank" rel="noopener noreferrer" class="js-local-cv-link">Scarica CV PDF</a></li>
                <li><a href="index.html">Cambia lingua: Inglese (English)</a></li>
                <li><a href="index-de.html">Cambia lingua: Tedesco (Deutsch)</a></li>
            `;
        } else {
            itemsHTML = `
                <li><a href="index.html">Home Page</a></li>
                <li><a href="about.html">About Me</a></li>
                <li><a href="blog.html">Blog</a></li>
                <li><a href="air-analyzer.html">Project: Air Analyzer</a></li>
                <li><a href="index.html#contact">Jump to Contact Form</a></li>
                <li><a href="Daniel_Karasani_CV.pdf" target="_blank" rel="noopener noreferrer" class="js-local-cv-link">Download CV PDF</a></li>
                <li><a href="index-de.html">Switch Language: German (Deutsch)</a></li>
                <li><a href="index-it.html">Switch Language: Italian (Italiano)</a></li>
            `;
        }
        
        palette.innerHTML = `
            <div class="palette-content">
                <input type="text" id="palette-input" placeholder="${placeholder}">
                <ul id="palette-results">
                    ${itemsHTML}
                </ul>
            </div>
        `;
        document.body.appendChild(palette);
        
        // Ensure the newly added CV link has dynamic link listeners applied
        const dynamicCv = palette.querySelector('.js-local-cv-link');
        if (dynamicCv && typeof APP_CONFIG !== 'undefined') {
            dynamicCv.href = APP_CONFIG.localCvPath;
            dynamicCv.addEventListener("click", () => {
                if (typeof gtag === "function") {
                    gtag("event", "click", {
                        "event_category": "Download",
                        "event_label": `Local CV Download ${pageLang.toUpperCase()}`
                    });
                }
            });
        }
    
    const paletteInput = document.getElementById('palette-input');
    if (!paletteInput) return;

    // 2. Dynamically Inject Search Button (🔍) in Header next to theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle && !document.getElementById('search-toggle')) {
        const searchBtn = document.createElement('button');
        searchBtn.id = 'search-toggle';
        searchBtn.className = 'hover-target';
        searchBtn.setAttribute('aria-label', 'Search');
        searchBtn.style.cssText = 'background: none; border: none; font-size: 1.2rem; margin-left: 20px; color: var(--text-dark); transition: var(--transition-fast); cursor: pointer; display: inline-flex; align-items: center; justify-content: center;';
        searchBtn.innerHTML = '🔍';
        
        // Add custom cursor hover listeners
        searchBtn.addEventListener('mouseenter', () => {
            document.body.classList.add('cursor-hover');
        });
        searchBtn.addEventListener('mouseleave', () => {
            document.body.classList.remove('cursor-hover');
        });
        
        // Trigger command palette on tap/click
        searchBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            palette.classList.toggle('palette-visible');
            if (palette.classList.contains('palette-visible')) {
                paletteInput.value = '';
                const items = document.querySelectorAll('#palette-results li');
                items.forEach(item => item.style.display = 'block');
                paletteInput.focus();
            }
        });
        
        themeToggle.parentNode.insertBefore(searchBtn, themeToggle);
    }

    // 3. Register Global Keyboard Shortcuts (Cmd+K / Ctrl+K and Escape)
    document.addEventListener('keydown', (e) => {
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
        if (e.key === 'Escape' && palette.classList.contains('palette-visible')) {
            palette.classList.remove('palette-visible');
        }
    });

    // 4. Dismiss when clicking backdrop
    palette.addEventListener('click', (e) => {
        if (e.target === palette) palette.classList.remove('palette-visible');
    });

    // 5. Instant Search Filtering
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

    // Add cursor-hover class to dynamic palette links
    const paletteLinks = palette.querySelectorAll('a');
    paletteLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            document.body.classList.add('cursor-hover');
        });
        link.addEventListener('mouseleave', () => {
            document.body.classList.remove('cursor-hover');
        });
    });
}

// Run palette initialization
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCommandPalette);
} else {
    initCommandPalette();
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