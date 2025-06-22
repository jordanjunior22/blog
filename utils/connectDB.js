const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables (if needed, already handled by Next.js usually)
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error('⚠️ MONGO_URI is not defined in .env.local');
}

// Use a cached connection to prevent re-connecting on every API call
let cached = global.mongoose || { conn: null, promise: null };

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }

  cached.conn = await cached.promise;
  global.mongoose = cached;

  return cached.conn;
}

module.exports = connectDB;
