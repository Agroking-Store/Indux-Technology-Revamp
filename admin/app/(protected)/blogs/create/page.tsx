'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { ArrowLeft } from 'lucide-react';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import BlogForm, { BlogFormData } from '../_components/BlogForm';

export default function CreateBlogPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (data: BlogFormData) => {
    setLoading(true);
    try {
      const tagsArray = data.tags ? data.tags.split(',').map((t) => t.trim()).filter(Boolean) : [];
      const payload = { ...data, tags: tagsArray };

      await api.post('/blogs', payload);
      toast.success('Article created successfully');
      router.push('/blogs');
    } catch (error) {
      // Handled
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 transition-colors duration-300">
      <div className="flex items-center gap-4 border-b border-border pb-4">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => router.push('/blogs')}
          className="text-muted-foreground cursor-pointer"
        >
          <ArrowLeft size={20} />
        </Button>
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Create Article</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Compose article content, categories, and SEO configurations.
          </p>
        </div>
      </div>

      <BlogForm onSubmit={onSubmit} loading={loading} isEditing={false} />
    </div>
  );
}