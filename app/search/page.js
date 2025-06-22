'use client'
import React, { useEffect, useState } from 'react'
import { Calendar, Clock, User } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'


export default function SearchPage() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  const router = useRouter()

  const [posts, setPosts] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedSlug, setSelectedSlug] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/posts/search')
        const { posts, categories } = await res.json()
        setPosts(posts)
        setCategories(categories)

        // If initialQuery matches category slug, select it, else none
        const matchedSlug = categories.find((c) => c.slug === initialQuery)?.slug || ''
        setSelectedSlug(matchedSlug)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [initialQuery])

  const handleCategoryClick = (slug) => {
    // When category clicked, update selectedSlug and push query param
    setSelectedSlug(slug)
    // Keep the original search query but update category slug as query param 'cat'
    // Here for simplicity, we update URL with q=slug to match current logic
    router.push(`/search?q=${slug}`)
  }

  // Filter posts by keyword in title/content AND selected category (if any)
  const filteredPosts = posts.filter((post) => {
    const query = initialQuery.toLowerCase()
    const title = post.title?.toLowerCase() || ''
    const content = post.content?.toLowerCase() || ''

    // Check keyword match
    const matchesKeyword = !initialQuery || title.includes(query) || content.includes(query)

    // Check category match if selectedSlug is set
    const matchesCategory = selectedSlug ? post.category?.slug === selectedSlug : true

    return matchesKeyword && matchesCategory
  })

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Header */}
      <h2 className="text-lg font-medium mb-8 border-b pb-2">
        Search Results for{' '}
        <span className="text-purple-600 font-semibold capitalize">
          "{initialQuery || 'All'}"
        </span>
      </h2>

      <div className="flex flex-col md:flex-row gap-10">
        {/* Posts Section */}
        <div className="flex-1 space-y-8">
          {loading ? (
            <SkeletonLoader />
          ) : filteredPosts.length > 0 ? (
            filteredPosts.map((post, index) => (
              <div key={post._id || index} className="flex gap-6">
                <img
                  src={post.coverImage || '/default.webp'}
                  alt={post.title}
                  className="w-40 h-40 object-cover rounded-lg shadow-sm"
                />
                <div className="flex flex-col justify-between">
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full w-fit font-medium capitalize">
                    {post.category?.name}
                  </span>
                  <h3 className="text-xl font-semibold mt-2">{post.title}</h3>
                  <div className="flex items-center text-gray-500 text-sm gap-4 mt-2">
                    <div className="flex items-center gap-1">
                      <User size={14} />
                      {post.author?.name || 'Unknown'}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      {new Date(post.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      3 Min. To Read
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-3 line-clamp-2">
                    {post.description}
                  </p>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-sm text-purple-600 mt-2 hover:underline flex items-center gap-1 w-fit"
                  >
                    Read full Post →
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">
              No posts found matching "{initialQuery}"{selectedSlug ? ` in category "${selectedSlug}"` : ''}.
            </p>
          )}
        </div>

        {/* Category Filter */}
        <div className="w-full md:w-1/4">
          <div className="border border-gray-200 rounded-lg p-4 sticky top-20">
            <h4 className="font-semibold mb-4 text-gray-800">Filter By Categories</h4>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => handleCategoryClick(cat.slug)}
                  className={`text-sm px-3 py-1 rounded-full border transition-colors ${
                    selectedSlug === cat.slug
                      ? 'bg-purple-600 text-white border-purple-600'
                      : 'text-gray-600 border-gray-300 hover:bg-purple-100'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
              <button
                onClick={() => {
                  setSelectedSlug('')
                  router.push(`/search?q=${initialQuery}`)
                }}
                className={`text-sm px-3 py-1 rounded-full border transition-colors ${
                  selectedSlug === ''
                    ? 'bg-purple-600 text-white border-purple-600'
                    : 'text-gray-600 border-gray-300 hover:bg-purple-100'
                }`}
              >
                All
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Skeleton while loading
function SkeletonLoader() {
  return (
    <div className="space-y-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="animate-pulse flex gap-6">
          <div className="w-40 h-40 bg-gray-200 rounded-lg" />
          <div className="flex-1 space-y-4">
            <div className="w-1/3 h-4 bg-gray-200 rounded" />
            <div className="w-3/4 h-6 bg-gray-300 rounded" />
            <div className="w-1/2 h-4 bg-gray-200 rounded" />
            <div className="w-full h-3 bg-gray-100 rounded" />
            <div className="w-1/4 h-4 bg-purple-200 rounded" />
          </div>
        </div>
      ))}
    </div>
  )
}
