'use client';

import React, { useEffect, useState } from 'react';
import { MoveRight } from 'lucide-react';

export default function Featured() {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 px-6 py-10 md:px-20 md:py-20 items-center animate-pulse">
        <div className="flex-1 bg-gray-200 h-64 md:h-96 lg:h-[450px] rounded-md" />

        <div className="flex-1 space-y-4 w-full">
          <div className="h-4 w-1/4 bg-gray-200 rounded" />
          <div className="h-6 w-3/4 bg-gray-300 rounded" />
          <div className="h-4 w-full bg-gray-200 rounded" />
          <div className="h-4 w-5/6 bg-gray-200 rounded" />
          <div className="h-4 w-2/3 bg-gray-200 rounded" />

          <div className="flex items-center gap-4 mt-4">
            <div className="w-10 h-10 bg-gray-300 rounded-full" />
            <div>
              <div className="h-4 w-24 bg-gray-200 rounded" />
              <div className="h-3 w-32 bg-gray-100 rounded mt-1" />
            </div>
          </div>

          <div className="h-8 w-32 bg-gray-200 rounded mt-4" />
        </div>
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-10 px-6 py-10 md:px-20 md:py-20 items-center">
      
      {/* Image */}
      <div className="flex-1 h-64 md:h-96 lg:h-[450px] bg-gray-200 rounded-md overflow-hidden">
        <img
          src={post.coverImage || '/featured.jpg'}
          alt={post.title}
          className="w-full h-48 object-cover"
        />
      </div>


      {/* Text Content */}
      <div className="flex-1 space-y-4">
        <p className="text-sm text-(--cta-color)">Featured Writing</p>

        <h1
          className="text-2xl sm:text-3xl lg:text-4xl font-bold"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          {post.title}
        </h1>

        <p
          className="text-gray-700 text-sm sm:text-base leading-relaxed whitespace-pre-line"
          style={{ fontFamily: 'var(--font-roboto)' }}
        >
          {post.content?.length > 200
            ? post.content.slice(0, 200) + '...'
            : post.content}
        </p>

        {/* Author */}
        <div className="flex items-center gap-4 pt-2">
          <div className="w-10 h-10 bg-gray-300 rounded-full overflow-hidden">
            <img
              src={post.author?.avatarUrl || '/avatar.png'}
              alt={post.author?.name || 'Author'}
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <p className="font-medium">{post.author?.name || 'Author'}</p>
            {post.createdAt && (
              <p className="text-sm text-gray-500">
                Published on {new Date(post.createdAt).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>

        {/* Button */}
        <a
          href={`/post-details/${post.slug}`}
          className="inline-flex text-(--cta-color) text-sm items-center gap-2 mt-4 px-4 py-2 font-medium rounded transition-colors duration-200"
        >
          Read full post <MoveRight size={18} />
        </a>
      </div>
    </div>
  );
}
