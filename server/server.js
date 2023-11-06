const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const csv = require('csv-parser');
const app = express();
const path = require('path');
const readline = require('readline');
const stream = require('stream');
const { pipeline } = require('stream/promises');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname + '/../client/index.html'));
});

app.use(bodyParser.text({ type: 'text/plain' }));

app.post('/updateCsv', async (req, res) => {
  const { imageName, slno, inputColumn, updatedValue } = req.body;
  const csvFilePath = '../csv/data.csv'; // Adjust the path to your CSV file

  const readStream = fs.createReadStream(csvFilePath);
  const writeStream = fs.createWriteStream(csvFilePath + '.tmp');

  const rl = readline.createInterface({ input: readStream });
  const transform = new stream.Transform({ objectMode: true });

  transform._transform = function (line, encoding, done) {
    const data = line.toString().split(',');

    if (parseInt(data[0]) === parseInt(slno)) {
      if (inputColumn === 'metroText') {
        data[7] = updatedValue;
        console.log("metrtext storing");
      } else if (inputColumn === 'serial') {
        data[8] = updatedValue;
        console.log("serial storing");
      } else if (inputColumn === 'vehicleNumber') {
        data[2] = updatedValue;
        console.log("vehicleNumber storing");
      }
    }

    this.push(data.join(',') + '\n');
    done();
  };

  try {
    await pipeline(rl, transform, writeStream);
    readStream.close(); // Close the original readStream
    writeStream.close(); // Close the writeStream

    await fs.promises.unlink(csvFilePath); // Use async unlink to remove the old file
    await fs.promises.rename(csvFilePath + '.tmp', csvFilePath);
    res.status(200).send('CSV file updated successfully');
  } catch (error) {
    res.status(500).send('An error occurred while updating the CSV file');
  }
});

// Serve your HTML page (modify this path as needed)
// Serve static files from the 'client' directory
app.use('/client', express.static(path.resolve(__dirname, '../client')));

// Serve csv file
app.use('/csv', express.static(path.resolve(__dirname, '../csv')));

// Serve Images file
app.use('/images', express.static(path.resolve(__dirname, '../images')));
const port = 9000; // Change this to your desired port
// Start the server
app.listen(port, () => {
  console.log(`Server is running on port http://0.0.0.0:${port}`);
});
