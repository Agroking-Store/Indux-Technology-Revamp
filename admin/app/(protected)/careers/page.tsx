'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { Edit2, Eye, Trash2, Plus, Briefcase, Copy, Inbox } from 'lucide-react';
import api, { ApiResponse, Career } from '@/lib/api';

export default function CareersPage() {
  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);
  const isMounted = useRef(true);

  const fetchCareers = useCallback(async () => {
    try {
      const res = await api.get<ApiResponse<{ careers: Career[] }>>('/careers');
      if (isMounted.current) {
        setCareers(res.data.data.careers);
      }
    } catch (error) {
      // handled
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    isMounted.current = true;
    const timer = setTimeout(() => {
      fetchCareers();
    }, 0);

    return () => {
      isMounted.current = false;
      clearTimeout(timer);
    };
  }, [fetchCareers]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this job and all its applications?')) return;
    try {
      await api.delete(`/careers/${id}`);
      toast.success('Job posting and applications deleted successfully');
      await fetchCareers();
    } catch (error) {
      // handled
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      await api.post(`/careers/${id}/duplicate`);
      toast.success('Job duplicated successfully as Closed draft');
      await fetchCareers();
    } catch (error) {
      // handled
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'Active' ? 'Closed' : 'Active';
    try {
      await api.patch(`/careers/${id}/status`, { status: newStatus });
      toast.success(`Job status updated to ${newStatus}`);
      await fetchCareers();
    } catch (error) {
      // handled
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Careers & Openings</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage job openings, internships, and applicant categories.</p>
        </div>
        <Link
          href="/careers/create"
          className="flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white rounded-xl transition font-semibold text-sm shadow-md shadow-indigo-600/10"
        >
          <Plus size={16} /> Add Position
        </Link>
      </div>

      {/* Table Container */}
      <div className="bg-white dark:bg-slate-900/60 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
            <thead className="bg-slate-50 dark:bg-slate-900/80">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Position Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Office Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Applications
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Created Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-900/40 divide-y divide-slate-200 dark:divide-slate-800 text-left">
              {careers.map((career) => (
                <tr key={career._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">{career.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400 font-medium">
                    {career.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400 font-medium">
                    {career.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                      href={`/applications?jobId=${career._id}`}
                      className="text-xs font-bold px-2.5 py-1 inline-flex bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 rounded-full border border-indigo-100 dark:border-indigo-900/40 transition"
                    >
                      {career.applicationsCount || 0} Candidates
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400 font-medium">
                    {new Date(career.createdAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2.5 py-1 inline-flex text-xs leading-5 font-bold rounded-full border ${
                        career.status === 'Active'
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/40'
                          : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-900/40'
                      }`}
                    >
                      {career.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-1.5 flex items-center">
                    <Link
                      href={`/applications?jobId=${career._id}`}
                      className="text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 p-1.5 rounded-lg transition inline-flex cursor-pointer"
                      title="View candidates"
                    >
                      <Inbox size={16} />
                    </Link>
                    <Link
                      href={`/careers/edit/${career._id}`}
                      className="text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 p-1.5 rounded-lg transition inline-flex cursor-pointer"
                      title="Edit posting"
                    >
                      <Edit2 size={16} />
                    </Link>
                    <button
                      onClick={() => handleDuplicate(career._id)}
                      className="text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 p-1.5 rounded-lg transition inline-flex cursor-pointer"
                      title="Duplicate job opening"
                    >
                      <Copy size={16} />
                    </button>
                    <button
                      onClick={() => handleToggleStatus(career._id, career.status)}
                      className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 p-1.5 rounded-lg transition inline-flex cursor-pointer"
                      title={career.status === 'Active' ? 'Close job' : 'Reopen job'}
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(career._id)}
                      className="text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 p-1.5 rounded-lg transition inline-flex cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {careers.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                    <Briefcase className="size-12 mx-auto mb-3 opacity-40 text-slate-400 dark:text-slate-500" />
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">No Job Postings Found</h3>
                    <p className="text-sm mt-1 text-slate-500 dark:text-slate-400">Create your first career opening to accept resumes.</p>
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