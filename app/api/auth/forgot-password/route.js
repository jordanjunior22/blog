import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { NextResponse } from 'next/server';
const sendEmail = require('@/utils/sendEmail');
const User = require('@/models/User');
const connectDB = require('@/utils/connectDB');

export async function POST(req) {
  await connectDB();

  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  const user = await User.findOne({ email });
  if (!user) {
    // Do not reveal whether the email exists
    return NextResponse.json({ message: 'If that email exists, a new password was sent.' });
  }

  // Generate new secure password
  const newPassword = crypto.randomBytes(8).toString('base64url'); // e.g., 'f83jDKlz'
  const hashedPassword = await bcrypt.hash(newPassword, 12);

  // Update the password in DB
  user.password = hashedPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  // Send the new password via email
  const html = `
    <p>Hello ${user.name || 'there'},</p>
    <p>Your password has been reset. Here is your new temporary password:</p>
    <p style="font-size:18px; font-weight:bold;">${newPassword}</p>
    <p>Please log in and change your password immediately for security.</p>
  `;

  await sendEmail({
    to: user.email,
    subject: 'Your new password',
    html,
  });

  return NextResponse.json({ message: 'If that email exists, a new password was sent.' });
}
