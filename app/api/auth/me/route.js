import { NextResponse } from 'next/server';
import connectDB from '@/utils/connectDB';
import verifyUser from '@/utils/VerifyUser';
import User from '@/models/User'; // Add this

export async function GET(request) {
  try {
    await connectDB();

    const authUser = await verifyUser(request); // should return user ID or minimal info
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // ✅ Re-fetch full user from DB
    const user = await User.findById(authUser._id).select('-password'); // Exclude password
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Auth check failed:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
