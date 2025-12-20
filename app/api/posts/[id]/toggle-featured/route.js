import { NextResponse } from 'next/server';
import connectDB from '@/utils/connectDB';
import Post from '@/models/Post';

export async function PATCH(req, context) {
  try {
    // For Next.js 15, params might need to be awaited
    const params = await context.params;
    const { id } = params;

    await connectDB();

    await Post.updateMany({ _id: { $ne: id } }, { $set: { featured: false } });

    const updated = await Post.findByIdAndUpdate(
      id,
      [{ $set: { featured: { $not: '$featured' } } }],
      { new: true, runValidators: false }
    );

    if (!updated) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Featured status updated',
      featured: updated.featured,
    });
  } catch (err) {
    console.error('Error toggling featured status:', err);
    return NextResponse.json(
      { error: 'Server error', details: err.message },
      { status: 500 }
    );
  }
}