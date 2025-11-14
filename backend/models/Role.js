const mongoose = require('mongoose');
const { Schema } = mongoose;

const roleSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    enum: ['citizen', 'authority', 'technician'] // Đã sửa
  },
  // THAY ĐỔI: Chuyển từ [String] sang Tham chiếu (Ref)
  permissions: [{
    type: Schema.Types.ObjectId,
    ref: 'Permission' // Tham chiếu đến Model 'Permission'
  }]
});

module.exports = mongoose.model('Role', roleSchema);