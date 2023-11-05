const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');

const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.json());

const csvFilePath = 'data.csv';
let csvData = [];

app.get('/data', (req, res) => {
    res.json(csvData);
});

app.post('/update', (req, res) => {
    const updatedRow = req.body;
    const updatedData = csvData.map(row => {
        if (row.frontCamImage === updatedRow.frontCamImage) {
            return updatedRow;
        }
        return row;
    });

    fs.writeFileSync(csvFilePath, 'frontCamImage,numberFrontCam,numberBackCam,vehicleNumberUser,vehicleTypeUser,vehicleRfid\n', 'utf-8');
    for (const row of updatedData) {
        const csvRow = Object.values(row).join(',') + '\n';
        fs.appendFileSync(csvFilePath, csvRow, 'utf-8');
    }

    csvData = updatedData;
    res.sendStatus(200);
});

fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', row => csvData.push(row))
    .on('end', () => {
        app.listen(port, () => {
            console.log(`Server is running on http://0.0.0.0:${port}`);
        });
    });
