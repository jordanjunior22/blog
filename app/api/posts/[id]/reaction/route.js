// File: /pages/api/posts/[id]/reaction.js or /app/api/posts/[id]/reaction/route.js (Next.js 13+)

import connectDB from '@/utils/connectDB';
import Post from '@/models/Post';
import verifyUser from '@/utils/VerifyUser';

export async function POST(request, { params }) {
  await connectDB();

  try {
    // Verify user and get user ID
    const user = await verifyUser(request,['admin', 'reader']);
    const userId = user._id.toString();
    const postId = params.id;

    const { action } = await request.json(); // expects { action: 'like' } or { action: 'dislike' }

    if (!['like', 'dislike'].includes(action)) {
      return new Response(JSON.stringify({ error: 'Invalid action' }), { status: 400 });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return new Response(JSON.stringify({ error: 'Post not found' }), { status: 404 });
    }

    const hasLiked = post.likes.some(id => id.toString() === userId);
    const hasDisliked = post.dislikes.some(id => id.toString() === userId);

    if (action === 'like') {
      if (hasLiked) {
        // Remove like
        post.likes = post.likes.filter(id => id.toString() !== userId);
      } else {
        // Add like, remove dislike if any
        post.likes.push(user._id);
        if (hasDisliked) {
          post.dislikes = post.dislikes.filter(id => id.toString() !== userId);
        }
      }
    } else if (action === 'dislike') {
      if (hasDisliked) {
        // Remove dislike
        post.dislikes = post.dislikes.filter(id => id.toString() !== userId);
      } else {
        // Add dislike, remove like if any
        post.dislikes.push(user._id);
        if (hasLiked) {
          post.likes = post.likes.filter(id => id.toString() !== userId);
        }
      }
    }

    await post.save();

    return new Response(
      JSON.stringify({
        likesCount: post.likes.length,
        dislikesCount: post.dislikes.length,
        userLiked: post.likes.some(id => id.toString() === userId),
        userDisliked: post.dislikes.some(id => id.toString() === userId),
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}
