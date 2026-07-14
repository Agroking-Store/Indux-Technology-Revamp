'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-toastify';
import { FileText, ArrowLeft, Image as ImageIcon, Sparkles, Settings } from 'lucide-react';
import api from '@/lib/api';

const blogSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().optional(),
  shortDescription: z.string().min(1, 'Short description is required').max(300),
  content: z.string().min(1, 'Content is required'),
  category: z.string().min(1, 'Category is required'),
  tags: z.string().optional(),
  author: z.string().min(1, 'Author is required'),
  status: z.enum(['Draft', 'Published']),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

type BlogFormData = z.infer<typeof blogSchema>;

export default function CreateBlogPage() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BlogFormData>({
    resolver: zodResolver(blogSchema),
    defaultValues: { 
      status: 'Draft',
      slug: '',
      shortDescription: '',
      content: '',
      category: 'Technology',
      tags: '',
      author: 'Indux Team',
      seoTitle: '',
      seoDescription: '',
    },
  });

  const onSubmit = async (data: BlogFormData) => {
    if (!imageFile) {
      toast.error('Please select a featured image.');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        if (key === 'tags' && value) {
          const tagsArray = value.split(',').map((t) => t.trim()).filter(Boolean);
          formData.append(key, JSON.stringify(tagsArray));
        } else if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });

      formData.append('featuredImage', imageFile);

      await api.post('/blogs', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Article created successfully');
      router.push('/blogs');
    } catch (error) {
      // Handled
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex items-center gap-4 border-b pb-4">
        <button
          type="button"
          onClick={() => router.push('/blogs')}
          className="p-2 hover:bg-slate-100 rounded-xl transition text-slate-500"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Create Article</h1>
          <p className="text-gray-500 text-sm mt-1">Compose article content, categories, and SEO configurations.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
        
        {/* Left: Content fields */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <FileText className="text-indigo-600 size-5" /> Article Content
            </h3>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">Article Title *</label>
              <input
                {...register('title')}
                className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-indigo-500 text-sm"
                placeholder="e.g. Navigating Next.js 16 Compiler Performance"
              />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">Slug (optional)</label>
                <input
                  {...register('slug')}
                  className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-indigo-500 text-sm"
                  placeholder="auto-generated from title"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">Author *</label>
                <input
                  {...register('author')}
                  className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-indigo-500 text-sm"
                />
                {errors.author && <p className="text-red-500 text-xs mt-1">{errors.author.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">Short Summary *</label>
              <textarea
                {...register('shortDescription')}
                rows={2}
                maxLength={300}
                className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-indigo-500 text-sm"
                placeholder="Quick hook summary displayed in cards (max 300 chars)"
              />
              {errors.shortDescription && <p className="text-red-500 text-xs mt-1">{errors.shortDescription.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">Article Body * (HTML/Markdown supported)</label>
              <textarea
                {...register('content')}
                rows={10}
                className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-indigo-500 text-sm font-mono"
                placeholder="Write full blog post contents here..."
              />
              {errors.content && <p className="text-red-500 text-xs mt-1">{errors.content.message}</p>}
            </div>
          </div>

          {/* SEO Panel */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Settings className="text-indigo-600 size-5" /> SEO Settings
            </h3>
            
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">SEO Search Title (optional)</label>
              <input
                {...register('seoTitle')}
                className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-indigo-500 text-sm"
                placeholder="SEO title tag override"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-555 uppercase tracking-wide">SEO Meta Description (optional)</label>
              <input
                {...register('seoDescription')}
                className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-indigo-500 text-sm"
                placeholder="SEO meta description snippet override"
              />
            </div>
          </div>

        </div>

        {/* Right: metadata & media */}
        <div className="space-y-6">
          
          <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-gray-800">Parameters</h3>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">Status</label>
              <select
                {...register('status')}
                className="mt-1 w-full px-3 py-2 border rounded-lg text-sm bg-white focus:outline-indigo-500"
              >
                <option value="Draft">Draft</option>
                <option value="Published">Published</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">Category *</label>
              <input
                {...register('category')}
                className="mt-1 w-full px-4 py-2 border rounded-lg text-sm focus:outline-indigo-500"
                placeholder="e.g. Tech, Dev, AI"
              />
              {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">Tags (comma separated)</label>
              <input
                {...register('tags')}
                className="mt-1 w-full px-4 py-2 border rounded-lg text-sm focus:outline-indigo-500"
                placeholder="react, nextjs, routing"
              />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-gray-800 flex items-center gap-1.5">
              <ImageIcon className="text-indigo-650" size={18} /> Featured Image
            </h3>
            
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">Upload Image *</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                className="mt-1 w-full text-xs"
              />
              {imageFile && (
                <div className="mt-2 text-[10px] text-emerald-600 font-bold bg-emerald-50 p-1.5 rounded-lg border border-emerald-100">
                  ✓ Selected: {imageFile.name}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => router.push('/blogs')}
              className="flex-grow py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition text-sm text-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-grow py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition disabled:opacity-50 text-sm text-center"
            >
              {loading ? 'Submitting...' : 'Write Post'}
            </button>
          </div>

        </div>

      </form>
    </div>
  );
}