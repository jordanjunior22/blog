'use client';

import { useEffect, useState } from 'react';

export default function AdminHome() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/admin/stats');
        const data = await res.json();

        if (!res.ok) throw new Error(data.error);
        setStats(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchStats();
  }, []);

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 min-h-[200px]">
        {stats
          ? Object.entries(stats).map(([label, count]) => (
              <div
                key={label}
                className="bg-white rounded-xl shadow p-4 flex flex-col justify-center"
              >
                <h3 className="text-xl font-semibold capitalize">{label}</h3>
                <p className="text-3xl mt-2">{count}</p>
              </div>
            ))
          : // Skeleton loaders: multiple consistent cards
            Array(6)
              .fill(0)
              .map((_, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl shadow p-4 animate-pulse flex flex-col justify-center h-28"
                >
                  <div className="h-6 bg-gray-300 rounded mb-2 w-3/4"></div>
                  <div className="h-10 bg-gray-300 rounded w-1/2"></div>
                </div>
              ))}
      </div>
    </div>
  );
}
