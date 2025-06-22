'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ImagePlus, Loader2, ArrowLeft } from 'lucide-react';


// Helper to create URL-friendly slugs
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, '-')    // spaces & non-word chars → hyphens
    .replace(/^-+|-+$/g, '');     // trim leading/trailing hyphens
}

export default function CreatePost() {
  const router = useRouter();

  const [form, setForm] = useState({
    title: '',
    slug: '',
    content: '',
    category: '',
    coverImage: null,
  });
  const [categories, setCategories] = useState([]);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load categories
useEffect(() => {
  fetch('/api/categories')
    .then((r) => r.json())
    .then(data => {
      if (Array.isArray(data)) {
        setCategories(data);
      } else if (Array.isArray(data.categories)) {
        setCategories(data.categories);
      } else {
        setCategories([]);
      }
    })
    .catch(err => {
      console.error(err);
      setCategories([]);
    });
}, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'title') {
      const newTitle = value;
      setForm((f) => ({
        ...f,
        title: newTitle,
        slug: slugify(newTitle),
      }));
    } else if (name === 'coverImage' && files.length) {
      const file = files[0];
      setForm((f) => ({ ...f, coverImage: file }));
      setPreview(URL.createObjectURL(file));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = '';
      if (form.coverImage) {
        const data = new FormData();
        data.append('image', form.coverImage);

        const res = await fetch('/api/upload', { method: 'POST', body: data });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || 'Upload failed');
        imageUrl = json.url;
      }

      const payload = {
        title: form.title,
        content: form.content,
        category: form.category,
        coverImage: imageUrl,
      };

      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Create failed');

      router.push('/admin/posts');
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='max-w-5xl mx-auto p-6'>
      <button
        onClick={() => router.back()}
        className="flex items-center text-gray-700 hover:text-gray-900 mb-4"
      >
        <ArrowLeft className="w-5 h-5 mr-1" /> Back
      </button>
      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow space-y-6"
      >
        <h1 className="text-2xl font-bold text-gray-800">Create New Post</h1>

        {/* Title & Slug */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">Title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Slug</label>
            <input
              name="slug"
              value={form.slug}
              readOnly
              className="w-full bg-gray-100 border p-2 rounded cursor-not-allowed"
            />
          </div>
        </div>

        {/* Category & Tags */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              className="w-full border p-2 rounded"
            >
              <option value="">Select category</option>
              {Array.isArray(categories) && categories.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Content */}
        <div>
          <label className="block font-medium mb-1">Content</label>
          <textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            rows={8}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Cover Image Upload */}
        <div>
          <label className="block font-medium mb-2">Cover Image</label>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 border border-dashed border-gray-400 p-4 rounded cursor-pointer hover:bg-gray-50 transition">
              <ImagePlus className="w-6 h-6 text-gray-600" />
              <span className="text-sm text-gray-600">Upload Image</span>
              <input
                type="file"
                name="coverImage"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
              />
            </label>
            {preview && (
              <img
                src={preview}
                alt="preview"
                className="w-24 h-24 object-cover rounded border"
              />
            )}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin w-4 h-4" /> : null}
          {loading ? 'Submitting...' : 'Create Post'}
        </button>
      </form>
    </div>

  );
}
