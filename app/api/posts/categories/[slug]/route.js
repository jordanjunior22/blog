import { NextResponse } from 'next/server';
import connectDB from '@/utils/connectDB';
import Post from '@/models/Post';
import Category from '@/models/Category';

export async function GET(req, { params }) {
  const { slug } = await params;

  try {
    await connectDB();

    // Find the category by slug
    const category = await Category.findOne({ slug });
    //console.log(category)
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    // Fetch posts that belong to this category
    const posts = await Post.find({ category: category._id})
      .populate('author', 'name')
      .populate('category', 'name slug description coverImage')
      .sort({ createdAt: -1 });

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching posts by category:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
