'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-toastify';

const eventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().optional(),
  description: z.string().min(1, 'Short description is required'),
  content: z.string().min(1, 'Content/Details are required'),
  date: z.string().min(1, 'Date and Time are required'),
  location: z.string().min(1, 'Location is required'),
  status: z.enum(['Draft', 'Published']),
});

type EventFormData = z.infer<typeof eventSchema>;

export default function CreateEventPage() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: { 
      status: 'Draft',
      slug: '',
      description: '',
      content: '',
      date: '',
      location: '',
    },
  });

  const onSubmit = async (data: EventFormData) => {
    if (!imageFile) {
      toast.error('Please select an event cover image.');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();

      // Append all fields
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });

      formData.append('image', imageFile);

      await api.post('/events', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Event created successfully');
      router.push('/events');
    } catch (error) {
      // Error handled by interceptor
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6">Create Event</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Event Title *</label>
          <input
            {...register('title')}
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="e.g. Indux Tech Conference 2026"
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

        {/* Date and Time */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Date & Time *</label>
          <input
            type="datetime-local"
            {...register('date')}
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>}
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Location / Venue *</label>
          <input
            {...register('location')}
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="e.g. Mumbai Grand Plaza, India OR Online Webinar"
          />
          {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>}
        </div>

        {/* Short Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Short Description *</label>
          <textarea
            {...register('description')}
            rows={2}
            maxLength={180}
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Brief preview of the event (max 180 chars)"
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
          )}
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Event Details * (HTML allowed)</label>
          <textarea
            {...register('content')}
            rows={5}
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Full information about the schedule, key speakers, registration process, etc."
          />
          {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>}
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

        {/* Cover Image upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Event Cover Image *</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            className="mt-1 w-full"
          />
          {!imageFile && <p className="text-red-500 text-sm mt-1">Image file is required</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 font-bold"
        >
          {loading ? 'Creating...' : 'Create Event'}
        </button>
      </form>
    </div>
  );
}
