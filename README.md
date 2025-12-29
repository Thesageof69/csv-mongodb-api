CSV-HTML-MongoDB API

Node.js Express API for CSV file operations with HTML frontend and MongoDB integration. Supports full CRUD operations on CSV files with automatic MongoDB synchronization.

-> Features

- Web Interface - Clean HTML frontend to view and manage data
- Read CSV data - Display all CSV rows in a table
- Add new rows - Insert data via API
- Update rows - Edit existing data inline with auto-sync
- Delete rows - Remove data with confirmation
- Auto-sync to MongoDB - All changes automatically reflect in MongoDB
- REST API - Full CRUD operations via Express.js
- MongoDB Integration - Mongoose ODM with flexible schema

-> Project Structure
```
csv-mongodb-api/
├── trial.js # Main Express server
├── csvService.js # CSV read/write utilities
├── index.html # Frontend interface
├── models/
│ └── values.model.js # Mongoose schema 
├── Data.csv # CSV data file
├── package.json
├── .gitignore
└── README.md

```

-> Installation

->> 1. Clone the repository

```
git clone https://github.com/Thesageof69/csv-mongodb-api.git
cd csv-mongodb-api
```

->> 2. Install dependencies

```
npm install
```

Required packages:
- express
- mongoose
- cors

```
npm install express mongoose cors
```

->> 3. Configure MongoDB

Open `trial.js` and replace the MongoDB connection string with your own:

```
mongoose.connect(
  'mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/CSV-VALUES?appName=backendDB'
)
```

->> 4. Run the server

```
npm start
```

For development with auto-reload:

```
npm run dev
```

The server will start on `http://localhost:4000`

->> Usage

->> Web Interface

1. Open your browser and go to `http://localhost:4000`
2. View all CSV data in a clean table format
3. Click Refresh to reload data
4. Click Edit on any row to modify data inline
5. Click Delete to remove a row (with confirmation)
6. All changes automatically sync to MongoDB

->> API Endpoints

->> Get all CSV rows

```
GET /api/csv
```

->> Search CSV rows
```
GET /api/csv/search?Name=Milan
```

->> Update CSV rows
```
PUT /api/csv?Name=Milan
Content-Type: application/json

{
  "age": "30",
  "Place": "Kochi"
}
```

->> Delete CSV rows
```
DELETE /api/csv?Name=Jack
```

->> Add a new column
```
POST /api/csv/column
Content-Type: application/json

{
  "Name": "name",
  "age": "age",
  "Place":"Place"
}
```

->> Delete a column
```http
DELETE /api/csv?Name=Milan
Content-Type: application/json

{

  "message": "Rows deleted and synced to MongoDB",
  "deletedCount": 1

}
```

-> MongoDB Operations

->> Get all MongoDB documents
```http
GET /api/values
```

->> Import CSV to MongoDB
```http
POST /api/csv/import-to-mongo
```

-> Example Usage with Insomnia/Postman

->> 1. View all CSV data
- Method: `GET`
- URL: `http://localhost:4000/api/csv`

->> 2. Update a row
- Method: `PUT`
- URL: `http://localhost:4000/api/csv?Name=Jack`
- Body (JSON):
  ```json
  {
    "age": "15",
    "Place": "Cardiff"
  }
  ```
  
->> 3. Delete a person
- Method: `DELETE`
- URL: `http://localhost:4000/api/csv?Name=Jack`

->> 4. Manual sync to MongoDB
- Method: `POST`
- URL:`http://localhost:4000/api/csv/sync-to-mongo`

-> Key Features

->> Automatic MongoDB Sync
All POST, PUT, and DELETE operations automatically sync to MongoDB. No manual sync needed.

->> Flexible Schema
The MongoDB schema uses `{ strict: false }` to accept any CSV columns dynamically.


-> CSV Service
Handles reading and writing CSV files with proper formatting:
```
const { readCsv, writeCsv } = require('./csvService');
```

-> Technologies Used

- Node.js - JavaScript runtime
- Express.js - Web framework
- Mongoose - MongoDB ODM
- MongoDB Atlas - Cloud database
- CORS - Cross-origin resource sharing
- File System (fs) - CSV file operations
- HTML/CSS/JavaScript - Frontend interface

-> File Structure Details

->> trial.js
Main Express server with all API routes and MongoDB connection.

->> csvService.js
Utility functions for reading and writing CSV files with clean line ending handling.

->> index.html
Simple, clean frontend interface with:
- Data table display
- Inline row editing
- Delete with confirmation
- Real-time status messages

->> values.model.js
Flexible Mongoose schema that accepts dynamic fields from CSV.

--> Error Handling

All endpoints include proper error handling:
- 400 - Bad Request (missing parameters)
- 404 - Not Found (no matching rows)
- 500 - Internal Server Error

-> License

MIT

-> Author

Thesageof69
