const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Define a route to handle updates
const csv = require('csv-parser');

app.post('/update-csv', (req, res) => {
    const { dataFolder, imageName, updatedValue } = req.body;
    const csvFilePath = `${dataFolder}.csv`;
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

// Start the server
const port = 8000; // Change this to your desired port
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
