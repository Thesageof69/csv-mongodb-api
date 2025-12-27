const mongoose = require('mongoose');

const valueSchema = new mongoose.Schema(
  {
    col1: String,
    col2: String,
    col3: String,
    name: String,
    gradeY: String,
    George: String,
  },
  { collection: 'Values' }
);

module.exports = mongoose.model('Value', valueSchema);
