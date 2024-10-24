function openFullReportWaveFusion() {
    const formData = JSON.parse(localStorage.getItem('formData'));
    var workStatusValue = document.querySelector('select[name="workStatus"]').value;

    if (workStatusValue !== 'Complete' && workStatusValue !== 'In Progress' && workStatusValue !== 'Needs Attention') {
        alert('Check the work status. It is not possible to generate a cloud certificate at this stage.');
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

        sensorFrontOpenView: formData.sensorFrontOpenView,
        sensorDownOpenView: formData.sensorDownOpenView,
        sensorDirectionPredominance: formData.sensorDirectionPredominance,
        sensorLocation: formData.sensorLocation,








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

        sensorMountingHeight: formData.sensorMountingHeight,
        sensorLookDirection: formData.sensorLookDirection,
        sensorDistanceFootprint: formData.sensorDistanceFootprint,
        sensorDepthFootprint: formData.sensorDepthFootprint,
        sensorTimeSync: formData.sensorTimeSync,
        sensorTimeServer: formData.sensorTimeServer,
        sensorHeadingInput: formData.sensorHeadingInput,
        sensorHeadingSource: formData.sensorHeadingSource,
        sensorMinRange: formData.sensorMinRange,
        sensorMaxRange: formData.sensorMaxRange,
        sensorWaterRef: formData.sensorWaterRef,
        sensorTracking: formData.sensorTracking,
        sensorWindowSize: formData.sensorWindowSize,
        sensorTimeConstant: formData.sensorTimeConstant,
        sensorScanToAverage: formData.sensorScanToAverage,
        sensorScanToAveragePhase: formData.sensorScanToAveragePhase,
        sensorHeadingServer: formData.sensorHeadingServer,
        sensorHeadingPort: formData.sensorHeadingPort,
        sensorMotionCompensation: formData.sensorMotionCompensation,
        sensorRangeSensor: formData.sensorRangeSensor,
        sensorFmNoiseFilter: formData.sensorFmNoiseFilter,
        sensorLowFreqNoiseFilter: formData.sensorLowFreqNoiseFilter,
        sensorEnergyLevelCheck: formData.sensorEnergyLevelCheck,
        sensorEnergyLevelTimeConstant: formData.sensorEnergyLevelTimeConstant,
        sensorEnergyLevelThreshold: formData.sensorEnergyLevelThreshold,
        sensorEnergyLevelOldValueTimeout: formData.sensorEnergyLevelOldValueTimeout,
        sensorSampleGain: formData.sensorSampleGain,

        sensorSanityCheckStatus: formData.sensorSanityCheckStatus,
        sensorSanityCheckReboot: formData.sensorSanityCheckReboot,
        sensorSanityCheckFirmware: formData.sensorSanityCheckFirmware,
        sensorSanityCheckMruPitch: formData.sensorSanityCheckMruPitch,
        sensorSanityCheckMruFw: formData.sensorSanityCheckMruFw,
        sensorSanityCheckHeading: formData.sensorSanityCheckHeading,
        sensorSanityCheckMotionPage: formData.sensorSanityCheckMotionPage,
        sensorSanityCheckRollPitch: formData.sensorSanityCheckRollPitch,


        sensorServiceRangeCheck: formData.sensorServiceRangeCheck,
        sensorServiceWaveProfile: formData.sensorServiceWaveProfile,
        sensorServiceCpuCheck: formData.sensorServiceCpuCheck,
        sensorServiceRawRangeQuality: formData.sensorServiceRawRangeQuality,
        sensorServiceRangeSpectrum: formData.sensorServiceRangeSpectrum,
        sensorServiceTempCheck: formData.sensorServiceTempCheck,





        cloudEnabled: formData.cloudEnabled,
        finalConfig: formData.finalConfig,
        finalPowerCycle: formData.finalPowerCycle,
        finalStartup: formData.finalStartup,
        final20Minute: formData.final20Minute,
        finalDataOutput: formData.finalDataOutput,
        backupJson: formData.backupJson,
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
    <div class="info"><span class="label">Subscription Expiry:</span> <span class="value">${selectedElements.subscriptionExpiry}</span></div>
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
