'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api, { ApiResponse } from '@/lib/api';
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

export default function EditBlogPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
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

  // Fetch existing blog data
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await api.get<ApiResponse<any>>(`/blogs/${id}`);
        const blog = res.data.data;

        // Convert tags array to comma-separated string
        const tagsString = blog.tags?.join(', ') || '';

        reset({
          title: blog.title,
          slug: blog.slug || '',
          shortDescription: blog.shortDescription,
          content: blog.content,
          category: blog.category,
          tags: tagsString,
          author: blog.author,
          status: blog.status,
          seoTitle: blog.seoTitle || '',
          seoDescription: blog.seoDescription || '',
        });
      } catch (error) {
        // handled by interceptor
      } finally {
        setFetching(false);
      }
    };

    if (id) fetchBlog();
  }, [id, reset]);

  const onSubmit = async (data: BlogFormData) => {
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

      if (imageFile) {
        formData.append('featuredImage', imageFile);
      }

      await api.put(`/blogs/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      router.push('/blogs');
    } catch (error) {
      // handled by interceptor
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Loading blog...</div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6">Edit Blog</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Same fields as create */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Title *</label>
          <input {...register('title')} className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg" />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Slug (optional)</label>
          <input {...register('slug')} className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Short Description *</label>
          <textarea {...register('shortDescription')} rows={3} className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg" />
          {errors.shortDescription && <p className="text-red-500 text-sm mt-1">{errors.shortDescription.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Content *</label>
          <textarea {...register('content')} rows={6} className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg" />
          {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Category *</label>
          <input {...register('category')} className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg" />
          {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Tags (comma separated)</label>
          <input {...register('tags')} className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Author *</label>
          <input {...register('author')} className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg" />
          {errors.author && <p className="text-red-500 text-sm mt-1">{errors.author.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select {...register('status')} className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg">
            <option value="Draft">Draft</option>
            <option value="Published">Published</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">SEO Title</label>
          <input {...register('seoTitle')} className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">SEO Description</label>
          <input {...register('seoDescription')} className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Featured Image (upload to replace)</label>
          <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="mt-1 w-full" />
          <p className="text-xs text-gray-500 mt-1">Leave empty to keep existing image</p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
        >
          {loading ? 'Updating...' : 'Update Blog'}
        </button>
      </form>
    </div>
  );
}