import os

PROJECT_ROOT = "."   # корень проекта
OUTPUT_FILE = "structure.txt"

IGNORE_DIRS = {".git", "__pycache__", ".venv", "venv", "node_modules"}

def write_tree(root, output_file):
    with open(output_file, "w", encoding="utf-8") as f:
        for dirpath, dirnames, filenames in os.walk(root):
            # фильтруем папки
            dirnames[:] = [d for d in dirnames if d not in IGNORE_DIRS]

            level = dirpath.replace(root, "").count(os.sep)
            indent = "│   " * level
            folder_name = os.path.basename(dirpath)

            f.write(f"{indent}📁 {folder_name}/\n")

            sub_indent = "│   " * (level + 1)
            for file in filenames:
                f.write(f"{sub_indent}📄 {file}\n")

if __name__ == "__main__":
    write_tree(PROJECT_ROOT, OUTPUT_FILE)
    print(f"Структура проекта сохранена в {OUTPUT_FILE}")