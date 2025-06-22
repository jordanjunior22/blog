'use client';

import React, { useEffect, useState } from 'react';
import PostCart, { PostCartSkeleton } from '@/components/PostCart';

function RelatedPosts({ currentPostId }) {
  const [posts, setPosts] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRelated() {
      try {
        const res = await fetch('/api/posts');
        const data = await res.json();

        // Exclude the current post and sort by createdAt desc
        const filtered = data
          .filter(post => post._id !== currentPostId)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 3); // take only top 3

        setPosts(filtered);
      } catch (error) {
        console.error('Failed to fetch related posts:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchRelated();
  }, [currentPostId]);

  return (
    <section className="mt-12 px-6 md:px-32">
      <h2 className="text-2xl font-semibold mb-6">Related Posts</h2>

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <PostCartSkeleton />
          <PostCartSkeleton />
          <PostCartSkeleton />
        </div>
      )}

      {!loading && posts && posts.length === 0 && (
        <p className="text-gray-500">No related posts found.</p>
      )}

      {!loading && posts && posts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map(post => (
            <PostCart key={post._id} post={post} />
          ))}
        </div>
      )}
    </section>
  );
}

export default RelatedPosts;
