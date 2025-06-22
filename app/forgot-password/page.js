'use client';

import { useState } from 'react';
import { MailCheck, Loader2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const json = await res.json();

      if (!res.ok) throw new Error(json.error || 'Something went wrong');

      setMessage(json.message);
    } catch (err) {
      setError(err.message || 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-100 text-sm">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 space-y-6">
        <div className="text-center">
          <MailCheck className="mx-auto h-12 w-12 text-blue-600" />
          <h1 className="text-2xl font-bold mt-2">Forgot Password?</h1>
          <p className="text-gray-500 text-sm mt-1">
            Enter your email and we’ll send you a new password.
          </p>
        </div>

        <form onSubmit={handleReset} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full border px-4 py-2 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="you@example.com"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full cursor-pointer flex justify-center items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Sending...
              </>
            ) : (
              'Send New Password'
            )}
          </button>
        </form>

        {message && (
          <p className="text-sm text-green-600 text-center border border-green-200 bg-green-50 rounded-md p-2">
            {message}
          </p>
        )}
        {error && (
          <p className="text-sm text-red-600 text-center border border-red-200 bg-red-50 rounded-md p-2">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
