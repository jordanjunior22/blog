'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  User,
  Mail,
  Lock,
  Shield,
  ArrowLeft,
  Loader2,
  CheckCircle,
  AlertCircle,
  X,
  UserPlus
} from 'lucide-react';

export default function CreateUserPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'reader',
  });

  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [errors, setErrors] = useState({});

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!form.password) {
      newErrors.password = 'Password is required';
    } else if (form.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showNotification('error', 'Please fix the errors in the form');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');

      showNotification('success', 'User created successfully!');
      setTimeout(() => {
        router.push('/admin/users');
      }, 1500);
    } catch (err) {
      showNotification('error', err.message);
    } finally {
      setLoading(false);
    }
  };

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
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
        .animate-fade-in {
          animation: fade-in 0.4s ease-out;
        }
      `}</style>

      <div className="max-w-2xl mx-auto space-y-4 sm:space-y-6">
        {/* Back Button */}
        <button
          onClick={() => router.push('/admin/users')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm sm:text-base font-medium">Back to Users</span>
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 sm:gap-4 animate-fade-in">
          <div className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 shadow-lg">
            <UserPlus className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
              Create New User
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">Add a new user to the system</p>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 md:p-8 animate-fade-in">
          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            {/* Name Input */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  className={`w-full pl-9 sm:pl-10 pr-3 py-2.5 sm:py-3 border-2 rounded-lg sm:rounded-xl focus:ring-4 outline-none transition-all text-sm sm:text-base ${
                    errors.name 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-100' 
                      : 'border-gray-200 focus:border-purple-500 focus:ring-purple-100'
                  }`}
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-xs sm:text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="user@example.com"
                  className={`w-full pl-9 sm:pl-10 pr-3 py-2.5 sm:py-3 border-2 rounded-lg sm:rounded-xl focus:ring-4 outline-none transition-all text-sm sm:text-base ${
                    errors.email 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-100' 
                      : 'border-gray-200 focus:border-purple-500 focus:ring-purple-100'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs sm:text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Minimum 6 characters"
                  className={`w-full pl-9 sm:pl-10 pr-3 py-2.5 sm:py-3 border-2 rounded-lg sm:rounded-xl focus:ring-4 outline-none transition-all text-sm sm:text-base ${
                    errors.password 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-100' 
                      : 'border-gray-200 focus:border-purple-500 focus:ring-purple-100'
                  }`}
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-xs sm:text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Role Select */}
            <div>
              <label htmlFor="role" className="block text-sm font-semibold text-gray-700 mb-2">
                User Role <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <select
                  id="role"
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full pl-9 sm:pl-10 pr-8 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all appearance-none cursor-pointer bg-white text-sm sm:text-base"
                >
                  <option value="reader">Reader - Can view content</option>
                  <option value="admin">Admin - Full access</option>
                </select>
              </div>
              <p className="mt-1 text-xs sm:text-sm text-gray-500">
                {form.role === 'admin' ? '⚠️ This user will have full administrative access' : 'ℹ️ This user will have read-only access'}
              </p>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 pt-5 sm:pt-6">
              {/* Action Buttons */}
              <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4">
                <button
                  type="button"
                  onClick={() => router.push('/admin/users')}
                  disabled={loading}
                  className="flex-1 px-4 py-2.5 sm:py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg sm:rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2.5 sm:py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg sm:rounded-xl font-medium transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                      Creating User...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4 sm:w-5 sm:h-5" />
                      Create User
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Info Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg sm:rounded-xl p-4 sm:p-6 animate-fade-in">
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <AlertCircle className="w-4 h-4 text-blue-600" />
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-blue-900 mb-1">Important Information</h3>
              <ul className="text-xs sm:text-sm text-blue-800 space-y-1">
                <li>• Users will receive login credentials via email</li>
                <li>• Admin users have full access to all features</li>
                <li>• Reader users can only view content</li>
                <li>• Passwords must be at least 6 characters long</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}