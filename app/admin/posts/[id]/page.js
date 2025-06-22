'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ImagePlus, Loader2, ArrowLeft } from 'lucide-react';

// slugify helper
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function EditPost() {
  const router = useRouter();
  const { id } = useParams();

  const [form, setForm] = useState({
    title: '',
    slug: '',
    content: '',
    category: '',
    coverImageUrl: '',
    newCover: null,
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const [postRes, catRes] = await Promise.all([
          fetch(`/api/posts/${id}`),
          fetch('/api/categories'),
        ]);
        const postJson = await postRes.json();
        const catJson = await catRes.json();
        if (!postRes.ok) throw new Error(postJson.error);
        setForm({
          title: postJson.title,
          slug: postJson.slug,
          content: postJson.content,
          category: postJson.category || '',
          coverImageUrl: postJson.coverImage,
          newCover: null,
        });

        if (postJson.coverImage) setPreview(postJson.coverImage);
        setCategories(catJson);
      } catch (err) {
        alert(err.message);
        router.push('/admin/posts');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, router]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'title') {
      const t = value;
      setForm((f) => ({ ...f, title: t, slug: slugify(t) }));
    } else if (name === 'newCover' && files.length) {
      const file = files[0];
      setForm((f) => ({ ...f, newCover: file }));
      setPreview(URL.createObjectURL(file));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let coverImage = form.coverImageUrl;
      if (form.newCover) {
        const data = new FormData();
        data.append('image', form.newCover);
        const res = await fetch('/api/upload', { method: 'POST', body: data });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error);
        coverImage = json.url;
      }

      const payload = {
        title: form.title,
        slug: form.slug,
        content: form.content,
        category: form.category,
        coverImage,
      };

      const res = await fetch(`/api/posts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      router.push('/admin/posts');
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="p-6 text-gray-600">Loading post…</p>;

  return (
    <div className="max-w-xl mx-auto p-6">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="flex items-center text-gray-700 hover:text-gray-900 mb-4 transition"
      >
        <ArrowLeft className="w-5 h-5 mr-1" /> Back
      </button>

      <form
        onSubmit={handleSubmit}
        className="p-6 bg-white rounded-xl shadow space-y-6"
      >
        <h1 className="text-2xl font-bold text-gray-800">Edit Post</h1>

        {/* Title & Slug */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full border p-2 rounded focus:outline-none focus:ring focus:border-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Slug</label>
            <input
              name="slug"
              value={form.slug}
              readOnly
              className="w-full bg-gray-100 border p-2 rounded text-gray-500 cursor-not-allowed"
            />
          </div>
        </div>

        {/* Category & Tags */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              className="w-full border p-2 rounded"
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-semibold mb-1">Content</label>
          <textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            rows={6}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Cover Image */}
        <div>
          <label className="block text-sm font-semibold mb-2">Cover Image</label>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <label className="flex items-center gap-2 border border-dashed border-gray-400 p-4 rounded cursor-pointer hover:bg-gray-50 transition">
              <ImagePlus className="w-6 h-6 text-gray-600" />
              <span className="text-sm text-gray-600">Change Image</span>
              <input
                type="file"
                name="newCover"
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

        {/* Save */}
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
        >
          {saving && <Loader2 className="animate-spin w-4 h-4" />}
          {saving ? 'Saving...' : 'Update Post'}
        </button>
      </form>
    </div>
  );
}
