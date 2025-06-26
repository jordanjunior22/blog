import connectDB from '@/utils/connectDB';
import verifyUser from '@/utils/VerifyUser';
import Post from '@/models/Post';

export async function PATCH(request, { params }) {
  await connectDB();
  const { id } = await params;
  const user = await verifyUser(request, ['reader', 'admin']);
  
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const post = await Post.findById(id);
  if (!post) {
    return Response.json({ error: 'Post not found' }, { status: 404 });
  }

  const { action } = await request.json(); // expects { action: "like" | "dislike" }
  const userId = user._id.toString();

  const isLiked = post.likes.includes(userId);
  const isDisliked = post.dislikes.includes(userId);

  if (action === 'like') {
    if (isLiked) {
      post.likes.pull(userId); // Unlike
    } else {
      post.likes.push(userId); // Like
      if (isDisliked) post.dislikes.pull(userId); // Remove dislike if previously disliked
    }
  } else if (action === 'dislike') {
    if (isDisliked) {
      post.dislikes.pull(userId); // Remove dislike
    } else {
      post.dislikes.push(userId); // Dislike
      if (isLiked) post.likes.pull(userId); // Remove like if previously liked
    }
  } else {
    return Response.json({ error: 'Invalid action' }, { status: 400 });
  }

  await post.save();

  return Response.json({
    likes: post.likes,
    dislikes: post.dislikes,
  });
}
