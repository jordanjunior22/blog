import connectDB from '@/utils/connectDB';
import verifyUser from '@/utils/VerifyUser';
import Post from '@/models/Post';

export async function PATCH(request, { params }) {
  await connectDB();
  const user = await verifyUser(request, ['user', 'admin']);
const { id } = await params

  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const post = await Post.findById(id);

  if (!post) {
    return Response.json({ error: 'Post not found' }, { status: 404 });
  }

  const userId = user._id.toString();

  const isDisliked = post.dislikes.includes(userId);
  const isLiked = post.likes.includes(userId);

  if (isDisliked) {
    post.dislikes.pull(userId); // remove dislike
  } else {
    post.dislikes.push(userId); // add dislike
    if (isLiked) {
      post.likes.pull(userId); // remove like if it exists
    }
  }

  await post.save();

  return Response.json({
    likes: post.likes,
    dislikes: post.dislikes,
  });
}
