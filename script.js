// ==========================================
// 0. CENTRALIZED CONFIGURATION ("JS Brain")
// ==========================================
const APP_CONFIG = {
    cloudCvLink: "https://e.pcloud.link/publink/show?code=XZpKJrZH5ORGlFrt08s2ydJNPalt48JPirV",
    cloudDocLink: "https://e.pcloud.link/publink/show?code=XZRdJrZip1FWlOLtK87Iev3mcasHJQRvYPk",
    localCvPath: "Daniel_Karasani_CV.pdf"
};

// Reusable high-performance event debouncing utility
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

// ==========================================
// 0.5 SCROLL READING PROGRESS BAR
// ==========================================
// The bar is primarily driven by CSS `animation-timeline: scroll(root)` —
// a native browser feature that requires zero JavaScript.
// This function provides a passive JS fallback for browsers that do not
// yet support Scroll-Driven Animations (Safari < 15.4, older Firefox).
function initScrollProgressBar() {
    const bar  = document.querySelector('.scroll-progress-bar');
    const fill = document.querySelector('.scroll-progress-fill');
    if (!bar || !fill) return;

    // If the browser natively supports CSS Scroll-Driven Animations,
    // let the stylesheet handle everything — no JS overhead needed.
    if (
        typeof CSS !== 'undefined' &&
        CSS.supports &&
        (CSS.supports('animation-timeline', 'scroll()') ||
         CSS.supports('animation-timeline', 'scroll(root)'))
    ) {
        return;
    }

    // Fallback: JS-driven progress for older browsers.
    // Mark the nav so CSS suppresses the non-functional CSS animation.
    const nav = bar.closest('nav');
    if (nav) nav.classList.add('js-progress-active');

    function updateProgress() {
        const scrolled = window.scrollY || document.documentElement.scrollTop;
        const total = document.documentElement.scrollHeight - window.innerHeight;
        const progress = total > 0 ? scrolled / total : 0;
        fill.style.transform = `scaleX(${progress})`;
    }

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress(); // Set initial state
}

// Run once DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollProgressBar);
} else {
    initScrollProgressBar();
}

