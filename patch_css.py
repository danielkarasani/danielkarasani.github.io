import re

filepath = 'c:/Users/danie/Documents/GitHub/danielkarasani.github.io/styles.css'
with open(filepath, 'r', encoding='utf-8') as f:
    css = f.read()

# 1. Hero Image overflow
css = css.replace(
    ".hero-image img { max-width: 350px; }",
    ".hero-image img { max-width: min(100%, 350px); }"
)

# 2. Typography size
css = css.replace(
    "h1 { font-size: 2.8rem; }",
    "h1 { font-size: 2.4rem; }"
)
css = css.replace(
    "h2 { font-size: 2.3rem; }",
    "h2 { font-size: 1.8rem; }"
)

# 3. Command Palette 100vw
css = css.replace(
    "width: 100vw;",
    "width: 100%;"
)

# 4. Mobile Nav Refactoring (line 639-677)
# We will replace the absolute positioning with flexbox rules
# Original:
#     .lang-switcher { 
#         display: flex !important; 
#         position: absolute;
# ...
#     #theme-toggle { right: 55px; }
#     #search-toggle { right: 85px; }
#     .lang-switcher { right: 115px; gap: 5px; font-size: 0.75rem; }

# Let's append an override at the end of styles.css instead of regex replacing complex blocks, to be absolutely safe.
override_css = """
/* --- MOBILE FIXES OVERRIDES --- */
@media (max-width: 990px) {
    /* Reset absolute positioning on nav elements */
    .hamburger-menu, .lang-switcher, #search-toggle, #theme-toggle {
        position: static !important;
        transform: none !important;
        margin-left: 10px !important;
    }
    .lang-switcher {
        margin-left: auto !important; /* Push everything else to the right */
        gap: 8px;
    }
    /* Make the container a flexbox that wraps/adjusts */
    .nav-container {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        width: 100%;
        padding: 0 20px;
    }
    .logo {
        margin-right: auto;
    }
    
    /* On very small screens, adjust gap */
    @media (max-width: 400px) {
        .lang-switcher { gap: 4px; font-size: 0.75rem; margin-left: 5px !important; }
        .hamburger-menu, #search-toggle, #theme-toggle { margin-left: 5px !important; }
        .logo { font-size: 1.15rem; }
    }
}
"""

css += override_css

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(css)

print("CSS updated.")
