/* ---------------------------------------------
   app/(admin)/categories/[id]/page.tsx
   --------------------------------------------- */

'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Loader2, ImagePlus } from 'lucide-react';

function slugify(text) {
  return text.toString().toLowerCase().trim().replace(/[\s\W-]+/g, '-').replace(/^-+|-+$/g, '');
}

export default function EditCategoryPage() {
  const router = useRouter();
  const { id }  = useParams();

  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    coverImage: '',          // existing URL in DB
    coverImageFile: null, // newly chosen file
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState('');

  /* ---------- load category ---------- */
  useEffect(() => {
    (async () => {
      try {
        const res  = await fetch(`/api/categories/${id}`);
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || 'Failed to load category');

        setForm({
          name: json.name,
          slug: json.slug,
          description: json.description || '',
          coverImage: json.coverImage || '',
          coverImageFile: null,
        });
      } catch (err) {
        alert(err.message);
        router.push('/admin/categories');
      } finally {
        setLoading(false);
      }
    })();
  }, [id, router]);

  /* ---------- handlers ---------- */
  const handleChange = (
    e,
  ) => {
    const { name, value } = e.target;
    const files = e.target.files;

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
    setSaving(true);
    setError('');

    try {
      /* 1️⃣ Upload new image if provided */
      let coverImageUrl = form.coverImage;
      if (form.coverImageFile) {
        const data = new FormData();
        data.append('image', form.coverImageFile);

        const up = await fetch('/api/upload', { method: 'POST', body: data });
        const upJson = await up.json();
        if (!up.ok) throw new Error(upJson.error || 'Upload failed');

        coverImageUrl = upJson.url;
      }

      /* 2️⃣ Update category */
      const payload = {
        name: form.name,
        slug: form.slug,
        description: form.description,
        coverImage: coverImageUrl,
      };

      const res   = await fetch(`/api/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json  = await res.json();
      if (!res.ok) throw new Error(json.error || 'Update failed');

      router.push('/admin/categories');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="p-6 text-gray-600">Loading category…</p>;

  /* ---------- UI ---------- */
  return (
    <div className="max-w-xl mx-auto p-6">
      <button
        onClick={() => router.back()}
        className="flex items-center text-gray-700 hover:text-gray-900 mb-4"
      >
        <ArrowLeft className="w-5 h-5 mr-1" /> Back
      </button>

      <form
        onSubmit={handleSubmit}
        className="p-6 bg-white rounded-xl shadow space-y-6"
      >
        <h1 className="text-2xl font-bold text-gray-800">Edit Category</h1>
        {error && <p className="text-red-600">{error}</p>}

        {/* name */}
        <div>
          <label className="block text-sm font-semibold mb-1">Name</label>
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
          <label className="block text-sm font-semibold mb-1">Slug</label>
          <input
            value={form.slug}
            readOnly
            className="w-full bg-gray-100 border p-2 rounded cursor-not-allowed text-gray-500"
          />
        </div>

        {/* description */}
        <div>
          <label className="block text-sm font-semibold mb-1">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            className="w-full border p-2 rounded"
            placeholder="Describe this category…"
          />
        </div>

        {/* current or preview image */}
        {(preview || form.coverImage) && (
          <div>
            <label className="block text-sm font-semibold mb-1">
              {preview ? 'New Image Preview' : 'Current Image'}
            </label>
            <img
              src={preview || form.coverImage}
              alt="cover"
              className="w-32 rounded border"
            />
          </div>
        )}

        {/* choose new image */}
        <div>
          <label className="block font-medium mb-2">Change Cover Image</label>
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
          </div>
        </div>

        {/* save */}
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {saving && <Loader2 className="animate-spin w-4 h-4" />}
          {saving ? 'Saving…' : 'Update Category'}
        </button>
      </form>
    </div>
  );
}
