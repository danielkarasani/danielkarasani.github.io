import os
import re
import json

def check_html():
    issues = []
    html_files = [f for f in os.listdir('.') if f.endswith('.html')]
    for file in html_files:
        with open(file, 'r', encoding='utf-8') as f:
            content = f.read()
            
            # Check for empty href
            empty_hrefs = re.findall(r'href=["\']\s*["\']', content)
            if empty_hrefs:
                issues.append(f"{file}: Found empty hrefs: {len(empty_hrefs)}")
                
            # Check for multiple main tags
            mains = re.findall(r'<main', content)
            if len(mains) > 1:
                issues.append(f"{file}: Multiple <main> tags found: {len(mains)}")
                
            # Check for duplicate IDs
            ids = re.findall(r'id=["\']([^"\']+)["\']', content)
            import collections
            duplicates = [item for item, count in collections.Counter(ids).items() if count > 1]
            if duplicates:
                issues.append(f"{file}: Duplicate IDs found: {', '.join(duplicates)}")
                
            # Basic tag matching
            tags_to_check = ['div', 'span', 'section', 'a', 'p', 'h1', 'h2', 'h3']
            for tag in tags_to_check:
                opens = len(re.findall(f'<{tag}[>\s]', content))
                closes = len(re.findall(f'</{tag}>', content))
                if opens != closes:
                    issues.append(f"{file}: Mismatched <{tag}> tags (open: {opens}, close: {closes})")
                    
    return issues

def check_json():
    issues = []
    json_files = [f for f in os.listdir('.') if f.endswith('.json')]
    for file in json_files:
        try:
            with open(file, 'r', encoding='utf-8') as f:
                json.load(f)
        except Exception as e:
            issues.append(f"{file}: Invalid JSON - {str(e)}")
    return issues

html_issues = check_html()
json_issues = check_json()

print("--- HTML ISSUES ---")
for issue in html_issues:
    print(issue)
print("\n--- JSON ISSUES ---")
for issue in json_issues:
    print(issue)
