document.addEventListener('DOMContentLoaded', function () {
    const dataButtons = {
        data1Button: 'data1',
        data2Button: 'data2',
        data3Button: 'data3',
        data4Button: 'data4',
    };

    for (const buttonId in dataButtons) {
        if (dataButtons.hasOwnProperty(buttonId)) {
            const button = document.getElementById(buttonId);
            button.addEventListener('click', function () {
                const dataFolder = dataButtons[buttonId];
                displayImagesAndInfo(dataFolder);
            });
        }
    }

    function displayImagesAndInfo(dataFolder) {
        // Hide the previous imageInfo and show the new page
        document.getElementById('imageInfo').style.display = 'none';
        const newPage = document.getElementById('newPage');
        newPage.style display = 'block';

        // Clear any previous data from the new page
        newPage.innerHTML = '';

        // Load the CSV file
        fetch(`${dataFolder}.csv`)
            .then((response) => response.text())
            .then((csv) => {
                const lines = csv.split('\n');
                const headers = lines[0].split(',');
                const data = lines.slice(1);

                // Create a table element
                const table = document.createElement('table');
                const thead = document.createElement('thead');
                const tbody = document.createElement('tbody');

                // Create the table header with specified columns
                const columnsToDisplay = ['Image', 'frontCamImage', 'numberFrontCam', 'numberBackCam', 'vehicleNumberUser', 'vehicleTypeUser', 'vehicleRfid'];
                const headerRow = document.createElement('tr');
                columnsToDisplay.forEach((column) => {
                    const th = document.createElement('th');
                    th.textContent = column;
                    headerRow.appendChild(th);
                });
                thead.appendChild(headerRow);
                table.appendChild(thead);

                // Create table rows with image and information
                data.forEach((line, index) => {
                    const values = line.split(',');
                    const imageName = values[headers.indexOf('frontCamImage')];

                    const row = document.createElement('tr');

                    // Add image cell with a resized image
                    const imageCell = document.createElement('td');
                    const image = document.createElement('img');
                    image.src = `${dataFolder}/${imageName}`;
                    image.style.maxWidth = '100px'; // Adjust the maximum image width
                    imageCell.appendChild(image);
                    row.appendChild(imageCell);

                    // Add other information cells
                    columnsToDisplay.slice(1).forEach((column) => {
                        const cell = document.createElement('td');
                        if (column === 'vehicleNumberUser') {
                            // Create an editable input field for vehicleNumberUser
                            const input = document.createElement('input');
                            input.type = 'text';
                            input.value = values[headers.indexOf(column)];
                            // Add an event listener to handle changes to the input field
                            input.addEventListener('change', function () {
                                // Save the changes to the server (to be implemented)
                                saveChangesToServer(dataFolder, imageName, input.value);
                            });
                            cell.appendChild(input);
                        } else {
                            cell.textContent = values[headers.indexOf(column)];
                        }
                        row.appendChild(cell);
                    });

                    tbody.appendChild(row);
                });

                table.appendChild(tbody);

                // Append the table to the new page
                newPage.appendChild(table);
            })
            .catch((error) => console.error(error));
    }

    // Function to save changes to the server (to be implemented)
    function saveChangesToServer(dataFolder, imageName, updatedValue) {
        // Create an object with the updated data
        const updatedData = {
            [imageName]: updatedValue,
        };
     
        // Send a POST request to the server to update the CSV
        fetch('/update-csv', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                dataFolder,
                imageName,
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
});
