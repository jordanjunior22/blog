'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Home,
  FileText,
  Tag,
  Folder,
  MessageCircle,
  Users,
  Menu as MenuIcon,
  X,
  Loader2
} from 'lucide-react';
import LoadingButton from '../LoadingButton';

export default function Sidebar() {
  const [user, setUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
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
    // { href: '/admin/tags', label: 'Tags', icon: Tag },
    { href: '/admin/subscribers', label: 'Subscribers', icon: Tag },

    { href: '/admin/comments', label: 'Comments', icon: MessageCircle },
    { href: '/admin/users', label: 'Users', icon: Users },
    // Add more menu items here if needed
  ];

  return (
    <>
      {/* Mobile toggle button */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden p-2 rounded bg-gray-900 text-white shadow"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={24} /> : <MenuIcon size={24} />}
      </button>

      <aside
        className={`flex flex-col md:h-screen
          fixed top-0 left-0 z-40 h-full w-64 bg-gray-900 text-md text-white flex flex-col p-6 shadow-lg
          transform transition-transform duration-300
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:static md:flex
        `}
      >
        {/* Profile Widget */}
        {user && (
          <div className="mb-6 flex flex-col items-center border-b border-gray-700 pb-6 flex-shrink-0">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt="User avatar"
                className="w-20 h-20 rounded-full object-cover border shadow-md transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center text-white text-3xl font-semibold uppercase shadow-md">
                {user.name ? user.name.charAt(0) : 'U'}
              </div>
            )}

            <div className="mt-4 text-center">
              <h2 className="text-xl font-semibold truncate">{user.name}</h2>
              <p className="text-sm text-gray-400 truncate">{user.email}</p>
            </div>

            <div className="mt-6 flex flex-col gap-2 w-full">
              <LoadingButton
                onClick={logout}
                loading={loading}
                className="bg-red-600 hover:bg-red-700 text-sm cursor-pointer"
              >
                Logout
              </LoadingButton>
              <button
                onClick={() => router.push('/admin/profile')}
                className="text-gray-400 hover:text-white underline text-center text-sm cursor-pointer"
              >
                Profile Settings
              </button>
            </div>
          </div>
        )}

        {/* Scrollable Menu */}
        <nav className="flex-1 overflow-y-auto space-y-3 text-sm">
          {menuItems.map(({ href, label, icon: Icon }) => (
            <MenuItem key={href} href={href} label={label} Icon={Icon} />
          ))}
        </nav>
      </aside>

      {/* Overlay when sidebar is open on mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}

function MenuItem({ href, label, Icon }) {
  const router = useRouter();
  const isActive = router.pathname === href;

  return (
    <button
      onClick={() => router.push(href)}
      className={`
        flex items-center cursor-pointer gap-3 px-4 py-3 rounded-lg hover:bg-gray-700 transition w-full
        ${isActive ? 'bg-gray-800 font-semibold' : 'font-normal'}
      `}
    >
      <Icon size={20} />
      {label}
    </button>
  );
}
