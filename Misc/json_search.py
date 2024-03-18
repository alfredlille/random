import os
import json

# Define color escape codes
COLOR_CATEGORY = '\033[36m'  # Blue color
COLOR_HEADING = '\033[34m'  # Dark Blue color
COLOR_SITE = '\033[35m'  # Purple color
COLOR_RED = '\033[91m'  # Red color
COLOR_GREEN = '\033[92m'  # Green color
COLOR_YELLOW = '\033[33m'  # Yellow color
COLOR_RESET = '\033[0m'

# Values that need to be printed in red, green, or yellow
RED_VALUES = ["Needs Attention", "Not OK"]
GREEN_VALUES = ["Complete"]
YELLOW_VALUES = ["In Progress"]

# Define the directory containing your JSON files
directory_path = r'C:\Users\Miros\Documents\GitHub\random\Data' 

def format_category_name(category):
    return ' '.join(word.capitalize() for word in category.split())

def find_data_with_search_term(directory, search_term):
    data_with_search_term = {}
    total_files = 0
    search_term_lower = search_term.lower()
    for filename in os.listdir(directory):
        if filename.endswith('.json'):
            total_files += 1
            with open(os.path.join(directory, filename), 'r') as file:
                try:
                    data = json.load(file)
                except json.JSONDecodeError:
                    print(f"Error decoding JSON in file: {filename}. Skipping...")
                    continue
                found_in_file = False
                for key, value in data.items():
                    if isinstance(value, str) and search_term_lower in value.lower():
                        site = data.get('site', 'N/A')
                        if site not in data_with_search_term:
                            data_with_search_term[site] = []
                        site_data = {
                            'Customer': data.get('customer', 'N/A'),
                            'System': data.get('system', 'N/A'),
                            'Site Type': data.get('siteType', 'N/A'),
                            'Work Type': data.get('workType', 'N/A'),
                            'Radar Manufacturer': data.get('radarManufacturer', 'N/A'),
                            'Engineer': data.get('engineer', 'N/A'),
                            'General Comments': data.get('generalComments', 'N/A'),
                            'Work Status': data.get('workStatus', 'N/A')
                        }
                        data_with_search_term[site].append(site_data)
                        found_in_file = True
                        break
                if found_in_file:
                    pass
    return data_with_search_term, total_files

def display_search_results(data, file_order, search_term):
    print(f"There were results matching '{search_term}':\n")

    if not data:
        print("No data to display.")
        return

    # Calculate the maximum length of the category names to align the output
    max_category_length = max(
        len(format_category_name(category)) 
        for site_data in data.values() 
        for site_entry in site_data 
        for category in site_entry
    )

    for site in file_order:
        print(f"{COLOR_HEADING}Site:{COLOR_RESET} {site}")
        for site_entry in data[site]:
            for category, value in site_entry.items():
                category_name = format_category_name(category)
                padding = max_category_length - len(category_name) + 2
                print(f"{COLOR_CATEGORY}{category_name}:{COLOR_RESET}{' ' * padding}", end="")
                if value in RED_VALUES:
                    print(f"{COLOR_RED}{value}{COLOR_RESET}")
                elif value in GREEN_VALUES:
                    print(f"{COLOR_GREEN}{value}{COLOR_RESET}")
                elif value in YELLOW_VALUES:
                    print(f"{COLOR_YELLOW}{value}{COLOR_RESET}")
                else:
                    print(value)
        print()

while True:
    try:
        print("\033[92mMIROS Report Search\033[0m\n")
        search_term = input("Enter your search term (type 'exit' to quit): ")
        if search_term.lower() == 'exit':
            break
        else:
            print()  # Add line break after search term input
            data, total_files = find_data_with_search_term(directory_path, search_term)

            print(f"Total reports processed: {total_files}\n")
            if not data:
                print(f"No matches found for '{search_term}'.\n")
            else:
                site_order = list(data.keys())  # Maintain the order of appearance of sites
                display_search_results(data, site_order, search_term)
    except KeyboardInterrupt:
        print("\nExiting...")
        break
