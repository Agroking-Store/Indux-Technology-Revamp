'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// ✅ Removed .default() from status and employmentType – they are required, default set in form
const careerSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  department: z.string().min(1, 'Department is required'),
  location: z.string().min(1, 'Location is required'),
  employmentType: z.enum(['Full Time', 'Internship']),
  experience: z.string().min(1, 'Experience is required'),
  openings: z.number().int().positive('At least 1 opening'),
  description: z.string().min(1, 'Description is required'),
  responsibilities: z.string().optional(),
  requirements: z.string().optional(),
  skills: z.string().optional(),
  salary: z.string().optional(),
  status: z.enum(['Active', 'Closed']), // ✅ No default – required
  lastDate: z.string().min(1, 'Last date is required'),
});

type CareerFormData = z.infer<typeof careerSchema>;

export default function CreateCareerPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CareerFormData>({
    resolver: zodResolver(careerSchema),
    defaultValues: {
      status: 'Active',                    // ✅ Default set here
      employmentType: 'Full Time',
      openings: 1,
      responsibilities: '',
      requirements: '',
      skills: '',
      salary: '',
    },
  });

  const onSubmit = async (data: CareerFormData) => {
    setLoading(true);
    try {
      const payload = {
        ...data,
        responsibilities: data.responsibilities
          ? data.responsibilities.split(',').map(s => s.trim()).filter(Boolean)
          : [],
        requirements: data.requirements
          ? data.requirements.split(',').map(s => s.trim()).filter(Boolean)
          : [],
        skills: data.skills
          ? data.skills.split(',').map(s => s.trim()).filter(Boolean)
          : [],
        lastDate: new Date(data.lastDate).toISOString(),
        openings: Number(data.openings),
      };

      await api.post('/careers', payload);
      router.push('/careers');
    } catch (error) {
      // handled by interceptor
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6">Create Job</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* All fields – same as before */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Title *</label>
          <input {...register('title')} className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg" />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Department *</label>
          <input {...register('department')} className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg" />
          {errors.department && <p className="text-red-500 text-sm mt-1">{errors.department.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Location *</label>
          <input {...register('location')} className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg" />
          {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Employment Type *</label>
          <select {...register('employmentType')} className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg">
            <option value="Full Time">Full Time</option>
            <option value="Internship">Internship</option>
          </select>
          {errors.employmentType && <p className="text-red-500 text-sm mt-1">{errors.employmentType.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Experience *</label>
          <input {...register('experience')} className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg" />
          {errors.experience && <p className="text-red-500 text-sm mt-1">{errors.experience.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Openings *</label>
          <input type="number" {...register('openings', { valueAsNumber: true })} className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg" />
          {errors.openings && <p className="text-red-500 text-sm mt-1">{errors.openings.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Description *</label>
          <textarea {...register('description')} rows={4} className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg" />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Responsibilities (comma separated)</label>
          <input {...register('responsibilities')} className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Requirements (comma separated)</label>
          <input {...register('requirements')} className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Skills (comma separated)</label>
          <input {...register('skills')} className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Salary (optional)</label>
          <input {...register('salary')} className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select {...register('status')} className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg">
            <option value="Active">Active</option>
            <option value="Closed">Closed</option>
          </select>
          {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Last Date to Apply *</label>
          <input type="date" {...register('lastDate')} className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg" />
          {errors.lastDate && <p className="text-red-500 text-sm mt-1">{errors.lastDate.message}</p>}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Job'}
        </button>
      </form>
    </div>
  );
}