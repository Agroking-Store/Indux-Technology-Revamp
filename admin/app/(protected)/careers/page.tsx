'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { Edit2, Eye, EyeOff, Trash2, Plus, Briefcase, Search } from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export default function CareersPage() {
  const router = useRouter();
  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('ALL');
  const [selectedLoc, setSelectedLoc] = useState('ALL');
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

  // Get unique roles (titles) and locations for filter options
  const roles = Array.from(new Set(careers.map(c => c.title).filter(Boolean)));
  const locations = Array.from(new Set(careers.map(c => c.location).filter(Boolean)));

  const filteredCareers = careers.filter(career => {
    const matchesSearch = career.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (career.department && career.department.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (career.location && career.location.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesRole = selectedRole === 'ALL' || career.title === selectedRole;
    const matchesLoc = selectedLoc === 'ALL' || career.location === selectedLoc;

    return matchesSearch && matchesRole && matchesLoc;
  });

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

      {/* Filters Bar */}
      <div className="bg-white dark:bg-slate-900/60 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
        
        {/* Search */}
        <div className="relative">
          <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Search</Label>
          <div className="relative mt-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 z-10" size={14} />
            <input
              type="text"
              placeholder="Search by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 h-9 border border-slate-200 dark:border-slate-800 rounded-lg text-xs bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500 shadow-none cursor-text animate-none"
            />
          </div>
        </div>

        {/* Role Selector */}
        <div>
          <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Role</Label>
          <div className="mt-1">
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="w-full px-3 py-1.5 h-9 border border-slate-200 dark:border-slate-800 rounded-lg text-xs bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:ring-indigo-500 shadow-none cursor-pointer">
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Roles</SelectItem>
                {roles.map(role => (
                  <SelectItem key={role} value={role}>{role}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Location Selector */}
        <div>
          <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Office Location</Label>
          <div className="mt-1">
            <Select value={selectedLoc} onValueChange={setSelectedLoc}>
              <SelectTrigger className="w-full px-3 py-1.5 h-9 border border-slate-200 dark:border-slate-800 rounded-lg text-xs bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:ring-indigo-500 shadow-none cursor-pointer">
                <SelectValue placeholder="All Locations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Locations</SelectItem>
                {locations.map(loc => (
                  <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

      </div>

      {/* Table Container */}
      <div className="bg-white dark:bg-slate-900/60 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50 dark:bg-slate-900/80">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[8%] px-6 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  S.No.
                </TableHead>
                <TableHead className="w-[27%] px-6 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Position Title
                </TableHead>
                <TableHead className="w-[20%] px-6 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Department
                </TableHead>
                <TableHead className="w-[20%] px-6 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Office Location
                </TableHead>
                <TableHead className="w-[12%] px-6 py-3 text-center text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Status
                </TableHead>
                <TableHead className="w-[13%] px-6 py-3 text-center text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-slate-200 dark:divide-slate-800 text-left">
              {filteredCareers.map((career, index) => (
                <TableRow key={career._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400 font-semibold">
                    {index + 1}
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap">
                    <div
                      className="text-sm font-semibold text-slate-900 dark:text-slate-100 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                      onClick={() => router.push(`/careers/${career._id}`)}
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
                  <TableCell className="px-6 py-4 whitespace-nowrap text-center">
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
                    <div className="flex items-center justify-center gap-1.5">
                      <Link
                        href={`/careers/edit/${career._id}`}
                        className={`${buttonVariants({ variant: "outline", size: "icon" })} h-9 w-9 cursor-pointer bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors shadow-sm`}
                        title="Edit posting"
                      >
                        <Edit2 size={15} />
                      </Link>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleToggleStatus(career._id, career.status)}
                        className={`h-9 w-9 cursor-pointer bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 transition-colors shadow-sm ${
                          career.status === 'Active' 
                            ? 'text-amber-600 dark:text-amber-400 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/50' 
                            : 'text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/50'
                        }`}
                        title={career.status === 'Active' ? 'Close job' : 'Reopen job'}
                      >
                        {career.status === 'Active' ? <EyeOff size={15} /> : <Eye size={15} />}
                      </Button>
                      <ConfirmDialog
                        title="Are you sure you want to delete this job?"
                        description="This action cannot be undone. This will permanently delete the job and all its applications."
                        confirmText="Yes, delete"
                        onConfirm={() => handleDelete(career._id)}
                        icon="trash"
                        trigger={
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-9 w-9 cursor-pointer bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 hover:border-rose-200 dark:hover:border-rose-900 transition-colors shadow-sm"
                            title="Delete"
                          >
                            <Trash2 size={15} />
                          </Button>
                        }
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredCareers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                    <Briefcase className="size-12 mx-auto mb-3 opacity-40 text-slate-400 dark:text-slate-500" />
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">No Job Postings Found</h3>
                    <p className="text-sm mt-1 text-slate-500 dark:text-slate-400">Try adjustments to your search queries.</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

    </div>
  );
}