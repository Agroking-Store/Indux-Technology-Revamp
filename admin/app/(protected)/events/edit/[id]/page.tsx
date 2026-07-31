'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-toastify';
import { 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Plus, 
  Layout, 
  Users, 
  Calendar, 
  HelpCircle, 
  FileText, 
  ArrowLeft 
} from 'lucide-react';
import api, { ApiResponse } from '@/lib/api';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
// (base64 inflates size ~33%, and MongoDB documents cap at 16MB total)[cite: 3]
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
  const { id } = useParams() as { id: string }; //[cite: 3]
  const router = useRouter(); //[cite: 3]
  const [loading, setLoading] = useState(false); //[cite: 3]
  const [fetching, setFetching] = useState(true); //[cite: 3]
  const [coverPreview, setCoverPreview] = useState<string>(''); //[cite: 3]
  const [bannerPreview, setBannerPreview] = useState<string>(''); //[cite: 3]

  // Dynamic Builders States[cite: 3]
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

  const watchIsPaid = watch('isPaid'); //[cite: 3]
  const watchType = watch('type');
  const watchStatus = watch('status');

  const formatTzDate = (dateStr?: string) => { //[cite: 3]
    if (!dateStr) return '';
    const dateObj = new Date(dateStr);
    const tzOffset = dateObj.getTimezoneOffset() * 60000;
    return new Date(dateObj.getTime() - tzOffset).toISOString().slice(0, 16);
  };

  useEffect(() => { //[cite: 3]
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

  // Dynamic Fields Helpers[cite: 3]
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

  // Speakers Helpers[cite: 3]
  const addSpeaker = () => setSpeakers([...speakers, { name: '', role: '', company: '', avatar: '' }]);
  const removeSpeaker = (index: number) => setSpeakers(speakers.filter((_, i) => i !== index));
  const updateSpeaker = (index: number, key: keyof SpeakerBuilder, value: string) => {
    const updated = [...speakers];
    updated[index] = { ...updated[index], [key]: value };
    setSpeakers(updated);
  };

  // Schedule Helpers[cite: 3]
  const addSchedule = () => setSchedule([...schedule, { time: '', title: '', description: '' }]);
  const removeSchedule = (index: number) => setSchedule(schedule.filter((_, i) => i !== index));
  const updateSchedule = (index: number, key: keyof ScheduleBuilder, value: string) => {
    const updated = [...schedule];
    updated[index] = { ...updated[index], [key]: value };
    setSchedule(updated);
  };

  // FAQs Helpers[cite: 3]
  const addFaq = () => setFaqs([...faqs, { question: '', answer: '' }]);
  const removeFaq = (index: number) => setFaqs(faqs.filter((_, i) => i !== index));
  const updateFaq = (index: number, key: keyof FaqBuilder, value: string) => {
    const updated = [...faqs];
    updated[index] = { ...updated[index], [key]: value };
    setFaqs(updated);
  };

  // Image Upload Helpers[cite: 3]
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

  const onSubmit = async (data: EventFormData) => { //[cite: 3]
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

      await api.put(`/events/${id}`, payload); //[cite: 3]

      toast.success('Event updated successfully');
      router.push('/events');
    } catch (error: any) {
      const msg = error?.response?.data?.message || error?.message || 'Failed to update event. Please try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) { //[cite: 3]
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
          onClick={() => router.push('/events')}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition text-slate-500 dark:text-slate-400 cursor-pointer"
        >
          <ArrowLeft size={20} />
        </Button>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Edit Event</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Configure details, custom dynamic registrations, and metadata schedules.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
        
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Basic Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <FileText className="text-indigo-600 dark:text-indigo-400 size-5" /> Basic Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Event Title *</Label>
                  <Input
                    {...register('title')}
                    placeholder="e.g. INDUX AI Hackathon 2026"
                  />
                  {errors.title && <p className="text-rose-500 text-xs mt-1">{errors.title.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Slug (optional)</Label>
                  <Input
                    {...register('slug')}
                    placeholder="auto-generated slug if empty"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Event Type *</Label>
                  <Select
                    value={watchType}
                    onValueChange={(val) => {
                      if (val) setValue('type', val, { shouldValidate: true });
                    }}
                  >
                    <SelectTrigger className="cursor-pointer font-bold">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Webinar" className="cursor-pointer">Webinar</SelectItem>
                      <SelectItem value="Hackathon" className="cursor-pointer">Hackathon</SelectItem>
                      <SelectItem value="Workshop" className="cursor-pointer">Workshop</SelectItem>
                      <SelectItem value="Meetup" className="cursor-pointer">Meetup</SelectItem>
                      <SelectItem value="Bootcamp" className="cursor-pointer">Bootcamp</SelectItem>
                      <SelectItem value="Conference" className="cursor-pointer">Conference</SelectItem>
                      <SelectItem value="Other" className="cursor-pointer">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Category *</Label>
                  <Input
                    {...register('category')}
                    placeholder="e.g. Tech, Design, Business"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Organizer *</Label>
                  <Input
                    {...register('organizer')}
                    placeholder="e.g. Indux Technology"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Short Description *</Label>
                <Textarea
                  {...register('shortDescription')}
                  rows={2}
                  maxLength={180}
                  placeholder="Brief preview of the event (max 180 chars)"
                />
                {errors.shortDescription && <p className="text-rose-500 text-xs mt-1">{errors.shortDescription.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Full Event Description *</Label>
                <Textarea
                  {...register('description')}
                  rows={6}
                  placeholder="Write detail parameters, specifications, guidelines, rules, etc."
                />
                {errors.description && <p className="text-rose-500 text-xs mt-1">{errors.description.message}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Registration Form Builder */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Layout className="text-indigo-600 dark:text-indigo-400 size-5" /> Registration Form Builder
              </CardTitle>
              <Button
                type="button"
                onClick={addField}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white rounded-lg transition text-xs font-bold shadow-sm cursor-pointer"
              >
                <Plus size={14} /> Add Custom Field
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Design dynamic questions. Standard fields (Full Name, Email, Phone) are configured by default. Added fields are captured inside the JSON answers model.
              </p>

              <div className="space-y-4 divide-y divide-slate-100 dark:divide-slate-800">
                {formFields.map((field, idx) => {
                  const isBaseField = field.name === 'name' || field.name === 'email' || field.name === 'phone';
                  return (
                    <div key={idx} className="pt-4 flex flex-col gap-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2 flex-grow max-w-sm">
                          <span className="text-xs font-bold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 w-6 h-6 rounded-full flex items-center justify-center select-none shrink-0">
                            {idx + 1}
                          </span>
                          <Input
                            type="text"
                            value={field.label}
                            disabled={isBaseField}
                            onChange={(e) => updateField(idx, 'label', e.target.value)}
                            className="w-full px-2.5 py-1 text-sm font-semibold bg-transparent text-slate-900 dark:text-slate-100 border-b border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:border-indigo-600 dark:focus:border-indigo-400 focus:outline-none disabled:bg-transparent disabled:border-none"
                          />
                        </div>

                        <div className="flex items-center gap-3">
                          <Select
                            value={field.type}
                            disabled={isBaseField}
                            onValueChange={(val) => {
                              if (val) updateField(idx, 'type', val);
                            }}
                          >
                            <SelectTrigger className="px-2.5 py-1 h-8 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-medium bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 disabled:opacity-50 cursor-pointer">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="text" className="cursor-pointer text-xs">Text Input</SelectItem>
                              <SelectItem value="email" className="cursor-pointer text-xs">Email</SelectItem>
                              <SelectItem value="phone" className="cursor-pointer text-xs">Phone</SelectItem>
                              <SelectItem value="number" className="cursor-pointer text-xs">Number</SelectItem>
                              <SelectItem value="textarea" className="cursor-pointer text-xs">Textarea</SelectItem>
                              <SelectItem value="select" className="cursor-pointer text-xs">Dropdown Select</SelectItem>
                              <SelectItem value="radio" className="cursor-pointer text-xs">Radio Buttons</SelectItem>
                              <SelectItem value="checkbox" className="cursor-pointer text-xs">Checkboxes</SelectItem>
                              <SelectItem value="date" className="cursor-pointer text-xs">Date</SelectItem>
                              <SelectItem value="url" className="cursor-pointer text-xs">URL Link</SelectItem>
                              <SelectItem value="file" className="cursor-pointer text-xs">File Upload</SelectItem>
                            </SelectContent>
                          </Select>

                          <Label className="flex items-center gap-1.5 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={field.required}
                              disabled={isBaseField}
                              onChange={(e) => updateField(idx, 'required', e.target.checked)}
                              className="rounded border-slate-300 dark:border-slate-700 text-indigo-600 focus:ring-indigo-500 bg-white dark:bg-slate-900 disabled:opacity-50"
                            />
                            <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Required</span>
                          </Label>

                          {!isBaseField && (
                            <div className="flex items-center gap-1">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => moveField(idx, 'up')}
                                disabled={idx === 3}
                                className="h-7 w-7 p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400 disabled:opacity-30 cursor-pointer"
                              >
                                <ArrowUp size={14} />
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => moveField(idx, 'down')}
                                disabled={idx === formFields.length - 1}
                                className="h-7 w-7 p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400 disabled:opacity-30 cursor-pointer"
                              >
                                <ArrowDown size={14} />
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeField(idx)}
                                className="h-7 w-7 p-1.5 hover:bg-rose-50 dark:hover:bg-rose-950/50 text-rose-600 dark:text-rose-400 rounded-lg cursor-pointer"
                              >
                                <Trash2 size={14} />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>

                      {!isBaseField && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pl-8 pb-2">
                          <div className="space-y-1">
                            <Label className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">Unique Identifier</Label>
                            <Input
                              type="text"
                              value={field.name}
                              onChange={(e) => updateField(idx, 'name', e.target.value)}
                              className="mt-0.5 w-full px-2.5 py-1 text-xs border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-950 font-mono text-slate-600 dark:text-slate-300 focus:outline-indigo-500 h-8"
                            />
                          </div>

                          <div className="space-y-1">
                            <Label className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">Placeholder Text</Label>
                            <Input
                              type="text"
                              value={field.placeholder || ''}
                              onChange={(e) => updateField(idx, 'placeholder', e.target.value)}
                              placeholder="e.g. Enter URL"
                              className="h-8 text-xs"
                            />
                          </div>

                          {(field.type === 'select' || field.type === 'radio' || field.type === 'checkbox') && (
                            <div className="space-y-1">
                              <Label className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">Options (Comma separated) *</Label>
                              <Input
                                type="text"
                                value={field.optionsStr || ''}
                                onChange={(e) => updateField(idx, 'optionsStr', e.target.value)}
                                placeholder="e.g. Red, Blue, Green"
                                className="h-8 text-xs"
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Dynamic Speakers, Schedule, and FAQs Container */}
          <Card>
            <CardContent className="p-6 space-y-6">
              
              {/* Speakers Profile */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                  <h4 className="text-base font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <Users className="text-indigo-600 dark:text-indigo-400 size-5" /> Speakers Profile
                  </h4>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={addSpeaker}
                    className="flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-bold transition cursor-pointer h-auto p-1"
                  >
                    <Plus size={14} /> Add Speaker
                  </Button>
                </div>

                {speakers.map((speaker, idx) => (
                  <div key={idx} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end bg-slate-50/80 dark:bg-slate-950/60 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 relative group">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSpeaker(idx)}
                      className="absolute top-2 right-2 h-7 w-7 text-rose-500 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </Button>
                    <div className="md:col-span-2 space-y-1">
                      <Label className="text-[10px] font-bold text-slate-400 dark:text-slate-500">Speaker Name *</Label>
                      <Input
                        type="text"
                        value={speaker.name}
                        onChange={(e) => updateSpeaker(idx, 'name', e.target.value)}
                        className="h-9 text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] font-bold text-slate-400 dark:text-slate-500">Role / Job Title *</Label>
                      <Input
                        type="text"
                        value={speaker.role}
                        onChange={(e) => updateSpeaker(idx, 'role', e.target.value)}
                        className="h-9 text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] font-bold text-slate-400 dark:text-slate-500">Company (optional)</Label>
                      <Input
                        type="text"
                        value={speaker.company || ''}
                        onChange={(e) => updateSpeaker(idx, 'company', e.target.value)}
                        className="h-9 text-xs"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Event Schedule Timeline */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                  <h4 className="text-base font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <Calendar className="text-indigo-600 dark:text-indigo-400 size-5" /> Event Schedule Timeline
                  </h4>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={addSchedule}
                    className="flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-bold transition cursor-pointer h-auto p-1"
                  >
                    <Plus size={14} /> Add Slot
                  </Button>
                </div>

                {schedule.map((slot, idx) => (
                  <div key={idx} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end bg-slate-50/80 dark:bg-slate-950/60 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 relative group">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSchedule(idx)}
                      className="absolute top-2 right-2 h-7 w-7 text-rose-500 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </Button>
                    <div className="space-y-1">
                      <Label className="text-[10px] font-bold text-slate-400 dark:text-slate-500">Time Range *</Label>
                      <Input
                        type="text"
                        value={slot.time}
                        onChange={(e) => updateSchedule(idx, 'time', e.target.value)}
                        className="h-9 text-xs"
                      />
                    </div>
                    <div className="md:col-span-2 space-y-1">
                      <Label className="text-[10px] font-bold text-slate-400 dark:text-slate-500">Session/Activity Title *</Label>
                      <Input
                        type="text"
                        value={slot.title}
                        onChange={(e) => updateSchedule(idx, 'title', e.target.value)}
                        className="h-9 text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] font-bold text-slate-400 dark:text-slate-500">Brief Detail (optional)</Label>
                      <Input
                        type="text"
                        value={slot.description || ''}
                        onChange={(e) => updateSchedule(idx, 'description', e.target.value)}
                        className="h-9 text-xs"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* FAQs */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                  <h4 className="text-base font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <HelpCircle className="text-indigo-600 dark:text-indigo-400 size-5" /> Frequently Asked Questions
                  </h4>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={addFaq}
                    className="flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-bold transition cursor-pointer h-auto p-1"
                  >
                    <Plus size={14} /> Add FAQ
                  </Button>
                </div>

                {faqs.map((faq, idx) => (
                  <div key={idx} className="bg-slate-50/80 dark:bg-slate-950/60 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 relative group space-y-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFaq(idx)}
                      className="absolute top-2 right-2 h-7 w-7 text-rose-500 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </Button>
                    <div className="space-y-1">
                      <Label className="text-[10px] font-bold text-slate-400 dark:text-slate-500">Question *</Label>
                      <Input
                        type="text"
                        value={faq.question}
                        onChange={(e) => updateFaq(idx, 'question', e.target.value)}
                        className="h-9 text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] font-bold text-slate-400 dark:text-slate-500">Answer *</Label>
                      <Textarea
                        value={faq.answer}
                        onChange={(e) => updateFaq(idx, 'answer', e.target.value)}
                        rows={2}
                        className="text-xs"
                      />
                    </div>
                  </div>
                ))}
              </div>

            </CardContent>
          </Card>

        </div>

        {/* Right Column */}
        <div className="space-y-6">
          
          {/* Publish Parameters */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-bold text-slate-800 dark:text-slate-200">Publish Parameters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Status</Label>
                <Select
                  value={watchStatus}
                  onValueChange={(val) => {
                    if (val) setValue('status', val as 'Draft' | 'Published', { shouldValidate: true });
                  }}
                >
                  <SelectTrigger className="cursor-pointer font-bold">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Draft" className="cursor-pointer">Draft (Hidden)</SelectItem>
                    <SelectItem value="Published" className="cursor-pointer">Published (Public)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Start Date & Time *</Label>
                <Input
                  type="datetime-local"
                  {...register('startDate')}
                />
                {errors.startDate && <p className="text-rose-500 text-xs mt-1">{errors.startDate.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">End Date & Time *</Label>
                <Input
                  type="datetime-local"
                  {...register('endDate')}
                />
                {errors.endDate && <p className="text-rose-500 text-xs mt-1">{errors.endDate.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Registration Deadline *</Label>
                <Input
                  type="datetime-local"
                  {...register('registrationDeadline')}
                />
                {errors.registrationDeadline && <p className="text-rose-500 text-xs mt-1">{errors.registrationDeadline.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Location / Venue *</Label>
                <Input
                  {...register('location')}
                  placeholder="e.g. Royal Orchid Hall OR Zoom Webinar Link"
                />
                {errors.location && <p className="text-rose-500 text-xs mt-1">{errors.location.message}</p>}
              </div>

              {/* Payment Configuration */}
              <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-3">
                <Label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    {...register('isPaid')}
                    className="rounded border-slate-300 dark:border-slate-700 text-indigo-600 focus:ring-indigo-500 bg-white dark:bg-slate-900"
                  />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Paid Event (Requires Ticket)</span>
                </Label>

                {watchIsPaid && (
                  <div className="space-y-1.5 transition-all">
                    <Label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Registration Fee (INR) *</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      {...register('registrationFee')}
                      placeholder="e.g. 499"
                    />
                    {errors.registrationFee && <p className="text-rose-500 text-xs mt-1">{errors.registrationFee.message}</p>}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Event Media */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-bold text-slate-800 dark:text-slate-200">Event Media</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Cover Image (upload to replace)</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageSelect(e, 'coverImage', setCoverPreview)}
                  className="text-xs text-slate-500 dark:text-slate-400 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 dark:file:bg-indigo-950/80 dark:file:text-indigo-300 hover:file:bg-indigo-100 cursor-pointer h-auto"
                />
                <input type="hidden" {...register('coverImage')} />
                {coverPreview && (
                  <img src={coverPreview} alt="Cover preview" className="mt-2 w-full h-32 object-cover rounded-xl border border-slate-200 dark:border-slate-800" />
                )}
                {errors.coverImage && <p className="text-rose-500 text-xs mt-1">{errors.coverImage.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Banner Image (upload to replace)</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageSelect(e, 'bannerImage', setBannerPreview)}
                  className="text-xs text-slate-500 dark:text-slate-400 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 dark:file:bg-indigo-950/80 dark:file:text-indigo-300 hover:file:bg-indigo-100 cursor-pointer h-auto"
                />
                <input type="hidden" {...register('bannerImage')} />
                {bannerPreview && (
                  <img src={bannerPreview} alt="Banner preview" className="mt-2 w-full h-24 object-cover rounded-xl border border-slate-200 dark:border-slate-800" />
                )}
                {errors.bannerImage && <p className="text-rose-500 text-xs mt-1">{errors.bannerImage.message}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/events')}
              className="flex-grow py-3 px-4 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl transition text-sm text-center cursor-pointer h-11"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-grow py-3 px-4 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-bold rounded-xl shadow-md shadow-indigo-600/10 transition disabled:opacity-50 text-sm text-center cursor-pointer h-11"
            >
              {loading ? 'Saving...' : 'Update Event'}
            </Button>
          </div>

        </div>

      </form>
    </div>
  );
}