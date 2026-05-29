const fs = require('fs');

const dir = 'c:/Users/danie/Documents/GitHub/danielkarasani.github.io/';

// 1. Update script.js for touch targets
let scriptJsPath = dir + 'script.js';
let scriptContent = fs.readFileSync(scriptJsPath, 'utf-8');

scriptContent = scriptContent.replace(
    /width: 32px; height: 32px;/g,
    "width: 44px; height: 44px;"
);

fs.writeFileSync(scriptJsPath, scriptContent, 'utf-8');

// 2. Update styles.css for scroll lock and hamburger touch targets
let stylesPath = dir + 'styles.css';
let css = fs.readFileSync(stylesPath, 'utf-8');

css = css.replace(
    "body.no-scroll { overflow: hidden !important; }",
    "body.no-scroll { overflow: hidden !important; touch-action: none; }"
);

// We need to find the hamburger-menu block inside the @media (max-width: 990px)
// It looks like:
/*
    .hamburger-menu {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: 30px;
        height: 20px;
        background: transparent;
        border: none;
        cursor: pointer;
        padding: 0;
*/

css = css.replace(
    "width: 30px;\n        height: 20px;\n        background: transparent;\n        border: none;\n        cursor: pointer;\n        padding: 0;",
    "width: 44px;\n        height: 44px;\n        background: transparent;\n        border: none;\n        cursor: pointer;\n        padding: 12px 7px;"
);

fs.writeFileSync(stylesPath, css, 'utf-8');

console.log('Mobile nav and touch targets updated.');
