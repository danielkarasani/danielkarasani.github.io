import os

for f in os.listdir('.'):
    if f.endswith('.html') and os.path.isfile(f):
        with open(f, 'r', encoding='utf-8') as file:
            content = file.read()
            
        count = content.count('<meta property="og:type" content="website">')
        if count > 1:
            parts = content.rsplit('<meta property="og:type" content="website">', 1)
            # Remove any trailing whitespace left over by the removed tag
            new_content = parts[0] + parts[1]
            with open(f, 'w', encoding='utf-8') as file:
                file.write(new_content)
            print(f"Fixed {f}")
