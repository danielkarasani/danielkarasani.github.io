const fs = require('fs');
const path = require('path');

// 1. Update blog-posts.json to include category
const blogPostsPath = path.join(__dirname, 'blog-posts.json');
if (fs.existsSync(blogPostsPath)) {
    let posts = JSON.parse(fs.readFileSync(blogPostsPath, 'utf8'));
    posts.forEach(p => {
        if (p.id.includes('welcome')) {
            p.category = 'General Topics';
        } else if (p.id.includes('direct')) {
            p.category = 'Off-Topic';
        } else {
            p.category = 'Engineering & Research';
        }
    });
    fs.writeFileSync(blogPostsPath, JSON.stringify(posts, null, 2), 'utf8');
}

// 2. Update script.js to render data-category and implement filter logic
const scriptPath = path.join(__dirname, 'script.js');
let scriptContent = fs.readFileSync(scriptPath, 'utf8');

// Update initDynamicBlogFeed to include data-category
scriptContent = scriptContent.replace(
    /cardsHTML \+= `\s*<a href="posts\/\$\{post.id\}" class="blog-card/g,
    `const catStr = post.category || 'General Topics';\n            cardsHTML += \`\n                <a href="posts/\$\{post.id\}" data-category="\$\{catStr\}" class="blog-card`
);

// Inject filter logic into initBlogSorting
const filterLogic = `    // Keep a copy of original card nodes in their initial manual order
    const originalCards = Array.from(grid.querySelectorAll('.blog-card'));
    const filterBtns = document.querySelectorAll('.filter-btn');
    let activeCategory = 'all';

    function applyFilters() {
        const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
        const cards = grid.querySelectorAll('.blog-card');
        
        cards.forEach(card => {
            const dateText = (card.querySelector('.blog-date')?.textContent || '').toLowerCase();
            const titleText = (card.querySelector('h3')?.textContent || '').toLowerCase();
            const descText = (card.querySelector('p')?.textContent || '').toLowerCase();
            const categoryAttr = card.dataset.category || 'General Topics';
            
            const matchesSearch = !query || dateText.includes(query) || titleText.includes(query) || descText.includes(query);
            
            let matchesCategory = false;
            if (activeCategory === 'all') {
                matchesCategory = true;
            } else if (activeCategory === 'Engineering & Research' && categoryAttr === 'Engineering & Research') {
                matchesCategory = true;
            } else if (activeCategory === 'General Topics' && categoryAttr === 'General Topics') {
                matchesCategory = true;
            } else if (activeCategory === 'Off-Topic' && categoryAttr === 'Off-Topic') {
                matchesCategory = true;
            } else if (categoryAttr === activeCategory) {
                matchesCategory = true;
            }

            if (matchesSearch && matchesCategory) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });
    }

    if (filterBtns) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                filterBtns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                activeCategory = e.target.dataset.filter;
                applyFilters();
            });
        });
    }

    function applySearch() {
        applyFilters();
    }`;

scriptContent = scriptContent.replace(
    /    \/\/ Keep a copy of original card nodes in their initial manual order\s+const originalCards = Array\.from\(grid\.querySelectorAll\('\.blog-card'\)\);\s+function applySearch\(\) \{[\s\S]+?        \}\);\s+\}/,
    filterLogic
);

scriptContent = scriptContent.replace(
    /if \(searchInput\) \{\s+searchInput\.addEventListener\('input', debounce\(applySearch, 150\)\);\s+\}/g,
    `if (searchInput) {\n        searchInput.addEventListener('input', debounce(applyFilters, 150));\n    }`
);

// We need to also make sure that sort Select calls applyFilters instead of just applying search
scriptContent = scriptContent.replace(
    /applySearch\(\);/g,
    'applyFilters();'
);

fs.writeFileSync(scriptPath, scriptContent, 'utf8');
console.log("Blog filter logic injected successfully.");
