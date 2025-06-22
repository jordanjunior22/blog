'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import PostCart, { PostCartSkeleton } from '@/components/PostCart';
import Categories from '@/components/user/Categories';
import SubscribeCTA from '@/components/SubscribeCTA';

const POSTS_PER_PAGE = 9;

function CategoryPage() {
    const { slug } = useParams(); // get slug from URL
    const [category, setCategory] = useState(null);
    const [posts, setPosts] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        async function fetchCategoryPosts() {
            try {
                const res = await fetch(`/api/posts/category/${slug}`);
                const data = await res.json();

                if (data.length > 0) {
                    setCategory(data[0].category); // assuming all posts have the same category
                    setPosts(data);
                } else {
                    setPosts([]);
                }
            } catch (error) {
                console.error('Failed to fetch posts:', error);
            } finally {
                setLoading(false);
            }
        }

        if (slug) {
            fetchCategoryPosts();
        }
    }, [slug]);

    const totalPages = posts ? Math.ceil(posts.length / POSTS_PER_PAGE) : 0;
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    const currentPosts = posts ? posts.slice(startIndex, startIndex + POSTS_PER_PAGE) : [];

    const goToNextPage = () => setCurrentPage((page) => Math.min(page + 1, totalPages));
    const goToPrevPage = () => setCurrentPage((page) => Math.max(page - 1, 1));

    return (
        <div>
            {/* Hero section */}
            <div
                className="relative bg-center bg-cover bg-no-repeat text-center text-white px-6 py-20"
                style={{
                    backgroundImage: category?.image
                        ? `url(${category.image})`
                        : "url('/default.jpg')",
                }}
            >
                <div className="absolute inset-0 bg-black/60"></div>

                <div className="relative z-10 max-w-2xl mx-auto">
                    <h1 className="text-3xl md:text-5xl font-bold mb-4">
                        {category?.name || 'Category'}
                    </h1>
                    <p className="text-sm md:text-base mb-6">
                        {category?.description || 'Explore all posts in this category.'}
                    </p>
                    <h2 className="text-lg uppercase tracking-wide text-[#fa9f42]">
                        Blog &gt; {category?.name || 'Category'}
                    </h2>
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

                {!loading && posts && posts.length === 0 && <p>No posts found in this category.</p>}

                {!loading && posts && posts.length > 0 && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                            {currentPosts.map((post) => (
                                <PostCart key={post._id} post={post} />
                            ))}
                        </div>

                        {/* Pagination */}
                        <div className="flex justify-center items-center gap-4">
                            <button
                                onClick={goToPrevPage}
                                disabled={currentPage === 1}
                                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                            >
                                Previous
                            </button>

                            <span>
                                Page {currentPage} of {totalPages}
                            </span>

                            <button
                                onClick={goToNextPage}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
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

export default CategoryPage;
