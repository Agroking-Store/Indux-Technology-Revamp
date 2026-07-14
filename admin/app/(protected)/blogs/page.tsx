'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { Edit2, Eye, EyeOff, Trash2, Plus, FileText, Tag } from 'lucide-react';
import api, { ApiResponse } from '@/lib/api';

interface Blog {
  _id: string;
  title: string;
  slug: string;
  category?: string;
  author?: string;
  tags?: string[];
  status: 'Draft' | 'Published';
  createdAt: string;
}

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-3/4" /></td>
      <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-20" /></td>
      <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-24" /></td>
      <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-16" /></td>
      <td className="px-6 py-4"><div className="h-6 bg-slate-100 rounded-full w-20" /></td>
      <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-24 ml-auto" /></td>
    </tr>
  );
}

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'' | 'Published' | 'Draft'>('');
  const [totalCount, setTotalCount] = useState(0);
  const isMounted = useRef(true);

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = { limit: '50' };
      if (statusFilter) params.status = statusFilter;

      const res = await api.get<ApiResponse<{ blogs: Blog[]; pagination: { total: number } }>>(
        '/blogs',
        { params }
      );
      if (isMounted.current) {
        setBlogs(res.data.data.blogs);
        setTotalCount(res.data.data.pagination.total);
      }
    } catch {
      // handled by axios interceptor
    } finally {
      if (isMounted.current) setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    isMounted.current = true;
    fetchBlogs();
    return () => { isMounted.current = false; };
  }, [fetchBlogs]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog?')) return;
    try {
      await api.delete(`/blogs/${id}`);
      toast.success('Blog deleted successfully');
      fetchBlogs();
    } catch {
      // handled
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'Published' ? 'Draft' : 'Published';
    try {
      await api.patch(`/blogs/${id}/status`, { status: newStatus });
      toast.success(`Blog ${newStatus === 'Published' ? 'published' : 'moved to Draft'}`);
      // Optimistic update — swap status in state without refetching
      setBlogs(prev =>
        prev.map(b => b._id === id ? { ...b, status: newStatus as Blog['status'] } : b)
      );
    } catch {
      // handled — revert by refetching
      fetchBlogs();
    }
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Blogs Feed</h1>
          <p className="text-gray-500 text-sm mt-1">
            Write, edit, and publish blog articles.
            {!loading && (
              <span className="ml-2 font-semibold text-indigo-600">{totalCount} article{totalCount !== 1 ? 's' : ''} total</span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as typeof statusFilter)}
            className="px-3 py-2 border rounded-xl text-sm bg-white text-slate-700 font-semibold focus:outline-indigo-500 border-slate-200"
          >
            <option value="">All Statuses</option>
            <option value="Published">Published</option>
            <option value="Draft">Drafts</option>
          </select>
          <Link
            href="/blogs/create"
            className="flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition font-semibold text-sm shadow-md shadow-indigo-600/10"
          >
            <Plus size={16} /> Create Article
          </Link>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow border border-gray-200/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Article Title</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Author</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Created Date</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">

              {/* Skeleton rows while loading */}
              {loading && Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)}

              {/* Data rows */}
              {!loading && blogs.map((blog) => (
                <tr key={blog._id} className="hover:bg-gray-50 transition-colors">

                  {/* Title + Slug */}
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-gray-900 line-clamp-1">{blog.title}</div>
                    <div className="text-xs text-gray-400 font-mono mt-0.5">/{blog.slug}</div>
                    {blog.tags && blog.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {blog.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-indigo-600 bg-indigo-50 border border-indigo-100 rounded px-1.5 py-0.5">
                            <Tag size={8} /> {tag}
                          </span>
                        ))}
                        {blog.tags.length > 3 && (
                          <span className="text-[10px] font-semibold text-gray-400">+{blog.tags.length - 3} more</span>
                        )}
                      </div>
                    )}
                  </td>

                  {/* Category */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-bold border border-slate-200/50">
                      {blog.category || 'Tech'}
                    </span>
                  </td>

                  {/* Author */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                    {blog.author || '—'}
                  </td>

                  {/* Date */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(blog.createdAt).toLocaleDateString(undefined, {
                      month: 'short', day: 'numeric', year: 'numeric',
                    })}
                  </td>

                  {/* Status Badge */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-bold rounded-full border ${
                      blog.status === 'Published'
                        ? 'bg-green-50 text-green-700 border-green-100'
                        : 'bg-yellow-50 text-yellow-700 border-yellow-100'
                    }`}>
                      {blog.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/blogs/edit/${blog._id}`}
                        className="text-indigo-600 hover:bg-indigo-50 p-1.5 rounded-lg transition inline-flex"
                        title="Edit article"
                      >
                        <Edit2 size={16} />
                      </Link>
                      <button
                        onClick={() => handleToggleStatus(blog._id, blog.status)}
                        className={`p-1.5 rounded-lg transition inline-flex ${
                          blog.status === 'Published'
                            ? 'text-yellow-600 hover:bg-yellow-50'
                            : 'text-green-600 hover:bg-green-50'
                        }`}
                        title={blog.status === 'Published' ? 'Move to Draft' : 'Publish article'}
                      >
                        {blog.status === 'Published' ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                      <button
                        onClick={() => handleDelete(blog._id)}
                        className="text-rose-600 hover:bg-rose-50 p-1.5 rounded-lg transition inline-flex"
                        title="Delete article"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>

                </tr>
              ))}

              {/* Empty state */}
              {!loading && blogs.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-gray-500">
                    <FileText className="size-12 mx-auto mb-3 opacity-30 text-gray-400" />
                    <h3 className="text-lg font-bold text-gray-800">No Articles Found</h3>
                    <p className="text-sm mt-1 text-gray-400">
                      {statusFilter ? `No ${statusFilter} articles yet.` : 'Create your first blog post to populate the feed.'}
                    </p>
                  </td>
                </tr>
              )}

            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}