// ==========================================
// 0.6 AUTO-HIDE NAV ON MOBILE SCROLL
// ==========================================
// On mobile (≤990px), hides the nav when scrolling down and reveals it
// when scrolling up. The 3px progress bar remains visible at all times.
function initAutoHideNav() {
    const nav = document.querySelector('nav');
    if (!nav) return;

    let lastScrollY = 0;
    const scrollThreshold = 10; // px of scroll required before toggling

    function handleScroll() {
        // Only auto-hide on mobile widths
        if (window.innerWidth > 990) {
            nav.classList.remove('nav-hidden');
            return;
        }

        const currentScrollY = window.scrollY || document.documentElement.scrollTop;
        const delta = currentScrollY - lastScrollY;

        // Don't hide at the very top of the page
        if (currentScrollY <= 60) {
            nav.classList.remove('nav-hidden');
            lastScrollY = currentScrollY;
            return;
        }

        // Don't toggle if the mobile drawer is open
        const navLinks = document.querySelector('.nav-links');
        if (navLinks && navLinks.classList.contains('active')) {
            lastScrollY = currentScrollY;
            return;
        }

        if (delta > scrollThreshold) {
            // Scrolling DOWN → hide nav
            nav.classList.add('nav-hidden');
            lastScrollY = currentScrollY;
        } else if (delta < -scrollThreshold) {
            // Scrolling UP → show nav
            nav.classList.remove('nav-hidden');
            lastScrollY = currentScrollY;
        }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAutoHideNav);
} else {
    initAutoHideNav();
}

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
            if (typeof window.gtag === "function") {
                window.gtag("event", "click", {
                    "event_category": "Outbound Link",
                    "event_label": `Cloud CV View ${pageLang.toUpperCase()}`
                });
            }
        });
    });

    document.querySelectorAll(".js-local-cv-link").forEach(el => {
        el.addEventListener("click", () => {
            if (typeof window.gtag === "function") {
                window.gtag("event", "click", {
                    "event_category": "Download",
                    "event_label": `Local CV Download ${pageLang.toUpperCase()}`
                });
            }
        });
    });

    document.querySelectorAll(".js-cloud-doc-link").forEach(el => {
        el.addEventListener("click", () => {
            if (typeof window.gtag === "function") {
                window.gtag("event", "click", {
                    "event_category": "Outbound Link",
                    "event_label": `Air Analyzer Doc Download ${pageLang.toUpperCase()}`
                });
            }
        });
    });

    // Global Language Switcher Listener for local storage sync
    document.querySelectorAll(".lang-switcher a").forEach(link => {
        link.addEventListener("click", (e) => {
            const text = e.target.textContent.trim().toLowerCase();
            if (text === 'en' || text === 'de' || text === 'it') {
                localStorage.setItem('lang', text);
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
let titleBeforeBlur = document.title;
window.addEventListener("blur", () => {
    titleBeforeBlur = document.title;
    const pageLang = document.documentElement.lang || "en";
    if (pageLang === 'de') {
        document.title = "Komm zurück! 👀";
    } else if (pageLang === 'it') {
        document.title = "Torna presto! 👀";
    } else {
        document.title = "Come back! 👀";
    }
});
window.addEventListener("focus", () => {
    document.title = titleBeforeBlur;
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
    palette.style.display = 'none';
        
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
        <div class="palette-content" style="position: relative;">
            <button id="palette-close" class="hover-target" aria-label="Close search" style="position: absolute; top: 18px; right: 20px; background: none; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 50%; padding: 0; transition: background 0.2s, transform 0.2s; z-index: 10;">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display: block; color: var(--text-dark);"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            <input type="text" id="palette-input" placeholder="${placeholder}" style="padding-right: 60px !important;">
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
            if (typeof window.gtag === "function") {
                window.gtag("event", "click", {
                    "event_category": "Download",
                    "event_label": `Local CV Download ${pageLang.toUpperCase()}`
                });
            }
        });
    }
    
    const paletteInput = document.getElementById('palette-input');
    if (!paletteInput) return;

    // Cache list items once to prevent DOM queries on every keystroke
    const paletteItems = Array.from(palette.querySelectorAll('#palette-results li'));

    let activeSearchIndex = -1;

    function getVisibleItems() {
        return paletteItems.filter(item => item.style.display !== 'none');
    }

    function updateSelection() {
        const visibleItems = getVisibleItems();
        visibleItems.forEach((item, index) => {
            if (index === activeSearchIndex) {
                item.classList.add('selected');
                item.scrollIntoView({ block: 'nearest' });
            } else {
                item.classList.remove('selected');
            }
        });
    }

    // Helper functions for unified open/close management
    function openPalette() {
        palette.style.display = 'flex';
        void palette.offsetHeight; // Force reflow to register the display style change before opacity transition
        palette.classList.add('palette-visible');
        document.body.classList.add('no-scroll');
        
        // Auto-dismiss mobile drawer if active to prevent overlapping layouts
        const navLinks = document.querySelector('.nav-links');
        const hamburger = document.querySelector('.hamburger-menu');
        if (navLinks && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            if (hamburger) {
                hamburger.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            }
        }
        
        paletteInput.value = '';
        paletteItems.forEach(item => {
            item.style.display = 'block';
            item.classList.remove('selected');
        });
        activeSearchIndex = 0;
        updateSelection();
        setTimeout(() => paletteInput.focus(), 50);
    }
    
    function closePalette() {
        palette.classList.remove('palette-visible');
        document.body.classList.remove('no-scroll');
        paletteItems.forEach(item => item.classList.remove('selected'));
        activeSearchIndex = -1;
        
        // Wait for the opacity transition (0.2s) to finish before setting display: none
        setTimeout(() => {
            if (!palette.classList.contains('palette-visible')) {
                palette.style.display = 'none';
            }
        }, 200);
    }

    // 2. Dynamically Inject Search Button in Header next to theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle && !document.getElementById('search-toggle')) {
        const searchBtn = document.createElement('button');
        searchBtn.id = 'search-toggle';
        searchBtn.className = 'hover-target';
        searchBtn.setAttribute('aria-label', 'Search');
        
        // Beautiful, responsive touch target centering & margin matching
        searchBtn.style.cssText = 'background: none; border: none; margin-left: 20px; color: var(--text-dark); transition: var(--transition-fast); cursor: pointer; display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 50%; padding: 0;';
        
        // Crisp, high-contrast, perfectly-centered vector SVG instead of emoji
        searchBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display: block; color: var(--text-dark);"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`;
        
        // Toggle command palette on click
        searchBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (palette.classList.contains('palette-visible')) {
                closePalette();
            } else {
                openPalette();
            }
        });
        
        themeToggle.parentNode.insertBefore(searchBtn, themeToggle);
    }

    // 3. Register Global Keyboard Shortcuts (Cmd+K / Ctrl+K and Escape)
    document.addEventListener('keydown', (e) => {
        const isVisible = palette.classList.contains('palette-visible');
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault(); 
            if (isVisible) {
                closePalette();
            } else {
                openPalette();
            }
            return;
        }
        if (e.key === 'Escape' && isVisible) {
            closePalette();
            return;
        }

        if (isVisible) {
            const visibleItems = getVisibleItems();
            if (visibleItems.length === 0) return;

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                activeSearchIndex = (activeSearchIndex + 1) % visibleItems.length;
                updateSelection();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                activeSearchIndex = (activeSearchIndex - 1 + visibleItems.length) % visibleItems.length;
                updateSelection();
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (activeSearchIndex >= 0 && activeSearchIndex < visibleItems.length) {
                    const activeLink = visibleItems[activeSearchIndex].querySelector('a');
                    if (activeLink) {
                        activeLink.click();
                        closePalette();
                    }
                }
            }
        }
    });

    // 4. Close Palette Button click
    const closeBtn = document.getElementById('palette-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            closePalette();
        });
    }

    // 5. Dismiss when clicking backdrop or selecting a search result link
    palette.addEventListener('click', (e) => {
        if (e.target === palette || e.target.closest('#palette-results a')) {
            closePalette();
        }
    });

    // 6. Instant Search Filtering (Debounced to prevent typing stutter)
    paletteInput.addEventListener('input', debounce((e) => {
        const query = e.target.value.toLowerCase().trim();
        paletteItems.forEach(item => {
            const text = item.textContent.toLowerCase();
            if (text.includes(query)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
            item.classList.remove('selected');
        });
        activeSearchIndex = 0;
        updateSelection();
    }, 100));
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
        try {
            sessionStorage.setItem('preloader-completed', 'true');
        } catch (e) {
            console.warn("Could not save sessionStorage state:", e);
        }
    }
};

