from flask import Flask, render_template, request
import os
import json
from io import StringIO
import sys

app = Flask(__name__)

# Define the directory containing your JSON files
directory_path = r'C:\Users\Miros\Desktop\Report Project\Data'

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
                            data_with_search_term[site] = {'Customer': [], 'System': [], 'Site Type': [], 'Work Type': [], 'Radar Manufacturer': [], 'Engineer': [], 'Work Status': []}
                        customer = data.get('customer', 'N/A')
                        system = data.get('system', 'N/A')
                        site_type = data.get('siteType', 'N/A')
                        work_type = data.get('workType', 'N/A')
                        radar_manufacturer = data.get('radarManufacturer', 'N/A')
                        engineer = data.get('engineer', 'N/A')
                        work_status = data.get('workStatus', 'N/A')
                        data_with_search_term[site]['Customer'].append(customer)
                        data_with_search_term[site]['System'].append(system)
                        data_with_search_term[site]['Site Type'].append(site_type)
                        data_with_search_term[site]['Work Type'].append(work_type)
                        data_with_search_term[site]['Radar Manufacturer'].append(radar_manufacturer)
                        data_with_search_term[site]['Engineer'].append(engineer)
                        data_with_search_term[site]['Work Status'].append(work_status)
                        found_in_file = True
                        break
                if found_in_file:
                    pass
    return data_with_search_term, total_files

def display_search_results(data, file_order):
    output = StringIO()
    sys.stdout = output
    tab_width = 30
    print(f"Data matching '{search_term}':\n")
    max_category_length = max(len(format_category_name(category)) for category in data[next(iter(data))])
    tab_width = max_category_length + 15

    for site in file_order:
        print(f"Site: {site}")
        for category, values in data[site].items():
            if category == "Site":
                continue
            print(f"{format_category_name(category)}:".ljust(tab_width), end="")
            for value in values:
                print(f"{value}".ljust(tab_width), end="")
            print()
        print()
    sys.stdout = sys.__stdout__
    return output.getvalue()

def display_site_system_list(data):
    output = StringIO()
    sys.stdout = output
    tab_width = 30
    print("All Sites:")
    for site, site_values in data.items():
        customer = site_values['Customer'][0] if site_values['Customer'] else 'N/A'
        system_values = ', '.join(site_values['System'])
        print(f"{customer.ljust(tab_width)}{site.ljust(tab_width)}{system_values.ljust(tab_width)}")
    print()
    sys.stdout = sys.__stdout__
    return output.getvalue()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/search', methods=['POST'])
def search():
    search_term = request.form['search_term']
    if search_term.lower() == 'exit':
        exit()
    elif search_term.lower() == 'list':
        data, _ = find_data_with_search_term(directory_path, "")
        output = display_site_system_list(data)
    else:
        data, total_files = find_data_with_search_term(directory_path, search_term)
        if not data:
            output = f"No matches found for '{search_term}'."
        else:
            site_order = list(data.keys())
            output = display_search_results(data, site_order)
    return render_template('index.html', output=output)

if __name__ == '__main__':
    app.run(debug=True)
