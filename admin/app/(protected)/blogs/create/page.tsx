'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-toastify';
import { FileText, ArrowLeft, Image as ImageIcon, Settings } from 'lucide-react';
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
  featuredImage: z.string().min(1, 'Featured image is required'),
});

type BlogFormData = z.infer<typeof blogSchema>;

const RECOMMENDED_MAX_IMAGE_SIZE = 3 * 1024 * 1024; // 3MB

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export default function CreateBlogPage() {
  const [imagePreview, setImagePreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
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

      await api.post('/blogs', payload);

      toast.success('Article created successfully');
      router.push('/blogs');
    } catch (error) {
      // Handled
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <button
          type="button"
          onClick={() => router.push('/blogs')}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition text-slate-500 dark:text-slate-400"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Create Article</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Compose article content, categories, and SEO configurations.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
        
        {/* Left: Content fields */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white dark:bg-slate-900/60 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <FileText className="text-indigo-600 dark:text-indigo-400 size-5" /> Article Content
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Article Title *</label>
              <input
                {...register('title')}
                className="mt-1 w-full px-4 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-lg focus:outline-indigo-500 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
                placeholder="e.g. Navigating Next.js 16 Compiler Performance"
              />
              {errors.title && <p className="text-rose-500 dark:text-rose-400 text-xs mt-1">{errors.title.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Slug (optional)</label>
                <input
                  {...register('slug')}
                  className="mt-1 w-full px-4 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-lg focus:outline-indigo-500 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
                  placeholder="auto-generated from title"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Author *</label>
                <input
                  {...register('author')}
                  className="mt-1 w-full px-4 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-lg focus:outline-indigo-500 text-sm text-slate-900 dark:text-slate-100"
                />
                {errors.author && <p className="text-rose-500 dark:text-rose-400 text-xs mt-1">{errors.author.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Short Summary *</label>
              <textarea
                {...register('shortDescription')}
                rows={2}
                maxLength={300}
                className="mt-1 w-full px-4 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-lg focus:outline-indigo-500 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
                placeholder="Quick hook summary displayed in cards (max 300 chars)"
              />
              {errors.shortDescription && <p className="text-rose-500 dark:text-rose-400 text-xs mt-1">{errors.shortDescription.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Article Body * (HTML/Markdown supported)</label>
              <textarea
                {...register('content')}
                rows={10}
                className="mt-1 w-full px-4 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-lg focus:outline-indigo-500 text-sm font-mono text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
                placeholder="Write full blog post contents here..."
              />
              {errors.content && <p className="text-rose-500 dark:text-rose-400 text-xs mt-1">{errors.content.message}</p>}
            </div>
          </div>

          {/* SEO Panel */}
          <div className="bg-white dark:bg-slate-900/60 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Settings className="text-indigo-600 dark:text-indigo-400 size-5" /> SEO Settings
            </h3>
            
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">SEO Search Title (optional)</label>
              <input
                {...register('seoTitle')}
                className="mt-1 w-full px-4 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-lg focus:outline-indigo-500 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
                placeholder="SEO title tag override"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">SEO Meta Description (optional)</label>
              <input
                {...register('seoDescription')}
                className="mt-1 w-full px-4 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-lg focus:outline-indigo-500 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
                placeholder="SEO meta description snippet override"
              />
            </div>
          </div>

        </div>

        {/* Right: metadata & media */}
        <div className="space-y-6">
          
          <div className="bg-white dark:bg-slate-900/60 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Parameters</h3>

            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Status</label>
              <select
                {...register('status')}
                className="mt-1 w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-indigo-500"
              >
                <option value="Draft">Draft</option>
                <option value="Published">Published</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Category *</label>
              <input
                {...register('category')}
                className="mt-1 w-full px-4 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-lg text-sm text-slate-900 dark:text-slate-100 focus:outline-indigo-500 placeholder-slate-400 dark:placeholder-slate-500"
                placeholder="e.g. Tech, Dev, AI"
              />
              {errors.category && <p className="text-rose-500 dark:text-rose-400 text-xs mt-1">{errors.category.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Tags (comma separated)</label>
              <input
                {...register('tags')}
                className="mt-1 w-full px-4 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-lg text-sm text-slate-900 dark:text-slate-100 focus:outline-indigo-500 placeholder-slate-400 dark:placeholder-slate-500"
                placeholder="react, nextjs, routing"
              />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900/60 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <ImageIcon className="text-indigo-600 dark:text-indigo-400" size={18} /> Featured Image
            </h3>
            
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Upload Image *</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="mt-1 w-full text-xs text-slate-500 dark:text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 dark:file:bg-indigo-950/50 file:text-indigo-700 dark:file:text-indigo-300 hover:file:bg-indigo-100 dark:hover:file:bg-indigo-900/50 cursor-pointer"
              />
              <input type="hidden" {...register('featuredImage')} />
              {imagePreview && (
                <img src={imagePreview} alt="Featured image preview" className="mt-2 w-full h-32 object-cover rounded-lg border border-slate-200 dark:border-slate-800" />
              )}
              {errors.featuredImage && <p className="text-rose-500 dark:text-rose-400 text-xs mt-1">{errors.featuredImage.message}</p>}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => router.push('/blogs')}
              className="flex-grow py-3 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl transition text-sm text-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-grow py-3 px-4 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-bold rounded-xl shadow-md transition disabled:opacity-50 text-sm text-center shadow-indigo-600/20"
            >
              {loading ? 'Submitting...' : 'Write Post'}
            </button>
          </div>

        </div>

      </form>
    </div>
  );
}