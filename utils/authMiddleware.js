const jwt = require('jsonwebtoken');
const { parse } = require('cookie');

async function authMiddleware(request) {
  const cookieHeader = request.headers.get('cookie');
  if (!cookieHeader) {
    throw new Error('No cookie found');
  }

  const cookies = parse(cookieHeader);
  const token = cookies.token;

  if (!token) {
    throw new Error('No token provided in cookies');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded; // contains id, email, role
  } catch (err) {
    throw new Error('Invalid token');
  }
}

module.exports = authMiddleware;
