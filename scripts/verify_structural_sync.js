const fs = require('fs');
const path = require('path');

// Base workspace path
const WORKSPACE_DIR = path.resolve(__dirname, '..');

// List of 12 HTML files grouped by language
const HTML_FILES = {
  en: ['index.html', 'about.html', 'blog.html', 'air-analyzer.html'],
  de: ['index-de.html', 'about-de.html', 'blog-de.html', 'air-analyzer-de.html'],
  it: ['index-it.html', 'about-it.html', 'blog-it.html', 'air-analyzer-it.html']
};

// Localized expectations
const EXPECTED_ARIA_LABELS = {
  en: {
    theme_toggle: 'Toggle light and dark theme',
    lang_en: 'Switch language to English',
    lang_de: 'Switch language to German',
    lang_it: 'Switch language to Italian'
  },
  de: {
    theme_toggle: 'Licht- und Dunkelmodus umschalten',
    lang_en: 'Sprache auf Englisch umstellen',
    lang_de: 'Sprache auf Deutsch umstellen',
    lang_it: 'Sprache auf Italienisch umstellen'
  },
  it: {
    theme_toggle: 'Attiva/disattiva tema chiaro e scuro',
    lang_en: 'Passa alla lingua inglese',
    lang_de: 'Passa alla lingua tedesca',
    lang_it: 'Passa alla lingua italiana'
  }
};

function checkHtmlFile(filePath, lang) {
  const errors = [];
  const filename = path.basename(filePath);

  // Check if file exists
  if (!fs.existsSync(filePath)) {
    return [`File ${filename} does not exist`];
  }

  const content = fs.readFileSync(filePath, 'utf8');

  // 1. Check manifest linkage
  if (!content.includes('href="manifest.json"') && !content.includes("href='manifest.json'")) {
    errors.push("Missing PWA manifest linkage: <link rel=\"manifest\" href=\"manifest.json\">");
  }

  // 2. Check theme-color linkage
  if (!content.includes('name="theme-color"') && !content.includes("name='theme-color'")) {
    errors.push("Missing theme-color meta tag: <meta name=\"theme-color\" content=\"#c89b72\">");
  }

  // 3. Check theme-toggle aria-label
  const expectedThemeLabel = EXPECTED_ARIA_LABELS[lang].theme_toggle;
  if (!content.includes(`aria-label="${expectedThemeLabel}"`) && !content.includes(`aria-label='${expectedThemeLabel}'`)) {
    errors.push(`Missing or incorrect aria-label on theme-toggle. Expected: "${expectedThemeLabel}"`);
  }

  // 4. Check language switcher aria-labels
  const expectedLabels = EXPECTED_ARIA_LABELS[lang];
  for (const [code, key] of [['en', 'lang_en'], ['de', 'lang_de'], ['it', 'lang_it']]) {
    const expectedLabel = expectedLabels[key];
    if (!content.includes(expectedLabel)) {
      errors.push(`Missing expected language switcher aria-label: "${expectedLabel}" for lang "${code}"`);
    }
  }

  return errors;
}

function checkSw() {
  const errors = [];
  const swPath = path.join(WORKSPACE_DIR, 'sw.js');
  if (!fs.existsSync(swPath)) {
    return ['sw.js does not exist'];
  }

  const content = fs.readFileSync(swPath, 'utf8');

  if (!/const\s+CACHE_NAME\s*=\s*['"]daniel-portfolio-cache-v\d+['"];/.test(content)) {
    errors.push("CACHE_NAME is not defined or does not match 'daniel-portfolio-cache-v<N>' in sw.js");
  }

  if (!content.includes("'./manifest.json'") && !content.includes('"./manifest.json"')) {
    errors.push("manifest.json is not present in PRECACHE_ASSETS of sw.js");
  }

  return errors;
}

function main() {
  console.log("==================================================");
  console.log("Starting Structural & Accessibility Synchronization Check (JS)");
  console.log("==================================================");

  let allPassed = true;

  // Check all HTML files
  for (const [lang, files] of Object.entries(HTML_FILES)) {
    console.log(`\nChecking [${lang.toUpperCase()}] HTML pages...`);
    for (const filename of files) {
      const filePath = path.join(WORKSPACE_DIR, filename);
      const errors = checkHtmlFile(filePath, lang);
      if (errors.length > 0) {
        allPassed = false;
        console.log(`❌ ${filename} has issues:`);
        for (const err of errors) {
          console.log(`   - ${err}`);
        }
      } else {
        console.log(`✅ ${filename} passed all checks.`);
      }
    }
  }

  // Check Service Worker
  console.log("\nChecking Service Worker configuration...");
  const swErrors = checkSw();
  if (swErrors.length > 0) {
    allPassed = false;
    console.log("❌ sw.js has issues:");
    for (const err of swErrors) {
      console.log(`   - ${err}`);
    }
  } else {
    console.log("✅ sw.js passed all checks.");
  }

  console.log("\n==================================================");
  if (allPassed) {
    console.log("🎉 SUCCESS: All files are perfectly synchronized!");
    process.exit(0);
  } else {
    console.log("⚠️ FAILURE: Synchronization check failed. Please resolve the errors above.");
    process.exit(1);
  }
}

main();
