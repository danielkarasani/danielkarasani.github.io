const fs = require('fs');
const path = require('path');
const vm = require('vm');

const WORKSPACE_DIR = path.resolve(__dirname, '..');

const JS_FILES = [
    'script.js',
    'sw.js',
    'patcher.js',
    'patch_blog.js',
    'scripts/verify_structural_sync.js',
    'scripts/verify_integrity.js'
];

const HTML_FILES = [
    'index.html', 'index-de.html', 'index-it.html',
    'about.html', 'about-de.html', 'about-it.html',
    'air-analyzer.html', 'air-analyzer-de.html', 'air-analyzer-it.html',
    'blog.html', 'blog-de.html', 'blog-it.html',
    'browser-markdown-editor/index.html'
];

function checkJsSyntax() {
    console.log("==================================================");
    console.log("Starting JavaScript Compilation & Syntax Validator");
    console.log("==================================================");

    let totalErrors = 0;

    // 1. Check external JS files
    console.log("\n--- Checking External JavaScript Files ---");
    for (const file of JS_FILES) {
        const filePath = path.join(WORKSPACE_DIR, file);
        if (!fs.existsSync(filePath)) {
            console.warn(`⚠️ Warning: JS File missing: ${file}`);
            continue;
        }

        const code = fs.readFileSync(filePath, 'utf8');
        try {
            // vm.Script compiles the code but does not run it
            new vm.Script(code, { filename: file });
            console.log(`✅ ${file}: Syntax OK`);
        } catch (err) {
            console.error(`❌ ${file}: Syntax Error!`);
            console.error(err.stack || err.message);
            totalErrors++;
        }
    }

    // 2. Check inline JavaScript inside HTML files
    console.log("\n--- Checking Inline JavaScript in HTML Files ---");
    for (const file of HTML_FILES) {
        const filePath = path.join(WORKSPACE_DIR, file);
        if (!fs.existsSync(filePath)) {
            console.warn(`⚠️ Warning: HTML File missing: ${file}`);
            continue;
        }

        const html = fs.readFileSync(filePath, 'utf8');
        
        // Extract inline <script> tags without src attribute
        const scriptTagRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
        let match;
        let scriptIndex = 1;
        let hasInlineScripts = false;

        while ((match = scriptTagRegex.exec(html)) !== null) {
            const scriptOpeningTag = match[0].match(/<script\b[^>]*>/i)[0];
            const scriptContent = match[1];

            // Skip if it is an external script (has src attribute)
            if (/\bsrc\s*=\s*/i.test(scriptOpeningTag)) {
                continue;
            }

            // Skip if it is structured data like JSON-LD or non-JS types
            if (/\btype\s*=\s*['"](application\/ld\+json|application\/json)['"]/i.test(scriptOpeningTag)) {
                continue;
            }

            hasInlineScripts = true;
            try {
                // Compile the inline JS
                new vm.Script(scriptContent, { filename: `${file} [inline #${scriptIndex}]` });
                scriptIndex++;
            } catch (err) {
                console.error(`❌ ${file} (inline script #${scriptIndex}): Syntax Error!`);
                console.error(err.message);
                
                // Show a small snippet of the offending script
                const lines = scriptContent.split('\n');
                const errLine = err.stack ? (err.stack.match(/\[inline #\d+\]:(\d+)/)?.[1] || 1) : 1;
                const start = Math.max(0, errLine - 3);
                const end = Math.min(lines.length, parseInt(errLine) + 3);
                
                console.log("Snippet near error:");
                for (let i = start; i < end; i++) {
                    console.log(`  Line ${i + 1}: ${lines[i]}`);
                }

                totalErrors++;
                scriptIndex++;
            }
        }

        if (hasInlineScripts && scriptIndex > 1 && totalErrors === 0) {
            console.log(`✅ ${file}: All inline scripts (${scriptIndex - 1}) parsed successfully`);
        } else if (!hasInlineScripts) {
            console.log(`ℹ️ ${file}: No inline scripts found`);
        }
    }

    console.log("\n==================================================");
    console.log("SYNTAX VALIDATOR SUMMARY");
    console.log("==================================================");
    console.log(`Total JavaScript Syntax Errors: ${totalErrors}`);
    console.log("==================================================");

    if (totalErrors > 0) {
        process.exit(1);
    } else {
        console.log("🎉 SUCCESS: All JavaScript scripts compile flawlessly!");
        process.exit(0);
    }
}

checkJsSyntax();
