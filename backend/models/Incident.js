const mongoose = require('mongoose');
const { Schema } = mongoose;

/**
 * Đây là Model LÕI của toàn bộ dự án.
 * Nó NHÚNG (Embed) 4 schema con (Image, Update, Assignment, Rating)
 * Nó THAM CHIẾU (Ref) đến 3 models khác (User, IncidentType, Team)
 */

// --- Các Sub-Schemas NHÚNG (Embedded) ---

const IncidentImageSchema = new Schema({
  image_url: { type: String, required: true },
  uploader_id: { type: Schema.Types.ObjectId, ref: 'User' },
  type: { type: String, enum: ['before', 'during', 'after'], default: 'before' },
  description: { type: String }
}, { _id: false, timestamps: { createdAt: 'uploaded_at' } });

const IncidentUpdateSchema = new Schema({
  updater_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  update_time: { type: Date, default: Date.now },
  status_from: { type: String }, // Trạng thái cũ (để log)
  status_to: { type: String, required: true }, // Trạng thái mới
  note: { type: String },
  visible_to_citizen: { type: Boolean, default: true }
}, { _id: false });

const IncidentAssignmentSchema = new Schema({
  team_id: { type: Schema.Types.ObjectId, ref: 'Team', required: true },
  assigned_by: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  assigned_at: { type: Date, default: Date.now },
  note: { type: String }
}, { _id: false });

const IncidentRatingSchema = new Schema({
  rater_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String },
  created_at: { type: Date, default: Date.now }
}, { _id: false });


// --- Schema CHÍNH (Incident) ---

const incidentSchema = new Schema({
  // --- Tham chiếu (Refs) ---
  reporter_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  type_id: {
    type: Schema.Types.ObjectId,
    ref: 'IncidentType',
    required: true
  },
  assigned_team_id: { // Đội đang xử lý (current)
    type: Schema.Types.ObjectId,
    ref: 'Team',
    default: null,
    index: true
  },

  // --- Dữ liệu lõi ---
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  status: {
    type: String,
    required: true,
    enum: ['reported', 'assigned', 'in_progress', 'completed', 'reopened', 'rejected'],
    default: 'reported'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  address: { type: String, required: true },
  location: { // GeoJSON
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number], // [Longitude, Latitude]
      required: true
    }
  },

  // --- Dữ liệu NHÚNG (Embedded) ---
  images: [IncidentImageSchema],
  updates: [IncidentUpdateSchema],
  assignments: [IncidentAssignmentSchema], // Lịch sử phân công
  rating: IncidentRatingSchema // Chỉ 1 đánh giá

}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// BẮT BUỘC: Tạo index 2dsphere để query vị trí
incidentSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Incident', incidentSchema);