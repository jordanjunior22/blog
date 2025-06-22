import { NextResponse } from 'next/server';
const User = require('@/models/User');
const bcrypt = require('bcryptjs');
const connectDB = require('@/utils/connectDB');

export async function POST(req) {
  await connectDB();

  const { token, newPassword } = await req.json();
  if (!token || !newPassword) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  return NextResponse.json({ message: 'Password has been reset successfully' });
}
