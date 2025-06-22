'use client';
import React, { useState, useEffect } from 'react';
import Button from '@/components/Button'; // Adjust the path if necessary

export default function Page() {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch('/api/posts');
        const data = await res.json();
        const featuredPost = data.find((p) => p.featured === true) || null;
        setPost(featuredPost);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  const backgroundStyle = {
    backgroundImage: `url(${post?.coverImage || '/fallback.jpg'})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  return (
    <div
      className="relative w-full h-screen flex items-center px-6 md:px-30"
      style={backgroundStyle}
    >
      <div className="absolute inset-0 bg-black/60"></div>

      <div className="relative z-10 max-w-3xl text-left text-white w-full">
        {loading ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-4 w-24 bg-gray-700 rounded" />
            <div className="h-6 w-3/4 bg-gray-600 rounded" />
            <div className="h-4 w-full bg-gray-600 rounded" />
            <div className="h-4 w-5/6 bg-gray-600 rounded" />
            <div className="h-10 w-32 bg-gray-700 rounded mt-4" />
          </div>
        ) : !post ? (
          <p>No featured post found.</p>
        ) : (
          <>
            <p className="text-sm text-[--cta-color] mb-2">Featured Writing</p>
            <h1 className="text-2xl md:text-4xl font-bold mb-4">{post.title}</h1>
            <p className="text-gray-200 whitespace-pre-line mb-6 text-sm">
              {post.content.length > 200 ? post.content.slice(0, 200) + '...' : post.content}
            </p>
            <Button
              type="submit"
              disabled={submitting}
              text="Read More"
            />
          </>
        )}
      </div>
    </div>
  );
}
