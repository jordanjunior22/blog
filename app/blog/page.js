'use client';

import React, { useEffect, useState } from 'react';
import PostCart, { PostCartSkeleton } from '@/components/PostCart';
import Categories from '@/components/user/Categories'
import SubscribeCTA from '@/components/SubscribeCTA'

const POSTS_PER_PAGE = 9;

function Latest() {
    const [posts, setPosts] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        async function fetchPosts() {
            try {
                const res = await fetch('/api/posts'); // adjust API endpoint if needed
                const data = await res.json();
                setPosts(data); // No sorting, show in natural order
            } catch (error) {
                console.error('Failed to fetch posts:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchPosts();
    }, []);

    // Pagination logic
    const totalPages = posts ? Math.ceil(posts.length / POSTS_PER_PAGE) : 0;
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    const currentPosts = posts ? posts.slice(startIndex, startIndex + POSTS_PER_PAGE) : [];

    // Handlers
    function goToNextPage() {
        setCurrentPage((page) => Math.min(page + 1, totalPages));
    }

    function goToPrevPage() {
        setCurrentPage((page) => Math.max(page - 1, 1));
    }

    const BREADCRUM = "Blog > Philosophical Poetry";

    return (
        <div>
            {/* Hero section */}
            <div
                className="relative bg-center bg-cover bg-no-repeat text-center text-white px-6 py-20"
                style={{
                    backgroundImage: "url('/image.jpg')",
                }}
            >
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black/60"></div>

                {/* Content */}
                <div className="relative z-10 max-w-2xl mx-auto">
                    <h1 className="text-3xl md:text-5xl font-bold mb-4">Our Blog</h1>
                    <p className="text-sm md:text-base mb-6">
                        Discover thoughts, stories, and ideas across philosophy, culture, and creativity.
                    </p>
                    <h2 className="text-lg uppercase tracking-wide text-(--cta-color)">Blog</h2>
                </div>
            </div>


            {/* Posts section */}
            <div className="px-6 md:px-32 py-12">
                {loading && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <PostCartSkeleton />
                        <PostCartSkeleton />
                        <PostCartSkeleton />
                    </div>
                )}

                {!loading && posts && posts.length === 0 && <p>No posts found.</p>}

                {!loading && posts && posts.length > 0 && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                            {currentPosts.map((post) => (
                                <PostCart key={post._id} post={post} />
                            ))}
                        </div>

                        {/* Pagination controls */}
                        {/* Pagination */}
                        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 text-sm md:text-base">
                            <button
                                onClick={goToPrevPage}
                                disabled={currentPage === 1}
                                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 w-full sm:w-auto"
                            >
                                Prev
                            </button>

                            <span className="text-center">
                                Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
                            </span>

                            <button
                                onClick={goToNextPage}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 w-full sm:w-auto"
                            >
                                Next
                            </button>
                        </div>

                    </>
                )}
            </div>
            <Categories />
            <SubscribeCTA />
        </div>
    );
}

export default Latest;
