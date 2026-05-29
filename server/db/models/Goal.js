const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  week_start: { type: String, required: true },
  target_minutes: { type: Number, default: 150 },
  sessions_target: { type: Number, default: 5 },
}, { timestamps: { createdAt: 'created_at' } });

goalSchema.index({ userId: 1, week_start: 1 }, { unique: true });

module.exports = mongoose.model('Goal', goalSchema);
