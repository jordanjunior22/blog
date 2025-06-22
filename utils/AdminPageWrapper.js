import { useUser } from '@/context/userContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminPageWrapper({ children }) {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user || user.role !== 'admin') {
        router.push('/login');
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-screen">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return <p>Access denied</p>;
  }

  return children;
}
