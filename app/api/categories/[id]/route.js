import { NextResponse } from 'next/server';
import connectDB from '@/utils/connectDB';
import Category from '@/models/Category';
import verifyUser from '@/utils/VerifyUser';

export async function GET(_, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const category = await Category.findById(id);
    
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }
    
    return NextResponse.json(category);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const user = await verifyUser(request, ['admin']);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    await connectDB();
    const { id } = await params;
    const updates = await request.json();
    
    const updated = await Category.findByIdAndUpdate(id, updates, { 
      new: true,
      runValidators: true 
    });
    
    if (!updated) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }
    
    return NextResponse.json(updated);
  } catch (err) {
    // Handle unauthorized error from verifyUser
    if (err.message === 'Unauthorized: No token cookie found' || err.status === 401) {
      return NextResponse.json({ error: 'Unauthorized: Please login' }, { status: 401 });
    }
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const user = await verifyUser(request, ['admin']);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    await connectDB();
    const { id } = await params;
    
    const deleted = await Category.findByIdAndDelete(id);
    
    if (!deleted) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Category deleted successfully' });
  } catch (err) {
    // Handle unauthorized error from verifyUser
    if (err.message === 'Unauthorized: No token cookie found' || err.status === 401) {
      return NextResponse.json({ error: 'Unauthorized: Please login' }, { status: 401 });
    }
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}