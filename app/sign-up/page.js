'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import LoadingButton from '@/components/LoadingButton';

export default function SignUpPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: '',
    password: '',
    name: '',
    role: 'reader',  // fixed role
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Sign up failed');

      // On success, redirect to login or dashboard
      router.push('/login');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto m-16 p-6 bg-gray-100 rounded-md shadow text-black">
      <h1 className="text-2xl font-bold mb-6 text-center">Sign Up</h1>

      <form onSubmit={handleSubmit} className="space-y-4 text-sm">
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Full Name"
          required
          className="w-full px-4 py-2 border rounded-md"
        />

        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          required
          className="w-full px-4 py-2 border rounded-md"
        />

        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          required
          className="w-full px-4 py-2 border rounded-md"
        />

        {/* Role is fixed and hidden from user */}
        <input type="hidden" name="role" value="reader" />

        <LoadingButton
          type="submit"
          loading={loading}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 cursor-pointer transition-colors duration-200"
        >
          {loading ? 'Signing up...' : 'Sign Up'}
        </LoadingButton>

        {error && <p className="text-red-600 text-sm text-center">{error}</p>}
      </form>

      <p className="text-center text-sm mt-4">
        Already have an account?{' '}
        <a href="/login" className="text-blue-600 underline">
          Log in
        </a>
      </p>
    </div>
  );
}
