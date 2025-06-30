const connectDB = require('@/utils/connectDB');
const User = require('@/models/User');
import verifyUser from '@/utils/VerifyUser';

export async function GET(_, { params }) {
  await connectDB();
  const user = await User.findById(params.id);
  if (!user) return Response.json({ error: 'User not found' }, { status: 404 });
  return Response.json(user);
}


export async function PUT(req) {
  const user = await verifyUser(req, ['admin', 'reader']);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  await connectDB();
  const body = await req.json();
  console.log(body);
  try {
    const { _id, name, email, avatarUrl,bio, bioTitle,links } = body;
    if (!_id) {
      return Response.json({ error: 'User ID is required' }, { status: 400 });
    }

    const updatedUser = await User.findByIdAndUpdate(
      _id,
      { name, email, avatarUrl, bio, bioTitle,links },
      { new: true }
    );
    //console.log(updatedUser);
    if (!updatedUser) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    return Response.json({ success: true, user: updatedUser });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const user = await verifyUser(request, ['admin']);
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();

  try {
    await User.findByIdAndDelete(params.id);
    return Response.json({ success: true, message: 'User deleted' });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 400 });
  }
}

