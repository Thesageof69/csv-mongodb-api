const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(express.json());

const Value = require('./models/values.model');
const { readCsv, writeCsv } = require('./csvService');

function matchesQuery(row, query) {
  return Object.keys(query).every(key => row[key] === query[key]);
}

// ROOT
app.get('/', (req, res) => {
  res.send('Hello from CSV + Mongo API');
});



// Get all CSV rows
app.get('/api/csv', async (req, res) => {
  try {
    const { rows } = await readCsv();
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Search CSV rows
app.get('/api/csv/search', async (req, res) => {
  try {
    const criteria = req.query;
    const { rows } = await readCsv();
    const filtered = rows.filter(row => matchesQuery(row, criteria));

    if (!filtered.length) {
      return res.status(404).json({ message: 'No rows matched criteria' });
    }

    res.status(200).json(filtered);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update CSV rows by query
app.put('/api/csv', async (req, res) => {
  try {
    const criteria = req.query;
    const updates = req.body;

    if (!Object.keys(criteria).length) {
      return res
        .status(400)
        .json({ message: 'At least one query parameter is required' });
    }

    const { headers, rows } = await readCsv();

    let updatedCount = 0;
    rows.forEach(row => {
      if (matchesQuery(row, criteria)) {
        headers.forEach(h => {
          if (updates[h] !== undefined) {
            row[h] = String(updates[h]);
          }
        });
        updatedCount++;
      }
    });

    if (!updatedCount) {
      return res.status(404).json({ message: 'No rows matched criteria' });
    }

    await writeCsv(headers, rows);
    res.status(200).json({ updatedCount, rows });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete CSV rows by query
app.delete('/api/csv', async (req, res) => {
  try {
    const criteria = req.query;

    if (!Object.keys(criteria).length) {
      return res
        .status(400)
        .json({ message: 'At least one query parameter is required' });
    }

    const { headers, rows } = await readCsv();
    const newRows = rows.filter(row => !matchesQuery(row, criteria));
    const deletedCount = rows.length - newRows.length;

    if (!deletedCount) {
      return res.status(404).json({ message: 'No rows matched criteria' });
    }

    await writeCsv(headers, newRows);
    res.status(200).json({ deletedCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a new column
app.post('/api/csv/column', async (req, res) => {
  try {
    const { columnName, defaultValue = '' } = req.body;

    if (!columnName) {
      return res.status(400).json({ message: 'columnName is required' });
    }

    const { headers, rows } = await readCsv();

    if (headers.includes(columnName)) {
      return res.status(400).json({ message: 'Column already exists' });
    }

    headers.push(columnName);
    rows.forEach(row => {
      row[columnName] = String(defaultValue);
    });

    await writeCsv(headers, rows);

    res.status(201).json({
      message: `Column ${columnName} added`,
      headers,
      rows,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a column
app.delete('/api/csv/column', async (req, res) => {
  try {
    const { columnName } = req.body;

    if (!columnName) {
      return res.status(400).json({ message: 'columnName is required' });
    }

    const { headers, rows } = await readCsv();

    if (!headers.includes(columnName)) {
      return res.status(404).json({ message: 'Column not found' });
    }

    const newHeaders = headers.filter(h => h !== columnName);
    rows.forEach(row => {
      delete row[columnName];
    });

    await writeCsv(newHeaders, rows);
    res.status(200).json({
      message: `Column ${columnName} deleted`,
      headers: newHeaders,
      rows,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



// Get all Mongo Values docs
app.get('/api/values', async (req, res) => {
  try {
    const docs = await Value.find({});
    res.status(200).json(docs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Import CSV rows into Mongo Values
app.post('/api/csv/import-to-mongo', async (req, res) => {
  try {
    const { rows } = await readCsv();

    const docs = rows.map(r => ({
      col1: r.col1,
      col2: r.col2,
      col3: r.col3
    }));

    if (!docs.length) {
      return res.status(400).json({ message: 'No rows in CSV to import' });
    }

    const result = await Value.insertMany(docs);
    res.status(201).json({ insertedCount: result.length, result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


mongoose
  .connect(
    'mongodb+srv://rayaljomy_db_user:DRWGRRqDasgkvqnU@backenddb.3hhr3v4.mongodb.net/CSV-VALUES?appName=backendDB'
  )
  .then(() => {
    console.log('Connected successfully');
    app.listen(4000, () => {
      console.log('Server is running on port 4000');
    });
  })
  .catch(() => {
    console.log('Connection failed.');
  });

