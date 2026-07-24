'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { 
  Download, 
  FileText, 
  Trash2, 
  Mail, 
  Phone, 
  FileQuestion, 
  Users, 
  Search, 
  Eye 
} from 'lucide-react';
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
        return 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900/40 text-blue-700 dark:text-blue-400';
      case 'Reviewed':
        return 'bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-900/40 text-purple-700 dark:text-purple-400';
      case 'Shortlisted':
        return 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/40 text-amber-700 dark:text-amber-400';
      case 'Interview Scheduled':
        return 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-900/40 text-indigo-700 dark:text-indigo-400';
      case 'Interview Completed':
        return 'bg-cyan-50 dark:bg-cyan-950/40 border-cyan-200 dark:border-cyan-900/40 text-cyan-700 dark:text-cyan-400';
      case 'Offered':
        return 'bg-orange-50 dark:bg-orange-950/40 border-orange-200 dark:border-orange-900/40 text-orange-700 dark:text-orange-400';
      case 'Hired':
        return 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/40 text-emerald-700 dark:text-emerald-400';
      case 'Rejected':
        return 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/40 text-rose-700 dark:text-rose-400';
      default:
        return 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  return (
    <div className="space-y-6 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Job Applications</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Review candidate details, preview resume PDFs, and manage ATS pipeline status.
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white rounded-lg transition text-sm font-semibold shadow-md shadow-emerald-600/10 cursor-pointer"
        >
          <Download size={16} /> Export Candidates (CSV)
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white dark:bg-slate-900/60 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-left">
        
        {/* Search */}
        <div className="relative">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Search</label>
          <div className="relative mt-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={14} />
            <input
              type="text"
              placeholder="Name or email..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
              className="w-full pl-9 pr-3 py-1.5 border border-slate-200 dark:border-slate-800 rounded-lg text-xs focus:outline-indigo-500 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
            />
          </div>
        </div>

        {/* Job Selector */}
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Job Profile</label>
          <select
            value={selectedJobId}
            onChange={(e) => { setSelectedJobId(e.target.value); setPage(1); }}
            className="mt-1 w-full px-3 py-1.5 border border-slate-200 dark:border-slate-800 rounded-lg text-xs bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-indigo-500"
          >
            <option value="">All Openings</option>
            {jobs.map(job => (
              <option key={job._id} value={job._id}>{job.title}</option>
            ))}
          </select>
        </div>

        {/* Status Selector */}
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Hiring Status</label>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="mt-1 w-full px-3 py-1.5 border border-slate-200 dark:border-slate-800 rounded-lg text-xs bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-indigo-500"
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
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Department</label>
          <input
            type="text"
            placeholder="e.g. Engineering"
            value={deptFilter}
            onChange={(e) => { setDeptFilter(e.target.value); setPage(1); }}
            className="mt-1 w-full px-3 py-1.5 border border-slate-200 dark:border-slate-800 rounded-lg text-xs focus:outline-indigo-500 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
          />
        </div>

        {/* Location Filter */}
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Location</label>
          <input
            type="text"
            placeholder="e.g. Remote"
            value={locFilter}
            onChange={(e) => { setLocFilter(e.target.value); setPage(1); }}
            className="mt-1 w-full px-3 py-1.5 border border-slate-200 dark:border-slate-800 rounded-lg text-xs focus:outline-indigo-500 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
          />
        </div>

        {/* Applied Date Filter */}
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Applied Date</label>
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => { setDateFilter(e.target.value); setPage(1); }}
            className="mt-1 w-full px-3 py-1.5 border border-slate-200 dark:border-slate-800 rounded-lg text-xs focus:outline-indigo-500 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100"
          />
        </div>

      </div>

      {/* Main Candidates Table Container */}
      <div className="bg-white dark:bg-slate-900/60 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-20 text-slate-500 dark:text-slate-400">
            <Users className="size-12 mx-auto mb-3 opacity-30 text-slate-400 dark:text-slate-600" />
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">No Candidates Found</h3>
            <p className="text-sm mt-1 text-slate-400 dark:text-slate-500">Try adjustments to your search queries or filter categories.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
              <thead className="bg-slate-50/80 dark:bg-slate-950/50">
                <tr>
                  <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Candidate</th>
                  <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Applied Position</th>
                  <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Experience</th>
                  <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Match Score</th>
                  <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Rating</th>
                  <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Applied Date</th>
                  <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Hiring Pipeline</th>
                  <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Resume PDF</th>
                  <th className="px-6 py-3.5 text-right text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-900/40 divide-y divide-slate-200/80 dark:divide-slate-800">
                {applications.map((app) => {
                  const job = app.jobId as any;
                  return (
                    <tr key={app._id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                      
                      {/* Name & Contact */}
                      <td className="px-6 py-4 whitespace-nowrap text-left">
                        <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">{app.candidateName || app.fullName || 'Candidate'}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5"><Mail size={12} className="text-slate-400 dark:text-slate-500" /> {app.email}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5"><Phone size={12} className="text-slate-400 dark:text-slate-500" /> {app.phone}</div>
                      </td>

                      {/* Applied Job Info */}
                      <td className="px-6 py-4 whitespace-nowrap text-left text-sm text-slate-500 dark:text-slate-400">
                        {job ? (
                          <>
                            <div className="font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">{job.title}</div>
                            <div className="text-xs text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider text-[10px] mt-0.5">{job.department}</div>
                          </>
                        ) : (
                          <span className="text-xs text-rose-600 dark:text-rose-400 font-bold bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/40 rounded-md px-1.5 py-0.5 flex items-center gap-1 w-fit">
                            <FileQuestion size={12} /> Closed Job
                          </span>
                        )}
                      </td>

                      {/* Experience */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300 font-bold text-left">
                        {app.experience}
                      </td>

                      {/* Match Score */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-left">
                        <span className="font-extrabold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                          {app.matchScore !== undefined ? `${app.matchScore}/100` : 'N/A'}
                        </span>
                      </td>

                      {/* Rating */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-left">
                        <span className="font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 px-2.5 py-1 rounded-lg border border-amber-200 dark:border-amber-900/40 flex items-center gap-1 w-fit">
                          ⭐ {app.rating !== undefined ? app.rating.toFixed(1) : '0.0'}
                        </span>
                      </td>

                      {/* Applied Date */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400 text-left">
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
                        <a
                          href={`${process.env.NEXT_PUBLIC_API_URL}/applications/${app._id}/resume?token=${token}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/40 px-2.5 py-1.5 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition cursor-pointer"
                        >
                          <Eye size={12} /> Preview
                        </a>
                        <a
                          href={`${process.env.NEXT_PUBLIC_API_URL}/applications/${app._id}/resume?token=${token}`}
                          download={`Resume-${(app.candidateName || app.fullName || 'Candidate').replace(/\s+/g, '_')}.pdf`}
                          className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/80 transition cursor-pointer"
                        >
                          <Download size={12} /> Get
                        </a>
                      </td>

                      {/* Action buttons */}
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-1">
                        <button
                          onClick={() => router.push(`/applications/${app._id}`)}
                          className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 p-1.5 rounded-lg transition inline-flex cursor-pointer"
                          title="View candidate profile details"
                        >
                          <FileText size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(app._id)}
                          className="text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 p-1.5 rounded-lg transition inline-flex cursor-pointer"
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
          <div className="bg-slate-50/80 dark:bg-slate-950/50 px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Showing page {page} of {totalPages} ({totalCount} total candidates)
            </span>
            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition disabled:opacity-50 disabled:hover:bg-white dark:disabled:hover:bg-slate-900"
              >
                Previous
              </button>
              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition disabled:opacity-50 disabled:hover:bg-white dark:disabled:hover:bg-slate-900"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}

export default function ApplicationsPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
      </div>
    }>
      <ApplicationsContent />
    </Suspense>
  );
}