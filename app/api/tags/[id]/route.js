const connectDB = require('@/lib/connectDB');
const Tag = require('@/models/Tag');

export async function GET(_, { params }) {
  await connectDB();
  const tag = await Tag.findById(params.id);
  if (!tag) return Response.json({ error: 'Not found' }, { status: 404 });
  return Response.json(tag);
}

export async function PUT(request, { params }) {
  await connectDB();
  const updates = await request.json();

  try {
    const updated = await Tag.findByIdAndUpdate(params.id, updates, { new: true });
    if (!updated) return Response.json({ error: 'Not found' }, { status: 404 });
    return Response.json(updated);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 400 });
  }
}

export async function DELETE(_, { params }) {
  await connectDB();

  try {
    await Tag.findByIdAndDelete(params.id);
    return Response.json({ message: 'Tag deleted' });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 400 });
  }
}
