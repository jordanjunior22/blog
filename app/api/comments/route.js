const connectDB = require('@/utils/connectDB');
const Comment = require('@/models/Comment');
import verifyUser from '@/utils/VerifyUser';

export async function GET() {
  await connectDB();
  const comments = await Comment.find({})
    .populate('author', 'name email avatarUrl')
    .populate('post', 'title');
  return Response.json(comments);
}

export async function POST(Request) {
  await connectDB();
  const body = await Request.json();

  const { content, authorId, parentComment, post } = body;
  try {

  const newComment = await Comment.create({
    post,              // use post from body
    author: authorId,
    content,
    parentComment: parentComment || null,
  });
    return Response.json(newComment, { status: 201 });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 400 });
  }
}
