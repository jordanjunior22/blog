const connectDB = require('@/utils/connectDB');
const Tag = require('@/models/Tag');

export async function GET() {
  await connectDB();
  const tags = await Tag.find({});
  return Response.json(tags);
}

export async function POST(request) {
  await connectDB();
  const data = await request.json();

  try {
    const tag = new Tag(data);
    await tag.save();
    return Response.json(tag, { status: 201 });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 400 });
  }
}
