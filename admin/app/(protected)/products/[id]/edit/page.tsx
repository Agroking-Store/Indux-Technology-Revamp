'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { ArrowLeft, Save, Plus, Trash2, Upload, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getAdminProductById, updateProduct } from '@/lib/api';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('');
  const [themeColor, setThemeColor] = useState<'blue' | 'emerald' | 'cyan' | 'indigo'>('blue');
  const [shortDescription, setShortDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  const [status, setStatus] = useState<'Draft' | 'Published'>('Published');
  const [order, setOrder] = useState('0');

  // Existing image vs new file
  const [existingImage, setExistingImage] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  // Features, Stats, Tech, FAQs
  const [features, setFeatures] = useState<{ title: string; desc: string }[]>([]);
  const [stats, setStats] = useState<{ label: string; value: string }[]>([]);
  const [techInput, setTechInput] = useState('');
  const [faqs, setFaqs] = useState<{ q: string; a: string }[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        setFetchLoading(true);
        const data = await getAdminProductById(id);
        if (data) {
          setTitle(data.title || '');
          setSlug(data.slug || '');
          setCategory(data.category || '');
          setThemeColor(data.themeColor || 'blue');
          setShortDescription(data.shortDescription || '');
          setFullDescription(data.fullDescription || '');
          setStatus(data.status || 'Published');
          setOrder(data.order?.toString() || '0');
          setExistingImage(data.image || '');

          setFeatures(data.features && data.features.length > 0 ? data.features : [{ title: '', desc: '' }]);
          setStats(data.stats && data.stats.length > 0 ? data.stats : [{ label: '', value: '' }]);
          setTechInput(data.tech ? data.tech.join(', ') : '');
          setFaqs(data.faq && data.faq.length > 0 ? data.faq : [{ q: '', a: '' }]);
        }
      } catch (error) {
        console.error('Failed to load product:', error);
        toast.error('Failed to load product details');
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

    if (!title || !category || !shortDescription || !fullDescription) {
      toast.error('Please fill in all required fields.');
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('title', title);
      formData.append('slug', slug);
      formData.append('category', category);
      formData.append('themeColor', themeColor);
      formData.append('shortDescription', shortDescription);
      formData.append('fullDescription', fullDescription);
      formData.append('status', status);
      formData.append('order', order);

      if (imageFile) {
        formData.append('image', imageFile);
      }

      const validFeatures = features.filter((f) => f.title.trim());
      formData.append('features', JSON.stringify(validFeatures));

      const validStats = stats.filter((s) => s.label.trim() && s.value.trim());
      formData.append('stats', JSON.stringify(validStats));

      const techArray = techInput.split(',').map((t) => t.trim()).filter(Boolean);
      formData.append('tech', JSON.stringify(techArray));

      const validFaqs = faqs.filter((f) => f.q.trim());
      formData.append('faq', JSON.stringify(validFaqs));

      await updateProduct(id, formData);
      toast.success('Product updated successfully!');
      router.push('/products');
    } catch (error: any) {
      console.error('Failed to update product:', error);
      toast.error(error.response?.data?.message || 'Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center text-slate-500">
        Loading product details...
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
          href="/products"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="size-4" /> Back to Products
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
            <Package className="size-6 text-blue-600" /> Edit Product: {title}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Update information, features, or replace the product screenshot.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Product Title *
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
                Category *
              </label>
              <input
                type="text"
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm text-slate-900 dark:text-white focus:outline-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Theme Accent Color
              </label>
              <select
                value={themeColor}
                onChange={(e) => setThemeColor(e.target.value as any)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm text-slate-900 dark:text-white focus:outline-blue-600"
              >
                <option value="blue">Blue</option>
                <option value="emerald">Emerald Green</option>
                <option value="cyan">Cyan</option>
                <option value="indigo">Indigo / Purple</option>
              </select>
            </div>
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
              Full Description (Detail Page) *
            </label>
            <textarea
              required
              rows={4}
              value={fullDescription}
              onChange={(e) => setFullDescription(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm text-slate-900 dark:text-white focus:outline-blue-600"
            />
          </div>

          {/* Image */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Product Image
            </label>
            <div className="flex items-center gap-5">
              <label className="flex flex-col items-center justify-center w-48 h-32 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl cursor-pointer hover:border-blue-500 transition-colors p-3 bg-slate-50 dark:bg-slate-950">
                <Upload className="size-6 text-slate-400 mb-1" />
                <span className="text-xs font-semibold text-slate-500 text-center">Change image</span>
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
                    alt="Current"
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Features */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Key Features
              </label>
              <button
                type="button"
                onClick={() => setFeatures([...features, { title: '', desc: '' }])}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="size-3.5" /> Add Feature
              </button>
            </div>
            {features.map((feat, i) => (
              <div key={i} className="flex items-start gap-3">
                <input
                  type="text"
                  placeholder="Title"
                  value={feat.title}
                  onChange={(e) => {
                    const updated = [...features];
                    updated[i].title = e.target.value;
                    setFeatures(updated);
                  }}
                  className="w-1/3 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs"
                />
                <input
                  type="text"
                  placeholder="Description"
                  value={feat.desc}
                  onChange={(e) => {
                    const updated = [...features];
                    updated[i].desc = e.target.value;
                    setFeatures(updated);
                  }}
                  className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs"
                />
                {features.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setFeatures(features.filter((_, idx) => idx !== i))}
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
                <option value="Published">Published (Visible on site)</option>
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
              {loading ? 'Saving...' : 'Update Product'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
