const ejs = require('ejs');
const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src', 'pages');
const outDir = path.join(__dirname, 'HTML-converted-Astro');

function buildPages() {
    if (!fs.existsSync(srcDir)) return;
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);
    
    const files = fs.readdirSync(srcDir).filter(f => f.endsWith('.ejs'));
    files.forEach(file => {
        const filePath = path.join(srcDir, file);
        const template = fs.readFileSync(filePath, 'utf8');
        
        const html = ejs.render(template, {
            filename: filePath
        });
        
        const outName = file.replace('.ejs', '.html');
        fs.writeFileSync(path.join(outDir, outName), html);
        console.log(`Built ${outName} in HTML-converted-Astro`);
    });
}

buildPages();
