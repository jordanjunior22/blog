const connectDB = require('@/utils/connectDB');
import verifyUser from '@/utils/VerifyUser';
import Post from '@/models/Post';
import Category from '@/models/Category'; // ✅ Add this line


export async function GET() {
  try {
    await connectDB();

    const posts = await Post.find()
      .populate('author', 'name email avatarUrl')
      .populate('category', 'name'); // ✅ Populate the category with just the name

    return Response.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch posts' }), { status: 500 });
  }
}

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function generateUniqueSlug(title) {
  let base = slugify(title);
  let slug = base;
  let count = 1;
  // check for existing
  while (await Post.findOne({ slug })) {
    slug = `${base}-${count++}`;
  }
  return slug;
}

export async function POST(request) {
  await connectDB();

  try {
    const user = await verifyUser(request, ['admin']);
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    } const data = await request.json();

    // generate slug server-side
    const slug = await generateUniqueSlug(data.title);
    const post = new Post({
      title: data.title,
      slug,
      content: data.content,
      coverImage: data.coverImage,
      category: data.category,
      published: data.published || false,
      author: user._id,
    });

    await post.save();
    return Response.json(post, { status: 201 });
  } catch (err) {
    const status = err.message === 'Forbidden' ? 403 : 401;
    return Response.json({ error: err.message }, { status });
  }
};