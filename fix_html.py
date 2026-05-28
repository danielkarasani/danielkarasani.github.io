import os
import re

files = [
    'index-de.html', 'index-it.html',
    'about-de.html', 'about-it.html',
    'blog-de.html', 'blog-it.html',
    'air-analyzer-de.html', 'air-analyzer-it.html'
]

for file in files:
    filepath = os.path.join(r"C:\Users\danie\Documents\GitHub\danielkarasani.github.io", file)
    if not os.path.exists(filepath):
        print(f"Skipping {file}, not found.")
        continue
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Move charset to right after <head>
    content = re.sub(r'(<head>.*?)(\s*<meta charset="UTF-8">\s*)', r'\1', content, flags=re.DOTALL)
    # add it back
    content = re.sub(r'(<head>)', r'\1\n    <meta charset="UTF-8">', content)

    # 2. aria-label on nav
    content = content.replace('<nav>', '<nav aria-label="Main navigation">')

    # 3. WhatsApp link
    wa_pattern = r'<a href="https://wa\.me/393245808570"[^>]*?onmouseover="this\.style\.color=\'#25D366\'" onmouseout="this\.style\.color=\'\'"[^>]*?>'
    wa_repl = r'<a href="https://wa.me/393245808570" class="hover-target whatsapp-link" target="_blank" rel="noopener noreferrer">'
    content = re.sub(wa_pattern, wa_repl, content)

    # 4. Form labels and honeypot for index-*
    if file.startswith('index'):
        content = content.replace('<input type="checkbox" name="botcheck" style="display: none;">', '<input type="checkbox" name="botcheck" style="display: none;" aria-hidden="true" tabindex="-1">')
        content = content.replace(
            '<input type="text" name="name" class="hover-target" placeholder="Name" required>',
            '<label for="contact-name" class="sr-only">Name</label>\n                    <input type="text" name="name" id="contact-name" class="hover-target" placeholder="Name" required>'
        )
        content = content.replace(
            '<input type="email" name="email" class="hover-target" placeholder="Email Address" required>',
            '<label for="contact-email" class="sr-only">Email Address</label>\n                    <input type="email" name="email" id="contact-email" class="hover-target" placeholder="Email Address" required>'
        )
        content = content.replace(
            '<textarea name="message" rows="5" class="hover-target" placeholder="Your Message..." required></textarea>',
            '<label for="contact-message" class="sr-only">Your Message</label>\n                <textarea name="message" id="contact-message" rows="5" class="hover-target" placeholder="Your Message..." required></textarea>'
        )

    # 5. Footer for blog-*
    if file.startswith('blog'):
        content = content.replace(
            '<p>© 2026 Daniel Karasani. Designed &amp; Engineered for Performance.</p>',
            '<p>Designed &amp; Engineered for Performance.</p>\n            <p>Built by Daniel Karasani &copy; 2026. All rights reserved.</p>'
        )

    # 6. OG tags, hreflang, favicon for about-*
    if file.startswith('about'):
        if 'hreflang="x-default"' not in content:
            content = content.replace(
                '<link rel="alternate" hreflang="it" href="https://danielkarasani.github.io/about-it.html" />',
                '<link rel="alternate" hreflang="it" href="https://danielkarasani.github.io/about-it.html" />\n    <link rel="alternate" hreflang="x-default" href="https://danielkarasani.github.io/about.html" />\n    <meta property="og:title" content="About Daniel Karasani | Industrial & Mechanical Engineer">\n    <meta property="og:description" content="Learn about Daniel Karasani\'s journey in Industrial and Mechanical Engineering.">\n    <meta property="og:image" content="https://danielkarasani.github.io/images/daniel-karasani-industrial-engineer.webp">\n    <meta property="og:url" content="https://danielkarasani.github.io/about.html">\n    <meta property="og:type" content="website">\n    <link rel="icon" type="image/svg+xml" href="DanielKarasani-favcon.svg">'
            )
            # if alternate wasn't found (maybe different ending quotes):
            if 'hreflang="x-default"' not in content:
                 content = content.replace(
                    '<link rel="alternate" hreflang="it" href="https://danielkarasani.github.io/about-it.html">',
                    '<link rel="alternate" hreflang="it" href="https://danielkarasani.github.io/about-it.html">\n    <link rel="alternate" hreflang="x-default" href="https://danielkarasani.github.io/about.html" />\n    <meta property="og:title" content="About Daniel Karasani | Industrial & Mechanical Engineer">\n    <meta property="og:description" content="Learn about Daniel Karasani\'s journey in Industrial and Mechanical Engineering.">\n    <meta property="og:image" content="https://danielkarasani.github.io/images/daniel-karasani-industrial-engineer.webp">\n    <meta property="og:url" content="https://danielkarasani.github.io/about.html">\n    <meta property="og:type" content="website">\n    <link rel="icon" type="image/svg+xml" href="DanielKarasani-favcon.svg">'
                )

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Updated {file}")
