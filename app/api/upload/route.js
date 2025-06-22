import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import uploadImage from '@/utils/uploadImage';
import verifyUser from '@/utils/VerifyUser';

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request) {
  const user = await verifyUser(request, ['admin', 'reader']);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // ✅ Use OS temporary directory instead of /public/uploads
  const tempDir = path.join(os.tmpdir(), 'uploads');
  await fs.mkdir(tempDir, { recursive: true });

  try {
    const formData = await request.formData();
    const file = formData.get('image');
    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const tmpPath = path.join(tempDir, `${Date.now()}-${file.name}`);
    await fs.writeFile(tmpPath, buffer);

    const result = await uploadImage(tmpPath);

    return NextResponse.json({ url: result.url });
  } catch (err) {
    console.error('Upload error', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  } finally {
    // Clean up temporary files
    try {
      const files = await fs.readdir(tempDir);
      for (const fname of files) {
        if (fname.includes('-')) {
          await fs.unlink(path.join(tempDir, fname));
        }
      }
    } catch {
      // Ignore cleanup errors
    }
  }
}
