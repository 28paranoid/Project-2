const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  drink_id: { type: String, required: true },
  planned_minutes: { type: Number, required: true },
  actual_seconds: { type: Number, default: 0 },
  completed: { type: Boolean, default: false },
}, { timestamps: { createdAt: 'created_at' } });

module.exports = mongoose.model('Session', sessionSchema);
