const fs = require('fs');
const path = require('path');

function checkHtml() {
    const issues = [];
    const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));
    
    files.forEach(file => {
        const content = fs.readFileSync(file, 'utf8');
        
        // Empty hrefs
        const emptyHrefs = content.match(/href=["']\s*["']/g);
        if (emptyHrefs) issues.push(`${file}: Found empty hrefs: ${emptyHrefs.length}`);
        
        // Multiple main tags
        const mains = content.match(/<main/g);
        if (mains && mains.length > 1) issues.push(`${file}: Multiple <main> tags found: ${mains.length}`);
        
        // Duplicate IDs
        const ids = [];
        let match;
        const idRegex = /id=["']([^"']+)["']/g;
        while ((match = idRegex.exec(content)) !== null) {
            ids.push(match[1]);
        }
        
        const counts = {};
        ids.forEach(id => counts[id] = (counts[id] || 0) + 1);
        const dups = Object.keys(counts).filter(id => counts[id] > 1);
        if (dups.length > 0) issues.push(`${file}: Duplicate IDs found: ${dups.join(', ')}`);
        
        // Tag matching
        ['div', 'span', 'section', 'a', 'p', 'h1', 'h2', 'h3'].forEach(tag => {
            const openMatch = content.match(new RegExp(`<${tag}[>\\s]`, 'g'));
            const closeMatch = content.match(new RegExp(`</${tag}>`, 'g'));
            const opens = openMatch ? openMatch.length : 0;
            const closes = closeMatch ? closeMatch.length : 0;
            if (opens !== closes && tag !== 'input' && tag !== 'img' && tag !== 'br' && tag !== 'hr') {
                issues.push(`${file}: Mismatched <${tag}> tags (open: ${opens}, close: ${closes})`);
            }
        });
    });
    return issues;
}

function checkJson() {
    const issues = [];
    const files = fs.readdirSync('.').filter(f => f.endsWith('.json'));
    
    files.forEach(file => {
        try {
            JSON.parse(fs.readFileSync(file, 'utf8'));
        } catch (e) {
            issues.push(`${file}: Invalid JSON - ${e.message}`);
        }
    });
    return issues;
}

const htmlIssues = checkHtml();
const jsonIssues = checkJson();

console.log("--- HTML ISSUES ---");
htmlIssues.forEach(i => console.log(i));
console.log("\n--- JSON ISSUES ---");
jsonIssues.forEach(i => console.log(i));
