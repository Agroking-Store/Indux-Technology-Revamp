'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const blogSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().optional(),
  shortDescription: z.string().min(1, 'Short description is required').max(300),
  content: z.string().min(1, 'Content is required'),
  category: z.string().min(1, 'Category is required'),
  tags: z.string().optional(),
  author: z.string().min(1, 'Author is required'),
  status: z.enum(['Draft', 'Published']), // Required enum (default set in useForm)
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
      tags: '',
      seoTitle: '',
      seoDescription: '',
    },
  });

  const onSubmit = async (data: BlogFormData) => {
    if (!imageFile) {
      alert('Please select a featured image.');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();

      // Append all fields
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

      router.push('/blogs');
    } catch (error) {
      // Error handled by interceptor
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6">Create Blog</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Title *</label>
          <input
            {...register('title')}
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
        </div>

        {/* Slug (optional) */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Slug (optional)</label>
          <input
            {...register('slug')}
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="auto-generated from title"
          />
          {errors.slug && <p className="text-red-500 text-sm mt-1">{errors.slug.message}</p>}
        </div>

        {/* Short Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Short Description *</label>
          <textarea
            {...register('shortDescription')}
            rows={3}
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.shortDescription && (
            <p className="text-red-500 text-sm mt-1">{errors.shortDescription.message}</p>
          )}
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Content * (HTML allowed)</label>
          <textarea
            {...register('content')}
            rows={6}
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>}
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Category *</label>
          <input
            {...register('category')}
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
        </div>

        {/* Tags (comma separated) */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Tags (comma separated)</label>
          <input
            {...register('tags')}
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="react, nextjs, typescript"
          />
        </div>

        {/* Author */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Author *</label>
          <input
            {...register('author')}
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.author && <p className="text-red-500 text-sm mt-1">{errors.author.message}</p>}
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select
            {...register('status')}
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="Draft">Draft</option>
            <option value="Published">Published</option>
          </select>
        </div>

        {/* SEO Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700">SEO Title (optional)</label>
          <input
            {...register('seoTitle')}
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* SEO Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700">SEO Description (optional)</label>
          <input
            {...register('seoDescription')}
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Image upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Featured Image *</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            className="mt-1 w-full"
          />
          {!imageFile && <p className="text-red-500 text-sm mt-1">Image is required</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Blog'}
        </button>
      </form>
    </div>
  );
}