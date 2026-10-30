'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'react-toastify';
import {
  ArrowLeft,
  Save,
  Upload,
  Users,
  Globe,
  Share2,
  Link2,
  Mail,
  User,
  Briefcase,
  Layers,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createTeamMember } from '@/lib/api';

export default function CreateTeamMemberPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [department, setDepartment] = useState('Leadership');
  const [bio, setBio] = useState('');
  const [status, setStatus] = useState<'Draft' | 'Published'>('Published');
  const [order, setOrder] = useState('1');

  // Social Links
  const [linkedin, setLinkedin] = useState('');
  const [twitter, setTwitter] = useState('');
  const [github, setGithub] = useState('');
  const [email, setEmail] = useState('');

  // Image Upload
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file (PNG, JPG, WebP)');
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Please enter the team member name.');
      return;
    }

    if (!role.trim()) {
      toast.error('Please enter the team member role/designation.');
      return;
    }

    if (!imageFile) {
      toast.error('Please upload a team member photo.');
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('name', name.trim());
      formData.append('role', role.trim());
      formData.append('department', department.trim());
      formData.append('bio', bio.trim());
      formData.append('status', status);
      formData.append('order', order);
      formData.append('image', imageFile);

      const socialLinks = {
        linkedin: linkedin.trim(),
        twitter: twitter.trim(),
        github: github.trim(),
        email: email.trim(),
      };
      formData.append('socialLinks', JSON.stringify(socialLinks));

      await createTeamMember(formData);
      toast.success('Team member added successfully!');
      router.push('/team');
    } catch (error: any) {
      console.error('Failed to create team member:', error);
      toast.error(error.response?.data?.message || 'Failed to create team member');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <Link
          href="/team"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="size-4" /> Back to Team List
        </Link>
        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold gap-2 shadow-md cursor-pointer"
        >
          <Save className="size-4" /> {loading ? 'Saving...' : 'Save Member'}
        </Button>
      </div>

      {/* Main Form Container */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
            <Users className="size-6 text-indigo-600 dark:text-indigo-400" />
            Add New Team Member
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            This profile will be displayed dynamically in the Our Team section of the About Us page.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Member Photo Upload */}
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              Member Photo <span className="text-rose-500">*</span>
            </label>
            <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
              {/* Photo Preview */}
              <div className="relative size-28 rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 shrink-0 flex items-center justify-center">
                {imagePreview ? (
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="text-center p-2 text-slate-400">
                    <User className="size-10 mx-auto opacity-40" />
                    <span className="text-[10px] uppercase font-bold tracking-wider">No Photo</span>
                  </div>
                )}
              </div>

              {/* Upload Input */}
              <div className="flex-1 w-full space-y-2">
                <input
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <label
                  htmlFor="image-upload"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-sm font-semibold shadow-sm transition-colors cursor-pointer w-full sm:w-auto"
                >
                  <Upload className="size-4" />
                  {imagePreview ? 'Replace Photo' : 'Select Photo from Computer'}
                </label>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Recommended: Square portrait (800x800px). Supports JPG, PNG, WebP. Automatically converted to WebP for lightning-fast loading.
                </p>
              </div>
            </div>
          </div>

          {/* Basic Details: Name & Role */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="e.g. Laxman Jadhav"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-600 outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Role / Title <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="e.g. Founder & Lead Architect"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-600 outline-none"
                  required
                />
              </div>
            </div>
          </div>

          {/* Department & Order */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Department
              </label>
              <div className="relative">
                <Layers className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm font-semibold focus:ring-2 focus:ring-indigo-600 outline-none"
                >
                  <option value="Leadership">Leadership</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Design">Design</option>
                  <option value="Marketing">Marketing & Growth</option>
                  <option value="Product">Product Management</option>
                  <option value="General">General</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Display Order
              </label>
              <input
                type="number"
                placeholder="1, 2, 3..."
                value={order}
                onChange={(e) => setOrder(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-600 outline-none"
              />
            </div>
          </div>

          {/* Short Bio */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Short Bio / Description
            </label>
            <textarea
              rows={3}
              placeholder="Brief description about this member's passion, focus, or achievements (1-2 sentences)..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-600 outline-none resize-none"
            />
          </div>

          {/* Social Links */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Social & Contact Profiles (Optional)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1 flex items-center gap-1.5">
                  <Globe className="size-3.5 text-blue-600" /> LinkedIn URL
                </label>
                <input
                  type="url"
                  placeholder="https://linkedin.com/in/username"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:ring-2 focus:ring-indigo-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1 flex items-center gap-1.5">
                  <Share2 className="size-3.5 text-sky-500" /> Twitter / X URL
                </label>
                <input
                  type="url"
                  placeholder="https://x.com/username"
                  value={twitter}
                  onChange={(e) => setTwitter(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:ring-2 focus:ring-indigo-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1 flex items-center gap-1.5">
                  <Link2 className="size-3.5 text-slate-700 dark:text-slate-300" /> GitHub URL
                </label>
                <input
                  type="url"
                  placeholder="https://github.com/username"
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:ring-2 focus:ring-indigo-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1 flex items-center gap-1.5">
                  <Mail className="size-3.5 text-emerald-500" /> Email Address
                </label>
                <input
                  type="email"
                  placeholder="member@induxtechnology.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:ring-2 focus:ring-indigo-600 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Publishing Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm font-semibold focus:ring-2 focus:ring-indigo-600 outline-none"
            >
              <option value="Published">Published (Visible on About Us page)</option>
              <option value="Draft">Draft (Hidden)</option>
            </select>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-6 rounded-xl shadow-lg cursor-pointer"
            >
              {loading ? 'Creating...' : 'Create Team Member'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
