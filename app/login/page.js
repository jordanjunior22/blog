'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import LoadingButton from '@/components/LoadingButton'; // Assuming you have a LoadingButton component
import { useUser } from "@/context/userContext";

export default function LoginPage() {
  const router = useRouter();
  const { user, setUser } = useUser();

  const [form, setForm] = useState({ email: '', password: '' });
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
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });


  if (res.ok) {
    const data = await res.json();
    setUser(data); // 💡 this triggers the avatar to show up
    router.push("/");    // navigate to homepage
  } 

    router.push('/'); // redirect
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="max-w-md mx-auto m-16 p-6 bg-gray-100 rounded-md shadow">
      <h1 className="text-lg mb-6 text-center">Welcome Back, Login</h1>

      <form onSubmit={handleSubmit} className="space-y-4 text-sm">
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

        <LoadingButton
          type="submit"
          loading={loading}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 cursor-pointer transition-colors duration-200"
        >
          {loading ? 'Logging in...' : 'Login'}
        </LoadingButton>

        {error && <p className="text-red-600 text-sm text-center">{error}</p>}
      </form>

      <p className="text-center text-sm mt-4 ">
        Forgot your password?{' '}
        <a href="/forgot-password" className="text-[#0a1526] underline">
          Reset it
        </a>
      </p>
      <p className="text-center text-sm mt-2">
        Don't have an account?{' '}
        <a href="/sign-up" className="text-[#0a1526] underline">
          Sign up
        </a>
      </p>
    </div>
  );
}
