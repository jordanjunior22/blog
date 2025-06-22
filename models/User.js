const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatarUrl: String,
  bio: String,
  bioTitle: { type: String},
  role: { type: String, enum: ['admin', 'reader'], default: 'reader' },

  // ✅ New Links field
  links: [
    {
      label: { type: String },
      url: { type: String },
    },
  ],
}, { timestamps: true });

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
