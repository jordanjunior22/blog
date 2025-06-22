import { NextResponse } from 'next/server';
const sendEmail = require('@/utils/sendEmail');

export async function POST(req) {
  try {
    const body = await req.json();
    const { to, subject, message } = body;

    if (!to || !subject || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await sendEmail({
      to,
      subject,
      html: `<p>${message}</p>`,
    });

    return NextResponse.json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Email Error:', error.message);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
