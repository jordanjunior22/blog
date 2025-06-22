const connectDB = require('@/utils/connectDB');
const Category = require('@/models/Category');
import verifyUser from '@/utils/VerifyUser';

export async function GET(_, { params }) {
  await connectDB();
  const { id } = await params;
  const category = await Category.findById(id);
  if (!category) return Response.json({ error: 'Not found' }, { status: 404 });
  return Response.json(category);
}

export async function PUT(request, { params }) {
  const user = await verifyUser(request, ['admin']);
  const { id } = await params;
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  await connectDB();
  const updates = await request.json();
  console.log(updates)

  try {
    const updated = await Category.findByIdAndUpdate(id, updates, { new: true });
    if (!updated) return Response.json({ error: 'Not found' }, { status: 404 });
    return Response.json(updated);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {

  const user = await verifyUser(request, ['admin']);
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  await connectDB();

  try {
    await Category.findByIdAndDelete(params.id);
    return Response.json({ message: 'Category deleted' });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 400 });
  }
}
