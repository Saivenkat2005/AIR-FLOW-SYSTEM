import os

def generate_tree(startpath, exclude_dirs):
    tree_str = ""
    for root, dirs, files in os.walk(startpath):
        dirs[:] = [d for d in dirs if d not in exclude_dirs]
        level = root.replace(startpath, '').count(os.sep)
        indent = '│   ' * (level - 1) + '├── ' if level > 0 else ''
        tree_str += f"{indent}{os.path.basename(root)}/\n"
        subindent = '│   ' * level + '├── '
        for f in files:
            tree_str += f"{subindent}{f}\n"
    return tree_str

if __name__ == "__main__":
    startpath = "."
    exclude_dirs = {"node_modules", ".git", "target", ".idea", ".vscode", "build", ".mvn", "__pycache__"}
    tree = generate_tree(startpath, exclude_dirs)
    print(tree)
