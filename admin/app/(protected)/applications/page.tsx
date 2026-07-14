'use client';

import { useEffect, useState, useCallback, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { Download, FileText, Trash2, Mail, Phone, Clock, FileQuestion, Users, X, Search, Calendar, MapPin, Eye, Tag, Briefcase } from 'lucide-react';
import api, { ApiResponse, JobApplication, Career } from '@/lib/api';

function ApplicationsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Lists
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [jobs, setJobs] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [selectedJobId, setSelectedJobId] = useState(searchParams.get('jobId') || '');
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [locFilter, setLocFilter] = useState('');

  // Pagination State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Resume Preview State
  const [previewResumeUrl, setPreviewResumeUrl] = useState<string | null>(null);

  // Auth token for secure resume URL generation
  const [token, setToken] = useState<string>('');
  useEffect(() => {
    setToken(localStorage.getItem('token') || '');
  }, []);

  // Fetch job positions list for the filter dropdown
  useEffect(() => {
    api.get<ApiResponse<{ careers: Career[] }>>('/careers')
      .then(res => setJobs(res.data.data.careers))
      .catch(console.error);
  }, []);

  // Fetch applications
  const fetchApplications = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = {
        page,
        limit: 10,
      };
      if (selectedJobId) params.jobId = selectedJobId;
      if (statusFilter) params.status = statusFilter;
      if (searchQuery) params.search = searchQuery;
      if (dateFilter) params.date = dateFilter;
      if (deptFilter) params.department = deptFilter;
      if (locFilter) params.location = locFilter;

      const res = await api.get<ApiResponse<{ applications: JobApplication[], pagination: any }>>(
        '/applications',
        { params }
      );
      setApplications(res.data.data.applications);
      setTotalPages(res.data.data.pagination.pages || 1);
      setTotalCount(res.data.data.pagination.total || 0);
    } catch (error) {
      // handled
    } finally {
      setLoading(false);
    }
  }, [page, selectedJobId, statusFilter, searchQuery, dateFilter, deptFilter, locFilter]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this job application?')) return;
    try {
      await api.delete(`/applications/${id}`);
      toast.success('Job application deleted successfully');
      fetchApplications();
    } catch (error) {
      // handled
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await api.patch(`/applications/${id}/status`, { status: newStatus });
      toast.success(`Application status updated to ${newStatus}`);
      fetchApplications();
    } catch (error) {
      // handled
    }
  };

  // CSV Export Trigger
  const handleExportCSV = () => {
    const token = localStorage.getItem('token');
    const params = new URLSearchParams();
    if (selectedJobId) params.append('jobId', selectedJobId);
    if (statusFilter) params.append('status', statusFilter);
    if (searchQuery) params.append('search', searchQuery);
    if (dateFilter) params.append('date', dateFilter);
    if (deptFilter) params.append('department', deptFilter);
    if (locFilter) params.append('location', locFilter);
    params.append('token', token || '');

    const exportUrl = `${process.env.NEXT_PUBLIC_API_URL}/applications/export?${params.toString()}`;
    window.open(exportUrl, '_blank');
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'New':
        return 'bg-blue-50 border-blue-200 text-blue-705';
      case 'Reviewed':
        return 'bg-purple-50 border-purple-200 text-purple-700';
      case 'Shortlisted':
        return 'bg-yellow-50 border-yellow-250 text-yellow-700';
      case 'Interview Scheduled':
        return 'bg-indigo-50 border-indigo-200 text-indigo-700';
      case 'Interview Completed':
        return 'bg-cyan-50 border-cyan-200 text-cyan-705';
      case 'Offered':
        return 'bg-orange-50 border-orange-200 text-orange-700';
      case 'Hired':
        return 'bg-green-50 border-green-200 text-green-700';
      case 'Rejected':
        return 'bg-rose-50 border-rose-200 text-rose-700';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Job Applications</h1>
          <p className="text-gray-500 text-sm mt-1">Review candidate details, preview resume PDFs, and manage ATS pipeline status.</p>
        </div>
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition text-sm font-semibold shadow-md shadow-emerald-600/10"
        >
          <Download size={16} /> Export Candidates (CSV)
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-left">
        
        {/* Search */}
        <div className="relative">
          <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Search</label>
          <div className="relative mt-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input
              type="text"
              placeholder="Name or email..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
              className="w-full pl-9 pr-3 py-1.5 border rounded-lg text-xs focus:outline-indigo-500 bg-slate-50 border-slate-200"
            />
          </div>
        </div>

        {/* Job Selector */}
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Job Profile</label>
          <select
            value={selectedJobId}
            onChange={(e) => { setSelectedJobId(e.target.value); setPage(1); }}
            className="mt-1 w-full px-3 py-1.5 border rounded-lg text-xs bg-slate-50 border-slate-200 focus:outline-indigo-500"
          >
            <option value="">All Openings</option>
            {jobs.map(job => (
              <option key={job._id} value={job._id}>{job.title}</option>
            ))}
          </select>
        </div>

        {/* Status Selector */}
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Hiring Status</label>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="mt-1 w-full px-3 py-1.5 border rounded-lg text-xs bg-slate-50 border-slate-200 focus:outline-indigo-500"
          >
            <option value="">All Stages</option>
            <option value="New">New</option>
            <option value="Reviewed">Reviewed</option>
            <option value="Shortlisted">Shortlisted</option>
            <option value="Interview Scheduled">Interview Scheduled</option>
            <option value="Interview Completed">Interview Completed</option>
            <option value="Offered">Offered</option>
            <option value="Hired">Hired</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        {/* Department Filter */}
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Department</label>
          <input
            type="text"
            placeholder="e.g. Engineering"
            value={deptFilter}
            onChange={(e) => { setDeptFilter(e.target.value); setPage(1); }}
            className="mt-1 w-full px-3 py-1.5 border rounded-lg text-xs focus:outline-indigo-500 bg-slate-50 border-slate-200"
          />
        </div>

        {/* Location Filter */}
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Location</label>
          <input
            type="text"
            placeholder="e.g. Remote"
            value={locFilter}
            onChange={(e) => { setLocFilter(e.target.value); setPage(1); }}
            className="mt-1 w-full px-3 py-1.5 border rounded-lg text-xs focus:outline-indigo-500 bg-slate-50 border-slate-200"
          />
        </div>

        {/* Applied Date Filter */}
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Applied Date</label>
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => { setDateFilter(e.target.value); setPage(1); }}
            className="mt-1 w-full px-3 py-1.5 border rounded-lg text-xs focus:outline-indigo-500 bg-slate-50 border-slate-200"
          />
        </div>

      </div>

      {/* Main Candidates Table */}
      <div className="bg-white rounded-2xl shadow border border-gray-250/80 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <Users className="size-12 mx-auto mb-3 opacity-30 text-gray-400" />
            <h3 className="text-lg font-bold text-gray-800">No Candidates Found</h3>
            <p className="text-sm mt-1 text-gray-450">Try adjustments to your search queries or filter categories.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Candidate</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Applied Position</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Experience</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Applied Date</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Hiring Pipeline</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Resume PDF</th>
                  <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {applications.map((app) => {
                  const job = app.jobId as any;
                  return (
                    <tr key={app._id} className="hover:bg-gray-50">
                      
                      {/* Name & Contact */}
                      <td className="px-6 py-4 whitespace-nowrap text-left">
                        <div className="text-sm font-semibold text-gray-900">{app.candidateName || app.fullName || 'Candidate'}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5"><Mail size={12} className="text-slate-400" /> {app.email}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5"><Phone size={12} className="text-slate-400" /> {app.phone}</div>
                      </td>

                      {/* Applied Job Info */}
                      <td className="px-6 py-4 whitespace-nowrap text-left text-sm text-gray-500">
                        {job ? (
                          <>
                            <div className="font-semibold text-gray-800 line-clamp-1">{job.title}</div>
                            <div className="text-xs text-indigo-650 font-bold uppercase tracking-wider text-[10px] mt-0.5">{job.department}</div>
                          </>
                        ) : (
                          <span className="text-xs text-rose-600 font-bold bg-rose-50 border border-rose-100 rounded-md px-1.5 py-0.5 flex items-center gap-1 w-fit">
                            <FileQuestion size={12} /> Closed Job
                          </span>
                        )}
                      </td>

                      {/* Experience */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-bold text-left">
                        {app.experience}
                      </td>

                      {/* Applied Date */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-left">
                        {new Date(app.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>

                      {/* Status Selector Dropdown */}
                      <td className="px-6 py-4 whitespace-nowrap text-left">
                        <select
                          value={app.status}
                          onChange={(e) => handleStatusChange(app._id, e.target.value)}
                          className={`text-xs font-bold rounded-full px-3 py-1.5 focus:outline-none cursor-pointer border ${getStatusBadgeClass(app.status)}`}
                        >
                          <option value="New">New</option>
                          <option value="Reviewed">Reviewed</option>
                          <option value="Shortlisted">Shortlisted</option>
                          <option value="Interview Scheduled">Interview Scheduled</option>
                          <option value="Interview Completed">Interview Completed</option>
                          <option value="Offered">Offered</option>
                          <option value="Hired">Hired</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </td>

                      {/* Resume PDF Actions */}
                      <td className="px-6 py-4 whitespace-nowrap text-left space-x-1.5">
                        <button
                          onClick={() => setPreviewResumeUrl(`${process.env.NEXT_PUBLIC_API_URL}/applications/${app._id}/resume?token=${token}`)}
                          className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-650 bg-indigo-50 border border-indigo-100 px-2.5 py-1.5 rounded-lg hover:bg-indigo-100 transition"
                        >
                          <Eye size={12} /> Preview
                        </button>
                        <a
                          href={`${process.env.NEXT_PUBLIC_API_URL}/applications/${app._id}/resume?token=${token}`}
                          download={`Resume-${(app.candidateName || app.fullName || 'Candidate').replace(/\s+/g, '_')}.pdf`}
                          className="inline-flex items-center gap-1 text-[10px] font-semibold text-gray-650 bg-gray-50 border border-gray-200 px-2.5 py-1.5 rounded-lg hover:bg-gray-100 transition"
                        >
                          <Download size={12} /> Get
                        </a>
                      </td>

                      {/* Action buttons */}
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-1">
                        <button
                          onClick={() => router.push(`/applications/${app._id}`)}
                          className="text-slate-600 hover:bg-slate-100 p-1.5 rounded-lg transition inline-flex"
                          title="View candidate profile details"
                        >
                          <FileText size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(app._id)}
                          className="text-rose-600 hover:bg-rose-50 p-1.5 rounded-lg transition inline-flex"
                          title="Delete application"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="bg-gray-50 px-6 py-4 border-t flex items-center justify-between">
            <span className="text-xs text-gray-550">
              Showing page {page} of {totalPages} ({totalCount} total candidates)
            </span>
            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs font-semibold hover:bg-gray-50 transition disabled:opacity-50 disabled:hover:bg-white"
              >
                Previous
              </button>
              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs font-semibold hover:bg-gray-50 transition disabled:opacity-50 disabled:hover:bg-white"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* PDF resume preview modal overlay */}
      {previewResumeUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl border border-gray-100 max-w-4xl w-full h-[85vh] shadow-2xl flex flex-col overflow-hidden text-left">
            <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
              <div>
                <h3 className="font-extrabold text-gray-900 text-lg">Resume PDF Document</h3>
                <p className="text-xs text-gray-500">Recruiter quick preview console</p>
              </div>
              <button
                onClick={() => setPreviewResumeUrl(null)}
                className="p-1.5 hover:bg-slate-100 rounded-xl transition text-slate-400 hover:text-slate-655"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-grow p-4 bg-slate-100 flex items-center justify-center">
              <iframe
                src={`${previewResumeUrl}#toolbar=0`}
                className="w-full h-full rounded-2xl border bg-white shadow-inner"
                title="Resume Preview"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default function ApplicationsPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    }>
      <ApplicationsContent />
    </Suspense>
  );
}