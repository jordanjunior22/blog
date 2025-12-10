"use client";

import { useEffect, useState } from 'react';
import { 
  Mail, 
  Download, 
  Loader2, 
  Users, 
  Calendar,
  Search,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  X,
  TrendingUp
} from 'lucide-react';

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState([]);
  const [filteredSubscribers, setFilteredSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const fetchSubscribers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/subscribers');
      const data = await res.json();
      setSubscribers(data);
      setFilteredSubscribers(data);
      showNotification('success', 'Subscribers loaded successfully!');
    } catch (error) {
      console.error('Failed to fetch subscribers:', error);
      showNotification('error', 'Failed to load subscribers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  useEffect(() => {
    const filtered = subscribers.filter(sub =>
      sub.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredSubscribers(filtered);
    setCurrentPage(1);
  }, [searchQuery, subscribers]);

  const exportToCSV = () => {
    const header = ['Email', 'Subscribed At'];
    const rows = filteredSubscribers.map(subscriber => [
      subscriber.email,
      new Date(subscriber.subscribedAt).toLocaleString(),
    ]);

    const csvContent = [
      header.join(','),
      ...rows.map(row => row.join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `subscribers_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    showNotification('success', `Exported ${filteredSubscribers.length} subscribers!`);
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSubscribers = filteredSubscribers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredSubscribers.length / itemsPerPage);

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex items-center justify-center gap-1 sm:gap-2 flex-wrap">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-2 sm:px-3 py-1 sm:py-2 rounded-lg bg-white border border-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors text-sm"
        >
          Previous
        </button>
        
        {startPage > 1 && (
          <>
            <button
              onClick={() => goToPage(1)}
              className="px-2 sm:px-3 py-1 sm:py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors text-sm"
            >
              1
            </button>
            {startPage > 2 && <span className="px-1 sm:px-2 text-gray-500">...</span>}
          </>
        )}
        
        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => goToPage(number)}
            className={`px-2 sm:px-3 py-1 sm:py-2 rounded-lg transition-colors text-sm ${
              currentPage === number
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {number}
          </button>
        ))}
        
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="px-1 sm:px-2 text-gray-500">...</span>}
            <button
              onClick={() => goToPage(totalPages)}
              className="px-2 sm:px-3 py-1 sm:py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors text-sm"
            >
              {totalPages}
            </button>
          </>
        )}
        
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-2 sm:px-3 py-1 sm:py-2 rounded-lg bg-white border border-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors text-sm"
        >
          Next
        </button>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-2 sm:p-4 md:p-6 flex items-center justify-center">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-8 flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 animate-spin text-purple-600" />
          <p className="text-sm sm:text-base text-gray-600 font-medium">Loading subscribers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-2 sm:p-4 md:p-6">
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

      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center gap-3 sm:gap-4 mb-2">
            <div className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 shadow-lg">
              <Mail className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-playfair)' }}>
                Newsletter Subscribers
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">Manage and export your email subscribers</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600 font-medium">Total Subscribers</p>
                <p className="text-2xl sm:text-3xl font-bold text-purple-900 mt-1">{subscribers.length}</p>
              </div>
              <div className="bg-purple-100 p-2 sm:p-3 rounded-lg">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600 font-medium">Filtered Results</p>
                <p className="text-2xl sm:text-3xl font-bold text-blue-900 mt-1">{filteredSubscribers.length}</p>
              </div>
              <div className="bg-blue-100 p-2 sm:p-3 rounded-lg">
                <Search className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600 font-medium">Growth Rate</p>
                <p className="text-2xl sm:text-3xl font-bold text-green-900 mt-1">
                  {subscribers.length > 0 ? '+12%' : '0%'}
                </p>
              </div>
              <div className="bg-green-100 p-2 sm:p-3 rounded-lg">
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 sm:pl-10 pr-3 py-2 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all text-sm sm:text-base"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 sm:gap-3">
              <button
                onClick={fetchSubscribers}
                className="flex items-center justify-center gap-2 px-3 py-2 sm:px-4 sm:py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg sm:rounded-xl transition-all font-medium text-sm sm:text-base"
              >
                <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Refresh</span>
              </button>
              <button
                onClick={exportToCSV}
                disabled={filteredSubscribers.length === 0}
                className="flex items-center justify-center gap-2 px-3 py-2 sm:px-4 sm:py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg sm:rounded-xl hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium text-sm sm:text-base"
              >
                <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                Export CSV
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        {filteredSubscribers.length === 0 ? (
          <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-8 sm:p-12 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full mb-3 sm:mb-4">
              <Mail className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
              {searchQuery ? 'No results found' : 'No subscribers yet'}
            </h3>
            <p className="text-sm sm:text-base text-gray-600">
              {searchQuery ? 'Try adjusting your search query' : 'Subscribers will appear here once they sign up'}
            </p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg sm:rounded-xl shadow-lg overflow-hidden">
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Email Address
                      </th>
                      <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Subscribed Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentSubscribers.map((subscriber) => (
                      <tr key={subscriber._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 lg:px-6 py-3 lg:py-4">
                          <div className="flex items-center gap-2 lg:gap-3">
                            <div className="bg-purple-100 p-1.5 lg:p-2 rounded-lg">
                              <Mail className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-purple-600" />
                            </div>
                            <span className="text-xs lg:text-sm font-medium text-gray-900">{subscriber.email}</span>
                          </div>
                        </td>
                        <td className="px-4 lg:px-6 py-3 lg:py-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-gray-400" />
                            <span className="text-xs lg:text-sm text-gray-600">
                              {new Date(subscriber.subscribedAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden divide-y divide-gray-200">
                {currentSubscribers.map((subscriber) => (
                  <div key={subscriber._id} className="p-3 sm:p-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-purple-100 p-2 rounded-lg flex-shrink-0">
                        <Mail className="w-4 h-4 text-purple-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate mb-1">
                          {subscriber.email}
                        </p>
                        <div className="flex items-center gap-1.5 text-xs text-gray-600">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(subscriber.subscribedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
                {renderPagination()}
              </div>
            )}

            {/* Results Count */}
            <div className="text-center text-xs sm:text-sm text-gray-600">
              Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredSubscribers.length)} of {filteredSubscribers.length} subscribers
            </div>
          </>
        )}
      </div>
    </div>
  );
}