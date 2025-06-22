// app/api/auth/logout/route.js

const { NextResponse } = require('next/server');

module.exports.POST = async function handler(req) {
  const response = NextResponse.json({ message: 'Logged out' });
  response.headers.set(
    'Set-Cookie',
    `token=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax; Secure`
  );
  return response;
};
// 