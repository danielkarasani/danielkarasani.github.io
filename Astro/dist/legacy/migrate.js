const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const srcDir = path.join(rootDir, 'src');
const componentsDir = path.join(srcDir, 'components');
const pagesDir = path.join(srcDir, 'pages');

// Create dirs if not exist
if (!fs.existsSync(srcDir)) fs.mkdirSync(srcDir);
if (!fs.existsSync(componentsDir)) fs.mkdirSync(componentsDir);
if (!fs.existsSync(pagesDir)) fs.mkdirSync(pagesDir);

// Define components to extract (we will define their content manually below based on the audit)
const navContent = `
<nav>
    <div class="nav-container">
        <a href="index<%= lang === 'en' ? '' : '-' + lang %>.html" class="logo hover-target">Daniel<span>.</span></a>
        <ul class="nav-links">
            <li><a href="index<%= lang === 'en' ? '' : '-' + lang %>.html#about" class="hover-target">About</a></li>
            <li><a href="index<%= lang === 'en' ? '' : '-' + lang %>.html#projects" class="hover-target">Projects</a></li>
            <li><a href="index<%= lang === 'en' ? '' : '-' + lang %>.html#experience" class="hover-target">Experience</a></li>
            <li><a href="index<%= lang === 'en' ? '' : '-' + lang %>.html#education" class="hover-target">Education</a></li>
            <li><a href="index<%= lang === 'en' ? '' : '-' + lang %>.html#skills" class="hover-target">Skills</a></li>
            <li><a href="blog<%= lang === 'en' ? '' : '-' + lang %>.html" class="hover-target">Blog</a></li>
        </ul>
        
        <div class="lang-switcher">
            <a href="<%= page %>.html" onclick="localStorage.setItem('lang', 'en')" class="hover-target <%= lang === 'en' ? 'active' : '' %>" aria-label="Switch language to English">EN</a> 
            <span class="divider">|</span>
            <a href="<%= page === 'index' ? 'index' : page %>-de.html" onclick="localStorage.setItem('lang', 'de')" class="hover-target <%= lang === 'de' ? 'active' : '' %>" aria-label="Switch language to German">DE</a> 
            <span class="divider">|</span>
            <a href="<%= page === 'index' ? 'index' : page %>-it.html" onclick="localStorage.setItem('lang', 'it')" class="hover-target <%= lang === 'it' ? 'active' : '' %>" aria-label="Switch language to Italian">IT</a>
        </div>

        <button id="theme-toggle" class="hover-target" aria-label="Toggle light and dark theme" style="background: none; border: none; font-size: 1.2rem; margin-left: 20px; color: var(--text-dark); transition: var(--transition-fast); cursor: pointer;">
            🌙
        </button>
    </div>
    <div class="scroll-progress-bar" role="presentation" aria-hidden="true"><div class="scroll-progress-fill"></div></div>
</nav>
`;

const footerContent = `
<footer>
    <div class="container">
        <h2>Let's build something great.</h2>
        <p class="footer-details">Whether you have a specific project in mind, need advice on digitalization, or just want to discuss the future of industrial engineering—I'm always open to connecting. Based in South Tyrol, serving globally.</p>
        <div class="social-links">
            <a href="https://linkedin.com/in/daniel-karasani" target="_blank" rel="noopener noreferrer" class="hover-target" aria-label="LinkedIn">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
            </a>
            <a href="mailto:daniel.karasani@outlook.com" class="hover-target" aria-label="Email">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            </a>
            <a href="https://github.com/danielkarasani" target="_blank" rel="noopener noreferrer" class="hover-target" aria-label="GitHub">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
            </a>
        </div>
        <p style="margin-top: 30px; font-size: 0.9rem; color: #aaa;">&copy; 2026 Daniel Karasani. All rights reserved.</p>
    </div>
</footer>
`;

const preloaderContent = `
<div id="preloader">
    <div class="loader-text">Loading reality...</div>
    <div class="loader-bar">
        <div class="loader-fill"></div>
    </div>
</div>
`;

// Write common components
fs.writeFileSync(path.join(componentsDir, 'nav.ejs'), navContent);
fs.writeFileSync(path.join(componentsDir, 'footer.ejs'), footerContent);

const files = fs.readdirSync(rootDir).filter(f => f.endsWith('.html') && f !== 'air-analyzer.html' && f !== 'air-analyzer-de.html' && f !== 'air-analyzer-it.html'); // Skip external pages for now if they differ greatly

files.forEach(file => {
    let html = fs.readFileSync(path.join(rootDir, file), 'utf8');
    
    // Parse lang and page
    let lang = 'en';
    if (file.includes('-de.html')) lang = 'de';
    if (file.includes('-it.html')) lang = 'it';
    
    let page = file.replace('-de.html', '').replace('-it.html', '').replace('.html', '');
    
    // Extract everything above <nav>
    const navStart = html.indexOf('<nav>');
    const navEnd = html.indexOf('</nav>') + 6;
    
    // Extract footer
    const footerStart = html.indexOf('<footer>');
    const footerEnd = html.indexOf('</footer>') + 9;
    
    if (navStart === -1 || footerStart === -1) {
        console.log("Skipping " + file + " - could not find nav/footer");
        return;
    }
    
    let headPart = html.substring(0, navStart);
    let bodyPart = html.substring(navEnd, footerStart);
    let endPart = html.substring(footerEnd);
    
    // Create the EJS structure
    let ejsContent = "<%\n" +
"  const lang = '" + lang + "';\n" +
"  const page = '" + page + "';\n" +
"%>\n" +
headPart + "\n" +
"<%- include('../components/nav', { lang, page }) %>\n" +
bodyPart + "\n" +
"<%- include('../components/footer', { lang, page }) %>\n" +
endPart + "\n";

    // Remove preloader block completely as part of Phase 3
    ejsContent = ejsContent.replace(/<div id="preloader">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/, ''); 
    
    fs.writeFileSync(path.join(pagesDir, page + (lang === 'en' ? '' : '-' + lang) + '.ejs'), ejsContent);
    console.log("Migrated " + file);
});
