import { NextResponse } from 'next/server';
import connectDB from '@/utils/connectDB';
import Subscriber from '@/models/Subscriber';

export async function POST(request) {
  await connectDB();

  const { email } = await request.json();

  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
  }

  try {
    const existing = await Subscriber.findOne({ email });
    if (existing) {
      return NextResponse.json({ message: 'Already subscribed' }, { status: 200 });
    }

    const newSubscriber = new Subscriber({ email });
    await newSubscriber.save();

    return NextResponse.json({ message: 'Subscribed successfully' }, { status: 201 });
  } catch (err) {
    console.error('Subscription error:', err);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}

// GET: Fetch all subscribers
export async function GET() {
  await connectDB();

  try {
    const subscribers = await Subscriber.find().sort({ subscribedAt: -1 }); // optional: most recent first
    return NextResponse.json(subscribers, { status: 200 });
  } catch (err) {
    console.error('Fetch error:', err);
    return NextResponse.json({ error: 'Failed to fetch subscribers' }, { status: 500 });
  }
}