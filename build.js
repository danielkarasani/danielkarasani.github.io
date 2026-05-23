const fs = require('fs');
const path = require('path');

const srcPagesDir = path.join(__dirname, 'src', 'pages');
const srcComponentsDir = path.join(__dirname, 'src', 'components');
const srcCssDir = path.join(__dirname, 'src', 'css');
const srcJsDir = path.join(__dirname, 'src', 'js');
const distDir = __dirname; // Output to root for GitHub Pages

// Helper to copy files
function copyDirFiles(srcDir, destDir) {
    if (!fs.existsSync(srcDir)) return;
    const files = fs.readdirSync(srcDir);
    files.forEach(file => {
        if (fs.statSync(path.join(srcDir, file)).isFile()) {
            fs.copyFileSync(path.join(srcDir, file), path.join(destDir, file));
            console.log(`Copied ${file}`);
        }
    });
}

// 1. Load Components
const header = fs.readFileSync(path.join(srcComponentsDir, 'header.html'), 'utf8');
const footer = fs.readFileSync(path.join(srcComponentsDir, 'footer.html'), 'utf8');
const preloader = fs.readFileSync(path.join(srcComponentsDir, 'preloader.html'), 'utf8');

// 2. Translations Dictionary for Components
const translations = {
    en: {
        nav_about: 'About',
        nav_blog: 'Blog',
        nav_projects: 'Projects',
        preloader_text: 'INITIALIZING ENGINEERING SYSTEM...',
        footer_available: 'Available for projects in Merano, South Tyrol and beyond.'
    },
    de: {
        nav_about: 'Über mich',
        nav_blog: 'Blog',
        nav_projects: 'Projekte',
        preloader_text: 'INGENIEURSYSTEM INITIALISIEREN...',
        footer_available: 'Verfügbar für Projekte in Meran, Südtirol und darüber hinaus.'
    },
    it: {
        nav_about: 'Chi sono',
        nav_blog: 'Blog',
        nav_projects: 'Progetti',
        preloader_text: 'INIZIALIZZAZIONE SISTEMA INGEGNERISTICO...',
        footer_available: 'Disponibile per progetti a Merano, in Alto Adige e oltre.'
    }
};

// 3. Helper to replace placeholders
function buildPage(content, lang) {
    const t = translations[lang];
    
    // Inject Components
    let html = content
        .replace('{{HEADER}}', header)
        .replace('{{FOOTER}}', footer)
        .replace('{{PRELOADER}}', preloader);

    // Inject Translations
    html = html
        .replace(/\{\{LANG\}\}/g, lang)
        .replace(/\{\{NAV_ABOUT\}\}/g, t.nav_about)
        .replace(/\{\{NAV_BLOG\}\}/g, t.nav_blog)
        .replace(/\{\{NAV_PROJECTS\}\}/g, t.nav_projects)
        .replace(/\{\{PRELOADER_TEXT\}\}/g, t.preloader_text)
        .replace(/\{\{FOOTER_AVAILABLE\}\}/g, t.footer_available);
        
    // Update active language links
    html = html.replace(`data-lang="${lang}" class="lang-btn`, `data-lang="${lang}" class="lang-btn active`);

    // Fix relative links for translations in the header/nav based on current lang
    if (lang !== 'en') {
        html = html.replace(/href="index\.html"/g, `href="index-${lang}.html"`);
        html = html.replace(/href="about\.html"/g, `href="about-${lang}.html"`);
        html = html.replace(/href="blog\.html"/g, `href="blog-${lang}.html"`);
        html = html.replace(/href="air-analyzer\.html"/g, `href="air-analyzer-${lang}.html"`);
    }

    return html;
}

// 4. Build Process
console.log('--- Copying Static Assets ---');
copyDirFiles(srcCssDir, distDir);
copyDirFiles(srcJsDir, distDir);

console.log('\n--- Building HTML Pages ---');
const pages = fs.readdirSync(srcPagesDir).filter(file => file.endsWith('.html'));

pages.forEach(page => {
    const rawContent = fs.readFileSync(path.join(srcPagesDir, page), 'utf8');
    
    // Detect Language from filename
    let lang = 'en';
    if (page.endsWith('-de.html')) {
        lang = 'de';
    } else if (page.endsWith('-it.html')) {
        lang = 'it';
    }
    
    const html = buildPage(rawContent, lang);
    fs.writeFileSync(path.join(distDir, page), html);
    console.log(`Built ${page} (Lang: ${lang})`);
});

console.log('\n✅ Build complete! All pages generated successfully.');
