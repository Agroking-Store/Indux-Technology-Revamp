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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Careers & Openings</h1>
          <p className="text-gray-550 text-sm mt-1">Manage job openings, internships, and applicant categories.</p>
        </div>
        <Link
          href="/careers/create"
          className="flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition font-semibold text-sm shadow-md shadow-indigo-600/10"
        >
          <Plus size={16} /> Add Position
        </Link>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl shadow border border-gray-250/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Position Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Office Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Applications
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Created Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 text-left">
              {careers.map((career) => (
                <tr key={career._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">{career.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">
                    {career.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">
                    {career.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                      href={`/applications?jobId=${career._id}`}
                      className="text-xs font-bold px-2.5 py-1 inline-flex bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-full border border-indigo-100 transition"
                    >
                      {career.applicationsCount || 0} Candidates
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">
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
                          ? 'bg-green-50 text-green-700 border-green-200'
                          : 'bg-rose-50 text-rose-700 border-rose-100'
                      }`}
                    >
                      {career.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-1.5 flex items-center">
                    <Link
                      href={`/applications?jobId=${career._id}`}
                      className="text-indigo-600 hover:bg-indigo-50 p-1.5 rounded-lg transition inline-flex"
                      title="View candidates"
                    >
                      <Inbox size={16} />
                    </Link>
                    <Link
                      href={`/careers/edit/${career._id}`}
                      className="text-slate-600 hover:bg-slate-100 p-1.5 rounded-lg transition inline-flex"
                      title="Edit posting"
                    >
                      <Edit2 size={16} />
                    </Link>
                    <button
                      onClick={() => handleDuplicate(career._id)}
                      className="text-emerald-600 hover:bg-emerald-50 p-1.5 rounded-lg transition inline-flex"
                      title="Duplicate job opening"
                    >
                      <Copy size={16} />
                    </button>
                    <button
                      onClick={() => handleToggleStatus(career._id, career.status)}
                      className="text-blue-600 hover:bg-blue-50 p-1.5 rounded-lg transition inline-flex"
                      title={career.status === 'Active' ? 'Close job' : 'Reopen job'}
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(career._id)}
                      className="text-rose-600 hover:bg-rose-50 p-1.5 rounded-lg transition inline-flex"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {careers.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    <Briefcase className="size-12 mx-auto mb-3 opacity-30 text-gray-400" />
                    <h3 className="text-lg font-bold text-gray-800">No Job Postings Found</h3>
                    <p className="text-sm mt-1 text-gray-450">Create your first career opening to accept resumes.</p>
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