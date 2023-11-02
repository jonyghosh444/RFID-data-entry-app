const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const csv = require('csv-parser');
const app = express();
const path = require('path');

app.use(bodyParser.text());

// Serve the HTML page
app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname + '/../client/index.html'));
});

app.use(bodyParser.text({ type: 'text/plain' })); // Specify 'text/plain' type

// Define a route to handle CSV updates
// app.post('/updateCsv', (req, res) => {
//     const updatedCsv = req.body;
//     const csvFilePath = 'data.csv';

//     fs.readFile(csvFilePath, 'utf8', (err, data) => {
//         if (err) {
//             console.error('Error reading CSV:', err);
//             res.status(500).send('Error reading CSV');
//         } else {
//             // Update the existing CSV data with the new content
//             const updatedData = data + '\n' + updatedCsv;

//             // Write the updated data back to the same file
//             fs.writeFile(csvFilePath, updatedData, (writeErr) => {
//                 if (writeErr) {
//                     console.error('Error updating CSV:', writeErr);
//                     res.status(500).send('Error updating CSV');
//                 } else {
//                     res.status(200).send('CSV file updated successfully');
//                 }
//             });
//         }
//     });
// });
app.post('/updateCsv', (req, res) => {
    const { imageName, updatedValue } = req.body;
    const csvFilePath = '../csv/data.csv';
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
                    row.numberFrontCam = updatedValue;
                }
                updatedData.push(row);
            }

            // Write the header to the CSV file
            const header = 'frontCamImage,numberFrontCam,numberBackCam,vehicleNumberUser,vehicleTypeUser,vehicleRfid\n';
            fs.writeFileSync(csvFilePath, header);

            // Append the updated data to the CSV file
            for (const row of updatedData) {
                const rowStr = `${row.frontCamImage},${row.numberFrontCam},${row.numberBackCam},${row.vehicleNumberUser},${row.vehicleTypeUser},${row.vehicleRfid}\n`;
                fs.appendFileSync(csvFilePath, rowStr);
            }

            res.status(200).send('CSV file updated successfully');
        });
    
});






// Serve your HTML page (modify this path as needed)
// Serve static files from the 'client' directory
app.use('/client', express.static(path.resolve(__dirname, '../client')));

// Serve csv file
app.use('/csv', express.static(path.resolve(__dirname, '../csv')));

// Serve Images file 
app.use('/images', express.static(path.resolve(__dirname, '../images')));

// Start the server
const port = 6060; // Change this to your desired port
app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});
