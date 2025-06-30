'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import LoadingButton from '@/components/LoadingButton'; // Assuming you have a LoadingButton component
import { useUser } from "@/context/userContext";

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useUser(); // We only need setUser here

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

      // Check if the response is OK (status 200-299)
      if (res.ok) {
        const data = await res.json();
        // IMPORTANT: Ensure you are setting the *actual* user object
        // If your API returns { success: true, user: {...} }, then use data.user
        // If your API returns {...} directly as the user, then use data
        setUser(data.user); // <--- ASSUMING your API returns { user: {...} }
        router.push("/"); // Navigate to homepage ONLY on successful login
      } else {
        // Handle API errors (e.g., 401 Unauthorized, 400 Bad Request)
        const errorData = await res.json();
        setError(errorData.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      // Handle network errors or other unexpected issues
      console.error('Login error:', err);
      setError('An unexpected error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto m-16 p-6 bg-gray-100 text-black rounded-md shadow">
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