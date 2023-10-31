const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// app.get('/list-files', (req, res) => {
//     // Get the path to your project directory
//     const projectDirectoryPath = path.join(__dirname, '..'); // Go up one level to reach the project directory

//     // Read the contents of the project directory
//     fs.readdir(projectDirectoryPath, (err, files) => {
//         if (err) {
//             console.error(err);
//             res.status(500).send('Internal Server Error');
//         } else {
//             // Send the list of files and folders as a response
//             res.json(files);
//         }
//     });
// });

// Serve the HTML page
app.get('/index', (req, res) => {
    res.sendFile(path.resolve(__dirname + '/../client/index.html'));
});

// Serve images from the appropriate data folder
app.use('/:dataFolder/:imageName', (req, res) => {
    const { dataFolder, imageName } = req.params;
    const imagePath = `../${dataFolder}/${imageName}`;

    // Check if the image file exists
    if (fs.existsSync(imagePath)) {
        // Serve the image
        res.sendFile(path.resolve(__dirname + '/' + imagePath));
    } else {
        // If the image doesn't exist, you can send a 404 response
        res.status(404).send('Image not found');
    }
});

// Define a route to handle updates
app.post('/update-csv', (req, res) => {
    const { dataFolder, imageName, updatedValue } = req.body;
    const csvFilePath = `../${dataFolder}.csv`;
    const updatedData = [];

    // Read the CSV file
    const rows = [];
    fs.createReadStream(csvFilePath)
        .pipe(csv())
        .on('data', (row) => {
            rows.push(row);
        })
        .on('end', () => {
            // Update the data in memory
            for (const row of rows) {
                if (row.frontCamImage === imageName) {
                    row.vehicleNumberUser = updatedValue;
                }
                updatedData.push(row);
            }

            // Write the header to the CSV file
            fs.writeFileSync(csvFilePath, 'frontCamImage,numberFrontCam,numberBackCam,vehicleNumberUser,vehicleTypeUser,vehicleRfid\n');

            // Append the updated data to the CSV file
            for (const row of updatedData) {
                const rowStr = `${row.frontCamImage},${row.numberFrontCam},${row.numberBackCam},${row.vehicleNumberUser},${row.vehicleTypeUser},${row.vehicleRfid}\n`;
                fs.appendFileSync(csvFilePath, rowStr);
            }

            res.status(200).send('CSV file updated successfully');
        });
});

// Serve your HTML page (modify this path as needed)
app.use(express.static(path.resolve(__dirname + '/../client')));

// Start the server
const port = 9000; // Change this to your desired port
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
