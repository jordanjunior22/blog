'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  Home,
  FileText,
  Tag,
  Folder,
  MessageCircle,
  Users,
  Menu as MenuIcon,
  X,
  LogOut,
  Settings,
  ChevronRight,
  LayoutDashboard
} from 'lucide-react';
import LoadingButton from '../LoadingButton';

export default function Sidebar() {
  const [user, setUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (!res.ok) throw new Error('Not authenticated');
        const data = await res.json();
        setUser(data.user);
      } catch {
        router.push('/login');
      }
    };
    fetchUser();
  }, [router]);

  const logout = async () => {
    setLoading(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch (err) {
      console.error('Logout failed', err);
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    { href: '/admin', label: 'Dashboard', icon: Home },
    { href: '/admin/posts', label: 'Posts', icon: FileText },
    { href: '/admin/categories', label: 'Categories', icon: Folder },
    { href: '/admin/subscribers', label: 'Subscribers', icon: Tag },
    { href: '/admin/comments', label: 'Comments', icon: MessageCircle },
    { href: '/admin/users', label: 'Users', icon: Users },
  ];

  return (
    <>
      {/* Mobile toggle button */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden p-3 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={22} /> : <MenuIcon size={22} />}
      </button>

      <aside
        className={`
          fixed top-0 left-0 z-40 h-full w-72 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white flex flex-col shadow-2xl
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:static md:flex
        `}
      >
        {/* Header Logo/Brand */}
        <div className="p-6 border-b border-gray-700/50 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
            <LayoutDashboard className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Admin Panel</h1>
            <p className="text-xs text-gray-400">Management System</p>
          </div>
        </div>

        {/* Profile Widget */}
        {user && (
          <div className="p-6 border-b border-gray-700/50 flex-shrink-0">
            <div className="flex items-center gap-4 mb-4">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt="User avatar"
                  className="w-14 h-14 rounded-xl object-cover border-2 border-purple-500 shadow-lg"
                />
              ) : (
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-xl font-bold uppercase shadow-lg">
                  {user.name ? user.name.charAt(0) : 'U'}
                </div>
              )}

              <div className="flex-1 min-w-0">
                <h2 className="text-base font-semibold truncate">{user.name}</h2>
                <p className="text-xs text-gray-400 truncate">{user.email}</p>
                <span className="inline-block mt-1 px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full">
                  {user.role || 'Admin'}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => router.push('/admin/profile')}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-colors text-sm"
              >
                <Settings size={16} />
                <span>Settings</span>
              </button>
              <button
                onClick={logout}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white rounded-lg transition-colors text-sm disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    <span>...</span>
                  </>
                ) : (
                  <>
                    <LogOut size={16} />
                    <span>Logout</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-3">
            Navigation
          </p>
          {menuItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            
            return (
              <button
                key={href}
                onClick={() => {
                  router.push(href);
                  setIsOpen(false); // Close sidebar on mobile after navigation
                }}
                className={`
                  group w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                  ${isActive 
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg' 
                    : 'hover:bg-gray-700/50 text-gray-300 hover:text-white'
                  }
                `}
              >
                <Icon size={20} className={isActive ? '' : 'group-hover:scale-110 transition-transform'} />
                <span className="flex-1 text-left font-medium">{label}</span>
                {isActive && <ChevronRight size={18} />}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700/50 text-center">
          <p className="text-xs text-gray-500">
            © 2025 Admin Panel
          </p>
          <p className="text-xs text-gray-600 mt-1">
            Version 1.0.0
          </p>
        </div>
      </aside>

      {/* Overlay when sidebar is open on mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}