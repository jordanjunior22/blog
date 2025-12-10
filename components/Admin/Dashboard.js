'use client';

import { useEffect, useState } from 'react';
import { 
  Users, 
  FileText, 
  MessageSquare, 
  FolderOpen, 
  TrendingUp,
  Activity,
  BarChart3,
  Eye
} from 'lucide-react';

// Icon mapping for different stat types
const iconMap = {
  users: Users,
  posts: FileText,
  comments: MessageSquare,
  categories: FolderOpen,
  views: Eye,
  engagement: Activity,
};

// Color schemes for different cards
const colorSchemes = [
  { bg: 'from-blue-500 to-blue-600', text: 'text-blue-600', lightBg: 'bg-blue-50' },
  { bg: 'from-purple-500 to-purple-600', text: 'text-purple-600', lightBg: 'bg-purple-50' },
  { bg: 'from-green-500 to-green-600', text: 'text-green-600', lightBg: 'bg-green-50' },
  { bg: 'from-orange-500 to-orange-600', text: 'text-orange-600', lightBg: 'bg-orange-50' },
  { bg: 'from-pink-500 to-pink-600', text: 'text-pink-600', lightBg: 'bg-pink-50' },
  { bg: 'from-indigo-500 to-indigo-600', text: 'text-indigo-600', lightBg: 'bg-indigo-50' },
];

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

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl max-w-md">
          <h3 className="font-semibold mb-1">Error Loading Dashboard</h3>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-playfair)' }}>
            Dashboard Overview
          </h2>
          <p className="text-gray-600 mt-1">Monitor your platform's key metrics</p>
        </div>
        <div className="hidden md:flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg shadow-lg">
          <BarChart3 className="w-5 h-5" />
          <span className="font-medium">Analytics</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats
          ? Object.entries(stats).map(([label, count], idx) => {
              const Icon = iconMap[label.toLowerCase()] || TrendingUp;
              const colorScheme = colorSchemes[idx % colorSchemes.length];
              
              return (
                <div
                  key={label}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:border-gray-200 transform hover:-translate-y-1"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`${colorScheme.lightBg} p-3 rounded-xl`}>
                      <Icon className={`w-6 h-6 ${colorScheme.text}`} />
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                        Total
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium text-gray-600 capitalize">
                      {label}
                    </h3>
                    <p className="text-4xl font-bold text-gray-900">
                      {count.toLocaleString()}
                    </p>
                  </div>
                  
                  {/* Progress bar (decorative) */}
                  <div className="mt-4 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${colorScheme.bg} rounded-full`}
                      style={{ width: '75%' }}
                    />
                  </div>
                </div>
              );
            })
          : // Skeleton loaders
            Array(6)
              .fill(0)
              .map((_, idx) => {
                const colorScheme = colorSchemes[idx % colorSchemes.length];
                
                return (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 animate-pulse"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={`${colorScheme.lightBg} p-3 rounded-xl w-12 h-12`}>
                        <div className="w-6 h-6 bg-gray-300 rounded" />
                      </div>
                      <div className="h-4 w-12 bg-gray-200 rounded" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-24" />
                      <div className="h-10 bg-gray-300 rounded w-20" />
                    </div>
                    
                    <div className="mt-4 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gray-200 rounded-full w-3/4" />
                    </div>
                  </div>
                );
              })}
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-600 rounded-2xl shadow-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold mb-2">Ready to take action?</h3>
            <p className="text-purple-100">Manage your content and engage with your community</p>
          </div>
          <div className="hidden md:block">
            <Activity className="w-24 h-24 text-white opacity-20" />
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl p-4 text-left transition-all duration-200 hover:scale-105">
            <FileText className="w-6 h-6 mb-2" />
            <span className="font-medium text-sm">New Post</span>
          </button>
          <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl p-4 text-left transition-all duration-200 hover:scale-105">
            <Users className="w-6 h-6 mb-2" />
            <span className="font-medium text-sm">Users</span>
          </button>
          <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl p-4 text-left transition-all duration-200 hover:scale-105">
            <MessageSquare className="w-6 h-6 mb-2" />
            <span className="font-medium text-sm">Comments</span>
          </button>
          <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl p-4 text-left transition-all duration-200 hover:scale-105">
            <BarChart3 className="w-6 h-6 mb-2" />
            <span className="font-medium text-sm">Reports</span>
          </button>
        </div>
      </div>
    </div>
  );
}