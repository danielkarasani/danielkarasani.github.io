import os
import glob

def fix_html_files():
    html_files = glob.glob('*.html')
    old_body_script = "if (localStorage.getItem('theme') === 'dark') document.body.classList.add('dark-theme');"
    new_body_script = "if (localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) document.body.classList.add('dark-theme');"

    old_doc_script = "if (localStorage.getItem('theme') === 'dark') document.documentElement.classList.add('dark-theme');"
    new_doc_script = "if (localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) document.documentElement.classList.add('dark-theme');"

    for file in html_files:
        with open(file, 'r', encoding='utf-8') as f:
            content = f.read()

        new_content = content.replace(old_body_script, new_body_script)
        new_content = new_content.replace(old_doc_script, new_doc_script)

        if new_content != content:
            with open(file, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated {file}")

if __name__ == '__main__':
    fix_html_files()
