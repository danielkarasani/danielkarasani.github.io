const fs = require('fs');

const filepath = 'c:/Users/danie/Documents/GitHub/danielkarasani.github.io/styles.css';
let css = fs.readFileSync(filepath, 'utf-8');

// 1. Hero Image overflow
css = css.replace(
    ".hero-image img { max-width: 350px; }",
    ".hero-image img { max-width: min(100%, 350px); }"
);

// 2. Typography size
css = css.replace(
    "h1 { font-size: 2.8rem; }",
    "h1 { font-size: 2.4rem; }"
);
css = css.replace(
    "h2 { font-size: 2.3rem; }",
    "h2 { font-size: 1.8rem; }"
);

// 3. Command Palette 100vw
css = css.replace(
    "width: 100vw;",
    "width: 100%;"
);

// 4. Mobile Nav Refactoring
const override_css = `
/* --- MOBILE FIXES OVERRIDES --- */
@media (max-width: 990px) {
    /* Reset absolute positioning on nav elements */
    .hamburger-menu, .lang-switcher, #search-toggle, #theme-toggle {
        position: static !important;
        transform: none !important;
        margin-left: 10px !important;
    }
    .lang-switcher {
        margin-left: auto !important; /* Push everything else to the right */
        gap: 8px;
    }
    /* Make the container a flexbox that wraps/adjusts */
    .nav-container {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        width: 100%;
        padding: 0 20px;
    }
    .logo {
        margin-right: auto;
    }
    
    /* On very small screens, adjust gap */
    @media (max-width: 400px) {
        .lang-switcher { gap: 4px; font-size: 0.75rem; margin-left: 5px !important; }
        .hamburger-menu, #search-toggle, #theme-toggle { margin-left: 5px !important; }
        .logo { font-size: 1.15rem; }
    }
}

/* 5. Mobile hover fix override */
@media (hover: none) {
    .btn:hover { transform: none !important; box-shadow: none !important; }
    .project-card:hover { transform: none !important; box-shadow: 0 10px 30px rgba(0,0,0,0.05) !important; border-color: #f0f0f0 !important; }
    .skill-category:hover { transform: none !important; box-shadow: 0 10px 30px rgba(0,0,0,0.03) !important; border-top-color: var(--text-dark) !important; }
    .timeline-item:hover .timeline-content { transform: none !important; box-shadow: 0 10px 30px rgba(0,0,0,0.03) !important; border-left-color: transparent !important; }
    .gallery-img:hover { transform: none !important; box-shadow: 0 10px 20px rgba(0,0,0,0.05) !important; border-color: rgba(200,155,114,0.2) !important; }
    .blog-card:hover { transform: none !important; box-shadow: 0 10px 30px rgba(0,0,0,0.03) !important; border-color: #f0f0f0 !important; }
    .cert-tag:hover { transform: none !important; box-shadow: 0 4px 10px rgba(0,0,0,0.03) !important; border-color: rgba(200,155,114,0.2) !important; color: inherit !important; }
    .skill-tag:hover { transform: none !important; box-shadow: none !important; background: var(--bg-main) !important; color: var(--text-dark) !important; border-color: rgba(200,155,114,0.2) !important; }
    .narrative-block:hover { transform: none !important; box-shadow: 0 10px 30px rgba(0,0,0,0.03) !important; }
    .about-visual img:hover { transform: none !important; box-shadow: 0 25px 50px rgba(0,0,0,0.15) !important; border-color: var(--white) !important; }
}
`;

if (!css.includes("MOBILE FIXES OVERRIDES")) {
    css += override_css;
    fs.writeFileSync(filepath, css, 'utf-8');
    console.log("CSS updated.");
} else {
    console.log("CSS already contains mobile overrides.");
}
