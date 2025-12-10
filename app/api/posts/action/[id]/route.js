import connectDB from '@/utils/connectDB';
import verifyUser from '@/utils/VerifyUser';
import Post from '@/models/Post';
import { NextResponse } from 'next/server';

export async function PATCH(request, context) {
  await connectDB();
  
  const { params } = await context; // ✅ First await context
  const { id } = await params;      // ✅ Then await params
  
  const user = await verifyUser(request, ['reader', 'admin']);
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const post = await Post.findById(id);
  if (!post) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }

  const { action } = await request.json();
  const userId = user._id.toString();

  // ✅ Initialize arrays if they don't exist
  post.likes = post.likes || [];
  post.dislikes = post.dislikes || [];

  // ✅ Use .some() for reliable ObjectId comparison
  const isLiked = post.likes.some(like => like.toString() === userId);
  const isDisliked = post.dislikes.some(dislike => dislike.toString() === userId);

  if (action === 'like') {
    if (isLiked) {
      // ✅ Use .filter() instead of .pull()
      post.likes = post.likes.filter(like => like.toString() !== userId);
    } else {
      post.likes.push(userId);
      if (isDisliked) {
        post.dislikes = post.dislikes.filter(dislike => dislike.toString() !== userId);
      }
    }
  } else if (action === 'dislike') {
    if (isDisliked) {
      post.dislikes = post.dislikes.filter(dislike => dislike.toString() !== userId);
    } else {
      post.dislikes.push(userId);
      if (isLiked) {
        post.likes = post.likes.filter(like => like.toString() !== userId);
      }
    }
  } else {
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  }

  await post.save();

  return NextResponse.json({
    likes: post.likes,
    dislikes: post.dislikes,
  });
}