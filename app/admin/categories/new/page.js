/* ---------------------------------------------
   app/(admin)/categories/new/page.tsx
   --------------------------------------------- */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, ImagePlus } from 'lucide-react';

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function NewCategoryPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    coverImageFile: null, // local file
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');

  /* ---------- handlers ---------- */
  const handleChange = (
    e,
  ) => {
    const { name, value, files } = /** @type {HTMLInputElement} */ (e.target);

    if (name === 'coverImage') {
      const file = files?.[0] || null;
      setForm((f) => ({ ...f, coverImageFile: file }));
      if (file) setPreview(URL.createObjectURL(file));
    } else {
      setForm((f) => ({
        ...f,
        [name]: value,
        slug: name === 'name' ? slugify(value) : f.slug,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. Upload image if user picked one
      let coverImageUrl = '';
      if (form.coverImageFile) {
        const data = new FormData();
        data.append('image', form.coverImageFile);

        const up = await fetch('/api/upload', { method: 'POST', body: data });
        const upJson = await up.json();
        if (!up.ok) throw new Error(upJson.error || 'Image upload failed');

        coverImageUrl = upJson.url;
      }

      // 2. Create category
      const payload = {
        name: form.name,
        slug: form.slug,
        description: form.description,
        coverImage: coverImageUrl,
      };

      const res   = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json  = await res.json();
      if (!res.ok) throw new Error(json.error || 'Creation failed');

      router.push('/admin/categories');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ---------- UI ---------- */
  return (
    <div className="max-w-md mx-auto p-6">
      <button
        onClick={() => router.back()}
        className="flex items-center text-gray-700 hover:text-gray-900 mb-4"
      >
        <ArrowLeft className="w-5 h-5 mr-1" /> Back
      </button>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow space-y-5"
      >
        <h1 className="text-2xl font-bold">New Category</h1>
        {error && <p className="text-red-600">{error}</p>}

        {/* name */}
        <div>
          <label className="block font-medium mb-1">Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        {/* slug */}
        <div>
          <label className="block font-medium mb-1">Slug</label>
          <input
            value={form.slug}
            readOnly
            className="w-full bg-gray-100 border p-2 rounded cursor-not-allowed"
          />
        </div>

        {/* description */}
        <div>
          <label className="block font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* image */}
        <div>
          <label className="block font-medium mb-2">Cover Image</label>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 border border-dashed border-gray-400 p-4 rounded cursor-pointer hover:bg-gray-50 transition">
              <ImagePlus className="w-6 h-6 text-gray-600" />
              <span className="text-sm text-gray-600">Upload</span>
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

        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading && <Loader2 className="animate-spin w-4 h-4" />}
          {loading ? 'Submitting…' : 'Create Category'}
        </button>
      </form>
    </div>
  );
}
