const fs = require('fs');
const path = require('path');

const htmlFiles = [
    'index.html', 'index-de.html', 'index-it.html',
    'about.html', 'about-de.html', 'about-it.html',
    'air-analyzer.html', 'air-analyzer-de.html', 'air-analyzer-it.html',
    'blog.html', 'blog-de.html', 'blog-it.html'
];

const oldBodyScript1 = "if (localStorage.getItem('theme') === 'dark') document.body.classList.add('dark-theme');";
const oldBodyScript2 = "if (localStorage.getItem('theme') === 'dark') document.documentElement.className += ' dark-theme';";
const oldBodyScript3 = "if (localStorage.getItem('theme') === 'dark') document.documentElement.classList.add('dark-theme');";

const newBodyScript1 = "if (localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) document.body.classList.add('dark-theme');";
const newBodyScript2 = "if (localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) document.documentElement.className += ' dark-theme';";
const newBodyScript3 = "if (localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) document.documentElement.classList.add('dark-theme');";

htmlFiles.forEach(f => {
    const filePath = path.join(__dirname, f);
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');
    
    let newContent = content.replace(oldBodyScript1, newBodyScript1);
    newContent = newContent.replace(oldBodyScript2, newBodyScript2);
    newContent = newContent.replace(oldBodyScript3, newBodyScript3);
    
    if (content !== newContent) {
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`Updated ${f}`);
    }
});
