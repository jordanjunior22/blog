// pages/api/auth/login.js
const { NextResponse } = require('next/server');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('@/models/User'); // Assuming this path is correct
const connectDB = require('@/utils/connectDB');
const { serialize } = require('cookie');

export async function POST(req) {
  await connectDB();

  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Ensure your User model fetches or contains the avatarUrl property
    // If avatarUrl is not always present, consider a default here.
    // user.toObject() or JSON.parse(JSON.stringify(user)) is often needed
    // to convert Mongoose document to plain JS object to safely delete properties.
    const userObject = user.toObject(); // Convert Mongoose document to plain object
    delete userObject.password; // Remove sensitive info before sending to client

    const token = jwt.sign(
      { id: userObject._id, email: userObject.email, role: userObject.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const cookie = serialize('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    // --- CRITICAL CHANGE HERE ---
    // Include the user object in the response.
    // This `user` object is what your frontend `setUser(data.user)` expects.
    const res = NextResponse.json({
      message: 'Login successful',
      user: { // Make sure this matches the structure expected by your UserContext
        id: userObject._id,
        email: userObject.email,
        name: userObject.name, // Assuming your User model has a 'name' field
        avatarUrl: userObject.avatarUrl || '/default.webp', // Ensure avatarUrl is sent
        role: userObject.role,
        // Add any other user fields your frontend needs
      }
    });

    res.headers.set('Set-Cookie', cookie);
    return res;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}