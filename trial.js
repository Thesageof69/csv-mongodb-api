const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname)));

const Value = require('./models/values.model');
const { readCsv, writeCsv } = require('./csvService');

function matchesQuery(row, query) {
  return Object.keys(query).every(key => row[key] === query[key]);
}


app.get('/', (req, res) => {                        // HTML Frontend
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/api/csv', async (req, res) => {            // Get all rows
  try {
    const { rows } = await readCsv();
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/csv', async (req, res) => {        // Add new row          
  try {
    const newRow = req.body;

    if (!newRow || Object.keys(newRow).length === 0) {
      return res.status(400).json({ message: 'Row data is required' });
    }

    const { headers, rows } = await readCsv();
    rows.push(newRow);

    await writeCsv(headers, rows);
    await Value.deleteMany({});
    await Value.insertMany(rows);

    res.status(201).json({ 
      message: 'Row added successfully',
      totalRows: rows.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update rows
app.put('/api/csv', async (req, res) => {
  try {
    const criteria = req.query;
    const updates = req.body;

    if (!Object.keys(criteria).length) {
      return res.status(400).json({ message: 'Query parameter required' });
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
      return res.status(404).json({ message: 'No rows matched' });
    }

    await writeCsv(headers, rows);
    await Value.deleteMany({});
    await Value.insertMany(rows);

    res.status(200).json({ 
      message: 'CSV updated and synced to MongoDB',
      updatedCount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete rows
app.delete('/api/csv', async (req, res) => {
  try {
    const criteria = req.query;

    if (!Object.keys(criteria).length) {
      return res.status(400).json({ message: 'Query parameter required' });
    }

    const { headers, rows } = await readCsv();
    const newRows = rows.filter(row => !matchesQuery(row, criteria));
    const deletedCount = rows.length - newRows.length;

    if (!deletedCount) {
      return res.status(404).json({ message: 'No rows matched' });
    }

    await writeCsv(headers, newRows);
    const mongoQuery = {};
    Object.keys(criteria).forEach(key => {
      mongoQuery[key] = criteria[key];
    });
    await Value.deleteMany(mongoQuery);
    res.status(200).json({ 
      message: 'Rows deleted and synced to MongoDB',
      deletedCount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/csv/sync-to-mongo', async (req, res) => {
  try {
    await Value.deleteMany({});
    const { rows } = await readCsv();

    if (!rows.length) {
      return res.status(400).json({ message: 'No rows in CSV to sync' });
    }

    const result = await Value.insertMany(rows);
    res.status(201).json({ 
      message: 'MongoDB synced with CSV',
      insertedCount: result.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Start server
mongoose
  .connect('mongodb+srv://rayaljomy_db_user:DRWGRRqDasgkvqnU@backenddb.3hhr3v4.mongodb.net/CSV-VALUES?appName=backendDB')
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(4000, () => {
      console.log('Server running on port 4000');
    });
  })
  .catch((err) => {
    console.log('Connection failed:', err.message);
  });
