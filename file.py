import os

def generate_md_tree(directory, indent=0, md_file=None):
    # Files and directories to ignore
    ignored_items = set(['directory_structure.md','package-lock.json','package.json','.git', 'node_modules', '.gitignore', 'LICENSE', 'README.md', 'buildCourse.ts', 'course.json', 'file.py'])

    # Get the list of files and subdirectories in the current directory
    items = os.listdir(directory)
    
    # Sort the items to ensure consistent order
    items.sort()

    # Open the Markdown file for writing if it's not provided
    if md_file is None:
        md_file = open('directory_structure.md', 'w', encoding='utf-8')

    # Write the directory name with appropriate indentation
    md_file.write('  ' * indent + f"- **{os.path.basename(directory)}/**\n")

    # Iterate over the items in the directory
    for item in items:
        # Get the full path of the item
        item_path = os.path.join(directory, item)

        # Skip ignored items
        if item in ignored_items:
            continue

        # If it's a subdirectory, recursively call the function
        if os.path.isdir(item_path):
            generate_md_tree(item_path, indent + 1, md_file)
        else:
            # If it's a file, write its name with indentation
            md_file.write('  ' * (indent + 1) + f"- {item}\n")

    # Close the file if it was opened in this function
    if indent == 0:
        md_file.close()

# Specify the root directory for which you want to generate the structure
root_directory = './'

# Call the function to generate the Markdown tree
generate_md_tree(root_directory)
