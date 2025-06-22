const connectDB = require('@/utils/connectDB');
const User = require('@/models/User');
const bcrypt = require('bcrypt');

export async function POST(request) {
  await connectDB();
  const { name, email, password } = await request.json();

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return Response.json({ error: 'Email already in use' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    return Response.json({ message: 'User created' }, { status: 201 });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
