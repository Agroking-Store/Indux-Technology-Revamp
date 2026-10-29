'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { ArrowLeft, Save, Plus, Trash2, Upload, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getAdminRecentWorkById, updateRecentWork } from '@/lib/api';

export default function EditRecentWorkPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [tagline, setTagline] = useState('');
  const [category, setCategory] = useState('E-Commerce');
  const [client, setClient] = useState('');
  const [year, setYear] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [status, setStatus] = useState<'Draft' | 'Published'>('Published');
  const [order, setOrder] = useState('0');

  // Existing image vs new file
  const [existingImage, setExistingImage] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  // Highlights, Tech, Metrics
  const [highlights, setHighlights] = useState<string[]>([]);
  const [techInput, setTechInput] = useState('');
  const [metrics, setMetrics] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        setFetchLoading(true);
        const data = await getAdminRecentWorkById(id);
        if (data) {
          setTitle(data.title || '');
          setSlug(data.slug || '');
          setTagline(data.tagline || '');
          setCategory(data.category || 'E-Commerce');
          setClient(data.client || '');
          setYear(data.year || '');
          setShortDescription(data.shortDescription || '');
          setFullDescription(data.fullDescription || '');
          setLiveUrl(data.liveUrl || '');
          setStatus(data.status || 'Published');
          setOrder(data.order?.toString() || '0');
          setExistingImage(data.image || '');

          setHighlights(data.highlights && data.highlights.length > 0 ? data.highlights : ['']);
          setTechInput(data.technologies ? data.technologies.join(', ') : '');
          setMetrics(data.metrics && data.metrics.length > 0 ? data.metrics : [{ label: '', value: '' }]);
        }
      } catch (error) {
        console.error('Failed to load recent work:', error);
        toast.error('Failed to load project details');
      } finally {
        setFetchLoading(false);
      }
    }

    if (id) {
      loadData();
    }
  }, [id]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !tagline || !category || !client || !shortDescription || !fullDescription) {
      toast.error('Please fill in all required fields.');
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('title', title);
      formData.append('slug', slug);
      formData.append('tagline', tagline);
      formData.append('category', category);
      formData.append('client', client);
      formData.append('year', year);
      formData.append('shortDescription', shortDescription);
      formData.append('fullDescription', fullDescription);
      formData.append('liveUrl', liveUrl);
      formData.append('status', status);
      formData.append('order', order);

      if (imageFile) {
        formData.append('image', imageFile);
      }

      const validHighlights = highlights.map((h) => h.trim()).filter(Boolean);
      formData.append('highlights', JSON.stringify(validHighlights));

      const techArray = techInput.split(',').map((t) => t.trim()).filter(Boolean);
      formData.append('technologies', JSON.stringify(techArray));

      const validMetrics = metrics.filter((m) => m.label.trim() && m.value.trim());
      formData.append('metrics', JSON.stringify(validMetrics));

      await updateRecentWork(id, formData);
      toast.success('Recent work project updated successfully!');
      router.push('/recent-works');
    } catch (error: any) {
      console.error('Failed to update project:', error);
      toast.error(error.response?.data?.message || 'Failed to update project');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center text-slate-500">
        Loading project details...
      </div>
    );
  }

  const currentPreview = imagePreview || (existingImage.startsWith('http')
    ? existingImage
    : existingImage.startsWith('/')
      ? `${process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:5000'}${existingImage}`
      : existingImage);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <Link
          href="/recent-works"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="size-4" /> Back to Recent Works
        </Link>
        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold gap-2 shadow-md cursor-pointer"
        >
          <Save className="size-4" /> {loading ? 'Saving Changes...' : 'Save Changes'}
        </Button>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
            <Sparkles className="size-6 text-blue-600" /> Edit Project: {title}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Update project copy, deliverables, metrics, or replace screenshot.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Project Name *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm text-slate-900 dark:text-white focus:outline-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Slug (URL Identifier)
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm font-mono text-slate-900 dark:text-white focus:outline-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Client Name *
              </label>
              <input
                type="text"
                required
                value={client}
                onChange={(e) => setClient(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm text-slate-900 dark:text-white focus:outline-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Year
              </label>
              <input
                type="text"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm text-slate-900 dark:text-white focus:outline-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm text-slate-900 dark:text-white focus:outline-blue-600 font-semibold"
              >
                <option value="E-Commerce">E-Commerce</option>
                <option value="Clean Energy & Industrial">Clean Energy & Industrial</option>
                <option value="IT & Digital Transformation">IT & Digital Transformation</option>
                <option value="SaaS & FinTech">SaaS & FinTech</option>
                <option value="Retail & Enterprise">Retail & Enterprise</option>
                <option value="Coaching & Corporate">Coaching & Corporate</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Live URL (Optional)
              </label>
              <input
                type="url"
                value={liveUrl}
                onChange={(e) => setLiveUrl(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm text-slate-900 dark:text-white focus:outline-blue-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Catchy Tagline *
            </label>
            <input
              type="text"
              required
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm text-slate-900 dark:text-white focus:outline-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Short Description (Card Teaser) *
            </label>
            <textarea
              required
              rows={2}
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm text-slate-900 dark:text-white focus:outline-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Full Description (Modal Overview) *
            </label>
            <textarea
              required
              rows={4}
              value={fullDescription}
              onChange={(e) => setFullDescription(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm text-slate-900 dark:text-white focus:outline-blue-600"
            />
          </div>

          {/* Screenshot */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Project Screenshot
            </label>
            <div className="flex items-center gap-5">
              <label className="flex flex-col items-center justify-center w-48 h-32 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl cursor-pointer hover:border-blue-500 transition-colors p-3 bg-slate-50 dark:bg-slate-950">
                <Upload className="size-6 text-slate-400 mb-1" />
                <span className="text-xs font-semibold text-slate-500 text-center">Change screenshot</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
              {currentPreview && (
                <div className="relative w-48 h-32 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 p-1 flex items-center justify-center">
                  <img
                    src={currentPreview}
                    alt="Current Screenshot"
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Highlights */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Key Highlights / Deliverables
              </label>
              <button
                type="button"
                onClick={() => setHighlights([...highlights, ''])}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="size-3.5" /> Add Highlight
              </button>
            </div>
            {highlights.map((h, i) => (
              <div key={i} className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Highlight..."
                  value={h}
                  onChange={(e) => {
                    const updated = [...highlights];
                    updated[i] = e.target.value;
                    setHighlights(updated);
                  }}
                  className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs"
                />
                {highlights.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setHighlights(highlights.filter((_, idx) => idx !== i))}
                    className="p-2 text-slate-400 hover:text-red-500 cursor-pointer"
                  >
                    <Trash2 className="size-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Metrics */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Key Impact Metrics
              </label>
              <button
                type="button"
                onClick={() => setMetrics([...metrics, { label: '', value: '' }])}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="size-3.5" /> Add Metric
              </button>
            </div>
            {metrics.map((m, i) => (
              <div key={i} className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Metric Label"
                  value={m.label}
                  onChange={(e) => {
                    const updated = [...metrics];
                    updated[i].label = e.target.value;
                    setMetrics(updated);
                  }}
                  className="w-1/2 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs"
                />
                <input
                  type="text"
                  placeholder="Value"
                  value={m.value}
                  onChange={(e) => {
                    const updated = [...metrics];
                    updated[i].value = e.target.value;
                    setMetrics(updated);
                  }}
                  className="w-1/2 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs"
                />
                {metrics.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setMetrics(metrics.filter((_, idx) => idx !== i))}
                    className="p-2 text-slate-400 hover:text-red-500 cursor-pointer"
                  >
                    <Trash2 className="size-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Tech Stack */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Technologies (Comma Separated)
            </label>
            <input
              type="text"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm"
            />
          </div>

          {/* Status & Order */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm font-semibold"
              >
                <option value="Published">Published (Live on site)</option>
                <option value="Draft">Draft (Hidden)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Display Order
              </label>
              <input
                type="number"
                value={order}
                onChange={(e) => setOrder(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm"
              />
            </div>
          </div>

          <div className="flex justify-end pt-6">
            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-6 rounded-xl shadow-lg cursor-pointer"
            >
              {loading ? 'Saving...' : 'Update Project'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
