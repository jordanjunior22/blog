"use client"
import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Loader2, Shield } from 'lucide-react';

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/me', {
          credentials: 'include',
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
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
      <div className="fixed inset-0 bg-gradient-to-br from-purple-50 via-white to-blue-50 flex flex-col justify-center items-center z-50">
        {/* Animated Logo/Icon */}
        <div className="relative mb-8">
          {/* Outer spinning ring */}
          <div className="absolute inset-0 w-24 h-24 border-4 border-purple-200 rounded-full animate-ping opacity-75" />
          
          {/* Middle rotating ring */}
          <div className="absolute inset-0 w-24 h-24 border-4 border-t-purple-600 border-r-blue-600 border-b-transparent border-l-transparent rounded-full animate-spin" />
          
          {/* Inner icon container */}
          <div className="relative w-24 h-24 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center shadow-2xl">
            <Shield className="w-12 h-12 text-white animate-pulse" />
          </div>
        </div>

        {/* Loading text with dots animation */}
        <div className="flex flex-col items-center space-y-3">
          <h2 className="text-2xl font-bold text-gray-800" style={{ fontFamily: 'var(--font-playfair)' }}>
            Loading
            <span className="inline-flex ml-1">
              <span className="animate-bounce" style={{ animationDelay: '0ms' }}>.</span>
              <span className="animate-bounce" style={{ animationDelay: '150ms' }}>.</span>
              <span className="animate-bounce" style={{ animationDelay: '300ms' }}>.</span>
            </span>
          </h2>
          <p className="text-sm text-gray-600">Preparing your experience</p>
        </div>

        {/* Progress bar */}
        <div className="mt-8 w-64 h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-purple-600 to-blue-600 rounded-full animate-pulse" 
               style={{ 
                 width: '70%',
                 animation: 'slide 1.5s ease-in-out infinite'
               }} 
          />
        </div>

        {/* CSS for custom animation */}
        <style jsx>{`
          @keyframes slide {
            0%, 100% {
              transform: translateX(-100%);
            }
            50% {
              transform: translateX(150%);
            }
          }
        `}</style>
      </div>
    );
  }

  if (!user && pathname !== '/login' && pathname.startsWith('/admin')) {
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