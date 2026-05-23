const fs = require('fs');
const path = require('path');

const srcPagesDir = path.join(__dirname, 'src', 'pages');

const pages = fs.readdirSync(srcPagesDir).filter(file => file.endsWith('.html'));

pages.forEach(page => {
    let content = fs.readFileSync(path.join(srcPagesDir, page), 'utf8');

    // 1. Replace the old lang attribute
    content = content.replace(/<html lang="[a-z]{2}">/i, '<html lang="{{LANG}}">');
    content = content.replace(/<html lang="">/i, '<html lang="{{LANG}}">');
    
    // 2. Replace CSS/JS paths to point to the new files
    // old: <link rel="stylesheet" href="styles.css">
    // new: <link rel="stylesheet" href="variables.css">\n    <link rel="stylesheet" href="layout.css">
    content = content.replace(/<link rel="stylesheet" href="styles.css">/i, '<link rel="stylesheet" href="variables.css">\n    <link rel="stylesheet" href="layout.css">');
    
    // Replace script src
    // old: <script src="script.js" defer></script>
    // new: <script src="main.js" defer></script>
    content = content.replace(/<script src="script.js"[^>]*><\/script>/i, '<script src="main.js" defer></script>');

    // 3. Replace <nav> to </nav> with {{HEADER}}
    content = content.replace(/<nav>[\s\S]*?<\/nav>/i, '{{HEADER}}');

    // 4. Replace <footer> to </footer> with {{FOOTER}}
    content = content.replace(/<footer>[\s\S]*?<\/footer>/i, '{{FOOTER}}');

    // 5. Replace <div id="preloader"> to the end of the cursor divs with {{PRELOADER}}
    // Since the original index.html has:
    // <div id="preloader">...</div>
    // <div class="cursor-dot"></div>
    // <div class="cursor-outline"></div>
    // We can replace the preloader block
    content = content.replace(/<div id="preloader">[\s\S]*?<\/div>[\s]*<div class="cursor-dot"><\/div>[\s]*<div class="cursor-outline"><\/div>/i, '{{PRELOADER}}');
    
    // Also remove the old custom cursor divs if they are separate
    content = content.replace(/<div class="cursor-dot"><\/div>[\s]*<div class="cursor-outline"><\/div>/i, '');
    
    // Just replace <div id="preloader">...</div> with {{PRELOADER}}
    content = content.replace(/<div id="preloader">[\s\S]*?<\/div>/i, '{{PRELOADER}}');

    fs.writeFileSync(path.join(srcPagesDir, page), content);
    console.log(`Cleaned ${page}`);
});
