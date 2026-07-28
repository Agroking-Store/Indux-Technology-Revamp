'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-toastify';
import { FileText, ArrowLeft, Image as ImageIcon, Settings } from 'lucide-react';
import api, { ApiResponse } from '@/lib/api';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';

const blogSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().optional(),
  shortDescription: z.string().min(1, 'Short description is required').max(300),
  content: z.string().min(1, 'Content is required'),
  category: z.string().min(1, 'Category is required'),
  tags: z.string().optional(),
  author: z.string().min(1, 'Author is required'),
  status: z.enum(['Draft', 'Published']),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  featuredImage: z.string().min(1, 'Featured image is required'),
});

type BlogFormData = z.infer<typeof blogSchema>;

const RECOMMENDED_MAX_IMAGE_SIZE = 3 * 1024 * 1024; // 3MB

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export default function EditBlogPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm<BlogFormData>({
    resolver: zodResolver(blogSchema),
    defaultValues: { 
      status: 'Draft',
      slug: '',
      shortDescription: '',
      content: '',
      category: 'Technology',
      tags: '',
      author: 'Indux Team',
      seoTitle: '',
      seoDescription: '',
      featuredImage: '',
    },
  });

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await api.get<ApiResponse<any>>(`/blogs/${id}`);
        const blog = res.data.data;

        const tagsString = blog.tags?.join(', ') || '';

        reset({
          title: blog.title,
          slug: blog.slug || '',
          shortDescription: blog.shortDescription || '',
          content: blog.content || '',
          category: blog.category || 'Technology',
          tags: tagsString,
          author: blog.author || 'Indux Team',
          status: blog.status || 'Draft',
          seoTitle: blog.seoTitle || '',
          seoDescription: blog.seoDescription || '',
          featuredImage: blog.featuredImage || '',
        });
        setImagePreview(blog.featuredImage || '');
      } catch (error) {
        // Handled
      } finally {
        setFetching(false);
      }
    };

    if (id) fetchBlog();
  }, [id, reset]);

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
      setValue('featuredImage', base64, { shouldValidate: true });
      setImagePreview(base64);
    } catch {
      toast.error('Failed to read the selected image.');
    }
  };

  const onSubmit = async (data: BlogFormData) => {
    setLoading(true);
    try {
      const tagsArray = data.tags ? data.tags.split(',').map((t) => t.trim()).filter(Boolean) : [];
      const payload = { ...data, tags: tagsArray };

      await api.put(`/blogs/${id}`, payload);

      toast.success('Article updated successfully');
      router.push('/blogs');
    } catch (error) {
      // Handled
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center gap-4 border-b border-border pb-4">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-[400px] w-full rounded-xl" />
            <Skeleton className="h-[200px] w-full rounded-xl" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-[250px] w-full rounded-xl" />
            <Skeleton className="h-[250px] w-full rounded-xl" />
            <div className="flex gap-3">
              <Skeleton className="h-10 w-full rounded-xl" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 transition-colors duration-300">
      
      {/* Header */}
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
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Edit Article</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Compose article content, categories, and SEO configurations.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
        
        {/* Left: Content fields */}
        <div className="lg:col-span-2 space-y-6">
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="text-indigo-600 dark:text-indigo-400 size-5" /> Article Content
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label>Article Title *</Label>
                <Input
                  {...register('title')}
                  placeholder="e.g. Navigating Next.js 16 Compiler Performance"
                />
                {errors.title && <p className="text-destructive text-xs mt-1">{errors.title.message}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Slug (optional)</Label>
                  <Input
                    {...register('slug')}
                    placeholder="auto-generated from title"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label>Author *</Label>
                  <Input {...register('author')} />
                  {errors.author && <p className="text-destructive text-xs mt-1">{errors.author.message}</p>}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Short Summary *</Label>
                <Textarea
                  {...register('shortDescription')}
                  rows={2}
                  maxLength={300}
                  className="max-h-[200px] overflow-y-auto"
                  placeholder="Quick hook summary displayed in cards (max 300 chars)"
                />
                {errors.shortDescription && <p className="text-destructive text-xs mt-1">{errors.shortDescription.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label>Article Body * (HTML/Markdown supported)</Label>
                <Textarea
                  {...register('content')}
                  rows={10}
                  className="font-mono max-h-[500px] overflow-y-auto"
                  placeholder="Write full blog post contents here..."
                />
                {errors.content && <p className="text-destructive text-xs mt-1">{errors.content.message}</p>}
              </div>
            </CardContent>
          </Card>

          {/* SEO Panel */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings className="text-indigo-600 dark:text-indigo-400 size-5" /> SEO Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label>SEO Search Title (optional)</Label>
                <Input
                  {...register('seoTitle')}
                  placeholder="SEO title tag override"
                />
              </div>

              <div className="space-y-1.5">
                <Label>SEO Meta Description (optional)</Label>
                <Input
                  {...register('seoDescription')}
                  placeholder="SEO meta description snippet override"
                />
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Right: metadata & media */}
        <div className="space-y-6">
          
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Parameters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label>Status</Label>
                <Controller
                  control={control}
                  name="status"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value || 'Draft'}>
                      <SelectTrigger className="cursor-pointer">
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Draft" className="cursor-pointer">Draft</SelectItem>
                        <SelectItem value="Published" className="cursor-pointer">Published</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="space-y-1.5">
                <Label>Category *</Label>
                <Input
                  {...register('category')}
                  placeholder="e.g. Tech, Dev, AI"
                />
                {errors.category && <p className="text-destructive text-xs mt-1">{errors.category.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label>Tags (comma separated)</Label>
                <Input
                  {...register('tags')}
                  placeholder="react, nextjs, routing"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-1.5">
                <ImageIcon className="text-indigo-600 dark:text-indigo-400" size={18} /> Featured Image
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1.5">
                <Label>Upload Image *</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="cursor-pointer file:cursor-pointer file:text-indigo-600 dark:file:text-indigo-400"
                />
                <input type="hidden" {...register('featuredImage')} />
                {imagePreview && (
                  <img src={imagePreview} alt="Featured image preview" className="mt-4 w-full h-32 object-cover rounded-lg border border-border" />
                )}
                {errors.featuredImage && <p className="text-destructive text-xs mt-1">{errors.featuredImage.message}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/blogs')}
              className="flex-1 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
            >
              {loading ? 'Updating...' : 'Update Post'}
            </Button>
          </div>

        </div>

      </form>
    </div>
  );
}