import React from 'react';
import { MoveRight } from 'lucide-react';

export function PostCartSkeleton() {
  return (
    <div className="md:w-full bg-gray-100 rounded-lg shadow-md overflow-hidden animate-pulse">
      {/* Skeleton Image */}
      <div className="w-full h-48 bg-gray-300" />

      <div className="p-4 space-y-3">
        {/* Skeleton Meta */}
        <div className="flex justify-between items-center">
          <div className="w-20 h-5 bg-purple-300 rounded-full" />
          <div className="w-16 h-4 bg-gray-300 rounded" />
        </div>

        {/* Skeleton Title */}
        <div className="w-3/4 h-6 bg-gray-300 rounded" />

        {/* Skeleton Excerpt */}
        <div className="space-y-2">
          <div className="w-full h-4 bg-gray-300 rounded" />
          <div className="w-full h-4 bg-gray-300 rounded" />
          <div className="w-5/6 h-4 bg-gray-300 rounded" />
        </div>

        {/* Skeleton Read More Link */}
        <div className="w-24 h-5 bg-purple-300 rounded" />
      </div>
    </div>
  );
}

function PostCart({ post }) {
  // ✅ Default fallback image
  const defaultImage = "https://skhcn.hatinh.gov.vn/storage/images.thumb.6884ae87-e99e-4995-8621-76a68fc0df7a.jpg";
  
  return (
    <div className="md:w-full bg-gray-100 rounded-lg shadow-md overflow-hidden">
      {/* Post Image with fallback */}
      <img
        src={post.coverImage || defaultImage}
        alt={post.title}
        className="w-full h-48 object-cover"
        onError={(e) => {
          // ✅ Fallback if image fails to load
          e.target.src = defaultImage;
        }}
      />

      <div className="p-4">
        {/* Post Meta */}
        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <p className="bg-purple-200 text-purple-800 px-3 py-1 rounded-full text-xs font-semibold">
            {post.category?.name || 'Uncategorized'}
          </p>
          <p>
            {new Date(post.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>

        {/* Post Title */}
        <h2 
          className="text-lg font-bold text-gray-900"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          {post.title}
        </h2>

        {/* Post Excerpt */}
        <p 
          className="text-gray-700 text-sm mt-2"
          style={{ fontFamily: 'var(--font-roboto)' }}
        >
          {post.content?.length > 200
            ? post.content.slice(0, 200) + '...'
            : post.content}
        </p>

        {/* Read More Link */}
        <a
          href={`/post-details/${post.slug}`}
          className="inline-flex items-center gap-2 text-[var(--cta-color)] text-sm font-medium mt-4 hover:underline"
        >
          Read full post
          <MoveRight size={18} />
        </a>
      </div>
    </div>
  );
}

export default PostCart;