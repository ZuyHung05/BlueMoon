const mongoose = require('mongoose');
const { Schema } = mongoose;

/**
 * Model này định nghĩa các quyền.
 * Ví dụ: { code: 'CREATE_INCIDENT', description: 'Tạo báo cáo sự cố' }
 * Model Role.js sẽ tham chiếu (ref) đến đây.
 */
const permissionSchema = new Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true // Tự động viết hoa: 'create_incident' -> 'CREATE_INCIDENT'
  },
  description: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Permission', permissionSchema);