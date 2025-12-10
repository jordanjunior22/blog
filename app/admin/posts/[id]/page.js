'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  ImagePlus, 
  Loader2, 
  ArrowLeft, 
  X, 
  CheckCircle, 
  XCircle,
  FileText,
  FolderOpen,
  Link as LinkIcon,
  Image as ImageIcon,
  Edit3,
  Save
} from 'lucide-react';

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
  const [notification, setNotification] = useState(null);

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  useEffect(() => {
    async function load() {
      try {
        const [postRes, catRes] = await Promise.all([
          fetch(`/api/posts/${id}`),
          fetch('/api/categories'),
        ]);
        const postJson = await postRes.json();
        const catJson = await catRes.json();
        
        if (!postRes.ok) throw new Error(postJson.error || 'Failed to load post');
        
        setForm({
          title: postJson.title,
          slug: postJson.slug,
          content: postJson.content,
          category: postJson.category?._id || postJson.category || '',
          coverImageUrl: postJson.coverImage,
          newCover: null,
        });

        if (postJson.coverImage) setPreview(postJson.coverImage);
        
        // Handle different category response formats
        if (Array.isArray(catJson)) {
          setCategories(catJson);
        } else if (Array.isArray(catJson.categories)) {
          setCategories(catJson.categories);
        } else {
          setCategories([]);
        }
        
        showNotification('success', 'Post loaded successfully!');
      } catch (err) {
        showNotification('error', err.message);
        setTimeout(() => router.push('/admin/posts'), 2000);
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
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showNotification('error', 'Image size must be less than 5MB');
        return;
      }
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        showNotification('error', 'Please select a valid image file');
        return;
      }
      
      setForm((f) => ({ ...f, newCover: file }));
      setPreview(URL.createObjectURL(file));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const removeImage = () => {
    setForm((f) => ({ ...f, newCover: null, coverImageUrl: '' }));
    setPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      let coverImage = form.coverImageUrl;
      
      if (form.newCover) {
        showNotification('info', 'Uploading new image...');
        const data = new FormData();
        data.append('image', form.newCover);
        const res = await fetch('/api/upload', { method: 'POST', body: data });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || 'Image upload failed');
        coverImage = json.url;
      }

      showNotification('info', 'Updating post...');
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
      if (!res.ok) throw new Error(json.error || 'Update failed');
      
      showNotification('success', 'Post updated successfully!');
      setTimeout(() => {
        router.push('/admin/posts');
      }, 1500);
    } catch (err) {
      showNotification('error', err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading post...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-2 sm:p-4 md:p-6'>
      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-2 right-2 sm:top-6 sm:right-6 z-50 flex items-center gap-2 sm:gap-3 px-3 py-2 sm:px-6 sm:py-4 rounded-lg sm:rounded-xl shadow-2xl animate-slide-in max-w-[calc(100vw-1rem)] sm:max-w-md ${
          notification.type === 'success' ? 'bg-green-500' : 
          notification.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
        } text-white`}>
          {notification.type === 'success' && <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />}
          {notification.type === 'error' && <XCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />}
          {notification.type === 'info' && <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin flex-shrink-0" />}
          <span className="font-medium text-sm sm:text-base flex-1 min-w-0 truncate">{notification.message}</span>
          <button 
            onClick={() => setNotification(null)}
            className="ml-1 sm:ml-2 hover:bg-white/20 rounded-lg p-1 transition-colors flex-shrink-0"
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

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-3 sm:mb-4 group"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium text-sm sm:text-base">Back to Posts</span>
          </button>
          
          <div className="flex items-center gap-2 sm:gap-3 mb-2">
            <div className="bg-gradient-to-br from-purple-600 to-blue-600 p-2 sm:p-3 rounded-lg sm:rounded-xl shadow-lg">
              <Edit3 className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-playfair)' }}>
              Edit Post
            </h1>
          </div>
          <p className="text-gray-600 text-sm sm:text-base ml-10 sm:ml-[60px]">Update your post content and settings</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
          {/* Title & Slug */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <FileText className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600" />
                <span className="text-xs sm:text-sm">Title</span>
              </label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                placeholder="Enter post title..."
                className="w-full border border-gray-300 p-2 sm:p-3 rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <LinkIcon className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600" />
                <span className="text-xs sm:text-sm">Slug (Auto-generated)</span>
              </label>
              <input
                name="slug"
                value={form.slug}
                readOnly
                className="w-full bg-gray-50 border border-gray-300 p-2 sm:p-3 rounded-lg text-sm sm:text-base cursor-not-allowed text-gray-600"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <FolderOpen className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600" />
              <span className="text-xs sm:text-sm">Category</span>
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 p-2 sm:p-3 rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
            >
              <option value="">Select a category</option>
              {Array.isArray(categories) && categories.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Content */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <FileText className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600" />
              <span className="text-xs sm:text-sm">Content</span>
            </label>
            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              rows={8}
              required
              placeholder="Write your post content here..."
              className="w-full border border-gray-300 p-2 sm:p-3 rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all resize-none"
            />
            <p className="text-xs text-gray-500 mt-1 sm:mt-2">
              {form.content.length} characters
            </p>
          </div>

          {/* Cover Image */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <ImageIcon className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600" />
              <span className="text-xs sm:text-sm">Cover Image</span>
            </label>
            
            {!preview ? (
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg sm:rounded-xl p-4 sm:p-8 cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-all group">
                <div className="bg-purple-100 p-3 sm:p-4 rounded-full mb-2 sm:mb-3 group-hover:scale-110 transition-transform">
                  <ImagePlus className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-700 mb-1 text-center">
                  Click to upload cover image
                </span>
                <span className="text-xs text-gray-500 text-center">
                  PNG, JPG, GIF up to 5MB
                </span>
                <input
                  type="file"
                  name="newCover"
                  accept="image/*"
                  onChange={handleChange}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="relative inline-block w-full">
                <img
                  src={preview}
                  alt="preview"
                  className="w-full h-48 sm:h-64 object-cover rounded-lg sm:rounded-xl border-2 border-gray-200 shadow-lg"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-red-500 hover:bg-red-600 text-white p-1.5 sm:p-2 rounded-lg shadow-lg transition-colors"
                  title="Remove image"
                >
                  <X className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
                <label className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 bg-white hover:bg-gray-50 text-gray-700 p-1.5 sm:p-2 rounded-lg shadow-lg transition-colors cursor-pointer">
                  <ImagePlus className="w-4 h-4 sm:w-5 sm:h-5" />
                  <input
                    type="file"
                    name="newCover"
                    accept="image/*"
                    onChange={handleChange}
                    className="hidden"
                  />
                </label>
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="w-full sm:flex-1 px-4 sm:px-6 py-2.5 sm:py-3 border border-gray-300 text-gray-700 rounded-lg sm:rounded-xl hover:bg-gray-50 font-medium transition-colors text-sm sm:text-base"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="w-full sm:flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 text-sm sm:text-base"
            >
              {saving ? (
                <>
                  <Loader2 className="animate-spin w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Updating Post...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Update Post</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}