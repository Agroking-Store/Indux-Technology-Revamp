'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-toastify';
import { Briefcase, ArrowLeft, FileText, Settings, Award, Plus, Trash2, HelpCircle } from 'lucide-react';
import api from '@/lib/api';

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
  benefits: z.string().optional(),
  skills: z.string().optional(),
  salary: z.string().optional(),
  status: z.enum(['Active', 'Closed']),
  lastDate: z.string().min(1, 'Last date is required'),
});

type CareerFormData = z.infer<typeof careerSchema>;

interface FormFieldBuilder {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'radio' | 'checkbox';
  required: boolean;
  optionsStr?: string;
}

export default function CreateCareerPage() {
  const [loading, setLoading] = useState(false);
  const [formFields, setFormFields] = useState<FormFieldBuilder[]>([]);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CareerFormData>({
    resolver: zodResolver(careerSchema),
    defaultValues: {
      status: 'Active',
      employmentType: 'Full Time',
      openings: 1,
      responsibilities: '',
      requirements: '',
      benefits: '',
      skills: '',
      salary: '',
      description: '',
    },
  });

  const addCustomField = () => {
    const nextIdx = formFields.length + 1;
    setFormFields([
      ...formFields,
      {
        name: `custom_question_${nextIdx}`,
        label: `Custom Question ${nextIdx}`,
        type: 'text',
        required: false,
        optionsStr: '',
      },
    ]);
  };

  const removeCustomField = (index: number) => {
    setFormFields(formFields.filter((_, i) => i !== index));
  };

  const updateCustomField = (index: number, key: keyof FormFieldBuilder, value: any) => {
    const updated = [...formFields];
    updated[index] = { ...updated[index], [key]: value };
    setFormFields(updated);
  };

  const onSubmit = async (data: CareerFormData) => {
    setLoading(true);
    try {
      // Validate Custom Questions
      const names = formFields.map(f => f.name.trim());
      const duplicates = names.filter((name, index) => names.indexOf(name) !== index);
      if (duplicates.length > 0) {
        toast.warning(`Custom questions cannot have duplicate identifiers: ${duplicates[0]}`);
        setLoading(false);
        return;
      }

      const parsedFormFields = formFields.map(({ optionsStr, ...rest }) => ({
        ...rest,
        ...(optionsStr && (rest.type === 'select' || rest.type === 'radio' || rest.type === 'checkbox')
          ? { options: optionsStr.split(',').map(o => o.trim()).filter(Boolean) }
          : {}),
      }));

      const payload = {
        ...data,
        responsibilities: data.responsibilities
          ? data.responsibilities.split(',').map(s => s.trim()).filter(Boolean)
          : [],
        requirements: data.requirements
          ? data.requirements.split(',').map(s => s.trim()).filter(Boolean)
          : [],
        benefits: data.benefits
          ? data.benefits.split(',').map(s => s.trim()).filter(Boolean)
          : [],
        skills: data.skills
          ? data.skills.split(',').map(s => s.trim()).filter(Boolean)
          : [],
        formFields: parsedFormFields,
        lastDate: new Date(data.lastDate).toISOString(),
        openings: Number(data.openings),
      };

      await api.post('/careers', payload);
      toast.success('Job posting created successfully');
      router.push('/careers');
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
          onClick={() => router.push('/careers')}
          className="p-2 hover:bg-slate-100 rounded-xl transition text-slate-500"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Create Position</h1>
          <p className="text-gray-500 text-sm mt-1">Open a new career job profile, specify parameters, and requirements.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
        
        {/* Left Column: Job Description and requirements */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Briefcase className="text-indigo-600 size-5" /> Job Profile
            </h3>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">Position Title *</label>
              <input
                {...register('title')}
                className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-indigo-500 text-sm"
                placeholder="e.g. Senior Fullstack Engineer"
              />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">Department *</label>
                <input
                  {...register('department')}
                  className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-indigo-500 text-sm"
                  placeholder="e.g. Engineering"
                />
                {errors.department && <p className="text-red-500 text-xs mt-1">{errors.department.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">Office Location *</label>
                <input
                  {...register('location')}
                  className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-indigo-500 text-sm"
                  placeholder="e.g. Remote / New York"
                />
                {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">Employment Type *</label>
                <select
                  {...register('employmentType')}
                  className="mt-1 w-full px-3 py-2 border rounded-lg text-sm bg-white focus:outline-indigo-500"
                >
                  <option value="Full Time">Full Time</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">Experience *</label>
                <input
                  {...register('experience')}
                  className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-indigo-500 text-sm"
                  placeholder="e.g. 3-5 Years"
                />
                {errors.experience && <p className="text-red-500 text-xs mt-1">{errors.experience.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">Total Openings *</label>
                <input
                  type="number"
                  {...register('openings', { valueAsNumber: true })}
                  className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-indigo-500 text-sm"
                />
                {errors.openings && <p className="text-red-500 text-xs mt-1">{errors.openings.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">Job Description *</label>
              <textarea
                {...register('description')}
                rows={4}
                className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-indigo-500 text-sm"
                placeholder="Write detailed responsibilities summary..."
              />
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
            </div>
          </div>

          {/* Checklist arrays */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Award className="text-indigo-600 size-5" /> Requirements & Perks
            </h3>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">Skills (comma separated)</label>
              <input
                {...register('skills')}
                className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-indigo-500 text-sm"
                placeholder="React, Node.js, Mongoose"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">Responsibilities (comma separated)</label>
              <textarea
                {...register('responsibilities')}
                rows={2}
                className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-indigo-500 text-sm"
                placeholder="Review pull requests, Implement backend APIs, Design visual layouts"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">Requirements (comma separated)</label>
              <textarea
                {...register('requirements')}
                rows={2}
                className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-indigo-500 text-sm"
                placeholder="B.Tech in Computer Science, Strong CSS skills, 3 years React experience"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">Perks & Benefits (comma separated)</label>
              <textarea
                {...register('benefits')}
                rows={2}
                className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-indigo-500 text-sm"
                placeholder="Health Insurance, Free lunches, Stock options"
              />
            </div>
          </div>

          {/* CUSTOM QUESTIONS DYNAMIC BUILDER */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <HelpCircle className="text-indigo-605 size-5" /> Dynamic Form Builder
              </h3>
              <button
                type="button"
                onClick={addCustomField}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg text-xs font-semibold transition border border-indigo-100"
              >
                <Plus size={14} /> Add Question
              </button>
            </div>

            <p className="text-xs text-gray-500 leading-relaxed">
              Design dynamic questions. Standard fields (Full Name, Email, Phone, Experience, Cover Letter, Resume, LinkedIn, GitHub, CTC, Notice) are collected automatically. Added fields are captured inside the JSON answers model.
            </p>

            <div className="space-y-4 divide-y divide-gray-100">
              {formFields.map((field, idx) => (
                <div key={idx} className="pt-4 flex flex-col gap-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-grow max-w-sm">
                      <span className="text-xs font-bold text-gray-400 bg-gray-100 w-6 h-6 rounded-full flex items-center justify-center select-none shrink-0">
                        {idx + 1}
                      </span>
                      <input
                        type="text"
                        value={field.label}
                        onChange={(e) => updateCustomField(idx, 'label', e.target.value)}
                        className="w-full px-2.5 py-1 text-sm font-semibold border-b border-transparent hover:border-gray-300 focus:border-indigo-600 focus:outline-none"
                        placeholder="Enter Question Label"
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <select
                        value={field.type}
                        onChange={(e) => updateCustomField(idx, 'type', e.target.value)}
                        className="px-2.5 py-1 border rounded-lg text-xs font-medium bg-white focus:outline-indigo-500"
                      >
                        <option value="text">Text Input</option>
                        <option value="textarea">Textarea</option>
                        <option value="select">Dropdown Select</option>
                        <option value="radio">Radio Buttons</option>
                        <option value="checkbox">Checkboxes</option>
                      </select>

                      <label className="flex items-center gap-1.5 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={field.required}
                          onChange={(e) => updateCustomField(idx, 'required', e.target.checked)}
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-xs font-bold text-gray-600">Required</span>
                      </label>

                      <button
                        type="button"
                        onClick={() => removeCustomField(idx)}
                        className="p-1.5 hover:bg-rose-50 text-rose-600 rounded-lg transition"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-8">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-gray-400 block mb-0.5">Unique Identifier</label>
                      <input
                        type="text"
                        value={field.name}
                        onChange={(e) => updateCustomField(idx, 'name', e.target.value.toLowerCase().replace(/\s+/g, '_'))}
                        className="w-full px-2.5 py-1 text-xs border rounded-lg bg-gray-50 font-mono text-gray-600 focus:outline-indigo-500"
                        placeholder="e.g. current_location"
                      />
                    </div>

                    {(field.type === 'select' || field.type === 'radio' || field.type === 'checkbox') && (
                      <div>
                        <label className="text-[10px] uppercase font-bold text-gray-400 block mb-0.5">Options (Comma separated) *</label>
                        <input
                          type="text"
                          value={field.optionsStr || ''}
                          onChange={(e) => updateCustomField(idx, 'optionsStr', e.target.value)}
                          className="w-full px-2.5 py-1 text-xs border rounded-lg border-indigo-200 focus:outline-indigo-500"
                          placeholder="e.g. Option A, Option B, Option C"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {formFields.length === 0 && (
                <div className="text-center py-6 text-gray-400 text-xs italic">
                  No additional custom questions configured.
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Right Column: settings */}
        <div className="space-y-6">
          
          <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-gray-800 flex items-center gap-1.5">
              <Settings className="text-indigo-500" size={18} /> Settings
            </h3>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">Status</label>
              <select
                {...register('status')}
                className="mt-1 w-full px-3 py-2 border rounded-lg text-sm bg-white focus:outline-indigo-500"
              >
                <option value="Active">Active</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">Salary / Package Range</label>
              <input
                {...register('salary')}
                className="mt-1 w-full px-4 py-2 border rounded-lg text-sm focus:outline-indigo-500"
                placeholder="e.g. $80,000 - $100,000"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">Last Date to Apply *</label>
              <input
                type="date"
                {...register('lastDate')}
                className="mt-1 w-full px-4 py-2 border rounded-lg text-sm focus:outline-indigo-500"
              />
              {errors.lastDate && <p className="text-red-500 text-xs mt-1">{errors.lastDate.message}</p>}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => router.push('/careers')}
              className="flex-1 px-4 py-2.5 border rounded-xl hover:bg-slate-50 transition text-sm font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition text-sm font-semibold shadow-md shadow-indigo-600/10 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Posting'}
            </button>
          </div>

        </div>

      </form>

    </div>
  );
}