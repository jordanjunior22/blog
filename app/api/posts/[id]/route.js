import connectDB from '@/utils/connectDB';
import Post from '@/models/Post';
import { NextResponse } from 'next/server';
import verifyUser from '@/utils/VerifyUser';


export async function GET(_, { params }) {
  await connectDB();
  const post = await Post.findById(params.id).populate('author');
  if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(post);
}

function slugify(text) {
  const slug = text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug.length > 0 ? slug : 'untitled';
}


export async function PUT(request, { params }) {
  const user = await verifyUser(request, ['admin']);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  await connectDB();

  const updates = await request.json();
  const { id } = await params;

  try {
    const post = await Post.findByIdAndUpdate(id, updates, { new: true });
    if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(post);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  const user = await verifyUser(request, ['admin']);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  await connectDB();
  try {
    const deleted = await Post.findByIdAndDelete(params.id);
    if (!deleted) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ message: 'Deleted' });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
