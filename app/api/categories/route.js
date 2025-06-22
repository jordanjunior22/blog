const connectDB = require('@/utils/connectDB');
const Category = require('@/models/Category');
import verifyUser from '@/utils/VerifyUser';

export async function GET() {
  await connectDB();

  const categories = await Category.find({});
  return Response.json(categories);
}

export async function POST(request) {
  const user = await verifyUser(request, ['admin']);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  await connectDB();
  const data = await request.json();

  try {
    const category = new Category(data);
    await category.save();
    return Response.json(category, { status: 201 });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 400 });
  }
}
