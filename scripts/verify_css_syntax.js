const fs = require('fs');
const path = require('path');

const WORKSPACE_DIR = path.resolve(__dirname, '..');
const CSS_FILE = 'styles.css';

function checkCssSyntax() {
    console.log("==================================================");
    console.log("Starting CSS Syntax & Brackets Validator");
    console.log("==================================================");

    const filePath = path.join(WORKSPACE_DIR, CSS_FILE);
    if (!fs.existsSync(filePath)) {
        console.error(`❌ CSS File missing: ${CSS_FILE}`);
        process.exit(1);
    }

    const css = fs.readFileSync(filePath, 'utf8');
    let errors = 0;
    let warnings = 0;

    // 1. Check for unclosed comments
    const openCommentCount = (css.match(/\/\*/g) || []).length;
    const closeCommentCount = (css.match(/\*\//g) || []).length;

    if (openCommentCount !== closeCommentCount) {
        console.error(`❌ Comment mismatch: Found ${openCommentCount} '/*' but ${closeCommentCount} '*/'!`);
        errors++;
    } else {
        console.log(`✅ Comments are perfectly balanced (${openCommentCount} comments found).`);
    }

    // 2. Bracket matching checking (skipping inside strings & comments)
    let inComment = false;
    let inSingleQuote = false;
    let inDoubleQuote = false;
    let braceStack = [];
    let parenStack = [];
    let line = 1;
    let col = 1;

    for (let i = 0; i < css.length; i++) {
        const char = css[i];

        // Track lines
        if (char === '\n') {
            line++;
            col = 1;
        } else {
            col++;
        }

        // Handle comments
        if (inComment) {
            if (char === '*' && css[i + 1] === '/') {
                inComment = false;
                i++;
            }
            continue;
        }
        if (char === '/' && css[i + 1] === '*') {
            inComment = true;
            i++;
            continue;
        }

        // Handle strings
        if (inSingleQuote) {
            if (char === "'" && css[i - 1] !== '\\') {
                inSingleQuote = false;
            }
            continue;
        }
        if (inDoubleQuote) {
            if (char === '"' && css[i - 1] !== '\\') {
                inDoubleQuote = false;
            }
            continue;
        }

        if (char === "'") {
            inSingleQuote = true;
            continue;
        }
        if (char === '"') {
            inDoubleQuote = true;
            continue;
        }

        // Parentheses matching
        if (char === '(') {
            parenStack.push({ line, col });
        } else if (char === ')') {
            if (parenStack.length === 0) {
                console.error(`❌ Unexpected closing parenthesis ')' at line ${line}, col ${col}`);
                errors++;
            } else {
                parenStack.pop();
            }
        }

        // Curly braces matching
        if (char === '{') {
            braceStack.push({ line, col });
        } else if (char === '}') {
            if (braceStack.length === 0) {
                console.error(`❌ Unexpected closing brace '}' at line ${line}, col ${col}`);
                errors++;
            } else {
                braceStack.pop();
            }
        }
    }

    // Report remaining open braces/parens
    while (braceStack.length > 0) {
        const item = braceStack.pop();
        console.error(`❌ Unclosed opening brace '{' at line ${item.line}, col ${item.col}`);
        errors++;
    }

    while (parenStack.length > 0) {
        const item = parenStack.pop();
        console.error(`❌ Unclosed opening parenthesis '(' at line ${item.line}, col ${item.col}`);
        errors++;
    }

    // 3. Find empty rulesets
    // Matches selectors followed by empty brackets, optional comments inside, e.g. "div {  }"
    const emptyRuleRegex = /([^{}\/]+)\{\s*\}/g;
    let match;
    while ((match = emptyRuleRegex.exec(css)) !== null) {
        const selector = match[1].trim();
        // Ignore @media, keyframes rules since they aren't selectors, but check basic ones
        if (selector && !selector.startsWith('@')) {
            console.warn(`⚠️ Warning: Empty rule found for selector "${selector}"`);
            warnings++;
        }
    }

    console.log("\n==================================================");
    console.log("CSS VALIDATOR SUMMARY");
    console.log("==================================================");
    console.log(`Total CSS Errors: ${errors}`);
    console.log(`Total CSS Warnings: ${warnings}`);
    console.log("==================================================");

    if (errors > 0) {
        process.exit(1);
    } else {
        console.log("🎉 SUCCESS: The CSS file is syntactically flawless!");
        process.exit(0);
    }
}

checkCssSyntax();
