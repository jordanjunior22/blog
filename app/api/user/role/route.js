const connectDB = require('@/utils/connectDB');
const User = require('@/models/User');

export async function GET(req) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const role = searchParams.get('role');

  let filter = {};
  if (role) filter.role = role;

  const users = await User.find(filter);
  return Response.json(users);
}
