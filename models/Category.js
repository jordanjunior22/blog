const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  coverImage:{type: String},
  slug: { type: String, required: true, unique: true },
  description: String
});

module.exports = mongoose.models.Category || mongoose.model('Category', CategorySchema);
