import React from 'react';

const PostPageSkeleton = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 animate-pulse">
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-10 h-10 rounded-full bg-gray-300" />
        <div>
          <div className="h-4 w-32 bg-gray-300 rounded mb-2" />
          <div className="h-3 w-24 bg-gray-200 rounded" />
        </div>
      </div>

      <div className="h-8 w-3/4 bg-gray-300 rounded mb-4" />

      <div className="w-full h-[400px] bg-gray-200 rounded-lg mb-6" />

      <div className="space-y-4">
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-5/6" />
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-[60%]" />
      </div>
    </div>
  );
};

export default PostPageSkeleton;
