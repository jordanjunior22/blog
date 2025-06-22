const mongoose = require('mongoose');

const TagSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true },
  slug: { type: String, unique: true, required: true }
});

module.exports = mongoose.models.Tag || mongoose.model('Tag', TagSchema);
