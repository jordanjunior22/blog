// app/api/upload/route.js
import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import uploadImage from '@/utils/uploadImage';
import verifyUser from '@/utils/VerifyUser';

// Disable Next.js default body parser
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request) {
    const user = await verifyUser(request, ['admin','reader']);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  // Prepare a temp directory
  const tempDir = path.join(process.cwd(), 'public', 'uploads');
  await fs.mkdir(tempDir, { recursive: true });

  try {
    // Parse the multipart form
    const formData = await request.formData();
    const file = formData.get('image'); // input name="image"
    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Read file buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    const tmpPath = path.join(tempDir, `${Date.now()}-${file.name}`);
    await fs.writeFile(tmpPath, buffer);

    // Upload via your util
    const result = await uploadImage(tmpPath);

    return NextResponse.json({ url: result.url });
  } catch (err) {
    console.error('Upload error', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  } finally {
    // Clean up any files in tempDir older than this request
    try {
      const files = await fs.readdir(tempDir);
      for (const fname of files) {
        if (fname.includes('-')) {
          await fs.unlink(path.join(tempDir, fname));
        }
      }
    } catch {} // ignore cleanup errors
  }
}