if (document.readyState === 'complete') {
    hidePreloader();
} else {
    window.addEventListener('load', hidePreloader);
    // Failsafe timeout to prevent preloader lock if external assets hang
    setTimeout(hidePreloader, 2000);
}

function initRevealObserver() {
    const revealOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0 
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
}
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initRevealObserver);
} else {
    initRevealObserver();
}

// ==========================================
// 4. CUSTOM CURSOR LOGIC (Touch/Desktop Adaptive)
// ==========================================
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

if (cursorDot && cursorOutline) {
    let mouseX = 0, mouseY = 0, outlineX = 0, outlineY = 0;
    let isCursorActive = false;
    let isLoopRunning = false;
    let cursorIdleTimer = null;

    const animateCursor = function() {
        if (!isLoopRunning) return;
        let distX = mouseX - outlineX;
        let distY = mouseY - outlineY;
        outlineX += distX * 0.15;
        outlineY += distY * 0.15;
        
        cursorOutline.style.transform = `translate3d(${outlineX}px, ${outlineY}px, 0) translate(-50%, -50%)`;
        requestAnimationFrame(animateCursor);
    };

    // Only activate cursor logic on mouse movement above 990px (Desktop)
    window.addEventListener('mousemove', (e) => {
        if (window.innerWidth <= 990) return;

        mouseX = e.clientX;
        mouseY = e.clientY;
        
        cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;

        if (!isCursorActive) {
            isCursorActive = true;
            document.body.classList.add('custom-cursor-active');
            cursorDot.style.opacity = '1';
            cursorOutline.style.opacity = '1';
        }

        clearTimeout(cursorIdleTimer);
        cursorIdleTimer = setTimeout(() => { isLoopRunning = false; }, 200);

        if (!isLoopRunning) {
            isLoopRunning = true;
            outlineX = mouseX;
            outlineY = mouseY;
            animateCursor();
        }
    }, { passive: true });

    // Instantly hide custom cursor if touch interaction occurs (Surface/Touchscreen Laptops)
    window.addEventListener('touchstart', () => {
        if (isCursorActive) {
            isCursorActive = false;
            isLoopRunning = false;
            document.body.classList.remove('custom-cursor-active');
            cursorDot.style.opacity = '0';
            cursorOutline.style.opacity = '0';
        }
    }, { passive: true });

    // High-performance event delegation for hover states
    document.addEventListener('mouseover', (e) => {
        if (window.innerWidth > 990 && e.target.closest('.hover-target, a, button, input, textarea')) {
            document.body.classList.add('cursor-hover');
        }
    });

    document.addEventListener('mouseout', (e) => {
        const target = e.target.closest('.hover-target, a, button, input, textarea');
        if (window.innerWidth > 990 && target) {
            // Prevent flicker when moving between a parent and its child
            if (e.relatedTarget && target.contains(e.relatedTarget)) return;
            document.body.classList.remove('cursor-hover');
        }
    });
}

