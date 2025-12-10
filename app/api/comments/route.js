import { NextResponse } from 'next/server';
import connectDB from '@/utils/connectDB';
import Comment from '@/models/Comment';
import verifyUser from '@/utils/VerifyUser';

export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');
    
    const query = postId ? { post: postId } : {};
    
    const comments = await Comment.find(query)
      .populate('author', 'name email avatarUrl')
      .populate('post', 'title slug')  // ✅ Added 'slug' here
      .sort({ createdAt: 1 });
      
    return NextResponse.json(comments);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();

    const { content, authorId, parentComment, post } = body;
    
    if (!content || !authorId || !post) {
      return NextResponse.json(
        { error: 'Missing required fields: content, authorId, and post are required' },
        { status: 400 }
      );
    }
    
    const newComment = await Comment.create({
      post,
      author: authorId,
      content,
      parentComment: parentComment || null,
    });
    
    const populated = await Comment.findById(newComment._id)
      .populate('author', 'name email avatarUrl')
      .populate('post', 'title slug');  // ✅ Added 'slug' here
    
    return NextResponse.json(populated, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}