'use client';

import { useEffect, useState } from 'react';
import { 
  Trash2, 
  Plus, 
  Users, 
  Shield, 
  Mail, 
  User,
  Loader2,
  RefreshCw,
  Filter,
  CheckCircle,
  AlertCircle,
  X,
  Search
} from 'lucide-react';
import { useRouter } from 'next/navigation';

const USERS_PER_PAGE = 10;

export default function AdminUsers() {
    const router = useRouter();
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [roleFilter, setRoleFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [notification, setNotification] = useState(null);
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, user: null });
    const [isDeleting, setIsDeleting] = useState(false);

    // Show notification toast
    const showNotification = (type, message) => {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 5000);
    };

    // Fetch users from API
    const fetchUsers = () => {
        setLoading(true);
        fetch('/api/user')
            .then((res) => res.json())
            .then((data) => {
                setUsers(data);
                setFilteredUsers(data);
                showNotification('success', 'Users loaded successfully!');
            })
            .catch(() => {
                setUsers([]);
                setFilteredUsers([]);
                showNotification('error', 'Failed to load users');
            })
            .finally(() => setLoading(false));
    };

    // Initial load
    useEffect(() => {
        fetchUsers();
    }, []);

    // Filter users based on search and role
    useEffect(() => {
        let filtered = users;
        
        if (roleFilter !== 'all') {
            filtered = filtered.filter(u => u.role === roleFilter);
        }
        
        if (searchQuery.trim()) {
            filtered = filtered.filter(u => 
                u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                u.email?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        
        setFilteredUsers(filtered);
        setCurrentPage(1);
    }, [roleFilter, searchQuery, users]);

    // Handle user deletion
    const handleDelete = async (id) => {
        setIsDeleting(true);
        
        try {
            const res = await fetch(`/api/user/${id}`, { method: 'DELETE' });
            const json = await res.json();
            
            if (json.success) {
                setUsers((prev) => prev.filter((u) => u._id !== id));
                showNotification('success', 'User deleted successfully!');
                setDeleteModal({ isOpen: false, user: null });
            } else {
                throw new Error('Delete failed');
            }
        } catch (error) {
            showNotification('error', 'Failed to delete user');
        } finally {
            setIsDeleting(false);
        }
    };

    // Modal controls
    const openDeleteModal = (user) => {
        setDeleteModal({ isOpen: true, user });
    };

    const closeDeleteModal = () => {
        if (!isDeleting) {
            setDeleteModal({ isOpen: false, user: null });
        }
    };

    // Pagination calculations
    const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
    const indexOfLastItem = currentPage * USERS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - USERS_PER_PAGE;
    const paginatedUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

    // Stats calculations
    const adminCount = users.filter(u => u.role === 'admin').length;
    const readerCount = users.filter(u => u.role === 'reader').length;

    // Pagination navigation
    const goToPage = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Render pagination controls
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

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-2 sm:p-4 md:p-6 flex items-center justify-center">
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-8 flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 animate-spin text-purple-600" />
                    <p className="text-sm sm:text-base text-gray-600 font-medium">Loading users...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-2 sm:p-4 md:p-6">
            {/* Delete Confirmation Modal */}
            {deleteModal.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-scale-in">
                        <div className="flex items-start gap-4 mb-4">
                            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                                <AlertCircle className="w-6 h-6 text-red-600" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Delete User?</h3>
                                <p className="text-sm text-gray-600 mb-1">
                                    Are you sure you want to delete <span className="font-semibold text-gray-900">{deleteModal.user?.name}</span>?
                                </p>
                                <p className="text-sm text-gray-600">
                                    This action cannot be undone.
                                </p>
                            </div>
                        </div>

                        {deleteModal.user && (
                            <div className="bg-gray-50 rounded-lg p-3 mb-4">
                                <div className="flex items-center gap-3">
                                    {deleteModal.user.avatarUrl ? (
                                        <img
                                            src={deleteModal.user.avatarUrl}
                                            alt={deleteModal.user.name}
                                            className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                                            <User className="w-5 h-5 text-purple-600" />
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-gray-900 truncate">{deleteModal.user.name}</p>
                                        <p className="text-xs text-gray-600 truncate">{deleteModal.user.email}</p>
                                    </div>
                                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                                        deleteModal.user.role === 'admin' 
                                            ? 'bg-red-100 text-red-700' 
                                            : 'bg-blue-100 text-blue-700'
                                    }`}>
                                        {deleteModal.user.role === 'admin' ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
                                        {deleteModal.user.role}
                                    </span>
                                </div>
                            </div>
                        )}

                        <div className="flex gap-3">
                            <button
                                onClick={closeDeleteModal}
                                disabled={isDeleting}
                                className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDelete(deleteModal.user._id)}
                                disabled={isDeleting}
                                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isDeleting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Deleting...
                                    </>
                                ) : (
                                    <>
                                        <Trash2 className="w-4 h-4" />
                                        Delete User
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Notification Toast */}
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

            {/* Animations */}
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
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
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

            <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                    <div className="flex items-center gap-3 sm:gap-4">
                        <div className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 shadow-lg">
                            <Users className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
                                Manage Users
                            </h1>
                            <p className="text-xs sm:text-sm text-gray-600 mt-1">View and manage all user accounts</p>
                        </div>
                    </div>
                    <button
                        onClick={() => router.push('/admin/users/create')}
                        className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-2 sm:px-4 sm:py-2.5 md:px-6 md:py-3 rounded-lg sm:rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium text-sm sm:text-base"
                    >
                        <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                        Create User
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                    <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs sm:text-sm text-gray-600 font-medium">Total Users</p>
                                <p className="text-2xl sm:text-3xl font-bold text-purple-900 mt-1">{users.length}</p>
                            </div>
                            <div className="bg-purple-100 p-2 sm:p-3 rounded-lg">
                                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs sm:text-sm text-gray-600 font-medium">Admins</p>
                                <p className="text-2xl sm:text-3xl font-bold text-red-900 mt-1">{adminCount}</p>
                            </div>
                            <div className="bg-red-100 p-2 sm:p-3 rounded-lg">
                                <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs sm:text-sm text-gray-600 font-medium">Readers</p>
                                <p className="text-2xl sm:text-3xl font-bold text-blue-900 mt-1">{readerCount}</p>
                            </div>
                            <div className="bg-blue-100 p-2 sm:p-3 rounded-lg">
                                <User className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters Bar */}
                <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                        {/* Search Input */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 sm:pl-10 pr-3 py-2 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all text-sm sm:text-base"
                            />
                        </div>

                        {/* Role Filter */}
                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                            <select
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                                className="w-full sm:w-auto pl-9 sm:pl-10 pr-8 py-2 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all appearance-none cursor-pointer bg-white text-sm sm:text-base"
                            >
                                <option value="all">All Roles</option>
                                <option value="admin">Admins</option>
                                <option value="reader">Readers</option>
                            </select>
                        </div>

                        {/* Refresh Button */}
                        <button
                            onClick={fetchUsers}
                            className="flex items-center justify-center gap-2 px-3 py-2 sm:px-4 sm:py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg sm:rounded-xl transition-all font-medium text-sm sm:text-base"
                        >
                            <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span className="hidden sm:inline">Refresh</span>
                        </button>
                    </div>
                </div>

                {/* Users Table/Cards */}
                {filteredUsers.length === 0 ? (
                    <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-8 sm:p-12 text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full mb-3 sm:mb-4">
                            <Users className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No users found</h3>
                        <p className="text-sm sm:text-base text-gray-600">
                            {searchQuery || roleFilter !== 'all' ? 'Try adjusting your filters' : 'No users in the system yet'}
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="bg-white rounded-lg sm:rounded-xl shadow-lg overflow-hidden">
                            {/* Desktop Table View */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                User
                                            </th>
                                            <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Email
                                            </th>
                                            <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Role
                                            </th>
                                            <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Bio
                                            </th>
                                            <th className="px-4 lg:px-6 py-3 lg:py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {paginatedUsers.map((user) => (
                                            <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-4 lg:px-6 py-3 lg:py-4">
                                                    <div className="flex items-center gap-3">
                                                        {user.avatarUrl ? (
                                                            <img
                                                                src={user.avatarUrl}
                                                                alt={user.name}
                                                                className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                                                            />
                                                        ) : (
                                                            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                                                                <User className="w-5 h-5 text-purple-600" />
                                                            </div>
                                                        )}
                                                        <span className="text-xs lg:text-sm font-semibold text-gray-900">{user.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 lg:px-6 py-3 lg:py-4">
                                                    <div className="flex items-center gap-2">
                                                        <Mail className="w-4 h-4 text-gray-400" />
                                                        <span className="text-xs lg:text-sm text-gray-600">{user.email}</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 lg:px-6 py-3 lg:py-4">
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                                                        user.role === 'admin' 
                                                            ? 'bg-red-100 text-red-700' 
                                                            : 'bg-blue-100 text-blue-700'
                                                    }`}>
                                                        {user.role === 'admin' ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td className="px-4 lg:px-6 py-3 lg:py-4">
                                                    <span className="text-xs lg:text-sm text-gray-600 line-clamp-2">
                                                        {user.bio || '-'}
                                                    </span>
                                                </td>
                                                <td className="px-4 lg:px-6 py-3 lg:py-4">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => openDeleteModal(user)}
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                            title="Delete User"
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

                            {/* Mobile Card View */}
                            <div className="md:hidden divide-y divide-gray-200">
                                {paginatedUsers.map((user) => (
                                    <div key={user._id} className="p-3 sm:p-4">
                                        <div className="flex items-start gap-3 mb-3">
                                            {user.avatarUrl ? (
                                                <img
                                                    src={user.avatarUrl}
                                                    alt={user.name}
                                                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 flex-shrink-0"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                                                    <User className="w-6 h-6 text-purple-600" />
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-sm font-semibold text-gray-900 truncate">{user.name}</h3>
                                                <div className="flex items-center gap-1.5 text-xs text-gray-600 mt-1">
                                                    <Mail className="w-3 h-3" />
                                                    <span className="truncate">{user.email}</span>
                                                </div>
                                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium mt-2 ${
                                                    user.role === 'admin' 
                                                        ? 'bg-red-100 text-red-700' 
                                                        : 'bg-blue-100 text-blue-700'
                                                }`}>
                                                    {user.role === 'admin' ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
                                                    {user.role}
                                                </span>
                                            </div>
                                        </div>
                                        {user.bio && (
                                            <p className="text-xs text-gray-600 mb-3 line-clamp-2">{user.bio}</p>
                                        )}
                                        <button
                                            onClick={() => openDeleteModal(user)}
                                            className="w-full flex items-center justify-center gap-2 p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors text-sm"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            Delete User
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
                                {renderPagination()}
                            </div>
                        )}

                        {/* Results Count */}
                        <div className="text-center text-xs sm:text-sm text-gray-600">
                            Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredUsers.length)} of {filteredUsers.length} users
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}