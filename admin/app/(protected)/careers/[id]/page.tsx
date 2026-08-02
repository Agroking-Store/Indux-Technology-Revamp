'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { 
  ArrowLeft, Edit2, Eye, EyeOff, Trash2, Copy, Briefcase, 
  MapPin, Clock, Users, Mail, Phone, ExternalLink, Eye as EyeIcon,
  Trash2 as TrashIcon, Sparkles, CheckCircle, AlertCircle, FileText
} from 'lucide-react';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import api, { ApiResponse, Career, JobApplication } from '@/lib/api';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CareerDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [career, setCareer] = useState<Career | null>(null);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingApps, setLoadingApps] = useState(true);
  const [token, setToken] = useState<string>('');
  const isMounted = useRef(true);

  const backendBaseUrl = process.env.NEXT_PUBLIC_API_URL 
    ? process.env.NEXT_PUBLIC_API_URL 
    : 'http://localhost:5000/api/v1';

  useEffect(() => {
    isMounted.current = true;
    if (typeof window !== 'undefined') {
      setToken(localStorage.getItem('token') || '');
    }
    return () => {
      isMounted.current = false;
    };
  }, []);

  const fetchCareerDetails = useCallback(async () => {
    try {
      const res = await api.get<ApiResponse<Career>>(`/careers/${id}`);
      if (isMounted.current) {
        setCareer(res.data.data);
      }
    } catch (error) {
      router.push('/careers');
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [id, router]);

  const fetchApplications = useCallback(async () => {
    try {
      const res = await api.get<ApiResponse<{ applications: JobApplication[] }>>(`/applications?jobId=${id}&limit=100`);
      if (isMounted.current) {
        setApplications(res.data.data.applications);
      }
    } catch (error) {
      // handled
    } finally {
      if (isMounted.current) {
        setLoadingApps(false);
      }
    }
  }, [id]);

  useEffect(() => {
    fetchCareerDetails();
    fetchApplications();
  }, [fetchCareerDetails, fetchApplications]);

  const handleDelete = async () => {
    try {
      await api.delete(`/careers/${id}`);
      toast.success('Job posting and applications deleted successfully');
      router.push('/careers');
    } catch (error) {
      // handled
    }
  };

  const handleDuplicate = async () => {
    try {
      await api.post(`/careers/${id}/duplicate`);
      toast.success('Job duplicated successfully as Closed draft');
      router.push('/careers');
    } catch (error) {
      // handled
    }
  };

  const handleToggleStatus = async () => {
    if (!career) return;
    const newStatus = career.status === 'Active' ? 'Closed' : 'Active';
    try {
      await api.patch(`/careers/${id}/status`, { status: newStatus });
      toast.success(`Job status updated to ${newStatus}`);
      fetchCareerDetails();
    } catch (error) {
      // handled
    }
  };

  const handleStatusChange = async (appId: string, newStatus: string) => {
    try {
      await api.patch(`/applications/${appId}/status`, { status: newStatus });
      toast.success(`Application status updated to ${newStatus}`);
      fetchApplications();
    } catch (error) {
      // handled
    }
  };

  const handleDeleteApplication = async (appId: string) => {
    try {
      await api.delete(`/applications/${appId}`);
      toast.success('Application deleted successfully');
      fetchApplications();
    } catch (error) {
      // handled
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'New':
        return 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-900/40';
      case 'Reviewed':
        return 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-900/40';
      case 'Shortlisted':
        return 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-900/40';
      case 'Interview Scheduled':
        return 'bg-amber-50 dark:bg-amber-950/40 text-amber-750 dark:text-amber-400 border-amber-200 dark:border-amber-900/40';
      case 'Interview Completed':
        return 'bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-900/40';
      case 'Offered':
        return 'bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-400 border-cyan-200 dark:border-cyan-900/40';
      case 'Hired':
        return 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/40';
      case 'Rejected':
        return 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-900/40';
      default:
        return 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-400 border-slate-200 dark:border-slate-800';
    }
  };

  const getMatchScoreColor = (score: number | undefined) => {
    if (score === undefined) return 'text-slate-650 bg-slate-100 dark:bg-slate-800';
    if (score >= 80) return 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30';
    if (score >= 50) return 'text-amber-750 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30';
    return 'text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
      </div>
    );
  }

  if (!career) return null;

  return (
    <div className="space-y-6 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      
      {/* Top Navigation Backbar */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/careers"
            className={`${buttonVariants({ variant: "outline", size: "icon" })} h-9 w-9 rounded-xl border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer`}
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">{career.title}</h1>
              <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full border ${
                career.status === 'Active'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/40'
                  : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-900/40'
              }`}>
                {career.status}
              </span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">{career.department} • {career.location} • {career.employmentType}</p>
          </div>
        </div>

        {/* Toolbar operations */}
        <div className="flex items-center gap-2">
          <Link
            href={`/careers/edit/${career._id}`}
            className={`${buttonVariants({ variant: "outline" })} flex items-center gap-1.5 h-9 text-xs font-bold border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer`}
          >
            <Edit2 size={14} /> Edit Position
          </Link>
          <Button
            variant="outline"
            onClick={handleToggleStatus}
            className="flex items-center gap-1.5 h-9 text-xs font-bold border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            {career.status === 'Active' ? (
              <>
                <EyeOff size={14} /> Close Opening
              </>
            ) : (
              <>
                <Eye size={14} /> Reopen Opening
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={handleDuplicate}
            className="flex items-center gap-1.5 h-9 text-xs font-bold border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <Copy size={14} /> Duplicate
          </Button>
          <ConfirmDialog
            title="Are you sure you want to delete this job opening?"
            description="This action cannot be undone. This will permanently delete the opening and all its candidates."
            confirmText="Yes, delete"
            onConfirm={handleDelete}
            icon="trash"
            trigger={
              <Button
                variant="destructive"
                className="flex items-center gap-1.5 h-9 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl cursor-pointer"
              >
                <Trash2 size={14} /> Delete
              </Button>
            }
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Job Details Content (Span 2) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900/60 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-6">
            
            {/* Metadata Summary Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs bg-slate-50 dark:bg-slate-950/40 p-4 rounded-xl border border-slate-100 dark:border-slate-850">
              <div>
                <span className="font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider block">Experience Needed</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 text-sm mt-0.5 block">{career.experience}</span>
              </div>
              <div>
                <span className="font-bold text-slate-400 dark:text-slate-555 uppercase tracking-wider block">Target Openings</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 text-sm mt-0.5 block">{career.openings} Openings</span>
              </div>
              <div>
                <span className="font-bold text-slate-400 dark:text-slate-555 uppercase tracking-wider block">Est. Salary</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 text-sm mt-0.5 block">{career.salary || 'Not Disclosed'}</span>
              </div>
              <div>
                <span className="font-bold text-slate-400 dark:text-slate-555 uppercase tracking-wider block">Apply Deadline</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 text-sm mt-0.5 block">
                  {new Date(career.lastDate).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2 text-left">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-1.5">
                <Briefcase size={16} className="text-indigo-500" /> Job Description
              </h2>
              <p className="text-xs text-slate-650 dark:text-slate-350 leading-relaxed whitespace-pre-wrap">
                {career.description}
              </p>
            </div>

            {/* Skills */}
            {career.skills && career.skills.length > 0 && (
              <div className="space-y-3 text-left">
                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-1.5">
                  <Sparkles size={16} className="text-blue-500" /> Skills Required
                </h2>
                <div className="flex flex-wrap gap-2">
                  {career.skills.map((skill, i) => (
                    <span key={i} className="text-[10px] font-bold px-3 py-1 bg-blue-50/50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 border border-blue-100/40 dark:border-blue-900/30 rounded-xl">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Responsibilities */}
            {career.responsibilities && career.responsibilities.length > 0 && (
              <div className="space-y-2 text-left">
                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-1.5">
                  <CheckCircle size={16} className="text-emerald-500" /> Key Responsibilities
                </h2>
                <ul className="list-disc list-inside text-xs text-slate-650 dark:text-slate-350 space-y-1.5 pl-1">
                  {career.responsibilities.map((resp, i) => (
                    <li key={i}>{resp}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Requirements */}
            {career.requirements && career.requirements.length > 0 && (
              <div className="space-y-2 text-left">
                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-1.5">
                  <AlertCircle size={16} className="text-amber-500" /> Requirements & Qualifications
                </h2>
                <ul className="list-disc list-inside text-xs text-slate-650 dark:text-slate-350 space-y-1.5 pl-1">
                  {career.requirements.map((req, i) => (
                    <li key={i}>{req}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Benefits */}
            {career.benefits && career.benefits.length > 0 && (
              <div className="space-y-2 text-left">
                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-1.5">
                  <Sparkles size={16} className="text-amber-400" /> Perks & Benefits
                </h2>
                <ul className="list-disc list-inside text-xs text-slate-650 dark:text-slate-350 space-y-1.5 pl-1">
                  {career.benefits.map((benefit, i) => (
                    <li key={i}>{benefit}</li>
                  ))}
                </ul>
              </div>
            )}

          </div>
        </div>

        {/* Right Column: Mini Statistics Card (Span 1) */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900/60 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-left space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Quick Stats</h2>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-150/20 dark:border-indigo-900/30 rounded-xl">
                <div className="flex items-center gap-2">
                  <Users className="size-4 text-indigo-500" />
                  <span className="text-xs text-slate-600 dark:text-slate-400 font-semibold">Total Applicants</span>
                </div>
                <span className="text-sm font-extrabold text-indigo-600 dark:text-indigo-400">{applications.length} Students</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-150/20 dark:border-emerald-900/30 rounded-xl">
                <div className="flex items-center gap-2">
                  <CheckCircle className="size-4 text-emerald-500" />
                  <span className="text-xs text-slate-600 dark:text-slate-400 font-semibold">Active Pipeline</span>
                </div>
                <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                  {applications.filter(a => ['New', 'Reviewed', 'Shortlisted', 'Interview Scheduled'].includes(a.status)).length} Candidates
                </span>
              </div>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800 pt-4 text-xs text-slate-500 dark:text-slate-450 space-y-1">
              <div>Created on {new Date(career.createdAt).toLocaleDateString()}</div>
              <div>Last updated on {new Date(career.updatedAt).toLocaleDateString()}</div>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Section: Candidates Applied Table */}
      <div className="space-y-3 text-left">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Candidates Applied</h2>
        
        <div className="bg-white dark:bg-slate-900/60 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800 overflow-hidden">
          {loadingApps ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center py-16 text-slate-500 dark:text-slate-400">
              <Users className="size-10 mx-auto mb-3 opacity-30 text-slate-400 dark:text-slate-650" />
              <h3 className="text-sm font-bold text-slate-850 dark:text-slate-200">No Candidates Applied Yet</h3>
              <p className="text-xs mt-1 text-slate-450 dark:text-slate-500">Applications submitted for this opening will appear here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50/80 dark:bg-slate-950/50">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="px-6 py-3.5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">S.No.</TableHead>
                    <TableHead className="px-6 py-3.5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Candidate</TableHead>
                    <TableHead className="px-6 py-3.5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Experience</TableHead>
                    <TableHead className="px-6 py-3.5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Match Score</TableHead>
                    <TableHead className="px-6 py-3.5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Applied Date</TableHead>
                    <TableHead className="px-6 py-3.5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Hiring Pipeline</TableHead>
                    <TableHead className="px-6 py-3.5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Resume PDF</TableHead>
                    <TableHead className="px-6 py-3.5 text-right text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-slate-200/80 dark:divide-slate-800">
                  {applications.map((app, index) => (
                    <TableRow key={app._id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                      {/* S.No. */}
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400 font-semibold">
                        {index + 1}
                      </TableCell>
                      {/* Name & Contact */}
                      <TableCell className="px-6 py-4 whitespace-nowrap">
                        <div 
                          className="text-sm font-semibold text-slate-900 dark:text-slate-100 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400" 
                          onClick={() => router.push(`/applications/${app._id}`)}
                        >
                          {app.candidateName || app.fullName || 'Candidate'}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                          <Mail size={12} className="text-slate-400 dark:text-slate-500" /> {app.email}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                          <Phone size={12} className="text-slate-400 dark:text-slate-500" /> {app.phone}
                        </div>
                      </TableCell>

                      {/* Experience */}
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300 font-bold">
                        {app.experience}
                      </TableCell>

                      {/* Match Score */}
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`font-extrabold px-2.5 py-1 rounded-lg ${getMatchScoreColor(app.matchScore)}`}>
                          {app.matchScore !== undefined ? `${app.matchScore}/100` : 'N/A'}
                        </span>
                      </TableCell>



                      {/* Applied Date */}
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                        {new Date(app.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </TableCell>

                      {/* Status Selector Dropdown */}
                      <TableCell className="px-6 py-4 whitespace-nowrap">
                        <Select
                          value={app.status}
                          onValueChange={(value) => {
                            if (value) handleStatusChange(app._id, value);
                          }}
                        >
                          <SelectTrigger className={`text-xs font-bold rounded-full px-3 py-1.5 h-auto w-auto border shadow-none cursor-pointer ${getStatusBadgeClass(app.status)}`}>
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
                      </TableCell>

                      {/* Resume PDF Actions */}
                      <TableCell className="px-6 py-4 whitespace-nowrap space-x-1.5">
                        <a
                          href={app.resume ? `${backendBaseUrl}${app.resume}` : '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`${buttonVariants({ variant: "outline", size: "sm" })} h-7 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-900/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 cursor-pointer`}
                        >
                          <FileText size={12} className="mr-1" /> Preview
                        </a>
                      </TableCell>

                      {/* Action buttons */}
                      <TableCell className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                          onClick={() => router.push(`/applications/${app._id}`)}
                          title="View candidate profile details"
                        >
                          <ExternalLink size={16} />
                        </Button>
                        <ConfirmDialog
                          title="Are you sure you want to delete this job application?"
                          description="This action cannot be undone. This will permanently delete the application."
                          confirmText="Yes, delete"
                          onConfirm={() => handleDeleteApplication(app._id)}
                          icon="trash"
                          trigger={
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 cursor-pointer"
                              title="Delete application"
                            >
                              <TrashIcon size={16} />
                            </Button>
                          }
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
