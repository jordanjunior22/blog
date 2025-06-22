import bcrypt from 'bcryptjs';
import User from '@/models/User';
const connectDB = require('@/utils/connectDB');

export async function PUT(req) {
  await connectDB();
  const body = await req.json();

  try {
    const { _id, currentPassword, newPassword } = body;

    if (!_id || !currentPassword || !newPassword) {
      return Response.json({ error: 'Missing fields' }, { status: 400 });
    }

    const user = await User.findById(_id);
    if (!user) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return Response.json({ error: 'Incorrect current password' }, { status: 403 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    await user.save();

    return Response.json({ success: true, message: 'Password updated successfully' });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
