import { NextResponse } from 'next/server';
import connectDB from '@/utils/connectDB';
import Post from '@/models/Post';

export async function PATCH(req, context) {
  // ✅ Always extract params synchronously before any `await`
  const { id } = context.params;

  await connectDB();

  try {
    // ✅ Un-feature all other posts
    await Post.updateMany({ _id: { $ne: id } }, { $set: { featured: false } });

    // ✅ Toggle the featured field directly, skip full validation
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
