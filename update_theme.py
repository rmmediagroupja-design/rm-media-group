import os

replacements = {
    '#c9a96e': '#00D2B9',
    '#C9A96E': '#00D2B9',
    '#e0c99a': '#4DE3D0',
    '#E0C99A': '#4DE3D0',
    '#9c7c4e': '#00A692',
    '#9C7C4E': '#00A692',
    '--gold': '--cyan',
    '-gold': '-cyan',
    'gold/': 'cyan/',
}

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_content = content
    # Order matters: replace --gold before -gold to avoid overlapping issues
    # Actually if we replace --gold with --cyan, then -gold with -cyan:
    # '--gold' -> '--cyan'
    # Then '-cyan' doesn't contain '-gold', so it's safe.
    # But wait, if we replace '-gold' first, '--gold' becomes '--cyan', which is correct!
    # Let's just replace --gold first, then -gold.
    
    for old in ['#c9a96e', '#C9A96E', '#e0c99a', '#E0C99A', '#9c7c4e', '#9C7C4E', '--gold', '-gold', 'gold/']:
        new = replacements[old]
        new_content = new_content.replace(old, new)
            
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {filepath}")

for root, dirs, files in os.walk(r"C:\Users\Alienware\Desktop\Antigravity\Website\rm-media-group"):
    if any(ignore in root for ignore in ['node_modules', '.next', '.git']):
        continue
    for file in files:
        if file.endswith(('.tsx', '.ts', '.css')):
            process_file(os.path.join(root, file))
        if file == '.env.example':
            process_file(os.path.join(root, file))
print("Done.")
