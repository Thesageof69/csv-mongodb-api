const fs = require('fs').promises;
const path = require('path');

const CSV_PATH = path.join(__dirname, 'Data.csv');

async function readCsv() {
  const data = await fs.readFile(CSV_PATH, 'utf8');
  
  const cleanData = data.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const lines = cleanData.trim().split('\n');

  const headers = lines[0].split(',').map(h => h.trim());
  
  const rows = lines.slice(1).map(line => {
    const cols = line.split(',');
    const obj = {};
    headers.forEach((h, i) => {
      obj[h] = cols[i] ? cols[i].trim() : '';
    });
    return obj;
  });

  return { headers, rows };
}

async function writeCsv(headers, rows) {
  const headerLine = headers.join(',');
  const dataLines = rows.map(row =>
    headers.map(h => row[h] ?? '').join(',')
  );
  const csvString = [headerLine, ...dataLines].join('\n');
  await fs.writeFile(CSV_PATH, csvString, 'utf8');
}

module.exports = { readCsv, writeCsv };
