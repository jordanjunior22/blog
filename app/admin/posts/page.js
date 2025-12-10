"use client"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  PlusCircle,
  Edit2,
  Trash2,
  ThumbsUp,
  ThumbsDown,
  Star,
  StarOff,
  Search,
  Filter,
  Eye,
  Calendar,
  User,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  CheckCircle,
  XCircle,
  AlertCircle,
  X as CloseIcon
} from 'lucide-react';

export default function AdminPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [notification, setNotification] = useState(null);
  const postsPerPage = 10;
  const router = useRouter();

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/posts');
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to load posts');
        setPosts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const toggleFeatured = async (id) => {
    try {
      const res = await fetch(`/api/posts/${id}/toggle-featured`, {
        method: 'PATCH',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to toggle featured');

      setPosts((prev) =>
        prev.map((p) => ({
          ...p,
          featured: p._id === id ? data.featured : false,
        }))
      );
      
      showNotification('success', data.featured ? 'Post featured successfully!' : 'Post unfeatured successfully!');
    } catch (err) {
      showNotification('error', err.message);
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/posts/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to delete post');
      }
      
      // Fade out animation before removing
      setTimeout(() => {
        setPosts((prev) => prev.filter((p) => p._id !== id));
        setDeletingId(null);
        setDeleteConfirm(null);
        showNotification('success', 'Post deleted successfully!');
      }, 300);
    } catch (err) {
      setDeletingId(null);
      setDeleteConfirm(null);
      showNotification('error', err.message);
    }
  };

  // Filter posts
  let filteredPosts = posts.filter(post => 
    post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.author?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Show featured only if filter is active
  if (showFeaturedOnly) {
    filteredPosts = filteredPosts.filter(post => post.featured);
  }

  // Pagination logic
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  // Reset to page 1 when search or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, showFeaturedOnly]);

  const featuredPost = posts.find(p => p.featured);

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <div className="h-8 bg-gray-200 rounded w-48 animate-pulse" />
        <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-4 animate-pulse">
              <div className="h-16 bg-gray-200 rounded flex-1" />
              <div className="h-16 bg-gray-200 rounded w-32" />
              <div className="h-16 bg-gray-200 rounded w-24" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl">
          <h3 className="font-semibold mb-1">Error Loading Posts</h3>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl animate-slide-in ${
          notification.type === 'success' ? 'bg-green-500' : 
          notification.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
        } text-white`}>
          {notification.type === 'success' && <CheckCircle className="w-5 h-5" />}
          {notification.type === 'error' && <XCircle className="w-5 h-5" />}
          {notification.type === 'info' && <AlertCircle className="w-5 h-5" />}
          <span className="font-medium">{notification.message}</span>
          <button 
            onClick={() => setNotification(null)}
            className="ml-2 hover:bg-white/20 rounded-lg p-1 transition-colors"
          >
            <CloseIcon className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-scale-in">
            <div className="flex items-start gap-4 mb-4">
              <div className="bg-red-100 p-3 rounded-full flex-shrink-0">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Post?</h3>
                <p className="text-gray-600 text-sm">
                  Are you sure you want to delete "<span className="font-semibold">{deleteConfirm.title}</span>"? 
                  This action cannot be undone.
                </p>
              </div>
            </div>
            
            <div className="flex gap-3 justify-end mt-6">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm.id)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete Post
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

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2" style={{ fontFamily: 'var(--font-playfair)' }}>
            <Eye className="w-8 h-8 text-purple-600" />
            Posts Management
          </h1>
          <p className="text-gray-600 mt-1">Manage and organize your blog posts</p>
        </div>
        <button
          onClick={() => router.push('/admin/posts/new')}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-blue-700 cursor-pointer transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium"
        >
          <PlusCircle className="w-5 h-5" />
          Create New Post
        </button>
      </div>

      {/* Featured Post Highlight */}
      {featuredPost && (
        <div className="bg-gradient-to-br from-yellow-50 to-amber-50 border-2 border-yellow-300 rounded-xl p-6 shadow-lg">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <div className="bg-yellow-400 p-2 rounded-lg flex-shrink-0">
                <Star className="w-6 h-6 text-white" fill="currentColor" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-semibold text-yellow-800 uppercase tracking-wide">
                    Currently Featured Post
                  </h3>
                  <Sparkles className="w-4 h-4 text-yellow-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2 truncate">
                  {featuredPost.title}
                </h2>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {featuredPost.author?.name || 'Unknown'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(featuredPost.createdAt).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1 text-green-600">
                    <ThumbsUp className="w-4 h-4" />
                    {featuredPost.likes?.length || 0}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => router.push(`/admin/posts/${featuredPost._id}`)}
              className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm flex-shrink-0"
            >
              <Edit2 className="w-4 h-4" />
              Edit
            </button>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Posts</p>
              <p className="text-2xl font-bold text-blue-900">{posts.length}</p>
            </div>
            <div className="bg-blue-200 p-3 rounded-lg">
              <Eye className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-4 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-600 font-medium">Featured</p>
              <p className="text-2xl font-bold text-yellow-900">
                {posts.filter(p => p.featured).length}
              </p>
            </div>
            <div className="bg-yellow-200 p-3 rounded-lg">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Total Likes</p>
              <p className="text-2xl font-bold text-green-900">
                {posts.reduce((sum, p) => sum + (p.likes?.length || 0), 0)}
              </p>
            </div>
            <div className="bg-green-200 p-3 rounded-lg">
              <ThumbsUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-xl shadow-lg p-4 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search posts by title or author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
          />
        </div>
        <button 
          onClick={() => setShowFeaturedOnly(!showFeaturedOnly)}
          className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 font-medium ${
            showFeaturedOnly 
              ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white shadow-md' 
              : 'border border-gray-300 hover:bg-gray-50'
          }`}
        >
          <Star className={`w-5 h-5 ${showFeaturedOnly ? 'fill-current' : ''}`} />
          <span>{showFeaturedOnly ? 'Show All' : 'Featured Only'}</span>
        </button>
      </div>

      {/* Posts Table */}
      {currentPosts.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <Eye className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No posts found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || showFeaturedOnly ? 'Try adjusting your search terms or filters' : 'Get started by creating your first post'}
          </p>
          {!searchTerm && !showFeaturedOnly && (
            <button
              onClick={() => router.push('/admin/posts/new')}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-blue-700 cursor-pointer transition-all duration-200"
            >
              <PlusCircle className="w-5 h-5" />
              Create Your First Post
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Post Details
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Engagement
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentPosts.map((post) => (
                    <tr
                      key={post._id}
                      className={`hover:bg-gray-50 transition-all duration-300 ${
                        post.featured ? 'bg-yellow-50/30' : ''
                      } ${
                        deletingId === post._id ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-3">
                          {post.featured && (
                            <Sparkles className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-1" />
                          )}
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-semibold text-gray-900 truncate">
                              {post.title}
                            </h3>
                            <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <User className="w-3 h-3" />
                                {post.author?.name || 'Unknown'}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {post.createdAt
                                  ? new Date(post.createdAt).toLocaleDateString()
                                  : '—'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1 text-green-600">
                            <ThumbsUp className="w-4 h-4" />
                            <span className="text-sm font-semibold">
                              {post.likes?.length || 0}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-red-600">
                            <ThumbsDown className="w-4 h-4" />
                            <span className="text-sm font-semibold">
                              {post.dislikes?.length || 0}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <button
                          onClick={() => toggleFeatured(post._id)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all duration-200 ${
                            post.featured
                              ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white shadow-md hover:shadow-lg'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {post.featured ? (
                            <>
                              <Star className="w-3.5 h-3.5" fill="currentColor" />
                              Featured
                            </>
                          ) : (
                            <>
                              <StarOff className="w-3.5 h-3.5" />
                              Feature
                            </>
                          )}
                        </button>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => router.push(`/admin/posts/${post._id}`)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit Post"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm({ id: post._id, title: post.title })}
                            disabled={deletingId === post._id}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Delete Post"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between bg-white rounded-xl shadow-lg p-4">
              <div className="text-sm text-gray-600">
                Showing {indexOfFirstPost + 1} to {Math.min(indexOfLastPost, filteredPosts.length)} of {filteredPosts.length} posts
              </div>
              
              <div className="flex items-center gap-2">
                {/* First Page */}
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title="First page"
                >
                  <ChevronsLeft className="w-5 h-5" />
                </button>

                {/* Previous Page */}
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title="Previous page"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                  {[...Array(totalPages)].map((_, idx) => {
                    const pageNum = idx + 1;
                    // Show first, last, current, and pages around current
                    if (
                      pageNum === 1 ||
                      pageNum === totalPages ||
                      (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                            currentPage === pageNum
                              ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md'
                              : 'hover:bg-gray-100'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    } else if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                      return <span key={pageNum} className="px-2 text-gray-400">...</span>;
                    }
                    return null;
                  })}
                </div>

                {/* Next Page */}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title="Next page"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Last Page */}
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title="Last page"
                >
                  <ChevronsRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}