'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-toastify';
import { Briefcase, ArrowLeft, Award, Plus, Trash2, HelpCircle, Settings } from 'lucide-react';
import api, { ApiResponse } from '@/lib/api';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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

export default function EditCareerPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formFields, setFormFields] = useState<FormFieldBuilder[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    control,
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

  useEffect(() => {
    const fetchCareer = async () => {
      try {
        const res = await api.get<ApiResponse<any>>(`/careers/${id}`);
        const career = res.data.data;
        const lastDate = career.lastDate ? new Date(career.lastDate).toISOString().split('T')[0] : '';
        
        reset({
          title: career.title,
          department: career.department,
          location: career.location,
          employmentType: career.employmentType,
          experience: career.experience,
          openings: career.openings,
          description: career.description,
          responsibilities: career.responsibilities?.join(', ') || '',
          requirements: career.requirements?.join(', ') || '',
          benefits: career.benefits?.join(', ') || '',
          skills: career.skills?.join(', ') || '',
          salary: career.salary || '',
          status: career.status,
          lastDate: lastDate,
        });

        if (career.formFields && career.formFields.length > 0) {
          const loadedFields = career.formFields.map((f: any) => ({
            name: f.name,
            label: f.label,
            type: f.type,
            required: !!f.required,
            optionsStr: f.options ? f.options.join(', ') : '',
          }));
          setFormFields(loadedFields);
        }
      } catch (error) {
        // Handled
      } finally {
        setFetching(false);
      }
    };
    if (id) fetchCareer();
  }, [id, reset]);

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

      await api.put(`/careers/${id}`, payload);
      toast.success('Job posting updated successfully');
      router.push('/careers');
    } catch (error) {
      // Handled
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => router.push('/careers')}
          className="text-slate-500 dark:text-slate-400 cursor-pointer"
        >
          <ArrowLeft size={20} />
        </Button>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Edit Position</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Update job parameters, requirements checklist, and application deadlines.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
        
        {/* Left Column: Job Description and requirements */}
        <div className="lg:col-span-2 space-y-6">
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Briefcase className="text-indigo-600 dark:text-indigo-400 size-5" /> Job Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Position Title *</Label>
                <Input
                  {...register('title')}
                />
                {errors.title && <p className="text-rose-500 text-xs mt-1">{errors.title.message}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Department *</Label>
                  <Input
                    {...register('department')}
                  />
                  {errors.department && <p className="text-rose-500 text-xs mt-1">{errors.department.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Office Location *</Label>
                  <Input
                    {...register('location')}
                  />
                  {errors.location && <p className="text-rose-500 text-xs mt-1">{errors.location.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Employment Type *</Label>
                  <Controller
                    control={control}
                    name="employmentType"
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className="cursor-pointer">
                          <SelectValue placeholder="Select Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Full Time" className="cursor-pointer">Full Time</SelectItem>
                          <SelectItem value="Internship" className="cursor-pointer">Internship</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Experience *</Label>
                  <Input
                    {...register('experience')}
                  />
                  {errors.experience && <p className="text-rose-500 text-xs mt-1">{errors.experience.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Total Openings *</Label>
                  <Input
                    type="number"
                    {...register('openings', { valueAsNumber: true })}
                  />
                  {errors.openings && <p className="text-rose-500 text-xs mt-1">{errors.openings.message}</p>}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Job Description *</Label>
                <Textarea
                  {...register('description')}
                  rows={4}
                />
                {errors.description && <p className="text-rose-500 text-xs mt-1">{errors.description.message}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Checklist arrays */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Award className="text-indigo-600 dark:text-indigo-400 size-5" /> Requirements & Perks
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Skills (comma separated)</Label>
                <Input
                  {...register('skills')}
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Responsibilities (comma separated)</Label>
                <Textarea
                  {...register('responsibilities')}
                  rows={2}
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Requirements (comma separated)</Label>
                <Textarea
                  {...register('requirements')}
                  rows={2}
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Perks & Benefits (comma separated)</Label>
                <Textarea
                  {...register('benefits')}
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* CUSTOM QUESTIONS DYNAMIC BUILDER */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <HelpCircle className="text-indigo-600 dark:text-indigo-400 size-5" /> Dynamic Form Builder
                </h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addCustomField}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 rounded-lg text-xs font-semibold transition border border-indigo-100 dark:border-indigo-900/40 cursor-pointer"
                >
                  <Plus size={14} /> Add Question
                </Button>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Design dynamic questions. Standard fields (Full Name, Email, Phone, Experience, Cover Letter, Resume, LinkedIn, GitHub, CTC, Notice) are collected automatically. Added fields are captured inside the JSON answers model.
              </p>

              <div className="space-y-4 divide-y divide-slate-100 dark:divide-slate-800">
                {formFields.map((field, idx) => (
                  <div key={idx} className="pt-4 flex flex-col gap-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-grow max-w-sm">
                        <span className="text-xs font-bold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 w-6 h-6 rounded-full flex items-center justify-center select-none shrink-0">
                          {idx + 1}
                        </span>
                        <Input
                          type="text"
                          value={field.label}
                          onChange={(e) => updateCustomField(idx, 'label', e.target.value)}
                          className="w-full px-2.5 py-1 text-sm font-semibold bg-transparent text-slate-900 dark:text-slate-100 border-b border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:border-indigo-600 dark:focus:border-indigo-400 focus-visible:ring-0 shadow-none rounded-none"
                          placeholder="Enter Question Label"
                        />
                      </div>

                      <div className="flex items-center gap-3">
                        <Select
                          value={field.type}
                          onValueChange={(val) => updateCustomField(idx, 'type', val)}
                        >
                          <SelectTrigger className="h-8 px-2.5 text-xs font-medium cursor-pointer">
                            <SelectValue placeholder="Select Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="text" className="cursor-pointer">Text Input</SelectItem>
                            <SelectItem value="textarea" className="cursor-pointer">Textarea</SelectItem>
                            <SelectItem value="select" className="cursor-pointer">Dropdown Select</SelectItem>
                            <SelectItem value="radio" className="cursor-pointer">Radio Buttons</SelectItem>
                            <SelectItem value="checkbox" className="cursor-pointer">Checkboxes</SelectItem>
                          </SelectContent>
                        </Select>

                        <label className="flex items-center gap-1.5 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={field.required}
                            onChange={(e) => updateCustomField(idx, 'required', e.target.checked)}
                            className="rounded border-slate-300 dark:border-slate-700 text-indigo-600 focus:ring-indigo-500 bg-white dark:bg-slate-900"
                          />
                          <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Required</span>
                        </label>

                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeCustomField(idx)}
                          className="h-8 w-8 p-1.5 hover:bg-rose-50 dark:hover:bg-rose-950/50 text-rose-600 dark:text-rose-400 rounded-lg transition cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-8">
                      <div>
                        <Label className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block mb-0.5">Unique Identifier</Label>
                        <Input
                          type="text"
                          value={field.name}
                          onChange={(e) => updateCustomField(idx, 'name', e.target.value.toLowerCase().replace(/\s+/g, '_'))}
                          className="w-full px-2.5 py-1 text-xs border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-950 font-mono text-slate-600 dark:text-slate-300"
                          placeholder="e.g. current_location"
                        />
                      </div>

                      {(field.type === 'select' || field.type === 'radio' || field.type === 'checkbox') && (
                        <div>
                          <Label className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block mb-0.5">Options (Comma separated) *</Label>
                          <Input
                            type="text"
                            value={field.optionsStr || ''}
                            onChange={(e) => updateCustomField(idx, 'optionsStr', e.target.value)}
                            className="w-full px-2.5 py-1 text-xs border border-indigo-200 dark:border-indigo-900/50 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-lg"
                            placeholder="e.g. Option A, Option B, Option C"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {formFields.length === 0 && (
                  <div className="text-center py-6 text-slate-400 dark:text-slate-500 text-xs italic">
                    No additional custom questions configured.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Right Column: settings */}
        <div className="space-y-6">
          
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Settings className="text-indigo-500 dark:text-indigo-400" size={18} /> Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Status</Label>
                <Controller
                  control={control}
                  name="status"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="cursor-pointer font-bold">
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active" className="cursor-pointer">Active</SelectItem>
                        <SelectItem value="Closed" className="cursor-pointer">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Salary / Package Range</Label>
                <Input
                  {...register('salary')}
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Last Date to Apply *</Label>
                <Input
                  type="date"
                  {...register('lastDate')}
                />
                {errors.lastDate && <p className="text-rose-500 text-xs mt-1">{errors.lastDate.message}</p>}
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/careers')}
              className="flex-1 px-4 py-2.5 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition text-sm font-semibold cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white rounded-xl transition text-sm font-semibold shadow-md shadow-indigo-600/10 disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Saving...' : 'Save Posting'}
            </Button>
          </div>

        </div>

      </form>

    </div>
  );
}