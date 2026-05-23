const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const htmlFiles = fs.readdirSync(rootDir).filter(f => f.endsWith('.html') && !f.includes('admin'));

const footerEn = `
    <footer>
        <div class="social-links" style="flex-wrap: wrap;">
            <a href="https://www.linkedin.com/in/daniel-karasani" class="hover-target" target="_blank" rel="noopener noreferrer">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                LinkedIn
            </a>
            <a href="https://github.com/danielkarasani" class="hover-target" target="_blank" rel="noopener noreferrer">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                GitHub
            </a>
            <a href="mailto:daniel.karasani@outlook.com" class="hover-target">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                Email
            </a>
            <a href="https://wa.me/393245808570" class="hover-target" target="_blank" rel="noopener noreferrer" onmouseover="this.style.color='#25D366'" onmouseout="this.style.color=''">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.04-.967-.281-.099-.488-.15-.693.148-.205.297-.771.967-.945 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.693-1.67-.948-2.285-.25-.598-.505-.517-.694-.527-.174-.009-.373-.009-.571-.009s-.521.074-.794.372c-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.703.248-1.302.173-1.422-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.029 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp
            </a>
        </div>
        <div class="footer-details">
            <p style="margin-bottom: 30px; font-size: 1.05rem; color: #fcfaf8; font-weight: 500; display: flex; align-items: center; justify-content: center; gap: 10px;">
                <span style="display: inline-block; width: 10px; height: 10px; background-color: #4ade80; border-radius: 50%; box-shadow: 0 0 12px #4ade80;"></span>
                Available for projects in Merano, South Tyrol and beyond.
            </p>
            <p style="margin-bottom: 5px; color: #ccc;">Laubengasse 254, 39012 Merano (BZ) | +39 3245808570 | daniel.karasani@outlook.com</p>
            <p>&copy; 2026 Daniel Karasani. Designed & Engineered for Performance.</p>
        </div>
    </footer>`;

const footerDe = footerEn.replace('Available for projects in Merano, South Tyrol and beyond.', 'Verf\u00FCgbar f\u00FCr Projekte in Meran, S\u00FCdtirol und dar\u00FCber hinaus.');
const footerIt = footerEn.replace('Available for projects in Merano, South Tyrol and beyond.', 'Disponibile per progetti a Merano, in Alto Adige e oltre.');

htmlFiles.forEach(file => {
    let content = fs.readFileSync(path.join(rootDir, file), 'utf8');
    
    let lang = 'en';
    if (file.includes('-de.html')) lang = 'de';
    if (file.includes('-it.html')) lang = 'it';
    
    const footerReplacement = lang === 'de' ? footerDe : (lang === 'it' ? footerIt : footerEn);
    content = content.replace(/<footer>[\s\S]*?<\/footer>/, footerReplacement);
    
    if (!content.includes('<div id="preloader">')) {
        let text = 'INITIALIZING ENGINEERING SYSTEM...';
        if (lang === 'de') text = 'INGENIEURSYSTEM INITIALISIEREN...';
        if (lang === 'it') text = 'INIZIALIZZAZIONE SISTEMA INGEGNERISTICO...';
        
        const preloaderHTML = `\n    <div id="preloader">\n        <div class="loader-text">${text}</div>\n        <div class="loader-bar">\n            <div class="loader-fill"></div>\n        </div>\n    </div>\n`;
        content = content.replace(/<body[^>]*>/, '$&' + preloaderHTML);
    }
    
    fs.writeFileSync(path.join(rootDir, file), content, 'utf8');
    console.log('Processed ' + file);
});
