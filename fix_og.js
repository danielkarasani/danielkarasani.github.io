const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

files.forEach(f => {
    let content = fs.readFileSync(f, 'utf8');
    const target = '<meta property="og:type" content="website">';
    const parts = content.split(target);
    if (parts.length > 2) {
        // If it appears more than once, remove the last occurrence
        const lastPart = parts.pop();
        const newContent = parts.join(target) + lastPart;
        fs.writeFileSync(f, newContent);
        console.log("Fixed " + f);
    }
});