// ==========================================
// 5. TYPEWRITER EFFECT (Multi-Language)
// ==========================================
const pageLang = document.documentElement.lang; // Detects 'en', 'de', or 'it'
let words = ["Industrial Engineer", "Curious Learner", "Problem Solver"];
if (pageLang === 'de') {
    words = ["Wirtschaftsingenieur", "Neugieriger Lerner", "Problemlöser"];
} else if (pageLang === 'it') {
    words = ["Ingegnere Gestionale", "Apprendista Curioso", "Risolutore di Problemi"];
}
let wordIndex = 0; let charIndex = 0; let isDeleting = false;
const typeTarget = document.getElementById("typewriter");
let isTypewriterVisible = true;
let typewriterTimeout = null;

function type() {
    if (!typeTarget || !isTypewriterVisible) return; 
    const currentWord = words[wordIndex];
    if (isDeleting) { charIndex--; } else { charIndex++; }
    typeTarget.textContent = currentWord.substring(0, charIndex) || "\u200B";
    
    let typeSpeed = isDeleting ? 50 : 100;
    if (!isDeleting && charIndex === currentWord.length) {
        typeSpeed = 2000; isDeleting = true; 
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false; wordIndex = (wordIndex + 1) % words.length; typeSpeed = 500; 
    }
    typewriterTimeout = setTimeout(type, typeSpeed);
}

if (typeTarget) { 
    const observer = new IntersectionObserver((entries) => {
        isTypewriterVisible = entries[0].isIntersecting;
        if (isTypewriterVisible) {
            clearTimeout(typewriterTimeout);
            type();
        }
    }, { threshold: 0.1 });
    
    const heroSection = typeTarget.closest('.hero');
    if (heroSection) observer.observe(heroSection);
}

// ==========================================
// 6. 3D TILT CARDS
// ==========================================
function initTiltCards() {
    const tiltCards = document.querySelectorAll('.tilt-card');
    tiltCards.forEach(card => {
        let rect = null;
        card.addEventListener('mouseenter', () => {
            rect = card.getBoundingClientRect();
        });
        card.addEventListener('mousemove', e => {
            if (!rect) {
                rect = card.getBoundingClientRect();
            }
            const x = e.clientX - rect.left; const y = e.clientY - rect.top;
            const centerX = rect.width / 2; const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -10; 
            const rotateY = ((x - centerX) / centerX) * 10;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        card.addEventListener('mouseleave', () => {
            rect = null;
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });
    });
}
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTiltCards);
} else {
    initTiltCards();
}

// ==========================================
// 7. DARK MODE TOGGLE LOGIC
// ==========================================
const themeToggleBtn = document.getElementById('theme-toggle');
const currentTheme = localStorage.getItem('theme');
const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

