import connectDB from '@/utils/connectDB';
import verifyUser from '@/utils/VerifyUser';
import Post from '@/models/Post';

export async function PATCH(request, { params }) {
  await connectDB();
const { id } = await params
  const user = await verifyUser(request, ['user', 'admin']);
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const post = await Post.findById(id);
  if (!post) {
    return Response.json({ error: 'Post not found' }, { status: 404 });
  }

  const userId = user._id.toString();
  const isLiked = post.likes.includes(userId);
  const isDisliked = post.dislikes.includes(userId);

  if (isLiked) {
    post.likes.pull(userId);
  } else {
    post.likes.push(userId);
    if (isDisliked) post.dislikes.pull(userId);
  }

  await post.save();

  return Response.json({
    likes: post.likes,
    dislikes: post.dislikes,
  });
}
