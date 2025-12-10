'use client';

import { useState, useEffect } from 'react';
import { 
  UploadCloud, 
  Loader2, 
  Trash2, 
  PlusCircle,
  User,
  Mail,
  Lock,
  FileText,
  Link as LinkIcon,
  CheckCircle,
  AlertCircle,
  X,
  Save,
  Key,
  Shield
} from 'lucide-react';
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
    links: [],
  });

  const [uploading, setUploading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [resettingPassword, setResettingPassword] = useState(false);

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  useEffect(() => {
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

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      showNotification('error', 'Image size must be less than 5MB');
      return;
    }

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
      showNotification('success', 'Avatar uploaded successfully!');
    } catch (err) {
      showNotification('error', err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setSavingProfile(true);

    try {
      const res = await fetch(`/api/user/${user._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, _id: user._id }),
      });

      const json = await res.json();
      if (json.success) {
        showNotification('success', 'Profile updated successfully!');
      } else {
        throw new Error(json.error || 'Update failed');
      }
    } catch (err) {
      showNotification('error', err.message);
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();

    if (!form.currentPassword || !form.newPassword) {
      showNotification('error', 'Please fill in all password fields');
      return;
    }

    if (form.newPassword.length < 6) {
      showNotification('error', 'New password must be at least 6 characters');
      return;
    }

    setResettingPassword(true);

    try {
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
        showNotification('success', 'Password updated! Redirecting to login...');
        setTimeout(() => {
          router.push('/logout');
        }, 2000);
      } else {
        throw new Error(json.error || 'Reset failed');
      }
    } catch (err) {
      showNotification('error', err.message);
    } finally {
      setResettingPassword(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex justify-center items-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-purple-600" />
          <p className="text-gray-600 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-2 sm:p-4 md:p-6">
      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-2 right-2 sm:top-4 sm:right-4 md:top-6 md:right-6 z-50 flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl shadow-2xl animate-slide-in max-w-[calc(100vw-1rem)] sm:max-w-md ${
          notification.type === 'success' ? 'bg-green-500' : 
          notification.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
        } text-white`}>
          {notification.type === 'success' && <CheckCircle className="w-4 h-4 flex-shrink-0" />}
          {notification.type === 'error' && <AlertCircle className="w-4 h-4 flex-shrink-0" />}
          <span className="font-medium text-xs sm:text-sm flex-1 min-w-0 truncate">{notification.message}</span>
          <button 
            onClick={() => setNotification(null)}
            className="ml-1 hover:bg-white/20 rounded-lg p-1 transition-colors flex-shrink-0"
          >
            <X className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
        </div>
      )}

      {/* Animations */}
      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>

      <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 shadow-lg">
            <User className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
              Profile Settings
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">Manage your account information</p>
          </div>
        </div>

        {/* Profile Info Card */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-100 rounded-lg">
              <User className="w-5 h-5 text-purple-600" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Profile Information</h2>
          </div>

          <form onSubmit={handleProfileUpdate} className="space-y-6">
            {/* Avatar Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Profile Picture</label>
              <div className="flex items-center gap-6">
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 group">
                  <img
                    src={form.avatarUrl || '/default.webp'}
                    alt="avatar"
                    className="w-full h-full rounded-full object-cover border-4 border-gray-200 shadow-md group-hover:brightness-75 transition"
                  />
                  <label
                    htmlFor="avatar-upload"
                    className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    {uploading ? (
                      <Loader2 className="animate-spin w-6 h-6" />
                    ) : (
                      <>
                        <UploadCloud className="w-6 h-6 mb-1" />
                        <span className="text-xs font-medium">Change</span>
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
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">Upload a new profile picture</p>
                  <p className="text-xs text-gray-500">JPG, PNG or GIF. Max size 5MB</p>
                </div>
              </div>
            </div>

            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all text-sm sm:text-base"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all text-sm sm:text-base"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            {/* Bio Title */}
            <div>
              <label htmlFor="bioTitle" className="block text-sm font-semibold text-gray-700 mb-2">
                Bio Title
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="bioTitle"
                  type="text"
                  name="bioTitle"
                  value={form.bioTitle}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all text-sm sm:text-base"
                  placeholder="e.g. Software Developer, Designer"
                />
              </div>
            </div>

            {/* Bio */}
            <div>
              <label htmlFor="bio" className="block text-sm font-semibold text-gray-700 mb-2">
                Biography
              </label>
              <textarea
                id="bio"
                name="bio"
                value={form.bio}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all resize-none text-sm sm:text-base"
                placeholder="Tell us about yourself..."
              />
              <p className="mt-1 text-xs text-gray-500">{form.bio.length} characters</p>
            </div>

            {/* Social Links */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-semibold text-gray-700">
                  Social Links
                </label>
                <button
                  type="button"
                  onClick={handleAddLink}
                  className="flex items-center gap-1.5 text-sm text-purple-600 hover:text-purple-700 font-medium transition-colors"
                >
                  <PlusCircle className="w-4 h-4" />
                  Add Link
                </button>
              </div>

              <div className="space-y-3">
                {form.links.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                    <LinkIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">No social links added yet</p>
                    <button
                      type="button"
                      onClick={handleAddLink}
                      className="mt-2 text-sm text-purple-600 hover:text-purple-700 font-medium"
                    >
                      Add your first link
                    </button>
                  </div>
                ) : (
                  form.links.map((link, index) => (
                    <div key={index} className="flex gap-2 items-start p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex-1 space-y-2">
                        <input
                          type="text"
                          placeholder="Label (e.g. Twitter, LinkedIn)"
                          value={link.label}
                          onChange={(e) => handleLinkChange(index, 'label', e.target.value)}
                          className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all text-sm"
                        />
                        <input
                          type="url"
                          placeholder="https://example.com"
                          value={link.url}
                          onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
                          className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all text-sm"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveLink(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                        title="Remove link"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                type="submit"
                disabled={savingProfile}
                className="flex-1 sm:flex-none px-6 py-2.5 sm:py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg sm:rounded-xl font-medium transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                {savingProfile ? (
                  <>
                    <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 sm:w-5 sm:h-5" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Password Reset Card */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-red-100 rounded-lg">
              <Shield className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Security</h2>
              <p className="text-xs sm:text-sm text-gray-600">Update your password</p>
            </div>
          </div>

          <form onSubmit={handlePasswordReset} className="space-y-5">
            {/* Current Password */}
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                Current Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="currentPassword"
                  type="password"
                  name="currentPassword"
                  value={form.currentPassword}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-red-500 focus:ring-4 focus:ring-red-100 outline-none transition-all text-sm sm:text-base"
                  placeholder="Enter current password"
                />
              </div>
            </div>

            {/* New Password */}
            <div>
              <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="newPassword"
                  type="password"
                  name="newPassword"
                  value={form.newPassword}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-red-500 focus:ring-4 focus:ring-red-100 outline-none transition-all text-sm sm:text-base"
                  placeholder="Enter new password (min. 6 characters)"
                />
              </div>
            </div>

            {/* Warning Info */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-amber-900">Important</p>
                  <p className="text-xs text-amber-800 mt-1">
                    Changing your password will log you out. You'll need to sign in again with your new password.
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                type="submit"
                disabled={resettingPassword}
                className="flex-1 sm:flex-none px-6 py-2.5 sm:py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg sm:rounded-xl font-medium transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                {resettingPassword ? (
                  <>
                    <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Key className="w-4 h-4 sm:w-5 sm:h-5" />
                    Update Password
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}