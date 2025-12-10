'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  ArrowLeft, 
  Loader2, 
  ImagePlus, 
  Edit3,
  Tag,
  FileText,
  Image,
  AlertCircle,
  CheckCircle,
  X,
  Trash2
} from 'lucide-react';

function slugify(text) {
  return text.toString().toLowerCase().trim().replace(/[\s\W-]+/g, '-').replace(/^-+|-+$/g, '');
}

export default function EditCategoryPage() {
  const router = useRouter();
  const { id } = useParams();

  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    coverImage: '',
    coverImageFile: null,
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notification, setNotification] = useState(null);

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/categories/${id}`);
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
        showNotification('error', err.message);
        setTimeout(() => router.push('/admin/categories'), 2000);
      } finally {
        setLoading(false);
      }
    })();
  }, [id, router]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'coverImage') {
      const file = files?.[0] || null;
      setForm((f) => ({ ...f, coverImageFile: file }));
      if (file) {
        setPreview(URL.createObjectURL(file));
        showNotification('success', 'New image selected!');
      }
    } else {
      setForm((f) => ({
        ...f,
        [name]: value,
        slug: name === 'name' ? slugify(value) : f.slug,
      }));
    }
  };

  const handleRemoveImage = () => {
    setForm((f) => ({ ...f, coverImageFile: null, coverImage: '' }));
    setPreview(null);
    showNotification('info', 'Image removed');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      let coverImageUrl = form.coverImage;
      if (form.coverImageFile) {
        const data = new FormData();
        data.append('image', form.coverImageFile);

        const up = await fetch('/api/upload', { method: 'POST', body: data });
        const upJson = await up.json();
        if (!up.ok) throw new Error(upJson.error || 'Upload failed');

        coverImageUrl = upJson.url;
      }

      const payload = {
        name: form.name,
        slug: form.slug,
        description: form.description,
        coverImage: coverImageUrl,
      };

      const res = await fetch(`/api/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Update failed');

      showNotification('success', 'Category updated successfully!');
      setTimeout(() => router.push('/admin/categories'), 1000);
    } catch (err) {
      setError(err.message);
      showNotification('error', err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-2 sm:p-4 md:p-6 flex items-center justify-center">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-8 flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 animate-spin text-purple-600" />
          <p className="text-sm sm:text-base text-gray-600 font-medium">Loading category...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-2 sm:p-4 md:p-6">
      {notification && (
        <div className={`fixed top-2 right-2 sm:top-4 sm:right-4 md:top-6 md:right-6 z-50 flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl shadow-2xl animate-slide-in max-w-[calc(100vw-1rem)] sm:max-w-md ${
          notification.type === 'success' ? 'bg-green-500' : 
          notification.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
        } text-white`}>
          {notification.type === 'success' && <CheckCircle className="w-4 h-4 flex-shrink-0" />}
          {notification.type === 'error' && <AlertCircle className="w-4 h-4 flex-shrink-0" />}
          {notification.type === 'info' && <AlertCircle className="w-4 h-4 flex-shrink-0" />}
          <span className="font-medium text-xs sm:text-sm flex-1 min-w-0 truncate">{notification.message}</span>
          <button 
            onClick={() => setNotification(null)}
            className="ml-1 hover:bg-white/20 rounded-lg p-1 transition-colors flex-shrink-0"
          >
            <X className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>

      <div className="max-w-3xl mx-auto">
        <div className="mb-4 sm:mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-700 hover:text-purple-600 transition-colors mb-3 sm:mb-4 group"
          >
            <div className="p-1.5 sm:p-2 rounded-lg bg-white shadow-sm group-hover:shadow-md group-hover:bg-purple-50 transition-all">
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <span className="font-medium text-sm sm:text-base">Back to Categories</span>
          </button>

          <div className="flex items-center gap-3 sm:gap-4">
            <div className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 shadow-lg">
              <Edit3 className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-playfair)' }}>
                Edit Category
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">Update category details and settings</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-1.5 sm:h-2"></div>
          
          <div className="p-4 sm:p-6 md:p-8 space-y-5 sm:space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg sm:rounded-xl p-3 sm:p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-red-900 text-sm sm:text-base">Error</h3>
                  <p className="text-xs sm:text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            )}

            <div>
              <label className="flex items-center gap-2 font-semibold text-gray-900 mb-2 text-sm sm:text-base">
                <Tag className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                Category Name
                <span className="text-red-500">*</span>
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="e.g., Technology, Travel, Food"
                className="w-full border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 rounded-lg sm:rounded-xl px-3 py-2 sm:px-4 sm:py-3 transition-all outline-none text-sm sm:text-base"
              />
              <p className="text-xs sm:text-sm text-gray-500 mt-2">Choose a clear, descriptive name for your category</p>
            </div>

            <div>
              <label className="flex items-center gap-2 font-semibold text-gray-900 mb-2 text-sm sm:text-base">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                URL Slug
                <span className="text-xs sm:text-sm font-normal text-gray-500 ml-1">(auto-generated)</span>
              </label>
              <div className="relative">
                <input
                  value={form.slug}
                  readOnly
                  placeholder="auto-generated-from-name"
                  className="w-full bg-gray-50 border-2 border-gray-200 rounded-lg sm:rounded-xl px-3 py-2 sm:px-4 sm:py-3 cursor-not-allowed font-mono text-xs sm:text-sm text-gray-600"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-md font-medium">
                  Auto
                </div>
              </div>
              <p className="text-xs sm:text-sm text-gray-500 mt-2">This URL-friendly version is generated automatically</p>
            </div>

            <div>
              <label className="flex items-center gap-2 font-semibold text-gray-900 mb-2 text-sm sm:text-base">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                placeholder="Describe what this category is about..."
                className="w-full border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 rounded-lg sm:rounded-xl px-3 py-2 sm:px-4 sm:py-3 transition-all outline-none resize-none text-sm sm:text-base"
              />
              <p className="text-xs sm:text-sm text-gray-500 mt-2">Optional: Add a brief description for this category</p>
            </div>

            <div>
              <label className="flex items-center gap-2 font-semibold text-gray-900 mb-3 text-sm sm:text-base">
                <Image className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                Cover Image
              </label>

              {!preview && !form.coverImage ? (
                <label className="block border-2 border-dashed border-gray-300 rounded-lg sm:rounded-xl p-6 sm:p-8 md:p-12 hover:border-purple-400 hover:bg-purple-50/50 transition-all cursor-pointer group">
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-purple-100 flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-purple-200 transition-colors">
                      <ImagePlus className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
                    </div>
                    <p className="text-sm sm:text-base font-semibold text-gray-900 mb-1">Click to upload image</p>
                    <p className="text-xs sm:text-sm text-gray-500">PNG, JPG, WEBP up to 10MB</p>
                  </div>
                  <input
                    type="file"
                    name="coverImage"
                    accept="image/*"
                    onChange={handleChange}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="space-y-3">
                  <div className="relative rounded-lg sm:rounded-xl overflow-hidden border-2 border-gray-200 group">
                    <img
                      src={preview || form.coverImage}
                      alt="cover"
                      className="w-full h-48 sm:h-64 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 sm:gap-3">
                      <label className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg flex items-center gap-2 transition-colors cursor-pointer text-sm sm:text-base">
                        <ImagePlus className="w-4 h-4" />
                        Change
                        <input
                          type="file"
                          name="coverImage"
                          accept="image/*"
                          onChange={handleChange}
                          className="hidden"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg flex items-center gap-2 transition-colors text-sm sm:text-base"
                      >
                        <Trash2 className="w-4 h-4" />
                        Remove
                      </button>
                    </div>
                    {preview && (
                      <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-orange-500 text-white text-xs px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg font-medium flex items-center gap-1.5 shadow-lg">
                        <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                        New Image
                      </div>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500 text-center">
                    {preview ? 'New image selected - will be saved when you update' : 'Current category image'}
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 px-4 py-2.5 sm:px-6 sm:py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg sm:rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={saving || !form.name}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2.5 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold text-sm sm:text-base"
              >
                {saving && <Loader2 className="animate-spin w-4 h-4 sm:w-5 sm:h-5" />}
                {saving ? 'Updating...' : 'Update Category'}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-4 sm:mt-6 bg-blue-50 border border-blue-200 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6">
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 p-2 rounded-lg flex-shrink-0">
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-1 text-sm sm:text-base">Editing Tips</h3>
              <ul className="text-xs sm:text-sm text-blue-800 space-y-1">
                <li>• Changes will be applied to all posts using this category</li>
                <li>• The URL slug updates automatically when you change the name</li>
                <li>• Upload a new image to replace the current one</li>
                <li>• Click "Remove" to delete the cover image entirely</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}