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
    
    // Fix duplicate class attribute
    const duplicateClassStr = 'class="hover-target" target="_blank" rel="noopener noreferrer" class="hover-target whatsapp-link"';
    const duplicateClassStr2 = 'class="hover-target whatsapp-link" target="_blank" rel="noopener noreferrer" class="hover-target whatsapp-link"';
    
    // Regex for multiple cases of duplicate classes on the whatsapp link
    let newContent = content.replace(/class="hover-target"\s+target="_blank"\s+rel="noopener noreferrer"\s+class="hover-target whatsapp-link"/g, 'target="_blank" rel="noopener noreferrer" class="hover-target whatsapp-link"');
    
    // Some are formatted with newlines
    newContent = newContent.replace(/class="hover-target whatsapp-link"\s+class="hover-target whatsapp-link"/g, 'class="hover-target whatsapp-link"');
    
    if (content !== newContent) {
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`Updated ${f}`);
    }
});
