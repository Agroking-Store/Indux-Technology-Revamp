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
  Eye, 
  X
} from 'lucide-react';
import { buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import api, { ApiResponse, JobApplication, Career } from '@/lib/api';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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


  // Pagination State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Auth token for secure resume URL generation
  const [token, setToken] = useState<string>('');
  useEffect(() => {
    setToken(localStorage.getItem('token') || '');
  }, []);

  const backendBaseUrl = process.env.NEXT_PUBLIC_API_URL 
    ? process.env.NEXT_PUBLIC_API_URL 
    : 'http://localhost:5000/api/v1';

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
  }, [page, selectedJobId, statusFilter, searchQuery]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handleDelete = async (id: string) => {
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
          className="flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white rounded-xl transition font-semibold text-sm shadow-md shadow-indigo-600/10 cursor-pointer"
        >
          <Download size={16} /> Export Candidates (CSV)
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white dark:bg-slate-900/60 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-4 items-end text-left">
  
  {/* Search */}
  <div className="relative w-full md:w-80">
    <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Search</Label>
    <div className="relative mt-1">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 z-10" size={14} />
      <Input
        type="text"
        placeholder="Name or email..."
        value={searchQuery}
        onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
        className="w-full pl-9 pr-3 py-1.5 h-9 border-slate-200 dark:border-slate-800 rounded-lg text-xs bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-visible:ring-indigo-500 shadow-none"
      />
    </div>
  </div>

  {/* Job Selector */}
  <div className="w-full md:w-64">
    <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Job Profile</Label>
    <Select
      value={selectedJobId || "ALL"}
      onValueChange={(value) => { 
        setSelectedJobId(!value || value === "ALL" ? "" : value); 
        setPage(1); 
      }}
    >
      <SelectTrigger className="mt-1 w-full px-3 py-1.5 h-9 border-slate-200 dark:border-slate-800 rounded-lg text-xs bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:ring-indigo-500 shadow-none cursor-pointer">
        <SelectValue placeholder="All Openings">
          {selectedJobId ? (jobs.find(j => j._id === selectedJobId)?.title || "Loading...") : undefined}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="ALL">All Openings</SelectItem>
        {jobs.map(job => (
          <SelectItem key={job._id} value={job._id}>{job.title}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>

  {/* Status Selector */}
  <div className="w-full md:w-64">
    <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Hiring Status</Label>
    <Select
      value={statusFilter || "ALL"}
      onValueChange={(value) => { 
        setStatusFilter(!value || value === "ALL" ? "" : value); 
        setPage(1); 
      }}
    >
      <SelectTrigger className="mt-1 w-full px-3 py-1.5 h-9 border-slate-200 dark:border-slate-800 rounded-lg text-xs bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:ring-indigo-500 shadow-none cursor-pointer">
        <SelectValue placeholder="All Stages" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="ALL">All Stages</SelectItem>
        <SelectItem value="New">New</SelectItem>
        <SelectItem value="Reviewed">Reviewed</SelectItem>
        <SelectItem value="Shortlisted">Shortlisted</SelectItem>
        <SelectItem value="Interview Scheduled">Interview Scheduled</SelectItem>
        <SelectItem value="Interview Completed">Interview Completed</SelectItem>
        <SelectItem value="Offered">Offered</SelectItem>
        <SelectItem value="Hired">Hired</SelectItem>
        <SelectItem value="Rejected">Rejected</SelectItem>
      </SelectContent>
    </Select>
  </div>

  {/* Clear Filters */}
  {(searchQuery || selectedJobId || statusFilter) && (
    <Button
      variant="ghost"
      onClick={() => {
        setSearchQuery('');
        setSelectedJobId('');
        setStatusFilter('');
        setPage(1);
      }}
      className="h-9 px-4 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 cursor-pointer w-full md:w-auto"
    >
      <X size={14} className="mr-1.5" /> Clear Filter
    </Button>
  )}
</div>

      {/* Main Candidates Table Container */}
      <div className="bg-white dark:bg-slate-900/60 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800 overflow-hidden">
  {loading ? (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader className="bg-slate-50/80 dark:bg-slate-950/50">
          <TableRow className="hover:bg-transparent">
            <TableHead className="px-6 py-3.5 text-center text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">S.No.</TableHead>
            <TableHead className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Candidate</TableHead>
            <TableHead className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Applied Position</TableHead>
            <TableHead className="px-6 py-3.5 text-center text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Hiring Pipeline</TableHead>
            <TableHead className="px-6 py-3.5 text-center text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Applied Date</TableHead>
            <TableHead className="px-6 py-3.5 text-center text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, idx) => (
            <TableRow key={idx}>
              <TableCell><div className="flex justify-center"><Skeleton className="h-4 w-6" /></div></TableCell>
              <TableCell>
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-4 w-[160px]" />
                  <Skeleton className="h-3 w-[120px]" />
                  <Skeleton className="h-3 w-[100px]" />
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-4 w-[140px]" />
                  <Skeleton className="h-5 w-[100px] rounded-full" />
                </div>
              </TableCell>
              <TableCell><div className="flex justify-center"><Skeleton className="h-8 w-24 rounded-full" /></div></TableCell>
              <TableCell><div className="flex justify-center"><Skeleton className="h-4 w-20" /></div></TableCell>
              <TableCell>
                <div className="flex justify-center gap-2">
                  <Skeleton className="h-10 w-10 rounded-md" />
                  <Skeleton className="h-10 w-10 rounded-md" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  ) : applications.length === 0 ? (
    <div className="text-center py-20 text-slate-500 dark:text-slate-400">
      <Users className="size-12 mx-auto mb-3 opacity-30 text-slate-400 dark:text-slate-600" />
      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">No Candidates Found</h3>
      <p className="text-sm mt-1 text-slate-400 dark:text-slate-500">Try adjustments to your search queries or filter categories.</p>
    </div>
  ) : (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader className="bg-slate-50/80 dark:bg-slate-950/50">
          <TableRow className="hover:bg-transparent">
            <TableHead className="px-6 py-3.5 text-center text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">S.No.</TableHead>
            <TableHead className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Candidate</TableHead>
            <TableHead className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Applied Position</TableHead>
            <TableHead className="px-6 py-3.5 text-center text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Hiring Pipeline</TableHead>
            <TableHead className="px-6 py-3.5 text-center text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Applied Date</TableHead>
            <TableHead className="px-6 py-3.5 text-center text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-slate-200/80 dark:divide-slate-800">
          {applications.map((app, index) => {
            const job = app.jobId as any;
            return (
              <TableRow 
                key={app._id} 
                className="hover:bg-slate-200 dark:hover:bg-slate-800/70 transition-colors cursor-pointer"
                onClick={() => router.push(`/applications/${app._id}`)}
              >
                {/* S.No. */}
                <TableCell className="px-6 py-4 whitespace-nowrap text-center text-sm text-slate-500 dark:text-slate-400 font-semibold">
                  {(page - 1) * 10 + index + 1}
                </TableCell>
                {/* Name & Contact */}
                <TableCell className="px-6 py-4 whitespace-nowrap text-left max-w-[220px]">
                  <div 
                    className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate" 
                    title={app.candidateName || app.fullName || 'Candidate'}
                  >
                    {app.candidateName || app.fullName || 'Candidate'}
                  </div>
                  <div className="flex flex-col gap-1 mt-1">
                    <div className="text-xs text-slate-500 dark:text-slate-400 truncate" title={app.email}>
                      <Mail size={12} className="inline mr-1 text-slate-400" /> {app.email}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-mono truncate" title={app.phone}>
                      <Phone size={12} className="inline mr-1 text-slate-400" /> {app.phone}
                    </div>
                  </div>
                </TableCell>

                {/* Applied Job Info */}
                <TableCell className="px-6 py-4 whitespace-nowrap text-left text-sm text-slate-500 dark:text-slate-400 max-w-[200px]">
                  {job ? (
                    <div className="flex flex-col gap-1.5 items-start">
                      <div className="font-bold text-slate-800 dark:text-slate-200 truncate w-full" title={job.title}>{job.title}</div>
                      <Badge variant="outline" className="text-[10px] bg-slate-100 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 whitespace-nowrap truncate max-w-full font-bold">
                        {job.department}
                      </Badge>
                    </div>
                  ) : (
                    <span className="text-xs text-rose-600 dark:text-rose-400 font-bold bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/40 rounded-md px-1.5 py-0.5 flex items-center gap-1 w-fit">
                      <FileQuestion size={12} /> Closed Job
                    </span>
                  )}
                </TableCell>

                {/* Status Selector Dropdown */}
                <TableCell className="px-6 py-4 whitespace-nowrap text-center">
                  <div onClick={(e) => e.stopPropagation()}>
                    <Select
                      value={app.status}
                      onValueChange={(value) => {
                        if (value) handleStatusChange(app._id, value);
                      }}
                    >
                      <SelectTrigger className={`text-xs font-bold rounded-full px-3 py-1.5 h-auto w-auto border shadow-none cursor-pointer mx-auto ${getStatusBadgeClass(app.status)}`}>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="New">New</SelectItem>
                        <SelectItem value="Reviewed">Reviewed</SelectItem>
                        <SelectItem value="Shortlisted">Shortlisted</SelectItem>
                        <SelectItem value="Interview Scheduled">Interview Scheduled</SelectItem>
                        <SelectItem value="Interview Completed">Interview Completed</SelectItem>
                        <SelectItem value="Offered">Offered</SelectItem>
                        <SelectItem value="Hired">Hired</SelectItem>
                        <SelectItem value="Rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TableCell>

                {/* Applied Date */}
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400 text-center">
                  {new Date(app.createdAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </TableCell>

                {/* Action buttons */}
                <TableCell className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                  <div className="flex items-center justify-center gap-2">
                    <TooltipProvider>
                      {/* Download Resume */}
                      {app.resume && (
                        <Tooltip>
                          <TooltipTrigger render={
                            <a
                              href={`${backendBaseUrl}${app.resume}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className={buttonVariants({
                                variant: "outline",
                                size: "icon",
                                className: "h-10 w-10 cursor-pointer bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-amber-600 dark:text-amber-400 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/50 transition-colors shadow-sm",
                              })}
                            >
                              <Download size={15} />
                            </a>
                          } />
                          <TooltipContent>Download Resume</TooltipContent>
                        </Tooltip>
                      )}

                      {/* Delete */}
                      <Tooltip>
                        <TooltipTrigger render={
                          <div onClick={(e) => e.stopPropagation()}>
                            <ConfirmDialog
                              title="Are you sure you want to delete this job application?"
                              description="This action cannot be undone. This will permanently delete the application."
                              confirmText="Yes, delete"
                              onConfirm={() => handleDelete(app._id)}
                              icon="trash"
                              trigger={
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-10 w-10 cursor-pointer bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 hover:border-rose-200 dark:hover:border-rose-900 transition-colors shadow-sm"
                                >
                                  <Trash2 size={15} />
                                </Button>
                              }
                            />
                          </div>
                        } />
                        <TooltipContent>Delete Application</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  )}

  {/* Pagination Footer */}
  {totalCount > 0 && (
    <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20">
      <div className="text-sm text-slate-500 dark:text-slate-400">
        Showing <span className="font-medium text-slate-900 dark:text-slate-100">{(page - 1) * 10 + 1}</span> to <span className="font-medium text-slate-900 dark:text-slate-100">{Math.min(page * 10, totalCount)}</span> of <span className="font-medium text-slate-900 dark:text-slate-100">{totalCount}</span> results
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="cursor-pointer"
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={page === totalPages || totalPages === 0}
          onClick={() => setPage(page + 1)}
          className="cursor-pointer"
        >
          Next
        </Button>
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