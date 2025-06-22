'use client';

import React, { useEffect, useState } from 'react';
import PostCart, { PostCartSkeleton } from '@/components/PostCart';

const POSTS_PER_PAGE = 6;

function Latest() {
  const [posts, setPosts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch('/api/posts'); // adjust API endpoint if needed
        const data = await res.json();

        const sortedPosts = data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setPosts(sortedPosts);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  // Calculate pagination values
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

  return (
    <div className="px-6 md:px-32 py-12">
      <h1 className="text-3xl font-bold mb-10">Latest Writing</h1>

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
          <div className="flex justify-center items-center gap-4">
            <button
              onClick={goToPrevPage}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50`}
            >
              Previous
            </button>

            <span>
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50`}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Latest;
