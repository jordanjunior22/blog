import React from 'react';
import { MoveRight } from 'lucide-react';

export function CartSkeleton() {
  return (
    <div className="p-4 rounded-xl border border-gray-200 shadow-sm w-full animate-shimmer">
      {/* Image placeholder */}
      <div className="mb-4 h-40 w-full rounded-lg bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300" />
      
      {/* Text placeholders */}
      <div className="text-center space-y-3">
        <div className="h-5 w-3/4 rounded bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 mx-auto" />
        <div className="h-4 w-5/6 rounded bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 mx-auto" />
        <div className="h-5 w-1/2 rounded bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 mx-auto" />
      </div>
    </div>
  );
}

function CategoriesCart({ title, description, imageUrl, link }) {
  // ✅ Default fallback image
  const defaultImage = "https://skhcn.hatinh.gov.vn/storage/images.thumb.6884ae87-e99e-4995-8621-76a68fc0df7a.jpg";

  return (
    <div className="p-4 rounded-xl hover:shadow-md transition-all duration-200 max-w-sm mx-auto">
      {/* Image container with fallback */}
      <div className="mb-4 h-40 w-full overflow-hidden rounded-lg">
        <img
          src={imageUrl || defaultImage}
          alt={`${title} visual representation`}
          className="object-cover w-full h-full"
          onError={(e) => {
            // ✅ Fallback if image fails to load
            e.target.src = defaultImage;
          }}
        />
      </div>

      {/* Centered text container */}
      <div className="text-center">
        <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
        <p className="text-sm text-gray-600 mt-1">{description}</p>

        <a
          href={link}
          className="inline-flex items-center justify-center gap-2 text-[var(--cta-color)] text-sm font-medium mt-4 hover:underline mx-auto"
          aria-label={`Browse posts in category ${title}`}
        >
          Browse Collections
          <MoveRight size={18} />
        </a>
      </div>
    </div>
  );
}

export default CategoriesCart;