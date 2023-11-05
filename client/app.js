document.addEventListener('DOMContentLoaded', function () {
  const imageTable = document.getElementById('imageTable');
  const imageTableBody = document.getElementById('imageTableBody');
  const prevButton = document.getElementById('prevButton');
  const nextButton = document.getElementById('nextButton');
  const pagination = document.getElementById('pagination');
  let currentPage = 1;
  const itemsPerPage = 10;
  let data = [];

  function displayImagesAndInfo() {
    // Fetch the CSV file
    fetch('./csv/data.csv')
      .then((response) => response.text())
      .then((csv) => {
        data = csv.split('\n').map(line => line.split(','));
        data = data.slice(1);
        updateTable(currentPage);
        updatePagination();
      })
      .catch((error) => console.error(error));
  }

  function updateTable(page) {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const tableFragment = document.createDocumentFragment();

    for (let i = start; i < end && i < data.length; i++) {
      const row = document.createElement('tr');
      const [frontCamImage, numberFrontCam, numberBackCam, vehicleNumberUser, vehicleTypeUser, vehicleRfid, metroText, serial] = data[i];


      //Serial
      const serialCell = document.createElement('td');
      serialCell.textContent = i + 1;
      row.appendChild(serialCell);

      // Create an image element to display the image
      const imageCell = document.createElement('td');
      const image = document.createElement('img');
      image.src = `./images/${frontCamImage.split("/")[1]}`; // Assuming images are in the 'images' directory
      // image.src = `./images/${frontCamImage}`; // Assuming images are in the 'images' directory
      image.style.maxWidth = '600px'; // Adjust the maximum image width
      imageCell.appendChild(image);
      image.addEventListener('dblclick', () => {
        image.style.transform = 'scale(3)';
        image.style.transition = 'transform 0.5s';
      });
      image.addEventListener('click', () => {
        image.style.transform = 'scale(1)';
        image.style.transition = 'transform 0.5s';
      });
      row.appendChild(imageCell);

      // ANPR Detected Vehicle Number 
      const numberFrontCamCell = document.createElement('td');
      const vehicleNumberTxt = document.createElement('span');
      vehicleNumberTxt.textContent = `${metroText} ${serial} ${numberFrontCam}`;
      numberFrontCamCell.appendChild(vehicleNumberTxt)
      row.appendChild(numberFrontCamCell)


      //Vehicle Metro Text 
      const inputMetro = document.createElement('td');
      const selectMetroText = document.createElement('select');
      const metroTxt = "metroText";
      selectMetroText.setAttribute('inputColumn', metroTxt);
      selectMetroText.setAttribute('data-index', i);
      selectMetroText.setAttribute('data-image-name', frontCamImage);

      // Define an array of option values
      const metroOptions = ['ঢাকা মেট্রো',
        'চট্ট মেট্রো',
        'খুলনা মেট্রো',
        'রাজশাহী মেট্রো',
        'সিলেট মেট্রো',
        'বরিশাল মেট্রো',
        'রংপুর মেট্রো',
        'ঢাকা',
        'নরসিংদী',
        'গাজীপুর',
        'নারায়ণগঞ্জ',
        'টাঙ্গাইল',
        'কিশোরগঞ্জ',
        'মানিকগঞ্জ',
        'মুন্সিগঞ্জ',
        'রাজবাড়ি',
        'মাদারীপুর',
        'শরীয়তপুর',
        'গোপালগঞ্জ',
        'ফরিদপুর',
        'শেরপুর',
        'ময়মনসিংহ',
        'জামালপুর',
        'নেত্রকোনা',
        'চট্টগ্রাম',
        'কুমিল্লা',
        'ফেনী',
        'ব্রাহ্মণবাড়িয়া',
        'রাঙ্গামাটি',
        'নোয়াখালী',
        'চাঁদপুর',
        'লক্ষ্মীপুর',
        'কক্সবাজার',
        'খাগড়াছড়ি',
        'বান্দরবান',
        'রাজশাহী',
        'চাঁপাইনবাবগঞ্জ',
        'সিরাজগঞ্জ',
        'পাবনা',
        'বগুড়া',
        'নাটোর',
        'জয়পুরহাট',
        'নওগাঁ',
        'খুলনা',
        'যশোর',
        'নড়াইল',
        'সাতক্ষীরা',
        'চুয়াডাঙ্গা',
        'মেহেরপুর',
        'কুষ্টিয়া',
        'মাগুরা',
        'বাগেরহাট',
        'ঝিনাইদহ',
        'সিলেট',
        'মৌলভীবাজার',
        'হবিগঞ্জ',
        'সুনামগঞ্জ',
        'বরিশাল',
        'পটুয়াখালী',
        'বরগুনা',
        'পিরোজপুর',
        'ঝালকাঠি',
        'ভোলা',
        'রংপুর',
        'ঠাকুরগাঁও',
        'পঞ্চগড়',
        'দিনাজপুর',
        'নিলফামারী',
        'গাইবান্ধা',
        'কুড়িগ্রাম',
        'লালমনিরহাট']

      // Create and append the options to the select element
      metroOptions.forEach((optionText) => {
        const option = document.createElement('option');
        option.value = optionText;
        option.text = optionText;
        selectMetroText.appendChild(option);
      });

      // Set the default selected value (you can change this as needed)
      selectMetroText.value = metroText;

      inputMetro.appendChild(selectMetroText);
      row.appendChild(inputMetro);


      //Vehicle Serial
      const inputSerial = document.createElement('td');
      const selectSerialText = document.createElement('select');
      const serialText = "serial";
      selectSerialText.setAttribute('inputColumn', serialText);
      selectSerialText.setAttribute('data-index', i);
      selectSerialText.setAttribute('data-image-name', frontCamImage);

      // Define an array of option values
      const serialOptions = ['অ', 'ই', 'উ', 'এ', 'ক', 'খ', 'গ', 'ঘ', 'ঙ', 'চ', 'ছ', 'জ', 'ঝ', 'ঞ', 'ট', 'ঠ', 'ড', 'ঢ', 'ণ', 'ত', 'থ', 'দ', 'ধ', 'ন', 'প', 'ফ', 'ব', 'ভ', 'ম', 'য', 'র', 'ল', 'শ', 'ষ', 'স', 'হ', 'ড়', 'ঢ়', 'য়',];

      // Create and append the options to the select element
      serialOptions.forEach((optionText) => {
        const option = document.createElement('option');
        option.value = optionText;
        option.text = optionText;
        selectSerialText.appendChild(option);
      });

      // Set the default selected value (you can change this as needed)
      selectSerialText.value = serial;

      inputSerial.appendChild(selectSerialText);
      row.appendChild(inputSerial);



      // Vehicle Number 
      const inputCell = document.createElement('td');
      const input = document.createElement('input');
      input.type = 'text';
      input.value = numberFrontCam;
      input.style.height = '40px';
      const vehicleNum = "vehicleNumber"
      input.setAttribute('inputColumn', vehicleNum);
      input.setAttribute('data-index', i);
      input.setAttribute('data-image-name', frontCamImage);
      inputCell.appendChild(input);
      row.appendChild(inputCell);



      tableFragment.appendChild(row);
    }

    imageTableBody.innerHTML = '';
    imageTableBody.appendChild(tableFragment);
  }

  function updateCsv(imageName, inputColumn, updatedValue) {
    // Create an object with the updated data
    const updatedData = {
      [imageName]: updatedValue,
    };

    // Send a POST request to the server to update the CSV
    fetch(`/updateCsv`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        imageName,
        inputColumn,
        updatedValue,
      }),
    })
      .then((response) => {
        if (response.status === 200) {
          console.log('CSV updated successfully on the server.');
        } else {
          console.error('Failed to update CSV on the server.');
        }
      })
      .catch((error) => console.error('Error updating CSV on the server:', error));

  }

  // ...

  // ...

  function updatePagination() {
    pagination.innerHTML = '';

    const totalPages = Math.ceil(data.length / itemsPerPage);

    const maxButtons = 10; // Maximum number of buttons to display

    // Calculate the range of buttons to show
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    const endPage = Math.min(totalPages, startPage + maxButtons - 1);

    // Adjust the startPage if we are near the end
    if (endPage === totalPages) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }

    if (currentPage > 1) {
      const prevButton = document.createElement('button');
      prevButton.textContent = 'Previous';
      prevButton.addEventListener('click', () => {
        currentPage--;
        updateTable(currentPage);
        updatePagination();
      });
      pagination.appendChild(prevButton);
    }

    for (let i = startPage; i <= endPage; i++) {
      const button = document.createElement('button');
      button.textContent = i;
      if (i === currentPage) {
        button.classList.add('selected-page'); // Apply the selected class
      }
      button.addEventListener('click', () => {
        currentPage = i;
        updateTable(currentPage);
        updatePagination();
      });
      pagination.appendChild(button);
    }

    if (currentPage < totalPages) {
      const nextButton = document.createElement('button');
      nextButton.textContent = 'Next';
      nextButton.addEventListener('click', () => {
        currentPage++;
        updateTable(currentPage);
        updatePagination();
      });
      pagination.appendChild(nextButton);
    }
  }

  // ...



  imageTable.addEventListener('input', (e) => {
    if (e.target.tagName === 'INPUT') {
      const frontCamImage = e.target.getAttribute('data-image-name');
      const inputColumn = e.target.getAttribute('inputColumn');
      const newValue = e.target.value;
      updateCsv(frontCamImage, inputColumn, newValue);

    }
  });
  imageTable.addEventListener('change', (d) => {
    if (d.target.tagName === "SELECT") {
      const frontCamImage = d.target.getAttribute('data-image-name');
      const inputColumn = d.target.getAttribute('inputColumn');
      const newValue = d.target.value;
      console.log(`col:${inputColumn} value:${newValue}`);
      updateCsv(frontCamImage, inputColumn, newValue);

    }
  });

  prevButton.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      updateTable(currentPage);
      updatePagination();
    }
  });

  nextButton.addEventListener('click', () => {
    if (currentPage < Math.ceil(data.length / itemsPerPage)) {
      currentPage++;
      updateTable(currentPage);
      updatePagination();
    }
  });

  displayImagesAndInfo();
});
