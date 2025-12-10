import connectDB from '@/utils/connectDB';
import Post from '@/models/Post';
import { NextResponse } from 'next/server';
import verifyUser from '@/utils/VerifyUser';
import mongoose from 'mongoose';

// GET post by id
export async function GET(_, context) {
  await connectDB();

  const { params } = await context;
  const { id } = await params; // ✅ await params
  
  const post = await Post.findById(id).populate('author');

  if (!post) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json(post);
}

// slugify utility
function slugify(text) {
  const slug = text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug.length > 0 ? slug : 'untitled';
}

// PUT update post
export async function PUT(request, context) {
  const { params } = await context;
  const { id } = await params; // ✅ await params

  const user = await verifyUser(request, ['admin']);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();
  const updates = await request.json();

  try {
    const post = await Post.findByIdAndUpdate(id, updates, { new: true });
    if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(post);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

// DELETE post
export async function DELETE(request, context) {
  const { params } = await context; // ✅ await context
  const { id } = await params; // ✅ ALSO await params before accessing .id

  const user = await verifyUser(request, ['admin']);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  try {
    const deleted = await Post.findByIdAndDelete(id);
    if (!deleted) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ message: 'Deleted' });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}