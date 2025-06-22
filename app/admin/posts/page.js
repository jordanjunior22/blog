"use client"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  PlusCircle,
  Edit2,
  Trash2,
  ThumbsUp,
  ThumbsDown,
  Star,
  StarOff,
} from 'lucide-react';

export default function AdminPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/posts');
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to load posts');
        setPosts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const toggleFeatured = async (id) => {
    try {
      const res = await fetch(`/api/posts/${id}/toggle-featured`, {
        method: 'PATCH',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to toggle featured');

      // Only one post should be featured at a time
      setPosts((prev) =>
        prev.map((p) => ({
          ...p,
          featured: p._id === id ? data.featured : false,
        }))
      );
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this post?');
    if (!confirmed) return;
    try {
      const res = await fetch(`/api/posts/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to delete post');
      }
      setPosts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <p className="p-6">Loading posts…</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Posts</h1>
        <button
          onClick={() => router.push('/admin/posts/new')}
          className="cursor-pionter flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          <PlusCircle className="w-5 h-5" />
          New Post
        </button>
      </div>

      {posts.length === 0 ? (
        <p>No posts found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow rounded-lg">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left">Title</th>
                <th className="px-4 py-2 text-left">Author</th>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Likes</th>
                <th className="px-4 py-2 text-left">Dislikes</th>
                <th className="px-4 py-2 text-left">Featured</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr
                  key={post._id}
                  className={`border-t hover:bg-gray-50 ${
                    post.featured ? 'bg-yellow-50' : ''
                  }`}
                >
                  <td className="px-4 py-2 font-medium">{post.title}</td>
                  <td className="px-4 py-2">{post.author?.name || '—'}</td>
                  <td className="px-4 py-2">
                    {post.createdAt
                      ? new Date(post.createdAt).toLocaleDateString()
                      : '—'}
                  </td>
                  <td className="px-4 py-2">
                    <div className="inline-flex items-center gap-1 text-green-600 font-semibold">
                      <ThumbsUp className="w-5 h-5" />
                      <span>{post.likes?.length || 0}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <div className="inline-flex items-center gap-1 text-red-600 font-semibold">
                      <ThumbsDown className="w-5 h-5" />
                      <span>{post.dislikes?.length || 0}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => toggleFeatured(post._id)}
                      className={`flex items-center gap-1 px-2 py-1 rounded text-sm cursor-pointer ${
                        post.featured
                          ? 'bg-yellow-400 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {post.featured ? (
                        <>
                          <Star className="w-4 h-4" />
                          Featured
                        </>
                      ) : (
                        <>
                          <StarOff className="w-4 h-4" />
                          Set as Featured
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-4 py-2">
                    <div className="inline-flex gap-4 items-center">
                      <button
                        onClick={() => router.push(`/admin/posts/${post._id}`)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(post._id)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
