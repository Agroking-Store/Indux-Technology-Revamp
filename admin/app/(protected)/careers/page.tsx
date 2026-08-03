'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { Edit2, Eye, EyeOff, Trash2, Plus, Briefcase, Search, Check, ChevronsUpDown, X } from 'lucide-react';
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
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";

export default function CareersPage() {
  const router = useRouter();
  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('ALL');
  const [selectedLoc, setSelectedLoc] = useState('ALL');
  const [roles, setRoles] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [locComboboxOpen, setLocComboboxOpen] = useState(false);
  const [roleComboboxOpen, setRoleComboboxOpen] = useState(false);
  
  // Pagination State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchFilters = useCallback(async () => {
    try {
      const res = await api.get<ApiResponse<{ roles: string[], locations: string[] }>>('/careers/filters');
      setRoles(res.data.data.roles);
      setLocations(res.data.data.locations);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const fetchCareers = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = {
        page,
        limit: 10,
      };
      if (searchTerm) params.search = searchTerm;
      if (selectedRole && selectedRole !== 'ALL') params.role = selectedRole;
      if (selectedLoc && selectedLoc !== 'ALL') params.location = selectedLoc;

      const res = await api.get<ApiResponse<{ careers: Career[], pagination: any }>>('/careers', { params });
      setCareers(res.data.data.careers);
      setTotalPages(res.data.data.pagination.pages || 1);
      setTotalCount(res.data.data.pagination.total || 0);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm, selectedRole, selectedLoc]);

  useEffect(() => {
    fetchFilters();
  }, [fetchFilters]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCareers();
    }, 300);

    return () => clearTimeout(timer);
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
      <div className="bg-white dark:bg-slate-900/60 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-4 items-end text-left">
        
        {/* Search */}
        <div className="relative w-full md:w-64">
          <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Search</Label>
          <div className="relative mt-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 z-10" size={14} />
            <input
              type="text"
              placeholder="Search by title..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
              className="w-full pl-9 pr-3 py-1.5 h-9 border border-slate-200 dark:border-slate-800 rounded-lg text-xs bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500 shadow-none cursor-text animate-none"
            />
          </div>
        </div>

        {/* Role Combobox */}
        <div className="w-full md:w-56">
          <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Role</Label>
          <Popover open={roleComboboxOpen} onOpenChange={setRoleComboboxOpen}>
            <PopoverTrigger render={
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={roleComboboxOpen}
                className="w-full justify-between mt-1 h-9 px-3 py-1.5 border-slate-200 dark:border-slate-800 rounded-lg text-xs bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:ring-indigo-500 shadow-none font-normal cursor-pointer"
              />
            }>
                <span className="truncate pr-2">
                  {selectedRole === "ALL"
                    ? "All Roles"
                    : selectedRole}
                </span>
                <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
            </PopoverTrigger>
            <PopoverContent className="w-full p-0 max-h-[300px]" align="start">
              <Command>
                <CommandInput placeholder="Search role..." className="h-9 text-xs" />
                <CommandList className="max-h-48 overflow-y-auto">
                  <CommandEmpty>No role found.</CommandEmpty>
                  <CommandGroup>
                    <CommandItem
                      value="ALL"
                      onSelect={() => {
                        setSelectedRole("ALL");
                        setRoleComboboxOpen(false);
                        setPage(1);
                      }}
                      className="text-xs cursor-pointer"
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedRole === "ALL" ? "opacity-100" : "opacity-0"
                        )}
                      />
                      All Roles
                    </CommandItem>
                    {roles.map((role) => (
                      <CommandItem
                        key={role}
                        value={role}
                        onSelect={() => {
                          setSelectedRole(role);
                          setRoleComboboxOpen(false);
                          setPage(1);
                        }}
                        className="text-xs cursor-pointer"
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedRole === role ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {role}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* Location Combobox */}
        <div className="w-full md:w-56">
          <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Office Location</Label>
          <Popover open={locComboboxOpen} onOpenChange={setLocComboboxOpen}>
            <PopoverTrigger render={
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={locComboboxOpen}
                className="w-full justify-between mt-1 h-9 px-3 py-1.5 border-slate-200 dark:border-slate-800 rounded-lg text-xs bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:ring-indigo-500 shadow-none font-normal cursor-pointer"
              />
            }>
                <span className="truncate pr-2">
                  {selectedLoc === "ALL"
                    ? "All Locations"
                    : selectedLoc}
                </span>
                <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
            </PopoverTrigger>
            <PopoverContent className="w-full p-0 max-h-[300px]" align="start">
              <Command>
                <CommandInput placeholder="Search location..." className="h-9 text-xs" />
                <CommandList className="max-h-48 overflow-y-auto">
                  <CommandEmpty>No location found.</CommandEmpty>
                  <CommandGroup>
                    <CommandItem
                      value="ALL"
                      onSelect={() => {
                        setSelectedLoc("ALL");
                        setLocComboboxOpen(false);
                        setPage(1);
                      }}
                      className="text-xs cursor-pointer"
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedLoc === "ALL" ? "opacity-100" : "opacity-0"
                        )}
                      />
                      All Locations
                    </CommandItem>
                    {locations.map((loc) => (
                      <CommandItem
                        key={loc}
                        value={loc}
                        onSelect={() => {
                          setSelectedLoc(loc);
                          setLocComboboxOpen(false);
                          setPage(1);
                        }}
                        className="text-xs cursor-pointer"
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedLoc === loc ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {loc}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* Clear Filters */}
        {(searchTerm || selectedRole !== 'ALL' || selectedLoc !== 'ALL') && (
          <Button
            variant="ghost"
            onClick={() => {
              setSearchTerm('');
              setSelectedRole('ALL');
              setSelectedLoc('ALL');
              setPage(1);
            }}
            className="h-9 px-4 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 cursor-pointer w-full md:w-auto"
          >
            <X size={14} className="mr-1.5" /> Clear Filters
          </Button>
        )}
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
              {loading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <TableRow key={idx}>
                    <TableCell><div className="flex justify-start"><Skeleton className="h-4 w-6" /></div></TableCell>
                    <TableCell><Skeleton className="h-4 w-[180px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[140px]" /></TableCell>
                    <TableCell><div className="flex justify-center"><Skeleton className="h-6 w-16 rounded-full" /></div></TableCell>
                    <TableCell><div className="flex justify-center gap-1.5"><Skeleton className="h-9 w-9 rounded-md" /><Skeleton className="h-9 w-9 rounded-md" /><Skeleton className="h-9 w-9 rounded-md" /></div></TableCell>
                  </TableRow>
                ))
              ) : careers.map((career, index) => (
                <TableRow 
                  key={career._id} 
                  className="hover:bg-slate-200 dark:hover:bg-slate-800/70 transition-colors cursor-pointer"
                  onClick={() => router.push(`/careers/${career._id}`)}
                >
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400 font-semibold">
                    {(page - 1) * 10 + index + 1}
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
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
                    <div className="flex items-center justify-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger render={
                            <Link
                              href={`/careers/edit/${career._id}`}
                              className={`${buttonVariants({ variant: "outline", size: "icon" })} h-9 w-9 cursor-pointer bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors shadow-sm`}
                            />
                          }>
                              <Edit2 size={15} />
                          </TooltipTrigger>
                          <TooltipContent>Edit posting</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger render={
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleToggleStatus(career._id, career.status)}
                              className={`h-9 w-9 cursor-pointer bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 transition-colors shadow-sm ${
                                career.status === 'Active' 
                                  ? 'text-amber-600 dark:text-amber-400 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/50' 
                                  : 'text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/50'
                              }`}
                            />
                          }>
                              {career.status === 'Active' ? <EyeOff size={15} /> : <Eye size={15} />}
                          </TooltipTrigger>
                          <TooltipContent>{career.status === 'Active' ? 'Close job' : 'Reopen job'}</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger render={<div />}>
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
                                  >
                                    <Trash2 size={15} />
                                  </Button>
                                }
                              />
                          </TooltipTrigger>
                          <TooltipContent>Delete job</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {!loading && careers.length === 0 && (
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

        {/* Pagination Controls */}
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