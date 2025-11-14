const mongoose = require('mongoose');
const { Schema } = mongoose;

/**
 * Model này định nghĩa các loại sự cố (Ổ gà, Rác thải...)
 * Bắt buộc phải có để người dân (citizen) chọn khi báo cáo.
 */
const incidentTypeSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  icon_url: { // Đường dẫn tới icon (nếu có)
    type: String
  }
});

module.exports = mongoose.model('IncidentType', incidentTypeSchema);