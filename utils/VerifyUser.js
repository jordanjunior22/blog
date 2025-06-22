const jwt = require('jsonwebtoken');
const User = require('@/models/User');

const JWT_SECRET = process.env.JWT_SECRET;

function parseCookies(cookieHeader) {
  const cookies = {};
  if (!cookieHeader) return cookies;

  cookieHeader.split(';').forEach(cookie => {
    const [name, ...rest] = cookie.split('=');
    cookies[name.trim()] = rest.join('=').trim();
  });

  return cookies;
}

async function verifyUser(request, allowedRoles = []) {
  const cookieHeader = request.headers.get('cookie');
  const cookies = parseCookies(cookieHeader);

  if (!cookies.token) {
    const error = new Error('Unauthorized: No token cookie found');
    error.status = 401;
    throw error;
  }

  let decoded;
  try {
    decoded = jwt.verify(cookies.token, JWT_SECRET);
  } catch (err) {
    const error = new Error('Unauthorized: Invalid token');
    error.status = 401;
    throw error;
  }

  const user = await User.findById(decoded.id).select('name email role');
  if (!user) {
    const error = new Error('User not found');
    error.status = 404;
    throw error;
  }

  if (allowedRoles.length && !allowedRoles.includes(user.role)) {
    const error = new Error('Forbidden: Insufficient permissions');
    error.status = 403;
    throw error;
  }

  return user;
}

module.exports = verifyUser;
