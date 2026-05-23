const fs = require('fs');
const path = require('path');

const htmlFiles = [
    'index.html', 'index-de.html', 'index-it.html',
    'about.html', 'about-de.html', 'about-it.html',
    'air-analyzer.html', 'air-analyzer-de.html', 'air-analyzer-it.html',
    'blog.html', 'blog-de.html', 'blog-it.html'
];

htmlFiles.forEach(f => {
    const filePath = path.join(__dirname, f);
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');
    
    // 1. Logo Name Update
    content = content.replace(/<a href="([^"]+)" class="logo hover-target">Daniel<span>\.<\/span><\/a>/g, '<a href="$1" class="logo hover-target">Daniel Karasani<span>.</span></a>');

    // 2. Footer Translations
    const isDe = f.includes('-de.html');
    const isIt = f.includes('-it.html');
    
    // Find any paragraph starting with &copy; 2026
    const footerRegex = /<p>\s*&copy;\s*2026\s*Daniel\s*Karasani[^<]*<\/p>/g;
    
    if (isDe) {
        content = content.replace(footerRegex, '<p>Entworfen und konstruiert für höchste Leistung.</p>\n            <p>Entwickelt von Daniel Karasani &copy; 2026. All rights reserved.</p>');
    } else if (isIt) {
        content = content.replace(footerRegex, '<p>Progettato e ingegnerizzato per massime prestazioni.</p>\n            <p>Sviluppato da Daniel Karasani &copy; 2026. All rights reserved.</p>');
    } else {
        content = content.replace(footerRegex, '<p>Designed &amp; Engineered for Performance.</p>\n            <p>Built by Daniel Karasani &copy; 2026. All rights reserved.</p>');
    }

    // 3. Contact link on Index pages
    if (f.startsWith('index')) {
        let contactText = 'Contact';
        if (isDe) contactText = 'Kontakt';
        if (isIt) contactText = 'Contatto';
        
        if (!content.includes(`>${contactText}</a>`)) {
            // Find the end of the ul.nav-links
            content = content.replace(/(<li><a href="[^"]*blog[^"]*"[^>]*>[^<]*<\/a><\/li>)\s*<\/ul>/i, `$1\n                <li><a href="#contact" class="hover-target">${contactText}</a></li>\n            </ul>`);
        }
    }

    // 4. Blog filter UI on Blog pages
    if (f.startsWith('blog')) {
        let all = 'All Posts', eng = 'Engineering & Research', gen = 'General Topics', off = 'Off-Topic';
        if (isDe) {
            all = 'Alle Beiträge';
            eng = 'Engineering & Research';
            gen = 'Allgemeine Themen';
            off = 'Off-Topic';
        } else if (isIt) {
            all = 'Tutti gli Articoli';
            eng = 'Ingegneria & Ricerca';
            gen = 'Argomenti Generali';
            off = 'Off-Topic';
        }
        
        const filterHtml = `<div style="display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 20px;" class="category-filters">
            <button class="filter-btn active hover-target" data-filter="all" style="padding: 6px 14px; border-radius: 20px; border: 1px solid #ccc; background: transparent; color: var(--text-dark); cursor: pointer; font-weight: 500;">${all}</button>
            <button class="filter-btn hover-target" data-filter="Engineering & Research" style="padding: 6px 14px; border-radius: 20px; border: 1px solid #ccc; background: transparent; color: var(--text-dark); cursor: pointer; font-weight: 500;">${eng}</button>
            <button class="filter-btn hover-target" data-filter="General Topics" style="padding: 6px 14px; border-radius: 20px; border: 1px solid #ccc; background: transparent; color: var(--text-dark); cursor: pointer; font-weight: 500;">${gen}</button>
            <button class="filter-btn hover-target" data-filter="Off-Topic" style="padding: 6px 14px; border-radius: 20px; border: 1px solid #ccc; background: transparent; color: var(--text-dark); cursor: pointer; font-weight: 500;">${off}</button>
        </div>\n        <div class="blog-controls-wrapper"`;
        
        if (!content.includes('class="category-filters"')) {
            content = content.replace(/<div class="blog-controls-wrapper"/, filterHtml);
        }
    }

    // 5. Specific index.html fixes
    if (f === 'index.html') {
        content = content.replace(/Ind\.\s*&\s*Mechanical\s*Engineering\s*Student/g, 'Industrial & Mechanical Engineering Student');
        content = content.replace(/TFO\s*"Oskar\s*von\s*Miller"\s*Merano/g, "TFO 'Oskar von Miller' Merano");
        
        const ctaHtml = `
    <section class="reveal" style="text-align: center; padding: 20px 20px; margin-top: -30px; margin-bottom: 40px;">
        <h2>Let's build something great.</h2>
        <p style="font-size: 1.15rem; color: var(--text-muted); max-width: 800px; margin: 20px auto 0; line-height: 1.8;">Whether you have a specific project in mind, need advices, or just want to discuss the future of industrial engineering, I'm always open to connecting. Based in South Tyrol, serving globally.</p>
    </section>

    <section id="contact"`;

        if (!content.includes("Let's build something great")) {
            content = content.replace(/<section id="contact"/, ctaHtml);
        }
    }

    fs.writeFileSync(filePath, content, 'utf8');
});

console.log("Patch applied to all 12 files.");
