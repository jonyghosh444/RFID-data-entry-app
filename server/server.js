const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const csv = require('csv-parser');
const app = express();
const path = require('path');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve the HTML page
app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname + '/../client/index.html'));
});

app.use(bodyParser.text({ type: 'text/plain' })); // Specify 'text/plain' type

app.post('/updateCsv', (req, res) => {
    const { imageName, inputColumn, updatedValue } = req.body;
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
            if (inputColumn === "metroText"){
                for (const row of rows) {
                    if (row.frontCamImage === imageName) {
                        row.metroText = updatedValue;
                    }
                    updatedData.push(row);
                }
            }else if(inputColumn==="serial"){
                for (const row of rows) {
                    if (row.frontCamImage === imageName) {
                        row.serial = updatedValue;
                    }
                    updatedData.push(row);
                }
            }else if(inputColumn==="vehicleNumber"){
                for (const row of rows) {
                    if (row.frontCamImage === imageName) {
                        row.numberFrontCam = updatedValue;
                    }
                    updatedData.push(row);
                }
            }


            // Write the header to the CSV file
            const header = 'frontCamImage,numberFrontCam,numberBackCam,vehicleNumberUser,vehicleTypeUser,vehicleRfid,metroText,serial\n';
            fs.writeFileSync(csvFilePath, header);
            // console.log(updatedData);

            // Append the updated data to the CSV file
            for (const row of updatedData) {
                const rowStr = `${row.frontCamImage},${row.numberFrontCam},${row.numberBackCam},${row.vehicleNumberUser},${row.vehicleTypeUser},${row.vehicleRfid},${row.metroText},${row.serial}\n`;
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
const port = 9000; // Change this to your desired port
app.listen(port, () => {
    console.log(`Server is running on port http://0.0.0.0:${port}`);
});
