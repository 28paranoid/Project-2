const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
}, { timestamps: { createdAt: 'created_at' } });

module.exports = mongoose.model('User', userSchema);
