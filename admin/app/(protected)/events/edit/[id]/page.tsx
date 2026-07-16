'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-toastify';
import { Trash2, ArrowUp, ArrowDown, Plus, Layout, Users, Calendar, HelpCircle, FileText } from 'lucide-react';
import api, { ApiResponse } from '@/lib/api';

const eventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().optional(),
  type: z.string().min(1, 'Event type is required'),
  category: z.string().min(1, 'Category is required'),
  shortDescription: z.string().min(1, 'Short description is required'),
  description: z.string().min(1, 'Full description is required'),
  startDate: z.string().min(1, 'Start Date and Time are required'),
  endDate: z.string().min(1, 'End Date and Time are required'),
  registrationDeadline: z.string().min(1, 'Registration deadline is required'),
  organizer: z.string().min(1, 'Organizer is required'),
  location: z.string().min(1, 'Location/Venue is required'),
  status: z.enum(['Draft', 'Published']),
  coverImage: z.string().min(1, 'Cover image is required'),
  bannerImage: z.string().min(1, 'Banner image is required'),
  isPaid: z.boolean(),
  registrationFee: z.coerce.number().min(0),
});

type EventFormData = z.infer<typeof eventSchema>;

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

interface FormFieldBuilder {
  name: string;
  label: string;
  type: 'text' | 'email' | 'phone' | 'number' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'date' | 'url' | 'file';
  required: boolean;
  placeholder?: string;
  defaultValue?: string;
  optionsStr?: string;
}

interface SpeakerBuilder {
  name: string;
  role: string;
  company?: string;
  avatar?: string;
}

interface ScheduleBuilder {
  time: string;
  title: string;
  description?: string;
}

interface FaqBuilder {
  question: string;
  answer: string;
}

