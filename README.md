# CSV-MongoDB API

Node.js Express API for CSV file operations with MongoDB integration. Supports CRUD operations on CSV files and importing data to MongoDB.

## Features

-  Read and display all CSV data
-  Search/filter CSV rows by query parameters
-  Update CSV rows 
-  Delete CSV rows 
-  Add new columns to CSV
-  Delete columns from CSV
-  Import CSV data into MongoDB
-  REST API with Express.js
-  MongoDB integration with Mongoose

## Project Structure

```
csv-mongodb-api/
├── trial.js               # Main Express server
├── csvService.js          # CSV read/write utilities
├── models/
│   └── values.model.js    # Mongoose schema for Values collection
├── data.csv               # Sample CSV file
├── package.json
├── .gitignore
└── README.md
```

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/Thesageof69/csv-mongodb-api.git
cd csv-mongodb-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure MongoDB

Open `server.js` and replace the MongoDB connection string with your own:

```javascript
mongoose.connect(
  'mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/CSV-VALUES?appName=backendDB'
)
```

### 4. Run the server

```bash
npm start
```

For development with auto-reload:

```bash
npm run dev
```

The server will start on `http://localhost:4000`

## API Endpoints

### CSV Operations (File)

#### Get all CSV rows
```http
GET /api/csv
```

#### Search CSV rows
```http
GET /api/csv/search?col1=Pancakes
```

#### Update CSV rows
```http
PUT /api/csv?col1=Pancakes
Content-Type: application/json

{
  "col2": "15",
  "col3": "5.99"
}
```

#### Delete CSV rows
```http
DELETE /api/csv?col1=Pancakes
```

#### Add a new column
```http
POST /api/csv/column
Content-Type: application/json

{
  "columnName": "name",
  "defaultValue": "Product"
}
```

#### Delete a column
```http
DELETE /api/csv/column
Content-Type: application/json

{
  "columnName": "name"
}
```

### MongoDB Operations

#### Get all MongoDB documents
```http
GET /api/values
```

#### Import CSV to MongoDB
```http
POST /api/csv/import-to-mongo
```

## Example Usage with Insomnia/Postman

### 1. View all CSV data
- Method: `GET`
- URL: `http://localhost:4000/api/csv`

### 2. Update a row
- Method: `PUT`
- URL: `http://localhost:4000/api/csv?col1=Pizza`
- Body (JSON):
  ```json
  {
    "col2": "25",
    "col3": "9.99"
  }
  ```

### 3. Import to MongoDB
- Method: `POST`
- URL: `http://localhost:4000/api/csv/import-to-mongo`
- No body needed

### 4. View MongoDB data
- Method: `GET`
- URL: `http://localhost:4000/api/values`

## Technologies Used

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **Mongoose** - MongoDB ODM
- **MongoDB Atlas** - Cloud database
- **File System (fs)** - CSV file operations

## License

MIT

## Author

Thesageof69
