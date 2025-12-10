import { NextResponse } from 'next/server';
import connectDB from '@/utils/connectDB';
import Category from '@/models/Category';
import verifyUser from '@/utils/VerifyUser';

export async function GET() {
  await connectDB();

  const categories = await Category.find({});
  return NextResponse.json(categories);
}

export async function POST(request) {
  try {
    const user = await verifyUser(request, ['admin']);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    await connectDB();
    const data = await request.json();

    const category = new Category(data);
    await category.save();
    return NextResponse.json(category, { status: 201 });
  } catch (err) {
    // Handle unauthorized error from verifyUser
    if (err.message === 'Unauthorized: No token cookie found' || err.status === 401) {
      return NextResponse.json({ error: 'Unauthorized: Please login' }, { status: 401 });
    }
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}