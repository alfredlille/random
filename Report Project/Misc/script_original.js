document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('myForm');
  const formElements = form.elements;

  // Add onchange event listener to each form element
  for (let i = 0; i < formElements.length; i++) {
    formElements[i].addEventListener('change', saveToLocalStorage);
  }

  // Load saved form data from local storage, if available
  const savedFormData = localStorage.getItem('formData');
  if (savedFormData) {
    const parsedFormData = JSON.parse(savedFormData);
    for (const key in parsedFormData) {
      if (form.elements[key]) {
        form.elements[key].value = parsedFormData[key];
      }
    }
  }
});

function saveToLocalStorage() {
  const form = document.getElementById('myForm');
  const formData = new FormData(form);
  const data = {};
  for (const [key, value] of formData.entries()) {
    data[key] = value;
  }
  localStorage.setItem('formData', JSON.stringify(data));
}


function clearFormOLD() {
  const form = document.getElementById('myForm');
  form.reset();
  localStorage.removeItem('formData');
}

function clearForm() {
  const confirmation = confirm('Are you sure you want to clear all data?');
  if (confirmation) {
    const form = document.getElementById('myForm');
    form.reset();
    localStorage.removeItem('formData');

  }
}

function exportToJson() {
  // Get the form element values
  var systemValue = document.querySelector('select[name="system"]').value;
  var workTypeValue = document.querySelector('select[name="workType"]').value;
  var siteValue = document.querySelector('input[name="site"]').value;
  var siteTypeValue = document.querySelector('select[name="siteType"]').value;
  var customerValue = document.querySelector('input[name="customer"]').value;
  var dateValue = document.querySelector('input[name="date"]').value;
  var imoValue = document.querySelector('input[name="imo"]').value;
  var locationValue = document.querySelector('input[name="location"]').value;
  var engineerValue = document.querySelector('select[name="engineer"]').value;
  var recordEquipment1Value = document.querySelector('select[name="recordEquipment1"]').value;
  var workStatusValue = document.querySelector('select[name="workStatus"]').value;

// Check if workTypeValue is "-"
if (workStatusValue === "-") {
  alert('Please select a valid work status before downloading.');
  return;
}  
// Create the JSON object
  var data = {
    system: systemValue,
    workType: workTypeValue,
    site: siteValue,
    siteType: siteTypeValue,
    customer: customerValue,
    date: dateValue,
    imo: imoValue,
    location: locationValue,
    engineer: engineerValue,
    recordEquipment1: recordEquipment1Value,
    workStatus: workStatusValue,
  };

  // Convert the data to JSON string
  var jsonData = JSON.stringify(data, null, 2);

  // Create the filename using the form element values
  var filename = systemValue + "_" + customerValue + "_" + "_" + workTypeValue + "_" + workStatusValue + '.json';

  // Create a temporary <a> element to trigger the download
  var link = document.createElement('a');
  link.href = 'data:application/json;charset=utf-8,' + encodeURIComponent(jsonData);
  link.download = filename;

  // Trigger the download
  link.click();
}

// Function to handle the JSON file selection
function handleJsonFile(event) {
  const file = event.target.files[0];
  const reader = new FileReader();
  
  reader.onload = function(e) {
    const data = JSON.parse(e.target.result);
    fillFormFromJson(data);
  };
  
  reader.readAsText(file);
}

// Function to fill in the form elements from JSON data
function fillFormFromJson(data) {
  const form = document.getElementById('myForm');
  
  // Set the values of the form elements based on the JSON data
  form.elements.system.value = data.system;
  form.elements.workType.value = data.workType;
  form.elements.site.value = data.site;
  form.elements.siteType.value = data.siteType;
  form.elements.customer.value = data.customer;
  form.elements.date.value = data.date;
  form.elements.imo.value = data.imo;
  form.elements.location.value = data.location;
  form.elements.engineer.value = data.engineer;
  form.elements.recordEquipment1.value = data.recordEquipment1;
  form.elements.workStatus.value = data.workStatus;


}

function openFullReport() {
  const formData = JSON.parse(localStorage.getItem('formData'));
  var workStatusValue = document.querySelector('select[name="workStatus"]').value;
  if (workStatusValue === "-") {
    alert('Please select a valid work status before generating the report.');
    return;
  }

  const selectedElements = {
    system: formData.system,
    customer: formData.customer,
    workType: formData.workType,
    workStatus: formData.workStatus

  };

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Service Report</title>
      <link rel="stylesheet" type="text/css" href="style_report.css">
    </head>
    <body>
    <div class="header">
      <h1>Service Report</h1>
    </div>
      <p>System: ${selectedElements.system}</p>
      <p>Customer: ${selectedElements.customer}</p>
      <p>Work Type: ${selectedElements.workType}</p>
      <p>Work Status: ${selectedElements.workStatus}</p>
    </body>
    </html>
  `;

  const newWindow = window.open('', '_blank');
  newWindow.document.write(html);
  newWindow.document.close();
}



function openCloudCertificate() {
  const formData = JSON.parse(localStorage.getItem('formData'));
  var workStatusValue = document.querySelector('select[name="workStatus"]').value;
  if (workStatusValue === "-") {
    alert('Please select a valid work status before generating the report.');
    return;
  }

  const selectedElements = {
    system: formData.system,
    customer: formData.customer,
    workType: formData.workType,
    workStatus: formData.workStatus
  };

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Miros Cloud Certificate</title>
      <link rel="stylesheet" type="text/css" href="style_report.css">
    </head>
    <body>
      <h1>Welcome to Miros Cloud</h1>
      <p>System: ${selectedElements.system}</p>
      <p>Customer: ${selectedElements.customer}</p>
      <p>Work Type: ${selectedElements.workType}</p>
      <p>Work Status: ${selectedElements.workStatus}</p>
    </body>
    </html>
  `;

  const newWindow = window.open('', '_blank');
  newWindow.document.write(html);
  newWindow.document.close();
}



