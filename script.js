window.onbeforeunload = function () {
  window.scrollTo(0, 0); // Scroll to the top
}

// Function to set today's date in the input field
function setDates() {
  var today = new Date();
  var nextYear = new Date();
  nextYear.setFullYear(today.getFullYear() + 1); // Add one year to the current date

  var dateStr = today.toISOString().substring(0, 10);
  var nextYearDateStr = nextYear.toISOString().substring(0, 10);

  document.getElementById('dateInput').value = dateStr;
  document.getElementById('dateInputNextYear').value = nextYearDateStr;
}



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

function navigate() {
  var selectedPage = document.getElementById("dropdown").value;
  if (selectedPage) {
    window.location.href = selectedPage;
  }
}


function clearForm() {
  const confirmation = confirm('Are you sure you want to clear all data?');
  if (confirmation) {
    // Clear form fields
    const form = document.getElementById('myForm');
    form.reset();
    localStorage.removeItem('formData');

    // Clear all data from local storage
    localStorage.clear();

    // Refresh the page
    location.reload();
  }
}

let isScrollToBottom = true;

function toggleScroll() {
  if (isScrollToBottom) {
    window.scrollTo(0, document.body.scrollHeight);
    isScrollToBottom = false;
  } else {
    window.scrollTo(0, 0);
    isScrollToBottom = true;
  }
}

// Function to handle the image file input and save images and descriptions to Local Storage
function handleImageFiles(event) {
  const files = event.target.files;
  const imageContainer = document.getElementById('image-container');
  const uploadedImagesLabel = document.getElementById('uploaded-images-label');

  // Clear existing images and descriptions
  imageContainer.innerHTML = '';

  // Check if any files were selected
  if (files.length > 0) {
    uploadedImagesLabel.style.display = 'block';
  } else {
    uploadedImagesLabel.style.display = 'none';
    return; // Exit the function if no files
  }

  Array.from(files).forEach((file) => {
    if (/image\/(jpeg|jpg|png)/i.test(file.type)) {
      const reader = new FileReader();

      reader.onload = function (e) {
        const uniqueKey = 'image_' + file.name + '_' + new Date().getTime();

        // Create image wrapper
        const wrapper = document.createElement('div');
        wrapper.classList.add('image-wrapper');
        wrapper.style.display = 'flex';
        wrapper.style.alignItems = 'center';
        wrapper.style.marginBottom = '20px';

        // Create and configure the image element
        const image = document.createElement('img');
        image.src = e.target.result;
        image.alt = file.name;
        image.title = file.name;
        image.style.width = '100px';
        image.style.height = '100px';
        image.style.marginRight = '20px';

        // Create and configure the description text input
        const textField = document.createElement('input');
        textField.type = 'text';
        textField.placeholder = 'Enter description...';
        textField.style.marginLeft = '10px';

        // Initially save the image data with an empty description
        saveImageDataAndDescription(uniqueKey, e.target.result, '');

        textField.addEventListener('change', () => {
          // Update the saved data with the new description when it changes
          saveImageDataAndDescription(uniqueKey, e.target.result, textField.value);
        });

        wrapper.appendChild(image);
        wrapper.appendChild(textField);
        imageContainer.appendChild(wrapper);

        // Scroll adjustment to ensure the last element is fully visible
        setTimeout(() => {
          wrapper.scrollIntoView({ behavior: 'auto', block: 'end' });
          setTimeout(() => {
            window.scrollBy(0, 200); // Additional scroll to fine-tune the position
          }, 10); // Short delay to ensure smooth completion
        }, 10);
      };

      reader.readAsDataURL(file);
    } else {
      alert("Unsupported file format. Please upload JPEG, JPG, or PNG images.");
    }
  });
}

function saveImageDataAndDescription(key, imageData, description) {
  const imagesData = JSON.parse(localStorage.getItem('imagesData')) || [];
  const index = imagesData.findIndex((data) => data.key === key);
  if (index !== -1) {
    imagesData[index] = { key, imageData, description };
  } else {
    imagesData.push({ key, imageData, description });
  }
  localStorage.setItem('imagesData', JSON.stringify(imagesData));
}

function populateImagesFromLocalStorage() {
  const imageContainer = document.getElementById('image-container');
  const uploadedImagesLabel = document.getElementById('uploaded-images-label');

  // Clear existing content
  imageContainer.innerHTML = '';
  const imagesData = JSON.parse(localStorage.getItem('imagesData')) || [];

  if (imagesData.length > 0) {
    uploadedImagesLabel.style.display = 'block';
  } else {
    uploadedImagesLabel.style.display = 'none';
  }

  imagesData.forEach(({ key, imageData, description }) => {
    const wrapper = document.createElement('div');
    wrapper.style.display = 'flex';
    wrapper.style.alignItems = 'center';
    wrapper.style.marginBottom = '20px';

    const image = document.createElement('img');
    image.src = imageData;
    image.style.width = '100px';
    image.style.height = '100px';
    image.style.marginRight = '20px';

    const descParagraph = document.createElement('p');
    descParagraph.textContent = description;

    wrapper.appendChild(image);
    wrapper.appendChild(descParagraph);
    imageContainer.appendChild(wrapper);
  });
}

window.onload = function () {
  populateImagesFromLocalStorage();
};

// Function to handle image files
function handleImageFilesOLD(event) {
  const files = event.target.files;
  const imageContainer = document.getElementById('image-container');
  const uploadedImagesLabel = document.getElementById('uploaded-images-label');

  // Clear the previous images
  imageContainer.innerHTML = '';

  // Iterate through the selected files
  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    // Check if the file type is JPEG, JPG, or PNG
    if (file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png') {
      const reader = new FileReader();

      // Closure to capture the file information.
      reader.onload = (function (file) {
        return function (e) {
          // Create a wrapper div for each image
          const wrapper = document.createElement('div');
          wrapper.classList.add('image-wrapper'); // Add a class for styling
          wrapper.style.display = 'flex';
          wrapper.style.alignItems = 'center';
          wrapper.style.marginBottom = '20px';

          // Create an image element and set its attributes
          const image = document.createElement('img');
          image.src = e.target.result;
          image.alt = file.name;
          image.title = file.name;

          // Set thumbnail size
          image.style.width = '100px'; // Adjust as needed
          image.style.height = '100px'; // Adjust as needed
          image.style.marginRight = '20px';

          // Create a text input element for the image
          const textField = document.createElement('input');
          textField.type = 'text';
          textField.placeholder = 'Enter description...';
          textField.style.marginLeft = '10px'; // Space between the image and the text field

          // Append the image and text field to the wrapper
          wrapper.appendChild(image);
          wrapper.appendChild(textField);

          // Append the wrapper to the container
          imageContainer.appendChild(wrapper);

          // Show the uploaded images label
          uploadedImagesLabel.style.display = 'block';

          // Scroll down slightly after displaying images
          window.scrollBy(0, 150); // Adjust the scroll amount as needed

          // Save image data to local storage (optional)
          localStorage.setItem(file.name, e.target.result);
        };
      })(file);

      // Read in the image file as a data URL.
      reader.readAsDataURL(file);
    } else {
      // Optionally, alert the user that the file format is not supported
      alert("Unsupported file format. Please upload JPEG, JPG, or PNG images.");
    }
  }

  // Hide the uploaded images label if no files are selected
  uploadedImagesLabel.style.display = files.length > 0 ? 'block' : 'none';
}

// Function to handle populating images from local storage
function populateImagesFromLocalStorageOLD() {
  const imageContainer = document.getElementById('image-container');
  const uploadedImagesLabel = document.getElementById('uploaded-images-label');

  // Clear the previous images
  imageContainer.innerHTML = '';

  // Iterate through the items in local storage
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    // Check if the key ends with .jpeg, .jpg, or .png
    if (/\.(jpeg|jpg|png)$/.test(key.toLowerCase())) {
      const imageUrl = localStorage.getItem(key);

      // Create an image element and set its attributes
      const image = document.createElement('img');
      image.src = imageUrl;
      image.alt = key;
      image.title = key;

      // Set thumbnail size
      image.style.width = '100px'; // Adjust as needed
      image.style.height = '100px'; // Adjust as needed

      // Add margin to create gap between thumbnails
      image.style.marginRight = '20px';
      image.style.marginBottom = '20px';

      // Append the image to the container
      imageContainer.appendChild(image);

    }
  }

  // Show the uploaded images label if there are images in local storage
  uploadedImagesLabel.style.display = localStorage.length > 0 ? 'block' : 'none';
}


function saveImageDataAndDescriptionOLD(key, imageData, description) {
  const imageInfo = {
    imageData: imageData,
    description: description
  };
  localStorage.setItem(key, JSON.stringify(imageInfo));
}


function exportToJsonWavex() {
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
  var engineer2Value = document.querySelector('select[name="engineer2"]').value;
  var recordEquipment1Value = document.querySelector('select[name="recordEquipment1"]').value;
  var equipmentManufact1Value = document.querySelector('input[name="equipmentManufact1"]').value;
  var equipmentModel1Value = document.querySelector('input[name="equipmentModel1"]').value;
  var equipmentPartNo1Value = document.querySelector('input[name="equipmentPartNo1"]').value;
  var equipmentSerialNo1Value = document.querySelector('input[name="equipmentSerialNo1"]').value;
  var equipmentLocation1Value = document.querySelector('input[name="equipmentLocation1"]').value;
  var recordEquipment2Value = document.querySelector('select[name="recordEquipment2"]').value;
  var equipmentManufact2Value = document.querySelector('input[name="equipmentManufact2"]').value;
  var equipmentModel2Value = document.querySelector('input[name="equipmentModel2"]').value;
  var equipmentPartNo2Value = document.querySelector('input[name="equipmentPartNo2"]').value;
  var equipmentSerialNo2Value = document.querySelector('input[name="equipmentSerialNo2"]').value;
  var equipmentLocation2Value = document.querySelector('input[name="equipmentLocation2"]').value;
  var recordEquipment3Value = document.querySelector('select[name="recordEquipment3"]').value;
  var equipmentManufact3Value = document.querySelector('input[name="equipmentManufact3"]').value;
  var equipmentModel3Value = document.querySelector('input[name="equipmentModel3"]').value;
  var equipmentPartNo3Value = document.querySelector('input[name="equipmentPartNo3"]').value;
  var equipmentSerialNo3Value = document.querySelector('input[name="equipmentSerialNo3"]').value;
  var equipmentLocation3Value = document.querySelector('input[name="equipmentLocation3"]').value;
  var recordEquipment4Value = document.querySelector('select[name="recordEquipment4"]').value;
  var equipmentManufact4Value = document.querySelector('input[name="equipmentManufact4"]').value;
  var equipmentModel4Value = document.querySelector('input[name="equipmentModel4"]').value;
  var equipmentPartNo4Value = document.querySelector('input[name="equipmentPartNo4"]').value;
  var equipmentSerialNo4Value = document.querySelector('input[name="equipmentSerialNo4"]').value;
  var equipmentLocation4Value = document.querySelector('input[name="equipmentLocation4"]').value;
  var recordEquipment5Value = document.querySelector('select[name="recordEquipment5"]').value;
  var equipmentManufact5Value = document.querySelector('input[name="equipmentManufact5"]').value;
  var equipmentModel5Value = document.querySelector('input[name="equipmentModel5"]').value;
  var equipmentPartNo5Value = document.querySelector('input[name="equipmentPartNo5"]').value;
  var equipmentSerialNo5Value = document.querySelector('input[name="equipmentSerialNo5"]').value;
  var equipmentLocation5Value = document.querySelector('input[name="equipmentLocation5"]').value;
  var recordEquipment6Value = document.querySelector('select[name="recordEquipment6"]').value;
  var equipmentManufact6Value = document.querySelector('input[name="equipmentManufact6"]').value;
  var equipmentModel6Value = document.querySelector('input[name="equipmentModel6"]').value;
  var equipmentPartNo6Value = document.querySelector('input[name="equipmentPartNo6"]').value;
  var equipmentSerialNo6Value = document.querySelector('input[name="equipmentSerialNo6"]').value;
  var equipmentLocation6Value = document.querySelector('input[name="equipmentLocation6"]').value;
  var recordEquipment7Value = document.querySelector('select[name="recordEquipment7"]').value;
  var equipmentManufact7Value = document.querySelector('input[name="equipmentManufact7"]').value;
  var equipmentModel7Value = document.querySelector('input[name="equipmentModel7"]').value;
  var equipmentPartNo7Value = document.querySelector('input[name="equipmentPartNo7"]').value;
  var equipmentSerialNo7Value = document.querySelector('input[name="equipmentSerialNo7"]').value;
  var equipmentLocation7Value = document.querySelector('input[name="equipmentLocation7"]').value;
  var recordEquipment8Value = document.querySelector('select[name="recordEquipment8"]').value;
  var equipmentManufact8Value = document.querySelector('input[name="equipmentManufact8"]').value;
  var equipmentModel8Value = document.querySelector('input[name="equipmentModel8"]').value;
  var equipmentPartNo8Value = document.querySelector('input[name="equipmentPartNo8"]').value;
  var equipmentSerialNo8Value = document.querySelector('input[name="equipmentSerialNo8"]').value;
  var equipmentLocation8Value = document.querySelector('input[name="equipmentLocation8"]').value;
  var checkEquipment1Value = document.querySelector('select[name="checkEquipment1"]').value;
  var checkVisual1Value = document.querySelector('select[name="checkVisual1"]').value;
  var checkMech1Value = document.querySelector('select[name="checkMech1"]').value;
  var checkCabling1Value = document.querySelector('select[name="checkCabling1"]').value;
  var checkPower1Value = document.querySelector('select[name="checkPower1"]').value;
  var checkEarthing1Value = document.querySelector('select[name="checkEarthing1"]').value;
  var checkEquipment2Value = document.querySelector('select[name="checkEquipment2"]').value;
  var checkVisual2Value = document.querySelector('select[name="checkVisual2"]').value;
  var checkMech2Value = document.querySelector('select[name="checkMech2"]').value;
  var checkCabling2Value = document.querySelector('select[name="checkCabling2"]').value;
  var checkPower2Value = document.querySelector('select[name="checkPower2"]').value;
  var checkEarthing2Value = document.querySelector('select[name="checkEarthing2"]').value;
  var checkEquipment3Value = document.querySelector('select[name="checkEquipment3"]').value;
  var checkVisual3Value = document.querySelector('select[name="checkVisual3"]').value;
  var checkMech3Value = document.querySelector('select[name="checkMech3"]').value;
  var checkCabling3Value = document.querySelector('select[name="checkCabling3"]').value;
  var checkPower3Value = document.querySelector('select[name="checkPower3"]').value;
  var checkEarthing3Value = document.querySelector('select[name="checkEarthing3"]').value;
  var checkEquipment3Value = document.querySelector('select[name="checkEquipment3"]').value;
  var checkVisual3Value = document.querySelector('select[name="checkVisual3"]').value;
  var checkMech3Value = document.querySelector('select[name="checkMech3"]').value;
  var checkCabling3Value = document.querySelector('select[name="checkCabling3"]').value;
  var checkPower3Value = document.querySelector('select[name="checkPower3"]').value;
  var checkEarthing3Value = document.querySelector('select[name="checkEarthing3"]').value;
  var checkEquipment4Value = document.querySelector('select[name="checkEquipment4"]').value;
  var checkVisual4Value = document.querySelector('select[name="checkVisual4"]').value;
  var checkMech4Value = document.querySelector('select[name="checkMech4"]').value;
  var checkCabling4Value = document.querySelector('select[name="checkCabling4"]').value;
  var checkPower4Value = document.querySelector('select[name="checkPower4"]').value;
  var checkEarthing4Value = document.querySelector('select[name="checkEarthing4"]').value;
  var checkEquipment5Value = document.querySelector('select[name="checkEquipment5"]').value;
  var checkVisual5Value = document.querySelector('select[name="checkVisual5"]').value;
  var checkMech5Value = document.querySelector('select[name="checkMech5"]').value;
  var checkCabling5Value = document.querySelector('select[name="checkCabling5"]').value;
  var checkPower5Value = document.querySelector('select[name="checkPower5"]').value;
  var checkEarthing5Value = document.querySelector('select[name="checkEarthing5"]').value;
  var checkEquipment6Value = document.querySelector('select[name="checkEquipment6"]').value;
  var checkVisual6Value = document.querySelector('select[name="checkVisual6"]').value;
  var checkMech6Value = document.querySelector('select[name="checkMech6"]').value;
  var checkCabling6Value = document.querySelector('select[name="checkCabling6"]').value;
  var checkPower6Value = document.querySelector('select[name="checkPower6"]').value;
  var checkEarthing6Value = document.querySelector('select[name="checkEarthing6"]').value;
  var checkEquipment7Value = document.querySelector('select[name="checkEquipment7"]').value;
  var checkVisual7Value = document.querySelector('select[name="checkVisual7"]').value;
  var checkMech7Value = document.querySelector('select[name="checkMech7"]').value;
  var checkCabling7Value = document.querySelector('select[name="checkCabling7"]').value;
  var checkPower7Value = document.querySelector('select[name="checkPower7"]').value;
  var checkEarthing7Value = document.querySelector('select[name="checkEarthing7"]').value;
  var checkEquipment8Value = document.querySelector('select[name="checkEquipment8"]').value;
  var checkVisual8Value = document.querySelector('select[name="checkVisual8"]').value;
  var checkMech8Value = document.querySelector('select[name="checkMech8"]').value;
  var checkCabling8Value = document.querySelector('select[name="checkCabling8"]').value;
  var checkPower8Value = document.querySelector('select[name="checkPower8"]').value;
  var checkEarthing8Value = document.querySelector('select[name="checkEarthing8"]').value;
  var radarManufacturerValue = document.querySelector('select[name="radarManufacturer"]').value;
  var radarModelValue = document.querySelector('input[name="radarModel"]').value;
  var radarUseValue = document.querySelector('select[name="radarUse"]').value;
  var radarTxtimeValue = document.querySelector('input[name="radarTxtime"]').value;
  var radarLocationValue = document.querySelector('textarea[name="radarLocation"]').value;
  var radarSettingsValue = document.querySelector('textarea[name="radarSettings"]').value;
  var gpsCheckValue = document.querySelector('select[name="gpsCheck"]').value;
  var gyroCheckValue = document.querySelector('select[name="gyroCheck"]').value;
  var windCheckValue = document.querySelector('select[name="windCheck"]').value;
  var draughtCheckValue = document.querySelector('select[name="draughtCheck"]').value;
  var waveCheckValue = document.querySelector('select[name="waveCheck"]').value;
  var speedlogCheckValue = document.querySelector('select[name="speedlogCheck"]').value;
  var videoCableTypeValue = document.querySelector('select[name="videoCableType"]').value;
  var videoCableImpedanceValue = document.querySelector('select[name="videoCableImpedance"]').value;
  var videoCableCommentsValue = document.querySelector('input[name="videoCableComments"]').value;
  var syncCableTypeValue = document.querySelector('select[name="syncCableType"]').value;
  var syncCableImpedanceValue = document.querySelector('select[name="syncCableImpedance"]').value;
  var syncCableCommentsValue = document.querySelector('input[name="syncCableComments"]').value;
  var azimuthCableTypeValue = document.querySelector('select[name="azimuthCableType"]').value;
  var azimuthCableImpedanceValue = document.querySelector('select[name="azimuthCableImpedance"]').value;
  var azimuthCableCommentsValue = document.querySelector('input[name="azimuthCableComments"]').value;
  var headingCableTypeValue = document.querySelector('select[name="headingCableType"]').value;
  var headingCableImpedanceValue = document.querySelector('select[name="headingCableImpedance"]').value;
  var headingCableCommentsValue = document.querySelector('input[name="headingCableComments"]').value;
  var videoJumperValue = document.querySelector('select[name="videoJumper"]').value;
  var syncJumperValue = document.querySelector('select[name="syncJumper"]').value;
  var azimuthJumperValue = document.querySelector('select[name="azimuthJumper"]').value;
  var headingJumperValue = document.querySelector('select[name="headingJumper"]').value;
  var pullupJumperValue = document.querySelector('select[name="pullupJumper"]').value;
  var pulldownJumperValue = document.querySelector('select[name="pulldownJumper"]').value;
  var amplifierTypeValue = document.querySelector('select[name="amplifierType"]').value;
  var amplifierCheckValue = document.querySelector('select[name="amplifierCheck"]').value;
  var amplifierCommentsValue = document.querySelector('input[name="amplifierComments"]').value;
  var radarFirewallTypeValue = document.querySelector('select[name="radarFirewallType"]').value;
  var radarFirewallCheckValue = document.querySelector('select[name="radarFirewallCheck"]').value;
  var radarFirewallCommentsValue = document.querySelector('input[name="radarFirewallComments"]').value;
  var serialInterfaceTypeValue = document.querySelector('select[name="serialInterfaceType"]').value;
  var serialInterfaceCheckValue = document.querySelector('select[name="serialInterfaceCheck"]').value;
  var serialInterfaceCommentsValue = document.querySelector('input[name="serialInterfaceComments"]').value;
  var networkEquipment1Value = document.querySelector('select[name="networkEquipment1"]').value;
  var equipmentIpAddress1Value = document.querySelector('input[name="equipmentIpAddress1"]').value;
  var equipmentSubnetMask1Value = document.querySelector('input[name="equipmentSubnetMask1"]').value;
  var equipmentDefaultGateway1Value = document.querySelector('input[name="equipmentDefaultGateway1"]').value;
  var equipmentMac1Value = document.querySelector('input[name="equipmentMac1"]').value;
  var networkEquipment2Value = document.querySelector('select[name="networkEquipment2"]').value;
  var equipmentIpAddress2Value = document.querySelector('input[name="equipmentIpAddress2"]').value;
  var equipmentSubnetMask2Value = document.querySelector('input[name="equipmentSubnetMask2"]').value;
  var equipmentDefaultGateway2Value = document.querySelector('input[name="equipmentDefaultGateway2"]').value;
  var equipmentMac2Value = document.querySelector('input[name="equipmentMac2"]').value;
  var networkEquipment3Value = document.querySelector('select[name="networkEquipment3"]').value;
  var equipmentIpAddress3Value = document.querySelector('input[name="equipmentIpAddress3"]').value;
  var equipmentSubnetMask3Value = document.querySelector('input[name="equipmentSubnetMask3"]').value;
  var equipmentDefaultGateway3Value = document.querySelector('input[name="equipmentDefaultGateway3"]').value;
  var equipmentMac3Value = document.querySelector('input[name="equipmentMac3"]').value;
  var networkEquipment4Value = document.querySelector('select[name="networkEquipment4"]').value;
  var equipmentIpAddress4Value = document.querySelector('input[name="equipmentIpAddress4"]').value;
  var equipmentSubnetMask4Value = document.querySelector('input[name="equipmentSubnetMask4"]').value;
  var equipmentDefaultGateway4Value = document.querySelector('input[name="equipmentDefaultGateway4"]').value;
  var equipmentMac4Value = document.querySelector('input[name="equipmentMac4"]').value;
  var networkEquipment5Value = document.querySelector('select[name="networkEquipment5"]').value;
  var equipmentIpAddress5Value = document.querySelector('input[name="equipmentIpAddress5"]').value;
  var equipmentSubnetMask5Value = document.querySelector('input[name="equipmentSubnetMask5"]').value;
  var equipmentDefaultGateway5Value = document.querySelector('input[name="equipmentDefaultGateway5"]').value;
  var equipmentMac5Value = document.querySelector('input[name="equipmentMac5"]').value;
  var networkEquipment6Value = document.querySelector('select[name="networkEquipment6"]').value;
  var equipmentIpAddress6Value = document.querySelector('input[name="equipmentIpAddress6"]').value;
  var equipmentSubnetMask6Value = document.querySelector('input[name="equipmentSubnetMask6"]').value;
  var equipmentDefaultGateway6Value = document.querySelector('input[name="equipmentDefaultGateway6"]').value;
  var equipmentMac6Value = document.querySelector('input[name="equipmentMac6"]').value;
  var networkEquipment7Value = document.querySelector('select[name="networkEquipment7"]').value;
  var equipmentIpAddress7Value = document.querySelector('input[name="equipmentIpAddress7"]').value;
  var equipmentSubnetMask7Value = document.querySelector('input[name="equipmentSubnetMask7"]').value;
  var equipmentDefaultGateway7Value = document.querySelector('input[name="equipmentDefaultGateway7"]').value;
  var equipmentMac7Value = document.querySelector('input[name="equipmentMac7"]').value;
  var networkEquipment8Value = document.querySelector('select[name="networkEquipment8"]').value;
  var equipmentIpAddress8Value = document.querySelector('input[name="equipmentIpAddress8"]').value;
  var equipmentSubnetMask8Value = document.querySelector('input[name="equipmentSubnetMask8"]').value;
  var equipmentDefaultGateway8Value = document.querySelector('input[name="equipmentDefaultGateway8"]').value;
  var equipmentMac8Value = document.querySelector('input[name="equipmentMac8"]').value;
  var networkDnsValue = document.querySelector('input[name="networkDns"]').value;
  var networkCommentsValue = document.querySelector('textarea[name="networkComments"]').value;
  var cloudHost1Value = document.querySelector('select[name="cloudHost1"]').value;
  var cloudHost2Value = document.querySelector('select[name="cloudHost2"]').value;
  var computerStartupValue = document.querySelector('select[name="computerStartup"]').value;
  var systemRequirementsValue = document.querySelector('select[name="systemRequirements"]').value;
  var windowsVersionValue = document.querySelector('input[name="windowsVersion"]').value;
  var wavexStartupValue = document.querySelector('select[name="wavexStartup"]').value;
  var wavexOptionsValue = document.querySelector('select[name="wavexOptions"]').value;
  var thirdPartyStartupValue = document.querySelector('select[name="thirdPartyStartup"]').value;
  var storageSpaceValue = document.querySelector('input[name="storageSpace"]').value;
  var remoteAccessToolsValue = document.querySelector('select[name="remoteAccessTools"]').value;
  var serialMouseFixValue = document.querySelector('select[name="serialMouseFix"]').value;
  var networkInterfaceConfigValue = document.querySelector('select[name="networkInterfaceConfig"]').value;
  var windowsFirewallValue = document.querySelector('select[name="windowsFirewall"]').value;
  var antiVirusValue = document.querySelector('select[name="antiVirus"]').value;
  var gpsCheck2Value = document.querySelector('select[name="gpsCheck2"]').value;
  var gyroCheck2Value = document.querySelector('select[name="gyroCheck2"]').value;
  var windCheck2Value = document.querySelector('select[name="windCheck2"]').value;
  var draughtCheck2Value = document.querySelector('select[name="draughtCheck2"]').value;
  var waveCheck2Value = document.querySelector('select[name="waveCheck2"]').value;
  var speedlogCheck2Value = document.querySelector('select[name="speedlogCheck2"]').value;
  var em129VersionValue = document.querySelector('select[name="em129Version"]').value;
  var em129SettingsValue = document.querySelector('select[name="em129Settings"]').value;
  var em129SignalStatusValue = document.querySelector('select[name="em129SignalStatus"]').value;
  var em129NetworkSettingsValue = document.querySelector('select[name="em129NetworkSettings"]').value;
  var em129InterfaceConfigValue = document.querySelector('select[name="em129InterfaceConfig"]').value;
  var em129ScopeValue = document.querySelector('select[name="em129Scope"]').value;
  var em129CommentsValue = document.querySelector('textarea[name="em129Comments"]').value;
  var wavexDescriptionValue = document.querySelector('select[name="wavexDescription"]').value;
  var wavexMovementValue = document.querySelector('select[name="wavexMovement"]').value;
  var wavexLatValue = document.querySelector('input[name="wavexLat"]').value;
  var wavexLongValue = document.querySelector('input[name="wavexLong"]').value;
  var wavexHeadingValue = document.querySelector('input[name="wavexHeading"]').value;
  var wavexRadarValue = document.querySelector('select[name="wavexRadar"]').value;
  var wavexMulticastValue = document.querySelector('input[name="wavexMulticast"]').value;
  var wavexTransceiverValue = document.querySelector('input[name="wavexTransceiver"]').value;
  var wavexRinIdValue = document.querySelector('select[name="wavexRinId"]').value;
  var wavexRinNetworkValue = document.querySelector('select[name="wavexRinNetwork"]').value;
  var wavexImageStorageValue = document.querySelector('select[name="wavexImageStorage"]').value;
  var wavexGPSValue = document.querySelector('select[name="wavexGPS"]').value;
  var wavexGPSPositionSentenceValue = document.querySelector('select[name="wavexGPSPositionSentence"]').value;
  var wavexGPSTrackSpeedSentenceValue = document.querySelector('select[name="wavexGPSTrackSpeedSentence"]').value;
  var wavexGPSTimeSentenceValue = document.querySelector('select[name="wavexGPSTimeSentence"]').value;
  var wavexGPSSettingsValue = document.querySelector('input[name="wavexGPSSettings"]').value;
  var wavexGyroValue = document.querySelector('select[name="wavexGyro"]').value;
  var wavexGyroSentenceValue = document.querySelector('select[name="wavexGyroSentence"]').value;
  var wavexGyroSettingsValue = document.querySelector('input[name="wavexGyroSettings"]').value;
  var wavexWindValue = document.querySelector('select[name="wavexWind"]').value;
  var wavexWindSentenceValue = document.querySelector('select[name="wavexWindSentence"]').value;
  var wavexWindSettingsValue = document.querySelector('input[name="wavexWindSettings"]').value;
  var wavexDraughtValue = document.querySelector('select[name="wavexDraught"]').value;
  var wavexDraughtSentenceValue = document.querySelector('select[name="wavexDraughtSentence"]').value;
  var wavexDraughtSettingsValue = document.querySelector('input[name="wavexDraughtSettings"]').value;
  var wavexWaveValue = document.querySelector('select[name="wavexWave"]').value;
  var wavexWaveSentenceValue = document.querySelector('select[name="wavexWaveSentence"]').value;
  var wavexWaveSettingsValue = document.querySelector('input[name="wavexWaveSettings"]').value;

  var wavexSpeedlogValue = document.querySelector('select[name="wavexSpeedlog"]').value;
  var wavexSpeedlogSentenceValue = document.querySelector('select[name="wavexSpeedlogSentence"]').value;
  var wavexSpeedlogSettingsValue = document.querySelector('input[name="wavexSpeedlogSettings"]').value;




  var wavexGeometryRadarXValue = document.querySelector('input[name="wavexGeometryRadarX"]').value;
  var wavexGeometryRadarYValue = document.querySelector('input[name="wavexGeometryRadarY"]').value;
  var wavexGeometryRadarZValue = document.querySelector('input[name="wavexGeometryRadarZ"]').value;
  var wavexGeometryGPSXValue = document.querySelector('input[name="wavexGeometryGPSX"]').value;
  var wavexGeometryGPSYValue = document.querySelector('input[name="wavexGeometryGPSY"]').value;
  var wavexGeometryWindHeadingOffsetValue = document.querySelector('input[name="wavexGeometryWindHeadingOffset"]').value;
  var wavexGeometryWindZValue = document.querySelector('input[name="wavexGeometryWindZ"]').value;
  var wavexRadarRangeOffsetValue = document.querySelector('input[name="wavexRadarRangeOffset"]').value;
  var wavexRadarAzimuthOffsetValue = document.querySelector('input[name="wavexRadarAzimuthOffset"]').value;
  var wavexRadarStartAngleValue = document.querySelector('input[name="wavexRadarStartAngle"]').value;
  var wavexRadarSectorSizeValue = document.querySelector('input[name="wavexRadarSectorSize"]').value;
  var wavexRadarStartRangeValue = document.querySelector('input[name="wavexRadarStartRange"]').value;
  var wavexRadarStopRangeValue = document.querySelector('input[name="wavexRadarStopRange"]').value;
  var wavexRadarImageCheckValue = document.querySelector('select[name="wavexRadarImageCheck"]').value;
  var wavexAdvancedWaveAntennaMeanHeightValue = document.querySelector('select[name="wavexAdvancedWaveAntennaMeanHeight"]').value;
  var wavexAdvancedWaveCartesianSectionsValue = document.querySelector('select[name="wavexAdvancedWaveCartesianSections"]').value;
  var wavexAdvancedCurrentAntennaMeanHeightValue = document.querySelector('select[name="wavexAdvancedCurrentAntennaMeanHeight"]').value;
  var wavexAdvancedCurrentCartesianSectionsValue = document.querySelector('select[name="wavexAdvancedCurrentCartesianSections"]').value;
  var wavexOutput1Value = document.querySelector('select[name="wavexOutput1"]').value;
  var wavexOutput1SentenceValue = document.querySelector('select[name="wavexOutput1Sentence"]').value;
  var wavexOutput1UpdateIntervalValue = document.querySelector('input[name="wavexOutput1UpdateInterval"]').value;
  var wavexOutput1SettingsValue = document.querySelector('input[name="wavexOutput1Settings"]').value;
  var wavexOutput2Value = document.querySelector('select[name="wavexOutput2"]').value;
  var wavexOutput2SentenceValue = document.querySelector('select[name="wavexOutput2Sentence"]').value;
  var wavexOutput2UpdateIntervalValue = document.querySelector('input[name="wavexOutput2UpdateInterval"]').value;
  var wavexOutput2SettingsValue = document.querySelector('input[name="wavexOutput2Settings"]').value;
  var wavexOutput3Value = document.querySelector('select[name="wavexOutput3"]').value;
  var wavexOutput3SentenceValue = document.querySelector('select[name="wavexOutput3Sentence"]').value;
  var wavexOutput3UpdateIntervalValue = document.querySelector('input[name="wavexOutput3UpdateInterval"]').value;
  var wavexOutput3SettingsValue = document.querySelector('input[name="wavexOutput3Settings"]').value;
  var cloudEnabledValue = document.querySelector('select[name="cloudEnabled"]').value;
  var finalConfigValue = document.querySelector('select[name="finalConfig"]').value;
  var finalPowerCycleValue = document.querySelector('select[name="finalPowerCycle"]').value;
  var finalStartupValue = document.querySelector('select[name="finalStartup"]').value;
  var final20MinuteValue = document.querySelector('select[name="final20Minute"]').value;
  var finalDataOutputValue = document.querySelector('select[name="finalDataOutput"]').value;
  var backupWavexJsonValue = document.querySelector('select[name="backupWavexJson"]').value;
  var backupDF047Value = document.querySelector('select[name="backupDF047"]').value;
  var backupEM129Value = document.querySelector('select[name="backupEM129"]').value;
  var backupMiscValue = document.querySelector('select[name="backupMisc"]').value;
  var loginType1Value = document.querySelector('select[name="loginType1"]').value;
  var loginUsername1Value = document.querySelector('input[name="loginUsername1"]').value;
  var loginPassword1Value = document.querySelector('input[name="loginPassword1"]').value;
  var loginComments1Value = document.querySelector('input[name="loginComments1"]').value;
  var loginType2Value = document.querySelector('select[name="loginType2"]').value;
  var loginUsername2Value = document.querySelector('input[name="loginUsername2"]').value;
  var loginPassword2Value = document.querySelector('input[name="loginPassword2"]').value;
  var loginComments2Value = document.querySelector('input[name="loginComments2"]').value;
  var loginType3Value = document.querySelector('select[name="loginType3"]').value;
  var loginUsername3Value = document.querySelector('input[name="loginUsername3"]').value;
  var loginPassword3Value = document.querySelector('input[name="loginPassword3"]').value;
  var loginComments3Value = document.querySelector('input[name="loginComments3"]').value;
  var workStatusValue = document.querySelector('select[name="workStatus"]').value;
  var subscriptionStatusValue = document.querySelector('select[name="subscriptionStatus"]').value;
  var subscriptionExpiryValue = document.querySelector('input[name="subscriptionExpiry"]').value;
  var generalCommentsValue = document.querySelector('textarea[name="generalComments"]').value;


  // Check if workTypeValue is "-"
  if (workStatusValue === "-") {
    alert('Please select a valid work status before downloading.');
    return;
  }
  // Create the JSON object
  var data = {
    site: siteValue,
    system: systemValue,
    workType: workTypeValue,
    workStatus: workStatusValue,
    subscriptionStatus: subscriptionStatusValue,
    subscriptionExpiry: subscriptionExpiryValue,
    generalComments: generalCommentsValue,
    siteType: siteTypeValue,
    customer: customerValue,
    date: dateValue,
    imo: imoValue,
    location: locationValue,
    engineer: engineerValue,
    engineer2: engineer2Value,


    recordEquipment: {
      recordEquipment1: recordEquipment1Value,
      equipmentManufact1: equipmentManufact1Value,
      equipmentModel1: equipmentModel1Value,
      equipmentPartNo1: equipmentPartNo1Value,
      equipmentSerialNo1: equipmentSerialNo1Value,
      equipmentLocation1: equipmentLocation1Value,
      recordEquipment2: recordEquipment2Value,
      equipmentManufact2: equipmentManufact2Value,
      equipmentModel2: equipmentModel2Value,
      equipmentPartNo2: equipmentPartNo2Value,
      equipmentSerialNo2: equipmentSerialNo2Value,
      equipmentLocation2: equipmentLocation2Value,
      recordEquipment3: recordEquipment3Value,
      equipmentManufact3: equipmentManufact3Value,
      equipmentModel3: equipmentModel3Value,
      equipmentPartNo3: equipmentPartNo3Value,
      equipmentSerialNo3: equipmentSerialNo3Value,
      equipmentLocation3: equipmentLocation3Value,
      recordEquipment4: recordEquipment4Value,
      equipmentManufact4: equipmentManufact4Value,
      equipmentModel4: equipmentModel4Value,
      equipmentPartNo4: equipmentPartNo4Value,
      equipmentSerialNo4: equipmentSerialNo4Value,
      equipmentLocation4: equipmentLocation4Value,
      recordEquipment5: recordEquipment5Value,
      equipmentManufact5: equipmentManufact5Value,
      equipmentModel5: equipmentModel5Value,
      equipmentPartNo5: equipmentPartNo5Value,
      equipmentSerialNo5: equipmentSerialNo5Value,
      equipmentLocation5: equipmentLocation5Value,
      recordEquipment6: recordEquipment6Value,
      equipmentManufact6: equipmentManufact6Value,
      equipmentModel6: equipmentModel6Value,
      equipmentPartNo6: equipmentPartNo6Value,
      equipmentSerialNo6: equipmentSerialNo6Value,
      equipmentLocation6: equipmentLocation6Value,
      recordEquipment7: recordEquipment7Value,
      equipmentManufact7: equipmentManufact7Value,
      equipmentModel7: equipmentModel7Value,
      equipmentPartNo7: equipmentPartNo7Value,
      equipmentSerialNo7: equipmentSerialNo7Value,
      equipmentLocation7: equipmentLocation7Value,
      recordEquipment8: recordEquipment8Value,
      equipmentManufact8: equipmentManufact8Value,
      equipmentModel8: equipmentModel8Value,
      equipmentPartNo8: equipmentPartNo8Value,
      equipmentSerialNo8: equipmentSerialNo8Value,
      equipmentLocation8: equipmentLocation8Value,
    },
    checkEquipment: {
      checkEquipment1: checkEquipment1Value,
      checkVisual1: checkVisual1Value,
      checkMech1: checkMech1Value,
      checkCabling1: checkCabling1Value,
      checkPower1: checkPower1Value,
      checkEarthing1: checkEarthing1Value,
      checkEquipment2: checkEquipment2Value,
      checkVisual2: checkVisual2Value,
      checkMech2: checkMech2Value,
      checkCabling2: checkCabling2Value,
      checkPower2: checkPower2Value,
      checkEarthing2: checkEarthing2Value,
      checkEquipment3: checkEquipment3Value,
      checkVisual3: checkVisual3Value,
      checkMech3: checkMech3Value,
      checkCabling3: checkCabling3Value,
      checkPower3: checkPower3Value,
      checkEarthing3: checkEarthing3Value,
      checkEquipment4: checkEquipment4Value,
      checkVisual4: checkVisual4Value,
      checkMech4: checkMech4Value,
      checkCabling4: checkCabling4Value,
      checkPower4: checkPower4Value,
      checkEarthing4: checkEarthing4Value,

      checkEquipment5: checkEquipment5Value,
      checkVisual5: checkVisual5Value,
      checkMech5: checkMech5Value,
      checkCabling5: checkCabling5Value,
      checkPower5: checkPower5Value,
      checkEarthing5: checkEarthing5Value,

      checkEquipment6: checkEquipment6Value,
      checkVisual6: checkVisual6Value,
      checkMech6: checkMech6Value,
      checkCabling6: checkCabling6Value,
      checkPower6: checkPower6Value,
      checkEarthing6: checkEarthing6Value,

      checkEquipment7: checkEquipment7Value,
      checkVisual7: checkVisual7Value,
      checkMech7: checkMech7Value,
      checkCabling7: checkCabling7Value,
      checkPower7: checkPower7Value,
      checkEarthing7: checkEarthing7Value,

      checkEquipment8: checkEquipment8Value,
      checkVisual8: checkVisual8Value,
      checkMech8: checkMech8Value,
      checkCabling8: checkCabling8Value,
      checkPower8: checkPower8Value,
      checkEarthing8: checkEarthing8Value,
      radarManufacturer: radarManufacturerValue,
      radarModel: radarModelValue,
      radarUse: radarUseValue,
      radarTxtime: radarTxtimeValue,
      radarLocation: radarLocationValue,
      radarSettings: radarSettingsValue,
      gpsCheck: gpsCheckValue,
      gyroCheck: gyroCheckValue,
      windCheck: windCheckValue,
      draughtCheck: draughtCheckValue,
      waveCheck: waveCheckValue,
      speedlogCheck: speedlogCheckValue,



      videoCableType: videoCableTypeValue,
      videoCableImpedance: videoCableImpedanceValue,
      videoCableComments: videoCableCommentsValue,
      syncCableType: syncCableTypeValue,
      syncCableImpedance: syncCableImpedanceValue,
      syncCableComments: syncCableCommentsValue,
      azimuthCableType: azimuthCableTypeValue,
      azimuthCableImpedance: azimuthCableImpedanceValue,
      azimuthCableComments: azimuthCableCommentsValue,
      headingCableType: headingCableTypeValue,
      headingCableImpedance: headingCableImpedanceValue,
      headingCableComments: headingCableCommentsValue,
      videoJumper: videoJumperValue,
      syncJumper: syncJumperValue,
      azimuthJumper: azimuthJumperValue,
      headingJumper: headingJumperValue,
      pullupJumper: pullupJumperValue,
      pulldownJumper: pulldownJumperValue,
      amplifierType: amplifierTypeValue,
      amplifierCheck: amplifierCheckValue,
      amplifierComments: amplifierCommentsValue,
      radarFirewallType: radarFirewallTypeValue,
      radarFirewallCheck: radarFirewallCheckValue,
      radarFirewallComments: radarFirewallCommentsValue,
      serialInterfaceType: serialInterfaceTypeValue,
      serialInterfaceCheck: serialInterfaceCheckValue,
      serialInterfaceComments: serialInterfaceCommentsValue,
    },
    network: {
      networkEquipment1: networkEquipment1Value,
      equipmentIpAddress1: equipmentIpAddress1Value,
      equipmentSubnetMask1: equipmentSubnetMask1Value,
      equipmentDefaultGateway1: equipmentDefaultGateway1Value,
      equipmentMac1: equipmentMac1Value,
      networkEquipment2: networkEquipment2Value,
      equipmentIpAddress2: equipmentIpAddress2Value,
      equipmentSubnetMask2: equipmentSubnetMask2Value,
      equipmentDefaultGateway2: equipmentDefaultGateway2Value,
      equipmentMac2: equipmentMac2Value,
      networkEquipment3: networkEquipment3Value,
      equipmentIpAddress3: equipmentIpAddress3Value,
      equipmentSubnetMask3: equipmentSubnetMask3Value,
      equipmentDefaultGateway3: equipmentDefaultGateway3Value,
      equipmentMac3: equipmentMac3Value,
      networkEquipment4: networkEquipment4Value,
      equipmentIpAddress4: equipmentIpAddress4Value,
      equipmentSubnetMask4: equipmentSubnetMask4Value,
      equipmentDefaultGateway4: equipmentDefaultGateway4Value,
      equipmentMac4: equipmentMac4Value,
      networkEquipment5: networkEquipment5Value,
      equipmentIpAddress5: equipmentIpAddress5Value,
      equipmentSubnetMask5: equipmentSubnetMask5Value,
      equipmentDefaultGateway5: equipmentDefaultGateway5Value,
      equipmentMac5: equipmentMac5Value,
      networkEquipment6: networkEquipment6Value,
      equipmentIpAddress6: equipmentIpAddress6Value,
      equipmentSubnetMask6: equipmentSubnetMask6Value,
      equipmentDefaultGateway6: equipmentDefaultGateway6Value,
      equipmentMac6: equipmentMac6Value,
      networkEquipment7: networkEquipment7Value,
      equipmentIpAddress7: equipmentIpAddress7Value,
      equipmentSubnetMask7: equipmentSubnetMask7Value,
      equipmentDefaultGateway7: equipmentDefaultGateway7Value,
      equipmentMac7: equipmentMac7Value,
      networkEquipment8: networkEquipment8Value,
      equipmentIpAddress8: equipmentIpAddress8Value,
      equipmentSubnetMask8: equipmentSubnetMask8Value,
      equipmentDefaultGateway8: equipmentDefaultGateway8Value,
      equipmentMac8: equipmentMac8Value,
      networkDns: networkDnsValue,
      networkComments: networkCommentsValue,
      cloudHost1: cloudHost1Value,
      cloudHost2: cloudHost2Value,
    },
    startup: {
      computerStartup: computerStartupValue,
      systemRequirements: systemRequirementsValue,
      windowsVersion: windowsVersionValue,
      wavexStartup: wavexStartupValue,
      wavexOptions: wavexOptionsValue,
      thirdPartyStartup: thirdPartyStartupValue,
      storageSpace: storageSpaceValue,
      remoteAccessTools: remoteAccessToolsValue,
      serialMouseFix: serialMouseFixValue,
      networkInterfaceConfig: networkInterfaceConfigValue,
      windowsFirewall: windowsFirewallValue,
      antiVirus: antiVirusValue,
      gpsCheck2: gpsCheck2Value,
      gyroCheck2: gyroCheck2Value,
      windCheck2: windCheck2Value,
      draughtCheck2: draughtCheck2Value,
      waveCheck2: waveCheck2Value,
    },
    configuration: {
      em129Version: em129VersionValue,
      em129Settings: em129SettingsValue,
      em129SignalStatus: em129SignalStatusValue,
      em129NetworkSettings: em129NetworkSettingsValue,
      em129InterfaceConfig: em129InterfaceConfigValue,
      em129Scope: em129ScopeValue,
      em129Comments: em129CommentsValue,
      wavexDescription: wavexDescriptionValue,
      wavexMovement: wavexMovementValue,
      wavexLat: wavexLatValue,
      wavexLong: wavexLongValue,
      wavexHeading: wavexHeadingValue,
      wavexRadar: wavexRadarValue,
      wavexMulticast: wavexMulticastValue,
      wavexTransceiver: wavexTransceiverValue,
      wavexRinId: wavexRinIdValue,
      wavexRinNetwork: wavexRinNetworkValue,
      wavexImageStorage: wavexImageStorageValue,
      wavexGPS: wavexGPSValue,
      wavexGPSPositionSentence: wavexGPSPositionSentenceValue,
      wavexGPSTrackSpeedSentence: wavexGPSTrackSpeedSentenceValue,
      wavexGPSTimeSentence: wavexGPSTimeSentenceValue,
      wavexGPSSettings: wavexGPSSettingsValue,
      wavexGyro: wavexGyroValue,
      wavexGyroSentence: wavexGyroSentenceValue,
      wavexGyroSettings: wavexGyroSettingsValue,
      wavexWind: wavexWindValue,
      wavexWindSentence: wavexWindSentenceValue,
      wavexWindSettings: wavexWindSettingsValue,
      wavexWave: wavexWaveValue,
      wavexWaveSentence: wavexWaveSentenceValue,
      wavexWaveSettings: wavexWaveSettingsValue,
      wavexDraught: wavexDraughtValue,
      wavexDraughtSentence: wavexDraughtSentenceValue,
      wavexDraughtSettings: wavexDraughtSettingsValue,
      wavexSpeedlog: wavexSpeedlogValue,
      wavexSpeedlogSentence: wavexSpeedlogSentenceValue,
      wavexSpeedlogSettings: wavexSpeedlogSettingsValue,




      wavexGeometryRadarX: wavexGeometryRadarXValue,
      wavexGeometryRadarY: wavexGeometryRadarYValue,
      wavexGeometryRadarZ: wavexGeometryRadarZValue,
      wavexGeometryGPSX: wavexGeometryGPSXValue,
      wavexGeometryGPSY: wavexGeometryGPSYValue,
      wavexGeometryWindHeadingOffset: wavexGeometryWindHeadingOffsetValue,
      wavexGeometryWindZ: wavexGeometryWindZValue,
      wavexRadarRangeOffset: wavexRadarRangeOffsetValue,
      wavexRadarAzimuthOffset: wavexRadarAzimuthOffsetValue,
      wavexRadarStartAngle: wavexRadarStartAngleValue,
      wavexRadarSectorSize: wavexRadarSectorSizeValue,
      wavexRadarStartRange: wavexRadarStartRangeValue,
      wavexRadarStopRange: wavexRadarStopRangeValue,
      wavexRadarImageCheck: wavexRadarImageCheckValue,
      wavexAdvancedWaveAntennaMeanHeight: wavexAdvancedWaveAntennaMeanHeightValue,
      wavexAdvancedWaveCartesianSections: wavexAdvancedWaveCartesianSectionsValue,
      wavexAdvancedCurrentAntennaMeanHeight: wavexAdvancedCurrentAntennaMeanHeightValue,
      wavexAdvancedCurrentCartesianSections: wavexAdvancedCurrentCartesianSectionsValue,
      wavexOutput1: wavexOutput1Value,
      wavexOutput1Sentence: wavexOutput1SentenceValue,
      wavexOutput1UpdateInterval: wavexOutput1UpdateIntervalValue,
      wavexOutput1Settings: wavexOutput1SettingsValue,
      wavexOutput2: wavexOutput2Value,
      wavexOutput2Sentence: wavexOutput2SentenceValue,
      wavexOutput2UpdateInterval: wavexOutput2UpdateIntervalValue,
      wavexOutput2Settings: wavexOutput2SettingsValue,
      wavexOutput3: wavexOutput3Value,
      wavexOutput3Sentence: wavexOutput3SentenceValue,
      wavexOutput3UpdateInterval: wavexOutput3UpdateIntervalValue,
      wavexOutput3Settings: wavexOutput3SettingsValue,
      cloudEnabled: cloudEnabledValue,
      finalConfig: finalConfigValue,
    },
    finalStartup: {
      finalPowerCycle: finalPowerCycleValue,
      finalStartup: finalStartupValue,
      final20Minute: final20MinuteValue,
      finalDataOutput: finalDataOutputValue,
    },
    backup: {
      backupWavexJson: backupWavexJsonValue,
      backupDF047: backupDF047Value,
      backupEM129: backupEM129Value,
      backupMisc: backupMiscValue,
    },
    loginDetails: {
      loginType1: loginType1Value,
      loginUsername1: loginUsername1Value,
      loginPassword1: loginPassword1Value,
      loginComments1: loginComments1Value,
      loginType2: loginType2Value,
      loginUsername2: loginUsername2Value,
      loginPassword2: loginPassword2Value,
      loginComments2: loginComments2Value,
      loginType3: loginType3Value,
      loginUsername3: loginUsername3Value,
      loginPassword3: loginPassword3Value,
      loginComments3: loginComments3Value,
    },
  }

  // Convert the data to JSON string
  var jsonData = JSON.stringify(data, null, 2);

  // Create the filename using the form element values
  var filename = systemValue + "_" + siteValue + "_" + customerValue + "_" + "_" + workTypeValue + "_" + workStatusValue + '.json';

  // Create a temporary <a> element to trigger the download
  var link = document.createElement('a');
  link.href = 'data:application/json;charset=utf-8,' + encodeURIComponent(jsonData);
  link.download = filename;

  // Trigger the download
  link.click();
} 1

function exportToJsonOSD() {
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
  var engineer2Value = document.querySelector('select[name="engineer2"]').value;
  var recordEquipment1Value = document.querySelector('select[name="recordEquipment1"]').value;
  var equipmentManufact1Value = document.querySelector('input[name="equipmentManufact1"]').value;
  var equipmentModel1Value = document.querySelector('input[name="equipmentModel1"]').value;
  var equipmentPartNo1Value = document.querySelector('input[name="equipmentPartNo1"]').value;
  var equipmentSerialNo1Value = document.querySelector('input[name="equipmentSerialNo1"]').value;
  var equipmentLocation1Value = document.querySelector('input[name="equipmentLocation1"]').value;
  var recordEquipment2Value = document.querySelector('select[name="recordEquipment2"]').value;
  var equipmentManufact2Value = document.querySelector('input[name="equipmentManufact2"]').value;
  var equipmentModel2Value = document.querySelector('input[name="equipmentModel2"]').value;
  var equipmentPartNo2Value = document.querySelector('input[name="equipmentPartNo2"]').value;
  var equipmentSerialNo2Value = document.querySelector('input[name="equipmentSerialNo2"]').value;
  var equipmentLocation2Value = document.querySelector('input[name="equipmentLocation2"]').value;
  var recordEquipment3Value = document.querySelector('select[name="recordEquipment3"]').value;
  var equipmentManufact3Value = document.querySelector('input[name="equipmentManufact3"]').value;
  var equipmentModel3Value = document.querySelector('input[name="equipmentModel3"]').value;
  var equipmentPartNo3Value = document.querySelector('input[name="equipmentPartNo3"]').value;
  var equipmentSerialNo3Value = document.querySelector('input[name="equipmentSerialNo3"]').value;
  var equipmentLocation3Value = document.querySelector('input[name="equipmentLocation3"]').value;
  var recordEquipment4Value = document.querySelector('select[name="recordEquipment4"]').value;
  var equipmentManufact4Value = document.querySelector('input[name="equipmentManufact4"]').value;
  var equipmentModel4Value = document.querySelector('input[name="equipmentModel4"]').value;
  var equipmentPartNo4Value = document.querySelector('input[name="equipmentPartNo4"]').value;
  var equipmentSerialNo4Value = document.querySelector('input[name="equipmentSerialNo4"]').value;
  var equipmentLocation4Value = document.querySelector('input[name="equipmentLocation4"]').value;
  var recordEquipment5Value = document.querySelector('select[name="recordEquipment5"]').value;
  var equipmentManufact5Value = document.querySelector('input[name="equipmentManufact5"]').value;
  var equipmentModel5Value = document.querySelector('input[name="equipmentModel5"]').value;
  var equipmentPartNo5Value = document.querySelector('input[name="equipmentPartNo5"]').value;
  var equipmentSerialNo5Value = document.querySelector('input[name="equipmentSerialNo5"]').value;
  var equipmentLocation5Value = document.querySelector('input[name="equipmentLocation5"]').value;
  var recordEquipment6Value = document.querySelector('select[name="recordEquipment6"]').value;
  var equipmentManufact6Value = document.querySelector('input[name="equipmentManufact6"]').value;
  var equipmentModel6Value = document.querySelector('input[name="equipmentModel6"]').value;
  var equipmentPartNo6Value = document.querySelector('input[name="equipmentPartNo6"]').value;
  var equipmentSerialNo6Value = document.querySelector('input[name="equipmentSerialNo6"]').value;
  var equipmentLocation6Value = document.querySelector('input[name="equipmentLocation6"]').value;
  var recordEquipment7Value = document.querySelector('select[name="recordEquipment7"]').value;
  var equipmentManufact7Value = document.querySelector('input[name="equipmentManufact7"]').value;
  var equipmentModel7Value = document.querySelector('input[name="equipmentModel7"]').value;
  var equipmentPartNo7Value = document.querySelector('input[name="equipmentPartNo7"]').value;
  var equipmentSerialNo7Value = document.querySelector('input[name="equipmentSerialNo7"]').value;
  var equipmentLocation7Value = document.querySelector('input[name="equipmentLocation7"]').value;
  var recordEquipment8Value = document.querySelector('select[name="recordEquipment8"]').value;
  var equipmentManufact8Value = document.querySelector('input[name="equipmentManufact8"]').value;
  var equipmentModel8Value = document.querySelector('input[name="equipmentModel8"]').value;
  var equipmentPartNo8Value = document.querySelector('input[name="equipmentPartNo8"]').value;
  var equipmentSerialNo8Value = document.querySelector('input[name="equipmentSerialNo8"]').value;
  var equipmentLocation8Value = document.querySelector('input[name="equipmentLocation8"]').value;
  var checkEquipment1Value = document.querySelector('select[name="checkEquipment1"]').value;
  var checkVisual1Value = document.querySelector('select[name="checkVisual1"]').value;
  var checkMech1Value = document.querySelector('select[name="checkMech1"]').value;
  var checkCabling1Value = document.querySelector('select[name="checkCabling1"]').value;
  var checkPower1Value = document.querySelector('select[name="checkPower1"]').value;
  var checkEarthing1Value = document.querySelector('select[name="checkEarthing1"]').value;
  var checkEquipment2Value = document.querySelector('select[name="checkEquipment2"]').value;
  var checkVisual2Value = document.querySelector('select[name="checkVisual2"]').value;
  var checkMech2Value = document.querySelector('select[name="checkMech2"]').value;
  var checkCabling2Value = document.querySelector('select[name="checkCabling2"]').value;
  var checkPower2Value = document.querySelector('select[name="checkPower2"]').value;
  var checkEarthing2Value = document.querySelector('select[name="checkEarthing2"]').value;
  var checkEquipment3Value = document.querySelector('select[name="checkEquipment3"]').value;
  var checkVisual3Value = document.querySelector('select[name="checkVisual3"]').value;
  var checkMech3Value = document.querySelector('select[name="checkMech3"]').value;
  var checkCabling3Value = document.querySelector('select[name="checkCabling3"]').value;
  var checkPower3Value = document.querySelector('select[name="checkPower3"]').value;
  var checkEarthing3Value = document.querySelector('select[name="checkEarthing3"]').value;
  var checkEquipment3Value = document.querySelector('select[name="checkEquipment3"]').value;
  var checkVisual3Value = document.querySelector('select[name="checkVisual3"]').value;
  var checkMech3Value = document.querySelector('select[name="checkMech3"]').value;
  var checkCabling3Value = document.querySelector('select[name="checkCabling3"]').value;
  var checkPower3Value = document.querySelector('select[name="checkPower3"]').value;
  var checkEarthing3Value = document.querySelector('select[name="checkEarthing3"]').value;
  var checkEquipment4Value = document.querySelector('select[name="checkEquipment4"]').value;
  var checkVisual4Value = document.querySelector('select[name="checkVisual4"]').value;
  var checkMech4Value = document.querySelector('select[name="checkMech4"]').value;
  var checkCabling4Value = document.querySelector('select[name="checkCabling4"]').value;
  var checkPower4Value = document.querySelector('select[name="checkPower4"]').value;
  var checkEarthing4Value = document.querySelector('select[name="checkEarthing4"]').value;
  var checkEquipment5Value = document.querySelector('select[name="checkEquipment5"]').value;
  var checkVisual5Value = document.querySelector('select[name="checkVisual5"]').value;
  var checkMech5Value = document.querySelector('select[name="checkMech5"]').value;
  var checkCabling5Value = document.querySelector('select[name="checkCabling5"]').value;
  var checkPower5Value = document.querySelector('select[name="checkPower5"]').value;
  var checkEarthing5Value = document.querySelector('select[name="checkEarthing5"]').value;
  var checkEquipment6Value = document.querySelector('select[name="checkEquipment6"]').value;
  var checkVisual6Value = document.querySelector('select[name="checkVisual6"]').value;
  var checkMech6Value = document.querySelector('select[name="checkMech6"]').value;
  var checkCabling6Value = document.querySelector('select[name="checkCabling6"]').value;
  var checkPower6Value = document.querySelector('select[name="checkPower6"]').value;
  var checkEarthing6Value = document.querySelector('select[name="checkEarthing6"]').value;
  var checkEquipment7Value = document.querySelector('select[name="checkEquipment7"]').value;
  var checkVisual7Value = document.querySelector('select[name="checkVisual7"]').value;
  var checkMech7Value = document.querySelector('select[name="checkMech7"]').value;
  var checkCabling7Value = document.querySelector('select[name="checkCabling7"]').value;
  var checkPower7Value = document.querySelector('select[name="checkPower7"]').value;
  var checkEarthing7Value = document.querySelector('select[name="checkEarthing7"]').value;
  var checkEquipment8Value = document.querySelector('select[name="checkEquipment8"]').value;
  var checkVisual8Value = document.querySelector('select[name="checkVisual8"]').value;
  var checkMech8Value = document.querySelector('select[name="checkMech8"]').value;
  var checkCabling8Value = document.querySelector('select[name="checkCabling8"]').value;
  var checkPower8Value = document.querySelector('select[name="checkPower8"]').value;
  var checkEarthing8Value = document.querySelector('select[name="checkEarthing8"]').value;
  var radarManufacturerValue = document.querySelector('select[name="radarManufacturer"]').value;
  var radarModelValue = document.querySelector('input[name="radarModel"]').value;
  var radarUseValue = document.querySelector('select[name="radarUse"]').value;
  var radarTxtimeValue = document.querySelector('input[name="radarTxtime"]').value;
  var radarLocationValue = document.querySelector('textarea[name="radarLocation"]').value;
  var radarSettingsValue = document.querySelector('textarea[name="radarSettings"]').value;
  var gpsCheckValue = document.querySelector('select[name="gpsCheck"]').value;
  var gyroCheckValue = document.querySelector('select[name="gyroCheck"]').value;
  var windCheckValue = document.querySelector('select[name="windCheck"]').value;
  var draughtCheckValue = document.querySelector('select[name="draughtCheck"]').value;
  var waveCheckValue = document.querySelector('select[name="waveCheck"]').value;
  var speedlogCheckValue = document.querySelector('select[name="speedlogCheck"]').value;
  var videoCableTypeValue = document.querySelector('select[name="videoCableType"]').value;
  var videoCableImpedanceValue = document.querySelector('select[name="videoCableImpedance"]').value;
  var videoCableCommentsValue = document.querySelector('input[name="videoCableComments"]').value;
  var syncCableTypeValue = document.querySelector('select[name="syncCableType"]').value;
  var syncCableImpedanceValue = document.querySelector('select[name="syncCableImpedance"]').value;
  var syncCableCommentsValue = document.querySelector('input[name="syncCableComments"]').value;
  var azimuthCableTypeValue = document.querySelector('select[name="azimuthCableType"]').value;
  var azimuthCableImpedanceValue = document.querySelector('select[name="azimuthCableImpedance"]').value;
  var azimuthCableCommentsValue = document.querySelector('input[name="azimuthCableComments"]').value;
  var headingCableTypeValue = document.querySelector('select[name="headingCableType"]').value;
  var headingCableImpedanceValue = document.querySelector('select[name="headingCableImpedance"]').value;
  var headingCableCommentsValue = document.querySelector('input[name="headingCableComments"]').value;
  var videoJumperValue = document.querySelector('select[name="videoJumper"]').value;
  var syncJumperValue = document.querySelector('select[name="syncJumper"]').value;
  var azimuthJumperValue = document.querySelector('select[name="azimuthJumper"]').value;
  var headingJumperValue = document.querySelector('select[name="headingJumper"]').value;
  var pullupJumperValue = document.querySelector('select[name="pullupJumper"]').value;
  var pulldownJumperValue = document.querySelector('select[name="pulldownJumper"]').value;
  var amplifierTypeValue = document.querySelector('select[name="amplifierType"]').value;
  var amplifierCheckValue = document.querySelector('select[name="amplifierCheck"]').value;
  var amplifierCommentsValue = document.querySelector('input[name="amplifierComments"]').value;
  var radarFirewallTypeValue = document.querySelector('select[name="radarFirewallType"]').value;
  var radarFirewallCheckValue = document.querySelector('select[name="radarFirewallCheck"]').value;
  var radarFirewallCommentsValue = document.querySelector('input[name="radarFirewallComments"]').value;
  var serialInterfaceTypeValue = document.querySelector('select[name="serialInterfaceType"]').value;
  var serialInterfaceCheckValue = document.querySelector('select[name="serialInterfaceCheck"]').value;
  var serialInterfaceCommentsValue = document.querySelector('input[name="serialInterfaceComments"]').value;
  var networkEquipment1Value = document.querySelector('select[name="networkEquipment1"]').value;
  var equipmentIpAddress1Value = document.querySelector('input[name="equipmentIpAddress1"]').value;
  var equipmentSubnetMask1Value = document.querySelector('input[name="equipmentSubnetMask1"]').value;
  var equipmentDefaultGateway1Value = document.querySelector('input[name="equipmentDefaultGateway1"]').value;
  var equipmentMac1Value = document.querySelector('input[name="equipmentMac1"]').value;
  var networkEquipment2Value = document.querySelector('select[name="networkEquipment2"]').value;
  var equipmentIpAddress2Value = document.querySelector('input[name="equipmentIpAddress2"]').value;
  var equipmentSubnetMask2Value = document.querySelector('input[name="equipmentSubnetMask2"]').value;
  var equipmentDefaultGateway2Value = document.querySelector('input[name="equipmentDefaultGateway2"]').value;
  var equipmentMac2Value = document.querySelector('input[name="equipmentMac2"]').value;
  var networkEquipment3Value = document.querySelector('select[name="networkEquipment3"]').value;
  var equipmentIpAddress3Value = document.querySelector('input[name="equipmentIpAddress3"]').value;
  var equipmentSubnetMask3Value = document.querySelector('input[name="equipmentSubnetMask3"]').value;
  var equipmentDefaultGateway3Value = document.querySelector('input[name="equipmentDefaultGateway3"]').value;
  var equipmentMac3Value = document.querySelector('input[name="equipmentMac3"]').value;
  var networkEquipment4Value = document.querySelector('select[name="networkEquipment4"]').value;
  var equipmentIpAddress4Value = document.querySelector('input[name="equipmentIpAddress4"]').value;
  var equipmentSubnetMask4Value = document.querySelector('input[name="equipmentSubnetMask4"]').value;
  var equipmentDefaultGateway4Value = document.querySelector('input[name="equipmentDefaultGateway4"]').value;
  var equipmentMac4Value = document.querySelector('input[name="equipmentMac4"]').value;
  var networkEquipment5Value = document.querySelector('select[name="networkEquipment5"]').value;
  var equipmentIpAddress5Value = document.querySelector('input[name="equipmentIpAddress5"]').value;
  var equipmentSubnetMask5Value = document.querySelector('input[name="equipmentSubnetMask5"]').value;
  var equipmentDefaultGateway5Value = document.querySelector('input[name="equipmentDefaultGateway5"]').value;
  var equipmentMac5Value = document.querySelector('input[name="equipmentMac5"]').value;
  var networkEquipment6Value = document.querySelector('select[name="networkEquipment6"]').value;
  var equipmentIpAddress6Value = document.querySelector('input[name="equipmentIpAddress6"]').value;
  var equipmentSubnetMask6Value = document.querySelector('input[name="equipmentSubnetMask6"]').value;
  var equipmentDefaultGateway6Value = document.querySelector('input[name="equipmentDefaultGateway6"]').value;
  var equipmentMac6Value = document.querySelector('input[name="equipmentMac6"]').value;
  var networkEquipment7Value = document.querySelector('select[name="networkEquipment7"]').value;
  var equipmentIpAddress7Value = document.querySelector('input[name="equipmentIpAddress7"]').value;
  var equipmentSubnetMask7Value = document.querySelector('input[name="equipmentSubnetMask7"]').value;
  var equipmentDefaultGateway7Value = document.querySelector('input[name="equipmentDefaultGateway7"]').value;
  var equipmentMac7Value = document.querySelector('input[name="equipmentMac7"]').value;
  var networkEquipment8Value = document.querySelector('select[name="networkEquipment8"]').value;
  var equipmentIpAddress8Value = document.querySelector('input[name="equipmentIpAddress8"]').value;
  var equipmentSubnetMask8Value = document.querySelector('input[name="equipmentSubnetMask8"]').value;
  var equipmentDefaultGateway8Value = document.querySelector('input[name="equipmentDefaultGateway8"]').value;
  var equipmentMac8Value = document.querySelector('input[name="equipmentMac8"]').value;
  var networkDnsValue = document.querySelector('input[name="networkDns"]').value;
  var networkCommentsValue = document.querySelector('textarea[name="networkComments"]').value;
  var cloudHost1Value = document.querySelector('select[name="cloudHost1"]').value;
  var cloudHost2Value = document.querySelector('select[name="cloudHost2"]').value;
  var computerStartupValue = document.querySelector('select[name="computerStartup"]').value;
  var systemRequirementsValue = document.querySelector('select[name="systemRequirements"]').value;
  var windowsVersionValue = document.querySelector('input[name="windowsVersion"]').value;
  var osdStartupValue = document.querySelector('select[name="osdStartup"]').value;
  var osdOptionsValue = document.querySelector('select[name="osdOptions"]').value;
  var thirdPartyStartupValue = document.querySelector('select[name="thirdPartyStartup"]').value;
  var storageSpaceValue = document.querySelector('input[name="storageSpace"]').value;
  var remoteAccessToolsValue = document.querySelector('select[name="remoteAccessTools"]').value;
  var serialMouseFixValue = document.querySelector('select[name="serialMouseFix"]').value;
  var networkInterfaceConfigValue = document.querySelector('select[name="networkInterfaceConfig"]').value;
  var windowsFirewallValue = document.querySelector('select[name="windowsFirewall"]').value;
  var antiVirusValue = document.querySelector('select[name="antiVirus"]').value;
  var gpsCheck2Value = document.querySelector('select[name="gpsCheck2"]').value;
  var gyroCheck2Value = document.querySelector('select[name="gyroCheck2"]').value;
  var windCheck2Value = document.querySelector('select[name="windCheck2"]').value;
  var draughtCheck2Value = document.querySelector('select[name="draughtCheck2"]').value;
  var waveCheck2Value = document.querySelector('select[name="waveCheck2"]').value;
  var speedlogCheck2Value = document.querySelector('select[name="speedlogCheck2"]').value;
  var em129VersionValue = document.querySelector('select[name="em129Version"]').value;
  var em129SettingsValue = document.querySelector('select[name="em129Settings"]').value;
  var em129SignalStatusValue = document.querySelector('select[name="em129SignalStatus"]').value;
  var em129NetworkSettingsValue = document.querySelector('select[name="em129NetworkSettings"]').value;
  var em129InterfaceConfigValue = document.querySelector('select[name="em129InterfaceConfig"]').value;
  var em129ScopeValue = document.querySelector('select[name="em129Scope"]').value;
  var em129CommentsValue = document.querySelector('textarea[name="em129Comments"]').value;
  var osdDescriptionValue = document.querySelector('select[name="osdDescription"]').value;
  var osdMovementValue = document.querySelector('select[name="osdMovement"]').value;
  var osdLatValue = document.querySelector('input[name="osdLat"]').value;
  var osdLongValue = document.querySelector('input[name="osdLong"]').value;
  var osdHeadingValue = document.querySelector('input[name="osdHeading"]').value;
  var osdRadarValue = document.querySelector('select[name="osdRadar"]').value;
  var osdMulticastValue = document.querySelector('input[name="osdMulticast"]').value;
  var osdTransceiverValue = document.querySelector('input[name="osdTransceiver"]').value;
  var osdRinIdValue = document.querySelector('select[name="osdRinId"]').value;
  var osdRinNetworkValue = document.querySelector('select[name="osdRinNetwork"]').value;
  var osdImageStorageValue = document.querySelector('select[name="osdImageStorage"]').value;
  var osdGPSValue = document.querySelector('select[name="osdGPS"]').value;
  var osdGPSPositionSentenceValue = document.querySelector('select[name="osdGPSPositionSentence"]').value;
  var osdGPSTrackSpeedSentenceValue = document.querySelector('select[name="osdGPSTrackSpeedSentence"]').value;
  var osdGPSTimeSentenceValue = document.querySelector('select[name="osdGPSTimeSentence"]').value;
  var osdGPSSettingsValue = document.querySelector('input[name="osdGPSSettings"]').value;
  var osdGyroValue = document.querySelector('select[name="osdGyro"]').value;
  var osdGyroSentenceValue = document.querySelector('select[name="osdGyroSentence"]').value;
  var osdGyroSettingsValue = document.querySelector('input[name="osdGyroSettings"]').value;
  var osdWindValue = document.querySelector('select[name="osdWind"]').value;
  var osdWindSentenceValue = document.querySelector('select[name="osdWindSentence"]').value;
  var osdWindSettingsValue = document.querySelector('input[name="osdWindSettings"]').value;
  var osdDraughtValue = document.querySelector('select[name="osdDraught"]').value;
  var osdDraughtSentenceValue = document.querySelector('select[name="osdDraughtSentence"]').value;
  var osdDraughtSettingsValue = document.querySelector('input[name="osdDraughtSettings"]').value;
  var osdWaveValue = document.querySelector('select[name="osdWave"]').value;
  var osdWaveSentenceValue = document.querySelector('select[name="osdWaveSentence"]').value;
  var osdWaveSettingsValue = document.querySelector('input[name="osdWaveSettings"]').value;

  var osdSpeedlogValue = document.querySelector('select[name="osdSpeedlog"]').value;
  var osdSpeedlogSentenceValue = document.querySelector('select[name="osdSpeedlogSentence"]').value;
  var osdSpeedlogSettingsValue = document.querySelector('input[name="osdSpeedlogSettings"]').value;




  var osdGeometryRadarXValue = document.querySelector('input[name="osdGeometryRadarX"]').value;
  var osdGeometryRadarYValue = document.querySelector('input[name="osdGeometryRadarY"]').value;
  var osdGeometryRadarZValue = document.querySelector('input[name="osdGeometryRadarZ"]').value;
  var osdGeometryGPSXValue = document.querySelector('input[name="osdGeometryGPSX"]').value;
  var osdGeometryGPSYValue = document.querySelector('input[name="osdGeometryGPSY"]').value;
  var osdGeometryWindHeadingOffsetValue = document.querySelector('input[name="osdGeometryWindHeadingOffset"]').value;
  var osdGeometryWindZValue = document.querySelector('input[name="osdGeometryWindZ"]').value;
  var osdRadarRangeOffsetValue = document.querySelector('input[name="osdRadarRangeOffset"]').value;
  var osdRadarAzimuthOffsetValue = document.querySelector('input[name="osdRadarAzimuthOffset"]').value;
  var osdRadarStartAngleValue = document.querySelector('input[name="osdRadarStartAngle"]').value;
  var osdRadarSectorSizeValue = document.querySelector('input[name="osdRadarSectorSize"]').value;
  var osdRadarStartRangeValue = document.querySelector('input[name="osdRadarStartRange"]').value;
  var osdRadarStopRangeValue = document.querySelector('input[name="osdRadarStopRange"]').value;
  var osdRadarImageCheckValue = document.querySelector('select[name="osdRadarImageCheck"]').value;
  var osdAdvancedWaveAntennaMeanHeightValue = document.querySelector('select[name="osdAdvancedWaveAntennaMeanHeight"]').value;
  var osdAdvancedWaveCartesianSectionsValue = document.querySelector('select[name="osdAdvancedWaveCartesianSections"]').value;
  var osdAdvancedCurrentAntennaMeanHeightValue = document.querySelector('select[name="osdAdvancedCurrentAntennaMeanHeight"]').value;
  var osdAdvancedCurrentCartesianSectionsValue = document.querySelector('select[name="osdAdvancedCurrentCartesianSections"]').value;
  var osdOutput1Value = document.querySelector('select[name="osdOutput1"]').value;
  var osdOutput1SentenceValue = document.querySelector('select[name="osdOutput1Sentence"]').value;
  var osdOutput1UpdateIntervalValue = document.querySelector('input[name="osdOutput1UpdateInterval"]').value;
  var osdOutput1SettingsValue = document.querySelector('input[name="osdOutput1Settings"]').value;
  var osdOutput2Value = document.querySelector('select[name="osdOutput2"]').value;
  var osdOutput2SentenceValue = document.querySelector('select[name="osdOutput2Sentence"]').value;
  var osdOutput2UpdateIntervalValue = document.querySelector('input[name="osdOutput2UpdateInterval"]').value;
  var osdOutput2SettingsValue = document.querySelector('input[name="osdOutput2Settings"]').value;
  var osdOutput3Value = document.querySelector('select[name="osdOutput3"]').value;
  var osdOutput3SentenceValue = document.querySelector('select[name="osdOutput3Sentence"]').value;
  var osdOutput3UpdateIntervalValue = document.querySelector('input[name="osdOutput3UpdateInterval"]').value;
  var osdOutput3SettingsValue = document.querySelector('input[name="osdOutput3Settings"]').value;
  var cloudEnabledValue = document.querySelector('select[name="cloudEnabled"]').value;
  var finalConfigValue = document.querySelector('select[name="finalConfig"]').value;
  var finalPowerCycleValue = document.querySelector('select[name="finalPowerCycle"]').value;
  var finalStartupValue = document.querySelector('select[name="finalStartup"]').value;
  var final20MinuteValue = document.querySelector('select[name="final20Minute"]').value;
  var finalDataOutputValue = document.querySelector('select[name="finalDataOutput"]').value;
  var backuposdJsonValue = document.querySelector('select[name="backuposdJson"]').value;
  var backupDF047Value = document.querySelector('select[name="backupDF047"]').value;
  var backupEM129Value = document.querySelector('select[name="backupEM129"]').value;
  var backupMiscValue = document.querySelector('select[name="backupMisc"]').value;
  var loginType1Value = document.querySelector('select[name="loginType1"]').value;
  var loginUsername1Value = document.querySelector('input[name="loginUsername1"]').value;
  var loginPassword1Value = document.querySelector('input[name="loginPassword1"]').value;
  var loginComments1Value = document.querySelector('input[name="loginComments1"]').value;
  var loginType2Value = document.querySelector('select[name="loginType2"]').value;
  var loginUsername2Value = document.querySelector('input[name="loginUsername2"]').value;
  var loginPassword2Value = document.querySelector('input[name="loginPassword2"]').value;
  var loginComments2Value = document.querySelector('input[name="loginComments2"]').value;
  var loginType3Value = document.querySelector('select[name="loginType3"]').value;
  var loginUsername3Value = document.querySelector('input[name="loginUsername3"]').value;
  var loginPassword3Value = document.querySelector('input[name="loginPassword3"]').value;
  var loginComments3Value = document.querySelector('input[name="loginComments3"]').value;
  var workStatusValue = document.querySelector('select[name="workStatus"]').value;
  var subscriptionStatusValue = document.querySelector('select[name="subscriptionStatus"]').value;
  var subscriptionExpiryValue = document.querySelector('input[name="subscriptionExpiry"]').value;
  var generalCommentsValue = document.querySelector('textarea[name="generalComments"]').value;


  // Check if workTypeValue is "-"
  if (workStatusValue === "-") {
    alert('Please select a valid work status before downloading.');
    return;
  }
  // Create the JSON object
  var data = {
    site: siteValue,
    system: systemValue,
    workType: workTypeValue,
    workStatus: workStatusValue,
    subscriptionStatus: subscriptionStatusValue,
    subscriptionExpiry: subscriptionExpiryValue,
    generalComments: generalCommentsValue,
    siteType: siteTypeValue,
    customer: customerValue,
    date: dateValue,
    imo: imoValue,
    location: locationValue,
    engineer: engineerValue,
    engineer2: engineer2Value,


    recordEquipment: {
      recordEquipment1: recordEquipment1Value,
      equipmentManufact1: equipmentManufact1Value,
      equipmentModel1: equipmentModel1Value,
      equipmentPartNo1: equipmentPartNo1Value,
      equipmentSerialNo1: equipmentSerialNo1Value,
      equipmentLocation1: equipmentLocation1Value,
      recordEquipment2: recordEquipment2Value,
      equipmentManufact2: equipmentManufact2Value,
      equipmentModel2: equipmentModel2Value,
      equipmentPartNo2: equipmentPartNo2Value,
      equipmentSerialNo2: equipmentSerialNo2Value,
      equipmentLocation2: equipmentLocation2Value,
      recordEquipment3: recordEquipment3Value,
      equipmentManufact3: equipmentManufact3Value,
      equipmentModel3: equipmentModel3Value,
      equipmentPartNo3: equipmentPartNo3Value,
      equipmentSerialNo3: equipmentSerialNo3Value,
      equipmentLocation3: equipmentLocation3Value,
      recordEquipment4: recordEquipment4Value,
      equipmentManufact4: equipmentManufact4Value,
      equipmentModel4: equipmentModel4Value,
      equipmentPartNo4: equipmentPartNo4Value,
      equipmentSerialNo4: equipmentSerialNo4Value,
      equipmentLocation4: equipmentLocation4Value,
      recordEquipment5: recordEquipment5Value,
      equipmentManufact5: equipmentManufact5Value,
      equipmentModel5: equipmentModel5Value,
      equipmentPartNo5: equipmentPartNo5Value,
      equipmentSerialNo5: equipmentSerialNo5Value,
      equipmentLocation5: equipmentLocation5Value,
      recordEquipment6: recordEquipment6Value,
      equipmentManufact6: equipmentManufact6Value,
      equipmentModel6: equipmentModel6Value,
      equipmentPartNo6: equipmentPartNo6Value,
      equipmentSerialNo6: equipmentSerialNo6Value,
      equipmentLocation6: equipmentLocation6Value,
      recordEquipment7: recordEquipment7Value,
      equipmentManufact7: equipmentManufact7Value,
      equipmentModel7: equipmentModel7Value,
      equipmentPartNo7: equipmentPartNo7Value,
      equipmentSerialNo7: equipmentSerialNo7Value,
      equipmentLocation7: equipmentLocation7Value,
      recordEquipment8: recordEquipment8Value,
      equipmentManufact8: equipmentManufact8Value,
      equipmentModel8: equipmentModel8Value,
      equipmentPartNo8: equipmentPartNo8Value,
      equipmentSerialNo8: equipmentSerialNo8Value,
      equipmentLocation8: equipmentLocation8Value,
    },
    checkEquipment: {
      checkEquipment1: checkEquipment1Value,
      checkVisual1: checkVisual1Value,
      checkMech1: checkMech1Value,
      checkCabling1: checkCabling1Value,
      checkPower1: checkPower1Value,
      checkEarthing1: checkEarthing1Value,
      checkEquipment2: checkEquipment2Value,
      checkVisual2: checkVisual2Value,
      checkMech2: checkMech2Value,
      checkCabling2: checkCabling2Value,
      checkPower2: checkPower2Value,
      checkEarthing2: checkEarthing2Value,
      checkEquipment3: checkEquipment3Value,
      checkVisual3: checkVisual3Value,
      checkMech3: checkMech3Value,
      checkCabling3: checkCabling3Value,
      checkPower3: checkPower3Value,
      checkEarthing3: checkEarthing3Value,
      checkEquipment4: checkEquipment4Value,
      checkVisual4: checkVisual4Value,
      checkMech4: checkMech4Value,
      checkCabling4: checkCabling4Value,
      checkPower4: checkPower4Value,
      checkEarthing4: checkEarthing4Value,

      checkEquipment5: checkEquipment5Value,
      checkVisual5: checkVisual5Value,
      checkMech5: checkMech5Value,
      checkCabling5: checkCabling5Value,
      checkPower5: checkPower5Value,
      checkEarthing5: checkEarthing5Value,

      checkEquipment6: checkEquipment6Value,
      checkVisual6: checkVisual6Value,
      checkMech6: checkMech6Value,
      checkCabling6: checkCabling6Value,
      checkPower6: checkPower6Value,
      checkEarthing6: checkEarthing6Value,

      checkEquipment7: checkEquipment7Value,
      checkVisual7: checkVisual7Value,
      checkMech7: checkMech7Value,
      checkCabling7: checkCabling7Value,
      checkPower7: checkPower7Value,
      checkEarthing7: checkEarthing7Value,

      checkEquipment8: checkEquipment8Value,
      checkVisual8: checkVisual8Value,
      checkMech8: checkMech8Value,
      checkCabling8: checkCabling8Value,
      checkPower8: checkPower8Value,
      checkEarthing8: checkEarthing8Value,
      radarManufacturer: radarManufacturerValue,
      radarModel: radarModelValue,
      radarUse: radarUseValue,
      radarTxtime: radarTxtimeValue,
      radarLocation: radarLocationValue,
      radarSettings: radarSettingsValue,
      gpsCheck: gpsCheckValue,
      gyroCheck: gyroCheckValue,
      windCheck: windCheckValue,
      draughtCheck: draughtCheckValue,
      waveCheck: waveCheckValue,
      speedlogCheck: speedlogCheckValue,



      videoCableType: videoCableTypeValue,
      videoCableImpedance: videoCableImpedanceValue,
      videoCableComments: videoCableCommentsValue,
      syncCableType: syncCableTypeValue,
      syncCableImpedance: syncCableImpedanceValue,
      syncCableComments: syncCableCommentsValue,
      azimuthCableType: azimuthCableTypeValue,
      azimuthCableImpedance: azimuthCableImpedanceValue,
      azimuthCableComments: azimuthCableCommentsValue,
      headingCableType: headingCableTypeValue,
      headingCableImpedance: headingCableImpedanceValue,
      headingCableComments: headingCableCommentsValue,
      videoJumper: videoJumperValue,
      syncJumper: syncJumperValue,
      azimuthJumper: azimuthJumperValue,
      headingJumper: headingJumperValue,
      pullupJumper: pullupJumperValue,
      pulldownJumper: pulldownJumperValue,
      amplifierType: amplifierTypeValue,
      amplifierCheck: amplifierCheckValue,
      amplifierComments: amplifierCommentsValue,
      radarFirewallType: radarFirewallTypeValue,
      radarFirewallCheck: radarFirewallCheckValue,
      radarFirewallComments: radarFirewallCommentsValue,
      serialInterfaceType: serialInterfaceTypeValue,
      serialInterfaceCheck: serialInterfaceCheckValue,
      serialInterfaceComments: serialInterfaceCommentsValue,
    },
    network: {
      networkEquipment1: networkEquipment1Value,
      equipmentIpAddress1: equipmentIpAddress1Value,
      equipmentSubnetMask1: equipmentSubnetMask1Value,
      equipmentDefaultGateway1: equipmentDefaultGateway1Value,
      equipmentMac1: equipmentMac1Value,
      networkEquipment2: networkEquipment2Value,
      equipmentIpAddress2: equipmentIpAddress2Value,
      equipmentSubnetMask2: equipmentSubnetMask2Value,
      equipmentDefaultGateway2: equipmentDefaultGateway2Value,
      equipmentMac2: equipmentMac2Value,
      networkEquipment3: networkEquipment3Value,
      equipmentIpAddress3: equipmentIpAddress3Value,
      equipmentSubnetMask3: equipmentSubnetMask3Value,
      equipmentDefaultGateway3: equipmentDefaultGateway3Value,
      equipmentMac3: equipmentMac3Value,
      networkEquipment4: networkEquipment4Value,
      equipmentIpAddress4: equipmentIpAddress4Value,
      equipmentSubnetMask4: equipmentSubnetMask4Value,
      equipmentDefaultGateway4: equipmentDefaultGateway4Value,
      equipmentMac4: equipmentMac4Value,
      networkEquipment5: networkEquipment5Value,
      equipmentIpAddress5: equipmentIpAddress5Value,
      equipmentSubnetMask5: equipmentSubnetMask5Value,
      equipmentDefaultGateway5: equipmentDefaultGateway5Value,
      equipmentMac5: equipmentMac5Value,
      networkEquipment6: networkEquipment6Value,
      equipmentIpAddress6: equipmentIpAddress6Value,
      equipmentSubnetMask6: equipmentSubnetMask6Value,
      equipmentDefaultGateway6: equipmentDefaultGateway6Value,
      equipmentMac6: equipmentMac6Value,
      networkEquipment7: networkEquipment7Value,
      equipmentIpAddress7: equipmentIpAddress7Value,
      equipmentSubnetMask7: equipmentSubnetMask7Value,
      equipmentDefaultGateway7: equipmentDefaultGateway7Value,
      equipmentMac7: equipmentMac7Value,
      networkEquipment8: networkEquipment8Value,
      equipmentIpAddress8: equipmentIpAddress8Value,
      equipmentSubnetMask8: equipmentSubnetMask8Value,
      equipmentDefaultGateway8: equipmentDefaultGateway8Value,
      equipmentMac8: equipmentMac8Value,
      networkDns: networkDnsValue,
      networkComments: networkCommentsValue,
      cloudHost1: cloudHost1Value,
      cloudHost2: cloudHost2Value,
    },
    startup: {
      computerStartup: computerStartupValue,
      systemRequirements: systemRequirementsValue,
      windowsVersion: windowsVersionValue,
      osdStartup: osdStartupValue,
      osdOptions: osdOptionsValue,
      thirdPartyStartup: thirdPartyStartupValue,
      storageSpace: storageSpaceValue,
      remoteAccessTools: remoteAccessToolsValue,
      serialMouseFix: serialMouseFixValue,
      networkInterfaceConfig: networkInterfaceConfigValue,
      windowsFirewall: windowsFirewallValue,
      antiVirus: antiVirusValue,
      gpsCheck2: gpsCheck2Value,
      gyroCheck2: gyroCheck2Value,
      windCheck2: windCheck2Value,
      draughtCheck2: draughtCheck2Value,
      waveCheck2: waveCheck2Value,
    },
    configuration: {
      em129Version: em129VersionValue,
      em129Settings: em129SettingsValue,
      em129SignalStatus: em129SignalStatusValue,
      em129NetworkSettings: em129NetworkSettingsValue,
      em129InterfaceConfig: em129InterfaceConfigValue,
      em129Scope: em129ScopeValue,
      em129Comments: em129CommentsValue,
      osdDescription: osdDescriptionValue,
      osdMovement: osdMovementValue,
      osdLat: osdLatValue,
      osdLong: osdLongValue,
      osdHeading: osdHeadingValue,
      osdRadar: osdRadarValue,
      osdMulticast: osdMulticastValue,
      osdTransceiver: osdTransceiverValue,
      osdRinId: osdRinIdValue,
      osdRinNetwork: osdRinNetworkValue,
      osdImageStorage: osdImageStorageValue,
      osdGPS: osdGPSValue,
      osdGPSPositionSentence: osdGPSPositionSentenceValue,
      osdGPSTrackSpeedSentence: osdGPSTrackSpeedSentenceValue,
      osdGPSTimeSentence: osdGPSTimeSentenceValue,
      osdGPSSettings: osdGPSSettingsValue,
      osdGyro: osdGyroValue,
      osdGyroSentence: osdGyroSentenceValue,
      osdGyroSettings: osdGyroSettingsValue,
      osdWind: osdWindValue,
      osdWindSentence: osdWindSentenceValue,
      osdWindSettings: osdWindSettingsValue,
      osdWave: osdWaveValue,
      osdWaveSentence: osdWaveSentenceValue,
      osdWaveSettings: osdWaveSettingsValue,
      osdDraught: osdDraughtValue,
      osdDraughtSentence: osdDraughtSentenceValue,
      osdDraughtSettings: osdDraughtSettingsValue,
      osdSpeedlog: osdSpeedlogValue,
      osdSpeedlogSentence: osdSpeedlogSentenceValue,
      osdSpeedlogSettings: osdSpeedlogSettingsValue,




      osdGeometryRadarX: osdGeometryRadarXValue,
      osdGeometryRadarY: osdGeometryRadarYValue,
      osdGeometryRadarZ: osdGeometryRadarZValue,
      osdGeometryGPSX: osdGeometryGPSXValue,
      osdGeometryGPSY: osdGeometryGPSYValue,
      osdGeometryWindHeadingOffset: osdGeometryWindHeadingOffsetValue,
      osdGeometryWindZ: osdGeometryWindZValue,
      osdRadarRangeOffset: osdRadarRangeOffsetValue,
      osdRadarAzimuthOffset: osdRadarAzimuthOffsetValue,
      osdRadarStartAngle: osdRadarStartAngleValue,
      osdRadarSectorSize: osdRadarSectorSizeValue,
      osdRadarStartRange: osdRadarStartRangeValue,
      osdRadarStopRange: osdRadarStopRangeValue,
      osdRadarImageCheck: osdRadarImageCheckValue,
      osdAdvancedWaveAntennaMeanHeight: osdAdvancedWaveAntennaMeanHeightValue,
      osdAdvancedWaveCartesianSections: osdAdvancedWaveCartesianSectionsValue,
      osdAdvancedCurrentAntennaMeanHeight: osdAdvancedCurrentAntennaMeanHeightValue,
      osdAdvancedCurrentCartesianSections: osdAdvancedCurrentCartesianSectionsValue,
      osdOutput1: osdOutput1Value,
      osdOutput1Sentence: osdOutput1SentenceValue,
      osdOutput1UpdateInterval: osdOutput1UpdateIntervalValue,
      osdOutput1Settings: osdOutput1SettingsValue,
      osdOutput2: osdOutput2Value,
      osdOutput2Sentence: osdOutput2SentenceValue,
      osdOutput2UpdateInterval: osdOutput2UpdateIntervalValue,
      osdOutput2Settings: osdOutput2SettingsValue,
      osdOutput3: osdOutput3Value,
      osdOutput3Sentence: osdOutput3SentenceValue,
      osdOutput3UpdateInterval: osdOutput3UpdateIntervalValue,
      osdOutput3Settings: osdOutput3SettingsValue,
      cloudEnabled: cloudEnabledValue,
      finalConfig: finalConfigValue,
    },
    finalStartup: {
      finalPowerCycle: finalPowerCycleValue,
      finalStartup: finalStartupValue,
      final20Minute: final20MinuteValue,
      finalDataOutput: finalDataOutputValue,
    },
    backup: {
      backuposdJson: backuposdJsonValue,
      backupDF047: backupDF047Value,
      backupEM129: backupEM129Value,
      backupMisc: backupMiscValue,
    },
    loginDetails: {
      loginType1: loginType1Value,
      loginUsername1: loginUsername1Value,
      loginPassword1: loginPassword1Value,
      loginComments1: loginComments1Value,
      loginType2: loginType2Value,
      loginUsername2: loginUsername2Value,
      loginPassword2: loginPassword2Value,
      loginComments2: loginComments2Value,
      loginType3: loginType3Value,
      loginUsername3: loginUsername3Value,
      loginPassword3: loginPassword3Value,
      loginComments3: loginComments3Value,
    },
  }

  // Convert the data to JSON string
  var jsonData = JSON.stringify(data, null, 2);

  // Create the filename using the form element values
  var filename = systemValue + "_" + siteValue + "_" + customerValue + "_" + "_" + workTypeValue + "_" + workStatusValue + '.json';

  // Create a temporary <a> element to trigger the download
  var link = document.createElement('a');
  link.href = 'data:application/json;charset=utf-8,' + encodeURIComponent(jsonData);
  link.download = filename;

  // Trigger the download
  link.click();
}



function exportToJsonMocean() {
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
  var engineer2Value = document.querySelector('select[name="engineer2"]').value;
  var recordEquipment1Value = document.querySelector('select[name="recordEquipment1"]').value;
  var equipmentManufact1Value = document.querySelector('input[name="equipmentManufact1"]').value;
  var equipmentModel1Value = document.querySelector('input[name="equipmentModel1"]').value;
  var equipmentPartNo1Value = document.querySelector('input[name="equipmentPartNo1"]').value;
  var equipmentSerialNo1Value = document.querySelector('input[name="equipmentSerialNo1"]').value;
  var equipmentLocation1Value = document.querySelector('input[name="equipmentLocation1"]').value;
  var recordEquipment2Value = document.querySelector('select[name="recordEquipment2"]').value;
  var equipmentManufact2Value = document.querySelector('input[name="equipmentManufact2"]').value;
  var equipmentModel2Value = document.querySelector('input[name="equipmentModel2"]').value;
  var equipmentPartNo2Value = document.querySelector('input[name="equipmentPartNo2"]').value;
  var equipmentSerialNo2Value = document.querySelector('input[name="equipmentSerialNo2"]').value;
  var equipmentLocation2Value = document.querySelector('input[name="equipmentLocation2"]').value;
  var recordEquipment3Value = document.querySelector('select[name="recordEquipment3"]').value;
  var equipmentManufact3Value = document.querySelector('input[name="equipmentManufact3"]').value;
  var equipmentModel3Value = document.querySelector('input[name="equipmentModel3"]').value;
  var equipmentPartNo3Value = document.querySelector('input[name="equipmentPartNo3"]').value;
  var equipmentSerialNo3Value = document.querySelector('input[name="equipmentSerialNo3"]').value;
  var equipmentLocation3Value = document.querySelector('input[name="equipmentLocation3"]').value;
  var recordEquipment4Value = document.querySelector('select[name="recordEquipment4"]').value;
  var equipmentManufact4Value = document.querySelector('input[name="equipmentManufact4"]').value;
  var equipmentModel4Value = document.querySelector('input[name="equipmentModel4"]').value;
  var equipmentPartNo4Value = document.querySelector('input[name="equipmentPartNo4"]').value;
  var equipmentSerialNo4Value = document.querySelector('input[name="equipmentSerialNo4"]').value;
  var equipmentLocation4Value = document.querySelector('input[name="equipmentLocation4"]').value;
  var recordEquipment5Value = document.querySelector('select[name="recordEquipment5"]').value;
  var equipmentManufact5Value = document.querySelector('input[name="equipmentManufact5"]').value;
  var equipmentModel5Value = document.querySelector('input[name="equipmentModel5"]').value;
  var equipmentPartNo5Value = document.querySelector('input[name="equipmentPartNo5"]').value;
  var equipmentSerialNo5Value = document.querySelector('input[name="equipmentSerialNo5"]').value;
  var equipmentLocation5Value = document.querySelector('input[name="equipmentLocation5"]').value;
  var recordEquipment6Value = document.querySelector('select[name="recordEquipment6"]').value;
  var equipmentManufact6Value = document.querySelector('input[name="equipmentManufact6"]').value;
  var equipmentModel6Value = document.querySelector('input[name="equipmentModel6"]').value;
  var equipmentPartNo6Value = document.querySelector('input[name="equipmentPartNo6"]').value;
  var equipmentSerialNo6Value = document.querySelector('input[name="equipmentSerialNo6"]').value;
  var equipmentLocation6Value = document.querySelector('input[name="equipmentLocation6"]').value;
  var recordEquipment7Value = document.querySelector('select[name="recordEquipment7"]').value;
  var equipmentManufact7Value = document.querySelector('input[name="equipmentManufact7"]').value;
  var equipmentModel7Value = document.querySelector('input[name="equipmentModel7"]').value;
  var equipmentPartNo7Value = document.querySelector('input[name="equipmentPartNo7"]').value;
  var equipmentSerialNo7Value = document.querySelector('input[name="equipmentSerialNo7"]').value;
  var equipmentLocation7Value = document.querySelector('input[name="equipmentLocation7"]').value;
  var recordEquipment8Value = document.querySelector('select[name="recordEquipment8"]').value;
  var equipmentManufact8Value = document.querySelector('input[name="equipmentManufact8"]').value;
  var equipmentModel8Value = document.querySelector('input[name="equipmentModel8"]').value;
  var equipmentPartNo8Value = document.querySelector('input[name="equipmentPartNo8"]').value;
  var equipmentSerialNo8Value = document.querySelector('input[name="equipmentSerialNo8"]').value;
  var equipmentLocation8Value = document.querySelector('input[name="equipmentLocation8"]').value;
  var checkEquipment1Value = document.querySelector('select[name="checkEquipment1"]').value;
  var checkVisual1Value = document.querySelector('select[name="checkVisual1"]').value;
  var checkMech1Value = document.querySelector('select[name="checkMech1"]').value;
  var checkCabling1Value = document.querySelector('select[name="checkCabling1"]').value;
  var checkPower1Value = document.querySelector('select[name="checkPower1"]').value;
  var checkEarthing1Value = document.querySelector('select[name="checkEarthing1"]').value;
  var checkEquipment2Value = document.querySelector('select[name="checkEquipment2"]').value;
  var checkVisual2Value = document.querySelector('select[name="checkVisual2"]').value;
  var checkMech2Value = document.querySelector('select[name="checkMech2"]').value;
  var checkCabling2Value = document.querySelector('select[name="checkCabling2"]').value;
  var checkPower2Value = document.querySelector('select[name="checkPower2"]').value;
  var checkEarthing2Value = document.querySelector('select[name="checkEarthing2"]').value;
  var checkEquipment3Value = document.querySelector('select[name="checkEquipment3"]').value;
  var checkVisual3Value = document.querySelector('select[name="checkVisual3"]').value;
  var checkMech3Value = document.querySelector('select[name="checkMech3"]').value;
  var checkCabling3Value = document.querySelector('select[name="checkCabling3"]').value;
  var checkPower3Value = document.querySelector('select[name="checkPower3"]').value;
  var checkEarthing3Value = document.querySelector('select[name="checkEarthing3"]').value;
  var checkEquipment3Value = document.querySelector('select[name="checkEquipment3"]').value;
  var checkVisual3Value = document.querySelector('select[name="checkVisual3"]').value;
  var checkMech3Value = document.querySelector('select[name="checkMech3"]').value;
  var checkCabling3Value = document.querySelector('select[name="checkCabling3"]').value;
  var checkPower3Value = document.querySelector('select[name="checkPower3"]').value;
  var checkEarthing3Value = document.querySelector('select[name="checkEarthing3"]').value;
  var checkEquipment4Value = document.querySelector('select[name="checkEquipment4"]').value;
  var checkVisual4Value = document.querySelector('select[name="checkVisual4"]').value;
  var checkMech4Value = document.querySelector('select[name="checkMech4"]').value;
  var checkCabling4Value = document.querySelector('select[name="checkCabling4"]').value;
  var checkPower4Value = document.querySelector('select[name="checkPower4"]').value;
  var checkEarthing4Value = document.querySelector('select[name="checkEarthing4"]').value;
  var checkEquipment5Value = document.querySelector('select[name="checkEquipment5"]').value;
  var checkVisual5Value = document.querySelector('select[name="checkVisual5"]').value;
  var checkMech5Value = document.querySelector('select[name="checkMech5"]').value;
  var checkCabling5Value = document.querySelector('select[name="checkCabling5"]').value;
  var checkPower5Value = document.querySelector('select[name="checkPower5"]').value;
  var checkEarthing5Value = document.querySelector('select[name="checkEarthing5"]').value;
  var checkEquipment6Value = document.querySelector('select[name="checkEquipment6"]').value;
  var checkVisual6Value = document.querySelector('select[name="checkVisual6"]').value;
  var checkMech6Value = document.querySelector('select[name="checkMech6"]').value;
  var checkCabling6Value = document.querySelector('select[name="checkCabling6"]').value;
  var checkPower6Value = document.querySelector('select[name="checkPower6"]').value;
  var checkEarthing6Value = document.querySelector('select[name="checkEarthing6"]').value;
  var checkEquipment7Value = document.querySelector('select[name="checkEquipment7"]').value;
  var checkVisual7Value = document.querySelector('select[name="checkVisual7"]').value;
  var checkMech7Value = document.querySelector('select[name="checkMech7"]').value;
  var checkCabling7Value = document.querySelector('select[name="checkCabling7"]').value;
  var checkPower7Value = document.querySelector('select[name="checkPower7"]').value;
  var checkEarthing7Value = document.querySelector('select[name="checkEarthing7"]').value;
  var checkEquipment8Value = document.querySelector('select[name="checkEquipment8"]').value;
  var checkVisual8Value = document.querySelector('select[name="checkVisual8"]').value;
  var checkMech8Value = document.querySelector('select[name="checkMech8"]').value;
  var checkCabling8Value = document.querySelector('select[name="checkCabling8"]').value;
  var checkPower8Value = document.querySelector('select[name="checkPower8"]').value;
  var checkEarthing8Value = document.querySelector('select[name="checkEarthing8"]').value;
  var radarManufacturerValue = document.querySelector('select[name="radarManufacturer"]').value;
  var radarModelValue = document.querySelector('input[name="radarModel"]').value;
  var radarUseValue = document.querySelector('select[name="radarUse"]').value;
  var radarTxtimeValue = document.querySelector('input[name="radarTxtime"]').value;
  var radarLocationValue = document.querySelector('textarea[name="radarLocation"]').value;
  var radarSettingsValue = document.querySelector('textarea[name="radarSettings"]').value;
  var gpsCheckValue = document.querySelector('select[name="gpsCheck"]').value;
  var gyroCheckValue = document.querySelector('select[name="gyroCheck"]').value;
  var windCheckValue = document.querySelector('select[name="windCheck"]').value;
  var draughtCheckValue = document.querySelector('select[name="draughtCheck"]').value;
  var waveCheckValue = document.querySelector('select[name="waveCheck"]').value;
  var speedlogCheckValue = document.querySelector('select[name="speedlogCheck"]').value;
  var shaftCheckValue = document.querySelector('select[name="shaftCheck"]').value;
  var videoCableTypeValue = document.querySelector('select[name="videoCableType"]').value;
  var videoCableImpedanceValue = document.querySelector('select[name="videoCableImpedance"]').value;
  var videoCableCommentsValue = document.querySelector('input[name="videoCableComments"]').value;
  var syncCableTypeValue = document.querySelector('select[name="syncCableType"]').value;
  var syncCableImpedanceValue = document.querySelector('select[name="syncCableImpedance"]').value;
  var syncCableCommentsValue = document.querySelector('input[name="syncCableComments"]').value;
  var azimuthCableTypeValue = document.querySelector('select[name="azimuthCableType"]').value;
  var azimuthCableImpedanceValue = document.querySelector('select[name="azimuthCableImpedance"]').value;
  var azimuthCableCommentsValue = document.querySelector('input[name="azimuthCableComments"]').value;
  var headingCableTypeValue = document.querySelector('select[name="headingCableType"]').value;
  var headingCableImpedanceValue = document.querySelector('select[name="headingCableImpedance"]').value;
  var headingCableCommentsValue = document.querySelector('input[name="headingCableComments"]').value;
  var videoJumperValue = document.querySelector('select[name="videoJumper"]').value;
  var syncJumperValue = document.querySelector('select[name="syncJumper"]').value;
  var azimuthJumperValue = document.querySelector('select[name="azimuthJumper"]').value;
  var headingJumperValue = document.querySelector('select[name="headingJumper"]').value;
  var pullupJumperValue = document.querySelector('select[name="pullupJumper"]').value;
  var pulldownJumperValue = document.querySelector('select[name="pulldownJumper"]').value;
  var amplifierTypeValue = document.querySelector('select[name="amplifierType"]').value;
  var amplifierCheckValue = document.querySelector('select[name="amplifierCheck"]').value;
  var amplifierCommentsValue = document.querySelector('input[name="amplifierComments"]').value;
  var radarFirewallTypeValue = document.querySelector('select[name="radarFirewallType"]').value;
  var radarFirewallCheckValue = document.querySelector('select[name="radarFirewallCheck"]').value;
  var radarFirewallCommentsValue = document.querySelector('input[name="radarFirewallComments"]').value;
  var serialInterfaceTypeValue = document.querySelector('select[name="serialInterfaceType"]').value;
  var serialInterfaceCheckValue = document.querySelector('select[name="serialInterfaceCheck"]').value;
  var serialInterfaceCommentsValue = document.querySelector('input[name="serialInterfaceComments"]').value;
  var networkEquipment1Value = document.querySelector('select[name="networkEquipment1"]').value;
  var equipmentIpAddress1Value = document.querySelector('input[name="equipmentIpAddress1"]').value;
  var equipmentSubnetMask1Value = document.querySelector('input[name="equipmentSubnetMask1"]').value;
  var equipmentDefaultGateway1Value = document.querySelector('input[name="equipmentDefaultGateway1"]').value;
  var equipmentMac1Value = document.querySelector('input[name="equipmentMac1"]').value;
  var networkEquipment2Value = document.querySelector('select[name="networkEquipment2"]').value;
  var equipmentIpAddress2Value = document.querySelector('input[name="equipmentIpAddress2"]').value;
  var equipmentSubnetMask2Value = document.querySelector('input[name="equipmentSubnetMask2"]').value;
  var equipmentDefaultGateway2Value = document.querySelector('input[name="equipmentDefaultGateway2"]').value;
  var equipmentMac2Value = document.querySelector('input[name="equipmentMac2"]').value;
  var networkEquipment3Value = document.querySelector('select[name="networkEquipment3"]').value;
  var equipmentIpAddress3Value = document.querySelector('input[name="equipmentIpAddress3"]').value;
  var equipmentSubnetMask3Value = document.querySelector('input[name="equipmentSubnetMask3"]').value;
  var equipmentDefaultGateway3Value = document.querySelector('input[name="equipmentDefaultGateway3"]').value;
  var equipmentMac3Value = document.querySelector('input[name="equipmentMac3"]').value;
  var networkEquipment4Value = document.querySelector('select[name="networkEquipment4"]').value;
  var equipmentIpAddress4Value = document.querySelector('input[name="equipmentIpAddress4"]').value;
  var equipmentSubnetMask4Value = document.querySelector('input[name="equipmentSubnetMask4"]').value;
  var equipmentDefaultGateway4Value = document.querySelector('input[name="equipmentDefaultGateway4"]').value;
  var equipmentMac4Value = document.querySelector('input[name="equipmentMac4"]').value;
  var networkEquipment5Value = document.querySelector('select[name="networkEquipment5"]').value;
  var equipmentIpAddress5Value = document.querySelector('input[name="equipmentIpAddress5"]').value;
  var equipmentSubnetMask5Value = document.querySelector('input[name="equipmentSubnetMask5"]').value;
  var equipmentDefaultGateway5Value = document.querySelector('input[name="equipmentDefaultGateway5"]').value;
  var equipmentMac5Value = document.querySelector('input[name="equipmentMac5"]').value;
  var networkEquipment6Value = document.querySelector('select[name="networkEquipment6"]').value;
  var equipmentIpAddress6Value = document.querySelector('input[name="equipmentIpAddress6"]').value;
  var equipmentSubnetMask6Value = document.querySelector('input[name="equipmentSubnetMask6"]').value;
  var equipmentDefaultGateway6Value = document.querySelector('input[name="equipmentDefaultGateway6"]').value;
  var equipmentMac6Value = document.querySelector('input[name="equipmentMac6"]').value;
  var networkEquipment7Value = document.querySelector('select[name="networkEquipment7"]').value;
  var equipmentIpAddress7Value = document.querySelector('input[name="equipmentIpAddress7"]').value;
  var equipmentSubnetMask7Value = document.querySelector('input[name="equipmentSubnetMask7"]').value;
  var equipmentDefaultGateway7Value = document.querySelector('input[name="equipmentDefaultGateway7"]').value;
  var equipmentMac7Value = document.querySelector('input[name="equipmentMac7"]').value;
  var networkEquipment8Value = document.querySelector('select[name="networkEquipment8"]').value;
  var equipmentIpAddress8Value = document.querySelector('input[name="equipmentIpAddress8"]').value;
  var equipmentSubnetMask8Value = document.querySelector('input[name="equipmentSubnetMask8"]').value;
  var equipmentDefaultGateway8Value = document.querySelector('input[name="equipmentDefaultGateway8"]').value;
  var equipmentMac8Value = document.querySelector('input[name="equipmentMac8"]').value;
  var networkDnsValue = document.querySelector('input[name="networkDns"]').value;
  var networkCommentsValue = document.querySelector('textarea[name="networkComments"]').value;
  var cloudHost1Value = document.querySelector('select[name="cloudHost1"]').value;
  var cloudHost2Value = document.querySelector('select[name="cloudHost2"]').value;
  var computerStartupValue = document.querySelector('select[name="computerStartup"]').value;
  var systemRequirementsValue = document.querySelector('select[name="systemRequirements"]').value;
  var windowsVersionValue = document.querySelector('input[name="windowsVersion"]').value;
  var wavexStartupValue = document.querySelector('select[name="wavexStartup"]').value;
  var wavexOptionsValue = document.querySelector('select[name="wavexOptions"]').value;
  var thirdPartyStartupValue = document.querySelector('select[name="thirdPartyStartup"]').value;
  var storageSpaceValue = document.querySelector('input[name="storageSpace"]').value;
  var remoteAccessToolsValue = document.querySelector('select[name="remoteAccessTools"]').value;
  var serialMouseFixValue = document.querySelector('select[name="serialMouseFix"]').value;
  var networkInterfaceConfigValue = document.querySelector('select[name="networkInterfaceConfig"]').value;
  var windowsFirewallValue = document.querySelector('select[name="windowsFirewall"]').value;
  var antiVirusValue = document.querySelector('select[name="antiVirus"]').value;
  var gpsCheck2Value = document.querySelector('select[name="gpsCheck2"]').value;
  var gyroCheck2Value = document.querySelector('select[name="gyroCheck2"]').value;
  var windCheck2Value = document.querySelector('select[name="windCheck2"]').value;
  var draughtCheck2Value = document.querySelector('select[name="draughtCheck2"]').value;
  var waveCheck2Value = document.querySelector('select[name="waveCheck2"]').value;
  var speedlogCheck2Value = document.querySelector('select[name="speedlogCheck2"]').value;
  var shaftCheck2Value = document.querySelector('select[name="shaftCheck2"]').value;
  var em129VersionValue = document.querySelector('select[name="em129Version"]').value;
  var em129SettingsValue = document.querySelector('select[name="em129Settings"]').value;
  var em129SignalStatusValue = document.querySelector('select[name="em129SignalStatus"]').value;
  var em129NetworkSettingsValue = document.querySelector('select[name="em129NetworkSettings"]').value;
  var em129InterfaceConfigValue = document.querySelector('select[name="em129InterfaceConfig"]').value;
  var em129ScopeValue = document.querySelector('select[name="em129Scope"]').value;
  var em129CommentsValue = document.querySelector('textarea[name="em129Comments"]').value;
  var wavexDescriptionValue = document.querySelector('select[name="wavexDescription"]').value;
  var wavexMovementValue = document.querySelector('select[name="wavexMovement"]').value;
  var wavexLatValue = document.querySelector('input[name="wavexLat"]').value;
  var wavexLongValue = document.querySelector('input[name="wavexLong"]').value;
  var wavexHeadingValue = document.querySelector('input[name="wavexHeading"]').value;
  var wavexRadarValue = document.querySelector('select[name="wavexRadar"]').value;
  var wavexMulticastValue = document.querySelector('input[name="wavexMulticast"]').value;
  var wavexTransceiverValue = document.querySelector('input[name="wavexTransceiver"]').value;
  var wavexRinIdValue = document.querySelector('select[name="wavexRinId"]').value;
  var wavexRinNetworkValue = document.querySelector('select[name="wavexRinNetwork"]').value;
  var wavexImageStorageValue = document.querySelector('select[name="wavexImageStorage"]').value;
  var wavexGPSValue = document.querySelector('select[name="wavexGPS"]').value;
  var wavexGPSPositionSentenceValue = document.querySelector('select[name="wavexGPSPositionSentence"]').value;
  var wavexGPSTrackSpeedSentenceValue = document.querySelector('select[name="wavexGPSTrackSpeedSentence"]').value;
  var wavexGPSTimeSentenceValue = document.querySelector('select[name="wavexGPSTimeSentence"]').value;
  var wavexGPSSettingsValue = document.querySelector('input[name="wavexGPSSettings"]').value;
  var wavexGyroValue = document.querySelector('select[name="wavexGyro"]').value;
  var wavexGyroSentenceValue = document.querySelector('select[name="wavexGyroSentence"]').value;
  var wavexGyroSettingsValue = document.querySelector('input[name="wavexGyroSettings"]').value;
  var wavexWindValue = document.querySelector('select[name="wavexWind"]').value;
  var wavexWindSentenceValue = document.querySelector('select[name="wavexWindSentence"]').value;
  var wavexWindSettingsValue = document.querySelector('input[name="wavexWindSettings"]').value;
  var wavexDraughtValue = document.querySelector('select[name="wavexDraught"]').value;
  var wavexDraughtSentenceValue = document.querySelector('select[name="wavexDraughtSentence"]').value;
  var wavexDraughtSettingsValue = document.querySelector('input[name="wavexDraughtSettings"]').value;
  var wavexWaveValue = document.querySelector('select[name="wavexWave"]').value;
  var wavexWaveSentenceValue = document.querySelector('select[name="wavexWaveSentence"]').value;
  var wavexWaveSettingsValue = document.querySelector('input[name="wavexWaveSettings"]').value;

  var wavexSpeedlogValue = document.querySelector('select[name="wavexSpeedlog"]').value;
  var wavexSpeedlogSentenceValue = document.querySelector('select[name="wavexSpeedlogSentence"]').value;
  var wavexSpeedlogSettingsValue = document.querySelector('input[name="wavexSpeedlogSettings"]').value;

  var wavexShaftValue = document.querySelector('select[name="wavexShaft"]').value;
  var wavexShaftSentenceValue = document.querySelector('select[name="wavexShaftSentence"]').value;
  var wavexShaftSettingsValue = document.querySelector('input[name="wavexShaftSettings"]').value;



  var wavexGeometryRadarXValue = document.querySelector('input[name="wavexGeometryRadarX"]').value;
  var wavexGeometryRadarYValue = document.querySelector('input[name="wavexGeometryRadarY"]').value;
  var wavexGeometryRadarZValue = document.querySelector('input[name="wavexGeometryRadarZ"]').value;
  var wavexGeometryGPSXValue = document.querySelector('input[name="wavexGeometryGPSX"]').value;
  var wavexGeometryGPSYValue = document.querySelector('input[name="wavexGeometryGPSY"]').value;
  var wavexGeometryWindHeadingOffsetValue = document.querySelector('input[name="wavexGeometryWindHeadingOffset"]').value;
  var wavexGeometryWindZValue = document.querySelector('input[name="wavexGeometryWindZ"]').value;
  var wavexRadarRangeOffsetValue = document.querySelector('input[name="wavexRadarRangeOffset"]').value;
  var wavexRadarAzimuthOffsetValue = document.querySelector('input[name="wavexRadarAzimuthOffset"]').value;
  var wavexRadarStartAngleValue = document.querySelector('input[name="wavexRadarStartAngle"]').value;
  var wavexRadarSectorSizeValue = document.querySelector('input[name="wavexRadarSectorSize"]').value;
  var wavexRadarStartRangeValue = document.querySelector('input[name="wavexRadarStartRange"]').value;
  var wavexRadarStopRangeValue = document.querySelector('input[name="wavexRadarStopRange"]').value;
  var wavexRadarImageCheckValue = document.querySelector('select[name="wavexRadarImageCheck"]').value;
  var wavexAdvancedWaveAntennaMeanHeightValue = document.querySelector('select[name="wavexAdvancedWaveAntennaMeanHeight"]').value;
  var wavexAdvancedWaveCartesianSectionsValue = document.querySelector('select[name="wavexAdvancedWaveCartesianSections"]').value;
  var wavexAdvancedCurrentAntennaMeanHeightValue = document.querySelector('select[name="wavexAdvancedCurrentAntennaMeanHeight"]').value;
  var wavexAdvancedCurrentCartesianSectionsValue = document.querySelector('select[name="wavexAdvancedCurrentCartesianSections"]').value;
  var wavexOutput1Value = document.querySelector('select[name="wavexOutput1"]').value;
  var wavexOutput1SentenceValue = document.querySelector('select[name="wavexOutput1Sentence"]').value;
  var wavexOutput1UpdateIntervalValue = document.querySelector('input[name="wavexOutput1UpdateInterval"]').value;
  var wavexOutput1SettingsValue = document.querySelector('input[name="wavexOutput1Settings"]').value;
  var wavexOutput2Value = document.querySelector('select[name="wavexOutput2"]').value;
  var wavexOutput2SentenceValue = document.querySelector('select[name="wavexOutput2Sentence"]').value;
  var wavexOutput2UpdateIntervalValue = document.querySelector('input[name="wavexOutput2UpdateInterval"]').value;
  var wavexOutput2SettingsValue = document.querySelector('input[name="wavexOutput2Settings"]').value;
  var wavexOutput3Value = document.querySelector('select[name="wavexOutput3"]').value;
  var wavexOutput3SentenceValue = document.querySelector('select[name="wavexOutput3Sentence"]').value;
  var wavexOutput3UpdateIntervalValue = document.querySelector('input[name="wavexOutput3UpdateInterval"]').value;
  var wavexOutput3SettingsValue = document.querySelector('input[name="wavexOutput3Settings"]').value;
  var cloudEnabledValue = document.querySelector('select[name="cloudEnabled"]').value;
  var finalConfigValue = document.querySelector('select[name="finalConfig"]').value;
  var finalPowerCycleValue = document.querySelector('select[name="finalPowerCycle"]').value;
  var finalStartupValue = document.querySelector('select[name="finalStartup"]').value;
  var final20MinuteValue = document.querySelector('select[name="final20Minute"]').value;
  var finalDataOutputValue = document.querySelector('select[name="finalDataOutput"]').value;
  var backupWavexJsonValue = document.querySelector('select[name="backupWavexJson"]').value;
  var backupDF047Value = document.querySelector('select[name="backupDF047"]').value;
  var backupEM129Value = document.querySelector('select[name="backupEM129"]').value;
  var backupMiscValue = document.querySelector('select[name="backupMisc"]').value;
  var loginType1Value = document.querySelector('select[name="loginType1"]').value;
  var loginUsername1Value = document.querySelector('input[name="loginUsername1"]').value;
  var loginPassword1Value = document.querySelector('input[name="loginPassword1"]').value;
  var loginComments1Value = document.querySelector('input[name="loginComments1"]').value;
  var loginType2Value = document.querySelector('select[name="loginType2"]').value;
  var loginUsername2Value = document.querySelector('input[name="loginUsername2"]').value;
  var loginPassword2Value = document.querySelector('input[name="loginPassword2"]').value;
  var loginComments2Value = document.querySelector('input[name="loginComments2"]').value;
  var loginType3Value = document.querySelector('select[name="loginType3"]').value;
  var loginUsername3Value = document.querySelector('input[name="loginUsername3"]').value;
  var loginPassword3Value = document.querySelector('input[name="loginPassword3"]').value;
  var loginComments3Value = document.querySelector('input[name="loginComments3"]').value;
  var workStatusValue = document.querySelector('select[name="workStatus"]').value;
  var subscriptionStatusValue = document.querySelector('select[name="subscriptionStatus"]').value;
  var subscriptionExpiryValue = document.querySelector('input[name="subscriptionExpiry"]').value;
  var generalCommentsValue = document.querySelector('textarea[name="generalComments"]').value;


  // Check if workTypeValue is "-"
  if (workStatusValue === "-") {
    alert('Please select a valid work status before downloading.');
    return;
  }
  // Create the JSON object
  var data = {
    site: siteValue,
    system: systemValue,
    workType: workTypeValue,
    workStatus: workStatusValue,
    subscriptionStatus: subscriptionStatusValue,
    subscriptionExpiry: subscriptionExpiryValue,
    generalComments: generalCommentsValue,
    siteType: siteTypeValue,
    customer: customerValue,
    date: dateValue,
    imo: imoValue,
    location: locationValue,
    engineer: engineerValue,
    engineer2: engineer2Value,


    recordEquipment: {
      recordEquipment1: recordEquipment1Value,
      equipmentManufact1: equipmentManufact1Value,
      equipmentModel1: equipmentModel1Value,
      equipmentPartNo1: equipmentPartNo1Value,
      equipmentSerialNo1: equipmentSerialNo1Value,
      equipmentLocation1: equipmentLocation1Value,
      recordEquipment2: recordEquipment2Value,
      equipmentManufact2: equipmentManufact2Value,
      equipmentModel2: equipmentModel2Value,
      equipmentPartNo2: equipmentPartNo2Value,
      equipmentSerialNo2: equipmentSerialNo2Value,
      equipmentLocation2: equipmentLocation2Value,
      recordEquipment3: recordEquipment3Value,
      equipmentManufact3: equipmentManufact3Value,
      equipmentModel3: equipmentModel3Value,
      equipmentPartNo3: equipmentPartNo3Value,
      equipmentSerialNo3: equipmentSerialNo3Value,
      equipmentLocation3: equipmentLocation3Value,
      recordEquipment4: recordEquipment4Value,
      equipmentManufact4: equipmentManufact4Value,
      equipmentModel4: equipmentModel4Value,
      equipmentPartNo4: equipmentPartNo4Value,
      equipmentSerialNo4: equipmentSerialNo4Value,
      equipmentLocation4: equipmentLocation4Value,
      recordEquipment5: recordEquipment5Value,
      equipmentManufact5: equipmentManufact5Value,
      equipmentModel5: equipmentModel5Value,
      equipmentPartNo5: equipmentPartNo5Value,
      equipmentSerialNo5: equipmentSerialNo5Value,
      equipmentLocation5: equipmentLocation5Value,
      recordEquipment6: recordEquipment6Value,
      equipmentManufact6: equipmentManufact6Value,
      equipmentModel6: equipmentModel6Value,
      equipmentPartNo6: equipmentPartNo6Value,
      equipmentSerialNo6: equipmentSerialNo6Value,
      equipmentLocation6: equipmentLocation6Value,
      recordEquipment7: recordEquipment7Value,
      equipmentManufact7: equipmentManufact7Value,
      equipmentModel7: equipmentModel7Value,
      equipmentPartNo7: equipmentPartNo7Value,
      equipmentSerialNo7: equipmentSerialNo7Value,
      equipmentLocation7: equipmentLocation7Value,
      recordEquipment8: recordEquipment8Value,
      equipmentManufact8: equipmentManufact8Value,
      equipmentModel8: equipmentModel8Value,
      equipmentPartNo8: equipmentPartNo8Value,
      equipmentSerialNo8: equipmentSerialNo8Value,
      equipmentLocation8: equipmentLocation8Value,
    },
    checkEquipment: {
      checkEquipment1: checkEquipment1Value,
      checkVisual1: checkVisual1Value,
      checkMech1: checkMech1Value,
      checkCabling1: checkCabling1Value,
      checkPower1: checkPower1Value,
      checkEarthing1: checkEarthing1Value,
      checkEquipment2: checkEquipment2Value,
      checkVisual2: checkVisual2Value,
      checkMech2: checkMech2Value,
      checkCabling2: checkCabling2Value,
      checkPower2: checkPower2Value,
      checkEarthing2: checkEarthing2Value,
      checkEquipment3: checkEquipment3Value,
      checkVisual3: checkVisual3Value,
      checkMech3: checkMech3Value,
      checkCabling3: checkCabling3Value,
      checkPower3: checkPower3Value,
      checkEarthing3: checkEarthing3Value,
      checkEquipment4: checkEquipment4Value,
      checkVisual4: checkVisual4Value,
      checkMech4: checkMech4Value,
      checkCabling4: checkCabling4Value,
      checkPower4: checkPower4Value,
      checkEarthing4: checkEarthing4Value,

      checkEquipment5: checkEquipment5Value,
      checkVisual5: checkVisual5Value,
      checkMech5: checkMech5Value,
      checkCabling5: checkCabling5Value,
      checkPower5: checkPower5Value,
      checkEarthing5: checkEarthing5Value,

      checkEquipment6: checkEquipment6Value,
      checkVisual6: checkVisual6Value,
      checkMech6: checkMech6Value,
      checkCabling6: checkCabling6Value,
      checkPower6: checkPower6Value,
      checkEarthing6: checkEarthing6Value,

      checkEquipment7: checkEquipment7Value,
      checkVisual7: checkVisual7Value,
      checkMech7: checkMech7Value,
      checkCabling7: checkCabling7Value,
      checkPower7: checkPower7Value,
      checkEarthing7: checkEarthing7Value,

      checkEquipment8: checkEquipment8Value,
      checkVisual8: checkVisual8Value,
      checkMech8: checkMech8Value,
      checkCabling8: checkCabling8Value,
      checkPower8: checkPower8Value,
      checkEarthing8: checkEarthing8Value,
      radarManufacturer: radarManufacturerValue,
      radarModel: radarModelValue,
      radarUse: radarUseValue,
      radarTxtime: radarTxtimeValue,
      radarLocation: radarLocationValue,
      radarSettings: radarSettingsValue,
      gpsCheck: gpsCheckValue,
      gyroCheck: gyroCheckValue,
      windCheck: windCheckValue,
      draughtCheck: draughtCheckValue,
      waveCheck: waveCheckValue,
      speedlogCheck: speedlogCheckValue,
      shaftCheck: shaftCheckValue,



      videoCableType: videoCableTypeValue,
      videoCableImpedance: videoCableImpedanceValue,
      videoCableComments: videoCableCommentsValue,
      syncCableType: syncCableTypeValue,
      syncCableImpedance: syncCableImpedanceValue,
      syncCableComments: syncCableCommentsValue,
      azimuthCableType: azimuthCableTypeValue,
      azimuthCableImpedance: azimuthCableImpedanceValue,
      azimuthCableComments: azimuthCableCommentsValue,
      headingCableType: headingCableTypeValue,
      headingCableImpedance: headingCableImpedanceValue,
      headingCableComments: headingCableCommentsValue,
      videoJumper: videoJumperValue,
      syncJumper: syncJumperValue,
      azimuthJumper: azimuthJumperValue,
      headingJumper: headingJumperValue,
      pullupJumper: pullupJumperValue,
      pulldownJumper: pulldownJumperValue,
      amplifierType: amplifierTypeValue,
      amplifierCheck: amplifierCheckValue,
      amplifierComments: amplifierCommentsValue,
      radarFirewallType: radarFirewallTypeValue,
      radarFirewallCheck: radarFirewallCheckValue,
      radarFirewallComments: radarFirewallCommentsValue,
      serialInterfaceType: serialInterfaceTypeValue,
      serialInterfaceCheck: serialInterfaceCheckValue,
      serialInterfaceComments: serialInterfaceCommentsValue,
    },
    network: {
      networkEquipment1: networkEquipment1Value,
      equipmentIpAddress1: equipmentIpAddress1Value,
      equipmentSubnetMask1: equipmentSubnetMask1Value,
      equipmentDefaultGateway1: equipmentDefaultGateway1Value,
      equipmentMac1: equipmentMac1Value,
      networkEquipment2: networkEquipment2Value,
      equipmentIpAddress2: equipmentIpAddress2Value,
      equipmentSubnetMask2: equipmentSubnetMask2Value,
      equipmentDefaultGateway2: equipmentDefaultGateway2Value,
      equipmentMac2: equipmentMac2Value,
      networkEquipment3: networkEquipment3Value,
      equipmentIpAddress3: equipmentIpAddress3Value,
      equipmentSubnetMask3: equipmentSubnetMask3Value,
      equipmentDefaultGateway3: equipmentDefaultGateway3Value,
      equipmentMac3: equipmentMac3Value,
      networkEquipment4: networkEquipment4Value,
      equipmentIpAddress4: equipmentIpAddress4Value,
      equipmentSubnetMask4: equipmentSubnetMask4Value,
      equipmentDefaultGateway4: equipmentDefaultGateway4Value,
      equipmentMac4: equipmentMac4Value,
      networkEquipment5: networkEquipment5Value,
      equipmentIpAddress5: equipmentIpAddress5Value,
      equipmentSubnetMask5: equipmentSubnetMask5Value,
      equipmentDefaultGateway5: equipmentDefaultGateway5Value,
      equipmentMac5: equipmentMac5Value,
      networkEquipment6: networkEquipment6Value,
      equipmentIpAddress6: equipmentIpAddress6Value,
      equipmentSubnetMask6: equipmentSubnetMask6Value,
      equipmentDefaultGateway6: equipmentDefaultGateway6Value,
      equipmentMac6: equipmentMac6Value,
      networkEquipment7: networkEquipment7Value,
      equipmentIpAddress7: equipmentIpAddress7Value,
      equipmentSubnetMask7: equipmentSubnetMask7Value,
      equipmentDefaultGateway7: equipmentDefaultGateway7Value,
      equipmentMac7: equipmentMac7Value,
      networkEquipment8: networkEquipment8Value,
      equipmentIpAddress8: equipmentIpAddress8Value,
      equipmentSubnetMask8: equipmentSubnetMask8Value,
      equipmentDefaultGateway8: equipmentDefaultGateway8Value,
      equipmentMac8: equipmentMac8Value,
      networkDns: networkDnsValue,
      networkComments: networkCommentsValue,
      cloudHost1: cloudHost1Value,
      cloudHost2: cloudHost2Value,
    },
    startup: {
      computerStartup: computerStartupValue,
      systemRequirements: systemRequirementsValue,
      windowsVersion: windowsVersionValue,
      wavexStartup: wavexStartupValue,
      wavexOptions: wavexOptionsValue,
      thirdPartyStartup: thirdPartyStartupValue,
      storageSpace: storageSpaceValue,
      remoteAccessTools: remoteAccessToolsValue,
      serialMouseFix: serialMouseFixValue,
      networkInterfaceConfig: networkInterfaceConfigValue,
      windowsFirewall: windowsFirewallValue,
      antiVirus: antiVirusValue,
      gpsCheck2: gpsCheck2Value,
      gyroCheck2: gyroCheck2Value,
      windCheck2: windCheck2Value,
      draughtCheck2: draughtCheck2Value,
      waveCheck2: waveCheck2Value,
      shaftCheck2: shaftCheck2Value,
    },
    configuration: {
      em129Version: em129VersionValue,
      em129Settings: em129SettingsValue,
      em129SignalStatus: em129SignalStatusValue,
      em129NetworkSettings: em129NetworkSettingsValue,
      em129InterfaceConfig: em129InterfaceConfigValue,
      em129Scope: em129ScopeValue,
      em129Comments: em129CommentsValue,
      wavexDescription: wavexDescriptionValue,
      wavexMovement: wavexMovementValue,
      wavexLat: wavexLatValue,
      wavexLong: wavexLongValue,
      wavexHeading: wavexHeadingValue,
      wavexRadar: wavexRadarValue,
      wavexMulticast: wavexMulticastValue,
      wavexTransceiver: wavexTransceiverValue,
      wavexRinId: wavexRinIdValue,
      wavexRinNetwork: wavexRinNetworkValue,
      wavexImageStorage: wavexImageStorageValue,
      wavexGPS: wavexGPSValue,
      wavexGPSPositionSentence: wavexGPSPositionSentenceValue,
      wavexGPSTrackSpeedSentence: wavexGPSTrackSpeedSentenceValue,
      wavexGPSTimeSentence: wavexGPSTimeSentenceValue,
      wavexGPSSettings: wavexGPSSettingsValue,
      wavexGyro: wavexGyroValue,
      wavexGyroSentence: wavexGyroSentenceValue,
      wavexGyroSettings: wavexGyroSettingsValue,
      wavexWind: wavexWindValue,
      wavexWindSentence: wavexWindSentenceValue,
      wavexWindSettings: wavexWindSettingsValue,
      wavexWave: wavexWaveValue,
      wavexWaveSentence: wavexWaveSentenceValue,
      wavexWaveSettings: wavexWaveSettingsValue,
      wavexDraught: wavexDraughtValue,
      wavexDraughtSentence: wavexDraughtSentenceValue,
      wavexDraughtSettings: wavexDraughtSettingsValue,
      wavexSpeedlog: wavexSpeedlogValue,
      wavexSpeedlogSentence: wavexSpeedlogSentenceValue,
      wavexSpeedlogSettings: wavexSpeedlogSettingsValue,
      wavexShaft: wavexShaftValue,
      wavexShaftSentence: wavexShaftSentenceValue,
      wavexShaftSettings: wavexShaftSettingsValue,




      wavexGeometryRadarX: wavexGeometryRadarXValue,
      wavexGeometryRadarY: wavexGeometryRadarYValue,
      wavexGeometryRadarZ: wavexGeometryRadarZValue,
      wavexGeometryGPSX: wavexGeometryGPSXValue,
      wavexGeometryGPSY: wavexGeometryGPSYValue,
      wavexGeometryWindHeadingOffset: wavexGeometryWindHeadingOffsetValue,
      wavexGeometryWindZ: wavexGeometryWindZValue,
      wavexRadarRangeOffset: wavexRadarRangeOffsetValue,
      wavexRadarAzimuthOffset: wavexRadarAzimuthOffsetValue,
      wavexRadarStartAngle: wavexRadarStartAngleValue,
      wavexRadarSectorSize: wavexRadarSectorSizeValue,
      wavexRadarStartRange: wavexRadarStartRangeValue,
      wavexRadarStopRange: wavexRadarStopRangeValue,
      wavexRadarImageCheck: wavexRadarImageCheckValue,
      wavexAdvancedWaveAntennaMeanHeight: wavexAdvancedWaveAntennaMeanHeightValue,
      wavexAdvancedWaveCartesianSections: wavexAdvancedWaveCartesianSectionsValue,
      wavexAdvancedCurrentAntennaMeanHeight: wavexAdvancedCurrentAntennaMeanHeightValue,
      wavexAdvancedCurrentCartesianSections: wavexAdvancedCurrentCartesianSectionsValue,
      wavexOutput1: wavexOutput1Value,
      wavexOutput1Sentence: wavexOutput1SentenceValue,
      wavexOutput1UpdateInterval: wavexOutput1UpdateIntervalValue,
      wavexOutput1Settings: wavexOutput1SettingsValue,
      wavexOutput2: wavexOutput2Value,
      wavexOutput2Sentence: wavexOutput2SentenceValue,
      wavexOutput2UpdateInterval: wavexOutput2UpdateIntervalValue,
      wavexOutput2Settings: wavexOutput2SettingsValue,
      wavexOutput3: wavexOutput3Value,
      wavexOutput3Sentence: wavexOutput3SentenceValue,
      wavexOutput3UpdateInterval: wavexOutput3UpdateIntervalValue,
      wavexOutput3Settings: wavexOutput3SettingsValue,
      cloudEnabled: cloudEnabledValue,
      finalConfig: finalConfigValue,
    },
    finalStartup: {
      finalPowerCycle: finalPowerCycleValue,
      finalStartup: finalStartupValue,
      final20Minute: final20MinuteValue,
      finalDataOutput: finalDataOutputValue,
    },
    backup: {
      backupWavexJson: backupWavexJsonValue,
      backupDF047: backupDF047Value,
      backupEM129: backupEM129Value,
      backupMisc: backupMiscValue,
    },
    loginDetails: {
      loginType1: loginType1Value,
      loginUsername1: loginUsername1Value,
      loginPassword1: loginPassword1Value,
      loginComments1: loginComments1Value,
      loginType2: loginType2Value,
      loginUsername2: loginUsername2Value,
      loginPassword2: loginPassword2Value,
      loginComments2: loginComments2Value,
      loginType3: loginType3Value,
      loginUsername3: loginUsername3Value,
      loginPassword3: loginPassword3Value,
      loginComments3: loginComments3Value,
    },
  }

  // Convert the data to JSON string
  var jsonData = JSON.stringify(data, null, 2);

  // Create the filename using the form element values
  var filename = systemValue + "_" + siteValue + "_" + customerValue + "_" + "_" + workTypeValue + "_" + workStatusValue + '.json';

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

  // Check if the file is a JSON file
  if (file.type === 'application/json') {
    const reader = new FileReader();

    reader.onload = function (e) {
      // Parse the JSON and use the data
      const data = JSON.parse(e.target.result);
      fillFormFromJson(data);
    };

    // Read the file as text
    reader.readAsText(file);
  } else {
    // Optionally, inform the user that the file is not a JSON file
    alert("Please select a JSON file.");
  }
}


function fillFormFromJson(data) {
  console.log(data); // Log the data for debugging
  const form = document.getElementById('myForm');

  // Function to trigger a change event
  function triggerChangeEvent(element) {
    let event = new Event('change', {
      bubbles: true,
      cancelable: true,
    });
    element.dispatchEvent(event);
  }

  // Handle top-level properties
  Object.keys(data).forEach(key => {
    if (typeof data[key] !== 'object') {
      if (form.elements[key]) {
        form.elements[key].value = data[key];
        // Trigger change event after setting value
        triggerChangeEvent(form.elements[key]);
      }
    } else {
      // Handle nested objects like 'recordEquipment'
      Object.keys(data[key]).forEach(nestedKey => {
        // Here, we assume the form element's name matches the nested key directly
        if (form.elements[nestedKey]) {
          form.elements[nestedKey].value = data[key][nestedKey];
          // Trigger change event after setting value
          triggerChangeEvent(form.elements[nestedKey]);
        }
      });
    }
  });
}

function openFullReportWavex() {
  const formData = JSON.parse(localStorage.getItem('formData'));
  var workStatusValue = document.querySelector('select[name="workStatus"]').value;

  if (workStatusValue === 'Complete') {
    alert('Please ensure the site is set to "Commissioned" in the Miros Cloud administration area.');
  }

  if (workStatusValue !== 'Complete' && workStatusValue !== 'In Progress' && workStatusValue !== 'Needs Attention') {
    alert('Check the work status. It is not possible to generate a report or certificate at this stage.');
    return;
  }

  const selectedElements = {
    system: formData.system,
    workType: formData.workType,
    site: formData.site,
    siteType: formData.siteType,
    customer: formData.customer,
    date: formData.date,
    imo: formData.imo,
    location: formData.location,
    engineer: formData.engineer,
    engineer2: formData.engineer2,
    recordEquipment1: formData.recordEquipment1,
    equipmentManufact1: formData.equipmentManufact1,
    equipmentModel1: formData.equipmentModel1,
    equipmentPartNo1: formData.equipmentPartNo1,
    equipmentSerialNo1: formData.equipmentSerialNo1,
    equipmentLocation1: formData.equipmentLocation1,
    recordEquipment2: formData.recordEquipment2,
    equipmentManufact2: formData.equipmentManufact2,
    equipmentModel2: formData.equipmentModel2,
    equipmentPartNo2: formData.equipmentPartNo2,
    equipmentSerialNo2: formData.equipmentSerialNo2,
    equipmentLocation2: formData.equipmentLocation2,
    recordEquipment3: formData.recordEquipment3,
    equipmentManufact3: formData.equipmentManufact3,
    equipmentModel3: formData.equipmentModel3,
    equipmentPartNo3: formData.equipmentPartNo3,
    equipmentSerialNo3: formData.equipmentSerialNo3,
    equipmentLocation3: formData.equipmentLocation3,
    recordEquipment4: formData.recordEquipment4,
    equipmentManufact4: formData.equipmentManufact4,
    equipmentModel4: formData.equipmentModel4,
    equipmentPartNo4: formData.equipmentPartNo4,
    equipmentSerialNo4: formData.equipmentSerialNo4,
    equipmentLocation4: formData.equipmentLocation4,
    recordEquipment5: formData.recordEquipment5,
    equipmentManufact5: formData.equipmentManufact5,
    equipmentModel5: formData.equipmentModel5,
    equipmentPartNo5: formData.equipmentPartNo5,
    equipmentSerialNo5: formData.equipmentSerialNo5,
    equipmentLocation5: formData.equipmentLocation5,
    recordEquipment6: formData.recordEquipment6,
    equipmentManufact6: formData.equipmentManufact6,
    equipmentModel6: formData.equipmentModel6,
    equipmentPartNo6: formData.equipmentPartNo6,
    equipmentSerialNo6: formData.equipmentSerialNo6,
    equipmentLocation6: formData.equipmentLocation6,
    recordEquipment7: formData.recordEquipment7,
    equipmentManufact7: formData.equipmentManufact7,
    equipmentModel7: formData.equipmentModel7,
    equipmentPartNo7: formData.equipmentPartNo7,
    equipmentSerialNo7: formData.equipmentSerialNo7,
    equipmentLocation7: formData.equipmentLocation7,
    recordEquipment8: formData.recordEquipment8,
    equipmentManufact8: formData.equipmentManufact8,
    equipmentModel8: formData.equipmentModel8,
    equipmentPart8: formData.equipmentPart8,
    equipmentSerial8: formData.equipmentSerial8,
    equipmentLocation8: formData.equipmentLocation8,
    checkEquipment1: formData.checkEquipment1,
    checkVisual1: formData.checkVisual1,
    checkMech1: formData.checkMech1,
    checkCabling1: formData.checkCabling1,
    checkPower1: formData.checkPower1,
    checkEarthing1: formData.checkEarthing1,
    checkEquipment2: formData.checkEquipment2,
    checkVisual2: formData.checkVisual2,
    checkMech2: formData.checkMech2,
    checkCabling2: formData.checkCabling2,
    checkPower2: formData.checkPower2,
    checkEarthing2: formData.checkEarthing2,
    checkEquipment3: formData.checkEquipment3,
    checkVisual3: formData.checkVisual3,
    checkMech3: formData.checkMech3,
    checkCabling3: formData.checkCabling3,
    checkPower3: formData.checkPower3,
    checkEarthing3: formData.checkEarthing3,
    checkEquipment4: formData.checkEquipment4,
    checkVisual4: formData.checkVisual4,
    checkMech4: formData.checkMech4,
    checkCabling4: formData.checkCabling4,
    checkPower4: formData.checkPower4,
    checkEarthing4: formData.checkEarthing4,

    checkEquipment5: formData.checkEquipment5,
    checkVisual5: formData.checkVisual5,
    checkMech5: formData.checkMech5,
    checkCabling5: formData.checkCabling5,
    checkPower5: formData.checkPower5,
    checkEarthing5: formData.checkEarthing5,

    checkEquipment6: formData.checkEquipment6,
    checkVisual6: formData.checkVisual6,
    checkMech6: formData.checkMech6,
    checkCabling6: formData.checkCabling6,
    checkPower6: formData.checkPower6,
    checkEarthing6: formData.checkEarthing6,

    checkEquipment7: formData.checkEquipment7,
    checkVisual7: formData.checkVisual7,
    checkMech7: formData.checkMech7,
    checkCabling7: formData.checkCabling7,
    checkPower7: formData.checkPower7,
    checkEarthing7: formData.checkEarthing7,

    checkEquipment8: formData.checkEquipment8,
    checkVisual8: formData.checkVisual8,
    checkMech8: formData.checkMech8,
    checkCabling8: formData.checkCabling8,
    checkPower8: formData.checkPower8,
    checkEarthing8: formData.checkEarthing8,

    radarManufacturer: formData.radarManufacturer,
    radarModel: formData.radarModel,
    radarUse: formData.radarUse,
    radarTxtime: formData.radarTxtime,
    radarLocation: formData.radarLocation,
    radarSettings: formData.radarSettings,
    gpsCheck: formData.gpsCheck,
    gyroCheck: formData.gyroCheck,
    windCheck: formData.windCheck,
    draughtCheck: formData.draughtCheck,
    waveCheck: formData.waveCheck,
    speedlogCheck: formData.speedlogCheck,


    videoCableType: formData.videoCableType,
    videoCableImpedance: formData.videoCableImpedance,
    videoCableComments: formData.videoCableComments,
    syncCableType: formData.syncCableType,
    syncCableImpedance: formData.syncCableImpedance,
    syncCableComments: formData.syncCableComments,
    azimuthCableType: formData.azimuthCableType,
    azimuthCableImpedance: formData.azimuthCableImpedance,
    azimuthCableComments: formData.azimuthCableComments,
    headingCableType: formData.headingCableType,
    headingCableImpedance: formData.headingCableImpedance,
    headingCableComments: formData.headingCableComments,
    videoJumper: formData.videoJumper,
    syncJumper: formData.syncJumper,
    azimuthJumper: formData.azimuthJumper,
    headingJumper: formData.headingJumper,
    pullupJumper: formData.pullupJumper,
    pulldownJumper: formData.pulldownJumper,
    amplifierType: formData.amplifierType,
    amplifierCheck: formData.amplifierCheck,
    amplifierComments: formData.amplifierComments,
    radarFirewallType: formData.radarFirewallType,
    radarFirewallCheck: formData.radarFirewallCheck,
    radarFirewallComments: formData.radarFirewallComments,
    serialInterfaceType: formData.serialInterfaceType,
    serialInterfaceCheck: formData.serialInterfaceCheck,
    serialInterfaceComments: formData.serialInterfaceComments,
    networkEquipment1: formData.networkEquipment1,
    equipmentIpAddress1: formData.equipmentIpAddress1,
    equipmentSubnetMask1: formData.equipmentSubnetMask1,
    equipmentDefaultGateway1: formData.equipmentDefaultGateway1,
    equipmentMac1: formData.equipmentMac1,
    networkEquipment2: formData.networkEquipment2,
    equipmentIpAddress2: formData.equipmentIpAddress2,
    equipmentSubnetMask2: formData.equipmentSubnetMask2,
    equipmentDefaultGateway2: formData.equipmentDefaultGateway2,
    equipmentMac2: formData.equipmentMac2,
    networkEquipment3: formData.networkEquipment3,
    equipmentIpAddress3: formData.equipmentIpAddress3,
    equipmentSubnetMask3: formData.equipmentSubnetMask3,
    equipmentDefaultGateway3: formData.equipmentDefaultGateway3,
    equipmentMac3: formData.equipmentMac3,
    networkEquipment4: formData.networkEquipment4,
    equipmentIpAddress4: formData.equipmentIpAddress4,
    equipmentSubnetMask4: formData.equipmentSubnetMask4,
    equipmentDefaultGateway4: formData.equipmentDefaultGateway4,
    equipmentMac4: formData.equipmentMac4,
    networkEquipment5: formData.networkEquipment5,
    equipmentIpAddress5: formData.equipmentIpAddress5,
    equipmentSubnetMask5: formData.equipmentSubnetMask5,
    equipmentDefaultGateway5: formData.equipmentDefaultGateway5,
    equipmentMac5: formData.equipmentMac5,
    networkEquipment6: formData.networkEquipment6,
    equipmentIpAddress6: formData.equipmentIpAddress6,
    equipmentSubnetMask6: formData.equipmentSubnetMask6,
    equipmentDefaultGateway6: formData.equipmentDefaultGateway6,
    equipmentMac6: formData.equipmentMac6,
    networkEquipment7: formData.networkEquipment7,
    equipmentIpAddress7: formData.equipmentIpAddress7,
    equipmentSubnetMask7: formData.equipmentSubnetMask7,
    equipmentDefaultGateway7: formData.equipmentDefaultGateway7,
    equipmentMac7: formData.equipmentMac7,
    networkEquipment8: formData.networkEquipment8,
    equipmentIpAddress8: formData.equipmentIpAddress8,
    equipmentSubnetMask8: formData.equipmentSubnetMask8,
    equipmentDefaultGateway8: formData.equipmentDefaultGateway8,
    equipmentMac8: formData.equipmentMac8,
    networkDns: formData.networkDns,
    networkComments: formData.networkComments,
    cloudHost1: formData.cloudHost1,
    cloudHost2: formData.cloudHost2,
    computerStartup: formData.computerStartup,
    systemRequirements: formData.systemRequirements,
    windowsVersion: formData.windowsVersion,
    wavexStartup: formData.wavexStartup,
    wavexOptions: formData.wavexOptions,
    thirdPartyStartup: formData.thirdPartyStartup,
    storageSpace: formData.storageSpace,
    remoteAccessTools: formData.remoteAccessTools,
    serialMouseFix: formData.serialMouseFix,
    networkInterfaceConfig: formData.networkInterfaceConfig,
    windowsFirewall: formData.windowsFirewall,
    antiVirus: formData.antiVirus,
    gpsCheck2: formData.gpsCheck2,
    gyroCheck2: formData.gyroCheck2,
    windCheck2: formData.windCheck2,
    draughtCheck2: formData.draughtCheck2,
    waveCheck2: formData.waveCheck2,
    shaftCheck2: formData.shaftCheck2,
    em129Version: formData.em129Version,
    em129Settings: formData.em129Settings,
    em129SignalStatus: formData.em129SignalStatus,
    em129NetworkSettings: formData.em129NetworkSettings,
    em129InterfaceConfig: formData.em129InterfaceConfig,
    em129Scope: formData.em129Scope,
    em129Comments: formData.em129Comments,
    wavexDescription: formData.wavexDescription,
    wavexMovement: formData.wavexMovement,
    wavexLat: formData.wavexLat,
    wavexLong: formData.wavexLong,
    wavexHeading: formData.wavexHeading,
    wavexRadar: formData.wavexRadar,
    wavexMulticast: formData.wavexMulticast,
    wavexTransceiver: formData.wavexTransceiver,
    wavexRinId: formData.wavexRinId,
    wavexRinNetwork: formData.wavexRinNetwork,
    wavexImageStorage: formData.wavexImageStorage,
    wavexGPS: formData.wavexGPS,
    wavexGPSPositionSentence: formData.wavexGPSPositionSentence,
    wavexGPSTrackSpeedSentence: formData.wavexGPSTrackSpeedSentence,
    wavexGPSTimeSentence: formData.wavexGPSTimeSentence,
    wavexGPSSettings: formData.wavexGPSSettings,
    wavexGyro: formData.wavexGyro,
    wavexGyroSentence: formData.wavexGyroSentence,
    wavexGyroSettings: formData.wavexGyroSettings,
    wavexWind: formData.wavexWind,
    wavexWindSentence: formData.wavexWindSentence,
    wavexWindSettings: formData.wavexWindSettings,
    wavexWave: formData.wavexWave,
    wavexWaveSentence: formData.wavexWaveSentence,
    wavexWaveSettings: formData.wavexWaveSettings,
    wavexDraught: formData.wavexDraught,
    wavexDraughtSentence: formData.wavexDraughtSentence,
    wavexDraughtSettings: formData.wavexDraughtSettings,
    wavexSpeedlog: formData.wavexSpeedlog,
    wavexSpeedlogSentence: formData.wavexSpeedlogSentence,
    wavexSpeedlogSettings: formData.wavexSpeedlogSettings,

    wavexGeometryRadarX: formData.wavexGeometryRadarX,
    wavexGeometryRadarY: formData.wavexGeometryRadarY,
    wavexGeometryRadarZ: formData.wavexGeometryRadarZ,
    wavexGeometryGPSX: formData.wavexGeometryGPSX,
    wavexGeometryGPSY: formData.wavexGeometryGPSY,
    wavexGeometryWindHeadingOffset: formData.wavexGeometryWindHeadingOffset,
    wavexGeometryWindZ: formData.wavexGeometryWindZ,
    wavexRadarRangeOffset: formData.wavexRadarRangeOffset,
    wavexRadarAzimuthOffset: formData.wavexRadarAzimuthOffset,
    wavexRadarStartAngle: formData.wavexRadarStartAngle,
    wavexRadarSectorSize: formData.wavexRadarSectorSize,
    wavexRadarStartRange: formData.wavexRadarStartRange,
    wavexRadarStopRange: formData.wavexRadarStopRange,
    wavexRadarImageCheck: formData.wavexRadarImageCheck,
    wavexAdvancedWaveAntennaMeanHeight: formData.wavexAdvancedWaveAntennaMeanHeight,
    wavexAdvancedWaveCartesianSections: formData.wavexAdvancedWaveCartesianSections,
    wavexAdvancedCurrentAntennaMeanHeight: formData.wavexAdvancedCurrentAntennaMeanHeight,
    wavexAdvancedCurrentCartesianSections: formData.wavexAdvancedCurrentCartesianSections,
    wavexOutput1: formData.wavexOutput1,
    wavexOutput1Sentence: formData.wavexOutput1Sentence,
    wavexOutput1UpdateInterval: formData.wavexOutput1UpdateInterval,
    wavexOutput1Settings: formData.wavexOutput1Settings,
    wavexOutput2: formData.wavexOutput2,
    wavexOutput2Sentence: formData.wavexOutput2Sentence,
    wavexOutput2UpdateInterval: formData.wavexOutput2UpdateInterval,
    wavexOutput2Settings: formData.wavexOutput2Settings,
    wavexOutput3: formData.wavexOutput3,
    wavexOutput3Sentence: formData.wavexOutput3Sentence,
    wavexOutput3UpdateInterval: formData.wavexOutput3UpdateInterval,
    wavexOutput3Settings: formData.wavexOutput3Settings,
    cloudEnabled: formData.cloudEnabled,
    finalConfig: formData.finalConfig,
    finalPowerCycle: formData.finalPowerCycle,
    finalStartup: formData.finalStartup,
    final20Minute: formData.final20Minute,
    finalDataOutput: formData.finalDataOutput,
    backupWavexJson: formData.backupWavexJson,
    backupDF047: formData.backupDF047,
    backupEM129: formData.backupEM129,
    backupMisc: formData.backupMisc,
    loginType1: formData.loginType1,
    loginUsername1: formData.loginUsername1,
    loginPassword1: formData.loginPassword1,
    loginComments1: formData.loginComments1,
    loginType2: formData.loginType2,
    loginUsername2: formData.loginUsername2,
    loginPassword2: formData.loginPassword2,
    loginComments2: formData.loginComments2,
    loginType3: formData.loginType3,
    loginUsername2: formData.loginUsername3,
    loginPassword3: formData.loginPassword3,
    loginComments3: formData.loginComments3,
    workStatus: formData.workStatus,
    subscriptionStatus: formData.subscriptionStatus,
    subscriptionExpiry: formData.subscriptionExpiry,
    generalComments: formData.generalComments
  };

  // Retrieve uploaded images
  const uploadedImages = document.querySelectorAll('.uploaded-images img');
  const imageUrls = Array.from(uploadedImages).map(img => img.src);


  const html = `
  <!DOCTYPE html>
  <html>
  <head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Miros Site Report</title>
  <link rel="stylesheet" type="text/css" href="style_report.css">
</head>  
<body>

<div class="header">
  <div class="text-container">
  <img src="https://miros.app/miros-logo-two-tone-light.631848d3e1f5088e7f228ac7b63d6dbc.svg" style="width: 200px; padding-bottom: 10px;">
  <div class="info"><span class="label">System:</span> <span class="value">${selectedElements.system}</span></div>
    <div class="info"><span class="label">Site:</span> <span class="value">${selectedElements.site}</span></div>
    <div class="info"><span class="label">Customer:</span> <span class="value">${selectedElements.customer}</span></div>
    <div class="info"><span class="label">Date:</span> <span class="value">${selectedElements.date}</span></div>
    <div class="info"><span class="label">Work Type:</span> <span class="value">${selectedElements.workType}</span></div>
    <div class="info"><span class="label">Work Status:</span> <span class="value">${selectedElements.workStatus}</span></div>
    <div class="info"><span class="label">Subscription Expiry:</span> <span class="value">${selectedElements.subscriptionStatus}   ${selectedElements.subscriptionExpiry}</span></div>
</div>
<!-- Large image to the right -->
<EDITimg src="header.jpeg" alt="Large Image Description" class="large-image">
</div>


<div class="container">
  <h2>Site Report</h2>
  <h3>1. Overview</h3>
  <p style="max-width: 750px;">${selectedElements.generalComments}</p>

  <table class="info-table">
  <!-- System -->
  <tr>
    <td class="label">System:</td>
    <td>${selectedElements.system}</td>
  </tr>
  <!-- Site Type -->
  <tr>
    <td class="label">Site Type:</td>
    <td>${selectedElements.siteType}</td>
  </tr>
  <!-- IMO -->
  <tr>
    <td class="label">IMO:</td>
    <td>${selectedElements.imo}</td>
  </tr>
  <!-- Work Type -->
  <tr>
    <td class="label">Work Type:</td>
    <td>${selectedElements.workType}</td>
  </tr>
  <!-- Customer -->
  <tr>
    <td class="label">Customer:</td>
    <td>${selectedElements.customer}</td>
  </tr>
  <!-- Location -->
  <tr>
    <td class="label">Location:</td>
    <td>${selectedElements.location}</td>
  </tr>
  <!-- Site -->
  <tr>
    <td class="label">Site:</td>
    <td>${selectedElements.site}</td>
  </tr>
  <!-- Date -->
  <tr>
    <td class="label">Date:</td>
    <td>${selectedElements.date}</td>
  </tr>
  <!-- Engineer -->
  <tr>
    <td class="label">Engineer(s):</td>
    <td>${selectedElements.engineer}</td>
  </tr>
  <tr>
  <td class="label"></td>
  ${selectedElements.engineer2 ? `<td>${selectedElements.engineer2}</td>` : ''}
  </tr>

</table>




<h3>2. Record Equipment</h3>
<table>
  <thead>
    <tr>
      <th class="table-cell table-header">Equipment</th>
      <th class="table-cell table-header">Manufacturer</th>
      <th class="table-cell table-header">Model</th>
      <th class="table-cell table-header">Part No</th>
      <th class="table-cell table-header">Serial No.</th>
      <th class="table-cell table-header">Location</th>
    </tr>
  </thead>
  <tbody>
    <!-- Equipment row 1 -->
    <tr>
    <td class="table-cell">${selectedElements.recordEquipment1 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentManufact1 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentModel1 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentPartNo1 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentSerialNo1 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentLocation1 || ''}</td>
  </tr>
  <tr>
    <td class="table-cell">${selectedElements.recordEquipment2 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentManufact2 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentModel2 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentPartNo2 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentSerialNo2 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentLocation2 || ''}</td>
  </tr>
  <tr>
    <td class="table-cell">${selectedElements.recordEquipment3 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentManufact3 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentModel3 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentPartNo3 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentSerialNo3 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentLocation3 || ''}</td>
  </tr>
  <tr>
    <td class="table-cell">${selectedElements.recordEquipment4 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentManufact4 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentModel4 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentPartNo4 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentSerialNo4 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentLocation4 || ''}</td>
  </tr>
  <tr>
    <td class="table-cell">${selectedElements.recordEquipment5 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentManufact5 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentModel5 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentPartNo5 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentSerialNo5 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentLocation5 || ''}</td>
  </tr>
  <tr>
    <td class="table-cell">${selectedElements.recordEquipment6 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentManufact6 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentModel6 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentPartNo6 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentSerialNo6 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentLocation6 || ''}</td>
  </tr>
  <tr>
    <td class="table-cell">${selectedElements.recordEquipment7 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentManufact7 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentModel7 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentPartNo7 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentSerialNo7 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentLocation7 || ''}</td>
  </tr>
  <tr>
    <td class="table-cell">${selectedElements.recordEquipment8 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentManufact8 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentModel8 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentPartNo8 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentSerialNo8 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentLocation8 || ''}</td>
  </tr>
    </tbody>
</table>
<div class="line_sub"></div>


<h3>3. Check Equipment</h3>
<h4>3.1 Equipment</h4>
<table>

<thead>
<tr>
  <th class="table-cell table-header">Equipment</th>
  <th class="table-cell table-header">Visual</th>
  <th class="table-cell table-header">Mechanical</th>
  <th class="table-cell table-header">Cabling</th>
  <th class="table-cell table-header">Power</th>
  <th class="table-cell table-header">Earthing</th>
</tr>
</thead>

<tbody>
<tr>
  <td class="table-cell">${selectedElements.checkEquipment1 || ''}</td>
  <td class="table-cell">${selectedElements.checkVisual1 || ''}</td>
  <td class="table-cell">${selectedElements.checkMech1 || ''}</td>
  <td class="table-cell">${selectedElements.checkCabling1 || ''}</td>
  <td class="table-cell">${selectedElements.checkPower1 || ''}</td>
  <td class="table-cell">${selectedElements.checkEarthing1 || ''}</td>
</tr>
<tr>
  <td class="table-cell">${selectedElements.checkEquipment2 || ''}</td>
  <td class="table-cell">${selectedElements.checkVisual2 || ''}</td>
  <td class="table-cell">${selectedElements.checkMech2 || ''}</td>
  <td class="table-cell">${selectedElements.checkCabling2 || ''}</td>
  <td class="table-cell">${selectedElements.checkPower2 || ''}</td>
  <td class="table-cell">${selectedElements.checkEarthing2 || ''}</td>
</tr>
<tr>
  <td class="table-cell">${selectedElements.checkEquipment3 || ''}</td>
  <td class="table-cell">${selectedElements.checkVisual3 || ''}</td>
  <td class="table-cell">${selectedElements.checkMech3 || ''}</td>
  <td class="table-cell">${selectedElements.checkCabling3 || ''}</td>
  <td class="table-cell">${selectedElements.checkPower3 || ''}</td>
  <td class="table-cell">${selectedElements.checkEarthing3 || ''}</td>
</tr>
<tr>
  <td class="table-cell">${selectedElements.checkEquipment4 || ''}</td>
  <td class="table-cell">${selectedElements.checkVisual4 || ''}</td>
  <td class="table-cell">${selectedElements.checkMech4 || ''}</td>
  <td class="table-cell">${selectedElements.checkCabling4 || ''}</td>
  <td class="table-cell">${selectedElements.checkPower4 || ''}</td>
  <td class="table-cell">${selectedElements.checkEarthing4 || ''}</td>
</tr>
<tr>
  <td class="table-cell">${selectedElements.checkEquipment5 || ''}</td>
  <td class="table-cell">${selectedElements.checkVisual5 || ''}</td>
  <td class="table-cell">${selectedElements.checkMech5 || ''}</td>
  <td class="table-cell">${selectedElements.checkCabling5 || ''}</td>
  <td class="table-cell">${selectedElements.checkPower5 || ''}</td>
  <td class="table-cell">${selectedElements.checkEarthing5 || ''}</td>
</tr>
<tr>
  <td class="table-cell">${selectedElements.checkEquipment6 || ''}</td>
  <td class="table-cell">${selectedElements.checkVisual6 || ''}</td>
  <td class="table-cell">${selectedElements.checkMech6 || ''}</td>
  <td class="table-cell">${selectedElements.checkCabling6 || ''}</td>
  <td class="table-cell">${selectedElements.checkPower6 || ''}</td>
  <td class="table-cell">${selectedElements.checkEarthing6 || ''}</td>
</tr>
<tr>
  <td class="table-cell">${selectedElements.checkEquipment7 || ''}</td>
  <td class="table-cell">${selectedElements.checkVisual7 || ''}</td>
  <td class="table-cell">${selectedElements.checkMech7 || ''}</td>
  <td class="table-cell">${selectedElements.checkCabling7 || ''}</td>
  <td class="table-cell">${selectedElements.checkPower7 || ''}</td>
  <td class="table-cell">${selectedElements.checkEarthing7 || ''}</td>
</tr>
<tr>
  <td class="table-cell">${selectedElements.checkEquipment8 || ''}</td>
  <td class="table-cell">${selectedElements.checkVisual8 || ''}</td>
  <td class="table-cell">${selectedElements.checkMech8 || ''}</td>
  <td class="table-cell">${selectedElements.checkCabling8 || ''}</td>
  <td class="table-cell">${selectedElements.checkPower8 || ''}</td>
  <td class="table-cell">${selectedElements.checkEarthing8 || ''}</td>
</tr>
</tbody>
</table>
<h4>3.2 Equipment Specific Checks</h4>

  <h4>Radar</h4>
  <table>
  <tr>
  <td class="table-cell"><span class="emphasis">Radar Manufacturer:</span> ${selectedElements.radarManufacturer}</td>
  <td style="padding-right: 20px;"><strong>Radar Model:</strong> ${selectedElements.radarModel}</td>
    </tr>
    <tr>  

    <td style="padding-right: 20px;"><strong>Radar Use:</strong> ${selectedElements.radarUse}</td>
    <td style="padding-right: 20px;"><strong>Radar Txtime:</strong> ${selectedElements.radarTxtime}</td>
    </tr>
    <tr>  

    <td style="padding-right: 20px;"><strong>Radar Location:</strong> ${selectedElements.radarLocation}</td>
    <td style="padding-right: 20px;"><strong>Radar Settings:</strong> ${selectedElements.radarSettings}</td>
  </tr>
  </table>
  <h4>Other Checks</h4>
  <table>
  <tr>
    <td style="padding-right: 20px;"><strong>GPS Check:</strong> ${selectedElements.gpsCheck}</td>
    <td style="padding-right: 20px;"><strong>Gyro Check:</strong> ${selectedElements.gyroCheck}</td>
    <td style="padding-right: 20px;"><strong>Wind Check:</strong> ${selectedElements.windCheck}</td>
    </tr>
    <tr>  
    <td style="padding-right: 20px;"><strong>Draught Check:</strong> ${selectedElements.draughtCheck}</td>
    <td style="padding-right: 20px;"><strong>Wave Check:</strong> ${selectedElements.waveCheck}</td>
    <td style="padding-right: 20px;"><strong>Speed Log Check:</strong> ${selectedElements.speedlogCheck}</td>
  </tr>
  </table>
  <h4>Radar Signal Cable Checks</h4>
  <table>
  <tr>
  <td style="padding-right: 20px;"><strong>Video Cable Type:</strong> ${selectedElements.videoCableType}</td>
    <td style="padding-right: 20px;"><strong>Video Cable Impedance:</strong> ${selectedElements.videoCableImpedance}</td>
    <td style="padding-right: 20px;"><strong>Video Cable Comments:</strong> ${selectedElements.videoCableComments}</td>
    </tr>
    <tr>
  
    <td style="padding-right: 20px;"><strong>Sync Cable Type:</strong> ${selectedElements.syncCableType}</td>
    <td style="padding-right: 20px;"><strong>Sync Cable Impedance:</strong> ${selectedElements.syncCableImpedance}</td>
    <td style="padding-right: 20px;"><strong>Sync Cable Comments:</strong> ${selectedElements.syncCableComments}</td>
  </tr>
  <tr>
  <td style="padding-right: 20px;"><strong>Azimuth Cable Type:</strong> ${selectedElements.azimuthCableType}</td>
    <td style="padding-right: 20px;"><strong>Azimuth Cable Impedance:</strong> ${selectedElements.azimuthCableImpedance}</td>
    <td style="padding-right: 20px;"><strong>Azimuth Cable Comments:</strong> ${selectedElements.azimuthCableComments}</td>
    </tr>
    <tr>
  
    <td style="padding-right: 20px;"><strong>Heading Cable Type:</strong> ${selectedElements.headingCableType}</td>
    <td style="padding-right: 20px;"><strong>Heading Cable Impedance:</strong> ${selectedElements.headingCableImpedance}</td>
    <td style="padding-right: 20px;"><strong>Heading Cable Comments:</strong> ${selectedElements.headingCableComments}</td>
  </tr>
</table>
<h4>Signal Jumper Checks</h4>
<table>
  <tr>
    <td style="padding-right: 20px;"><strong>Video Jumper:</strong> ${formData.videoJumper}</td>
    <td style="padding-right: 20px;"><strong>Sync Jumper:</strong> ${formData.syncJumper}</td>
    </tr>
    <tr>

    <td style="padding-right: 20px;"><strong>Azimuth Jumper:</strong> ${formData.azimuthJumper}</td>
    <td style="padding-right: 20px;"><strong>Heading Jumper:</strong> ${formData.headingJumper}</td>
    </tr>
    <tr>

    <td style="padding-right: 20px;"><strong>Pullup Jumper:</strong> ${formData.pullupJumper}</td>
    <td style="padding-right: 20px;"><strong>Pulldown Jumper:</strong> ${formData.pulldownJumper}</td>
  </tr>
  </table>
  <h4>Radar Miscellaneous Checks</h4>
  <table>
  <tr>
    <td style="padding-right: 20px;"><strong>Amplifier Type:</strong> ${formData.amplifierType}</td>
    <td style="padding-right: 20px;"><strong>Amplifier Check:</strong> ${formData.amplifierCheck}</td>
    <td style="padding-right: 20px;"><strong>Amplifier Comments:</strong> ${formData.amplifierComments}</td>
    </tr>
    <tr>

    <td style="padding-right: 20px;"><strong>Radar Firewall Type:</strong> ${formData.radarFirewallType}</td>
    <td style="padding-right: 20px;"><strong>Radar Firewall Check:</strong> ${formData.radarFirewallCheck}</td>
    <td style="padding-right: 20px;"><strong>Radar Firewall Comments:</strong> ${formData.radarFirewallComments}</td>
  </tr>
  </table>
  <h4>Other Hardware Checks</h4>
  <table>

  <tr>
    <td style="padding-right: 20px;"><strong>Serial Interface Type:</strong> ${formData.serialInterfaceType}</td>
    <td style="padding-right: 20px;"><strong>Serial Interface Check:</strong> ${formData.serialInterfaceCheck}</td>
    <td style="padding-right: 20px;"><strong>Serial Interface Comments:</strong> ${formData.serialInterfaceComments}</td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
</table>
<h3>4. Network Information</h3>
<h4>4.1 Site Network Connections</h4>

<table>

<thead>
<tr>
  <th class="table-cell table-header">Equipment</th>
  <th class="table-cell table-header">IP Address</th>
  <th class="table-cell table-header">Subnet Mask</th>
  <th class="table-cell table-header">Default Gateway</th>
  <th class="table-cell table-header">MAC Address</th>
</tr>
</thead>


<tr>
  <td class="table-cell">${formData.networkEquipment1 || ''}</td>
  <td class="table-cell">${formData.equipmentIpAddress1 || ''}</td>
  <td class="table-cell">${formData.equipmentSubnetMask1 || ''}</td>
  <td class="table-cell">${formData.equipmentDefaultGateway1 || ''}</td>
  <td class="table-cell">${formData.equipmentMac1 || ''}</td>
</tr>
<tr>
  <td class="table-cell">${formData.networkEquipment2 || ''}</td>
  <td class="table-cell">${formData.equipmentIpAddress2 || ''}</td>
  <td class="table-cell">${formData.equipmentSubnetMask2 || ''}</td>
  <td class="table-cell">${formData.equipmentDefaultGateway2 || ''}</td>
  <td class="table-cell">${formData.equipmentMac2 || ''}</td>
</tr>
<tr>
  <td class="table-cell">${formData.networkEquipment3 || ''}</td>
  <td class="table-cell">${formData.equipmentIpAddress3 || ''}</td>
  <td class="table-cell">${formData.equipmentSubnetMask3 || ''}</td>
  <td class="table-cell">${formData.equipmentDefaultGateway3 || ''}</td>
  <td class="table-cell">${formData.equipmentMac3 || ''}</td>
</tr>
<tr>
  <td class="table-cell">${formData.networkEquipment4 || ''}</td>
  <td class="table-cell">${formData.equipmentIpAddress4 || ''}</td>
  <td class="table-cell">${formData.equipmentSubnetMask4 || ''}</td>
  <td class="table-cell">${formData.equipmentDefaultGateway4 || ''}</td>
  <td class="table-cell">${formData.equipmentMac4 || ''}</td>
</tr>
<tr>
  <td class="table-cell">${formData.networkEquipment5 || ''}</td>
  <td class="table-cell">${formData.equipmentIpAddress5 || ''}</td>
  <td class="table-cell">${formData.equipmentSubnetMask5 || ''}</td>
  <td class="table-cell">${formData.equipmentDefaultGateway5 || ''}</td>
  <td class="table-cell">${formData.equipmentMac5 || ''}</td>
</tr>
<tr>
  <td class="table-cell">${formData.networkEquipment6 || ''}</td>
  <td class="table-cell">${formData.equipmentIpAddress6 || ''}</td>
  <td class="table-cell">${formData.equipmentSubnetMask6 || ''}</td>
  <td class="table-cell">${formData.equipmentDefaultGateway6 || ''}</td>
  <td class="table-cell">${formData.equipmentMac6 || ''}</td>
</tr>
<tr>
  <td class="table-cell">${formData.networkEquipment7 || ''}</td>
  <td class="table-cell">${formData.equipmentIpAddress7 || ''}</td>
  <td class="table-cell">${formData.equipmentSubnetMask7 || ''}</td>
  <td class="table-cell">${formData.equipmentDefaultGateway7 || ''}</td>
  <td class="table-cell">${formData.equipmentMac7 || ''}</td>
</tr>
<tr>
  <td class="table-cell">${formData.networkEquipment8 || ''}</td>
  <td class="table-cell">${formData.equipmentIpAddress8 || ''}</td>
  <td class="table-cell">${formData.equipmentSubnetMask8 || ''}</td>
  <td class="table-cell">${formData.equipmentDefaultGateway8 || ''}</td>
  <td class="table-cell">${formData.equipmentMac8 || ''}</td>
</tr>
  </table>
<h4>4.2 Cloud Configuration</h4>
<table>
  <tr>
  <td style="padding-right: 20px;"><strong>Cloud Host 1:</strong> ${formData.cloudHost1}</td>
  <td style="padding-right: 20px;"><strong>Cloud Host 2:</strong> ${formData.cloudHost2}</td>
</tr>


</table>
<h3>5. Startup</h3>
<h4>5.1 Computer and Software Installation Check</h4>
<table>
  <tr>
    <td style="padding-right: 20px;"><strong>Computer Startup:</strong> ${formData.computerStartup}</td>
    <td style="padding-right: 20px;"><strong>System Requirements:</strong> ${formData.systemRequirements}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>Windows Version:</strong> ${formData.windowsVersion}</td>
    <td style="padding-right: 20px;"><strong>Wavex Startup:</strong> ${formData.wavexStartup}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>Wavex Options:</strong> ${formData.wavexOptions}</td>
    <td style="padding-right: 20px;"><strong>Third Party Startup:</strong> ${formData.thirdPartyStartup}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>Storage Space:</strong> ${formData.storageSpace}</td>
    <td style="padding-right: 20px;"><strong>Remote Access Tools:</strong> ${formData.remoteAccessTools}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>Serial Mouse Fix:</strong> ${formData.serialMouseFix}</td>
    <td style="padding-right: 20px;"><strong>Network Interface Config:</strong> ${formData.networkInterfaceConfig}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>Windows Firewall:</strong> ${formData.windowsFirewall}</td>
    <td style="padding-right: 20px;"><strong>AntiVirus:</strong> ${formData.antiVirus}</td>
  </tr>
  </table>
  <h4>5.2 System Startup</h4>
<table>
  <tr>
    <td style="padding-right: 20px;"><strong>GPS Check 2:</strong> ${formData.gpsCheck2}</td>
    <td style="padding-right: 20px;"><strong>Gyro Check 2:</strong> ${formData.gyroCheck2}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>Wind Check 2:</strong> ${formData.windCheck2}</td>
    <td style="padding-right: 20px;"><strong>Draught Check 2:</strong> ${formData.draughtCheck2}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>Wave Check 2:</strong> ${formData.waveCheck2}</td>
    <td style="padding-right: 20px;"><strong>Speed Log Check 2:</strong> ${formData.speedlogCheck2}</td>
  </tr>
  </table>
  <h3>6. Configuration & Commissioning</h3>
  <h4>6.1 EM-129 Configuration</h4>
  <table>
  
  <tr>
    <td style="padding-right: 20px;"><strong>EM129 Version:</strong> ${formData.em129Version}</td>
    <td style="padding-right: 20px;"><strong>EM129 Settings:</strong> ${formData.em129Settings}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>EM129 Signal Status:</strong> ${formData.em129SignalStatus}</td>
    <td style="padding-right: 20px;"><strong>EM129 Network Settings:</strong> ${formData.em129NetworkSettings}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>EM129 Interface Config:</strong> ${formData.em129InterfaceConfig}</td>
    <td style="padding-right: 20px;"><strong>EM129 Scope:</strong> ${formData.em129Scope}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>EM129 Comments:</strong> ${formData.em129Comments}</td>
    <td style="padding-right: 20px;"><strong>Wavex Description:</strong> ${formData.wavexDescription}</td>
  </tr>
  </table>
  <h4>6.2 Wavex Software Configuration</h4>
  <table>

  <tr>
    <td style="padding-right: 20px;"><strong>Wavex Movement:</strong> ${formData.wavexMovement}</td>
    <td style="padding-right: 20px;"><strong>Wavex Lat:</strong> ${formData.wavexLat}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>Wavex Long:</strong> ${formData.wavexLong}</td>
    <td style="padding-right: 20px;"><strong>Wavex Heading:</strong> ${formData.wavexHeading}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>Wavex Radar:</strong> ${formData.wavexRadar}</td>
    <td style="padding-right: 20px;"><strong>Wavex Multicast:</strong> ${formData.wavexMulticast}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>Wavex Transceiver:</strong> ${formData.wavexTransceiver}</td>
    <td style="padding-right: 20px;"><strong>Wavex RinId:</strong> ${formData.wavexRinId}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>Wavex RinNetwork:</strong> ${formData.wavexRinNetwork}</td>
    <td style="padding-right: 20px;"><strong>Wavex Image Storage:</strong> ${formData.wavexImageStorage}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>Wavex GPS:</strong> ${formData.wavexGPS}</td>
    <td style="padding-right: 20px;"><strong>Wavex GPS Position Sentence:</strong> ${formData.wavexGPSPositionSentence}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>Wavex GPS Track Speed Sentence:</strong> ${formData.wavexGPSTrackSpeedSentence}</td>
    <td style="padding-right: 20px;"><strong>Wavex GPS Time Sentence:</strong> ${formData.wavexGPSTimeSentence}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>Wavex GPS Settings:</strong> ${formData.wavexGPSSettings}</td>
    <td style="padding-right: 20px;"><strong>Wavex Gyro:</strong> ${formData.wavexGyro}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>Wavex Gyro Sentence:</strong> ${formData.wavexGyroSentence}</td>
    <td style="padding-right: 20px;"><strong>Wavex Gyro Settings:</strong> ${formData.wavexGyroSettings}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>Wavex Wind:</strong> ${formData.wavexWind}</td>
    <td style="padding-right: 20px;"><strong>Wavex Wind Sentence:</strong> ${formData.wavexWindSentence}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>Wavex Wind Settings:</strong> ${formData.wavexWindSettings}</td>
    <td style="padding-right: 20px;"><strong>Wavex Wave:</strong> ${formData.wavexWave}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>Wavex Wave Sentence:</strong> ${formData.wavexWaveSentence}</td>
    <td style="padding-right: 20px;"><strong>Wavex Wave Settings:</strong> ${formData.wavexWaveSettings}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>Wavex Draught:</strong> ${formData.wavexDraught}</td>
    <td style="padding-right: 20px;"><strong>Wavex Draught Sentence:</strong> ${formData.wavexDraughtSentence}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>Wavex Draught Settings:</strong> ${formData.wavexDraughtSettings}</td>
  </tr>

  <tr>
    <td style="padding-right: 20px;"><strong>Wavex Speed Log:</strong> ${formData.wavexSpeedlog}</td>
    <td style="padding-right: 20px;"><strong>Wavex Speed Log Sentence:</strong> ${formData.wavexSpeedlogSentence}</td>
    <td style="padding-right: 20px;"><strong>Wavex Speed Log Settings:</strong> ${formData.wavexSpeedlogSettings}</td>
  </tr>
  <tr>
  <td style="padding-right: 20px;"><strong>Wavex Geometry Radar X:</strong> ${formData.wavexGeometryRadarX}</td>
    <td style="padding-right: 20px;"><strong>Wavex Geometry Radar Y:</strong> ${formData.wavexGeometryRadarY}</td>
    <td style="padding-right: 20px;"><strong>Wavex Geometry Radar Z:</strong> ${formData.wavexGeometryRadarZ}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>Wavex Geometry GPS X:</strong> ${formData.wavexGeometryGPSX}</td>
    <td style="padding-right: 20px;"><strong>Wavex Geometry GPS Y:</strong> ${formData.wavexGeometryGPSY}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>Wavex Geometry Wind Heading Offset:</strong> ${formData.wavexGeometryWindHeadingOffset}</td>
    <td style="padding-right: 20px;"><strong>Wavex Geometry Wind Z:</strong> ${formData.wavexGeometryWindZ}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>Wavex Radar Range Offset:</strong> ${formData.wavexRadarRangeOffset}</td>
    <td style="padding-right: 20px;"><strong>Wavex Radar Azimuth Offset:</strong> ${formData.wavexRadarAzimuthOffset}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>Wavex Radar Start Angle:</strong> ${formData.wavexRadarStartAngle}</td>
    <td style="padding-right: 20px;"><strong>Wavex Radar Sector Size:</strong> ${formData.wavexRadarSectorSize}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>Wavex Radar Start Range:</strong> ${formData.wavexRadarStartRange}</td>
    <td style="padding-right: 20px;"><strong>Wavex Radar Stop Range:</strong> ${formData.wavexRadarStopRange}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>Wavex Radar Image Check:</strong> ${formData.wavexRadarImageCheck}</td>
    <td style="padding-right: 20px;"><strong>Wavex Advanced Wave Antenna Mean Height:</strong> ${formData.wavexAdvancedWaveAntennaMeanHeight}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>Wavex Advanced Wave Cartesian Sections:</strong> ${formData.wavexAdvancedWaveCartesianSections}</td>
    <td style="padding-right: 20px;"><strong>Wavex Advanced Current Antenna Mean Height:</strong> ${formData.wavexAdvancedCurrentAntennaMeanHeight}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>Wavex Advanced Current Cartesian Sections:</strong> ${formData.wavexAdvancedCurrentCartesianSections}</td>
    <td style="padding-right: 20px;"><strong>Wavex Output 1:</strong> ${formData.wavexOutput1}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>Wavex Output 1 Sentence:</strong> ${formData.wavexOutput1Sentence}</td>
    <td style="padding-right: 20px;"><strong>Wavex Output 1 Update Interval:</strong> ${formData.wavexOutput1UpdateInterval}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>Wavex Output 1 Settings:</strong> ${formData.wavexOutput1Settings}</td>
    <td style="padding-right: 20px;"><strong>Wavex Output 2:</strong> ${formData.wavexOutput2}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>Wavex Output 2 Sentence:</strong> ${formData.wavexOutput2Sentence}</td>
    <td style="padding-right: 20px;"><strong>Wavex Output 2 Update Interval:</strong> ${formData.wavexOutput2UpdateInterval}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>Wavex Output 2 Settings:</strong> ${formData.wavexOutput2Settings}</td>
    <td style="padding-right: 20px;"><strong>Wavex Output 3:</strong> ${formData.wavexOutput3}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>Wavex Output 3 Sentence:</strong> ${formData.wavexOutput3Sentence}</td>
    <td style="padding-right: 20px;"><strong>Wavex Output 3 Update Interval:</strong> ${formData.wavexOutput3UpdateInterval}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>Wavex Output 3 Settings:</strong> ${formData.wavexOutput3Settings}</td>
    <td style="padding-right: 20px;"><strong>Cloud Enabled:</strong> ${formData.cloudEnabled}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>Final Config:</strong> ${formData.finalConfig}</td>
  </tr>
  </table>
  <h3>7. Final Start-up</h3>
  <table>
  <tr>
  <td style="padding-right: 20px;"><strong>Final Power Cycle:</strong> ${formData.finalPowerCycle}</td>
  <td style="padding-right: 20px;"><strong>Final Startup:</strong> ${formData.finalStartup}</td>
    <td style="padding-right: 20px;"><strong>Final 20 Minute:</strong> ${formData.final20Minute}</td>
    <td style="padding-right: 20px;"><strong>Final Data Output:</strong> ${formData.finalDataOutput}</td>
  </tr>
  </table>
  <h3>8. System Backup</h3>
  <table>
  <tr>
    <td style="padding-right: 20px;"><strong>Backup Wavex Json:</strong> ${formData.backupWavexJson}</td>
    <td style="padding-right: 20px;"><strong>Backup DF047:</strong> ${formData.backupDF047}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>Backup EM129:</strong> ${formData.backupEM129}</td>
    <td style="padding-right: 20px;"><strong>Backup Misc:</strong> ${formData.backupMisc}</td>
  </tr>
  </table>
  <h3>9. Login Details</h3>

  <table>

  <thead>
  <tr>
    <th class="table-cell table-header">Type</th>
    <th class="table-cell table-header">Username</th>
    <th class="table-cell table-header">Password</th>
    <th class="table-cell table-header">Comments</th>
  </tr>
</thead>


<tr>
  <td class="table-cell">${formData.loginType1 || ''}</td>
  <td class="table-cell">${formData.loginUsername1 || ''}</td>
  <td class="table-cell">${formData.loginPassword1 || ''}</td>
  <td class="table-cell">${formData.loginComments1 || ''}</td>
</tr>
<tr>
  <td class="table-cell">${formData.loginType2 || ''}</td>
  <td class="table-cell">${formData.loginUsername2 || ''}</td>
  <td class="table-cell">${formData.loginPassword2 || ''}</td>
  <td class="table-cell">${formData.loginComments2 || ''}</td>
</tr>
<tr>
  <td class="table-cell">${formData.loginType3 || ''}</td>
  <td class="table-cell">${formData.loginUsername3 || ''}</td>
  <td class="table-cell">${formData.loginPassword3 || ''}</td>
  <td class="table-cell">${formData.loginComments3 || ''}</td>
</tr>
</table>




<div style="text-align: center;">
<br>
<!-- Display uploaded images in a grid layout -->
<div class="image-container">
  ${imageUrls.map(url => `<div><img src="${url}" style="max-width: 100%;"></div>`).join('')}
</div>

 
  </div>
  
  <footer class="footer">
  <!-- Footer content -->
  <p>&copy; 2024 Miros Group. All rights reserved.</p>
  <p><a href="https://www.miros-group.com" style="color: white;">Miros Cloud Terms & Conditions</a></p>
  <a href="https://www.miros-group.com">
  <img src="https://miros.app/miros-logo-two-tone-light.631848d3e1f5088e7f228ac7b63d6dbc.svg" style="width: 100px;">
</a>

</footer>
  
  </body>
  </html>
  `;

  const newWindow = window.open('', '_blank');
  newWindow.document.write(html);
  newWindow.document.close();
}

function openFullReportOSD() {
  const formData = JSON.parse(localStorage.getItem('formData'));
  var workStatusValue = document.querySelector('select[name="workStatus"]').value;

  if (workStatusValue === 'Complete') {
    alert('Please ensure the site is set to "Commissioned" in the Miros Cloud administration area.');
  }


  if (workStatusValue !== 'Complete' && workStatusValue !== 'In Progress' && workStatusValue !== 'Needs Attention') {
    alert('Check the work status. It is not possible to generate a report or certificate at this stage.');
    return;
  }

  const selectedElements = {
    system: formData.system,
    workType: formData.workType,
    site: formData.site,
    siteType: formData.siteType,
    customer: formData.customer,
    date: formData.date,
    imo: formData.imo,
    location: formData.location,
    engineer: formData.engineer,
    engineer2: formData.engineer2,
    recordEquipment1: formData.recordEquipment1,
    equipmentManufact1: formData.equipmentManufact1,
    equipmentModel1: formData.equipmentModel1,
    equipmentPartNo1: formData.equipmentPartNo1,
    equipmentSerialNo1: formData.equipmentSerialNo1,
    equipmentLocation1: formData.equipmentLocation1,
    recordEquipment2: formData.recordEquipment2,
    equipmentManufact2: formData.equipmentManufact2,
    equipmentModel2: formData.equipmentModel2,
    equipmentPartNo2: formData.equipmentPartNo2,
    equipmentSerialNo2: formData.equipmentSerialNo2,
    equipmentLocation2: formData.equipmentLocation2,
    recordEquipment3: formData.recordEquipment3,
    equipmentManufact3: formData.equipmentManufact3,
    equipmentModel3: formData.equipmentModel3,
    equipmentPartNo3: formData.equipmentPartNo3,
    equipmentSerialNo3: formData.equipmentSerialNo3,
    equipmentLocation3: formData.equipmentLocation3,
    recordEquipment4: formData.recordEquipment4,
    equipmentManufact4: formData.equipmentManufact4,
    equipmentModel4: formData.equipmentModel4,
    equipmentPartNo4: formData.equipmentPartNo4,
    equipmentSerialNo4: formData.equipmentSerialNo4,
    equipmentLocation4: formData.equipmentLocation4,
    recordEquipment5: formData.recordEquipment5,
    equipmentManufact5: formData.equipmentManufact5,
    equipmentModel5: formData.equipmentModel5,
    equipmentPartNo5: formData.equipmentPartNo5,
    equipmentSerialNo5: formData.equipmentSerialNo5,
    equipmentLocation5: formData.equipmentLocation5,
    recordEquipment6: formData.recordEquipment6,
    equipmentManufact6: formData.equipmentManufact6,
    equipmentModel6: formData.equipmentModel6,
    equipmentPartNo6: formData.equipmentPartNo6,
    equipmentSerialNo6: formData.equipmentSerialNo6,
    equipmentLocation6: formData.equipmentLocation6,
    recordEquipment7: formData.recordEquipment7,
    equipmentManufact7: formData.equipmentManufact7,
    equipmentModel7: formData.equipmentModel7,
    equipmentPartNo7: formData.equipmentPartNo7,
    equipmentSerialNo7: formData.equipmentSerialNo7,
    equipmentLocation7: formData.equipmentLocation7,
    recordEquipment8: formData.recordEquipment8,
    equipmentManufact8: formData.equipmentManufact8,
    equipmentModel8: formData.equipmentModel8,
    equipmentPart8: formData.equipmentPart8,
    equipmentSerial8: formData.equipmentSerial8,
    equipmentLocation8: formData.equipmentLocation8,
    checkEquipment1: formData.checkEquipment1,
    checkVisual1: formData.checkVisual1,
    checkMech1: formData.checkMech1,
    checkCabling1: formData.checkCabling1,
    checkPower1: formData.checkPower1,
    checkEarthing1: formData.checkEarthing1,
    checkEquipment2: formData.checkEquipment2,
    checkVisual2: formData.checkVisual2,
    checkMech2: formData.checkMech2,
    checkCabling2: formData.checkCabling2,
    checkPower2: formData.checkPower2,
    checkEarthing2: formData.checkEarthing2,
    checkEquipment3: formData.checkEquipment3,
    checkVisual3: formData.checkVisual3,
    checkMech3: formData.checkMech3,
    checkCabling3: formData.checkCabling3,
    checkPower3: formData.checkPower3,
    checkEarthing3: formData.checkEarthing3,
    checkEquipment4: formData.checkEquipment4,
    checkVisual4: formData.checkVisual4,
    checkMech4: formData.checkMech4,
    checkCabling4: formData.checkCabling4,
    checkPower4: formData.checkPower4,
    checkEarthing4: formData.checkEarthing4,

    checkEquipment5: formData.checkEquipment5,
    checkVisual5: formData.checkVisual5,
    checkMech5: formData.checkMech5,
    checkCabling5: formData.checkCabling5,
    checkPower5: formData.checkPower5,
    checkEarthing5: formData.checkEarthing5,

    checkEquipment6: formData.checkEquipment6,
    checkVisual6: formData.checkVisual6,
    checkMech6: formData.checkMech6,
    checkCabling6: formData.checkCabling6,
    checkPower6: formData.checkPower6,
    checkEarthing6: formData.checkEarthing6,

    checkEquipment7: formData.checkEquipment7,
    checkVisual7: formData.checkVisual7,
    checkMech7: formData.checkMech7,
    checkCabling7: formData.checkCabling7,
    checkPower7: formData.checkPower7,
    checkEarthing7: formData.checkEarthing7,

    checkEquipment8: formData.checkEquipment8,
    checkVisual8: formData.checkVisual8,
    checkMech8: formData.checkMech8,
    checkCabling8: formData.checkCabling8,
    checkPower8: formData.checkPower8,
    checkEarthing8: formData.checkEarthing8,

    radarManufacturer: formData.radarManufacturer,
    radarModel: formData.radarModel,
    radarUse: formData.radarUse,
    radarTxtime: formData.radarTxtime,
    radarLocation: formData.radarLocation,
    radarSettings: formData.radarSettings,
    gpsCheck: formData.gpsCheck,
    gyroCheck: formData.gyroCheck,
    windCheck: formData.windCheck,
    draughtCheck: formData.draughtCheck,
    waveCheck: formData.waveCheck,
    speedlogCheck: formData.speedlogCheck,


    videoCableType: formData.videoCableType,
    videoCableImpedance: formData.videoCableImpedance,
    videoCableComments: formData.videoCableComments,
    syncCableType: formData.syncCableType,
    syncCableImpedance: formData.syncCableImpedance,
    syncCableComments: formData.syncCableComments,
    azimuthCableType: formData.azimuthCableType,
    azimuthCableImpedance: formData.azimuthCableImpedance,
    azimuthCableComments: formData.azimuthCableComments,
    headingCableType: formData.headingCableType,
    headingCableImpedance: formData.headingCableImpedance,
    headingCableComments: formData.headingCableComments,
    videoJumper: formData.videoJumper,
    syncJumper: formData.syncJumper,
    azimuthJumper: formData.azimuthJumper,
    headingJumper: formData.headingJumper,
    pullupJumper: formData.pullupJumper,
    pulldownJumper: formData.pulldownJumper,
    amplifierType: formData.amplifierType,
    amplifierCheck: formData.amplifierCheck,
    amplifierComments: formData.amplifierComments,
    radarFirewallType: formData.radarFirewallType,
    radarFirewallCheck: formData.radarFirewallCheck,
    radarFirewallComments: formData.radarFirewallComments,
    serialInterfaceType: formData.serialInterfaceType,
    serialInterfaceCheck: formData.serialInterfaceCheck,
    serialInterfaceComments: formData.serialInterfaceComments,
    networkEquipment1: formData.networkEquipment1,
    equipmentIpAddress1: formData.equipmentIpAddress1,
    equipmentSubnetMask1: formData.equipmentSubnetMask1,
    equipmentDefaultGateway1: formData.equipmentDefaultGateway1,
    equipmentMac1: formData.equipmentMac1,
    networkEquipment2: formData.networkEquipment2,
    equipmentIpAddress2: formData.equipmentIpAddress2,
    equipmentSubnetMask2: formData.equipmentSubnetMask2,
    equipmentDefaultGateway2: formData.equipmentDefaultGateway2,
    equipmentMac2: formData.equipmentMac2,
    networkEquipment3: formData.networkEquipment3,
    equipmentIpAddress3: formData.equipmentIpAddress3,
    equipmentSubnetMask3: formData.equipmentSubnetMask3,
    equipmentDefaultGateway3: formData.equipmentDefaultGateway3,
    equipmentMac3: formData.equipmentMac3,
    networkEquipment4: formData.networkEquipment4,
    equipmentIpAddress4: formData.equipmentIpAddress4,
    equipmentSubnetMask4: formData.equipmentSubnetMask4,
    equipmentDefaultGateway4: formData.equipmentDefaultGateway4,
    equipmentMac4: formData.equipmentMac4,
    networkEquipment5: formData.networkEquipment5,
    equipmentIpAddress5: formData.equipmentIpAddress5,
    equipmentSubnetMask5: formData.equipmentSubnetMask5,
    equipmentDefaultGateway5: formData.equipmentDefaultGateway5,
    equipmentMac5: formData.equipmentMac5,
    networkEquipment6: formData.networkEquipment6,
    equipmentIpAddress6: formData.equipmentIpAddress6,
    equipmentSubnetMask6: formData.equipmentSubnetMask6,
    equipmentDefaultGateway6: formData.equipmentDefaultGateway6,
    equipmentMac6: formData.equipmentMac6,
    networkEquipment7: formData.networkEquipment7,
    equipmentIpAddress7: formData.equipmentIpAddress7,
    equipmentSubnetMask7: formData.equipmentSubnetMask7,
    equipmentDefaultGateway7: formData.equipmentDefaultGateway7,
    equipmentMac7: formData.equipmentMac7,
    networkEquipment8: formData.networkEquipment8,
    equipmentIpAddress8: formData.equipmentIpAddress8,
    equipmentSubnetMask8: formData.equipmentSubnetMask8,
    equipmentDefaultGateway8: formData.equipmentDefaultGateway8,
    equipmentMac8: formData.equipmentMac8,
    networkDns: formData.networkDns,
    networkComments: formData.networkComments,
    cloudHost1: formData.cloudHost1,
    cloudHost2: formData.cloudHost2,
    computerStartup: formData.computerStartup,
    systemRequirements: formData.systemRequirements,
    windowsVersion: formData.windowsVersion,
    osdStartup: formData.osdStartup,
    osdOptions: formData.osdOptions,
    thirdPartyStartup: formData.thirdPartyStartup,
    storageSpace: formData.storageSpace,
    remoteAccessTools: formData.remoteAccessTools,
    serialMouseFix: formData.serialMouseFix,
    networkInterfaceConfig: formData.networkInterfaceConfig,
    windowsFirewall: formData.windowsFirewall,
    antiVirus: formData.antiVirus,
    gpsCheck2: formData.gpsCheck2,
    gyroCheck2: formData.gyroCheck2,
    windCheck2: formData.windCheck2,
    draughtCheck2: formData.draughtCheck2,
    waveCheck2: formData.waveCheck2,
    shaftCheck2: formData.shaftCheck2,
    em129Version: formData.em129Version,
    em129Settings: formData.em129Settings,
    em129SignalStatus: formData.em129SignalStatus,
    em129NetworkSettings: formData.em129NetworkSettings,
    em129InterfaceConfig: formData.em129InterfaceConfig,
    em129Scope: formData.em129Scope,
    em129Comments: formData.em129Comments,
    osdDescription: formData.osdDescription,
    osdMovement: formData.osdMovement,
    osdLat: formData.osdLat,
    osdLong: formData.osdLong,
    osdHeading: formData.osdHeading,
    osdRadar: formData.osdRadar,
    osdMulticast: formData.osdMulticast,
    osdTransceiver: formData.osdTransceiver,
    osdRinId: formData.osdRinId,
    osdRinNetwork: formData.osdRinNetwork,
    osdImageStorage: formData.osdImageStorage,
    osdGPS: formData.osdGPS,
    osdGPSPositionSentence: formData.osdGPSPositionSentence,
    osdGPSTrackSpeedSentence: formData.osdGPSTrackSpeedSentence,
    osdGPSTimeSentence: formData.osdGPSTimeSentence,
    osdGPSSettings: formData.osdGPSSettings,
    osdGyro: formData.osdGyro,
    osdGyroSentence: formData.osdGyroSentence,
    osdGyroSettings: formData.osdGyroSettings,
    osdWind: formData.osdWind,
    osdWindSentence: formData.osdWindSentence,
    osdWindSettings: formData.osdWindSettings,
    osdWave: formData.osdWave,
    osdWaveSentence: formData.osdWaveSentence,
    osdWaveSettings: formData.osdWaveSettings,
    osdDraught: formData.osdDraught,
    osdDraughtSentence: formData.osdDraughtSentence,
    osdDraughtSettings: formData.osdDraughtSettings,
    osdSpeedlog: formData.osdSpeedlog,
    osdSpeedlogSentence: formData.osdSpeedlogSentence,
    osdSpeedlogSettings: formData.osdSpeedlogSettings,

    osdGeometryRadarX: formData.osdGeometryRadarX,
    osdGeometryRadarY: formData.osdGeometryRadarY,
    osdGeometryRadarZ: formData.osdGeometryRadarZ,
    osdGeometryGPSX: formData.osdGeometryGPSX,
    osdGeometryGPSY: formData.osdGeometryGPSY,
    osdGeometryWindHeadingOffset: formData.osdGeometryWindHeadingOffset,
    osdGeometryWindZ: formData.osdGeometryWindZ,
    osdRadarRangeOffset: formData.osdRadarRangeOffset,
    osdRadarAzimuthOffset: formData.osdRadarAzimuthOffset,
    osdRadarStartAngle: formData.osdRadarStartAngle,
    osdRadarSectorSize: formData.osdRadarSectorSize,
    osdRadarStartRange: formData.osdRadarStartRange,
    osdRadarStopRange: formData.osdRadarStopRange,
    osdRadarImageCheck: formData.osdRadarImageCheck,
    osdAdvancedWaveAntennaMeanHeight: formData.osdAdvancedWaveAntennaMeanHeight,
    osdAdvancedWaveCartesianSections: formData.osdAdvancedWaveCartesianSections,
    osdAdvancedCurrentAntennaMeanHeight: formData.osdAdvancedCurrentAntennaMeanHeight,
    osdAdvancedCurrentCartesianSections: formData.osdAdvancedCurrentCartesianSections,
    osdOutput1: formData.osdOutput1,
    osdOutput1Sentence: formData.osdOutput1Sentence,
    osdOutput1UpdateInterval: formData.osdOutput1UpdateInterval,
    osdOutput1Settings: formData.osdOutput1Settings,
    osdOutput2: formData.osdOutput2,
    osdOutput2Sentence: formData.osdOutput2Sentence,
    osdOutput2UpdateInterval: formData.osdOutput2UpdateInterval,
    osdOutput2Settings: formData.osdOutput2Settings,
    osdOutput3: formData.osdOutput3,
    osdOutput3Sentence: formData.osdOutput3Sentence,
    osdOutput3UpdateInterval: formData.osdOutput3UpdateInterval,
    osdOutput3Settings: formData.osdOutput3Settings,
    cloudEnabled: formData.cloudEnabled,
    finalConfig: formData.finalConfig,
    finalPowerCycle: formData.finalPowerCycle,
    finalStartup: formData.finalStartup,
    final20Minute: formData.final20Minute,
    finalDataOutput: formData.finalDataOutput,
    backuposdJson: formData.backuposdJson,
    backupDF047: formData.backupDF047,
    backupEM129: formData.backupEM129,
    backupMisc: formData.backupMisc,
    loginType1: formData.loginType1,
    loginUsername1: formData.loginUsername1,
    loginPassword1: formData.loginPassword1,
    loginComments1: formData.loginComments1,
    loginType2: formData.loginType2,
    loginUsername2: formData.loginUsername2,
    loginPassword2: formData.loginPassword2,
    loginComments2: formData.loginComments2,
    loginType3: formData.loginType3,
    loginUsername2: formData.loginUsername3,
    loginPassword3: formData.loginPassword3,
    loginComments3: formData.loginComments3,
    workStatus: formData.workStatus,
    subscriptionStatus: formData.subscriptionStatus,
    subscriptionExpiry: formData.subscriptionExpiry,
    generalComments: formData.generalComments
  };

  // Retrieve uploaded images
  const uploadedImages = document.querySelectorAll('.uploaded-images img');
  const imageUrls = Array.from(uploadedImages).map(img => img.src);


  const html = `
  <!DOCTYPE html>
  <html>
  <head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Miros Site Report</title>
  <link rel="stylesheet" type="text/css" href="style_report.css">
</head>  
<body>

<div class="header">
  <div class="text-container">
  <img src="https://miros.app/miros-logo-two-tone-light.631848d3e1f5088e7f228ac7b63d6dbc.svg" style="width: 200px; padding-bottom: 10px;">
  <div class="info"><span class="label">System:</span> <span class="value">${selectedElements.system}</span></div>
    <div class="info"><span class="label">Site:</span> <span class="value">${selectedElements.site}</span></div>
    <div class="info"><span class="label">Customer:</span> <span class="value">${selectedElements.customer}</span></div>
    <div class="info"><span class="label">Date:</span> <span class="value">${selectedElements.date}</span></div>
    <div class="info"><span class="label">Work Type:</span> <span class="value">${selectedElements.workType}</span></div>
    <div class="info"><span class="label">Work Status:</span> <span class="value">${selectedElements.workStatus}</span></div>
    <div class="info"><span class="label">Subscription Expiry:</span> <span class="value">${selectedElements.subscriptionStatus}   ${selectedElements.subscriptionExpiry}</span></div>
</div>
<!-- Large image to the right -->
<EDITimg src="header.jpeg" alt="Large Image Description" class="large-image">
</div>


<div class="container">
  <h2>Site Report</h2>
  <h3>1. Overview</h3>
  <p style="max-width: 750px;">${selectedElements.generalComments}</p>

  <table class="info-table">
  <!-- System -->
  <tr>
    <td class="label">System:</td>
    <td>${selectedElements.system}</td>
  </tr>
  <!-- Site Type -->
  <tr>
    <td class="label">Site Type:</td>
    <td>${selectedElements.siteType}</td>
  </tr>
  <!-- IMO -->
  <tr>
    <td class="label">IMO:</td>
    <td>${selectedElements.imo}</td>
  </tr>
  <!-- Work Type -->
  <tr>
    <td class="label">Work Type:</td>
    <td>${selectedElements.workType}</td>
  </tr>
  <!-- Customer -->
  <tr>
    <td class="label">Customer:</td>
    <td>${selectedElements.customer}</td>
  </tr>
  <!-- Location -->
  <tr>
    <td class="label">Location:</td>
    <td>${selectedElements.location}</td>
  </tr>
  <!-- Site -->
  <tr>
    <td class="label">Site:</td>
    <td>${selectedElements.site}</td>
  </tr>
  <!-- Date -->
  <tr>
    <td class="label">Date:</td>
    <td>${selectedElements.date}</td>
  </tr>
  <!-- Engineer -->
  <tr>
    <td class="label">Engineer(s):</td>
    <td>${selectedElements.engineer}</td>
  </tr>
  <tr>
  <td class="label"></td>
  ${selectedElements.engineer2 ? `<td>${selectedElements.engineer2}</td>` : ''}
  </tr>

</table>




<h3>2. Record Equipment</h3>
<table>
  <thead>
    <tr>
      <th class="table-cell table-header">Equipment</th>
      <th class="table-cell table-header">Manufacturer</th>
      <th class="table-cell table-header">Model</th>
      <th class="table-cell table-header">Part No</th>
      <th class="table-cell table-header">Serial No.</th>
      <th class="table-cell table-header">Location</th>
    </tr>
  </thead>
  <tbody>
    <!-- Equipment row 1 -->
    <tr>
    <td class="table-cell">${selectedElements.recordEquipment1 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentManufact1 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentModel1 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentPartNo1 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentSerialNo1 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentLocation1 || ''}</td>
  </tr>
  <tr>
    <td class="table-cell">${selectedElements.recordEquipment2 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentManufact2 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentModel2 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentPartNo2 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentSerialNo2 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentLocation2 || ''}</td>
  </tr>
  <tr>
    <td class="table-cell">${selectedElements.recordEquipment3 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentManufact3 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentModel3 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentPartNo3 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentSerialNo3 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentLocation3 || ''}</td>
  </tr>
  <tr>
    <td class="table-cell">${selectedElements.recordEquipment4 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentManufact4 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentModel4 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentPartNo4 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentSerialNo4 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentLocation4 || ''}</td>
  </tr>
  <tr>
    <td class="table-cell">${selectedElements.recordEquipment5 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentManufact5 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentModel5 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentPartNo5 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentSerialNo5 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentLocation5 || ''}</td>
  </tr>
  <tr>
    <td class="table-cell">${selectedElements.recordEquipment6 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentManufact6 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentModel6 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentPartNo6 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentSerialNo6 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentLocation6 || ''}</td>
  </tr>
  <tr>
    <td class="table-cell">${selectedElements.recordEquipment7 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentManufact7 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentModel7 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentPartNo7 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentSerialNo7 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentLocation7 || ''}</td>
  </tr>
  <tr>
    <td class="table-cell">${selectedElements.recordEquipment8 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentManufact8 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentModel8 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentPartNo8 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentSerialNo8 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentLocation8 || ''}</td>
  </tr>
    </tbody>
</table>
<div class="line_sub"></div>


<h3>3. Check Equipment</h3>
<h4>3.1 Equipment</h4>
<table>

<thead>
<tr>
  <th class="table-cell table-header">Equipment</th>
  <th class="table-cell table-header">Visual</th>
  <th class="table-cell table-header">Mechanical</th>
  <th class="table-cell table-header">Cabling</th>
  <th class="table-cell table-header">Power</th>
  <th class="table-cell table-header">Earthing</th>
</tr>
</thead>

<tbody>
<tr>
  <td class="table-cell">${selectedElements.checkEquipment1 || ''}</td>
  <td class="table-cell">${selectedElements.checkVisual1 || ''}</td>
  <td class="table-cell">${selectedElements.checkMech1 || ''}</td>
  <td class="table-cell">${selectedElements.checkCabling1 || ''}</td>
  <td class="table-cell">${selectedElements.checkPower1 || ''}</td>
  <td class="table-cell">${selectedElements.checkEarthing1 || ''}</td>
</tr>
<tr>
  <td class="table-cell">${selectedElements.checkEquipment2 || ''}</td>
  <td class="table-cell">${selectedElements.checkVisual2 || ''}</td>
  <td class="table-cell">${selectedElements.checkMech2 || ''}</td>
  <td class="table-cell">${selectedElements.checkCabling2 || ''}</td>
  <td class="table-cell">${selectedElements.checkPower2 || ''}</td>
  <td class="table-cell">${selectedElements.checkEarthing2 || ''}</td>
</tr>
<tr>
  <td class="table-cell">${selectedElements.checkEquipment3 || ''}</td>
  <td class="table-cell">${selectedElements.checkVisual3 || ''}</td>
  <td class="table-cell">${selectedElements.checkMech3 || ''}</td>
  <td class="table-cell">${selectedElements.checkCabling3 || ''}</td>
  <td class="table-cell">${selectedElements.checkPower3 || ''}</td>
  <td class="table-cell">${selectedElements.checkEarthing3 || ''}</td>
</tr>
<tr>
  <td class="table-cell">${selectedElements.checkEquipment4 || ''}</td>
  <td class="table-cell">${selectedElements.checkVisual4 || ''}</td>
  <td class="table-cell">${selectedElements.checkMech4 || ''}</td>
  <td class="table-cell">${selectedElements.checkCabling4 || ''}</td>
  <td class="table-cell">${selectedElements.checkPower4 || ''}</td>
  <td class="table-cell">${selectedElements.checkEarthing4 || ''}</td>
</tr>
<tr>
  <td class="table-cell">${selectedElements.checkEquipment5 || ''}</td>
  <td class="table-cell">${selectedElements.checkVisual5 || ''}</td>
  <td class="table-cell">${selectedElements.checkMech5 || ''}</td>
  <td class="table-cell">${selectedElements.checkCabling5 || ''}</td>
  <td class="table-cell">${selectedElements.checkPower5 || ''}</td>
  <td class="table-cell">${selectedElements.checkEarthing5 || ''}</td>
</tr>
<tr>
  <td class="table-cell">${selectedElements.checkEquipment6 || ''}</td>
  <td class="table-cell">${selectedElements.checkVisual6 || ''}</td>
  <td class="table-cell">${selectedElements.checkMech6 || ''}</td>
  <td class="table-cell">${selectedElements.checkCabling6 || ''}</td>
  <td class="table-cell">${selectedElements.checkPower6 || ''}</td>
  <td class="table-cell">${selectedElements.checkEarthing6 || ''}</td>
</tr>
<tr>
  <td class="table-cell">${selectedElements.checkEquipment7 || ''}</td>
  <td class="table-cell">${selectedElements.checkVisual7 || ''}</td>
  <td class="table-cell">${selectedElements.checkMech7 || ''}</td>
  <td class="table-cell">${selectedElements.checkCabling7 || ''}</td>
  <td class="table-cell">${selectedElements.checkPower7 || ''}</td>
  <td class="table-cell">${selectedElements.checkEarthing7 || ''}</td>
</tr>
<tr>
  <td class="table-cell">${selectedElements.checkEquipment8 || ''}</td>
  <td class="table-cell">${selectedElements.checkVisual8 || ''}</td>
  <td class="table-cell">${selectedElements.checkMech8 || ''}</td>
  <td class="table-cell">${selectedElements.checkCabling8 || ''}</td>
  <td class="table-cell">${selectedElements.checkPower8 || ''}</td>
  <td class="table-cell">${selectedElements.checkEarthing8 || ''}</td>
</tr>
</tbody>
</table>
<h4>3.2 Equipment Specific Checks</h4>

  <h4>Radar</h4>
  <table>
  <tr>
  <td class="table-cell"><span class="emphasis">Radar Manufacturer:</span> ${selectedElements.radarManufacturer}</td>
  <td style="padding-right: 20px;"><strong>Radar Model:</strong> ${selectedElements.radarModel}</td>
    </tr>
    <tr>  

    <td style="padding-right: 20px;"><strong>Radar Use:</strong> ${selectedElements.radarUse}</td>
    <td style="padding-right: 20px;"><strong>Radar Txtime:</strong> ${selectedElements.radarTxtime}</td>
    </tr>
    <tr>  

    <td style="padding-right: 20px;"><strong>Radar Location:</strong> ${selectedElements.radarLocation}</td>
    <td style="padding-right: 20px;"><strong>Radar Settings:</strong> ${selectedElements.radarSettings}</td>
  </tr>
  </table>
  <h4>Other Checks</h4>
  <table>
  <tr>
    <td style="padding-right: 20px;"><strong>GPS Check:</strong> ${selectedElements.gpsCheck}</td>
    <td style="padding-right: 20px;"><strong>Gyro Check:</strong> ${selectedElements.gyroCheck}</td>
    <td style="padding-right: 20px;"><strong>Wind Check:</strong> ${selectedElements.windCheck}</td>
    </tr>
    <tr>  
    <td style="padding-right: 20px;"><strong>Draught Check:</strong> ${selectedElements.draughtCheck}</td>
    <td style="padding-right: 20px;"><strong>Wave Check:</strong> ${selectedElements.waveCheck}</td>
    <td style="padding-right: 20px;"><strong>Speed Log Check:</strong> ${selectedElements.speedlogCheck}</td>
  </tr>
  </table>
  <h4>Radar Signal Cable Checks</h4>
  <table>
  <tr>
  <td style="padding-right: 20px;"><strong>Video Cable Type:</strong> ${selectedElements.videoCableType}</td>
    <td style="padding-right: 20px;"><strong>Video Cable Impedance:</strong> ${selectedElements.videoCableImpedance}</td>
    <td style="padding-right: 20px;"><strong>Video Cable Comments:</strong> ${selectedElements.videoCableComments}</td>
    </tr>
    <tr>
  
    <td style="padding-right: 20px;"><strong>Sync Cable Type:</strong> ${selectedElements.syncCableType}</td>
    <td style="padding-right: 20px;"><strong>Sync Cable Impedance:</strong> ${selectedElements.syncCableImpedance}</td>
    <td style="padding-right: 20px;"><strong>Sync Cable Comments:</strong> ${selectedElements.syncCableComments}</td>
  </tr>
  <tr>
  <td style="padding-right: 20px;"><strong>Azimuth Cable Type:</strong> ${selectedElements.azimuthCableType}</td>
    <td style="padding-right: 20px;"><strong>Azimuth Cable Impedance:</strong> ${selectedElements.azimuthCableImpedance}</td>
    <td style="padding-right: 20px;"><strong>Azimuth Cable Comments:</strong> ${selectedElements.azimuthCableComments}</td>
    </tr>
    <tr>
  
    <td style="padding-right: 20px;"><strong>Heading Cable Type:</strong> ${selectedElements.headingCableType}</td>
    <td style="padding-right: 20px;"><strong>Heading Cable Impedance:</strong> ${selectedElements.headingCableImpedance}</td>
    <td style="padding-right: 20px;"><strong>Heading Cable Comments:</strong> ${selectedElements.headingCableComments}</td>
  </tr>
</table>
<h4>Signal Jumper Checks</h4>
<table>
  <tr>
    <td style="padding-right: 20px;"><strong>Video Jumper:</strong> ${formData.videoJumper}</td>
    <td style="padding-right: 20px;"><strong>Sync Jumper:</strong> ${formData.syncJumper}</td>
    </tr>
    <tr>

    <td style="padding-right: 20px;"><strong>Azimuth Jumper:</strong> ${formData.azimuthJumper}</td>
    <td style="padding-right: 20px;"><strong>Heading Jumper:</strong> ${formData.headingJumper}</td>
    </tr>
    <tr>

    <td style="padding-right: 20px;"><strong>Pullup Jumper:</strong> ${formData.pullupJumper}</td>
    <td style="padding-right: 20px;"><strong>Pulldown Jumper:</strong> ${formData.pulldownJumper}</td>
  </tr>
  </table>
  <h4>Radar Miscellaneous Checks</h4>
  <table>
  <tr>
    <td style="padding-right: 20px;"><strong>Amplifier Type:</strong> ${formData.amplifierType}</td>
    <td style="padding-right: 20px;"><strong>Amplifier Check:</strong> ${formData.amplifierCheck}</td>
    <td style="padding-right: 20px;"><strong>Amplifier Comments:</strong> ${formData.amplifierComments}</td>
    </tr>
    <tr>

    <td style="padding-right: 20px;"><strong>Radar Firewall Type:</strong> ${formData.radarFirewallType}</td>
    <td style="padding-right: 20px;"><strong>Radar Firewall Check:</strong> ${formData.radarFirewallCheck}</td>
    <td style="padding-right: 20px;"><strong>Radar Firewall Comments:</strong> ${formData.radarFirewallComments}</td>
  </tr>
  </table>
  <h4>Other Hardware Checks</h4>
  <table>

  <tr>
    <td style="padding-right: 20px;"><strong>Serial Interface Type:</strong> ${formData.serialInterfaceType}</td>
    <td style="padding-right: 20px;"><strong>Serial Interface Check:</strong> ${formData.serialInterfaceCheck}</td>
    <td style="padding-right: 20px;"><strong>Serial Interface Comments:</strong> ${formData.serialInterfaceComments}</td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
</table>
<h3>4. Network Information</h3>
<h4>4.1 Site Network Connections</h4>

<table>

<thead>
<tr>
  <th class="table-cell table-header">Equipment</th>
  <th class="table-cell table-header">IP Address</th>
  <th class="table-cell table-header">Subnet Mask</th>
  <th class="table-cell table-header">Default Gateway</th>
  <th class="table-cell table-header">MAC Address</th>
</tr>
</thead>


<tr>
  <td class="table-cell">${formData.networkEquipment1 || ''}</td>
  <td class="table-cell">${formData.equipmentIpAddress1 || ''}</td>
  <td class="table-cell">${formData.equipmentSubnetMask1 || ''}</td>
  <td class="table-cell">${formData.equipmentDefaultGateway1 || ''}</td>
  <td class="table-cell">${formData.equipmentMac1 || ''}</td>
</tr>
<tr>
  <td class="table-cell">${formData.networkEquipment2 || ''}</td>
  <td class="table-cell">${formData.equipmentIpAddress2 || ''}</td>
  <td class="table-cell">${formData.equipmentSubnetMask2 || ''}</td>
  <td class="table-cell">${formData.equipmentDefaultGateway2 || ''}</td>
  <td class="table-cell">${formData.equipmentMac2 || ''}</td>
</tr>
<tr>
  <td class="table-cell">${formData.networkEquipment3 || ''}</td>
  <td class="table-cell">${formData.equipmentIpAddress3 || ''}</td>
  <td class="table-cell">${formData.equipmentSubnetMask3 || ''}</td>
  <td class="table-cell">${formData.equipmentDefaultGateway3 || ''}</td>
  <td class="table-cell">${formData.equipmentMac3 || ''}</td>
</tr>
<tr>
  <td class="table-cell">${formData.networkEquipment4 || ''}</td>
  <td class="table-cell">${formData.equipmentIpAddress4 || ''}</td>
  <td class="table-cell">${formData.equipmentSubnetMask4 || ''}</td>
  <td class="table-cell">${formData.equipmentDefaultGateway4 || ''}</td>
  <td class="table-cell">${formData.equipmentMac4 || ''}</td>
</tr>
<tr>
  <td class="table-cell">${formData.networkEquipment5 || ''}</td>
  <td class="table-cell">${formData.equipmentIpAddress5 || ''}</td>
  <td class="table-cell">${formData.equipmentSubnetMask5 || ''}</td>
  <td class="table-cell">${formData.equipmentDefaultGateway5 || ''}</td>
  <td class="table-cell">${formData.equipmentMac5 || ''}</td>
</tr>
<tr>
  <td class="table-cell">${formData.networkEquipment6 || ''}</td>
  <td class="table-cell">${formData.equipmentIpAddress6 || ''}</td>
  <td class="table-cell">${formData.equipmentSubnetMask6 || ''}</td>
  <td class="table-cell">${formData.equipmentDefaultGateway6 || ''}</td>
  <td class="table-cell">${formData.equipmentMac6 || ''}</td>
</tr>
<tr>
  <td class="table-cell">${formData.networkEquipment7 || ''}</td>
  <td class="table-cell">${formData.equipmentIpAddress7 || ''}</td>
  <td class="table-cell">${formData.equipmentSubnetMask7 || ''}</td>
  <td class="table-cell">${formData.equipmentDefaultGateway7 || ''}</td>
  <td class="table-cell">${formData.equipmentMac7 || ''}</td>
</tr>
<tr>
  <td class="table-cell">${formData.networkEquipment8 || ''}</td>
  <td class="table-cell">${formData.equipmentIpAddress8 || ''}</td>
  <td class="table-cell">${formData.equipmentSubnetMask8 || ''}</td>
  <td class="table-cell">${formData.equipmentDefaultGateway8 || ''}</td>
  <td class="table-cell">${formData.equipmentMac8 || ''}</td>
</tr>
  </table>
<h4>4.2 Cloud Configuration</h4>
<table>
  <tr>
  <td style="padding-right: 20px;"><strong>Cloud Host 1:</strong> ${formData.cloudHost1}</td>
  <td style="padding-right: 20px;"><strong>Cloud Host 2:</strong> ${formData.cloudHost2}</td>
</tr>


</table>
<h3>5. Startup</h3>
<h4>5.1 Computer and Software Installation Check</h4>
<table>
  <tr>
    <td style="padding-right: 20px;"><strong>Computer Startup:</strong> ${formData.computerStartup}</td>
    <td style="padding-right: 20px;"><strong>System Requirements:</strong> ${formData.systemRequirements}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>Windows Version:</strong> ${formData.windowsVersion}</td>
    <td style="padding-right: 20px;"><strong>OSD Startup:</strong> ${formData.osdStartup}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>OSD Options:</strong> ${formData.osdOptions}</td>
    <td style="padding-right: 20px;"><strong>Third Party Startup:</strong> ${formData.thirdPartyStartup}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>Storage Space:</strong> ${formData.storageSpace}</td>
    <td style="padding-right: 20px;"><strong>Remote Access Tools:</strong> ${formData.remoteAccessTools}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>Serial Mouse Fix:</strong> ${formData.serialMouseFix}</td>
    <td style="padding-right: 20px;"><strong>Network Interface Config:</strong> ${formData.networkInterfaceConfig}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>Windows Firewall:</strong> ${formData.windowsFirewall}</td>
    <td style="padding-right: 20px;"><strong>AntiVirus:</strong> ${formData.antiVirus}</td>
  </tr>
  </table>
  <h4>5.2 System Startup</h4>
<table>
  <tr>
    <td style="padding-right: 20px;"><strong>GPS Check 2:</strong> ${formData.gpsCheck2}</td>
    <td style="padding-right: 20px;"><strong>Gyro Check 2:</strong> ${formData.gyroCheck2}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>Wind Check 2:</strong> ${formData.windCheck2}</td>
    <td style="padding-right: 20px;"><strong>Draught Check 2:</strong> ${formData.draughtCheck2}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>Wave Check 2:</strong> ${formData.waveCheck2}</td>
    <td style="padding-right: 20px;"><strong>Speed Log Check 2:</strong> ${formData.speedlogCheck2}</td>
  </tr>
  </table>
  <h3>6. Configuration & Commissioning</h3>
  <h4>6.1 EM-129 Configuration</h4>
  <table>
  
  <tr>
    <td style="padding-right: 20px;"><strong>EM129 Version:</strong> ${formData.em129Version}</td>
    <td style="padding-right: 20px;"><strong>EM129 Settings:</strong> ${formData.em129Settings}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>EM129 Signal Status:</strong> ${formData.em129SignalStatus}</td>
    <td style="padding-right: 20px;"><strong>EM129 Network Settings:</strong> ${formData.em129NetworkSettings}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>EM129 Interface Config:</strong> ${formData.em129InterfaceConfig}</td>
    <td style="padding-right: 20px;"><strong>EM129 Scope:</strong> ${formData.em129Scope}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>EM129 Comments:</strong> ${formData.em129Comments}</td>
    <td style="padding-right: 20px;"><strong>OSD Description:</strong> ${formData.osdDescription}</td>
  </tr>
  </table>
  <h4>6.2 osd Software Configuration</h4>
  <table>

  <tr>
    <td style="padding-right: 20px;"><strong>OSD Movement:</strong> ${formData.osdMovement}</td>
    <td style="padding-right: 20px;"><strong>OSD Lat:</strong> ${formData.osdLat}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>OSD Long:</strong> ${formData.osdLong}</td>
    <td style="padding-right: 20px;"><strong>OSD Heading:</strong> ${formData.osdHeading}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>OSD Radar:</strong> ${formData.osdRadar}</td>
    <td style="padding-right: 20px;"><strong>OSD Multicast:</strong> ${formData.osdMulticast}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>OSD Transceiver:</strong> ${formData.osdTransceiver}</td>
    <td style="padding-right: 20px;"><strong>OSD RinId:</strong> ${formData.osdRinId}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>OSD RinNetwork:</strong> ${formData.osdRinNetwork}</td>
    <td style="padding-right: 20px;"><strong>OSD Image Storage:</strong> ${formData.osdImageStorage}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>OSD GPS:</strong> ${formData.osdGPS}</td>
    <td style="padding-right: 20px;"><strong>OSD GPS Position Sentence:</strong> ${formData.osdGPSPositionSentence}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>OSD GPS Track Speed Sentence:</strong> ${formData.osdGPSTrackSpeedSentence}</td>
    <td style="padding-right: 20px;"><strong>OSD GPS Time Sentence:</strong> ${formData.osdGPSTimeSentence}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>OSD GPS Settings:</strong> ${formData.osdGPSSettings}</td>
    <td style="padding-right: 20px;"><strong>OSD Gyro:</strong> ${formData.osdGyro}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>OSD Gyro Sentence:</strong> ${formData.osdGyroSentence}</td>
    <td style="padding-right: 20px;"><strong>OSD Gyro Settings:</strong> ${formData.osdGyroSettings}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>OSD Wind:</strong> ${formData.osdWind}</td>
    <td style="padding-right: 20px;"><strong>OSD Wind Sentence:</strong> ${formData.osdWindSentence}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>OSD Wind Settings:</strong> ${formData.osdWindSettings}</td>
    <td style="padding-right: 20px;"><strong>OSD Wave:</strong> ${formData.osdWave}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>OSD Wave Sentence:</strong> ${formData.osdWaveSentence}</td>
    <td style="padding-right: 20px;"><strong>OSD Wave Settings:</strong> ${formData.osdWaveSettings}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>OSD Draught:</strong> ${formData.osdDraught}</td>
    <td style="padding-right: 20px;"><strong>OSD Draught Sentence:</strong> ${formData.osdDraughtSentence}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>OSD Draught Settings:</strong> ${formData.osdDraughtSettings}</td>
  </tr>

  <tr>
    <td style="padding-right: 20px;"><strong>OSD Speed Log:</strong> ${formData.osdSpeedlog}</td>
    <td style="padding-right: 20px;"><strong>OSD Speed Log Sentence:</strong> ${formData.osdSpeedlogSentence}</td>
    <td style="padding-right: 20px;"><strong>OSD Speed Log Settings:</strong> ${formData.osdSpeedlogSettings}</td>
  </tr>
  <tr>
  <td style="padding-right: 20px;"><strong>OSD Geometry Radar X:</strong> ${formData.osdGeometryRadarX}</td>
    <td style="padding-right: 20px;"><strong>OSD Geometry Radar Y:</strong> ${formData.osdGeometryRadarY}</td>
    <td style="padding-right: 20px;"><strong>OSD Geometry Radar Z:</strong> ${formData.osdGeometryRadarZ}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>OSD Geometry GPS X:</strong> ${formData.osdGeometryGPSX}</td>
    <td style="padding-right: 20px;"><strong>OSD Geometry GPS Y:</strong> ${formData.osdGeometryGPSY}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>OSD Geometry Wind Heading Offset:</strong> ${formData.osdGeometryWindHeadingOffset}</td>
    <td style="padding-right: 20px;"><strong>OSD Geometry Wind Z:</strong> ${formData.osdGeometryWindZ}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>OSD Radar Range Offset:</strong> ${formData.osdRadarRangeOffset}</td>
    <td style="padding-right: 20px;"><strong>OSD Radar Azimuth Offset:</strong> ${formData.osdRadarAzimuthOffset}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>OSD Radar Start Angle:</strong> ${formData.osdRadarStartAngle}</td>
    <td style="padding-right: 20px;"><strong>OSD Radar Sector Size:</strong> ${formData.osdRadarSectorSize}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>OSD Radar Start Range:</strong> ${formData.osdRadarStartRange}</td>
    <td style="padding-right: 20px;"><strong>OSD Radar Stop Range:</strong> ${formData.osdRadarStopRange}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>OSD Radar Image Check:</strong> ${formData.osdRadarImageCheck}</td>
    <td style="padding-right: 20px;"><strong>OSD Advanced Wave Antenna Mean Height:</strong> ${formData.osdAdvancedWaveAntennaMeanHeight}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>OSD Advanced Wave Cartesian Sections:</strong> ${formData.osdAdvancedWaveCartesianSections}</td>
    <td style="padding-right: 20px;"><strong>OSD Advanced Current Antenna Mean Height:</strong> ${formData.osdAdvancedCurrentAntennaMeanHeight}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>OSD Advanced Current Cartesian Sections:</strong> ${formData.osdAdvancedCurrentCartesianSections}</td>
    <td style="padding-right: 20px;"><strong>OSD Output 1:</strong> ${formData.osdOutput1}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>OSD Output 1 Sentence:</strong> ${formData.osdOutput1Sentence}</td>
    <td style="padding-right: 20px;"><strong>OSD Output 1 Update Interval:</strong> ${formData.osdOutput1UpdateInterval}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>OSD Output 1 Settings:</strong> ${formData.osdOutput1Settings}</td>
    <td style="padding-right: 20px;"><strong>OSD Output 2:</strong> ${formData.osdOutput2}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>OSD Output 2 Sentence:</strong> ${formData.osdOutput2Sentence}</td>
    <td style="padding-right: 20px;"><strong>OSD Output 2 Update Interval:</strong> ${formData.osdOutput2UpdateInterval}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>OSD Output 2 Settings:</strong> ${formData.osdOutput2Settings}</td>
    <td style="padding-right: 20px;"><strong>OSD Output 3:</strong> ${formData.osdOutput3}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>OSD Output 3 Sentence:</strong> ${formData.osdOutput3Sentence}</td>
    <td style="padding-right: 20px;"><strong>OSD Output 3 Update Interval:</strong> ${formData.osdOutput3UpdateInterval}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>OSD Output 3 Settings:</strong> ${formData.osdOutput3Settings}</td>
    <td style="padding-right: 20px;"><strong>Cloud Enabled:</strong> ${formData.cloudEnabled}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>Final Config:</strong> ${formData.finalConfig}</td>
  </tr>
  </table>
  <h3>7. Final Start-up</h3>
  <table>
  <tr>
  <td style="padding-right: 20px;"><strong>Final Power Cycle:</strong> ${formData.finalPowerCycle}</td>
  <td style="padding-right: 20px;"><strong>Final Startup:</strong> ${formData.finalStartup}</td>
    <td style="padding-right: 20px;"><strong>Final 20 Minute:</strong> ${formData.final20Minute}</td>
    <td style="padding-right: 20px;"><strong>Final Data Output:</strong> ${formData.finalDataOutput}</td>
  </tr>
  </table>
  <h3>8. System Backup</h3>
  <table>
  <tr>
    <td style="padding-right: 20px;"><strong>Backup Configuration:</strong> ${formData.backuposdJson}</td>
    <td style="padding-right: 20px;"><strong>Backup DF047:</strong> ${formData.backupDF047}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>Backup EM129:</strong> ${formData.backupEM129}</td>
    <td style="padding-right: 20px;"><strong>Backup Misc:</strong> ${formData.backupMisc}</td>
  </tr>
  </table>
  <h3>9. Login Details</h3>

  <table>

  <thead>
  <tr>
    <th class="table-cell table-header">Type</th>
    <th class="table-cell table-header">Username</th>
    <th class="table-cell table-header">Password</th>
    <th class="table-cell table-header">Comments</th>
  </tr>
</thead>


<tr>
  <td class="table-cell">${formData.loginType1 || ''}</td>
  <td class="table-cell">${formData.loginUsername1 || ''}</td>
  <td class="table-cell">${formData.loginPassword1 || ''}</td>
  <td class="table-cell">${formData.loginComments1 || ''}</td>
</tr>
<tr>
  <td class="table-cell">${formData.loginType2 || ''}</td>
  <td class="table-cell">${formData.loginUsername2 || ''}</td>
  <td class="table-cell">${formData.loginPassword2 || ''}</td>
  <td class="table-cell">${formData.loginComments2 || ''}</td>
</tr>
<tr>
  <td class="table-cell">${formData.loginType3 || ''}</td>
  <td class="table-cell">${formData.loginUsername3 || ''}</td>
  <td class="table-cell">${formData.loginPassword3 || ''}</td>
  <td class="table-cell">${formData.loginComments3 || ''}</td>
</tr>
</table>




<div style="text-align: center;">
<br>
<!-- Display uploaded images in a grid layout -->
<div class="image-container">
  ${imageUrls.map(url => `<div><img src="${url}" style="max-width: 100%;"></div>`).join('')}
</div>

 
  </div>
  
  <footer class="footer">
  <!-- Footer content -->
  <p>&copy; 2024 Miros Group. All rights reserved.</p>
  <p><a href="https://www.miros-group.com" style="color: white;">Miros Cloud Terms & Conditions</a></p>
  <a href="https://www.miros-group.com">
  <img src="https://miros.app/miros-logo-two-tone-light.631848d3e1f5088e7f228ac7b63d6dbc.svg" style="width: 100px;">
</a>

</footer>
  
  </body>
  </html>
  `;

  const newWindow = window.open('', '_blank');
  newWindow.document.write(html);
  newWindow.document.close();
}




function openFullReportMocean() {
  const formData = JSON.parse(localStorage.getItem('formData'));
  var workStatusValue = document.querySelector('select[name="workStatus"]').value;

  if (workStatusValue === 'Complete') {
    alert('Please ensure the site is set to "Commissioned" in the Miros Cloud administration area.');
  }


  if (workStatusValue !== 'Complete' && workStatusValue !== 'In Progress' && workStatusValue !== 'Needs Attention') {
    alert('Check the work status. It is not possible to generate a report or certificate at this stage.');
    return;
  }

  const selectedElements = {
    system: formData.system,
    workType: formData.workType,
    site: formData.site,
    siteType: formData.siteType,
    customer: formData.customer,
    date: formData.date,
    imo: formData.imo,
    location: formData.location,
    engineer: formData.engineer,
    engineer2: formData.engineer2,
    recordEquipment1: formData.recordEquipment1,
    equipmentManufact1: formData.equipmentManufact1,
    equipmentModel1: formData.equipmentModel1,
    equipmentPartNo1: formData.equipmentPartNo1,
    equipmentSerialNo1: formData.equipmentSerialNo1,
    equipmentLocation1: formData.equipmentLocation1,
    recordEquipment2: formData.recordEquipment2,
    equipmentManufact2: formData.equipmentManufact2,
    equipmentModel2: formData.equipmentModel2,
    equipmentPartNo2: formData.equipmentPartNo2,
    equipmentSerialNo2: formData.equipmentSerialNo2,
    equipmentLocation2: formData.equipmentLocation2,
    recordEquipment3: formData.recordEquipment3,
    equipmentManufact3: formData.equipmentManufact3,
    equipmentModel3: formData.equipmentModel3,
    equipmentPartNo3: formData.equipmentPartNo3,
    equipmentSerialNo3: formData.equipmentSerialNo3,
    equipmentLocation3: formData.equipmentLocation3,
    recordEquipment4: formData.recordEquipment4,
    equipmentManufact4: formData.equipmentManufact4,
    equipmentModel4: formData.equipmentModel4,
    equipmentPartNo4: formData.equipmentPartNo4,
    equipmentSerialNo4: formData.equipmentSerialNo4,
    equipmentLocation4: formData.equipmentLocation4,
    recordEquipment5: formData.recordEquipment5,
    equipmentManufact5: formData.equipmentManufact5,
    equipmentModel5: formData.equipmentModel5,
    equipmentPartNo5: formData.equipmentPartNo5,
    equipmentSerialNo5: formData.equipmentSerialNo5,
    equipmentLocation5: formData.equipmentLocation5,
    recordEquipment6: formData.recordEquipment6,
    equipmentManufact6: formData.equipmentManufact6,
    equipmentModel6: formData.equipmentModel6,
    equipmentPartNo6: formData.equipmentPartNo6,
    equipmentSerialNo6: formData.equipmentSerialNo6,
    equipmentLocation6: formData.equipmentLocation6,
    recordEquipment7: formData.recordEquipment7,
    equipmentManufact7: formData.equipmentManufact7,
    equipmentModel7: formData.equipmentModel7,
    equipmentPartNo7: formData.equipmentPartNo7,
    equipmentSerialNo7: formData.equipmentSerialNo7,
    equipmentLocation7: formData.equipmentLocation7,
    recordEquipment8: formData.recordEquipment8,
    equipmentManufact8: formData.equipmentManufact8,
    equipmentModel8: formData.equipmentModel8,
    equipmentPart8: formData.equipmentPart8,
    equipmentSerial8: formData.equipmentSerial8,
    equipmentLocation8: formData.equipmentLocation8,
    checkEquipment1: formData.checkEquipment1,
    checkVisual1: formData.checkVisual1,
    checkMech1: formData.checkMech1,
    checkCabling1: formData.checkCabling1,
    checkPower1: formData.checkPower1,
    checkEarthing1: formData.checkEarthing1,
    checkEquipment2: formData.checkEquipment2,
    checkVisual2: formData.checkVisual2,
    checkMech2: formData.checkMech2,
    checkCabling2: formData.checkCabling2,
    checkPower2: formData.checkPower2,
    checkEarthing2: formData.checkEarthing2,
    checkEquipment3: formData.checkEquipment3,
    checkVisual3: formData.checkVisual3,
    checkMech3: formData.checkMech3,
    checkCabling3: formData.checkCabling3,
    checkPower3: formData.checkPower3,
    checkEarthing3: formData.checkEarthing3,
    checkEquipment4: formData.checkEquipment4,
    checkVisual4: formData.checkVisual4,
    checkMech4: formData.checkMech4,
    checkCabling4: formData.checkCabling4,
    checkPower4: formData.checkPower4,
    checkEarthing4: formData.checkEarthing4,

    checkEquipment5: formData.checkEquipment5,
    checkVisual5: formData.checkVisual5,
    checkMech5: formData.checkMech5,
    checkCabling5: formData.checkCabling5,
    checkPower5: formData.checkPower5,
    checkEarthing5: formData.checkEarthing5,

    checkEquipment6: formData.checkEquipment6,
    checkVisual6: formData.checkVisual6,
    checkMech6: formData.checkMech6,
    checkCabling6: formData.checkCabling6,
    checkPower6: formData.checkPower6,
    checkEarthing6: formData.checkEarthing6,

    checkEquipment7: formData.checkEquipment7,
    checkVisual7: formData.checkVisual7,
    checkMech7: formData.checkMech7,
    checkCabling7: formData.checkCabling7,
    checkPower7: formData.checkPower7,
    checkEarthing7: formData.checkEarthing7,

    checkEquipment8: formData.checkEquipment8,
    checkVisual8: formData.checkVisual8,
    checkMech8: formData.checkMech8,
    checkCabling8: formData.checkCabling8,
    checkPower8: formData.checkPower8,
    checkEarthing8: formData.checkEarthing8,

    radarManufacturer: formData.radarManufacturer,
    radarModel: formData.radarModel,
    radarUse: formData.radarUse,
    radarTxtime: formData.radarTxtime,
    radarLocation: formData.radarLocation,
    radarSettings: formData.radarSettings,
    gpsCheck: formData.gpsCheck,
    gyroCheck: formData.gyroCheck,
    windCheck: formData.windCheck,
    draughtCheck: formData.draughtCheck,
    waveCheck: formData.waveCheck,
    speedlogCheck: formData.speedlogCheck,
    shaftCheck: formData.shaftCheck,



    videoCableType: formData.videoCableType,
    videoCableImpedance: formData.videoCableImpedance,
    videoCableComments: formData.videoCableComments,
    syncCableType: formData.syncCableType,
    syncCableImpedance: formData.syncCableImpedance,
    syncCableComments: formData.syncCableComments,
    azimuthCableType: formData.azimuthCableType,
    azimuthCableImpedance: formData.azimuthCableImpedance,
    azimuthCableComments: formData.azimuthCableComments,
    headingCableType: formData.headingCableType,
    headingCableImpedance: formData.headingCableImpedance,
    headingCableComments: formData.headingCableComments,
    videoJumper: formData.videoJumper,
    syncJumper: formData.syncJumper,
    azimuthJumper: formData.azimuthJumper,
    headingJumper: formData.headingJumper,
    pullupJumper: formData.pullupJumper,
    pulldownJumper: formData.pulldownJumper,
    amplifierType: formData.amplifierType,
    amplifierCheck: formData.amplifierCheck,
    amplifierComments: formData.amplifierComments,
    radarFirewallType: formData.radarFirewallType,
    radarFirewallCheck: formData.radarFirewallCheck,
    radarFirewallComments: formData.radarFirewallComments,
    serialInterfaceType: formData.serialInterfaceType,
    serialInterfaceCheck: formData.serialInterfaceCheck,
    serialInterfaceComments: formData.serialInterfaceComments,
    networkEquipment1: formData.networkEquipment1,
    equipmentIpAddress1: formData.equipmentIpAddress1,
    equipmentSubnetMask1: formData.equipmentSubnetMask1,
    equipmentDefaultGateway1: formData.equipmentDefaultGateway1,
    equipmentMac1: formData.equipmentMac1,
    networkEquipment2: formData.networkEquipment2,
    equipmentIpAddress2: formData.equipmentIpAddress2,
    equipmentSubnetMask2: formData.equipmentSubnetMask2,
    equipmentDefaultGateway2: formData.equipmentDefaultGateway2,
    equipmentMac2: formData.equipmentMac2,
    networkEquipment3: formData.networkEquipment3,
    equipmentIpAddress3: formData.equipmentIpAddress3,
    equipmentSubnetMask3: formData.equipmentSubnetMask3,
    equipmentDefaultGateway3: formData.equipmentDefaultGateway3,
    equipmentMac3: formData.equipmentMac3,
    networkEquipment4: formData.networkEquipment4,
    equipmentIpAddress4: formData.equipmentIpAddress4,
    equipmentSubnetMask4: formData.equipmentSubnetMask4,
    equipmentDefaultGateway4: formData.equipmentDefaultGateway4,
    equipmentMac4: formData.equipmentMac4,
    networkEquipment5: formData.networkEquipment5,
    equipmentIpAddress5: formData.equipmentIpAddress5,
    equipmentSubnetMask5: formData.equipmentSubnetMask5,
    equipmentDefaultGateway5: formData.equipmentDefaultGateway5,
    equipmentMac5: formData.equipmentMac5,
    networkEquipment6: formData.networkEquipment6,
    equipmentIpAddress6: formData.equipmentIpAddress6,
    equipmentSubnetMask6: formData.equipmentSubnetMask6,
    equipmentDefaultGateway6: formData.equipmentDefaultGateway6,
    equipmentMac6: formData.equipmentMac6,
    networkEquipment7: formData.networkEquipment7,
    equipmentIpAddress7: formData.equipmentIpAddress7,
    equipmentSubnetMask7: formData.equipmentSubnetMask7,
    equipmentDefaultGateway7: formData.equipmentDefaultGateway7,
    equipmentMac7: formData.equipmentMac7,
    networkEquipment8: formData.networkEquipment8,
    equipmentIpAddress8: formData.equipmentIpAddress8,
    equipmentSubnetMask8: formData.equipmentSubnetMask8,
    equipmentDefaultGateway8: formData.equipmentDefaultGateway8,
    equipmentMac8: formData.equipmentMac8,
    networkDns: formData.networkDns,
    networkComments: formData.networkComments,
    cloudHost1: formData.cloudHost1,
    cloudHost2: formData.cloudHost2,
    computerStartup: formData.computerStartup,
    systemRequirements: formData.systemRequirements,
    windowsVersion: formData.windowsVersion,
    wavexStartup: formData.wavexStartup,
    wavexOptions: formData.wavexOptions,
    thirdPartyStartup: formData.thirdPartyStartup,
    storageSpace: formData.storageSpace,
    remoteAccessTools: formData.remoteAccessTools,
    serialMouseFix: formData.serialMouseFix,
    networkInterfaceConfig: formData.networkInterfaceConfig,
    windowsFirewall: formData.windowsFirewall,
    antiVirus: formData.antiVirus,
    gpsCheck2: formData.gpsCheck2,
    gyroCheck2: formData.gyroCheck2,
    windCheck2: formData.windCheck2,
    draughtCheck2: formData.draughtCheck2,
    waveCheck2: formData.waveCheck2,
    speedlogCheck2: formData.speedlogCheck2,
    shaftCheck2: formData.shaftCheck2,
    em129Version: formData.em129Version,
    em129Settings: formData.em129Settings,
    em129SignalStatus: formData.em129SignalStatus,
    em129NetworkSettings: formData.em129NetworkSettings,
    em129InterfaceConfig: formData.em129InterfaceConfig,
    em129Scope: formData.em129Scope,
    em129Comments: formData.em129Comments,
    wavexDescription: formData.wavexDescription,
    wavexMovement: formData.wavexMovement,
    wavexLat: formData.wavexLat,
    wavexLong: formData.wavexLong,
    wavexHeading: formData.wavexHeading,
    wavexRadar: formData.wavexRadar,
    wavexMulticast: formData.wavexMulticast,
    wavexTransceiver: formData.wavexTransceiver,
    wavexRinId: formData.wavexRinId,
    wavexRinNetwork: formData.wavexRinNetwork,
    wavexImageStorage: formData.wavexImageStorage,
    wavexGPS: formData.wavexGPS,
    wavexGPSPositionSentence: formData.wavexGPSPositionSentence,
    wavexGPSTrackSpeedSentence: formData.wavexGPSTrackSpeedSentence,
    wavexGPSTimeSentence: formData.wavexGPSTimeSentence,
    wavexGPSSettings: formData.wavexGPSSettings,
    wavexGyro: formData.wavexGyro,
    wavexGyroSentence: formData.wavexGyroSentence,
    wavexGyroSettings: formData.wavexGyroSettings,
    wavexWind: formData.wavexWind,
    wavexWindSentence: formData.wavexWindSentence,
    wavexWindSettings: formData.wavexWindSettings,
    wavexWave: formData.wavexWave,
    wavexWaveSentence: formData.wavexWaveSentence,
    wavexWaveSettings: formData.wavexWaveSettings,
    wavexDraught: formData.wavexDraught,
    wavexDraughtSentence: formData.wavexDraughtSentence,
    wavexDraughtSettings: formData.wavexDraughtSettings,

    wavexSpeedlog: formData.wavexSpeedlog,
    wavexSpeedlogSentence: formData.wavexSpeedlogSentence,
    wavexSpeedlogSettings: formData.wavexSpeedlogSettings,

    wavexShaft: formData.wavexShaft,
    wavexShaftSentence: formData.wavexShaftSentence,
    wavexShaftSettings: formData.wavexShaftSettings,



    wavexGeometryRadarX: formData.wavexGeometryRadarX,
    wavexGeometryRadarY: formData.wavexGeometryRadarY,
    wavexGeometryRadarZ: formData.wavexGeometryRadarZ,
    wavexGeometryGPSX: formData.wavexGeometryGPSX,
    wavexGeometryGPSY: formData.wavexGeometryGPSY,
    wavexGeometryWindHeadingOffset: formData.wavexGeometryWindHeadingOffset,
    wavexGeometryWindZ: formData.wavexGeometryWindZ,
    wavexRadarRangeOffset: formData.wavexRadarRangeOffset,
    wavexRadarAzimuthOffset: formData.wavexRadarAzimuthOffset,
    wavexRadarStartAngle: formData.wavexRadarStartAngle,
    wavexRadarSectorSize: formData.wavexRadarSectorSize,
    wavexRadarStartRange: formData.wavexRadarStartRange,
    wavexRadarStopRange: formData.wavexRadarStopRange,
    wavexRadarImageCheck: formData.wavexRadarImageCheck,
    wavexAdvancedWaveAntennaMeanHeight: formData.wavexAdvancedWaveAntennaMeanHeight,
    wavexAdvancedWaveCartesianSections: formData.wavexAdvancedWaveCartesianSections,
    wavexAdvancedCurrentAntennaMeanHeight: formData.wavexAdvancedCurrentAntennaMeanHeight,
    wavexAdvancedCurrentCartesianSections: formData.wavexAdvancedCurrentCartesianSections,
    wavexOutput1: formData.wavexOutput1,
    wavexOutput1Sentence: formData.wavexOutput1Sentence,
    wavexOutput1UpdateInterval: formData.wavexOutput1UpdateInterval,
    wavexOutput1Settings: formData.wavexOutput1Settings,
    wavexOutput2: formData.wavexOutput2,
    wavexOutput2Sentence: formData.wavexOutput2Sentence,
    wavexOutput2UpdateInterval: formData.wavexOutput2UpdateInterval,
    wavexOutput2Settings: formData.wavexOutput2Settings,
    wavexOutput3: formData.wavexOutput3,
    wavexOutput3Sentence: formData.wavexOutput3Sentence,
    wavexOutput3UpdateInterval: formData.wavexOutput3UpdateInterval,
    wavexOutput3Settings: formData.wavexOutput3Settings,
    cloudEnabled: formData.cloudEnabled,
    finalConfig: formData.finalConfig,
    finalPowerCycle: formData.finalPowerCycle,
    finalStartup: formData.finalStartup,
    final20Minute: formData.final20Minute,
    finalDataOutput: formData.finalDataOutput,
    backupWavexJson: formData.backupWavexJson,
    backupDF047: formData.backupDF047,
    backupEM129: formData.backupEM129,
    backupMisc: formData.backupMisc,
    loginType1: formData.loginType1,
    loginUsername1: formData.loginUsername1,
    loginPassword1: formData.loginPassword1,
    loginComments1: formData.loginComments1,
    loginType2: formData.loginType2,
    loginUsername2: formData.loginUsername2,
    loginPassword2: formData.loginPassword2,
    loginComments2: formData.loginComments2,
    loginType3: formData.loginType3,
    loginUsername2: formData.loginUsername3,
    loginPassword3: formData.loginPassword3,
    loginComments3: formData.loginComments3,
    workStatus: formData.workStatus,
    subscriptionStatus: formData.subscriptionStatus,
    subscriptionExpiry: formData.subscriptionExpiry,
    generalComments: formData.generalComments
  };

  // Retrieve uploaded images
  const uploadedImages = document.querySelectorAll('.uploaded-images img');
  const imageUrls = Array.from(uploadedImages).map(img => img.src);


  const html = `
  <!DOCTYPE html>
  <html>
  <head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Miros Site Report</title>
  <link rel="stylesheet" type="text/css" href="style_report.css">
</head>  
<body>

<div class="header">
  <div class="text-container">
  <img src="https://mocean.miros.app/miros-mocean-logo.6761c3f7e4f32ff93e9fa5cb0303d3dd.svg" style="width: 200px; padding-bottom: 10px;">
  <div class="info"><span class="label">System:</span> <span class="value">${selectedElements.system}</span></div>
    <div class="info"><span class="label">Site:</span> <span class="value">${selectedElements.site}</span></div>
    <div class="info"><span class="label">Customer:</span> <span class="value">${selectedElements.customer}</span></div>
    <div class="info"><span class="label">Date:</span> <span class="value">${selectedElements.date}</span></div>
    <div class="info"><span class="label">Work Type:</span> <span class="value">${selectedElements.workType}</span></div>
    <div class="info"><span class="label">Work Status:</span> <span class="value">${selectedElements.workStatus}</span></div>
    <div class="info"><span class="label">Subscription Expiry:</span> <span class="value">${selectedElements.subscriptionStatus},${selectedElements.subscriptionExpiry}</span></div>
</div>
<!-- Large image to the right -->
<EDITimg src="header.jpeg" alt="Large Image Description" class="large-image">
</div>


<div class="container">
  <h2>Site Report</h2>
  <h3>1. Overview</h3>
  <p style="max-width: 750px;">${selectedElements.generalComments}</p>

  <table class="info-table">
  <!-- System -->
  <tr>
    <td class="label">System:</td>
    <td>${selectedElements.system}</td>
  </tr>
  <!-- Site Type -->
  <tr>
    <td class="label">Site Type:</td>
    <td>${selectedElements.siteType}</td>
  </tr>
  <!-- IMO -->
  <tr>
    <td class="label">IMO:</td>
    <td>${selectedElements.imo}</td>
  </tr>
  <!-- Work Type -->
  <tr>
    <td class="label">Work Type:</td>
    <td>${selectedElements.workType}</td>
  </tr>
  <!-- Customer -->
  <tr>
    <td class="label">Customer:</td>
    <td>${selectedElements.customer}</td>
  </tr>
  <!-- Location -->
  <tr>
    <td class="label">Location:</td>
    <td>${selectedElements.location}</td>
  </tr>
  <!-- Site -->
  <tr>
    <td class="label">Site:</td>
    <td>${selectedElements.site}</td>
  </tr>
  <!-- Date -->
  <tr>
    <td class="label">Date:</td>
    <td>${selectedElements.date}</td>
  </tr>
  <!-- Engineer -->
  <tr>
    <td class="label">Engineer(s):</td>
    <td>${selectedElements.engineer}</td>
  </tr>
  <tr>
  <td class="label"></td>
  ${selectedElements.engineer2 ? `<td>${selectedElements.engineer2}</td>` : ''}
  </tr>

</table>




<h3>2. Record Equipment</h3>
<table>
  <thead>
    <tr>
      <th class="table-cell table-header">Equipment</th>
      <th class="table-cell table-header">Manufacturer</th>
      <th class="table-cell table-header">Model</th>
      <th class="table-cell table-header">Part No</th>
      <th class="table-cell table-header">Serial No.</th>
      <th class="table-cell table-header">Location</th>
    </tr>
  </thead>
  <tbody>
    <!-- Equipment row 1 -->
    <tr>
    <td class="table-cell">${selectedElements.recordEquipment1 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentManufact1 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentModel1 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentPartNo1 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentSerialNo1 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentLocation1 || ''}</td>
  </tr>
  <tr>
    <td class="table-cell">${selectedElements.recordEquipment2 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentManufact2 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentModel2 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentPartNo2 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentSerialNo2 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentLocation2 || ''}</td>
  </tr>
  <tr>
    <td class="table-cell">${selectedElements.recordEquipment3 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentManufact3 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentModel3 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentPartNo3 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentSerialNo3 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentLocation3 || ''}</td>
  </tr>
  <tr>
    <td class="table-cell">${selectedElements.recordEquipment4 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentManufact4 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentModel4 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentPartNo4 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentSerialNo4 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentLocation4 || ''}</td>
  </tr>
  <tr>
    <td class="table-cell">${selectedElements.recordEquipment5 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentManufact5 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentModel5 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentPartNo5 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentSerialNo5 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentLocation5 || ''}</td>
  </tr>
  <tr>
    <td class="table-cell">${selectedElements.recordEquipment6 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentManufact6 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentModel6 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentPartNo6 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentSerialNo6 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentLocation6 || ''}</td>
  </tr>
  <tr>
    <td class="table-cell">${selectedElements.recordEquipment7 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentManufact7 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentModel7 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentPartNo7 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentSerialNo7 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentLocation7 || ''}</td>
  </tr>
  <tr>
    <td class="table-cell">${selectedElements.recordEquipment8 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentManufact8 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentModel8 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentPartNo8 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentSerialNo8 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentLocation8 || ''}</td>
  </tr>
    </tbody>
</table>
<div class="line_sub"></div>


<h3>3. Check Equipment</h3>
<h4>3.1 Equipment</h4>
<table>

<thead>
<tr>
  <th class="table-cell table-header">Equipment</th>
  <th class="table-cell table-header">Visual</th>
  <th class="table-cell table-header">Mechanical</th>
  <th class="table-cell table-header">Cabling</th>
  <th class="table-cell table-header">Power</th>
  <th class="table-cell table-header">Earthing</th>
</tr>
</thead>

<tbody>
<tr>
  <td class="table-cell">${selectedElements.checkEquipment1 || ''}</td>
  <td class="table-cell">${selectedElements.checkVisual1 || ''}</td>
  <td class="table-cell">${selectedElements.checkMech1 || ''}</td>
  <td class="table-cell">${selectedElements.checkCabling1 || ''}</td>
  <td class="table-cell">${selectedElements.checkPower1 || ''}</td>
  <td class="table-cell">${selectedElements.checkEarthing1 || ''}</td>
</tr>
<tr>
  <td class="table-cell">${selectedElements.checkEquipment2 || ''}</td>
  <td class="table-cell">${selectedElements.checkVisual2 || ''}</td>
  <td class="table-cell">${selectedElements.checkMech2 || ''}</td>
  <td class="table-cell">${selectedElements.checkCabling2 || ''}</td>
  <td class="table-cell">${selectedElements.checkPower2 || ''}</td>
  <td class="table-cell">${selectedElements.checkEarthing2 || ''}</td>
</tr>
<tr>
  <td class="table-cell">${selectedElements.checkEquipment3 || ''}</td>
  <td class="table-cell">${selectedElements.checkVisual3 || ''}</td>
  <td class="table-cell">${selectedElements.checkMech3 || ''}</td>
  <td class="table-cell">${selectedElements.checkCabling3 || ''}</td>
  <td class="table-cell">${selectedElements.checkPower3 || ''}</td>
  <td class="table-cell">${selectedElements.checkEarthing3 || ''}</td>
</tr>
<tr>
  <td class="table-cell">${selectedElements.checkEquipment4 || ''}</td>
  <td class="table-cell">${selectedElements.checkVisual4 || ''}</td>
  <td class="table-cell">${selectedElements.checkMech4 || ''}</td>
  <td class="table-cell">${selectedElements.checkCabling4 || ''}</td>
  <td class="table-cell">${selectedElements.checkPower4 || ''}</td>
  <td class="table-cell">${selectedElements.checkEarthing4 || ''}</td>
</tr>
<tr>
  <td class="table-cell">${selectedElements.checkEquipment5 || ''}</td>
  <td class="table-cell">${selectedElements.checkVisual5 || ''}</td>
  <td class="table-cell">${selectedElements.checkMech5 || ''}</td>
  <td class="table-cell">${selectedElements.checkCabling5 || ''}</td>
  <td class="table-cell">${selectedElements.checkPower5 || ''}</td>
  <td class="table-cell">${selectedElements.checkEarthing5 || ''}</td>
</tr>
<tr>
  <td class="table-cell">${selectedElements.checkEquipment6 || ''}</td>
  <td class="table-cell">${selectedElements.checkVisual6 || ''}</td>
  <td class="table-cell">${selectedElements.checkMech6 || ''}</td>
  <td class="table-cell">${selectedElements.checkCabling6 || ''}</td>
  <td class="table-cell">${selectedElements.checkPower6 || ''}</td>
  <td class="table-cell">${selectedElements.checkEarthing6 || ''}</td>
</tr>
<tr>
  <td class="table-cell">${selectedElements.checkEquipment7 || ''}</td>
  <td class="table-cell">${selectedElements.checkVisual7 || ''}</td>
  <td class="table-cell">${selectedElements.checkMech7 || ''}</td>
  <td class="table-cell">${selectedElements.checkCabling7 || ''}</td>
  <td class="table-cell">${selectedElements.checkPower7 || ''}</td>
  <td class="table-cell">${selectedElements.checkEarthing7 || ''}</td>
</tr>
<tr>
  <td class="table-cell">${selectedElements.checkEquipment8 || ''}</td>
  <td class="table-cell">${selectedElements.checkVisual8 || ''}</td>
  <td class="table-cell">${selectedElements.checkMech8 || ''}</td>
  <td class="table-cell">${selectedElements.checkCabling8 || ''}</td>
  <td class="table-cell">${selectedElements.checkPower8 || ''}</td>
  <td class="table-cell">${selectedElements.checkEarthing8 || ''}</td>
</tr>
</tbody>
</table>
<h4>3.2 Equipment Specific Checks</h4>

  <h4>Radar</h4>
  <table>
  <tr>
  <td class="table-cell"><span class="emphasis">Radar Manufacturer:</span> ${selectedElements.radarManufacturer}</td>
  <td style="padding-right: 20px;"><strong>Radar Model:</strong> ${selectedElements.radarModel}</td>
    </tr>
    <tr>  

    <td style="padding-right: 20px;"><strong>Radar Use:</strong> ${selectedElements.radarUse}</td>
    <td style="padding-right: 20px;"><strong>Radar Txtime:</strong> ${selectedElements.radarTxtime}</td>
    </tr>
    <tr>  

    <td style="padding-right: 20px;"><strong>Radar Location:</strong> ${selectedElements.radarLocation}</td>
    <td style="padding-right: 20px;"><strong>Radar Settings:</strong> ${selectedElements.radarSettings}</td>
  </tr>
  </table>
  <h4>Other Checks</h4>
  <table>
  <tr>
    <td style="padding-right: 20px;"><strong>GPS Check:</strong> ${selectedElements.gpsCheck}</td>
    <td style="padding-right: 20px;"><strong>Gyro Check:</strong> ${selectedElements.gyroCheck}</td>
    <td style="padding-right: 20px;"><strong>Wind Check:</strong> ${selectedElements.windCheck}</td>
    </tr>
    <tr>  
    <td style="padding-right: 20px;"><strong>Draught Check:</strong> ${selectedElements.draughtCheck}</td>
    <td style="padding-right: 20px;"><strong>Wave Check:</strong> ${selectedElements.waveCheck}</td>
    <td style="padding-right: 20px;"><strong>Speed Log Check:</strong> ${selectedElements.speedlogCheck}</td>
    <td style="padding-right: 20px;"><strong>Shaft Check:</strong> ${selectedElements.shaftCheck}</td>

  </tr>
  </table>
  <h4>Radar Signal Cable Checks</h4>
  <table>
  <tr>
  <td style="padding-right: 20px;"><strong>Video Cable Type:</strong> ${selectedElements.videoCableType}</td>
    <td style="padding-right: 20px;"><strong>Video Cable Impedance:</strong> ${selectedElements.videoCableImpedance}</td>
    <td style="padding-right: 20px;"><strong>Video Cable Comments:</strong> ${selectedElements.videoCableComments}</td>
    </tr>
    <tr>
  
    <td style="padding-right: 20px;"><strong>Sync Cable Type:</strong> ${selectedElements.syncCableType}</td>
    <td style="padding-right: 20px;"><strong>Sync Cable Impedance:</strong> ${selectedElements.syncCableImpedance}</td>
    <td style="padding-right: 20px;"><strong>Sync Cable Comments:</strong> ${selectedElements.syncCableComments}</td>
  </tr>
  <tr>
  <td style="padding-right: 20px;"><strong>Azimuth Cable Type:</strong> ${selectedElements.azimuthCableType}</td>
    <td style="padding-right: 20px;"><strong>Azimuth Cable Impedance:</strong> ${selectedElements.azimuthCableImpedance}</td>
    <td style="padding-right: 20px;"><strong>Azimuth Cable Comments:</strong> ${selectedElements.azimuthCableComments}</td>
    </tr>
    <tr>
  
    <td style="padding-right: 20px;"><strong>Heading Cable Type:</strong> ${selectedElements.headingCableType}</td>
    <td style="padding-right: 20px;"><strong>Heading Cable Impedance:</strong> ${selectedElements.headingCableImpedance}</td>
    <td style="padding-right: 20px;"><strong>Heading Cable Comments:</strong> ${selectedElements.headingCableComments}</td>
  </tr>
</table>
<h4>Signal Jumper Checks</h4>
<table>
  <tr>
    <td style="padding-right: 20px;"><strong>Video Jumper:</strong> ${formData.videoJumper}</td>
    <td style="padding-right: 20px;"><strong>Sync Jumper:</strong> ${formData.syncJumper}</td>
    </tr>
    <tr>

    <td style="padding-right: 20px;"><strong>Azimuth Jumper:</strong> ${formData.azimuthJumper}</td>
    <td style="padding-right: 20px;"><strong>Heading Jumper:</strong> ${formData.headingJumper}</td>
    </tr>
    <tr>

    <td style="padding-right: 20px;"><strong>Pullup Jumper:</strong> ${formData.pullupJumper}</td>
    <td style="padding-right: 20px;"><strong>Pulldown Jumper:</strong> ${formData.pulldownJumper}</td>
  </tr>
  </table>
  <h4>Radar Miscellaneous Checks</h4>
  <table>
  <tr>
    <td style="padding-right: 20px;"><strong>Amplifier Type:</strong> ${formData.amplifierType}</td>
    <td style="padding-right: 20px;"><strong>Amplifier Check:</strong> ${formData.amplifierCheck}</td>
    <td style="padding-right: 20px;"><strong>Amplifier Comments:</strong> ${formData.amplifierComments}</td>
    </tr>
    <tr>

    <td style="padding-right: 20px;"><strong>Radar Firewall Type:</strong> ${formData.radarFirewallType}</td>
    <td style="padding-right: 20px;"><strong>Radar Firewall Check:</strong> ${formData.radarFirewallCheck}</td>
    <td style="padding-right: 20px;"><strong>Radar Firewall Comments:</strong> ${formData.radarFirewallComments}</td>
  </tr>
  </table>
  <h4>Other Hardware Checks</h4>
  <table>

  <tr>
    <td style="padding-right: 20px;"><strong>Serial Interface Type:</strong> ${formData.serialInterfaceType}</td>
    <td style="padding-right: 20px;"><strong>Serial Interface Check:</strong> ${formData.serialInterfaceCheck}</td>
    <td style="padding-right: 20px;"><strong>Serial Interface Comments:</strong> ${formData.serialInterfaceComments}</td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
</table>
<h3>4. Network Information</h3>
<h4>4.1 Site Network Connections</h4>

<table>

<thead>
<tr>
  <th class="table-cell table-header">Equipment</th>
  <th class="table-cell table-header">IP Address</th>
  <th class="table-cell table-header">Subnet Mask</th>
  <th class="table-cell table-header">Default Gateway</th>
  <th class="table-cell table-header">MAC Address</th>
</tr>
</thead>


<tr>
  <td class="table-cell">${formData.networkEquipment1 || ''}</td>
  <td class="table-cell">${formData.equipmentIpAddress1 || ''}</td>
  <td class="table-cell">${formData.equipmentSubnetMask1 || ''}</td>
  <td class="table-cell">${formData.equipmentDefaultGateway1 || ''}</td>
  <td class="table-cell">${formData.equipmentMac1 || ''}</td>
</tr>
<tr>
  <td class="table-cell">${formData.networkEquipment2 || ''}</td>
  <td class="table-cell">${formData.equipmentIpAddress2 || ''}</td>
  <td class="table-cell">${formData.equipmentSubnetMask2 || ''}</td>
  <td class="table-cell">${formData.equipmentDefaultGateway2 || ''}</td>
  <td class="table-cell">${formData.equipmentMac2 || ''}</td>
</tr>
<tr>
  <td class="table-cell">${formData.networkEquipment3 || ''}</td>
  <td class="table-cell">${formData.equipmentIpAddress3 || ''}</td>
  <td class="table-cell">${formData.equipmentSubnetMask3 || ''}</td>
  <td class="table-cell">${formData.equipmentDefaultGateway3 || ''}</td>
  <td class="table-cell">${formData.equipmentMac3 || ''}</td>
</tr>
<tr>
  <td class="table-cell">${formData.networkEquipment4 || ''}</td>
  <td class="table-cell">${formData.equipmentIpAddress4 || ''}</td>
  <td class="table-cell">${formData.equipmentSubnetMask4 || ''}</td>
  <td class="table-cell">${formData.equipmentDefaultGateway4 || ''}</td>
  <td class="table-cell">${formData.equipmentMac4 || ''}</td>
</tr>
<tr>
  <td class="table-cell">${formData.networkEquipment5 || ''}</td>
  <td class="table-cell">${formData.equipmentIpAddress5 || ''}</td>
  <td class="table-cell">${formData.equipmentSubnetMask5 || ''}</td>
  <td class="table-cell">${formData.equipmentDefaultGateway5 || ''}</td>
  <td class="table-cell">${formData.equipmentMac5 || ''}</td>
</tr>
<tr>
  <td class="table-cell">${formData.networkEquipment6 || ''}</td>
  <td class="table-cell">${formData.equipmentIpAddress6 || ''}</td>
  <td class="table-cell">${formData.equipmentSubnetMask6 || ''}</td>
  <td class="table-cell">${formData.equipmentDefaultGateway6 || ''}</td>
  <td class="table-cell">${formData.equipmentMac6 || ''}</td>
</tr>
<tr>
  <td class="table-cell">${formData.networkEquipment7 || ''}</td>
  <td class="table-cell">${formData.equipmentIpAddress7 || ''}</td>
  <td class="table-cell">${formData.equipmentSubnetMask7 || ''}</td>
  <td class="table-cell">${formData.equipmentDefaultGateway7 || ''}</td>
  <td class="table-cell">${formData.equipmentMac7 || ''}</td>
</tr>
<tr>
  <td class="table-cell">${formData.networkEquipment8 || ''}</td>
  <td class="table-cell">${formData.equipmentIpAddress8 || ''}</td>
  <td class="table-cell">${formData.equipmentSubnetMask8 || ''}</td>
  <td class="table-cell">${formData.equipmentDefaultGateway8 || ''}</td>
  <td class="table-cell">${formData.equipmentMac8 || ''}</td>
</tr>
  </table>
<h4>4.2 Cloud Configuration</h4>
<table>
  <tr>
  <td style="padding-right: 20px;"><strong>Cloud Host 1:</strong> ${formData.cloudHost1}</td>
  <td style="padding-right: 20px;"><strong>Cloud Host 2:</strong> ${formData.cloudHost2}</td>
</tr>


</table>
<h3>5. Startup</h3>
<h4>5.1 Computer and Software Installation Check</h4>
<table>
  <tr>
    <td style="padding-right: 20px;"><strong>Computer Startup:</strong> ${formData.computerStartup}</td>
    <td style="padding-right: 20px;"><strong>System Requirements:</strong> ${formData.systemRequirements}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>Windows Version:</strong> ${formData.windowsVersion}</td>
    <td style="padding-right: 20px;"><strong>Wavex Startup:</strong> ${formData.wavexStartup}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>Wavex Options:</strong> ${formData.wavexOptions}</td>
    <td style="padding-right: 20px;"><strong>Third Party Startup:</strong> ${formData.thirdPartyStartup}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>Storage Space:</strong> ${formData.storageSpace}</td>
    <td style="padding-right: 20px;"><strong>Remote Access Tools:</strong> ${formData.remoteAccessTools}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>Serial Mouse Fix:</strong> ${formData.serialMouseFix}</td>
    <td style="padding-right: 20px;"><strong>Network Interface Config:</strong> ${formData.networkInterfaceConfig}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>Windows Firewall:</strong> ${formData.windowsFirewall}</td>
    <td style="padding-right: 20px;"><strong>AntiVirus:</strong> ${formData.antiVirus}</td>
  </tr>
  </table>
  <h4>5.2 System Startup</h4>
<table>
  <tr>
    <td style="padding-right: 20px;"><strong>GPS Check 2:</strong> ${formData.gpsCheck2}</td>
    <td style="padding-right: 20px;"><strong>Gyro Check 2:</strong> ${formData.gyroCheck2}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>Wind Check 2:</strong> ${formData.windCheck2}</td>
    <td style="padding-right: 20px;"><strong>Draught Check 2:</strong> ${formData.draughtCheck2}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>Wave Check 2:</strong> ${formData.waveCheck2}</td>
    <td style="padding-right: 20px;"><strong>Speed Log 2:</strong> ${formData.speedlogCheck2}</td>
    <td style="padding-right: 20px;"><strong>Shaft Check 2:</strong> ${formData.shaftCheck2}</td>
  </tr>
  </table>
  <h3>6. Configuration & Commissioning</h3>
  <h4>6.1 EM-129 Configuration</h4>
  <table>
  
  <tr>
    <td style="padding-right: 20px;"><strong>EM129 Version:</strong> ${formData.em129Version}</td>
    <td style="padding-right: 20px;"><strong>EM129 Settings:</strong> ${formData.em129Settings}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>EM129 Signal Status:</strong> ${formData.em129SignalStatus}</td>
    <td style="padding-right: 20px;"><strong>EM129 Network Settings:</strong> ${formData.em129NetworkSettings}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>EM129 Interface Config:</strong> ${formData.em129InterfaceConfig}</td>
    <td style="padding-right: 20px;"><strong>EM129 Scope:</strong> ${formData.em129Scope}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>EM129 Comments:</strong> ${formData.em129Comments}</td>
    <td style="padding-right: 20px;"><strong>Wavex Description:</strong> ${formData.wavexDescription}</td>
  </tr>
  </table>
  <h4>6.2 Wavex Software Configuration</h4>
  <table>

  <tr>
    <td style="padding-right: 20px;"><strong>Wavex Movement:</strong> ${formData.wavexMovement}</td>
    <td style="padding-right: 20px;"><strong>Wavex Lat:</strong> ${formData.wavexLat}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>Wavex Long:</strong> ${formData.wavexLong}</td>
    <td style="padding-right: 20px;"><strong>Wavex Heading:</strong> ${formData.wavexHeading}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>Wavex Radar:</strong> ${formData.wavexRadar}</td>
    <td style="padding-right: 20px;"><strong>Wavex Multicast:</strong> ${formData.wavexMulticast}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>Wavex Transceiver:</strong> ${formData.wavexTransceiver}</td>
    <td style="padding-right: 20px;"><strong>Wavex RinId:</strong> ${formData.wavexRinId}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>Wavex RinNetwork:</strong> ${formData.wavexRinNetwork}</td>
    <td style="padding-right: 20px;"><strong>Wavex Image Storage:</strong> ${formData.wavexImageStorage}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>Wavex GPS:</strong> ${formData.wavexGPS}</td>
    <td style="padding-right: 20px;"><strong>Wavex GPS Position Sentence:</strong> ${formData.wavexGPSPositionSentence}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>Wavex GPS Track Speed Sentence:</strong> ${formData.wavexGPSTrackSpeedSentence}</td>
    <td style="padding-right: 20px;"><strong>Wavex GPS Time Sentence:</strong> ${formData.wavexGPSTimeSentence}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>Wavex GPS Settings:</strong> ${formData.wavexGPSSettings}</td>
    <td style="padding-right: 20px;"><strong>Wavex Gyro:</strong> ${formData.wavexGyro}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>Wavex Gyro Sentence:</strong> ${formData.wavexGyroSentence}</td>
    <td style="padding-right: 20px;"><strong>Wavex Gyro Settings:</strong> ${formData.wavexGyroSettings}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>Wavex Wind:</strong> ${formData.wavexWind}</td>
    <td style="padding-right: 20px;"><strong>Wavex Wind Sentence:</strong> ${formData.wavexWindSentence}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>Wavex Wind Settings:</strong> ${formData.wavexWindSettings}</td>
    <td style="padding-right: 20px;"><strong>Wavex Wave:</strong> ${formData.wavexWave}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>Wavex Wave Sentence:</strong> ${formData.wavexWaveSentence}</td>
    <td style="padding-right: 20px;"><strong>Wavex Wave Settings:</strong> ${formData.wavexWaveSettings}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>Wavex Draught:</strong> ${formData.wavexDraught}</td>
    <td style="padding-right: 20px;"><strong>Wavex Draught Sentence:</strong> ${formData.wavexDraughtSentence}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>Wavex Draught Settings:</strong> ${formData.wavexDraughtSettings}</td>
  </tr>
  <tr>
  <td style="padding-right: 20px;"><strong>Wavex Speed Log:</strong> ${formData.wavexSpeedlog}</td>
  <td style="padding-right: 20px;"><strong>Wavex Speed Log Sentence:</strong> ${formData.wavexSpeedlogSentence}</td>
</tr>
<tr>
  <td style="padding-right: 20px;"><strong>Wavex Speed Log Settings:</strong> ${formData.wavexSpeedlogSettings}</td>
</tr>


<tr>
<td style="padding-right: 20px;"><strong>Wavex Shaft:</strong> ${formData.wavexShaft}</td>
<td style="padding-right: 20px;"><strong>Wavex Shaft Sentence:</strong> ${formData.wavexShaftSentence}</td>
</tr>
<tr>
<td style="padding-right: 20px;"><strong>Wavex Shaft Settings:</strong> ${formData.wavexShaftSettings}</td>
</tr>



  <tr>
  <td style="padding-right: 20px;"><strong>Wavex Geometry Radar X:</strong> ${formData.wavexGeometryRadarX}</td>
    <td style="padding-right: 20px;"><strong>Wavex Geometry Radar Y:</strong> ${formData.wavexGeometryRadarY}</td>
    <td style="padding-right: 20px;"><strong>Wavex Geometry Radar Z:</strong> ${formData.wavexGeometryRadarZ}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>Wavex Geometry GPS X:</strong> ${formData.wavexGeometryGPSX}</td>
    <td style="padding-right: 20px;"><strong>Wavex Geometry GPS Y:</strong> ${formData.wavexGeometryGPSY}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>Wavex Geometry Wind Heading Offset:</strong> ${formData.wavexGeometryWindHeadingOffset}</td>
    <td style="padding-right: 20px;"><strong>Wavex Geometry Wind Z:</strong> ${formData.wavexGeometryWindZ}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>Wavex Radar Range Offset:</strong> ${formData.wavexRadarRangeOffset}</td>
    <td style="padding-right: 20px;"><strong>Wavex Radar Azimuth Offset:</strong> ${formData.wavexRadarAzimuthOffset}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>Wavex Radar Start Angle:</strong> ${formData.wavexRadarStartAngle}</td>
    <td style="padding-right: 20px;"><strong>Wavex Radar Sector Size:</strong> ${formData.wavexRadarSectorSize}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>Wavex Radar Start Range:</strong> ${formData.wavexRadarStartRange}</td>
    <td style="padding-right: 20px;"><strong>Wavex Radar Stop Range:</strong> ${formData.wavexRadarStopRange}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>Wavex Radar Image Check:</strong> ${formData.wavexRadarImageCheck}</td>
    <td style="padding-right: 20px;"><strong>Wavex Advanced Wave Antenna Mean Height:</strong> ${formData.wavexAdvancedWaveAntennaMeanHeight}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>Wavex Advanced Wave Cartesian Sections:</strong> ${formData.wavexAdvancedWaveCartesianSections}</td>
    <td style="padding-right: 20px;"><strong>Wavex Advanced Current Antenna Mean Height:</strong> ${formData.wavexAdvancedCurrentAntennaMeanHeight}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>Wavex Advanced Current Cartesian Sections:</strong> ${formData.wavexAdvancedCurrentCartesianSections}</td>
    <td style="padding-right: 20px;"><strong>Wavex Output 1:</strong> ${formData.wavexOutput1}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>Wavex Output 1 Sentence:</strong> ${formData.wavexOutput1Sentence}</td>
    <td style="padding-right: 20px;"><strong>Wavex Output 1 Update Interval:</strong> ${formData.wavexOutput1UpdateInterval}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>Wavex Output 1 Settings:</strong> ${formData.wavexOutput1Settings}</td>
    <td style="padding-right: 20px;"><strong>Wavex Output 2:</strong> ${formData.wavexOutput2}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>Wavex Output 2 Sentence:</strong> ${formData.wavexOutput2Sentence}</td>
    <td style="padding-right: 20px;"><strong>Wavex Output 2 Update Interval:</strong> ${formData.wavexOutput2UpdateInterval}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>Wavex Output 2 Settings:</strong> ${formData.wavexOutput2Settings}</td>
    <td style="padding-right: 20px;"><strong>Wavex Output 3:</strong> ${formData.wavexOutput3}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>Wavex Output 3 Sentence:</strong> ${formData.wavexOutput3Sentence}</td>
    <td style="padding-right: 20px;"><strong>Wavex Output 3 Update Interval:</strong> ${formData.wavexOutput3UpdateInterval}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>Wavex Output 3 Settings:</strong> ${formData.wavexOutput3Settings}</td>
    <td style="padding-right: 20px;"><strong>Cloud Enabled:</strong> ${formData.cloudEnabled}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>Final Config:</strong> ${formData.finalConfig}</td>
  </tr>
  </table>
  <h3>7. Final Start-up</h3>
  <table>
  <tr>
  <td style="padding-right: 20px;"><strong>Final Power Cycle:</strong> ${formData.finalPowerCycle}</td>
  <td style="padding-right: 20px;"><strong>Final Startup:</strong> ${formData.finalStartup}</td>
    <td style="padding-right: 20px;"><strong>Final 20 Minute:</strong> ${formData.final20Minute}</td>
    <td style="padding-right: 20px;"><strong>Final Data Output:</strong> ${formData.finalDataOutput}</td>
  </tr>
  </table>
  <h3>8. System Backup</h3>
  <table>
  <tr>
    <td style="padding-right: 20px;"><strong>Backup Wavex Json:</strong> ${formData.backupWavexJson}</td>
    <td style="padding-right: 20px;"><strong>Backup DF047:</strong> ${formData.backupDF047}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>Backup EM129:</strong> ${formData.backupEM129}</td>
    <td style="padding-right: 20px;"><strong>Backup Misc:</strong> ${formData.backupMisc}</td>
  </tr>
  </table>
  <h3>9. Login Details</h3>

  <table>

  <thead>
  <tr>
    <th class="table-cell table-header">Type</th>
    <th class="table-cell table-header">Username</th>
    <th class="table-cell table-header">Password</th>
    <th class="table-cell table-header">Comments</th>
  </tr>
</thead>


<tr>
  <td class="table-cell">${formData.loginType1 || ''}</td>
  <td class="table-cell">${formData.loginUsername1 || ''}</td>
  <td class="table-cell">${formData.loginPassword1 || ''}</td>
  <td class="table-cell">${formData.loginComments1 || ''}</td>
</tr>
<tr>
  <td class="table-cell">${formData.loginType2 || ''}</td>
  <td class="table-cell">${formData.loginUsername2 || ''}</td>
  <td class="table-cell">${formData.loginPassword2 || ''}</td>
  <td class="table-cell">${formData.loginComments2 || ''}</td>
</tr>
<tr>
  <td class="table-cell">${formData.loginType3 || ''}</td>
  <td class="table-cell">${formData.loginUsername3 || ''}</td>
  <td class="table-cell">${formData.loginPassword3 || ''}</td>
  <td class="table-cell">${formData.loginComments3 || ''}</td>
</tr>
</table>




<div style="text-align: center;">
<br>
<!-- Display uploaded images in a grid layout -->
<div class="image-container">
  ${imageUrls.map(url => `<div><img src="${url}" style="max-width: 100%;"></div>`).join('')}
</div>

 
  </div>
  
  <footer class="footer">
  <!-- Footer content -->
  <p>&copy; 2024 Miros Group. All rights reserved.</p>
  <p><a href="https://www.mirosmocean.com/" style="color: white;">Miros Cloud Terms & Conditions</a></p>
  <a href="https://www.mirosmocean.com/">
  <img src="https://mocean.miros.app/miros-mocean-logo.6761c3f7e4f32ff93e9fa5cb0303d3dd.svg" style="width: 100px;">
</a>

</footer>
  
  </body>
  </html>
  `;

  const newWindow = window.open('', '_blank');
  newWindow.document.write(html);
  newWindow.document.close();
}



function openReportWavex() {
  const formData = JSON.parse(localStorage.getItem('formData'));
  var workStatusValue = document.querySelector('select[name="workStatus"]').value;

  if (workStatusValue === 'Complete') {
    alert('Please ensure the site is set to "Commissioned" in the Miros Cloud administration area.');
  }


  if (workStatusValue !== 'Complete' && workStatusValue !== 'In Progress' && workStatusValue !== 'Needs Attention') {
    alert('Check the work status. It is not possible to generate a report or certificate at this stage.');
    return;
  }

  const selectedElements = {
    system: formData.system,
    workType: formData.workType,
    site: formData.site,
    siteType: formData.siteType,
    customer: formData.customer,
    date: formData.date,
    imo: formData.imo,
    location: formData.location,
    engineer: formData.engineer,
    engineer2: formData.engineer2,
    recordEquipment1: formData.recordEquipment1,
    equipmentManufact1: formData.equipmentManufact1,
    equipmentModel1: formData.equipmentModel1,
    equipmentPartNo1: formData.equipmentPartNo1,
    equipmentSerialNo1: formData.equipmentSerialNo1,
    equipmentLocation1: formData.equipmentLocation1,
    recordEquipment2: formData.recordEquipment2,
    equipmentManufact2: formData.equipmentManufact2,
    equipmentModel2: formData.equipmentModel2,
    equipmentPartNo2: formData.equipmentPartNo2,
    equipmentSerialNo2: formData.equipmentSerialNo2,
    equipmentLocation2: formData.equipmentLocation2,
    recordEquipment3: formData.recordEquipment3,
    equipmentManufact3: formData.equipmentManufact3,
    equipmentModel3: formData.equipmentModel3,
    equipmentPartNo3: formData.equipmentPartNo3,
    equipmentSerialNo3: formData.equipmentSerialNo3,
    equipmentLocation3: formData.equipmentLocation3,
    recordEquipment4: formData.recordEquipment4,
    equipmentManufact4: formData.equipmentManufact4,
    equipmentModel4: formData.equipmentModel4,
    equipmentPartNo4: formData.equipmentPartNo4,
    equipmentSerialNo4: formData.equipmentSerialNo4,
    equipmentLocation4: formData.equipmentLocation4,
    recordEquipment5: formData.recordEquipment5,
    equipmentManufact5: formData.equipmentManufact5,
    equipmentModel5: formData.equipmentModel5,
    equipmentPartNo5: formData.equipmentPartNo5,
    equipmentSerialNo5: formData.equipmentSerialNo5,
    equipmentLocation5: formData.equipmentLocation5,
    recordEquipment6: formData.recordEquipment6,
    equipmentManufact6: formData.equipmentManufact6,
    equipmentModel6: formData.equipmentModel6,
    equipmentPartNo6: formData.equipmentPartNo6,
    equipmentSerialNo6: formData.equipmentSerialNo6,
    equipmentLocation6: formData.equipmentLocation6,
    recordEquipment7: formData.recordEquipment7,
    equipmentManufact7: formData.equipmentManufact7,
    equipmentModel7: formData.equipmentModel7,
    equipmentPartNo7: formData.equipmentPartNo7,
    equipmentSerialNo7: formData.equipmentSerialNo7,
    equipmentLocation7: formData.equipmentLocation7,
    recordEquipment8: formData.recordEquipment8,
    equipmentManufact8: formData.equipmentManufact8,
    equipmentModel8: formData.equipmentModel8,
    equipmentPart8: formData.equipmentPart8,
    equipmentSerial8: formData.equipmentSerial8,
    equipmentLocation8: formData.equipmentLocation8,
    checkEquipment1: formData.checkEquipment1,
    checkVisual1: formData.checkVisual1,
    checkMech1: formData.checkMech1,
    checkCabling1: formData.checkCabling1,
    checkPower1: formData.checkPower1,
    checkEarthing1: formData.checkEarthing1,
    checkEquipment2: formData.checkEquipment2,
    checkVisual2: formData.checkVisual2,
    checkMech2: formData.checkMech2,
    checkCabling2: formData.checkCabling2,
    checkPower2: formData.checkPower2,
    checkEarthing2: formData.checkEarthing2,
    checkEquipment3: formData.checkEquipment3,
    checkVisual3: formData.checkVisual3,
    checkMech3: formData.checkMech3,
    checkCabling3: formData.checkCabling3,
    checkPower3: formData.checkPower3,
    checkEarthing3: formData.checkEarthing3,
    checkEquipment4: formData.checkEquipment4,
    checkVisual4: formData.checkVisual4,
    checkMech4: formData.checkMech4,
    checkCabling4: formData.checkCabling4,
    checkPower4: formData.checkPower4,
    checkEarthing4: formData.checkEarthing4,

    checkEquipment5: formData.checkEquipment5,
    checkVisual5: formData.checkVisual5,
    checkMech5: formData.checkMech5,
    checkCabling5: formData.checkCabling5,
    checkPower5: formData.checkPower5,
    checkEarthing5: formData.checkEarthing5,

    checkEquipment6: formData.checkEquipment6,
    checkVisual6: formData.checkVisual6,
    checkMech6: formData.checkMech6,
    checkCabling6: formData.checkCabling6,
    checkPower6: formData.checkPower6,
    checkEarthing6: formData.checkEarthing6,

    checkEquipment7: formData.checkEquipment7,
    checkVisual7: formData.checkVisual7,
    checkMech7: formData.checkMech7,
    checkCabling7: formData.checkCabling7,
    checkPower7: formData.checkPower7,
    checkEarthing7: formData.checkEarthing7,

    checkEquipment8: formData.checkEquipment8,
    checkVisual8: formData.checkVisual8,
    checkMech8: formData.checkMech8,
    checkCabling8: formData.checkCabling8,
    checkPower8: formData.checkPower8,
    checkEarthing8: formData.checkEarthing8,

    radarManufacturer: formData.radarManufacturer,
    radarModel: formData.radarModel,
    radarUse: formData.radarUse,
    radarTxtime: formData.radarTxtime,
    radarLocation: formData.radarLocation,
    radarSettings: formData.radarSettings,
    networkEquipment1: formData.networkEquipment1,
    equipmentIpAddress1: formData.equipmentIpAddress1,
    equipmentSubnetMask1: formData.equipmentSubnetMask1,
    equipmentDefaultGateway1: formData.equipmentDefaultGateway1,
    equipmentMac1: formData.equipmentMac1,
    networkEquipment2: formData.networkEquipment2,
    equipmentIpAddress2: formData.equipmentIpAddress2,
    equipmentSubnetMask2: formData.equipmentSubnetMask2,
    equipmentDefaultGateway2: formData.equipmentDefaultGateway2,
    equipmentMac2: formData.equipmentMac2,
    networkEquipment3: formData.networkEquipment3,
    equipmentIpAddress3: formData.equipmentIpAddress3,
    equipmentSubnetMask3: formData.equipmentSubnetMask3,
    equipmentDefaultGateway3: formData.equipmentDefaultGateway3,
    equipmentMac3: formData.equipmentMac3,
    networkEquipment4: formData.networkEquipment4,
    equipmentIpAddress4: formData.equipmentIpAddress4,
    equipmentSubnetMask4: formData.equipmentSubnetMask4,
    equipmentDefaultGateway4: formData.equipmentDefaultGateway4,
    equipmentMac4: formData.equipmentMac4,
    networkEquipment5: formData.networkEquipment5,
    equipmentIpAddress5: formData.equipmentIpAddress5,
    equipmentSubnetMask5: formData.equipmentSubnetMask5,
    equipmentDefaultGateway5: formData.equipmentDefaultGateway5,
    equipmentMac5: formData.equipmentMac5,
    networkEquipment6: formData.networkEquipment6,
    equipmentIpAddress6: formData.equipmentIpAddress6,
    equipmentSubnetMask6: formData.equipmentSubnetMask6,
    equipmentDefaultGateway6: formData.equipmentDefaultGateway6,
    equipmentMac6: formData.equipmentMac6,
    networkEquipment7: formData.networkEquipment7,
    equipmentIpAddress7: formData.equipmentIpAddress7,
    equipmentSubnetMask7: formData.equipmentSubnetMask7,
    equipmentDefaultGateway7: formData.equipmentDefaultGateway7,
    equipmentMac7: formData.equipmentMac7,
    networkEquipment8: formData.networkEquipment8,
    equipmentIpAddress8: formData.equipmentIpAddress8,
    equipmentSubnetMask8: formData.equipmentSubnetMask8,
    equipmentDefaultGateway8: formData.equipmentDefaultGateway8,
    equipmentMac8: formData.equipmentMac8,
    networkDns: formData.networkDns,
    networkComments: formData.networkComments,
    cloudHost1: formData.cloudHost1,
    cloudHost2: formData.cloudHost2,
    wavexOptions: formData.wavexOptions,
    wavexOutput1: formData.wavexOutput1,
    wavexOutput1Sentence: formData.wavexOutput1Sentence,
    wavexOutput1UpdateInterval: formData.wavexOutput1UpdateInterval,
    wavexOutput1Settings: formData.wavexOutput1Settings,
    wavexOutput2: formData.wavexOutput2,
    wavexOutput2Sentence: formData.wavexOutput2Sentence,
    wavexOutput2UpdateInterval: formData.wavexOutput2UpdateInterval,
    wavexOutput2Settings: formData.wavexOutput2Settings,
    wavexOutput3: formData.wavexOutput3,
    wavexOutput3Sentence: formData.wavexOutput3Sentence,
    wavexOutput3UpdateInterval: formData.wavexOutput3UpdateInterval,
    wavexOutput3Settings: formData.wavexOutput3Settings,
    cloudEnabled: formData.cloudEnabled,
    final20Minute: formData.final20Minute,
    finalDataOutput: formData.finalDataOutput,
    loginType1: formData.loginType1,
    loginUsername1: formData.loginUsername1,
    loginPassword1: formData.loginPassword1,
    loginComments1: formData.loginComments1,
    loginType2: formData.loginType2,
    loginUsername2: formData.loginUsername2,
    loginPassword2: formData.loginPassword2,
    loginComments2: formData.loginComments2,
    loginType3: formData.loginType3,
    loginUsername2: formData.loginUsername3,
    loginPassword3: formData.loginPassword3,
    loginComments3: formData.loginComments3,
    workStatus: formData.workStatus,
    subscriptionStatus: formData.subscriptionStatus,
    subscriptionExpiry: formData.subscriptionExpiry,
    generalComments: formData.generalComments
  };

  // Retrieve uploaded images
  const uploadedImages = document.querySelectorAll('.uploaded-images img');
  const imageUrls = Array.from(uploadedImages).map(img => img.src);


  const html = `
  <!DOCTYPE html>
  <html>
  <head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Miros Site Report</title>
  <link rel="stylesheet" type="text/css" href="style_report.css">
</head>  
<body>

<div class="header">
  <div class="text-container">
  <img src="https://miros.app/miros-logo-two-tone-light.631848d3e1f5088e7f228ac7b63d6dbc.svg" style="width: 200px; padding-bottom: 10px;">
  <div class="info"><span class="label">System:</span> <span class="value">${selectedElements.system}</span></div>
    <div class="info"><span class="label">Site:</span> <span class="value">${selectedElements.site}</span></div>
    <div class="info"><span class="label">Customer:</span> <span class="value">${selectedElements.customer}</span></div>
    <div class="info"><span class="label">Date:</span> <span class="value">${selectedElements.date}</span></div>
    <div class="info"><span class="label">Work Type:</span> <span class="value">${selectedElements.workType}</span></div>
    <div class="info"><span class="label">Work Status:</span> <span class="value">${selectedElements.workStatus}</span></div>
    <div class="info"><span class="label">Subscription Expiry:</span> <span class="value">${selectedElements.subscriptionStatus}   ${selectedElements.subscriptionExpiry}</span></div>
</div>
<!-- Large image to the right -->
<img src="none.png" alt="Large Image Description" class="large-image">
</div>


<div class="container">
  <h2>Site Report</h2>
  <h3>Overview</h3>
  <p style="max-width: 750px;">${selectedElements.generalComments}</p>

  <table class="info-table">
  <!-- System -->
  <tr>
    <td class="label">System:</td>
    <td>${selectedElements.system}</td>
  </tr>
  <!-- Site Type -->
  <tr>
    <td class="label">Site Type:</td>
    <td>${selectedElements.siteType}</td>
  </tr>
  <!-- IMO -->
  <tr>
    <td class="label">IMO:</td>
    <td>${selectedElements.imo}</td>
  </tr>
  <!-- Work Type -->
  <tr>
    <td class="label">Work Type:</td>
    <td>${selectedElements.workType}</td>
  </tr>
  <!-- Customer -->
  <tr>
    <td class="label">Customer:</td>
    <td>${selectedElements.customer}</td>
  </tr>
  <!-- Location -->
  <tr>
    <td class="label">Location:</td>
    <td>${selectedElements.location}</td>
  </tr>
  <!-- Site -->
  <tr>
    <td class="label">Site:</td>
    <td>${selectedElements.site}</td>
  </tr>
  <!-- Date -->
  <tr>
    <td class="label">Date:</td>
    <td>${selectedElements.date}</td>
  </tr>
  <!-- Engineer -->
  <tr>
    <td class="label">Engineer(s):</td>
    <td>${selectedElements.engineer}</td>
  </tr>
  <tr>
  <td class="label"></td>
  ${selectedElements.engineer2 ? `<td>${selectedElements.engineer2}</td>` : ''}
  </tr>

</table>


<div style="break-after:page"></div>

<h3>Record of Equipment</h3>
<table>
  <thead>
    <tr>
      <th class="table-cell table-header">Equipment</th>
      <th class="table-cell table-header">Manufacturer</th>
      <th class="table-cell table-header">Model</th>
      <th class="table-cell table-header">Part No</th>
      <th class="table-cell table-header">Serial No.</th>
      <th class="table-cell table-header">Location</th>
    </tr>
  </thead>
  <tbody>
    <!-- Equipment row 1 -->
    <tr>
    <td class="table-cell">${selectedElements.recordEquipment1 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentManufact1 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentModel1 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentPartNo1 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentSerialNo1 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentLocation1 || ''}</td>
  </tr>
  <tr>
    <td class="table-cell">${selectedElements.recordEquipment2 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentManufact2 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentModel2 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentPartNo2 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentSerialNo2 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentLocation2 || ''}</td>
  </tr>
  <tr>
    <td class="table-cell">${selectedElements.recordEquipment3 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentManufact3 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentModel3 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentPartNo3 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentSerialNo3 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentLocation3 || ''}</td>
  </tr>
  <tr>
    <td class="table-cell">${selectedElements.recordEquipment4 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentManufact4 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentModel4 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentPartNo4 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentSerialNo4 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentLocation4 || ''}</td>
  </tr>
  <tr>
    <td class="table-cell">${selectedElements.recordEquipment5 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentManufact5 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentModel5 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentPartNo5 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentSerialNo5 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentLocation5 || ''}</td>
  </tr>
  <tr>
    <td class="table-cell">${selectedElements.recordEquipment6 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentManufact6 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentModel6 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentPartNo6 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentSerialNo6 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentLocation6 || ''}</td>
  </tr>
  <tr>
    <td class="table-cell">${selectedElements.recordEquipment7 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentManufact7 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentModel7 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentPartNo7 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentSerialNo7 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentLocation7 || ''}</td>
  </tr>
  <tr>
    <td class="table-cell">${selectedElements.recordEquipment8 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentManufact8 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentModel8 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentPartNo8 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentSerialNo8 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentLocation8 || ''}</td>
  </tr>
    </tbody>
</table>
<div class="line_sub"></div>


<h3>Equipment Checks</h3>
<h4>Delivered Equipment</h4>
<table>

<thead>
<tr>
  <th class="table-cell table-header">Equipment</th>
  <th class="table-cell table-header">Visual</th>
  <th class="table-cell table-header">Mechanical</th>
  <th class="table-cell table-header">Cabling</th>
  <th class="table-cell table-header">Power</th>
  <th class="table-cell table-header">Earthing</th>
</tr>
</thead>

<tbody>
<tr>
  <td class="table-cell">${selectedElements.checkEquipment1 || ''}</td>
  <td class="table-cell">${selectedElements.checkVisual1 || ''}</td>
  <td class="table-cell">${selectedElements.checkMech1 || ''}</td>
  <td class="table-cell">${selectedElements.checkCabling1 || ''}</td>
  <td class="table-cell">${selectedElements.checkPower1 || ''}</td>
  <td class="table-cell">${selectedElements.checkEarthing1 || ''}</td>
</tr>
<tr>
  <td class="table-cell">${selectedElements.checkEquipment2 || ''}</td>
  <td class="table-cell">${selectedElements.checkVisual2 || ''}</td>
  <td class="table-cell">${selectedElements.checkMech2 || ''}</td>
  <td class="table-cell">${selectedElements.checkCabling2 || ''}</td>
  <td class="table-cell">${selectedElements.checkPower2 || ''}</td>
  <td class="table-cell">${selectedElements.checkEarthing2 || ''}</td>
</tr>
<tr>
  <td class="table-cell">${selectedElements.checkEquipment3 || ''}</td>
  <td class="table-cell">${selectedElements.checkVisual3 || ''}</td>
  <td class="table-cell">${selectedElements.checkMech3 || ''}</td>
  <td class="table-cell">${selectedElements.checkCabling3 || ''}</td>
  <td class="table-cell">${selectedElements.checkPower3 || ''}</td>
  <td class="table-cell">${selectedElements.checkEarthing3 || ''}</td>
</tr>
<tr>
  <td class="table-cell">${selectedElements.checkEquipment4 || ''}</td>
  <td class="table-cell">${selectedElements.checkVisual4 || ''}</td>
  <td class="table-cell">${selectedElements.checkMech4 || ''}</td>
  <td class="table-cell">${selectedElements.checkCabling4 || ''}</td>
  <td class="table-cell">${selectedElements.checkPower4 || ''}</td>
  <td class="table-cell">${selectedElements.checkEarthing4 || ''}</td>
</tr>
<tr>
  <td class="table-cell">${selectedElements.checkEquipment5 || ''}</td>
  <td class="table-cell">${selectedElements.checkVisual5 || ''}</td>
  <td class="table-cell">${selectedElements.checkMech5 || ''}</td>
  <td class="table-cell">${selectedElements.checkCabling5 || ''}</td>
  <td class="table-cell">${selectedElements.checkPower5 || ''}</td>
  <td class="table-cell">${selectedElements.checkEarthing5 || ''}</td>
</tr>
<tr>
  <td class="table-cell">${selectedElements.checkEquipment6 || ''}</td>
  <td class="table-cell">${selectedElements.checkVisual6 || ''}</td>
  <td class="table-cell">${selectedElements.checkMech6 || ''}</td>
  <td class="table-cell">${selectedElements.checkCabling6 || ''}</td>
  <td class="table-cell">${selectedElements.checkPower6 || ''}</td>
  <td class="table-cell">${selectedElements.checkEarthing6 || ''}</td>
</tr>
<tr>
  <td class="table-cell">${selectedElements.checkEquipment7 || ''}</td>
  <td class="table-cell">${selectedElements.checkVisual7 || ''}</td>
  <td class="table-cell">${selectedElements.checkMech7 || ''}</td>
  <td class="table-cell">${selectedElements.checkCabling7 || ''}</td>
  <td class="table-cell">${selectedElements.checkPower7 || ''}</td>
  <td class="table-cell">${selectedElements.checkEarthing7 || ''}</td>
</tr>
<tr>
  <td class="table-cell">${selectedElements.checkEquipment8 || ''}</td>
  <td class="table-cell">${selectedElements.checkVisual8 || ''}</td>
  <td class="table-cell">${selectedElements.checkMech8 || ''}</td>
  <td class="table-cell">${selectedElements.checkCabling8 || ''}</td>
  <td class="table-cell">${selectedElements.checkPower8 || ''}</td>
  <td class="table-cell">${selectedElements.checkEarthing8 || ''}</td>
</tr>
</tbody>
</table>
<h4>Special Equipment Checks</h4>

  <h4>Radar</h4>
  <table>
  
  <tr>
    <td style="padding-right: 20px;"><strong>Radar Manufacturer:</strong> ${selectedElements.radarManufacturer}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>Radar Model:</strong> ${selectedElements.radarModel}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>Radar Use:</strong> ${selectedElements.radarUse}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>Radar Txtime:</strong> ${selectedElements.radarTxtime}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>Radar Settings:</strong> ${selectedElements.radarSettings}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>Radar Location:</strong> ${selectedElements.radarLocation}</td>
  </tr>
  
</table>
  <div class="line_sub"></div>
  <h3>Network Information</h3>
<h4>Site Network Connections</h4>

<table>

<thead>
<tr>
  <th class="table-cell table-header">Equipment</th>
  <th class="table-cell table-header">IP Address</th>
  <th class="table-cell table-header">Subnet Mask</th>
  <th class="table-cell table-header">Default Gateway</th>
  <th class="table-cell table-header">MAC Address</th>
</tr>
</thead>


<tr>
  <td class="table-cell">${formData.networkEquipment1 || ''}</td>
  <td class="table-cell">${formData.equipmentIpAddress1 || ''}</td>
  <td class="table-cell">${formData.equipmentSubnetMask1 || ''}</td>
  <td class="table-cell">${formData.equipmentDefaultGateway1 || ''}</td>
  <td class="table-cell">${formData.equipmentMac1 || ''}</td>
</tr>
<tr>
  <td class="table-cell">${formData.networkEquipment2 || ''}</td>
  <td class="table-cell">${formData.equipmentIpAddress2 || ''}</td>
  <td class="table-cell">${formData.equipmentSubnetMask2 || ''}</td>
  <td class="table-cell">${formData.equipmentDefaultGateway2 || ''}</td>
  <td class="table-cell">${formData.equipmentMac2 || ''}</td>
</tr>
<tr>
  <td class="table-cell">${formData.networkEquipment3 || ''}</td>
  <td class="table-cell">${formData.equipmentIpAddress3 || ''}</td>
  <td class="table-cell">${formData.equipmentSubnetMask3 || ''}</td>
  <td class="table-cell">${formData.equipmentDefaultGateway3 || ''}</td>
  <td class="table-cell">${formData.equipmentMac3 || ''}</td>
</tr>
<tr>
  <td class="table-cell">${formData.networkEquipment4 || ''}</td>
  <td class="table-cell">${formData.equipmentIpAddress4 || ''}</td>
  <td class="table-cell">${formData.equipmentSubnetMask4 || ''}</td>
  <td class="table-cell">${formData.equipmentDefaultGateway4 || ''}</td>
  <td class="table-cell">${formData.equipmentMac4 || ''}</td>
</tr>
<tr>
  <td class="table-cell">${formData.networkEquipment5 || ''}</td>
  <td class="table-cell">${formData.equipmentIpAddress5 || ''}</td>
  <td class="table-cell">${formData.equipmentSubnetMask5 || ''}</td>
  <td class="table-cell">${formData.equipmentDefaultGateway5 || ''}</td>
  <td class="table-cell">${formData.equipmentMac5 || ''}</td>
</tr>
<tr>
  <td class="table-cell">${formData.networkEquipment6 || ''}</td>
  <td class="table-cell">${formData.equipmentIpAddress6 || ''}</td>
  <td class="table-cell">${formData.equipmentSubnetMask6 || ''}</td>
  <td class="table-cell">${formData.equipmentDefaultGateway6 || ''}</td>
  <td class="table-cell">${formData.equipmentMac6 || ''}</td>
</tr>
<tr>
  <td class="table-cell">${formData.networkEquipment7 || ''}</td>
  <td class="table-cell">${formData.equipmentIpAddress7 || ''}</td>
  <td class="table-cell">${formData.equipmentSubnetMask7 || ''}</td>
  <td class="table-cell">${formData.equipmentDefaultGateway7 || ''}</td>
  <td class="table-cell">${formData.equipmentMac7 || ''}</td>
</tr>
<tr>
  <td class="table-cell">${formData.networkEquipment8 || ''}</td>
  <td class="table-cell">${formData.equipmentIpAddress8 || ''}</td>
  <td class="table-cell">${formData.equipmentSubnetMask8 || ''}</td>
  <td class="table-cell">${formData.equipmentDefaultGateway8 || ''}</td>
  <td class="table-cell">${formData.equipmentMac8 || ''}</td>
</tr>
  </table>
<h4>Cloud Firewall Exceptions</h4>
<table>
  <tr>
  <td style="padding-right: 20px;"><strong>admin.miros.app:</strong> ${formData.cloudHost1}</td>
  <td style="padding-right: 20px;"><strong>azure-devices.net:</strong> ${formData.cloudHost2}</td>
</tr>


</table>
<div class="line_sub"></div>

<div style="break-after:page"></div>


<h3>System Startup</h3>
<h4>Computer and Software Installation Check</h4>
<table>
  
  <tr>
    <td style="padding-right: 20px;"><strong>System Options:</strong> ${formData.wavexOptions}</td>
    </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>Cloud Enabled:</strong> ${formData.cloudEnabled}</td>
  </tr>
  
  </table>
<br>



  <table>

  <thead>
  <tr>
    <th class="table-cell table-header">Enabled</th>
    <th class="table-cell table-header">Sentence</th>
    <th class="table-cell table-header">Update Interval</th>
    <th class="table-cell table-header">Settings</th>
  </tr>
</thead>

<h4>Outputs</h4>
<tr>
  <td class="table-cell">${formData.wavexOutput1 || ''}</td>
  <td class="table-cell">${formData.wavexOutput1Sentence || ''}</td>
  <td class="table-cell">${formData.wavexOutput1UpdateInterval || ''}</td>
  <td class="table-cell">${formData.wavexOutput1Settings || ''}</td>
</tr>
<tr>
<td class="table-cell">${formData.wavexOutput2 || ''}</td>
<td class="table-cell">${formData.wavexOutput2Sentence || ''}</td>
<td class="table-cell">${formData.wavexOutput2UpdateInterval || ''}</td>
<td class="table-cell">${formData.wavexOutput2Settings || ''}</td>
</tr>
<tr>
<td class="table-cell">${formData.wavexOutput3 || ''}</td>
<td class="table-cell">${formData.wavexOutput3Sentence || ''}</td>
<td class="table-cell">${formData.wavexOutput3UpdateInterval || ''}</td>
<td class="table-cell">${formData.wavexOutput3Settings || ''}</td>
</tr>
</table>

<br>
<div class="line_sub"></div>
  <h3>Final Start-up</h3>
  <table>
  <tr>
    <td style="padding-right: 20px;"><strong>Final 20 Minute:</strong> ${formData.final20Minute}</td>
    <td style="padding-right: 20px;"><strong>Final Data Output:</strong> ${formData.finalDataOutput}</td>
  </tr>
  </table>
  <div class="line_sub"></div>
  <h3>Login Details</h3>

  <table>

  <thead>
  <tr>
    <th class="table-cell table-header">Type</th>
    <th class="table-cell table-header">Username</th>
    <th class="table-cell table-header">Password</th>
    <th class="table-cell table-header">Comments</th>
  </tr>
</thead>


<tr>
  <td class="table-cell">${formData.loginType1 || ''}</td>
  <td class="table-cell">${formData.loginUsername1 || ''}</td>
  <td class="table-cell">${formData.loginPassword1 || ''}</td>
  <td class="table-cell">${formData.loginComments1 || ''}</td>
</tr>
<tr>
  <td class="table-cell">${formData.loginType2 || ''}</td>
  <td class="table-cell">${formData.loginUsername2 || ''}</td>
  <td class="table-cell">${formData.loginPassword2 || ''}</td>
  <td class="table-cell">${formData.loginComments2 || ''}</td>
</tr>
<tr>
  <td class="table-cell">${formData.loginType3 || ''}</td>
  <td class="table-cell">${formData.loginUsername3 || ''}</td>
  <td class="table-cell">${formData.loginPassword3 || ''}</td>
  <td class="table-cell">${formData.loginComments3 || ''}</td>
</tr>
</table>




<div style="text-align: center;">
<br>
<!-- Display uploaded images in a grid layout -->
<div class="image-container">
  ${imageUrls.map(url => `<div><img src="${url}" style="max-width: 100%;"></div>`).join('')}
</div>

 
  </div>
</div>
<div class="blank-space">
</div>
<div class="footer">
  <!-- Footer content -->
  <p>&copy; 2024 Miros Group. All rights reserved.</p>
  <p><a href="https://www.miros-group.com" style="color: white;">Miros Cloud Terms & Conditions</a></p>
  <a href="https://www.miros-group.com">
  <img src="https://miros.app/miros-logo-two-tone-light.631848d3e1f5088e7f228ac7b63d6dbc.svg" style="width: 100px;">
</a>

</div>  
  </body>
  </html>
  `;

  const newWindow = window.open('', '_blank');
  newWindow.document.write(html);
  newWindow.document.close();
}

function openReportOSD() {
  const formData = JSON.parse(localStorage.getItem('formData'));
  var workStatusValue = document.querySelector('select[name="workStatus"]').value;

  if (workStatusValue === 'Complete') {
    alert('Please ensure the site is set to "Commissioned" in the Miros Cloud administration area.');
  }


  if (workStatusValue !== 'Complete' && workStatusValue !== 'In Progress' && workStatusValue !== 'Needs Attention') {
    alert('Check the work status. It is not possible to generate a report or certificate at this stage.');
    return;
  }

  const selectedElements = {
    system: formData.system,
    workType: formData.workType,
    site: formData.site,
    siteType: formData.siteType,
    customer: formData.customer,
    date: formData.date,
    imo: formData.imo,
    location: formData.location,
    engineer: formData.engineer,
    engineer2: formData.engineer2,
    recordEquipment1: formData.recordEquipment1,
    equipmentManufact1: formData.equipmentManufact1,
    equipmentModel1: formData.equipmentModel1,
    equipmentPartNo1: formData.equipmentPartNo1,
    equipmentSerialNo1: formData.equipmentSerialNo1,
    equipmentLocation1: formData.equipmentLocation1,
    recordEquipment2: formData.recordEquipment2,
    equipmentManufact2: formData.equipmentManufact2,
    equipmentModel2: formData.equipmentModel2,
    equipmentPartNo2: formData.equipmentPartNo2,
    equipmentSerialNo2: formData.equipmentSerialNo2,
    equipmentLocation2: formData.equipmentLocation2,
    recordEquipment3: formData.recordEquipment3,
    equipmentManufact3: formData.equipmentManufact3,
    equipmentModel3: formData.equipmentModel3,
    equipmentPartNo3: formData.equipmentPartNo3,
    equipmentSerialNo3: formData.equipmentSerialNo3,
    equipmentLocation3: formData.equipmentLocation3,
    recordEquipment4: formData.recordEquipment4,
    equipmentManufact4: formData.equipmentManufact4,
    equipmentModel4: formData.equipmentModel4,
    equipmentPartNo4: formData.equipmentPartNo4,
    equipmentSerialNo4: formData.equipmentSerialNo4,
    equipmentLocation4: formData.equipmentLocation4,
    recordEquipment5: formData.recordEquipment5,
    equipmentManufact5: formData.equipmentManufact5,
    equipmentModel5: formData.equipmentModel5,
    equipmentPartNo5: formData.equipmentPartNo5,
    equipmentSerialNo5: formData.equipmentSerialNo5,
    equipmentLocation5: formData.equipmentLocation5,
    recordEquipment6: formData.recordEquipment6,
    equipmentManufact6: formData.equipmentManufact6,
    equipmentModel6: formData.equipmentModel6,
    equipmentPartNo6: formData.equipmentPartNo6,
    equipmentSerialNo6: formData.equipmentSerialNo6,
    equipmentLocation6: formData.equipmentLocation6,
    recordEquipment7: formData.recordEquipment7,
    equipmentManufact7: formData.equipmentManufact7,
    equipmentModel7: formData.equipmentModel7,
    equipmentPartNo7: formData.equipmentPartNo7,
    equipmentSerialNo7: formData.equipmentSerialNo7,
    equipmentLocation7: formData.equipmentLocation7,
    recordEquipment8: formData.recordEquipment8,
    equipmentManufact8: formData.equipmentManufact8,
    equipmentModel8: formData.equipmentModel8,
    equipmentPart8: formData.equipmentPart8,
    equipmentSerial8: formData.equipmentSerial8,
    equipmentLocation8: formData.equipmentLocation8,
    checkEquipment1: formData.checkEquipment1,
    checkVisual1: formData.checkVisual1,
    checkMech1: formData.checkMech1,
    checkCabling1: formData.checkCabling1,
    checkPower1: formData.checkPower1,
    checkEarthing1: formData.checkEarthing1,
    checkEquipment2: formData.checkEquipment2,
    checkVisual2: formData.checkVisual2,
    checkMech2: formData.checkMech2,
    checkCabling2: formData.checkCabling2,
    checkPower2: formData.checkPower2,
    checkEarthing2: formData.checkEarthing2,
    checkEquipment3: formData.checkEquipment3,
    checkVisual3: formData.checkVisual3,
    checkMech3: formData.checkMech3,
    checkCabling3: formData.checkCabling3,
    checkPower3: formData.checkPower3,
    checkEarthing3: formData.checkEarthing3,
    checkEquipment4: formData.checkEquipment4,
    checkVisual4: formData.checkVisual4,
    checkMech4: formData.checkMech4,
    checkCabling4: formData.checkCabling4,
    checkPower4: formData.checkPower4,
    checkEarthing4: formData.checkEarthing4,

    checkEquipment5: formData.checkEquipment5,
    checkVisual5: formData.checkVisual5,
    checkMech5: formData.checkMech5,
    checkCabling5: formData.checkCabling5,
    checkPower5: formData.checkPower5,
    checkEarthing5: formData.checkEarthing5,

    checkEquipment6: formData.checkEquipment6,
    checkVisual6: formData.checkVisual6,
    checkMech6: formData.checkMech6,
    checkCabling6: formData.checkCabling6,
    checkPower6: formData.checkPower6,
    checkEarthing6: formData.checkEarthing6,

    checkEquipment7: formData.checkEquipment7,
    checkVisual7: formData.checkVisual7,
    checkMech7: formData.checkMech7,
    checkCabling7: formData.checkCabling7,
    checkPower7: formData.checkPower7,
    checkEarthing7: formData.checkEarthing7,

    checkEquipment8: formData.checkEquipment8,
    checkVisual8: formData.checkVisual8,
    checkMech8: formData.checkMech8,
    checkCabling8: formData.checkCabling8,
    checkPower8: formData.checkPower8,
    checkEarthing8: formData.checkEarthing8,

    radarManufacturer: formData.radarManufacturer,
    radarModel: formData.radarModel,
    radarUse: formData.radarUse,
    radarTxtime: formData.radarTxtime,
    radarLocation: formData.radarLocation,
    radarSettings: formData.radarSettings,
    networkEquipment1: formData.networkEquipment1,
    equipmentIpAddress1: formData.equipmentIpAddress1,
    equipmentSubnetMask1: formData.equipmentSubnetMask1,
    equipmentDefaultGateway1: formData.equipmentDefaultGateway1,
    equipmentMac1: formData.equipmentMac1,
    networkEquipment2: formData.networkEquipment2,
    equipmentIpAddress2: formData.equipmentIpAddress2,
    equipmentSubnetMask2: formData.equipmentSubnetMask2,
    equipmentDefaultGateway2: formData.equipmentDefaultGateway2,
    equipmentMac2: formData.equipmentMac2,
    networkEquipment3: formData.networkEquipment3,
    equipmentIpAddress3: formData.equipmentIpAddress3,
    equipmentSubnetMask3: formData.equipmentSubnetMask3,
    equipmentDefaultGateway3: formData.equipmentDefaultGateway3,
    equipmentMac3: formData.equipmentMac3,
    networkEquipment4: formData.networkEquipment4,
    equipmentIpAddress4: formData.equipmentIpAddress4,
    equipmentSubnetMask4: formData.equipmentSubnetMask4,
    equipmentDefaultGateway4: formData.equipmentDefaultGateway4,
    equipmentMac4: formData.equipmentMac4,
    networkEquipment5: formData.networkEquipment5,
    equipmentIpAddress5: formData.equipmentIpAddress5,
    equipmentSubnetMask5: formData.equipmentSubnetMask5,
    equipmentDefaultGateway5: formData.equipmentDefaultGateway5,
    equipmentMac5: formData.equipmentMac5,
    networkEquipment6: formData.networkEquipment6,
    equipmentIpAddress6: formData.equipmentIpAddress6,
    equipmentSubnetMask6: formData.equipmentSubnetMask6,
    equipmentDefaultGateway6: formData.equipmentDefaultGateway6,
    equipmentMac6: formData.equipmentMac6,
    networkEquipment7: formData.networkEquipment7,
    equipmentIpAddress7: formData.equipmentIpAddress7,
    equipmentSubnetMask7: formData.equipmentSubnetMask7,
    equipmentDefaultGateway7: formData.equipmentDefaultGateway7,
    equipmentMac7: formData.equipmentMac7,
    networkEquipment8: formData.networkEquipment8,
    equipmentIpAddress8: formData.equipmentIpAddress8,
    equipmentSubnetMask8: formData.equipmentSubnetMask8,
    equipmentDefaultGateway8: formData.equipmentDefaultGateway8,
    equipmentMac8: formData.equipmentMac8,
    networkDns: formData.networkDns,
    networkComments: formData.networkComments,
    cloudHost1: formData.cloudHost1,
    cloudHost2: formData.cloudHost2,
    osdOptions: formData.osdOptions,
    osdOutput1: formData.osdOutput1,
    osdOutput1Sentence: formData.osdOutput1Sentence,
    osdOutput1UpdateInterval: formData.osdOutput1UpdateInterval,
    osdOutput1Settings: formData.osdOutput1Settings,
    osdOutput2: formData.osdOutput2,
    osdOutput2Sentence: formData.osdOutput2Sentence,
    osdOutput2UpdateInterval: formData.osdOutput2UpdateInterval,
    osdOutput2Settings: formData.osdOutput2Settings,
    osdOutput3: formData.osdOutput3,
    osdOutput3Sentence: formData.osdOutput3Sentence,
    osdOutput3UpdateInterval: formData.osdOutput3UpdateInterval,
    osdOutput3Settings: formData.osdOutput3Settings,
    cloudEnabled: formData.cloudEnabled,
    final20Minute: formData.final20Minute,
    finalDataOutput: formData.finalDataOutput,
    loginType1: formData.loginType1,
    loginUsername1: formData.loginUsername1,
    loginPassword1: formData.loginPassword1,
    loginComments1: formData.loginComments1,
    loginType2: formData.loginType2,
    loginUsername2: formData.loginUsername2,
    loginPassword2: formData.loginPassword2,
    loginComments2: formData.loginComments2,
    loginType3: formData.loginType3,
    loginUsername2: formData.loginUsername3,
    loginPassword3: formData.loginPassword3,
    loginComments3: formData.loginComments3,
    workStatus: formData.workStatus,
    subscriptionStatus: formData.subscriptionStatus,
    subscriptionExpiry: formData.subscriptionExpiry,
    generalComments: formData.generalComments
  };

  // Retrieve uploaded images
  const uploadedImages = document.querySelectorAll('.uploaded-images img');
  const imageUrls = Array.from(uploadedImages).map(img => img.src);


  const html = `
  <!DOCTYPE html>
  <html>
  <head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Miros Site Report</title>
  <link rel="stylesheet" type="text/css" href="style_report.css">
</head>  
<body>

<div class="header">
  <div class="text-container">
  <img src="https://raw.githubusercontent.com/alfredlille/random/refs/heads/main/images/miros_logo.svg" style="width: 200px; padding-bottom: 10px;">

  <div class="info"><span class="label">System:</span> <span class="value">${selectedElements.system}</span></div>
    <div class="info"><span class="label">Site:</span> <span class="value">${selectedElements.site}</span></div>
    <div class="info"><span class="label">Customer:</span> <span class="value">${selectedElements.customer}</span></div>
    <div class="info"><span class="label">Date:</span> <span class="value">${selectedElements.date}</span></div>
    <div class="info"><span class="label">Work Type:</span> <span class="value">${selectedElements.workType}</span></div>
    <div class="info"><span class="label">Work Status:</span> <span class="value">${selectedElements.workStatus}</span></div>
    <div class="info"><span class="label">Subscription Expiry:</span> <span class="value">${selectedElements.subscriptionStatus}   ${selectedElements.subscriptionExpiry}</span></div>
</div>

<table style="width: 100%; text-align: right; color: #ffffff; border-collapse: collapse;">
  <!-- First Row -->
  <tr>
<td 
  style="font-size: 20px; font-weight: bold; padding-right: 40px; padding-top: 15px; white-space: nowrap;">
  Site Report
</td>
  </tr>
  
  <!-- Second Row (Email) -->
<tr>
    <td style="font-size: 14px; padding-right: 40px; white-space: nowrap;">
<button id="downloadButton" onclick="generatePDF()">Download PDF</button>
    </td>
  </tr>
</table>
</div>


<div class="container">
<div style="text-align: center; padding-top: 20px; padding-bottom: 10px;">
    <img src="https://raw.githubusercontent.com/alfredlille/random/refs/heads/main/images/osd.png" style="width: 700px;">
</div>


  <h3>Overview</h3>
  <p style="max-width: 750px;">${selectedElements.generalComments}</p>





  <table class="info-table">
  <!-- System -->
  <tr>
    <td class="label">System:</td>
    <td>${selectedElements.system}</td>
  </tr>
  <!-- Site Type -->
  <tr>
    <td class="label">Site Type:</td>
    <td>${selectedElements.siteType}</td>
  </tr>
  <!-- IMO -->
  <tr>
    <td class="label">IMO:</td>
    <td>${selectedElements.imo}</td>
  </tr>
  <!-- Work Type -->
  <tr>
    <td class="label">Work Type:</td>
    <td>${selectedElements.workType}</td>
  </tr>
  <!-- Customer -->
  <tr>
    <td class="label">Customer:</td>
    <td>${selectedElements.customer}</td>
  </tr>
  <!-- Location -->
  <tr>
    <td class="label">Location:</td>
    <td>${selectedElements.location}</td>
  </tr>
  <!-- Site -->
  <tr>
    <td class="label">Site:</td>
    <td>${selectedElements.site}</td>
  </tr>
  <!-- Date -->
  <tr>
    <td class="label">Date:</td>
    <td>${selectedElements.date}</td>
  </tr>
  <!-- Engineer -->
  <tr>
    <td class="label">Engineer(s):</td>
    <td>${selectedElements.engineer}</td>
  </tr>
  <tr>
  <td class="label"></td>
  ${selectedElements.engineer2 ? `<td>${selectedElements.engineer2}</td>` : ''}
  </tr>

</table>


<div style="break-after:page"></div>

<h3>Record of Equipment</h3>
<table>
  <thead>
    <tr>
      <th class="table-cell table-header">Equipment</th>
      <th class="table-cell table-header">Manufacturer</th>
      <th class="table-cell table-header">Model</th>
      <th class="table-cell table-header">Part No</th>
      <th class="table-cell table-header">Serial No.</th>
      <th class="table-cell table-header">Location</th>
    </tr>
  </thead>
  <tbody>
    <!-- Equipment row 1 -->
    <tr>
    <td class="table-cell">${selectedElements.recordEquipment1 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentManufact1 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentModel1 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentPartNo1 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentSerialNo1 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentLocation1 || ''}</td>
  </tr>
  <tr>
    <td class="table-cell">${selectedElements.recordEquipment2 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentManufact2 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentModel2 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentPartNo2 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentSerialNo2 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentLocation2 || ''}</td>
  </tr>
  <tr>
    <td class="table-cell">${selectedElements.recordEquipment3 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentManufact3 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentModel3 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentPartNo3 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentSerialNo3 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentLocation3 || ''}</td>
  </tr>
  <tr>
    <td class="table-cell">${selectedElements.recordEquipment4 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentManufact4 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentModel4 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentPartNo4 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentSerialNo4 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentLocation4 || ''}</td>
  </tr>
  <tr>
    <td class="table-cell">${selectedElements.recordEquipment5 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentManufact5 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentModel5 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentPartNo5 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentSerialNo5 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentLocation5 || ''}</td>
  </tr>
  <tr>
    <td class="table-cell">${selectedElements.recordEquipment6 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentManufact6 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentModel6 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentPartNo6 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentSerialNo6 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentLocation6 || ''}</td>
  </tr>
  <tr>
    <td class="table-cell">${selectedElements.recordEquipment7 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentManufact7 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentModel7 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentPartNo7 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentSerialNo7 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentLocation7 || ''}</td>
  </tr>
  <tr>
    <td class="table-cell">${selectedElements.recordEquipment8 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentManufact8 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentModel8 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentPartNo8 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentSerialNo8 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentLocation8 || ''}</td>
  </tr>
    </tbody>
</table>
<div class="line_sub"></div>


<h3>Equipment Checks</h3>
<h4>Delivered Equipment</h4>
<table>

<thead>
<tr>
  <th class="table-cell table-header">Equipment</th>
  <th class="table-cell table-header">Visual</th>
  <th class="table-cell table-header">Mechanical</th>
  <th class="table-cell table-header">Cabling</th>
  <th class="table-cell table-header">Power</th>
  <th class="table-cell table-header">Earthing</th>
</tr>
</thead>

<tbody>
<tr>
  <td class="table-cell">${selectedElements.checkEquipment1 || ''}</td>
  <td class="table-cell">${selectedElements.checkVisual1 || ''}</td>
  <td class="table-cell">${selectedElements.checkMech1 || ''}</td>
  <td class="table-cell">${selectedElements.checkCabling1 || ''}</td>
  <td class="table-cell">${selectedElements.checkPower1 || ''}</td>
  <td class="table-cell">${selectedElements.checkEarthing1 || ''}</td>
</tr>
<tr>
  <td class="table-cell">${selectedElements.checkEquipment2 || ''}</td>
  <td class="table-cell">${selectedElements.checkVisual2 || ''}</td>
  <td class="table-cell">${selectedElements.checkMech2 || ''}</td>
  <td class="table-cell">${selectedElements.checkCabling2 || ''}</td>
  <td class="table-cell">${selectedElements.checkPower2 || ''}</td>
  <td class="table-cell">${selectedElements.checkEarthing2 || ''}</td>
</tr>
<tr>
  <td class="table-cell">${selectedElements.checkEquipment3 || ''}</td>
  <td class="table-cell">${selectedElements.checkVisual3 || ''}</td>
  <td class="table-cell">${selectedElements.checkMech3 || ''}</td>
  <td class="table-cell">${selectedElements.checkCabling3 || ''}</td>
  <td class="table-cell">${selectedElements.checkPower3 || ''}</td>
  <td class="table-cell">${selectedElements.checkEarthing3 || ''}</td>
</tr>
<tr>
  <td class="table-cell">${selectedElements.checkEquipment4 || ''}</td>
  <td class="table-cell">${selectedElements.checkVisual4 || ''}</td>
  <td class="table-cell">${selectedElements.checkMech4 || ''}</td>
  <td class="table-cell">${selectedElements.checkCabling4 || ''}</td>
  <td class="table-cell">${selectedElements.checkPower4 || ''}</td>
  <td class="table-cell">${selectedElements.checkEarthing4 || ''}</td>
</tr>
<tr>
  <td class="table-cell">${selectedElements.checkEquipment5 || ''}</td>
  <td class="table-cell">${selectedElements.checkVisual5 || ''}</td>
  <td class="table-cell">${selectedElements.checkMech5 || ''}</td>
  <td class="table-cell">${selectedElements.checkCabling5 || ''}</td>
  <td class="table-cell">${selectedElements.checkPower5 || ''}</td>
  <td class="table-cell">${selectedElements.checkEarthing5 || ''}</td>
</tr>
<tr>
  <td class="table-cell">${selectedElements.checkEquipment6 || ''}</td>
  <td class="table-cell">${selectedElements.checkVisual6 || ''}</td>
  <td class="table-cell">${selectedElements.checkMech6 || ''}</td>
  <td class="table-cell">${selectedElements.checkCabling6 || ''}</td>
  <td class="table-cell">${selectedElements.checkPower6 || ''}</td>
  <td class="table-cell">${selectedElements.checkEarthing6 || ''}</td>
</tr>
<tr>
  <td class="table-cell">${selectedElements.checkEquipment7 || ''}</td>
  <td class="table-cell">${selectedElements.checkVisual7 || ''}</td>
  <td class="table-cell">${selectedElements.checkMech7 || ''}</td>
  <td class="table-cell">${selectedElements.checkCabling7 || ''}</td>
  <td class="table-cell">${selectedElements.checkPower7 || ''}</td>
  <td class="table-cell">${selectedElements.checkEarthing7 || ''}</td>
</tr>
<tr>
  <td class="table-cell">${selectedElements.checkEquipment8 || ''}</td>
  <td class="table-cell">${selectedElements.checkVisual8 || ''}</td>
  <td class="table-cell">${selectedElements.checkMech8 || ''}</td>
  <td class="table-cell">${selectedElements.checkCabling8 || ''}</td>
  <td class="table-cell">${selectedElements.checkPower8 || ''}</td>
  <td class="table-cell">${selectedElements.checkEarthing8 || ''}</td>
</tr>
</tbody>
</table>
<h4>Special Equipment Checks</h4>

  <h4>Radar</h4>
  <table>
  
  <tr>
    <td style="padding-right: 20px;"><strong>Radar Manufacturer:</strong> ${selectedElements.radarManufacturer}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>Radar Model:</strong> ${selectedElements.radarModel}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>Radar Use:</strong> ${selectedElements.radarUse}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>Radar Txtime:</strong> ${selectedElements.radarTxtime}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>Radar Settings:</strong> ${selectedElements.radarSettings}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>Radar Location:</strong> ${selectedElements.radarLocation}</td>
  </tr>
  
</table>
  <div class="line_sub"></div>
  <h3>Network Information</h3>
<h4>Site Network Connections</h4>

<table>

<thead>
<tr>
  <th class="table-cell table-header">Equipment</th>
  <th class="table-cell table-header">IP Address</th>
  <th class="table-cell table-header">Subnet Mask</th>
  <th class="table-cell table-header">Default Gateway</th>
  <th class="table-cell table-header">MAC Address</th>
</tr>
</thead>


<tr>
  <td class="table-cell">${formData.networkEquipment1 || ''}</td>
  <td class="table-cell">${formData.equipmentIpAddress1 || ''}</td>
  <td class="table-cell">${formData.equipmentSubnetMask1 || ''}</td>
  <td class="table-cell">${formData.equipmentDefaultGateway1 || ''}</td>
  <td class="table-cell">${formData.equipmentMac1 || ''}</td>
</tr>
<tr>
  <td class="table-cell">${formData.networkEquipment2 || ''}</td>
  <td class="table-cell">${formData.equipmentIpAddress2 || ''}</td>
  <td class="table-cell">${formData.equipmentSubnetMask2 || ''}</td>
  <td class="table-cell">${formData.equipmentDefaultGateway2 || ''}</td>
  <td class="table-cell">${formData.equipmentMac2 || ''}</td>
</tr>
<tr>
  <td class="table-cell">${formData.networkEquipment3 || ''}</td>
  <td class="table-cell">${formData.equipmentIpAddress3 || ''}</td>
  <td class="table-cell">${formData.equipmentSubnetMask3 || ''}</td>
  <td class="table-cell">${formData.equipmentDefaultGateway3 || ''}</td>
  <td class="table-cell">${formData.equipmentMac3 || ''}</td>
</tr>
<tr>
  <td class="table-cell">${formData.networkEquipment4 || ''}</td>
  <td class="table-cell">${formData.equipmentIpAddress4 || ''}</td>
  <td class="table-cell">${formData.equipmentSubnetMask4 || ''}</td>
  <td class="table-cell">${formData.equipmentDefaultGateway4 || ''}</td>
  <td class="table-cell">${formData.equipmentMac4 || ''}</td>
</tr>
<tr>
  <td class="table-cell">${formData.networkEquipment5 || ''}</td>
  <td class="table-cell">${formData.equipmentIpAddress5 || ''}</td>
  <td class="table-cell">${formData.equipmentSubnetMask5 || ''}</td>
  <td class="table-cell">${formData.equipmentDefaultGateway5 || ''}</td>
  <td class="table-cell">${formData.equipmentMac5 || ''}</td>
</tr>
<tr>
  <td class="table-cell">${formData.networkEquipment6 || ''}</td>
  <td class="table-cell">${formData.equipmentIpAddress6 || ''}</td>
  <td class="table-cell">${formData.equipmentSubnetMask6 || ''}</td>
  <td class="table-cell">${formData.equipmentDefaultGateway6 || ''}</td>
  <td class="table-cell">${formData.equipmentMac6 || ''}</td>
</tr>
<tr>
  <td class="table-cell">${formData.networkEquipment7 || ''}</td>
  <td class="table-cell">${formData.equipmentIpAddress7 || ''}</td>
  <td class="table-cell">${formData.equipmentSubnetMask7 || ''}</td>
  <td class="table-cell">${formData.equipmentDefaultGateway7 || ''}</td>
  <td class="table-cell">${formData.equipmentMac7 || ''}</td>
</tr>
<tr>
  <td class="table-cell">${formData.networkEquipment8 || ''}</td>
  <td class="table-cell">${formData.equipmentIpAddress8 || ''}</td>
  <td class="table-cell">${formData.equipmentSubnetMask8 || ''}</td>
  <td class="table-cell">${formData.equipmentDefaultGateway8 || ''}</td>
  <td class="table-cell">${formData.equipmentMac8 || ''}</td>
</tr>
  </table>
<h4>Cloud Firewall Exceptions</h4>
<table>
  <tr>
  <td style="padding-right: 20px;"><strong>admin.miros.app:</strong> ${formData.cloudHost1}</td>
  <td style="padding-right: 20px;"><strong>azure-devices.net:</strong> ${formData.cloudHost2}</td>
</tr>


</table>
<div class="line_sub"></div>

<div style="break-after:page"></div>


<h3>System Startup</h3>
<h4>Computer and Software Installation Check</h4>
<table>
  
  <tr>
    <td style="padding-right: 20px;"><strong>System Options:</strong> ${formData.osdOptions}</td>
    </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>Cloud Enabled:</strong> ${formData.cloudEnabled}</td>
  </tr>
  
  </table>
<br>



  <table>

  <thead>
  <tr>
    <th class="table-cell table-header">Enabled</th>
    <th class="table-cell table-header">Sentence</th>
    <th class="table-cell table-header">Update Interval</th>
    <th class="table-cell table-header">Settings</th>
  </tr>
</thead>

<h4>Outputs</h4>
<tr>
  <td class="table-cell">${formData.osdOutput1 || ''}</td>
  <td class="table-cell">${formData.osdOutput1Sentence || ''}</td>
  <td class="table-cell">${formData.osdOutput1UpdateInterval || ''}</td>
  <td class="table-cell">${formData.osdOutput1Settings || ''}</td>
</tr>
<tr>
<td class="table-cell">${formData.osdOutput2 || ''}</td>
<td class="table-cell">${formData.osdOutput2Sentence || ''}</td>
<td class="table-cell">${formData.osdOutput2UpdateInterval || ''}</td>
<td class="table-cell">${formData.osdOutput2Settings || ''}</td>
</tr>
<tr>
<td class="table-cell">${formData.osdOutput3 || ''}</td>
<td class="table-cell">${formData.osdOutput3Sentence || ''}</td>
<td class="table-cell">${formData.osdOutput3UpdateInterval || ''}</td>
<td class="table-cell">${formData.osdOutput3Settings || ''}</td>
</tr>
</table>

<br>
<div class="line_sub"></div>
  <h3>Final Start-up</h3>
  <table>
  <tr>
    <td style="padding-right: 20px;"><strong>Final 20 Minute:</strong> ${formData.final20Minute}</td>
    <td style="padding-right: 20px;"><strong>Final Data Output:</strong> ${formData.finalDataOutput}</td>
  </tr>
  </table>
  <div class="line_sub"></div>
  <h3>Login Details</h3>

  <table>

  <thead>
  <tr>
    <th class="table-cell table-header">Type</th>
    <th class="table-cell table-header">Username</th>
    <th class="table-cell table-header">Password</th>
    <th class="table-cell table-header">Comments</th>
  </tr>
</thead>


<tr>
  <td class="table-cell">${formData.loginType1 || ''}</td>
  <td class="table-cell">${formData.loginUsername1 || ''}</td>
  <td class="table-cell">${formData.loginPassword1 || ''}</td>
  <td class="table-cell">${formData.loginComments1 || ''}</td>
</tr>
<tr>
  <td class="table-cell">${formData.loginType2 || ''}</td>
  <td class="table-cell">${formData.loginUsername2 || ''}</td>
  <td class="table-cell">${formData.loginPassword2 || ''}</td>
  <td class="table-cell">${formData.loginComments2 || ''}</td>
</tr>
<tr>
  <td class="table-cell">${formData.loginType3 || ''}</td>
  <td class="table-cell">${formData.loginUsername3 || ''}</td>
  <td class="table-cell">${formData.loginPassword3 || ''}</td>
  <td class="table-cell">${formData.loginComments3 || ''}</td>
</tr>
</table>




<div style="text-align: center;">
<br>
<!-- Display uploaded images in a grid layout -->
<div class="image-container">
  ${imageUrls.map(url => `<div><img src="${url}" style="max-width: 100%;"></div>`).join('')}
</div>
<br>  
<br>
<br>
<br>

 
  </div>
</div>
<div class="blank-space">
</div>
<div class="footer">
  <!-- Footer content -->
  <p>&copy; 2024 Miros Group. All rights reserved.</p>
  <p><a href="https://www.miros-group.com" style="color: white;">Miros Cloud Terms & Conditions</a></p>
  <a href="https://www.miros-group.com">
  <img src="https://raw.githubusercontent.com/alfredlille/random/refs/heads/main/images/miros_logo.svg" style="width: 100px;">
</a>

</div>  

<script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.9.2/html2pdf.bundle.min.js"></script>

<script>
  function generatePDF() {
    // Get the button element
    const downloadButton = document.getElementById('downloadButton');

    // Temporarily hide the button so it doesn't appear in the PDF
    downloadButton.style.display = 'none';

    // The element you want to convert into a PDF
    const element = document.body; // You can target a specific part like a div here if you want

    // Set up the options for html2pdf
    const options = {
      margin: 0.5,
      filename: 'site_report.pdf',
      image: { type: 'png', quality: 0.98 },
      html2canvas: {
        scale: 2, // Higher scale for better quality
        useCORS: true  // Enable CORS for external images (like the Google logo)
      },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    // Generate the PDF
    html2pdf().set(options).from(element).save().then(() => {
      // Re-show the button after the PDF is generated
      downloadButton.style.display = 'inline-block';
    });
  }
</script>
  </body>
  
  </html>
  `;

  const newWindow = window.open('', '_blank');
  newWindow.document.write(html);
  newWindow.document.close();
}


function openReportMocean() {
  const formData = JSON.parse(localStorage.getItem('formData'));
  var workStatusValue = document.querySelector('select[name="workStatus"]').value;

  if (workStatusValue === 'Complete') {
    alert('Please ensure the site is set to "Commissioned" in the Miros Cloud administration area.');
  }


  if (workStatusValue !== 'Complete' && workStatusValue !== 'In Progress' && workStatusValue !== 'Needs Attention') {
    alert('Check the work status. It is not possible to generate a report or certificate at this stage.');
    return;
  }

  const selectedElements = {
    system: formData.system,
    workType: formData.workType,
    site: formData.site,
    siteType: formData.siteType,
    customer: formData.customer,
    date: formData.date,
    imo: formData.imo,
    location: formData.location,
    engineer: formData.engineer,
    engineer2: formData.engineer2,
    recordEquipment1: formData.recordEquipment1,
    equipmentManufact1: formData.equipmentManufact1,
    equipmentModel1: formData.equipmentModel1,
    equipmentPartNo1: formData.equipmentPartNo1,
    equipmentSerialNo1: formData.equipmentSerialNo1,
    equipmentLocation1: formData.equipmentLocation1,
    recordEquipment2: formData.recordEquipment2,
    equipmentManufact2: formData.equipmentManufact2,
    equipmentModel2: formData.equipmentModel2,
    equipmentPartNo2: formData.equipmentPartNo2,
    equipmentSerialNo2: formData.equipmentSerialNo2,
    equipmentLocation2: formData.equipmentLocation2,
    recordEquipment3: formData.recordEquipment3,
    equipmentManufact3: formData.equipmentManufact3,
    equipmentModel3: formData.equipmentModel3,
    equipmentPartNo3: formData.equipmentPartNo3,
    equipmentSerialNo3: formData.equipmentSerialNo3,
    equipmentLocation3: formData.equipmentLocation3,
    recordEquipment4: formData.recordEquipment4,
    equipmentManufact4: formData.equipmentManufact4,
    equipmentModel4: formData.equipmentModel4,
    equipmentPartNo4: formData.equipmentPartNo4,
    equipmentSerialNo4: formData.equipmentSerialNo4,
    equipmentLocation4: formData.equipmentLocation4,
    recordEquipment5: formData.recordEquipment5,
    equipmentManufact5: formData.equipmentManufact5,
    equipmentModel5: formData.equipmentModel5,
    equipmentPartNo5: formData.equipmentPartNo5,
    equipmentSerialNo5: formData.equipmentSerialNo5,
    equipmentLocation5: formData.equipmentLocation5,
    recordEquipment6: formData.recordEquipment6,
    equipmentManufact6: formData.equipmentManufact6,
    equipmentModel6: formData.equipmentModel6,
    equipmentPartNo6: formData.equipmentPartNo6,
    equipmentSerialNo6: formData.equipmentSerialNo6,
    equipmentLocation6: formData.equipmentLocation6,
    recordEquipment7: formData.recordEquipment7,
    equipmentManufact7: formData.equipmentManufact7,
    equipmentModel7: formData.equipmentModel7,
    equipmentPartNo7: formData.equipmentPartNo7,
    equipmentSerialNo7: formData.equipmentSerialNo7,
    equipmentLocation7: formData.equipmentLocation7,
    recordEquipment8: formData.recordEquipment8,
    equipmentManufact8: formData.equipmentManufact8,
    equipmentModel8: formData.equipmentModel8,
    equipmentPart8: formData.equipmentPart8,
    equipmentSerial8: formData.equipmentSerial8,
    equipmentLocation8: formData.equipmentLocation8,
    checkEquipment1: formData.checkEquipment1,
    checkVisual1: formData.checkVisual1,
    checkMech1: formData.checkMech1,
    checkCabling1: formData.checkCabling1,
    checkPower1: formData.checkPower1,
    checkEarthing1: formData.checkEarthing1,
    checkEquipment2: formData.checkEquipment2,
    checkVisual2: formData.checkVisual2,
    checkMech2: formData.checkMech2,
    checkCabling2: formData.checkCabling2,
    checkPower2: formData.checkPower2,
    checkEarthing2: formData.checkEarthing2,
    checkEquipment3: formData.checkEquipment3,
    checkVisual3: formData.checkVisual3,
    checkMech3: formData.checkMech3,
    checkCabling3: formData.checkCabling3,
    checkPower3: formData.checkPower3,
    checkEarthing3: formData.checkEarthing3,
    checkEquipment4: formData.checkEquipment4,
    checkVisual4: formData.checkVisual4,
    checkMech4: formData.checkMech4,
    checkCabling4: formData.checkCabling4,
    checkPower4: formData.checkPower4,
    checkEarthing4: formData.checkEarthing4,

    checkEquipment5: formData.checkEquipment5,
    checkVisual5: formData.checkVisual5,
    checkMech5: formData.checkMech5,
    checkCabling5: formData.checkCabling5,
    checkPower5: formData.checkPower5,
    checkEarthing5: formData.checkEarthing5,

    checkEquipment6: formData.checkEquipment6,
    checkVisual6: formData.checkVisual6,
    checkMech6: formData.checkMech6,
    checkCabling6: formData.checkCabling6,
    checkPower6: formData.checkPower6,
    checkEarthing6: formData.checkEarthing6,

    checkEquipment7: formData.checkEquipment7,
    checkVisual7: formData.checkVisual7,
    checkMech7: formData.checkMech7,
    checkCabling7: formData.checkCabling7,
    checkPower7: formData.checkPower7,
    checkEarthing7: formData.checkEarthing7,

    checkEquipment8: formData.checkEquipment8,
    checkVisual8: formData.checkVisual8,
    checkMech8: formData.checkMech8,
    checkCabling8: formData.checkCabling8,
    checkPower8: formData.checkPower8,
    checkEarthing8: formData.checkEarthing8,

    radarManufacturer: formData.radarManufacturer,
    radarModel: formData.radarModel,
    radarUse: formData.radarUse,
    radarTxtime: formData.radarTxtime,
    radarLocation: formData.radarLocation,
    radarSettings: formData.radarSettings,
    networkEquipment1: formData.networkEquipment1,
    equipmentIpAddress1: formData.equipmentIpAddress1,
    equipmentSubnetMask1: formData.equipmentSubnetMask1,
    equipmentDefaultGateway1: formData.equipmentDefaultGateway1,
    equipmentMac1: formData.equipmentMac1,
    networkEquipment2: formData.networkEquipment2,
    equipmentIpAddress2: formData.equipmentIpAddress2,
    equipmentSubnetMask2: formData.equipmentSubnetMask2,
    equipmentDefaultGateway2: formData.equipmentDefaultGateway2,
    equipmentMac2: formData.equipmentMac2,
    networkEquipment3: formData.networkEquipment3,
    equipmentIpAddress3: formData.equipmentIpAddress3,
    equipmentSubnetMask3: formData.equipmentSubnetMask3,
    equipmentDefaultGateway3: formData.equipmentDefaultGateway3,
    equipmentMac3: formData.equipmentMac3,
    networkEquipment4: formData.networkEquipment4,
    equipmentIpAddress4: formData.equipmentIpAddress4,
    equipmentSubnetMask4: formData.equipmentSubnetMask4,
    equipmentDefaultGateway4: formData.equipmentDefaultGateway4,
    equipmentMac4: formData.equipmentMac4,
    networkEquipment5: formData.networkEquipment5,
    equipmentIpAddress5: formData.equipmentIpAddress5,
    equipmentSubnetMask5: formData.equipmentSubnetMask5,
    equipmentDefaultGateway5: formData.equipmentDefaultGateway5,
    equipmentMac5: formData.equipmentMac5,
    networkEquipment6: formData.networkEquipment6,
    equipmentIpAddress6: formData.equipmentIpAddress6,
    equipmentSubnetMask6: formData.equipmentSubnetMask6,
    equipmentDefaultGateway6: formData.equipmentDefaultGateway6,
    equipmentMac6: formData.equipmentMac6,
    networkEquipment7: formData.networkEquipment7,
    equipmentIpAddress7: formData.equipmentIpAddress7,
    equipmentSubnetMask7: formData.equipmentSubnetMask7,
    equipmentDefaultGateway7: formData.equipmentDefaultGateway7,
    equipmentMac7: formData.equipmentMac7,
    networkEquipment8: formData.networkEquipment8,
    equipmentIpAddress8: formData.equipmentIpAddress8,
    equipmentSubnetMask8: formData.equipmentSubnetMask8,
    equipmentDefaultGateway8: formData.equipmentDefaultGateway8,
    equipmentMac8: formData.equipmentMac8,
    networkDns: formData.networkDns,
    networkComments: formData.networkComments,
    cloudHost1: formData.cloudHost1,
    cloudHost2: formData.cloudHost2,
    wavexOptions: formData.wavexOptions,
    wavexOutput1: formData.wavexOutput1,
    wavexOutput1Sentence: formData.wavexOutput1Sentence,
    wavexOutput1UpdateInterval: formData.wavexOutput1UpdateInterval,
    wavexOutput1Settings: formData.wavexOutput1Settings,
    wavexOutput2: formData.wavexOutput2,
    wavexOutput2Sentence: formData.wavexOutput2Sentence,
    wavexOutput2UpdateInterval: formData.wavexOutput2UpdateInterval,
    wavexOutput2Settings: formData.wavexOutput2Settings,
    wavexOutput3: formData.wavexOutput3,
    wavexOutput3Sentence: formData.wavexOutput3Sentence,
    wavexOutput3UpdateInterval: formData.wavexOutput3UpdateInterval,
    wavexOutput3Settings: formData.wavexOutput3Settings,
    cloudEnabled: formData.cloudEnabled,
    final20Minute: formData.final20Minute,
    finalDataOutput: formData.finalDataOutput,
    loginType1: formData.loginType1,
    loginUsername1: formData.loginUsername1,
    loginPassword1: formData.loginPassword1,
    loginComments1: formData.loginComments1,
    loginType2: formData.loginType2,
    loginUsername2: formData.loginUsername2,
    loginPassword2: formData.loginPassword2,
    loginComments2: formData.loginComments2,
    loginType3: formData.loginType3,
    loginUsername2: formData.loginUsername3,
    loginPassword3: formData.loginPassword3,
    loginComments3: formData.loginComments3,
    workStatus: formData.workStatus,
    subscriptionStatus: formData.subscriptionStatus,
    subscriptionExpiry: formData.subscriptionExpiry,
    generalComments: formData.generalComments
  };

  // Retrieve uploaded images
  const uploadedImages = document.querySelectorAll('.uploaded-images img');
  const imageUrls = Array.from(uploadedImages).map(img => img.src);


  const html = `
  <!DOCTYPE html>
  <html>
  <head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Miros Site Report</title>
  <link rel="stylesheet" type="text/css" href="style_report.css">
</head>  
<body>

<div class="header">
  <div class="text-container">
  <img src="https://mocean.miros.app/miros-mocean-logo.6761c3f7e4f32ff93e9fa5cb0303d3dd.svg" style="width: 200px; padding-bottom: 10px;">
  <div class="info"><span class="label">System:</span> <span class="value">${selectedElements.system}</span></div>
    <div class="info"><span class="label">Site:</span> <span class="value">${selectedElements.site}</span></div>
    <div class="info"><span class="label">Customer:</span> <span class="value">${selectedElements.customer}</span></div>
    <div class="info"><span class="label">Date:</span> <span class="value">${selectedElements.date}</span></div>
    <div class="info"><span class="label">Work Type:</span> <span class="value">${selectedElements.workType}</span></div>
    <div class="info"><span class="label">Work Status:</span> <span class="value">${selectedElements.workStatus}</span></div>
    <div class="info"><span class="label">Subscription Expiry:</span> <span class="value">${selectedElements.subscriptionStatus},${selectedElements.subscriptionExpiry}</span></div>
</div>
<!-- Large image to the right -->
<EDITimg src="header.jpeg" alt="Large Image Description" class="large-image">
</div>


<div class="container">
  <h2>Site Report</h2>
  <h3>1. Overview</h3>
  <p style="max-width: 750px;">${selectedElements.generalComments}</p>

  <table class="info-table">
  <!-- System -->
  <tr>
    <td class="label">System:</td>
    <td>${selectedElements.system}</td>
  </tr>
  <!-- Site Type -->
  <tr>
    <td class="label">Site Type:</td>
    <td>${selectedElements.siteType}</td>
  </tr>
  <!-- IMO -->
  <tr>
    <td class="label">IMO:</td>
    <td>${selectedElements.imo}</td>
  </tr>
  <!-- Work Type -->
  <tr>
    <td class="label">Work Type:</td>
    <td>${selectedElements.workType}</td>
  </tr>
  <!-- Customer -->
  <tr>
    <td class="label">Customer:</td>
    <td>${selectedElements.customer}</td>
  </tr>
  <!-- Location -->
  <tr>
    <td class="label">Location:</td>
    <td>${selectedElements.location}</td>
  </tr>
  <!-- Site -->
  <tr>
    <td class="label">Site:</td>
    <td>${selectedElements.site}</td>
  </tr>
  <!-- Date -->
  <tr>
    <td class="label">Date:</td>
    <td>${selectedElements.date}</td>
  </tr>
  <!-- Engineer -->
  <tr>
    <td class="label">Engineer(s):</td>
    <td>${selectedElements.engineer}</td>
  </tr>
  <tr>
  <td class="label"></td>
  ${selectedElements.engineer2 ? `<td>${selectedElements.engineer2}</td>` : ''}
  </tr>

</table>




<h3>2. Record Equipment</h3>
<table>
  <thead>
    <tr>
      <th class="table-cell table-header">Equipment</th>
      <th class="table-cell table-header">Manufacturer</th>
      <th class="table-cell table-header">Model</th>
      <th class="table-cell table-header">Part No</th>
      <th class="table-cell table-header">Serial No.</th>
      <th class="table-cell table-header">Location</th>
    </tr>
  </thead>
  <tbody>
    <!-- Equipment row 1 -->
    <tr>
    <td class="table-cell">${selectedElements.recordEquipment1 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentManufact1 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentModel1 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentPartNo1 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentSerialNo1 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentLocation1 || ''}</td>
  </tr>
  <tr>
    <td class="table-cell">${selectedElements.recordEquipment2 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentManufact2 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentModel2 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentPartNo2 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentSerialNo2 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentLocation2 || ''}</td>
  </tr>
  <tr>
    <td class="table-cell">${selectedElements.recordEquipment3 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentManufact3 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentModel3 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentPartNo3 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentSerialNo3 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentLocation3 || ''}</td>
  </tr>
  <tr>
    <td class="table-cell">${selectedElements.recordEquipment4 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentManufact4 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentModel4 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentPartNo4 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentSerialNo4 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentLocation4 || ''}</td>
  </tr>
  <tr>
    <td class="table-cell">${selectedElements.recordEquipment5 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentManufact5 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentModel5 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentPartNo5 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentSerialNo5 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentLocation5 || ''}</td>
  </tr>
  <tr>
    <td class="table-cell">${selectedElements.recordEquipment6 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentManufact6 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentModel6 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentPartNo6 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentSerialNo6 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentLocation6 || ''}</td>
  </tr>
  <tr>
    <td class="table-cell">${selectedElements.recordEquipment7 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentManufact7 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentModel7 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentPartNo7 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentSerialNo7 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentLocation7 || ''}</td>
  </tr>
  <tr>
    <td class="table-cell">${selectedElements.recordEquipment8 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentManufact8 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentModel8 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentPartNo8 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentSerialNo8 || ''}</td>
    <td class="table-cell">${selectedElements.equipmentLocation8 || ''}</td>
  </tr>
    </tbody>
</table>
<div class="line_sub"></div>


<h3>3. Check Equipment</h3>
<h4>3.1 Equipment</h4>
<table>

<thead>
<tr>
  <th class="table-cell table-header">Equipment</th>
  <th class="table-cell table-header">Visual</th>
  <th class="table-cell table-header">Mechanical</th>
  <th class="table-cell table-header">Cabling</th>
  <th class="table-cell table-header">Power</th>
  <th class="table-cell table-header">Earthing</th>
</tr>
</thead>

<tbody>
<tr>
  <td class="table-cell">${selectedElements.checkEquipment1 || ''}</td>
  <td class="table-cell">${selectedElements.checkVisual1 || ''}</td>
  <td class="table-cell">${selectedElements.checkMech1 || ''}</td>
  <td class="table-cell">${selectedElements.checkCabling1 || ''}</td>
  <td class="table-cell">${selectedElements.checkPower1 || ''}</td>
  <td class="table-cell">${selectedElements.checkEarthing1 || ''}</td>
</tr>
<tr>
  <td class="table-cell">${selectedElements.checkEquipment2 || ''}</td>
  <td class="table-cell">${selectedElements.checkVisual2 || ''}</td>
  <td class="table-cell">${selectedElements.checkMech2 || ''}</td>
  <td class="table-cell">${selectedElements.checkCabling2 || ''}</td>
  <td class="table-cell">${selectedElements.checkPower2 || ''}</td>
  <td class="table-cell">${selectedElements.checkEarthing2 || ''}</td>
</tr>
<tr>
  <td class="table-cell">${selectedElements.checkEquipment3 || ''}</td>
  <td class="table-cell">${selectedElements.checkVisual3 || ''}</td>
  <td class="table-cell">${selectedElements.checkMech3 || ''}</td>
  <td class="table-cell">${selectedElements.checkCabling3 || ''}</td>
  <td class="table-cell">${selectedElements.checkPower3 || ''}</td>
  <td class="table-cell">${selectedElements.checkEarthing3 || ''}</td>
</tr>
<tr>
  <td class="table-cell">${selectedElements.checkEquipment4 || ''}</td>
  <td class="table-cell">${selectedElements.checkVisual4 || ''}</td>
  <td class="table-cell">${selectedElements.checkMech4 || ''}</td>
  <td class="table-cell">${selectedElements.checkCabling4 || ''}</td>
  <td class="table-cell">${selectedElements.checkPower4 || ''}</td>
  <td class="table-cell">${selectedElements.checkEarthing4 || ''}</td>
</tr>
<tr>
  <td class="table-cell">${selectedElements.checkEquipment5 || ''}</td>
  <td class="table-cell">${selectedElements.checkVisual5 || ''}</td>
  <td class="table-cell">${selectedElements.checkMech5 || ''}</td>
  <td class="table-cell">${selectedElements.checkCabling5 || ''}</td>
  <td class="table-cell">${selectedElements.checkPower5 || ''}</td>
  <td class="table-cell">${selectedElements.checkEarthing5 || ''}</td>
</tr>
<tr>
  <td class="table-cell">${selectedElements.checkEquipment6 || ''}</td>
  <td class="table-cell">${selectedElements.checkVisual6 || ''}</td>
  <td class="table-cell">${selectedElements.checkMech6 || ''}</td>
  <td class="table-cell">${selectedElements.checkCabling6 || ''}</td>
  <td class="table-cell">${selectedElements.checkPower6 || ''}</td>
  <td class="table-cell">${selectedElements.checkEarthing6 || ''}</td>
</tr>
<tr>
  <td class="table-cell">${selectedElements.checkEquipment7 || ''}</td>
  <td class="table-cell">${selectedElements.checkVisual7 || ''}</td>
  <td class="table-cell">${selectedElements.checkMech7 || ''}</td>
  <td class="table-cell">${selectedElements.checkCabling7 || ''}</td>
  <td class="table-cell">${selectedElements.checkPower7 || ''}</td>
  <td class="table-cell">${selectedElements.checkEarthing7 || ''}</td>
</tr>
<tr>
  <td class="table-cell">${selectedElements.checkEquipment8 || ''}</td>
  <td class="table-cell">${selectedElements.checkVisual8 || ''}</td>
  <td class="table-cell">${selectedElements.checkMech8 || ''}</td>
  <td class="table-cell">${selectedElements.checkCabling8 || ''}</td>
  <td class="table-cell">${selectedElements.checkPower8 || ''}</td>
  <td class="table-cell">${selectedElements.checkEarthing8 || ''}</td>
</tr>
</tbody>
</table>
<h4>3.2 Equipment Specific Checks</h4>

<h4>Radar</h4>
<table>

<tr>
  <td style="padding-right: 20px;"><strong>Radar Manufacturer:</strong> ${selectedElements.radarManufacturer}</td>
</tr>
<tr>
  <td style="padding-right: 20px;"><strong>Radar Model:</strong> ${selectedElements.radarModel}</td>
</tr>
<tr>
  <td style="padding-right: 20px;"><strong>Radar Use:</strong> ${selectedElements.radarUse}</td>
</tr>
<tr>
  <td style="padding-right: 20px;"><strong>Radar Txtime:</strong> ${selectedElements.radarTxtime}</td>
</tr>
<tr>
  <td style="padding-right: 20px;"><strong>Radar Settings:</strong> ${selectedElements.radarSettings}</td>
</tr>
<tr>
  <td style="padding-right: 20px;"><strong>Radar Location:</strong> ${selectedElements.radarLocation}</td>
</tr>

</table>
<div class="line_sub"></div>
  <h3>4. Network Information</h3>
<h4>4.1 Site Network Connections</h4>

<table>

<thead>
<tr>
  <th class="table-cell table-header">Equipment</th>
  <th class="table-cell table-header">IP Address</th>
  <th class="table-cell table-header">Subnet Mask</th>
  <th class="table-cell table-header">Default Gateway</th>
  <th class="table-cell table-header">MAC Address</th>
</tr>
</thead>


<tr>
  <td class="table-cell">${formData.networkEquipment1 || ''}</td>
  <td class="table-cell">${formData.equipmentIpAddress1 || ''}</td>
  <td class="table-cell">${formData.equipmentSubnetMask1 || ''}</td>
  <td class="table-cell">${formData.equipmentDefaultGateway1 || ''}</td>
  <td class="table-cell">${formData.equipmentMac1 || ''}</td>
</tr>
<tr>
  <td class="table-cell">${formData.networkEquipment2 || ''}</td>
  <td class="table-cell">${formData.equipmentIpAddress2 || ''}</td>
  <td class="table-cell">${formData.equipmentSubnetMask2 || ''}</td>
  <td class="table-cell">${formData.equipmentDefaultGateway2 || ''}</td>
  <td class="table-cell">${formData.equipmentMac2 || ''}</td>
</tr>
<tr>
  <td class="table-cell">${formData.networkEquipment3 || ''}</td>
  <td class="table-cell">${formData.equipmentIpAddress3 || ''}</td>
  <td class="table-cell">${formData.equipmentSubnetMask3 || ''}</td>
  <td class="table-cell">${formData.equipmentDefaultGateway3 || ''}</td>
  <td class="table-cell">${formData.equipmentMac3 || ''}</td>
</tr>
<tr>
  <td class="table-cell">${formData.networkEquipment4 || ''}</td>
  <td class="table-cell">${formData.equipmentIpAddress4 || ''}</td>
  <td class="table-cell">${formData.equipmentSubnetMask4 || ''}</td>
  <td class="table-cell">${formData.equipmentDefaultGateway4 || ''}</td>
  <td class="table-cell">${formData.equipmentMac4 || ''}</td>
</tr>
<tr>
  <td class="table-cell">${formData.networkEquipment5 || ''}</td>
  <td class="table-cell">${formData.equipmentIpAddress5 || ''}</td>
  <td class="table-cell">${formData.equipmentSubnetMask5 || ''}</td>
  <td class="table-cell">${formData.equipmentDefaultGateway5 || ''}</td>
  <td class="table-cell">${formData.equipmentMac5 || ''}</td>
</tr>
<tr>
  <td class="table-cell">${formData.networkEquipment6 || ''}</td>
  <td class="table-cell">${formData.equipmentIpAddress6 || ''}</td>
  <td class="table-cell">${formData.equipmentSubnetMask6 || ''}</td>
  <td class="table-cell">${formData.equipmentDefaultGateway6 || ''}</td>
  <td class="table-cell">${formData.equipmentMac6 || ''}</td>
</tr>
<tr>
  <td class="table-cell">${formData.networkEquipment7 || ''}</td>
  <td class="table-cell">${formData.equipmentIpAddress7 || ''}</td>
  <td class="table-cell">${formData.equipmentSubnetMask7 || ''}</td>
  <td class="table-cell">${formData.equipmentDefaultGateway7 || ''}</td>
  <td class="table-cell">${formData.equipmentMac7 || ''}</td>
</tr>
<tr>
  <td class="table-cell">${formData.networkEquipment8 || ''}</td>
  <td class="table-cell">${formData.equipmentIpAddress8 || ''}</td>
  <td class="table-cell">${formData.equipmentSubnetMask8 || ''}</td>
  <td class="table-cell">${formData.equipmentDefaultGateway8 || ''}</td>
  <td class="table-cell">${formData.equipmentMac8 || ''}</td>
</tr>
  </table>
<h4>4.2 Cloud Configuration</h4>
<table>
  <tr>
  <td style="padding-right: 20px;"><strong>Cloud Host 1:</strong> ${formData.cloudHost1}</td>
  <td style="padding-right: 20px;"><strong>Cloud Host 2:</strong> ${formData.cloudHost2}</td>
</tr>


</table>
<div class="line_sub"></div>

<h3>5. Startup</h3>
<h4>5.1 Computer and Software Installation Check</h4>
<table>
  
  <tr>
    <td style="padding-right: 20px;"><strong>Wavex Options:</strong> ${formData.wavexOptions}</td>
    <td style="padding-right: 20px;"><strong>Third Party Startup:</strong> ${formData.thirdPartyStartup}</td>
  </tr>
  
  <tr>
    <td style="padding-right: 20px;"><strong>Wavex Advanced Current Cartesian Sections:</strong> ${formData.wavexAdvancedCurrentCartesianSections}</td>
  </tr>
  <tr>
    <td style="padding-right: 20px;"><strong>Cloud Enabled:</strong> ${formData.cloudEnabled}</td>
  </tr>
  
  </table>
<br>



  <table>

  <thead>
  <tr>
    <th class="table-cell table-header">Enabled</th>
    <th class="table-cell table-header">Sentence</th>
    <th class="table-cell table-header">Update Interval</th>
    <th class="table-cell table-header">Settings</th>
  </tr>
</thead>


<tr>
  <td class="table-cell">${formData.wavexOutput1 || ''}</td>
  <td class="table-cell">${formData.wavexOutput1Sentence || ''}</td>
  <td class="table-cell">${formData.wavexOutput1UpdateInterval || ''}</td>
  <td class="table-cell">${formData.wavexOutput1Settings || ''}</td>
</tr>
<tr>
<td class="table-cell">${formData.wavexOutput2 || ''}</td>
<td class="table-cell">${formData.wavexOutput2Sentence || ''}</td>
<td class="table-cell">${formData.wavexOutput2UpdateInterval || ''}</td>
<td class="table-cell">${formData.wavexOutput2Settings || ''}</td>
</tr>
<tr>
<td class="table-cell">${formData.wavexOutput3 || ''}</td>
<td class="table-cell">${formData.wavexOutput3Sentence || ''}</td>
<td class="table-cell">${formData.wavexOutput3UpdateInterval || ''}</td>
<td class="table-cell">${formData.wavexOutput3Settings || ''}</td>
</tr>
</table>

<br>
<div class="line_sub"></div>
  <h3>7. Final Start-up</h3>
  <table>
  <tr>
    <td style="padding-right: 20px;"><strong>Final 20 Minute:</strong> ${formData.final20Minute}</td>
    <td style="padding-right: 20px;"><strong>Final Data Output:</strong> ${formData.finalDataOutput}</td>
  </tr>
  </table>
  <div class="line_sub"></div>
  <h3>9. Login Details</h3>

  <table>

  <thead>
  <tr>
    <th class="table-cell table-header">Type</th>
    <th class="table-cell table-header">Username</th>
    <th class="table-cell table-header">Password</th>
    <th class="table-cell table-header">Comments</th>
  </tr>
</thead>


<tr>
  <td class="table-cell">${formData.loginType1 || ''}</td>
  <td class="table-cell">${formData.loginUsername1 || ''}</td>
  <td class="table-cell">${formData.loginPassword1 || ''}</td>
  <td class="table-cell">${formData.loginComments1 || ''}</td>
</tr>
<tr>
  <td class="table-cell">${formData.loginType2 || ''}</td>
  <td class="table-cell">${formData.loginUsername2 || ''}</td>
  <td class="table-cell">${formData.loginPassword2 || ''}</td>
  <td class="table-cell">${formData.loginComments2 || ''}</td>
</tr>
<tr>
  <td class="table-cell">${formData.loginType3 || ''}</td>
  <td class="table-cell">${formData.loginUsername3 || ''}</td>
  <td class="table-cell">${formData.loginPassword3 || ''}</td>
  <td class="table-cell">${formData.loginComments3 || ''}</td>
</tr>
</table>




<div style="text-align: center;">
<br>
<!-- Display uploaded images in a grid layout -->
<div class="image-container">
  ${imageUrls.map(url => `<div><img src="${url}" style="max-width: 100%;"></div>`).join('')}
</div>

 
  </div>
  
  <footer class="footer">
  <!-- Footer content -->
  <p>&copy; 2024 Miros Group. All rights reserved.</p>
  <p><a href="https://www.mirosmocean.com/" style="color: white;">Miros Cloud Terms & Conditions</a></p>
  <a href="https://www.mirosmocean.com/">
  <img src="https://mocean.miros.app/miros-mocean-logo.6761c3f7e4f32ff93e9fa5cb0303d3dd.svg" style="width: 100px;">
</a>

</footer>
  
  </body>
  </html>
  `;

  const newWindow = window.open('', '_blank');
  newWindow.document.write(html);
  newWindow.document.close();
}

function openCloudCertificateOLD() {
  const formData = JSON.parse(localStorage.getItem('formData'));
  const workStatusValue = document.querySelector('select[name="workStatus"]').value;

  if (workStatusValue === 'Complete') {
    alert('Please ensure the site is set to "Commissioned" in the Miros Cloud administration area.');
  }


  if (workStatusValue !== 'Complete' && workStatusValue !== 'In Progress' && workStatusValue !== 'Needs Attention') {
    alert('Check the work status. It is not possible to generate a report or certificate at this stage.');
    return;
  }

  // Function to format date in "dd mm yyyy" format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day < 10 ? '0' + day : day} ${month < 10 ? '0' + month : month} ${year}`;
  };

  const selectedElements = {
    system: formData.system,
    site: formData.site,
    customer: formData.customer,
    date: formatDate(formData.date),
    workStatus: formData.workStatus,
    subscriptionExpiry: formatDate(formData.subscriptionExpiry),
  };

  // Retrieve uploaded images
  const uploadedImages = document.querySelectorAll('.uploaded-images img');
  const imageUrls = Array.from(uploadedImages).map(img => img.src);

  // Placeholder: You'll need to collect these descriptions from your application
  const imageDescriptions = Array.from(document.querySelectorAll('.image-wrapper input')).map(input => input.value);


  const html = `
  <!DOCTYPE html>
  <html>
  <head>
      <title>Miros Cloud Certificate</title>
      <link rel="stylesheet" type="text/css" href="style_cs.css">
      <style>
      .image-container {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 20px; /* Adjust spacing between images */
      }
    
      .image-container img {
        max-width: 100px; /* Ensure images fit within their containers */
        height: auto;
      }
    </style>
  </head>
  <body>
  
  <div class="header">
  <img src="https://miros.app/miros-logo-two-tone-light.631848d3e1f5088e7f228ac7b63d6dbc.svg" style="width: 200px;">
    <p><span style="font-weight:bold;">System:</span> <span style="font-weight:normal;">${selectedElements.system}</span></p>
    <p><span style="font-weight:bold;">Site:</span> <span style="font-weight:normal;">${selectedElements.site}</span></p>
    <p><span style="font-weight:bold;">Customer:</span> <span style="font-weight:normal;">${selectedElements.customer}</span></p>
    <p><span style="font-weight:bold;">Date:</span> <span style="font-weight:normal;">${selectedElements.date}</span></p>
    <p><span style="font-weight:bold;">Work Status:</span> <span style="font-weight:normal;">${selectedElements.workStatus}</span></p>
    <div class="info"><span class="label">Subscription Expiry:</span> <span class="value">${selectedElements.subscriptionStatus},${selectedElements.subscriptionExpiry}</span></div>
</div>

  <div class="container">
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <h1>Welcome to Miros Cloud</h1>
    <h2>Congratulations, your Miros system is now up and running and is delivering stable sea-state data to the cloud.</h2>
    <p>You can access this data using the following link: <a href="https://miros.app" style="color: black;">Miros Cloud</a></p>
    <p>For any questions relating to the function or operation of the system, please contact <a href="mailto:support@miros-group.com?subject=${selectedElements.system} ${selectedElements.customer}&body=${selectedElements.system}%0D%0A${selectedElements.customer}%0D%0APlease summarise your query below:" style="color: black;">Miros Support</a></p>
    <img src="https://static.seekingalpha.com/uploads/2009/6/12/saupload_stamp_of_approval.jpg" style="max-width: 200px; margin-bottom: 10px;">
  </div>

  <div style="text-align: center;">
    <br>
    <!-- Display uploaded images in a grid layout -->
    <div class="image-container">
    ${imagesHtml} <!-- Insert dynamic images and descriptions HTML -->
  </div>  <footer class="footer">
    <!-- Footer content -->
    <p>&copy; 2024 Miros Group. All rights reserved.</p>
    <p><a href="https://www.miros-group.com" style="color: white;">Miros Cloud Terms & Conditions</a></p>
    <a href="https://www.miros-group.com">
    <img src="https://miros.app/miros-logo-two-tone-light.631848d3e1f5088e7f228ac7b63d6dbc.svg" style="width: 100px;">
    </a>
  </footer>
  
  </body>
  </html>
  `;

  const newWindow = window.open('', '_blank');
  newWindow.document.write(html);
  newWindow.document.close();
}

function openCloudCertificate() {
  const formData = JSON.parse(localStorage.getItem('formData'));
  const workStatusValue = document.querySelector('select[name="workStatus"]').value;

  if (workStatusValue === 'Complete') {
    alert('Please ensure the site is set to "Commissioned" in the Miros Cloud administration area.');
  }


  if (workStatusValue !== 'Complete' && workStatusValue !== 'In Progress' && workStatusValue !== 'Needs Attention') {
    alert('Check the work status. It is not possible to generate a report or certificate at this stage.');
    return;
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate() < 10 ? '0' : ''}${date.getDate()} ${date.getMonth() + 1 < 10 ? '0' : ''}${date.getMonth() + 1} ${date.getFullYear()}`;
  };

  const selectedElements = {
    system: formData.system,
    site: formData.site,
    customer: formData.customer,
    date: formatDate(formData.date),
    workStatus: formData.workStatus,
    subscriptionExpiry: formatDate(formData.subscriptionExpiry),
  };

  // Retrieve uploaded images and their descriptions
  const uploadedImages = document.querySelectorAll('.uploaded-images img');
  const imageUrls = Array.from(uploadedImages).map(img => img.src);
  const imageDescriptions = Array.from(document.querySelectorAll('.image-wrapper input')).map(input => input.value);

  // Dynamically create HTML for each image and description
  let imagesHtml = imageUrls.map((url, index) => {
    const description = imageDescriptions[index] || 'No description provided';
    return `
    <div class="image-description-pair">
    <img src="${url}" alt="Uploaded Image">
    <p>${description}</p>
  </div>
      `;
  }).join('');

  const html = `
  <!DOCTYPE html>
  <html>
  <head>
      <title>Miros Cloud Certificate</title>
      <link rel="stylesheet" type="text/css" href="style_report.css">
  </head>
  <body>
  
  <div class="header">
  <img src="https://miros.app/miros-logo-two-tone-light.631848d3e1f5088e7f228ac7b63d6dbc.svg" style="width: 200px;">
    <p><span style="font-weight:bold;">System:</span> <span style="font-weight:normal;">${selectedElements.system}</span></p>
    <p><span style="font-weight:bold;">Site:</span> <span style="font-weight:normal;">${selectedElements.site}</span></p>
    <p><span style="font-weight:bold;">Customer:</span> <span style="font-weight:normal;">${selectedElements.customer}</span></p>
    <p><span style="font-weight:bold;">Date:</span> <span style="font-weight:normal;">${selectedElements.date}</span></p>
    <p><span style="font-weight:bold;">Work Status:</span> <span style="font-weight:normal;">${selectedElements.workStatus}</span></p>
    <div class="info"><span class="label">Subscription Expiry:</span> <span class="value">${selectedElements.subscriptionStatus},${selectedElements.subscriptionExpiry}</span></div>
</div>

  <div class="container">
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <h1>Welcome to Miros Cloud</h1>
    <h2>Congratulations, your Miros system is now up and running and is delivering stable sea-state data to the cloud.</h2>
    <p>You can access this data using the following link: <a href="https://miros.app" style="color: black;">Miros Cloud</a></p>
    <p>For any questions relating to the function or operation of the system, please contact <a href="mailto:support@miros-group.com?subject=${selectedElements.system} ${selectedElements.customer}&body=${selectedElements.system}%0D%0A${selectedElements.customer}%0D%0APlease summarise your query below:" style="color: black;">Miros Support</a></p>
    <img src="https://static.seekingalpha.com/uploads/2009/6/12/saupload_stamp_of_approval.jpg" style="max-width: 200px; margin-bottom: 10px;">
  </div>

  <div style="text-align: center;">
    <br>
    <!-- Display uploaded images in a grid layout -->
    <div class="image-container">
    ${imagesHtml} <!-- Insert dynamic images and descriptions HTML -->
  </div>  <footer class="footer">
    <!-- Footer content -->
    <p>&copy; 2024 Miros Group. All rights reserved.</p>
    <p><a href="https://www.miros-group.com" style="color: white;">Miros Cloud Terms & Conditions</a></p>
    <a href="https://www.miros-group.com">
    <img src="https://miros.app/miros-logo-two-tone-light.631848d3e1f5088e7f228ac7b63d6dbc.svg" style="width: 100px;">
    </a>
  </footer>
  
  </body>
  </html>
  `;

  const newWindow = window.open('', '_blank');
  newWindow.document.write(html);
  newWindow.document.close();
}


function showExplanation(event) {
  // Prevent the default button action
  event.preventDefault();

  var paragraph = document.getElementById("expandableText");
  if (paragraph.style.display === "none") {
    paragraph.style.display = "block";
    document.getElementById("showExplanation").textContent = "Hide";
  } else {
    paragraph.style.display = "none";
    document.getElementById("showExplanation").textContent = "Info";
  }
}

function showHelpAlertWavex() {
  // Define your headings, paragraphs, and hyperlinks here
  const heading1 = "How to use this tool";
  const text1 = "Follow the relevant system commissioning procedure and fill in all required fields.";
  const heading2 = "Generating reports";
  const text2 = "Once completed, generate a report and print as a .pdf file. Remember to include backgrounds and images.";
  const heading3 = "Saving data";
  const text3 = "Data is automatically saved in browser cache but ensure you download the data as a .json file for future usage.";

  // New Headings and Paragraphs with Hyperlinks
  const heading4 = "Wavex Commissioning Procedure";
  const text4 = "<a href='https://mirosas.sharepoint.com/sites/doc/PR-002/PublishedDocuments/PR-002%20-%20Wavex%20v6.1%20commissioning%20(Procedure).pdf' target='_blank'>Link</a>";
  const heading5 = "Product Page";
  const text5 = "<a href='https://mirosas.sharepoint.com/sites/doc/PR-002/PublishedDocuments/Forms/AllDocuments.aspx' target='_blank'>Link</a>";

  // Check if the popup already exists to avoid duplicates
  const existingPopup = document.getElementById("customAlertPopup");
  if (existingPopup) {
    existingPopup.remove();
  }

  // Create overlay
  const overlay = createOverlay();

  // Create the popup box
  const popupBox = createPopupBox();

  // Append headings and paragraphs
  popupBox.appendChild(createContent(heading1, text1));
  popupBox.appendChild(createContent(heading2, text2));
  popupBox.appendChild(createContent(heading3, text3));

  // Append the new headings and paragraphs with hyperlinks
  popupBox.appendChild(createContent(heading4, text4));
  popupBox.appendChild(createContent(heading5, text5));

  // Create and add the close button
  const closeButton = createCloseButton(overlay);
  popupBox.appendChild(closeButton);

  // Append popup box to overlay
  overlay.appendChild(popupBox);

  // Append the overlay to the body
  document.body.appendChild(overlay);
}

function showHelpAlertOsd() {
  // Define your headings, paragraphs, and hyperlinks here
  const heading1 = "How to use this tool";
  const text1 = "Follow the relevant system commissioning procedure and fill in all required fields.";
  const heading2 = "Generating reports";
  const text2 = "Once completed, generate a report and print as a .pdf file. Remember to include backgrounds and images.";
  const heading3 = "Saving data";
  const text3 = "Data is automatically saved in browser cache but ensure you download the data as a .json file for future usage.";

  // New Headings and Paragraphs with Hyperlinks
  const heading4 = "OSD Commissioning Procedure";
  const text4 = "<a href='https://mirosas.sharepoint.com/sites/doc/PR-003/PublishedDocuments/PR-003%20-%20Miros%20OSD%20v5.10%20Commissioning%20(Procedure).pdf' target='_blank'>Link</a>";
  const heading5 = "Product Page";
  const text5 = "<a href='https://mirosas.sharepoint.com/sites/doc/PR-003/PublishedDocuments/Forms/AllDocuments.aspx' target='_blank'>Link</a>";

  // Check if the popup already exists to avoid duplicates
  const existingPopup = document.getElementById("customAlertPopup");
  if (existingPopup) {
    existingPopup.remove();
  }

  // Create overlay
  const overlay = createOverlay();

  // Create the popup box
  const popupBox = createPopupBox();

  // Append headings and paragraphs
  popupBox.appendChild(createContent(heading1, text1));
  popupBox.appendChild(createContent(heading2, text2));
  popupBox.appendChild(createContent(heading3, text3));

  // Append the new headings and paragraphs with hyperlinks
  popupBox.appendChild(createContent(heading4, text4));
  popupBox.appendChild(createContent(heading5, text5));

  // Create and add the close button
  const closeButton = createCloseButton(overlay);
  popupBox.appendChild(closeButton);

  // Append popup box to overlay
  overlay.appendChild(popupBox);

  // Append the overlay to the body
  document.body.appendChild(overlay);
}

// Helper function to create the overlay
function createOverlay() {
  const overlay = document.createElement("div");
  overlay.id = "customAlertPopup";
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  overlay.style.display = "flex";
  overlay.style.justifyContent = "center";
  overlay.style.alignItems = "center";
  overlay.style.zIndex = "1000";
  return overlay;
}

// Helper function to create the popup box
function createPopupBox() {
  const popupBox = document.createElement("div");
  popupBox.style.backgroundColor = "white";
  popupBox.style.padding = "20px";
  popupBox.style.borderRadius = "8px";
  popupBox.style.width = "320px";
  popupBox.style.textAlign = "left";
  popupBox.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
  return popupBox;
}

// Helper function to create content (heading + paragraph)
function createContent(headingText, paragraphText) {
  const content = document.createElement("div");

  // Create heading
  const heading = document.createElement("div");
  heading.innerText = headingText;
  heading.style.fontSize = "1.2em";
  heading.style.fontWeight = "bold";
  heading.style.marginBottom = "5px";
  heading.style.color = "black";  // Set heading text color to black

  // Create paragraph with possible hyperlinks
  const paragraph = document.createElement("div");
  paragraph.innerHTML = paragraphText;  // Use innerHTML to allow for hyperlinks in the text
  paragraph.style.fontSize = "1em";
  paragraph.style.color = "black";  // Set paragraph text color to black
  paragraph.style.marginBottom = "15px";

  content.appendChild(heading);
  content.appendChild(paragraph);

  return content;
}

// Helper function to create the close button
function createCloseButton(overlay) {
  const closeButton = document.createElement("button");
  closeButton.innerText = "Close";
  closeButton.style.backgroundColor = "#232B35";
  closeButton.style.color = "white";
  closeButton.style.border = "none";
  closeButton.style.padding = "8px 12px";
  closeButton.style.marginTop = "15px";
  closeButton.style.cursor = "pointer";
  closeButton.style.borderRadius = "5px";
  closeButton.onclick = function () {
    document.body.removeChild(overlay);
  };
  return closeButton;
}



// Wait for the DOM to be loaded before attaching the event listener
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("showExplanation").addEventListener("click", showExplanation);
});

document.addEventListener('DOMContentLoaded', function () {
  document.addEventListener('click', function (event) {
    if (event.target.classList.contains('show_explanation')) {
      event.preventDefault(); // Prevent the default button click behavior

      // Toggle the visibility of the next sibling element of the button
      var content = event.target.nextElementSibling;
      while (content && !content.classList.contains('expandableText')) {
        content = content.nextElementSibling;
      }

      if (content) {
        if (content.style.display === 'none' || content.style.display === '') {
          content.style.display = 'block'; // Show the content
          event.target.textContent = 'Hide'; // Optional: Change button text
        } else {
          content.style.display = 'none'; // Hide the content
          event.target.textContent = 'Info'; // Reset button text, if desired
        }
      }
    }
  });
});

document.addEventListener('DOMContentLoaded', function () {
  // Select all buttons with the 'show_hide' class
  var toggleButtons = document.querySelectorAll('.show_hide');

  // Attach a click event listener to each button
  toggleButtons.forEach(function (button) {
    button.addEventListener("click", function (event) {
      event.preventDefault(); // Prevent the default action

      // Selecting all rows marked as 'hidden' in the table
      var hiddenRows = document.querySelectorAll('#equipmentTable tr.hidden');

      // Toggle the display state of each hidden row
      hiddenRows.forEach(function (row) {
        if (row.style.display === 'none' || row.style.display === '') {
          row.style.display = 'table-row'; // Make the row visible
        } else {
          row.style.display = 'none'; // Hide the row
        }
      });
    });
  });
});
