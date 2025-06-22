'use client';

import { useState, useEffect } from 'react';
import { UploadCloud, Loader2, Trash2, PlusCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/userContext';

export default function ProfilePage() {
  const router = useRouter();
  const { user } = useUser();

  const [form, setForm] = useState({
    name: '',
    email: '',
    avatarUrl: '',
    currentPassword: '',
    newPassword: '',
    bio: '',
    bioTitle: '',
    links: [], // New field
  });

  const [uploading, setUploading] = useState(false);

useEffect(() => {
  console.log('User object from context:', user); // Debugging line

  if (!user) return;

  setForm((prev) => ({
    ...prev,
    name: user.name || '',
    email: user.email || '',
    avatarUrl: user.avatarUrl || '',
    bio: user.bio || '',
    bioTitle: user.bioTitle || '',
    links: user.links || [],
  }));
}, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLinkChange = (index, field, value) => {
    const newLinks = [...form.links];
    newLinks[index][field] = value;
    setForm({ ...form, links: newLinks });
  };

  const handleAddLink = () => {
    setForm((prev) => ({
      ...prev,
      links: [...prev.links, { label: '', url: '' }],
    }));
  };

  const handleRemoveLink = (index) => {
    const newLinks = [...form.links];
    newLinks.splice(index, 1);
    setForm({ ...form, links: newLinks });
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
    const res = await fetch(`/api/user/${user._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, _id: user._id }),
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
      alert('Password updated');
      router.push('/logout');
    } else alert(json.error || 'Reset failed');
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="mx-auto p-6 space-y-10 max-w-3xl">
      <h1 className="text-3xl font-bold mb-4">Profile Settings</h1>

      <form onSubmit={handleProfileUpdate} className="space-y-4">
        <h2 className="text-xl font-semibold">Profile Info</h2>

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

        <div>
          <label className="block font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Bio Title</label>
          <input
            type="text"
            name="bioTitle"
            value={form.bioTitle}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Bio</label>
          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            rows={4}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Links Section */}
        <div>
          <label className="block font-medium mb-2">Social Links</label>
          {form.links.map((link, index) => (
            <div key={index} className="flex gap-2 items-center mb-2">
              <input
                type="text"
                placeholder="Label (e.g. Twitter)"
                value={link.label}
                onChange={(e) => handleLinkChange(index, 'label', e.target.value)}
                className="flex-1 border px-3 py-2 rounded"
              />
              <input
                type="url"
                placeholder="https://"
                value={link.url}
                onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
                className="flex-1 border px-3 py-2 rounded"
              />
              <button
                type="button"
                onClick={() => handleRemoveLink(index)}
                className="text-red-500 hover:text-red-700"
                title="Remove link"
              >
                <Trash2 />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddLink}
            className="flex items-center gap-2 text-sm text-blue-600 mt-2 hover:underline"
          >
            <PlusCircle size={18} />
            Add Link
          </button>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save Changes
        </button>
      </form>

      {/* Password Reset */}
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
