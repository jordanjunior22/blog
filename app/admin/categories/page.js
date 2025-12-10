'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  PlusCircle, 
  Edit2, 
  Trash2, 
  FolderOpen,
  CheckCircle,
  XCircle,
  AlertCircle,
  X,
  Tag,
  Layers
} from 'lucide-react';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [notification, setNotification] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const router = useRouter();

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch('/api/categories');
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to load');
        setCategories(Array.isArray(data) ? data : data.categories || []);
      } catch (err) {
        setError(err.message);
        showNotification('error', err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Delete failed');
      }
      
      setTimeout(() => {
        setCategories(categories.filter((c) => c._id !== id));
        setDeletingId(null);
        setDeleteConfirm(null);
        showNotification('success', 'Category deleted successfully!');
      }, 300);
    } catch (err) {
      setDeletingId(null);
      setDeleteConfirm(null);
      showNotification('error', err.message);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCategories = categories.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(categories.length / itemsPerPage);

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
      <div className="p-2 sm:p-4 md:p-6 space-y-3 sm:space-y-4">
        <div className="h-6 sm:h-8 bg-gray-200 rounded w-36 sm:w-48 animate-pulse" />
        <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 space-y-3 sm:space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-2 sm:gap-4 animate-pulse">
              <div className="h-10 sm:h-12 bg-gray-200 rounded flex-1" />
              <div className="h-10 sm:h-12 bg-gray-200 rounded w-24 sm:w-32" />
              <div className="h-10 sm:h-12 bg-gray-200 rounded w-20 sm:w-24" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-2 sm:p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-3 sm:px-6 sm:py-4 rounded-xl">
          <h3 className="font-semibold mb-1 text-sm sm:text-base">Error Loading Categories</h3>
          <p className="text-xs sm:text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-2 sm:p-4 md:p-6 space-y-3 sm:space-y-4 md:space-y-6">
      {notification && (
        <div className={`fixed top-2 right-2 sm:top-4 sm:right-4 md:top-6 md:right-6 z-50 flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl shadow-2xl animate-slide-in max-w-[calc(100vw-1rem)] sm:max-w-md ${
          notification.type === 'success' ? 'bg-green-500' : 
          notification.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
        } text-white`}>
          {notification.type === 'success' && <CheckCircle className="w-4 h-4 flex-shrink-0" />}
          {notification.type === 'error' && <XCircle className="w-4 h-4 flex-shrink-0" />}
          {notification.type === 'info' && <AlertCircle className="w-4 h-4 flex-shrink-0" />}
          <span className="font-medium text-xs sm:text-sm flex-1 min-w-0 truncate">{notification.message}</span>
          <button 
            onClick={() => setNotification(null)}
            className="ml-1 hover:bg-white/20 rounded-lg p-1 transition-colors flex-shrink-0"
          >
            <X className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 animate-fade-in">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-md w-full p-4 sm:p-6 animate-scale-in">
            <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
              <div className="bg-red-100 p-2 sm:p-3 rounded-full flex-shrink-0">
                <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2">Delete Category?</h3>
                <p className="text-gray-600 text-xs sm:text-sm">
                  Are you sure you want to delete "<span className="font-semibold">{deleteConfirm.name}</span>"? 
                  This action cannot be undone and may affect posts using this category.
                </p>
              </div>
            </div>
            
            <div className="flex gap-2 sm:gap-3 justify-end mt-4 sm:mt-6">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-3 py-2 sm:px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm.id)}
                className="px-3 py-2 sm:px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2 text-sm"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
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
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scale-in {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2" style={{ fontFamily: 'var(--font-playfair)' }}>
            <FolderOpen className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-purple-600" />
            Categories Management
          </h1>
          <p className="text-gray-600 mt-1 text-xs sm:text-sm">Organize your blog content</p>
        </div>
        <button
          onClick={() => router.push('/admin/categories/new')}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-2 sm:px-4 sm:py-2.5 md:px-6 md:py-3 rounded-lg sm:rounded-xl hover:from-purple-700 hover:to-blue-700 cursor-pointer transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium text-xs sm:text-sm md:text-base"
        >
          <PlusCircle className="w-4 h-4 sm:w-5 sm:h-5" />
          Create Category
        </button>
      </div>

      <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 border border-purple-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs sm:text-sm text-purple-600 font-medium">Total Categories</p>
            <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-purple-900">{categories.length}</p>
          </div>
          <div className="bg-purple-200 p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl">
            <Layers className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {categories.length === 0 ? (
        <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-6 sm:p-8 md:p-12 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full mb-3 sm:mb-4">
            <FolderOpen className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No categories yet</h3>
          <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
            Get started by creating your first category
          </p>
          <button
            onClick={() => router.push('/admin/categories/new')}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl hover:from-purple-700 hover:to-blue-700 cursor-pointer transition-all duration-200 text-sm sm:text-base"
          >
            <PlusCircle className="w-4 h-4 sm:w-5 sm:h-5" />
            Create Your First Category
          </button>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg sm:rounded-xl shadow-lg overflow-hidden">
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Slug
                    </th>
                    <th className="px-4 lg:px-6 py-3 lg:py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentCategories.map((cat) => (
                    <tr
                      key={cat._id}
                      className={`hover:bg-gray-50 transition-all duration-300 ${
                        deletingId === cat._id ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
                      }`}
                    >
                      <td className="px-4 lg:px-6 py-3 lg:py-4">
                        <div className="flex items-center gap-2 lg:gap-3">
                          <div className="bg-purple-100 p-1.5 lg:p-2 rounded-lg">
                            <Tag className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-purple-600" />
                          </div>
                          <span className="text-xs lg:text-sm font-semibold text-gray-900">{cat.name}</span>
                        </div>
                      </td>
                      <td className="px-4 lg:px-6 py-3 lg:py-4">
                        <span className="text-xs lg:text-sm text-gray-600 font-mono bg-gray-50 px-2 py-1 rounded">
                          {cat.slug}
                        </span>
                      </td>
                      <td className="px-4 lg:px-6 py-3 lg:py-4">
                        <div className="flex items-center justify-end gap-1 lg:gap-2">
                          <button
                            onClick={() => router.push(`/admin/categories/${cat._id}`)}
                            className="p-1.5 lg:p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit Category"
                          >
                            <Edit2 className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm({ id: cat._id, name: cat.name })}
                            disabled={deletingId === cat._id}
                            className="p-1.5 lg:p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Delete Category"
                          >
                            <Trash2 className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="md:hidden divide-y divide-gray-200">
              {currentCategories.map((cat) => (
                <div
                  key={cat._id}
                  className={`p-3 sm:p-4 transition-all duration-300 ${
                    deletingId === cat._id ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2 sm:mb-3">
                    <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                      <div className="bg-purple-100 p-1.5 sm:p-2 rounded-lg flex-shrink-0">
                        <Tag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xs sm:text-sm font-semibold text-gray-900 truncate">{cat.name}</h3>
                        <p className="text-xs text-gray-600 font-mono bg-gray-50 px-2 py-0.5 sm:py-1 rounded inline-block mt-1">
                          {cat.slug}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => router.push(`/admin/categories/${cat._id}`)}
                      className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-xs sm:text-sm"
                    >
                      <Edit2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteConfirm({ id: cat._id, name: cat.name })}
                      disabled={deletingId === cat._id}
                      className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
                    >
                      <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {totalPages > 1 && (
            <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
              {renderPagination()}
            </div>
          )}

          <div className="text-center text-xs sm:text-sm text-gray-600">
            Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, categories.length)} of {categories.length} {categories.length === 1 ? 'category' : 'categories'}
          </div>
        </>
      )}
    </div>
  );
}