const mongoose = require('mongoose');

const userSettingsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  theme: { type: String, default: 'light' },
  sound_enabled: { type: Boolean, default: true },
  default_drink: { type: String, default: null },
  notif_enabled: { type: Boolean, default: false },
});

module.exports = mongoose.model('UserSettings', userSettingsSchema);
