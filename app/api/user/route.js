import bcrypt from 'bcryptjs';
import User from '@/models/User';
const connectDB = require('@/utils/connectDB');
import verifyUser from '@/utils/VerifyUser';

export async function GET() {
  try {
    await connectDB();
    const users = await User.find().select('-password');
    return Response.json(users);
  }catch (error) {
    console.error('Error fetching users:', error); // Logs the actual error
    return Response.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

async function isRequestFromAdmin(request) {
    const user = await verifyUser(request);
  return user?.role === 'admin';
}

export async function POST(req) {
  await connectDB();
  const body = await req.json();

  const { name, email, password, role } = body;

  // Check for duplicate email
  const existing = await User.findOne({ email });
  if (existing) {
    return Response.json({ error: 'Email already in use' }, { status: 400 });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  let assignedRole = 'reader'; // default

  if (role === 'admin') {
    const isAdmin = await isRequestFromAdmin(req);
    if (!isAdmin) {
      return Response.json({ error: 'Unauthorized to create admin' }, { status: 403 });
    }
    assignedRole = 'admin';
  }

  const newUser = new User({
    name,
    email,
    password: hashedPassword,
    role: assignedRole,
  });

  await newUser.save();

  return Response.json({
    success: true,
    user: {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    },
  });
}
