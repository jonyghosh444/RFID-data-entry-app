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
    const { imageName,slno, inputColumn, updatedValue } = req.body;
    const csvFilePath = '../csv/data.csv';
    const updatedData = [];
    console.log(slno);
    console.log(inputColumn);
    console.log(updatedValue);

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
                    if (row.slno === slno) {
                        row.metroText = updatedValue;
                        console.log("vehicle metrotext sucessfully");
                    }
                    updatedData.push(row);
                }
            }else if(inputColumn==="serial"){
                for (const row of rows) {
                    if (row.slno === slno) {
                        row.serial = updatedValue;
                        console.log("vehicle serialtext sucessfully");
                    }
                    updatedData.push(row);
                }
            }else if(inputColumn==="vehicleNumber"){
                for (const row of rows) {
                    if (row.slno === slno) {
                        row.numberFrontCam = updatedValue;
                        console.log("vehicle number updated sucessfully");
                    }
                    updatedData.push(row);
                }
            }

            // Write the header to the CSV file
            const header = 'slno,frontCamImage,numberFrontCam,numberBackCam,vehicleNumberUser,vehicleTypeUser,vehicleRfid,metroText,serial\n';
            fs.writeFileSync(csvFilePath, header);
            // console.log(updatedData);

            // Append the updated data to the CSV file
            for (const row of updatedData) {
                const rowStr = `${row.slno},${row.frontCamImage},${row.numberFrontCam},${row.numberBackCam},${row.vehicleNumberUser},${row.vehicleTypeUser},${row.vehicleRfid},${row.metroText},${row.serial}\n`;
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
