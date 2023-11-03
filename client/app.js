document.addEventListener('DOMContentLoaded', function () {
    const imageTable = document.getElementById('imageTable');
    const imageTableBody = document.getElementById('imageTableBody');
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');
    let currentPage = 1;
    const itemsPerPage = 5;
    let data = [];

    function displayImagesAndInfo() {
        // Fetch the CSV file
        fetch('./csv/data.csv')
            .then((response) => response.text())
            .then((csv) => {
                data = csv.split('\n').map(line => line.split(','));
                data = data.slice(1);
                updateTable(currentPage);
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
            image.src = `./images/${frontCamImage}`; // Assuming images are in the 'images' directory
            image.style.maxWidth = '600px'; // Adjust the maximum image width
            imageCell.appendChild(image);
            row.appendChild(imageCell);


            // Create an input element with a data attribute
            // const imageNameCell = document.createElement('td');
            // imageNameCell.textContent = frontCamImage;
            // row.appendChild(imageNameCell);


            // ANPR Detected Vehicle Number 
            const numberFrontCamCell = document.createElement('td');
            const vehicleNumberTxt = document.createElement('span');
            vehicleNumberTxt.textContent = `${metroText} ${serial} ${numberFrontCam}`;
            numberFrontCamCell.appendChild(vehicleNumberTxt)
            row.appendChild(numberFrontCamCell)


            // // Vehicle Metro Text
            // const inputCell = document.createElement('td');
            // const input = document.createElement('input');
            // input.type = 'text';
            // input.value = numberFrontCam;
            // input.setAttribute('data-index', i);
            // input.setAttribute('data-image-name', frontCamImage);
            // inputCell.appendChild(input);
            // row.appendChild(inputCell);


            //Vehicle Metro Text 
            const inputMetro = document.createElement('td');
            const inputMetroText = document.createElement('input');
            inputMetroText.type = 'text';
            inputMetroText.value = metroText;
            inputMetroText.style.height = '40px';
            const metroTxt = "metroText"
            inputMetroText.setAttribute('inputColumn', metroTxt);
            inputMetroText.setAttribute('data-index', i);
            inputMetroText.setAttribute('data-image-name', frontCamImage);
            inputMetro.appendChild(inputMetroText);
            row.appendChild(inputMetro);

            //Vehicle Serial
            const inputSerial = document.createElement('td');
            const inputSerialNum = document.createElement('input');
            inputSerialNum.type = 'text';
            inputSerialNum.value = serial;
            const serialTxt = "serial";
            inputSerialNum.style.height = '40px';
            inputSerialNum.setAttribute('inputColumn', serialTxt);
            inputSerialNum.setAttribute('data-index', i);
            inputSerialNum.setAttribute('data-image-name', frontCamImage);
            inputSerial.appendChild(inputSerialNum);
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



            // const numberBackCamCell = document.createElement('td');
            // numberBackCamCell.textContent = numberBackCam;
            // row.appendChild(numberBackCamCell);

            // const vehicleNumberUserCell = document.createElement('td');
            // vehicleNumberUserCell.textContent = vehicleNumberUser;
            // row.appendChild(vehicleNumberUserCell);

            // const vehicleTypeUserCell = document.createElement('td');
            // vehicleTypeUserCell.textContent = vehicleTypeUser;
            // row.appendChild(vehicleTypeUserCell);

            // const vehicleRfidCell = document.createElement('td');
            // vehicleRfidCell.textContent = vehicleRfid;
            // row.appendChild(vehicleRfidCell);




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
        // fetch('/update-csv', {
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

    imageTable.addEventListener('input', (e) => {
        if (e.target.tagName === 'INPUT') {
            const frontCamImage = e.target.getAttribute('data-image-name');
            const inputColumn = e.target.getAttribute('inputColumn');
            console.log(inputColumn);
            console.log(frontCamImage);
            const newValue = e.target.value;
            updateCsv(frontCamImage, inputColumn, newValue);
        }
    });

    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            updateTable(currentPage);
        }
    });

    nextButton.addEventListener('click', () => {
        if (currentPage < Math.ceil(data.length / itemsPerPage)) {
            currentPage++;
            updateTable(currentPage);
        }
    });

    displayImagesAndInfo();
});
