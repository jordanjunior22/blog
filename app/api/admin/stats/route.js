// app/api/admin/stats/route.js
const { NextResponse } = require('next/server');
const connectDB = require('@/utils/connectDB');
const User = require('@/models/User');
const Post = require('@/models/Post');
const Tag = require('@/models/Tag');
const Category = require('@/models/Category');
const Comment = require('@/models/Comment');
const jwt = require('jsonwebtoken');
import verifyUser from '@/utils/VerifyUser';

module.exports.GET = async function handler(request) {
  await connectDB();

  try {
    const user = await verifyUser(request, ['admin']);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const [users, posts, tags, categories, comments] = await Promise.all([
      User.countDocuments(),
      Post.countDocuments(),
      Tag.countDocuments(),
      Category.countDocuments(),
      Comment.countDocuments()
    ]);

    return NextResponse.json({ users, posts, tags, categories, comments });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
};
