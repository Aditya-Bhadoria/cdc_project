import os

# Folders to ignore
IGNORE_DIRS = {'.git', 'node_modules', '.next', '.vscode', 'public'}

def list_files(startpath):
    for root, dirs, files in os.walk(startpath):
        # Modify dirs in-place to skip ignored folders
        dirs[:] = [d for d in dirs if d not in IGNORE_DIRS]

        level = root.replace(startpath, '').count(os.sep)
        indent = ' ' * 4 * (level)
        print(f'{indent}{os.path.basename(root)}/')
        subindent = ' ' * 4 * (level + 1)
        for f in files:
            print(f'{subindent}{f}')

if __name__ == "__main__":
    list_files('.')