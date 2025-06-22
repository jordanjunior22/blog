import connectDB from '@/utils/connectDB';
import Comment from '@/models/Comment';
import { NextResponse } from 'next/server';
import verifyUser from '@/utils/VerifyUser';

export async function GET(_, { params }) {
  await connectDB();

  const comments = await Comment.find({})
    .populate('author', 'name avatarUrl') 
    .populate('post', 'title slug')
    .lean();

  return NextResponse.json(comments);
}


export async function POST(req, { params }) {
  await connectDB();
  const body = await req.json();

  const { content, authorId, parentComment } = body;

  const newComment = await Comment.create({
    post: params.id,
    author: authorId,
    content,
    parentComment: parentComment || null,
  });

  return NextResponse.json(newComment, { status: 201 });
}

export async function DELETE(req, { params }) {
  await connectDB();
const commentId = params.id;

  if (!commentId) {
    return NextResponse.json({ error: 'Comment ID not provided' }, { status: 400 });
  }

  try {
    await deleteCommentAndChildren(commentId);
    return NextResponse.json({ message: 'Deleted' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete comment and children' }, { status: 500 });
  }
}

async function deleteCommentAndChildren(commentId) {
  const childComments = await Comment.find({ parentComment: commentId });

  for (const child of childComments) {
    await deleteCommentAndChildren(child._id); // Recursive delete
  }

  await Comment.findByIdAndDelete(commentId);
}
