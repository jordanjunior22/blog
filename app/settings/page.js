'use client';

import { useEffect, useState } from 'react';
import { UploadCloud, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/userContext';

export default function ReaderSettingsPage() {
  const router = useRouter();
  const { user } = useUser();

  const [form, setForm] = useState({
    name: '',
    avatarUrl: '',
    currentPassword: '',
    newPassword: '',
  });

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'reader') {
      router.push('/'); // Redirect if not a reader
      return;
    }

    setForm({
      id: user.id || '',
      name: user.name || '',
      avatarUrl: user.avatarUrl || '',
      currentPassword: '',
      newPassword: '',
    });
  }, [user]);

  console.log('User:', user);
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const data = new FormData();
    data.append('image', file);
    setUploading(true);
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data,
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Upload failed');
      setForm((prev) => ({ ...prev, avatarUrl: json.url }));
    } catch (err) {
      alert(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    if (!user?.id) {
      alert('User ID is missing');
      return;
    }

    const res = await fetch(`/api/user/${user.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, _id: user.id }),
    });

    const json = await res.json();
    if (json.success) alert('Profile updated');
    else alert(json.error || 'Update failed');
  };


  const handlePasswordReset = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/user/reset-password', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        _id: user._id,
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      }),
    });
    const json = await res.json();
    if (json.success) {
      alert('Password updated. You’ll be logged out for security.');

      // 🔒 Log the user out
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      // 🔁 Redirect to login
      router.push('/login');
    } else {
      alert(json.error || 'Reset failed');
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="mx-auto p-6 space-y-10 max-w-xl">
      <h1 className="text-3xl font-bold mb-4">Reader Settings</h1>

      <form onSubmit={handleProfileUpdate} className="space-y-4">
        {/* Avatar Upload */}
        <div>
          <label className="block font-medium mb-2">Avatar</label>
          <div className="relative w-28 h-28 group">
            <img
              src={form.avatarUrl || '/default.webp'}
              alt="avatar"
              className="w-28 h-28 rounded-full object-cover border shadow-sm group-hover:brightness-75 transition"
            />
            <label
              htmlFor="avatar-upload"
              className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              {uploading ? (
                <Loader2 className="animate-spin w-6 h-6" />
              ) : (
                <>
                  <UploadCloud className="w-6 h-6 mb-1" />
                  <span className="text-xs">Change</span>
                </>
              )}
            </label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
        </div>

        {/* Name */}
        <div>
          <label className="block font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save Profile
        </button>
      </form>

      {/* Password Section */}
      <form onSubmit={handlePasswordReset} className="space-y-4 border-t pt-6">
        <h2 className="text-xl font-semibold">Reset Password</h2>

        <div>
          <label className="block font-medium">Current Password</label>
          <input
            type="password"
            name="currentPassword"
            value={form.currentPassword}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium">New Password</label>
          <input
            type="password"
            name="newPassword"
            value={form.newPassword}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Reset Password
        </button>
      </form>
    </div>
  );
}
