const mongoose = require('mongoose');
const { Schema } = mongoose;

/**
 * Model này định nghĩa các đội kỹ thuật (Technician)
 * Nó nhúng (embeds) danh sách thành viên.
 */

// Schema nhúng cho thành viên
const TeamMemberSchema = new Schema({
  user_id: { // Tham chiếu đến User Model
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  role: {
    type: String,
    enum: ['leader', 'member'],
    default: 'member'
  }
}, { _id: false }); // _id: false vì đây là sub-document

// Schema chính cho Team
const teamSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String
  },
  is_active: {
    type: Boolean,
    default: true
  },
  members: [TeamMemberSchema] // Mảng thành viên được nhúng
}, {
  timestamps: { createdAt: 'created_at' }
});

module.exports = mongoose.model('Team', teamSchema);