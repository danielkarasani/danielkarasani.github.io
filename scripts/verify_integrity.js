const fs = require('fs');
const path = require('path');

const WORKSPACE_DIR = path.resolve(__dirname, '..');

const HTML_FILES = [
    'index.html', 'index-de.html', 'index-it.html',
    'about.html', 'about-de.html', 'about-it.html',
    'air-analyzer.html', 'air-analyzer-de.html', 'air-analyzer-it.html',
    'blog.html', 'blog-de.html', 'blog-it.html'
];

function checkIntegrity() {
    console.log("==================================================");
    console.log("Starting Web Integrity & Broken Link Checker");
    console.log("==================================================");

    let totalErrors = 0;
    let totalWarnings = 0;

    // Cache elements' IDs by file to resolve anchor tags
    const fileIdsMap = {};

    // 1. Read and parse files to build IDs map
    for (const file of HTML_FILES) {
        const filePath = path.join(WORKSPACE_DIR, file);
        if (!fs.existsSync(filePath)) {
            console.error(`❌ HTML File missing: ${file}`);
            totalErrors++;
            continue;
        }

        const content = fs.readFileSync(filePath, 'utf8');
        const ids = new Set();
        
        // Match id="..." or id='...'
        const idRegex = /\bid\s*=\s*['"]([^'"]+)['"]/g;
        let match;
        while ((match = idRegex.exec(content)) !== null) {
            const idVal = match[1];
            if (ids.has(idVal)) {
                console.warn(`⚠️ Warning: Duplicate id "${idVal}" found in ${file}`);
                totalWarnings++;
            }
            ids.add(idVal);
        }

        fileIdsMap[file] = ids;
    }

    // 2. Perform validation on each HTML file
    for (const file of HTML_FILES) {
        const filePath = path.join(WORKSPACE_DIR, file);
        if (!fs.existsSync(filePath)) continue;

        console.log(`\nAnalyzing ${file}...`);
        const content = fs.readFileSync(filePath, 'utf8');
        let fileErrors = 0;

        // Validation A: Anchor links and local pages
        // Matches href="..." or href='...'
        const hrefRegex = /\bhref\s*=\s*['"]([^'"]+)['"]/g;
        let hrefMatch;
        while ((hrefMatch = hrefRegex.exec(content)) !== null) {
            const href = hrefMatch[1].trim();

            // Ignore external links, mailto, whatsapp, phone links, and root-relative links if applicable
            if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('mailto:') || href.startsWith('wa.me') || href.startsWith('tel:') || href.startsWith('//')) {
                continue;
            }

            // Ignore blank or placeholder links
            if (href === '#' || href === '') {
                continue;
            }

            // Handle fragments
            const [urlPart, hashPart] = href.split('#');
            const targetFile = urlPart === '' ? file : urlPart;

            // Resolve target file path
            const targetPath = path.join(WORKSPACE_DIR, targetFile);

            if (!fs.existsSync(targetPath)) {
                console.error(`  ❌ Broken Link: href="${href}" -> Local file "${targetFile}" does not exist!`);
                fileErrors++;
                totalErrors++;
            } else if (hashPart) {
                // If it's a known HTML file, check if the ID exists in it
                if (fileIdsMap[targetFile]) {
                    if (!fileIdsMap[targetFile].has(hashPart)) {
                        console.error(`  ❌ Broken Anchor: href="${href}" -> Element with id="${hashPart}" does not exist in "${targetFile}"!`);
                        fileErrors++;
                        totalErrors++;
                    }
                } else {
                    // Non-HTML files can't easily be checked for fragments
                    console.log(`  ℹ️ Link with hash references non-HTML file: ${href}`);
                }
            }
        }

        // Validation B: Local Image Assets
        // Matches src="..." or src='...'
        const srcRegex = /\bsrc\s*=\s*['"]([^'"]+)['"]/g;
        let srcMatch;
        while ((srcMatch = srcRegex.exec(content)) !== null) {
            const src = srcMatch[1].trim();

            // Ignore external images
            if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('//') || src.startsWith('data:')) {
                continue;
            }

            // Resolve image path
            const imagePath = path.join(WORKSPACE_DIR, src);
            if (!fs.existsSync(imagePath)) {
                console.error(`  ❌ Broken Image: src="${src}" -> File does not exist!`);
                fileErrors++;
                totalErrors++;
            }
        }

        // Validation C: Responsive WebP/images in styles (basic check)
        const styleImageRegex = /url\(['"]?([^'")]+)['"]?\)/g;
        let styleMatch;
        while ((styleMatch = styleImageRegex.exec(content)) !== null) {
            const imgUrl = styleMatch[1].trim();
            if (imgUrl.startsWith('http://') || imgUrl.startsWith('https://') || imgUrl.startsWith('//') || imgUrl.startsWith('data:')) {
                continue;
            }
            const imgPath = path.join(WORKSPACE_DIR, imgUrl);
            if (!fs.existsSync(imgPath)) {
                console.error(`  ❌ Broken Background Image in CSS/Style: url("${imgUrl}") -> File does not exist!`);
                fileErrors++;
                totalErrors++;
            }
        }

        if (fileErrors === 0) {
            console.log(`  ✅ Passed all structural integrity checks.`);
        } else {
            console.log(`  ❌ Failed with ${fileErrors} errors.`);
        }
    }

    // 3. Final summary
    console.log("\n==================================================");
    console.log("INTEGRITY SUMMARY");
    console.log("==================================================");
    console.log(`Total Errors (Broken files, links, or anchors): ${totalErrors}`);
    console.log(`Total Warnings (Duplicate IDs or non-critical issues): ${totalWarnings}`);
    console.log("==================================================");

    if (totalErrors > 0) {
        process.exit(1);
    } else {
        console.log("🎉 SUCCESS: The website has 100% integrity!");
        process.exit(0);
    }
}

checkIntegrity();
