document.addEventListener('DOMContentLoaded', function () {
    const imageTable = document.getElementById('imageTable');
    const imageTableBody = document.getElementById('imageTableBody');
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');
    let currentPage = 1;
    const itemsPerPage = 10;
    let data = [];

    function displayImagesAndInfo() {
        // Fetch the CSV file
        fetch('./csv/data.csv')
            .then((response) => response.text())
            .then((csv) => {
                data = csv.split('\n').map(line => line.split(','));
                data = data.slice(1, -1);
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
            const [frontCamImage, numberFrontCam, numberBackCam, vehicleNumberUser, vehicleTypeUser, vehicleRfid] = data[i];

            // Create an image element to display the image
            const imageCell = document.createElement('td');
            const image = document.createElement('img');
            image.src = `./images/${frontCamImage}`; // Assuming images are in the 'images' directory
            image.style.maxWidth = '100px'; // Adjust the maximum image width
            imageCell.appendChild(image);
            row.appendChild(imageCell);

            row.innerHTML += `
                <td>${frontCamImage}</td>
                <td>${numberFrontCam}</td>
                <td><input type="text" value="${numberFrontCam}" data-index="${i}"></td>
                <td>${numberBackCam}</td>
                <td>${vehicleNumberUser}</td>
                <td>${vehicleTypeUser}</td>
                <td>${vehicleRfid}</td>
            `;
            tableFragment.appendChild(row);
        }

        imageTableBody.innerHTML = '';
        imageTableBody.appendChild(tableFragment);
    }

    // function updateCsv(index, newValue) {
    //     data[index][1] = newValue;
    //     const updatedCsv = data.map(row => row.join(',')).join('\n');

    //     fetch('/updateCsv', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'text/plain', // Use 'text/plain' for plain text data
    //         },
    //         body: updatedCsv,
    //     })
    //         .then((response) => {
    //             if (response.status === 200) {
    //                 console.log('CSV updated successfully on the server.');
    //             } else {
    //                 console.error('Failed to update CSV on the server.');
    //             }
    //         })
    //         .catch((error) => console.error('Error updating CSV on the server:', error));
    // }

    function updateCsv(imageName, newValue) {
        data[index][1] = newValue;
        const updatedCsv = data.map(row => row.join(',')).join('\n');

        fetch('/updateCsv', {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain', // Use 'text/plain' for plain text data
            },
            body: updatedCsv,
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
            const index = e.target.getAttribute('data-index');
            const newValue = e.target.value;
            updateCsv(index, newValue);
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
