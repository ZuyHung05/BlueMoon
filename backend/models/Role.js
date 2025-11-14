const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    enum: ['admin', 'engineer', 'user'] // optional — limits role names
  },
  permissions: {
    type: [String],
    default: []
  }
});

module.exports = mongoose.model('Role', roleSchema);
