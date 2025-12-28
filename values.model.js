const mongoose = require('mongoose');

const valueSchema = new mongoose.Schema(
  {},  
  { 
    collection: 'Values',
    strict: false  
  } 
);

module.exports = mongoose.model('Value', valueSchema);
