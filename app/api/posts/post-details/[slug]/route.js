import { NextResponse } from 'next/server';
import connectDB from '@/utils/connectDB';
import Post from '@/models/Post';

export async function GET(request, { params }) {
const { slug } = await params;

  await connectDB();
 
  try {
    const post = await Post.findOne({ slug }).populate('author', 'name avatarUrl');
    //console.log(post);
    if (!post) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json(post, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/posts/post-details/[slug]:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