export default function EditEventPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [coverPreview, setCoverPreview] = useState<string>('');
  const [bannerPreview, setBannerPreview] = useState<string>('');

  // Dynamic Builders States
  const [formFields, setFormFields] = useState<FormFieldBuilder[]>([]);
  const [speakers, setSpeakers] = useState<SpeakerBuilder[]>([]);
  const [schedule, setSchedule] = useState<ScheduleBuilder[]>([]);
  const [faqs, setFaqs] = useState<FaqBuilder[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema) as any,
    defaultValues: { 
      status: 'Draft',
      slug: '',
      type: 'Workshop',
      category: 'Technology',
      shortDescription: '',
      description: '',
      startDate: '',
      endDate: '',
      registrationDeadline: '',
      organizer: 'Indux Technology',
      location: '',
      coverImage: '',
      bannerImage: '',
      isPaid: false,
      registrationFee: 0,
    },
  });

  const watchIsPaid = watch('isPaid');

  const formatTzDate = (dateStr?: string) => {
    if (!dateStr) return '';
    const dateObj = new Date(dateStr);
    const tzOffset = dateObj.getTimezoneOffset() * 60000;
    return new Date(dateObj.getTime() - tzOffset).toISOString().slice(0, 16);
  };

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await api.get<ApiResponse<any>>(`/events/${id}`);
        const event = res.data.data;

        reset({
          title: event.title,
          slug: event.slug || '',
          type: event.type || 'Workshop',
          category: event.category || 'Technology',
          shortDescription: event.shortDescription || event.description || '',
          description: event.description || event.content || '',
          startDate: formatTzDate(event.startDate || event.date),
          endDate: formatTzDate(event.endDate || event.date),
          registrationDeadline: formatTzDate(event.registrationDeadline || event.date),
          organizer: event.organizer || 'Indux Technology',
          location: event.location || '',
          status: event.status || 'Draft',
          coverImage: event.coverImage || '',
          bannerImage: event.bannerImage || '',
          isPaid: event.isPaid || false,
          registrationFee: event.registrationFee || 0,
        });

        if (event.formFields && event.formFields.length > 0) {
          setFormFields(
            event.formFields.map((f: any) => ({
              ...f,
              optionsStr: f.options ? f.options.join(', ') : '',
            }))
          );
        } else {
          setFormFields([
            { name: 'name', label: 'Full Name', type: 'text', required: true, placeholder: 'e.g. John Doe' },
            { name: 'email', label: 'Email Address', type: 'email', required: true, placeholder: 'e.g. john@example.com' },
            { name: 'phone', label: 'Phone Number', type: 'phone', required: true, placeholder: 'e.g. +123456789' },
          ]);
        }

        setSpeakers(event.speakers || []);
        setSchedule(event.schedule || []);
        setFaqs(event.faqs || []);
        setCoverPreview(event.coverImage || '');
        setBannerPreview(event.bannerImage || '');
      } catch (error) {
        // Handled
      } finally {
        setFetching(false);
      }
    };

    if (id) fetchEvent();
  }, [id, reset]);

  // Dynamic Fields Helpers
  const addField = () => {
    const defaultName = `field_${Date.now()}`;
    setFormFields([
      ...formFields,
      { name: defaultName, label: 'New Custom Field', type: 'text', required: false, placeholder: '' }
    ]);
  };

  const removeField = (index: number) => {
    if (formFields[index].name === 'name' || formFields[index].name === 'email' || formFields[index].name === 'phone') {
      toast.warning('Base fields (Name, Email, Phone) cannot be deleted.');
      return;
    }
    setFormFields(formFields.filter((_, i) => i !== index));
  };

  const updateField = (index: number, key: keyof FormFieldBuilder, value: any) => {
    const updated = [...formFields];
    updated[index] = { ...updated[index], [key]: value };
    if (key === 'label' && updated[index].name.startsWith('field_')) {
      const sanitizedName = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '');
      if (sanitizedName) {
        updated[index].name = sanitizedName;
      }
    }
    setFormFields(updated);
  };

  const moveField = (index: number, direction: 'up' | 'down') => {
    const nextIndex = direction === 'up' ? index - 1 : index + 1;
    if (nextIndex < 0 || nextIndex >= formFields.length) return;
    const updated = [...formFields];
    const temp = updated[index];
    updated[index] = updated[nextIndex];
    updated[nextIndex] = temp;
    setFormFields(updated);
  };

  // Speakers Helpers
  const addSpeaker = () => setSpeakers([...speakers, { name: '', role: '', company: '', avatar: '' }]);
  const removeSpeaker = (index: number) => setSpeakers(speakers.filter((_, i) => i !== index));
  const updateSpeaker = (index: number, key: keyof SpeakerBuilder, value: string) => {
    const updated = [...speakers];
    updated[index] = { ...updated[index], [key]: value };
    setSpeakers(updated);
  };

  // Schedule Helpers
  const addSchedule = () => setSchedule([...schedule, { time: '', title: '', description: '' }]);
  const removeSchedule = (index: number) => setSchedule(schedule.filter((_, i) => i !== index));
  const updateSchedule = (index: number, key: keyof ScheduleBuilder, value: string) => {
    const updated = [...schedule];
    updated[index] = { ...updated[index], [key]: value };
    setSchedule(updated);
  };

  // FAQs Helpers
  const addFaq = () => setFaqs([...faqs, { question: '', answer: '' }]);
  const removeFaq = (index: number) => setFaqs(faqs.filter((_, i) => i !== index));
  const updateFaq = (index: number, key: keyof FaqBuilder, value: string) => {
    const updated = [...faqs];
    updated[index] = { ...updated[index], [key]: value };
    setFaqs(updated);
  };

  // Image Upload Helpers — convert to base64 and store directly (no external host)
  const handleImageSelect = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: 'coverImage' | 'bannerImage',
    setPreview: (val: string) => void
  ) => {
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
      setValue(field, base64, { shouldValidate: true });
      setPreview(base64);
    } catch {
      toast.error('Failed to read the selected image.');
    }
  };

  const onSubmit = async (data: EventFormData) => {
    const names = formFields.map(f => f.name.trim());
    const uniqueNames = new Set(names);
    if (names.some(n => !n)) {
      toast.error('All form fields must have a valid identifier name.');
      return;
    }
    if (uniqueNames.size !== names.length) {
      toast.error('Form field names must be unique. Check for duplicates.');
      return;
    }

    setLoading(true);
    try {
      const parsedFormFields = formFields.map(({ optionsStr, ...rest }) => ({
        ...rest,
        options: optionsStr ? optionsStr.split(',').map(s => s.trim()).filter(Boolean) : undefined,
      }));

      const payload = {
        ...data,
        formFields: parsedFormFields,
        speakers: speakers.filter(s => s.name),
        schedule: schedule.filter(s => s.title),
        faqs: faqs.filter(f => f.question),
      };

      await api.put(`/events/${id}`, payload);

      toast.success('Event updated successfully');
      router.push('/events');
    } catch (error: any) {
      const msg = error?.response?.data?.message || error?.message || 'Failed to update event. Please try again.';
      toast.error(msg);
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
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Edit Event</h1>
          <p className="text-gray-500 text-sm mt-1">Configure details, custom dynamic registrations, and metadata schedules.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <FileText className="text-indigo-600 size-5" /> Basic Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-555 uppercase tracking-wide">Event Title *</label>
                <input
                  {...register('title')}
                  className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-indigo-500 text-sm"
                  placeholder="e.g. INDUX AI Hackathon 2026"
                />
                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-555 uppercase tracking-wide">Slug (optional)</label>
                <input
                  {...register('slug')}
                  className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-indigo-500 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-555 uppercase tracking-wide">Event Type *</label>
                <select
                  {...register('type')}
                  className="mt-1 w-full px-3 py-2 border rounded-lg focus:outline-indigo-500 text-sm bg-white"
                >
                  <option value="Webinar">Webinar</option>
                  <option value="Hackathon">Hackathon</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Meetup">Meetup</option>
                  <option value="Bootcamp">Bootcamp</option>
                  <option value="Conference">Conference</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-555 uppercase tracking-wide">Category *</label>
                <input
                  {...register('category')}
                  className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-indigo-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-555 uppercase tracking-wide">Organizer *</label>
                <input
                  {...register('organizer')}
                  className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-indigo-500 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-555 uppercase tracking-wide">Short Description *</label>
              <textarea
                {...register('shortDescription')}
                rows={2}
                maxLength={180}
                className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-indigo-500 text-sm"
              />
              {errors.shortDescription && <p className="text-red-500 text-xs mt-1">{errors.shortDescription.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-555 uppercase tracking-wide">Full Event Description *</label>
              <textarea
                {...register('description')}
                rows={6}
                className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-indigo-500 text-sm"
              />
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <Layout className="text-indigo-600 size-5" /> Registration Form Builder
              </h3>
              <button
                type="button"
                onClick={addField}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-xs font-bold"
              >
                <Plus size={14} /> Add Custom Field
              </button>
            </div>

            <p className="text-xs text-gray-555 leading-relaxed">
              Design dynamic questions. Standard fields (Full Name, Email, Phone) are configured by default. Added fields are captured inside the JSON answers model.
            </p>

            <div className="space-y-4 divide-y divide-gray-100">
              {formFields.map((field, idx) => {
                const isBaseField = field.name === 'name' || field.name === 'email' || field.name === 'phone';
                return (
                  <div key={idx} className="pt-4 flex flex-col gap-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-grow max-w-sm">
                        <span className="text-xs font-bold text-gray-400 bg-gray-100 w-6 h-6 rounded-full flex items-center justify-center select-none">
                          {idx + 1}
                        </span>
                        <input
                          type="text"
                          value={field.label}
                          disabled={isBaseField}
                          onChange={(e) => updateField(idx, 'label', e.target.value)}
                          className="w-full px-2.5 py-1 text-sm font-semibold border-b border-transparent hover:border-gray-300 focus:border-indigo-600 focus:outline-none disabled:bg-transparent disabled:border-none"
                        />
                      </div>

                      <div className="flex items-center gap-3">
                        <select
                          value={field.type}
                          disabled={isBaseField}
                          onChange={(e) => updateField(idx, 'type', e.target.value)}
                          className="px-2.5 py-1 border rounded-lg text-xs font-medium bg-white focus:outline-indigo-500"
                        >
                          <option value="text">Text Input</option>
                          <option value="email">Email</option>
                          <option value="phone">Phone</option>
                          <option value="number">Number</option>
                          <option value="textarea">Textarea</option>
                          <option value="select">Dropdown Select</option>
                          <option value="radio">Radio Buttons</option>
                          <option value="checkbox">Checkboxes</option>
                          <option value="date">Date</option>
                          <option value="url">URL Link</option>
                          <option value="file">File Upload</option>
                        </select>

                        <label className="flex items-center gap-1.5 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={field.required}
                            disabled={isBaseField}
                            onChange={(e) => updateField(idx, 'required', e.target.checked)}
                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="text-xs font-bold text-gray-600">Required</span>
                        </label>

                        {!isBaseField && (
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => moveField(idx, 'up')}
                              disabled={idx === 3}
                              className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 disabled:opacity-30"
                            >
                              <ArrowUp size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => moveField(idx, 'down')}
                              disabled={idx === formFields.length - 1}
                              className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 disabled:opacity-30"
                            >
                              <ArrowDown size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeField(idx)}
                              className="p-1.5 hover:bg-rose-50 text-rose-600 rounded-lg"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {!isBaseField && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pl-8 pb-2">
                        <div>
                          <label className="text-[10px] uppercase font-bold text-gray-400">Unique Identifier</label>
                          <input
                            type="text"
                            value={field.name}
                            onChange={(e) => updateField(idx, 'name', e.target.value)}
                            className="mt-0.5 w-full px-2.5 py-1 text-xs border rounded-lg bg-gray-50 font-mono text-gray-600 focus:outline-indigo-500"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] uppercase font-bold text-gray-400">Placeholder Text</label>
                          <input
                            type="text"
                            value={field.placeholder || ''}
                            onChange={(e) => updateField(idx, 'placeholder', e.target.value)}
                            className="mt-0.5 w-full px-2.5 py-1 text-xs border rounded-lg focus:outline-indigo-555"
                          />
                        </div>

                        {(field.type === 'select' || field.type === 'radio' || field.type === 'checkbox') && (
                          <div>
                            <label className="text-[10px] uppercase font-bold text-gray-400">Options (Comma separated) *</label>
                            <input
                              type="text"
                              value={field.optionsStr || ''}
                              onChange={(e) => updateField(idx, 'optionsStr', e.target.value)}
                              className="mt-0.5 w-full px-2.5 py-1 text-xs border rounded-lg border-indigo-200 focus:outline-indigo-500 focus:border-indigo-500"
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm space-y-6">
            
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <h4 className="text-base font-bold text-gray-800 flex items-center gap-2">
                  <Users className="text-indigo-600 size-4.5" /> Speakers Profile
                </h4>
                <button
                  type="button"
                  onClick={addSpeaker}
                  className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-bold"
                >
                  <Plus size={14} /> Add Speaker
                </button>
              </div>

              {speakers.map((speaker, idx) => (
                <div key={idx} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end bg-gray-50/50 p-3.5 rounded-xl border border-gray-150 relative group">
                  <button
                    type="button"
                    onClick={() => removeSpeaker(idx)}
                    className="absolute top-2 right-2 text-rose-500 hover:text-rose-700 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={14} />
                  </button>
                  <div className="md:col-span-2">
                    <label className="text-[10px] font-bold text-gray-400">Speaker Name *</label>
                    <input
                      type="text"
                      value={speaker.name}
                      onChange={(e) => updateSpeaker(idx, 'name', e.target.value)}
                      className="w-full px-3 py-1.5 border rounded-lg text-xs bg-white focus:outline-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400">Role / Job Title *</label>
                    <input
                      type="text"
                      value={speaker.role}
                      onChange={(e) => updateSpeaker(idx, 'role', e.target.value)}
                      className="w-full px-3 py-1.5 border rounded-lg text-xs bg-white focus:outline-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400">Company (optional)</label>
                    <input
                      type="text"
                      value={speaker.company || ''}
                      onChange={(e) => updateSpeaker(idx, 'company', e.target.value)}
                      className="w-full px-3 py-1.5 border rounded-lg text-xs bg-white focus:outline-indigo-500"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <h4 className="text-base font-bold text-gray-800 flex items-center gap-2">
                  <Calendar className="text-indigo-600 size-4.5" /> Event Schedule Timeline
                </h4>
                <button
                  type="button"
                  onClick={addSchedule}
                  className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-bold"
                >
                  <Plus size={14} /> Add Slot
                </button>
              </div>

              {schedule.map((slot, idx) => (
                <div key={idx} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end bg-gray-50/50 p-3.5 rounded-xl border border-gray-150 relative group">
                  <button
                    type="button"
                    onClick={() => removeSchedule(idx)}
                    className="absolute top-2 right-2 text-rose-500 hover:text-rose-700 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={14} />
                  </button>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400">Time Range *</label>
                    <input
                      type="text"
                      value={slot.time}
                      onChange={(e) => updateSchedule(idx, 'time', e.target.value)}
                      className="w-full px-3 py-1.5 border rounded-lg text-xs bg-white focus:outline-indigo-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-[10px] font-bold text-gray-400">Session/Activity Title *</label>
                    <input
                      type="text"
                      value={slot.title}
                      onChange={(e) => updateSchedule(idx, 'title', e.target.value)}
                      className="w-full px-3 py-1.5 border rounded-lg text-xs bg-white focus:outline-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400">Brief Detail (optional)</label>
                    <input
                      type="text"
                      value={slot.description || ''}
                      onChange={(e) => updateSchedule(idx, 'description', e.target.value)}
                      className="w-full px-3 py-1.5 border rounded-lg text-xs bg-white focus:outline-indigo-500"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <h4 className="text-base font-bold text-gray-800 flex items-center gap-2">
                  <HelpCircle className="text-indigo-600 size-4.5" /> Frequently Asked Questions
                </h4>
                <button
                  type="button"
                  onClick={addFaq}
                  className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-bold"
                >
                  <Plus size={14} /> Add FAQ
                </button>
              </div>

              {faqs.map((faq, idx) => (
                <div key={idx} className="bg-gray-50/50 p-3.5 rounded-xl border border-gray-150 relative group space-y-2">
                  <button
                    type="button"
                    onClick={() => removeFaq(idx)}
                    className="absolute top-2 right-2 text-rose-500 hover:text-rose-700 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={14} />
                  </button>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400">Question *</label>
                    <input
                      type="text"
                      value={faq.question}
                      onChange={(e) => updateFaq(idx, 'question', e.target.value)}
                      className="w-full px-3 py-1.5 border rounded-lg text-xs bg-white focus:outline-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400">Answer *</label>
                    <textarea
                      value={faq.answer}
                      onChange={(e) => updateFaq(idx, 'answer', e.target.value)}
                      rows={2}
                      className="w-full px-3 py-1.5 border rounded-lg text-xs bg-white focus:outline-indigo-500"
                    />
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>

        <div className="space-y-6">
          
          <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-gray-800">Publish Parameters</h3>

            <div>
              <label className="block text-xs font-bold text-gray-555 uppercase tracking-wide">Status</label>
              <select
                {...register('status')}
                className="mt-1 w-full px-3 py-2 border rounded-lg text-sm bg-white focus:outline-indigo-500"
              >
                <option value="Draft">Draft (Hidden)</option>
                <option value="Published">Published (Public)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-555 uppercase tracking-wide">Start Date & Time *</label>
              <input
                type="datetime-local"
                {...register('startDate')}
                className="mt-1 w-full px-3 py-2 border rounded-lg text-sm focus:outline-indigo-500"
              />
              {errors.startDate && <p className="text-red-500 text-xs mt-1">{errors.startDate.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-555 uppercase tracking-wide">End Date & Time *</label>
              <input
                type="datetime-local"
                {...register('endDate')}
                className="mt-1 w-full px-3 py-2 border rounded-lg text-sm focus:outline-indigo-500"
              />
              {errors.endDate && <p className="text-red-500 text-xs mt-1">{errors.endDate.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-555 uppercase tracking-wide">Registration Deadline *</label>
              <input
                type="datetime-local"
                {...register('registrationDeadline')}
                className="mt-1 w-full px-3 py-2 border rounded-lg text-sm focus:outline-indigo-500"
              />
              {errors.registrationDeadline && <p className="text-red-500 text-xs mt-1">{errors.registrationDeadline.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-555 uppercase tracking-wide">Location / Venue *</label>
              <input
                {...register('location')}
                className="mt-1 w-full px-4 py-2 border rounded-lg text-sm focus:outline-indigo-500"
              />
              {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location.message}</p>}
            </div>

            {/* Payment Configuration */}
            <div className="border-t border-gray-100 pt-4 space-y-3">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  {...register('isPaid')}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-xs font-bold text-gray-700">Paid Event (Requires Ticket)</span>
              </label>

              {watchIsPaid && (
                <div className="space-y-1.5 animate-fadeIn">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">Registration Fee (INR) *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    {...register('registrationFee')}
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-indigo-500"
                    placeholder="e.g. 499"
                  />
                  {errors.registrationFee && <p className="text-red-500 text-xs mt-1">{errors.registrationFee.message}</p>}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-gray-800">Event Media</h3>
            
            <div>
              <label className="block text-xs font-bold text-gray-555 uppercase tracking-wide">Cover Image (upload to replace)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageSelect(e, 'coverImage', setCoverPreview)}
                className="mt-1 w-full text-xs"
              />
              <input type="hidden" {...register('coverImage')} />
              {coverPreview && (
                <img src={coverPreview} alt="Cover preview" className="mt-2 w-full h-32 object-cover rounded-lg border" />
              )}
              {errors.coverImage && <p className="text-red-500 text-xs mt-1">{errors.coverImage.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-555 uppercase tracking-wide">Banner Image (upload to replace)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageSelect(e, 'bannerImage', setBannerPreview)}
                className="mt-1 w-full text-xs"
              />
              <input type="hidden" {...register('bannerImage')} />
              {bannerPreview && (
                <img src={bannerPreview} alt="Banner preview" className="mt-2 w-full h-24 object-cover rounded-lg border" />
              )}
              {errors.bannerImage && <p className="text-red-500 text-xs mt-1">{errors.bannerImage.message}</p>}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => router.push('/events')}
              className="flex-grow py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition text-sm text-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-grow py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md shadow-indigo-600/10 transition disabled:opacity-50 text-sm text-center"
            >
              {loading ? 'Saving...' : 'Update Event'}
            </button>
          </div>

        </div>

      </form>
    </div>
  );
}