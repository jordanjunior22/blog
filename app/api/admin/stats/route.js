// app/api/admin/stats/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/utils/connectDB';
import User from '@/models/User';
import Post from '@/models/Post';
import Tag from '@/models/Tag';
import Category from '@/models/Category';
import Comment from '@/models/Comment';
import verifyUser from '@/utils/VerifyUser';

export async function GET(request) {
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
}
