"use client"
import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(undefined); // undefined means "not loaded yet"
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/me', {
          credentials: 'include',
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user); // user object or null
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, []);

useEffect(() => {
  if (!loading) {
    if (!user && pathname !== '/login' && pathname.startsWith('/admin')) {
      router.push('/login');
    } else if (user && pathname === '/login') {
      router.push('/');
    }
  }
}, [loading, user, pathname, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-screen">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Do NOT redirect here, just render null or children
  if (!user && pathname !== '/login' && pathname.startsWith('/admin')) {
    // Optionally show nothing while redirect happens, or a message
    return null;
  }

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