if (currentTheme === 'dark' || (!currentTheme && systemPrefersDark)) {
    document.body.classList.add('dark-theme');
    document.documentElement.classList.add('dark-theme');
    if (themeToggleBtn) themeToggleBtn.textContent = '☀️';
} else {
    document.body.classList.remove('dark-theme');
    document.documentElement.classList.remove('dark-theme');
    if (themeToggleBtn) themeToggleBtn.textContent = '🌙';
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

// Handle browser back/forward buttons
window.addEventListener('popstate', (e) => {
    const url = new URL(window.location);
    const postFile = url.searchParams.get('post');
    const modal = document.getElementById('blog-modal');
    
    if (postFile) {
        if (!modal || !modal.classList.contains('active')) {
            window.openPost(postFile, false); 
        }
    } else {
        if (modal && modal.classList.contains('active')) {
            window.closePost(false); 
        }
    }
});

// Auto-open post if present in URL on load
document.addEventListener('DOMContentLoaded', () => {
    const url = new URL(window.location);
    const postFile = url.searchParams.get('post');
    if (postFile) {
        setTimeout(() => window.openPost(postFile, false), 500);
    }
});

window.openPost = async function(filename, pushHistory = true) {
    const modal = document.getElementById('blog-modal');
    const reader = document.getElementById('md-reader');
    
    if (!modal || !reader) return;
    
    // Path traversal protection
    if (typeof filename !== 'string' || filename.includes('/') || filename.includes('\\') || filename.includes('..')) {
        console.error("Invalid post filename");
        return;
    }
    
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
    document.body.classList.add('no-scroll'); 
    reader.innerHTML = loadingText;

    // Update URL query parameter
    if (pushHistory) {
        try {
            const url = new URL(window.location);
            if (url.searchParams.get('post') !== filename) {
                url.searchParams.set('post', filename);
                window.history.pushState({}, '', url);
            }
        } catch (e) {
            console.warn("Could not update state URL:", e);
        }
    }

    try {
        const response = await fetch(`posts/${filename}`);
        if (!response.ok) throw new Error('Post not found on server.');
        
        const markdownText = await response.text();
        if (typeof window.marked !== 'undefined') {
            reader.innerHTML = window.marked.parse(markdownText);
        } else {
            reader.innerHTML = `<pre style="white-space: pre-wrap; font-family: monospace;">${markdownText.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>`;
        }

        // Dynamically extract the article's top-level header and update the browser tab title
        const matchTitle = markdownText.match(/^#\s+(.+)$/m);
        if (matchTitle) {
            const postTitle = matchTitle[1].trim();
            document.title = `${postTitle} | The Logic Log`;
        }

    } catch (error) {
        console.error(error);
        reader.innerHTML = errorHTML;
    }
};


window.closePost = function(pushHistory = true) {
    const modal = document.getElementById('blog-modal');
    const reader = document.getElementById('md-reader');
    if (!modal) return;
    modal.classList.remove('active');
    document.body.classList.remove('no-scroll'); 
    if (reader) {
        setTimeout(() => { reader.innerHTML = ''; }, 500);
    }
    
    // Restore the browser tab title to the original page title
    if (typeof originalTitle !== 'undefined') {
        document.title = originalTitle;
    }

    // Remove URL query parameter
    if (pushHistory) {
        try {
            const url = new URL(window.location);
            if (url.searchParams.has('post')) {
                url.searchParams.delete('post');
                window.history.pushState({}, '', url);
            }
        } catch (e) {
            console.warn("Could not update state URL:", e);
        }
    }
};

// ==========================================
// 9. DYNAMIC MOBILE NAVIGATION
// ==========================================
function initMobileNav() {
    const navContainer = document.querySelector('.nav-container');
    const navLinks = document.querySelector('.nav-links');
    const nav = document.querySelector('nav');
    
    if (!navContainer || !navLinks || !nav) return;
    if (document.querySelector('.hamburger-menu')) return;

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

    // Append Hamburger to Navigation Container
    navContainer.appendChild(hamburger);

    // 3. Toggle Menu Function
    function toggleMenu() {
        const isActive = navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
        nav.classList.toggle('menu-open', isActive);
        document.body.classList.toggle('no-scroll', isActive);
        hamburger.setAttribute('aria-expanded', isActive ? 'true' : 'false');
    }

    // 4. Close Menu Function
    function closeMenu() {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
        nav.classList.remove('menu-open');
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

// ==========================================
// 6. CONTACT FORM AJAX SUBMISSION & SUCCESS CARD
// ==========================================
const contactTranslations = {
    en: {
        sending: "Sending...",
        successTitle: "Message Sent!",
        successText: "Thank you for reaching out! Your message has been received successfully. I will review your inquiry and respond to you as soon as possible.",
        resetBtn: "Send Another Message",
        error: "Something went wrong. Please try again."
    },
    de: {
        sending: "Wird gesendet...",
        successTitle: "Nachricht Gesendet!",
        successText: "Vielen Dank für Ihre Kontaktaufnahme! Ihre Nachricht wurde erfolgreich empfangen. Ich werde Ihre Anfrage prüfen und mich so schnell wie möglich bei Ihnen melden.",
        resetBtn: "Weitere Nachricht senden",
        error: "Etwas ist schief gelaufen. Bitte versuchen Sie es erneut."
    },
    it: {
        sending: "Invio in corso...",
        successTitle: "Messaggio Inviato!",
        successText: "Grazie per avermi contattato! Il tuo messaggio è stato ricevuto con successo. Analizzerò la tua richiesta e ti risponderò il prima possibile.",
        resetBtn: "Invia un altro messaggio",
        error: "Qualcosa è andato storto. Riprova più tardi."
    }
};

function initContactForm() {
    const contactForm = document.querySelector('.contact-box form');
    if (!contactForm) return;

    const contactBox = document.querySelector('.contact-box');
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    if (!submitBtn) return;

    const originalBtnHTML = submitBtn.innerHTML;
    const pageLang = document.documentElement.lang || "en";
    const t = contactTranslations[pageLang] || contactTranslations.en;

    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // 1. Prepare payload BEFORE disabling inputs so they are included in FormData
        const formData = new FormData(contactForm);
        const object = Object.fromEntries(formData);
        const json = JSON.stringify(object);

        // 2. Enter sending/loading state
        submitBtn.disabled = true;
        contactForm.querySelectorAll('input, textarea').forEach(el => el.disabled = true);
        submitBtn.innerHTML = `<span class="btn-spinner"></span>${t.sending}`;

        // 3. Post to Web3Forms API
        fetch("https://api.web3forms.com/submit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: json
        })
        .then(async (response) => {
            const result = await response.json();
            if (response.status === 200 && result.success) {
                // 4. Success Animation Transition
                contactForm.classList.add('contact-fade-out');
                
                setTimeout(() => {
                    contactForm.style.display = 'none';
                    
                    // Create beautiful success card
                    const thankYouCard = document.createElement('div');
                    thankYouCard.className = 'thank-you-card';
                    thankYouCard.innerHTML = `
                        <div class="success-animation">
                            <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                                <circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
                                <path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                            </svg>
                        </div>
                        <h3>${t.successTitle}</h3>
                        <p>${t.successText}</p>
                        <button class="btn hover-target" id="btn-reset-form" style="padding: 14px 28px; font-size: 1rem;">${t.resetBtn}</button>
                    `;
                    
                    contactBox.appendChild(thankYouCard);

                    // Add reset button listener
                    const resetBtn = thankYouCard.querySelector('#btn-reset-form');
                    if (resetBtn) {
                        resetBtn.addEventListener('click', function () {
                            // Fade out thank you card
                            thankYouCard.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                            thankYouCard.style.opacity = '0';
                            thankYouCard.style.transform = 'scale(0.95)';
                            
                            setTimeout(() => {
                                thankYouCard.remove();
                                
                                // Reset form values and UI states
                                contactForm.reset();
                                contactForm.style.display = 'block';
                                
                                // Clean up states
                                setTimeout(() => {
                                    contactForm.classList.remove('contact-fade-out');
                                    submitBtn.disabled = false;
                                    contactForm.querySelectorAll('input, textarea').forEach(el => el.disabled = false);
                                    submitBtn.innerHTML = originalBtnHTML;
                                }, 50);
                            }, 400);
                        });
                    }
                }, 400);

            } else {
                // Handle API error state
                window.alert(t.error);
                resetSubmitButton();
            }
        })
        .catch(error => {
            console.error("Error submitting form:", error);
            window.alert(t.error);
            resetSubmitButton();
        });
    });

    function resetSubmitButton() {
        submitBtn.disabled = false;
        contactForm.querySelectorAll('input, textarea').forEach(el => el.disabled = false);
        submitBtn.innerHTML = originalBtnHTML;
    }
}

// ==========================================
// 9.5 DYNAMIC JSON-BASED BLOG FEED
// ==========================================
async function initDynamicBlogFeed() {
    const grid = document.querySelector('.blog-grid');
    if (!grid) return;

    const lang = document.documentElement.lang || "en";

    const readBtnTranslations = {
        en: "Read Article",
        de: "Artikel lesen",
        it: "Leggi l'articolo"
    };
    const readText = readBtnTranslations[lang] || readBtnTranslations.en;

    const loadingTranslations = {
        en: "Loading engineering insights...",
        de: "Lade Blog-Beiträge...",
        it: "Caricamento articoli..."
    };

    const noscriptElement = grid.querySelector('noscript');
    grid.innerHTML = `<div class="blog-loading-message" style="grid-column: 1/-1; text-align: center; padding: 40px; font-family: monospace; font-size: 1.1rem; color: var(--text-muted);">${loadingTranslations[lang] || loadingTranslations.en}</div>`;
    if (noscriptElement) {
        grid.appendChild(noscriptElement);
    }

    try {
        const response = await fetch('blog-posts.json');
        if (!response.ok) throw new Error('Failed to load blog posts metadata.');
        const posts = await response.json();

        const filteredPosts = posts.filter(post => post.languages && post.languages.includes(lang));

        function escapeHTML(str) {
            if (!str) return '';
            return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
        }

        let cardsHTML = '';
        filteredPosts.forEach(post => {
            const dateStr = post.date[lang] || post.date.en;
            const titleStr = post.title[lang] || post.title.en;
            const descStr = post.description[lang] || post.description.en;
            
            const catStr = post.category || 'General Topics';
            cardsHTML += `
                <a href="posts/${post.id}" data-category="${escapeHTML(catStr)}" class="blog-card hover-target" onclick="event.preventDefault(); openPost('${post.id}')">
                    <span class="blog-date">${escapeHTML(dateStr)}</span>
                    <h3>${escapeHTML(titleStr)}</h3>
                    <p>${escapeHTML(descStr)}</p>
                    <span class="project-link">${readText} <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12 5 19 12 12 19"></polyline>
                        </svg></span>
                </a>
            `;
        });

        grid.innerHTML = cardsHTML;
        if (noscriptElement) {
            grid.appendChild(noscriptElement);
        }

        initBlogSorting();
        prefetchBlogPosts();

        const urlParams = new URLSearchParams(window.location.search);
        const postParam = urlParams.get('post');
        if (postParam) {
            window.openPost(postParam);
        }

    } catch (error) {
        console.error("Error loading dynamic blog feed:", error);
        const errorTranslations = {
            en: 'Could not load blog posts. Please refresh or try again later.',
            de: 'Blog-Beiträge konnten nicht geladen werden. Bitte aktualisieren oder versuchen Sie es später erneut.',
            it: 'Impossibile caricare gli articoli del blog. Aggiorna la pagina o riprova più tardi.'
        };
        grid.innerHTML = `<div class="blog-error-message" style="grid-column: 1/-1; text-align: center; padding: 40px; font-family: monospace; font-size: 1.1rem; color: #ff5555;">${errorTranslations[lang] || errorTranslations.en}</div>`;
        if (noscriptElement) {
            grid.appendChild(noscriptElement);
        }
    }
}

// ==========================================
// 10. CLIENT-SIDE BLOG SORTING
// ==========================================
function initBlogSorting() {
    const sortSelect = document.getElementById('blogSortSelect');
    const searchInput = document.getElementById('blogSearchInput');
    const grid = document.querySelector('.blog-grid');
    if (!grid) return;

    // Keep a copy of original card nodes in their initial manual order
    const originalCards = Array.from(grid.querySelectorAll('.blog-card'));
    const filterBtns = document.querySelectorAll('.filter-btn');
    let activeCategory = 'all';

    function applyFilters() {
        const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
        const cards = grid.querySelectorAll('.blog-card');
        
        cards.forEach(card => {
            const dateText = (card.querySelector('.blog-date')?.textContent || '').toLowerCase();
            const titleText = (card.querySelector('h3')?.textContent || '').toLowerCase();
            const descText = (card.querySelector('p')?.textContent || '').toLowerCase();
            const categoryAttr = card.dataset.category || 'General Topics';
            
            const matchesSearch = !query || dateText.includes(query) || titleText.includes(query) || descText.includes(query);
            
            const matchesCategory = activeCategory === 'all' || categoryAttr === activeCategory;

            if (matchesSearch && matchesCategory) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });
    }

    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                filterBtns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                activeCategory = e.target.dataset.filter;
                applyFilters();
            });
        });
    }



    // Helper to parse date strings (e.g. "May 19, 2026", "19. Mai 2026", "19 Maggio 2026") into Date objects
    function parseDate(card) {
        const dateSpan = card.querySelector('.blog-date');
        if (!dateSpan) return new Date(0);
        const dateStr = dateSpan.textContent.trim();
        
        const months = {
            // English
            jan:0, feb:1, mar:2, apr:3, may:4, jun:5, jul:6, aug:7, sep:8, oct:9, nov:10, dec:11,
            january:0, february:1, march:2, april:3, june:5, july:6, august:7, september:8, october:9, november:10, december:11,
            // German
            januar:0, februar:1, märz:2, mai:4, juni:5, juli:6, oktober:9, dezember:11,
            // Italian
            gennaio:0, febbraio:1, marzo:2, aprile:3, maggio:4, giugno:5, luglio:6, agosto:7, settembre:8, ottobre:9, novembre:10, dicembre:11
        };

        const clean = dateStr.toLowerCase().replace(/ä/g, 'a').replace(/ö/g, 'o').replace(/ü/g, 'u').replace(/[^a-z0-9\s]/g, ' ');
        const parts = clean.split(/\s+/).filter(Boolean);

        let day = 1;
        let month = 0;
        let year = 1970;

        // Try to identify year (usually a 4-digit number at the end or middle)
        const yearIndex = parts.findIndex(p => /^\d{4}$/.test(p));
        if (yearIndex !== -1) {
            year = parseInt(parts[yearIndex], 10);
            parts.splice(yearIndex, 1);
        }

        // Try to identify month (a word matching one of the keys)
        const monthWord = parts.find(p => months[p] !== undefined);
        if (monthWord) {
            month = months[monthWord];
            parts.splice(parts.indexOf(monthWord), 1);
        }

        // Any remaining number is probably the day
        const dayWord = parts.find(p => /^\d{1,2}$/.test(p));
        if (dayWord) {
            day = parseInt(dayWord, 10);
        }

        return new Date(year, month, day);
    }

    if (sortSelect) {
        sortSelect.addEventListener('change', () => {
            const val = sortSelect.value;
            const cards = Array.from(grid.querySelectorAll('.blog-card'));
            const noscriptElement = grid.querySelector('noscript');

            if (val === 'default') {
                originalCards.forEach(card => {
                    if (noscriptElement) {
                        grid.insertBefore(card, noscriptElement);
                    } else {
                        grid.appendChild(card);
                    }
                });
                applyFilters();
                return;
            }

            cards.sort((a, b) => {
                if (val === 'newest' || val === 'oldest') {
                    const dateA = parseDate(a);
                    const dateB = parseDate(b);
                    return val === 'newest' ? dateB - dateA : dateA - dateB;
                } else if (val === 'az' || val === 'za') {
                    const titleA = (a.querySelector('h3')?.textContent || '').trim().toLowerCase();
                    const titleB = (b.querySelector('h3')?.textContent || '').trim().toLowerCase();
                    if (titleA < titleB) return val === 'az' ? -1 : 1;
                    if (titleA > titleB) return val === 'az' ? 1 : -1;
                    return 0;
                }
                return 0;
            });

            cards.forEach(card => {
                if (noscriptElement) {
                    grid.insertBefore(card, noscriptElement);
                } else {
                    grid.appendChild(card);
                }
            });
            applyFilters();
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', debounce(applyFilters, 150));
    }
}

// ==========================================
// 11. ZERO-LATENCY BLOG POST PREFETCHING
// ==========================================
function prefetchBlogPosts() {
    // Scan all blog cards in the grid
    const cards = document.querySelectorAll('.blog-card');
    if (!cards.length) return;

    const runPrefetch = () => {
        cards.forEach(card => {
            const href = card.getAttribute('href');
            if (href && href.startsWith('posts/')) {
                const prefetchUrl = href;
                if (!document.querySelector(`link[href="${prefetchUrl}"]`)) {
                    const link = document.createElement('link');
                    link.rel = 'prefetch';
                    link.href = prefetchUrl;
                    link.as = 'fetch';
                    document.head.appendChild(link);
                }
            }
        });
    };

    // Use browser idle scheduling for zero thread obstruction
    if ('requestIdleCallback' in window) {
        window.requestIdleCallback(runPrefetch);
    } else {
        setTimeout(runPrefetch, 2000);
    }
}

// Run initializations
const runInitializations = () => {
    initMobileNav();
    initContactForm();
    
    // Check if we are on a blog page
    const isBlogPage = document.querySelector('.blog-grid') !== null;
    if (isBlogPage) {
        initDynamicBlogFeed();
    }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runInitializations);
} else {
    runInitializations();
}

// ==========================================
// 12. SERVICE WORKER PWA REGISTRATION
// ==========================================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(reg => {
                console.log('[PWA] ServiceWorker registered successfully with scope:', reg.scope);
            })
            .catch(err => {
                console.warn('[PWA] ServiceWorker registration failed:', err);
            });
    });
}