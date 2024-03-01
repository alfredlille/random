import os
import json

def print_json_files_containing_value(directory_path, search_term):
    json_files = [file for file in os.listdir(directory_path) if file.endswith('.json')]
    
    found_in_files = []
    
    for filename in json_files:
        with open(os.path.join(directory_path, filename), 'r') as file:
            data = json.load(file)
            for key, value in data.items():
                if isinstance(value, str) and search_term.lower() in value.lower():
                    found_in_files.append((filename, data))
                    break
    
    return found_in_files

# Define color escape codes
COLOR_CATEGORY = '\033[36m'  # Blue color
COLOR_HEADING = '\033[34m'  # Blue color
COLOR_VALUE = '\033[97m'
COLOR_RESET = '\033[0m'

def display_search_results(found_in_files):
    if not found_in_files:
        print(f"No matches found for '{search_term}' in any JSON files in the directory.")
    else:
        print(f"Data matching '{search_term}':\n")  # Add a line break after the "Data matching" line
        for filename, data in found_in_files:
            print(f"{COLOR_HEADING}File:{COLOR_RESET} {filename}\n")
            print(json.dumps(data, indent=4))
            print("\n" + "="*50 + "\n")

directory_path = r'C:\Users\Miros\Desktop\Report Project\Data'

while True:
    try:
        search_term = input("Enter the search term (type 'exit' to quit): ")
        if search_term.lower() == 'exit':
            break
        else:
            found_in_files = print_json_files_containing_value(directory_path, search_term)
            display_search_results(found_in_files)
    except KeyboardInterrupt:
        print("\nExiting the program...")
        break
