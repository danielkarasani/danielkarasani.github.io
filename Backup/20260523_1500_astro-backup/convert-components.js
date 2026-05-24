const ejs = require('ejs');
const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, 'src', 'components');
const outDir = path.join(__dirname, 'HTML-converted-Astro');

function convertComponents() {
    if (!fs.existsSync(componentsDir)) return;
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);
    
    const files = fs.readdirSync(componentsDir).filter(f => f.endsWith('.ejs'));
    files.forEach(file => {
        const filePath = path.join(componentsDir, file);
        const template = fs.readFileSync(filePath, 'utf8');
        
        // We provide default values for the EJS variables
        const html = ejs.render(template, {
            filename: filePath,
            lang: 'en',
            page: 'index'
        });
        
        const outName = file.replace('.ejs', '.html');
        fs.writeFileSync(path.join(outDir, outName), html);
        console.log(`Built ${outName} in HTML-converted-Astro`);
    });
}

convertComponents();
