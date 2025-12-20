'use client';

import React, { useEffect, useState } from 'react';
import PostCart, { PostCartSkeleton } from '@/components/PostCart';
import Categories from '@/components/user/Categories';
import SubscribeCTA from '@/components/SubscribeCTA';
import { Search, X, Filter, ChevronLeft, ChevronRight } from 'lucide-react';

const POSTS_PER_PAGE = 9;

function Latest() {
    const [posts, setPosts] = useState(null);
    const [filteredPosts, setFilteredPosts] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        async function fetchPosts() {
            try {
                const res = await fetch('/api/posts');
                const data = await res.json();
                const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setPosts(sortedData);
                setFilteredPosts(sortedData);
            } catch (error) {
                console.error('Failed to fetch posts:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchPosts();
    }, []);

    // Extract unique categories - ensure we only get string values
    const categories = posts 
        ? ['all', ...new Set(posts.map(post => post.category?.name).filter(cat => cat && typeof cat === 'string'))] 
        : ['all'];

    // Filter posts based on search and category
    useEffect(() => {
        if (!posts) return;

        let filtered = [...posts];

        // Filter by search query
        if (searchQuery.trim()) {
            filtered = filtered.filter(post => 
                post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                post.content?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Filter by category
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(post => post.category.name === selectedCategory);
        }

        setFilteredPosts(filtered);
        setCurrentPage(1); // Reset to first page when filters change
    }, [searchQuery, selectedCategory, posts]);

    // Pagination logic
    const totalPages = filteredPosts ? Math.ceil(filteredPosts.length / POSTS_PER_PAGE) : 0;
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    const currentPosts = filteredPosts ? filteredPosts.slice(startIndex, startIndex + POSTS_PER_PAGE) : [];

    // Generate page numbers for pagination
    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;
        
        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) pages.push(i);
                pages.push('ellipsis-end');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push('ellipsis-start');
                for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
            } else {
                pages.push(1);
                pages.push('ellipsis-start');
                pages.push(currentPage - 1);
                pages.push(currentPage);
                pages.push(currentPage + 1);
                pages.push('ellipsis-end');
                pages.push(totalPages);
            }
        }
        return pages;
    };

    const clearSearch = () => {
        setSearchQuery('');
    };

    const clearFilters = () => {
        setSearchQuery('');
        setSelectedCategory('all');
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
            {/* Hero section */}
            <div
                className="relative bg-center bg-cover bg-no-repeat text-white overflow-hidden"
                style={{
                    backgroundImage: "url('/image.jpg')",
                }}
            >
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/50"></div>

                {/* Content */}
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
                    <div className="text-center space-y-4 sm:space-y-6">
                        <div className="inline-block">
                            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium bg-white/10 backdrop-blur-sm border border-white/20">
                                📚 Blog
                            </span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                            Our <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Blog</span>
                        </h1>
                        <p className="text-base sm:text-lg md:text-xl text-gray-200 max-w-2xl mx-auto px-4">
                            Discover thoughts, stories, and ideas across philosophy, culture, and creativity.
                        </p>
                    </div>
                </div>

                {/* Wave decoration */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-8 sm:h-12">
                        <path d="M0 48h1440V0c-240 48-480 48-720 24C480 0 240 0 0 24v24z" className="fill-gray-50 dark:fill-gray-900"/>
                    </svg>
                </div>
            </div>

            {/* Search and Filter Section */}
            <div className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                        {/* Search Bar */}
                        <div className="flex-1 relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search articles..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-12 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-sm sm:text-base"
                            />
                            {searchQuery && (
                                <button
                                    onClick={clearSearch}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                                >
                                    <X className="w-4 h-4 text-gray-400" />
                                </button>
                            )}
                        </div>

                        {/* Filter Toggle Button (Mobile) */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="sm:hidden flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium shadow-lg hover:shadow-xl transition-all active:scale-95"
                        >
                            <Filter className="w-5 h-5" />
                            Filters
                        </button>

                        {/* Category Filter (Desktop) */}
                        <div className="hidden sm:flex items-center gap-2">
                            <Filter className="w-5 h-5 text-gray-400" />
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="px-4 py-3.5 rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all cursor-pointer text-sm sm:text-base min-w-[140px]"
                            >
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>
                                        {cat === 'all' ? 'All Categories' : cat}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Clear Filters Button */}
                        {(searchQuery || selectedCategory !== 'all') && (
                            <button
                                onClick={clearFilters}
                                className="hidden sm:flex items-center gap-2 px-4 py-3.5 rounded-2xl border-2 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-all text-sm font-medium"
                            >
                                <X className="w-4 h-4" />
                                Clear
                            </button>
                        )}
                    </div>

                    {/* Mobile Filter Dropdown */}
                    {showFilters && (
                        <div className="sm:hidden mt-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Category
                                </label>
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-blue-500 outline-none transition-all"
                                >
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>
                                            {cat === 'all' ? 'All Categories' : cat}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {(searchQuery || selectedCategory !== 'all') && (
                                <button
                                    onClick={clearFilters}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium"
                                >
                                    <X className="w-4 h-4" />
                                    Clear All Filters
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Results Info */}
            {!loading && filteredPosts && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                        Showing <span className="font-semibold text-gray-900 dark:text-white">{filteredPosts.length}</span> {filteredPosts.length === 1 ? 'article' : 'articles'}
                        {selectedCategory !== 'all' && <> in <span className="font-semibold text-gray-900 dark:text-white">{selectedCategory}</span></>}
                    </p>
                </div>
            )}

            {/* Posts section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                {loading && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                        <PostCartSkeleton />
                        <PostCartSkeleton />
                        <PostCartSkeleton />
                        <PostCartSkeleton />
                        <PostCartSkeleton />
                        <PostCartSkeleton />
                    </div>
                )}

                {!loading && filteredPosts && filteredPosts.length === 0 && (
                    <div className="text-center py-16 sm:py-20">
                        <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-100 dark:bg-gray-800 mb-4 sm:mb-6">
                            <Search className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">No articles found</h3>
                        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6">
                            Try adjusting your search or filters
                        </p>
                        <button
                            onClick={clearFilters}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium shadow-lg hover:shadow-xl transition-all"
                        >
                            Clear Filters
                        </button>
                    </div>
                )}

                {!loading && filteredPosts && filteredPosts.length > 0 && (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
                            {currentPosts.map((post) => (
                                <PostCart key={post._id} post={post} />
                            ))}
                        </div>

                        {/* Modern Pagination */}
                        {totalPages > 1 && (
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
                                {/* Previous Button */}
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:border-blue-500 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-gray-200 dark:disabled:hover:border-gray-700 disabled:hover:text-gray-700 dark:disabled:hover:text-gray-300 transition-all active:scale-95 shadow-sm text-sm sm:text-base w-full sm:w-auto justify-center"
                                >
                                    <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                                    <span className="hidden sm:inline">Previous</span>
                                    <span className="sm:hidden">Prev</span>
                                </button>

                                {/* Page Numbers */}
                                <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto max-w-full px-2 sm:px-0">
                                    {getPageNumbers().map((item, idx) => {
                                        const isEllipsis = typeof item === 'string' && item.startsWith('ellipsis');
                                        
                                        if (isEllipsis) {
                                            return (
                                                <span key={item} className="px-2 sm:px-3 py-2 text-gray-400 text-sm sm:text-base">
                                                    ...
                                                </span>
                                            );
                                        }
                                        
                                        return (
                                            <button
                                                key={`page-${item}`}
                                                onClick={() => setCurrentPage(item)}
                                                className={`min-w-[36px] sm:min-w-[44px] h-9 sm:h-11 px-2 sm:px-3 rounded-lg sm:rounded-xl font-semibold transition-all active:scale-95 text-sm sm:text-base ${
                                                    currentPage === item
                                                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                                                        : 'bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-blue-500 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400'
                                                }`}
                                            >
                                                {item}
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Next Button */}
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:border-blue-500 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-gray-200 dark:disabled:hover:border-gray-700 disabled:hover:text-gray-700 dark:disabled:hover:text-gray-300 transition-all active:scale-95 shadow-sm text-sm sm:text-base w-full sm:w-auto justify-center"
                                >
                                    <span>Next</span>
                                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            <Categories />
            <SubscribeCTA />
        </div>
    );
}

export default Latest;