const fs = require('fs').promises;
const path = require('path');

const CSV_PATH = path.join(__dirname, 'data.csv');

async function readCsv() {
  const data = await fs.readFile(CSV_PATH, 'utf8');
  const lines = data.trim().split('\n');

  const headers = lines[0].split(',');
  const rows = lines.slice(1).map(line => {
    const cols = line.split(',');
    const obj = {};
    headers.forEach((h, i) => {
      obj[h] = cols[i];
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
