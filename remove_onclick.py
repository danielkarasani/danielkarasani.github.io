import os
import re

files = ["blog.html", "blog-de.html", "blog-it.html"]
for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    def replace_in_noscript(match):
        noscript_content = match.group(0)
        new_content = re.sub(r'\s*onclick="[^"]+"', '', noscript_content)
        return new_content
        
    new_content = re.sub(r'<noscript>.*?</noscript>', replace_in_noscript, content, flags=re.DOTALL)
    
    with open(f, 'w', encoding='utf-8') as file:
        file.write(new_content)

print("Done")
