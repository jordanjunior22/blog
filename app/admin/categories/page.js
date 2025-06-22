'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PlusCircle, Edit2, Trash2 } from 'lucide-react';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  // Fetch categories on mount
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch('/api/categories');
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to load');
        setCategories(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  // Delete handler
  const handleDelete = async (id) => {
    if (!confirm('Delete this category?')) return;
    try {
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Delete failed');
      }
      setCategories(categories.filter((c) => c._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <p className="p-6">Loading categories…</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Categories</h1>
        <button
          onClick={() => router.push('/admin/categories/new')}
          className="cursor-pionter flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          <PlusCircle className="w-5 h-5" />
          New Category
        </button>
      </div>

      {categories.length === 0 ? (
        <p>No categories found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow rounded-lg">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-left px-4 py-2">Name</th>
                <th className="text-left px-4 py-2">Slug</th>
                <th className="text-left px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{cat.name}</td>
                  <td className="px-4 py-2">{cat.slug}</td>
                  <td className="px-4 py-2 flex gap-4">
                    <button
                      onClick={() => router.push(`/admin/categories/${cat._id}`)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Edit"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(cat._id)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
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
