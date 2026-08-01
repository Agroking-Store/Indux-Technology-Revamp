'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { Edit2, Eye, Trash2, Plus, Briefcase, Copy, Inbox, Info } from 'lucide-react';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import api, { ApiResponse, Career } from '@/lib/api';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button, buttonVariants } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
export default function CareersPage() {
  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCareer, setSelectedCareer] = useState<Career | null>(null);
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
          className="flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white rounded-xl transition font-semibold text-sm shadow-md shadow-indigo-600/10 cursor-pointer"
        >
          <Plus size={16} /> Add Position
        </Link>
      </div>

      {/* Table Container */}
      <div className="bg-white dark:bg-slate-900/60 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800 overflow-hidden">
  <div className="overflow-x-auto">
    <Table>
      <TableHeader className="bg-slate-50 dark:bg-slate-900/80">
        <TableRow className="hover:bg-transparent">
          <TableHead className="w-[30%] px-6 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Position Title
          </TableHead>
          <TableHead className="w-[15%] px-6 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Department
          </TableHead>
          <TableHead className="w-[15%] px-6 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Office Location
          </TableHead>
          <TableHead className="w-[12%] px-6 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Applications
          </TableHead>
          <TableHead className="w-[140px] px-6 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Created Date
          </TableHead>
          <TableHead className="w-[100px] px-6 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Status
          </TableHead>
          <TableHead className="w-[200px] px-6 py-3 text-center text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Actions
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="divide-y divide-slate-200 dark:divide-slate-800 text-left">
        {careers.map((career) => (
          <TableRow key={career._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
            <TableCell className="px-6 py-4 whitespace-nowrap">
              <div
                className="text-sm font-semibold text-slate-900 dark:text-slate-100 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                onClick={() => setSelectedCareer(career)}
              >
                {career.title}
              </div>
            </TableCell>
            <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400 font-medium">
              {career.department}
            </TableCell>
            <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400 font-medium">
              {career.location}
            </TableCell>
            <TableCell className="px-6 py-4 whitespace-nowrap">
              <Link
                href={`/applications?jobId=${career._id}`}
                className="text-xs font-bold px-2.5 py-1 inline-flex bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 rounded-full border border-indigo-100 dark:border-indigo-900/40 transition cursor-pointer"
              >
                {career.applicationsCount || 0} Candidates
              </Link>
            </TableCell>
            <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400 font-medium">
              {new Date(career.createdAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </TableCell>
            <TableCell className="px-6 py-4 whitespace-nowrap">
              <span
                className={`px-2.5 py-1 inline-flex text-xs leading-5 font-bold rounded-full border ${
                  career.status === 'Active'
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/40'
                    : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-900/40'
                }`}
              >
                {career.status}
              </span>
            </TableCell>
            <TableCell className="px-6 py-4 whitespace-nowrap text-center">
              <div className="flex items-center justify-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedCareer(career)}
                  className="h-8 w-8 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 p-1.5 rounded-lg transition inline-flex cursor-pointer"
                  title="View job details"
                >
                  <Info size={16} />
                </Button>
                <Link
                  href={`/applications?jobId=${career._id}`}
                  className={`${buttonVariants({ variant: "ghost", size: "icon" })} h-8 w-8 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 p-1.5 rounded-lg transition inline-flex cursor-pointer`}
                  title="View candidates"
                >
                  <Inbox size={16} />
                </Link>
                <Link
                  href={`/careers/edit/${career._id}`}
                  className={`${buttonVariants({ variant: "ghost", size: "icon" })} h-8 w-8 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 p-1.5 rounded-lg transition inline-flex cursor-pointer`}
                  title="Edit posting"
                >
                  <Edit2 size={16} />
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDuplicate(career._id)}
                  className="h-8 w-8 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 p-1.5 rounded-lg transition inline-flex cursor-pointer"
                  title="Duplicate job opening"
                >
                  <Copy size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleToggleStatus(career._id, career.status)}
                  className="h-8 w-8 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 p-1.5 rounded-lg transition inline-flex cursor-pointer"
                  title={career.status === 'Active' ? 'Close job' : 'Reopen job'}
                >
                  <Eye size={16} />
                </Button>
                <ConfirmDialog
                  title="Are you sure you want to delete this job?"
                  description="This action cannot be undone. This will permanently delete the job and all its applications."
                  confirmText="Yes, delete"
                  onConfirm={() => handleDelete(career._id)}
                  icon="trash"
                  trigger={
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 p-1.5 rounded-lg transition inline-flex cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </Button>
                  }
                />
              </div>
            </TableCell>
          </TableRow>
        ))}
        {careers.length === 0 && (
          <TableRow>
            <TableCell colSpan={7} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
              <Briefcase className="size-12 mx-auto mb-3 opacity-40 text-slate-400 dark:text-slate-500" />
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">No Job Postings Found</h3>
              <p className="text-sm mt-1 text-slate-500 dark:text-slate-400">Create your first career opening to accept resumes.</p>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </div>
</div>

      {/* JOB DETAILS MODAL POPUP */}
      <Dialog open={!!selectedCareer} onOpenChange={(open) => !open && setSelectedCareer(null)}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl">
          {selectedCareer && (
            <div className="space-y-6 text-left">
              <DialogHeader className="border-b border-slate-100 dark:border-slate-800 pb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-400 rounded-full w-fit">
                  {selectedCareer.department}
                </span>
                <DialogTitle className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2">
                  {selectedCareer.title}
                </DialogTitle>
                <div className="flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">
                  <span className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-2 py-0.5 rounded-md">{selectedCareer.location}</span>
                  <span className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-2 py-0.5 rounded-md">{selectedCareer.employmentType}</span>
                  {selectedCareer.salary && (
                    <span className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-2 py-0.5 rounded-md">{selectedCareer.salary}</span>
                  )}
                </div>
              </DialogHeader>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Experience Required</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-205 text-sm mt-0.5 block">{selectedCareer.experience}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Target Openings</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-205 text-sm mt-0.5 block">{selectedCareer.openings} Positions</span>
                </div>
                <div>
                  <span className="font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Last Apply Date</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-205 text-sm mt-0.5 block">
                    {new Date(selectedCareer.lastDate).toLocaleDateString(undefined, {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>
                <div>
                  <span className="font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Posting Status</span>
                  <span className={`font-extrabold text-xs px-2.5 py-1 border rounded-full mt-1.5 inline-flex w-fit ${
                    selectedCareer.status === 'Active'
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/40'
                      : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-900/40'
                  }`}>
                    {selectedCareer.status}
                  </span>
                </div>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-4">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5">Job Description</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap">
                    {selectedCareer.description}
                  </p>
                </div>

                {selectedCareer.skills && selectedCareer.skills.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Skills Required</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedCareer.skills.map((skill, i) => (
                        <span key={i} className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border border-blue-100/40 dark:border-blue-900/30">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedCareer.responsibilities && selectedCareer.responsibilities.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">Key Responsibilities</h4>
                    <ul className="list-disc list-inside text-xs text-slate-600 dark:text-slate-400 space-y-1 pl-1.5">
                      {selectedCareer.responsibilities.map((resp, i) => (
                        <li key={i}>{resp}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedCareer.requirements && selectedCareer.requirements.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">Requirements & Qualifications</h4>
                    <ul className="list-disc list-inside text-xs text-slate-600 dark:text-slate-400 space-y-1 pl-1.5">
                      {selectedCareer.requirements.map((req, i) => (
                        <li key={i}>{req}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedCareer.benefits && selectedCareer.benefits.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">Perks & Benefits</h4>
                    <ul className="list-disc list-inside text-xs text-slate-600 dark:text-slate-400 space-y-1 pl-1.5">
                      {selectedCareer.benefits.map((benefit, i) => (
                        <li key={i}>{benefit}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}