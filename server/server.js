const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const csv = require('csv-parser');
const app = express();
const path = require('path');
const readline = require('readline');
const stream = require('stream');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname + '/../client/index.html'));
});

app.use(bodyParser.text({ type: 'text/plain' }));

app.post('/updateCsv', async (req, res) => {
  const { slno, inputColumn, updatedValue } = req.body;
  // const csvFilePath = '../csv/data.csv';
  const csvFilePath = path.resolve(__dirname, '../csv/data.csv');

  const readStream = fs.createReadStream(csvFilePath, { encoding: 'utf8' });
  const tempCsvFilePath = csvFilePath + '.temp';

  const rl = readline.createInterface({ input: readStream });
  const transform = new stream.Transform({ objectMode: true });

  transform._transform = function (line, encoding, done) {
    const data = line.toString().split(',');

    if (parseInt(data[0]) === parseInt(slno)) {
      if (inputColumn === 'metroText') {
        data[7] = updatedValue;
        console.log(`Metro text inputed into line no ${0} successfully `);
      } else if (inputColumn === 'serial') {
        data[8] = updatedValue;
        console.log(`serial text inputed into line no ${0} successfully `);
      } else if (inputColumn === 'vehicleNumber') {
        data[2] = updatedValue;
        console.log(`vehicleNumber inputed into line no ${0} successfully `);
      }
    }

    this.push(data.join(',') + '\n');
    done();
  };

  const pipeline = require('util').promisify(require('stream').pipeline);

  try {
    await pipeline(rl, transform, fs.createWriteStream(tempCsvFilePath, { encoding: 'utf8' }));

    // Rename the temporary file to the original file name
    await fs.promises.rename(tempCsvFilePath, csvFilePath);

    res.status(200).send('CSV file updated successfully');
  } catch (error) {
    console.error('An error occurred while updating the CSV file:', error);
    res.status(500).send('An error occurred while updating the CSV file');
  }
});

app.use('/client', express.static(path.resolve(__dirname, '../client')));
app.use('/csv', express.static(path.resolve(__dirname, '../csv')));
app.use('/images', express.static(path.resolve(__dirname, '../images')));

const port = 9000;
app.listen(port, () => {
  console.log(`Server is running on port http://0.0.0.0:${port}`);
});