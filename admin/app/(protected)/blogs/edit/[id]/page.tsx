'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-toastify';
import { FileText, ArrowLeft, Image as ImageIcon, Sparkles, Settings } from 'lucide-react';
import api, { ApiResponse } from '@/lib/api';

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
  featuredImage: z.string().min(1, 'Featured image is required'),
});

type BlogFormData = z.infer<typeof blogSchema>;

// Data URIs stored directly in MongoDB — keep images modest in size
// (base64 inflates size ~33%, and MongoDB documents cap at 16MB total)
const RECOMMENDED_MAX_IMAGE_SIZE = 3 * 1024 * 1024; // 3MB

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export default function EditBlogPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
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
      featuredImage: '',
    },
  });

  // Fetch existing blog details
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await api.get<ApiResponse<any>>(`/blogs/${id}`);
        const blog = res.data.data;

        // Format tags list to comma-separated string
        const tagsString = blog.tags?.join(', ') || '';

        reset({
          title: blog.title,
          slug: blog.slug || '',
          shortDescription: blog.shortDescription || '',
          content: blog.content || '',
          category: blog.category || 'Technology',
          tags: tagsString,
          author: blog.author || 'Indux Team',
          status: blog.status || 'Draft',
          seoTitle: blog.seoTitle || '',
          seoDescription: blog.seoDescription || '',
          featuredImage: blog.featuredImage || '',
        });
        setImagePreview(blog.featuredImage || '');
      } catch (error) {
        // Handled
      } finally {
        setFetching(false);
      }
    };

    if (id) fetchBlog();
  }, [id, reset]);

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file.');
      return;
    }

    if (file.size > RECOMMENDED_MAX_IMAGE_SIZE) {
      toast.warning(
        `That image is ${(file.size / (1024 * 1024)).toFixed(1)}MB — large images can hit MongoDB's document size limit. Consider compressing it first.`
      );
    }

    try {
      const base64 = await fileToBase64(file);
      setValue('featuredImage', base64, { shouldValidate: true });
      setImagePreview(base64);
    } catch {
      toast.error('Failed to read the selected image.');
    }
  };

  const onSubmit = async (data: BlogFormData) => {
    setLoading(true);
    try {
      const tagsArray = data.tags ? data.tags.split(',').map((t) => t.trim()).filter(Boolean) : [];
      const payload = { ...data, tags: tagsArray };

      await api.put(`/blogs/${id}`, payload);

      toast.success('Article updated successfully');
      router.push('/blogs');
    } catch (error) {
      // Handled
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

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
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Edit Article</h1>
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
              />
              {errors.title && <p className="text-red-505 text-xs mt-1">{errors.title.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">Slug (optional)</label>
                <input
                  {...register('slug')}
                  className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-indigo-500 text-sm"
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
              />
              {errors.shortDescription && <p className="text-red-500 text-xs mt-1">{errors.shortDescription.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">Article Body * (HTML/Markdown supported)</label>
              <textarea
                {...register('content')}
                rows={10}
                className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-indigo-500 text-sm font-mono"
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
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-555 uppercase tracking-wide">SEO Meta Description (optional)</label>
              <input
                {...register('seoDescription')}
                className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-indigo-500 text-sm"
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
              />
              {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">Tags (comma separated)</label>
              <input
                {...register('tags')}
                className="mt-1 w-full px-4 py-2 border rounded-lg text-sm focus:outline-indigo-500"
              />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-gray-800 flex items-center gap-1.5">
              <ImageIcon className="text-indigo-650" size={18} /> Featured Image
            </h3>
            
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">Upload Image (to replace)</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="mt-1 w-full text-xs"
              />
              <input type="hidden" {...register('featuredImage')} />
              <p className="text-[10px] text-gray-400 mt-1">Leave empty to keep existing featured cover</p>
              {imagePreview && (
                <img src={imagePreview} alt="Featured image preview" className="mt-2 w-full h-32 object-cover rounded-lg border" />
              )}
              {errors.featuredImage && <p className="text-red-500 text-xs mt-1">{errors.featuredImage.message}</p>}
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
              {loading ? 'Saving...' : 'Update Article'}
            </button>
          </div>

        </div>

      </form>
    </div>
  );
}