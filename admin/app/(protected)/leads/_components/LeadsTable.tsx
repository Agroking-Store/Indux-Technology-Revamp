'use client';

import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { toast } from 'react-toastify';
import { Trash2, Search, X, CheckCircle, MessageSquare } from 'lucide-react';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import api, { ApiResponse } from '@/lib/api';
import { useRouter } from 'next/navigation';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  PaginationState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Lead {
  _id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: 'New' | 'Contacted' | 'Closed';
  createdAt: string;
}

export default function LeadsTable() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'All' | 'New' | 'Contacted' | 'Closed'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [totalCount, setTotalCount] = useState(0);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const router = useRouter();

  const isMounted = useRef(true);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPagination(prev => ({ ...prev, pageIndex: 0 })); 
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = { 
        limit: pagination.pageSize,
        page: pagination.pageIndex + 1
      };
      
      if (statusFilter !== 'All') params.status = statusFilter;
      if (debouncedSearch) params.search = debouncedSearch;

      const res = await api.get<ApiResponse<{ leads: Lead[]; pagination: { total: number } }>>(
        '/leads',
        { params }
      );
      if (isMounted.current) {
        setLeads(res.data.data.leads);
        setTotalCount(res.data.data.pagination.total);
      }
    } catch {
      // handled by axios interceptor
    } finally {
      if (isMounted.current) setLoading(false);
    }
  }, [statusFilter, debouncedSearch, pagination.pageIndex, pagination.pageSize]);

  useEffect(() => {
    isMounted.current = true;
    fetchLeads();
    return () => { isMounted.current = false; };
  }, [fetchLeads]);

  const handleDelete = useCallback(async (id: string) => {
    try {
      await api.delete(`/leads/${id}`);
      toast.success('Lead deleted successfully');
      fetchLeads();
    } catch {
      // handled
    }
  }, [fetchLeads]);

  const handleUpdateStatus = useCallback(async (id: string, currentStatus: string) => {
    let newStatus = 'New';
    if (currentStatus === 'New') newStatus = 'Contacted';
    else if (currentStatus === 'Contacted') newStatus = 'Closed';
    else newStatus = 'New'; // Cycle back to new

    try {
      await api.patch(`/leads/${id}/status`, { status: newStatus });
      toast.success(`Lead status updated to ${newStatus}`);
      fetchLeads();
    } catch {
      // handled
    }
  }, [fetchLeads]);

  const handleClearFilters = () => {
    setStatusFilter('All');
    setSearchTerm('');
    setDebouncedSearch('');
    setPagination({ pageIndex: 0, pageSize: 10 });
  };

  const columns: ColumnDef<Lead>[] = useMemo(() => [
    {
      id: "serial",
      header: () => <div className="text-center">S.No</div>,
      cell: ({ row }) => (
        <div className="text-center text-muted-foreground font-medium text-sm pr-2">
          {pagination.pageIndex * pagination.pageSize + row.index + 1}
        </div>
      ),
    },
    {
      accessorKey: "name",
      header: () => <div className="text-left font-semibold">Name</div>,
      cell: ({ row }) => {
        const lead = row.original;
        return (
          <div className="text-sm font-bold text-foreground truncate max-w-[180px] text-left">
            {lead.name}
          </div>
        );
      },
    },
    {
      id: "contact",
      header: () => <div className="text-left font-semibold">Contact Info</div>,
      cell: ({ row }) => {
        const lead = row.original;
        return (
          <div className="flex flex-col gap-1 text-left max-w-[220px]">
            <div className="text-xs text-muted-foreground truncate" title={lead.email}>{lead.email}</div>
            <div className="text-xs text-muted-foreground font-mono truncate" title={lead.phone}>{lead.phone}</div>
          </div>
        );
      },
    },

    {
      accessorKey: "createdAt",
      header: () => <div className="text-center font-semibold px-4">Date</div>,
      cell: ({ row }) => (
        <div className="whitespace-nowrap text-sm text-muted-foreground text-center px-4">
          {new Date(row.getValue("createdAt")).toLocaleDateString(undefined, {
            month: 'short', day: 'numeric', year: 'numeric',
          })}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: () => <div className="text-center font-semibold">Status</div>,
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        let colorClass = 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900/40'; // New
        if (status === 'Contacted') colorClass = 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/40';
        else if (status === 'Closed') colorClass = 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950/40 dark:text-green-400 dark:border-green-900/40';

        return (
          <div className="text-center">
            <Badge variant="outline" className={`whitespace-nowrap ${colorClass}`}>
              {status}
            </Badge>
          </div>
        );
      },
    },
    {
      id: "actions",
      header: () => <div className="text-center font-semibold pl-4">Actions</div>,
      cell: ({ row }) => {
        const lead = row.original;
        const status = row.getValue("status") as string;
      
        return (
          <div className="flex items-center justify-center gap-2 pl-4">
            <TooltipProvider>
              {status !== "Closed" && (
                <Tooltip>
                  <TooltipTrigger
                    render={
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={(e) => { e.stopPropagation(); handleUpdateStatus(lead._id, lead.status); }}
                        className="h-10 w-10 cursor-pointer bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors shadow-sm"
                      >
                        <CheckCircle size={15} />
                      </Button>
                    }
                  />
                  <TooltipContent>Update Status</TooltipContent>
                </Tooltip>
              )}
      
              <Tooltip>
                <TooltipTrigger render={
                  <div onClick={(e) => e.stopPropagation()}>
                    <ConfirmDialog
                      title="Are you sure you want to delete this lead?"
                      description="This action cannot be undone."
                      confirmText="Yes, delete"
                      onConfirm={() => handleDelete(lead._id)}
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
                <TooltipContent>Delete Lead</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        );
      },
    },
  ], [handleDelete, handleUpdateStatus, pagination]);

  const table = useReactTable({
    data: leads,
    columns,
    pageCount: Math.ceil(totalCount / pagination.pageSize),
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="space-y-4">
      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-card p-3 rounded-xl border border-border shadow-sm">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-[280px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search leads..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-9 border-blue-100 dark:border-blue-900 focus-visible:border-blue-300 focus-visible:ring-1 focus-visible:ring-blue-400 transition-all"
            />
          </div>
          <Select value={statusFilter} onValueChange={(value) => { setStatusFilter(value as 'All' | 'New' | 'Contacted' | 'Closed'); setPagination(prev => ({ ...prev, pageIndex: 0 })); }}>
            <SelectTrigger className="w-[140px] h-9 cursor-pointer">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All" className="cursor-pointer">All Statuses</SelectItem>
              <SelectItem value="New" className="cursor-pointer">New</SelectItem>
              <SelectItem value="Contacted" className="cursor-pointer">Contacted</SelectItem>
              <SelectItem value="Closed" className="cursor-pointer">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {(statusFilter !== 'All' || searchTerm !== '') && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleClearFilters}
            className="text-muted-foreground hover:text-foreground h-9 cursor-pointer"
          >
            <X size={16} className="mr-1" /> Clear Filters
          </Button>
        )}
      </div>

      {/* Table Container */}
      <Card className="overflow-hidden border-border bg-card shadow-sm">
        <Table className="table-fixed w-full">
          <TableHeader className="bg-muted/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => {
                  let width = 'auto';
                  if (header.id === 'serial') width = '70px';
                  else if (header.id === 'name') width = '200px';
                  else if (header.id === 'contact') width = '200px';
                  else if (header.id === 'createdAt') width = '140px';
                  else if (header.id === 'status') width = '120px';
                  else if (header.id === 'actions') width = '120px';
                  
                  return (
                    <TableHead key={header.id} className="font-bold text-muted-foreground uppercase text-xs tracking-wider h-11 align-middle" style={{ width }}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <TableRow key={idx}>
                  <TableCell><div className="flex justify-center"><Skeleton className="h-4 w-6" /></div></TableCell>
                  <TableCell><Skeleton className="h-10 w-[180px]" /></TableCell>
                  <TableCell><Skeleton className="h-10 w-[160px]" /></TableCell>
                  <TableCell><div className="flex justify-center"><Skeleton className="h-4 w-20" /></div></TableCell>
                  <TableCell><div className="flex justify-center"><Skeleton className="h-6 w-16 rounded-full" /></div></TableCell>
                  <TableCell><div className="flex justify-center gap-2"><Skeleton className="h-10 w-10 rounded-md" /><Skeleton className="h-10 w-10 rounded-md" /></div></TableCell>
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-slate-200 dark:hover:bg-slate-800/70 transition-colors cursor-pointer"
                  onClick={() => router.push(`/leads/${row.original._id}`)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3 px-4" onClick={(e) => {
                      // Prevent row click if clicking on an action button
                      if ((e.target as HTMLElement).closest('button')) {
                        e.stopPropagation();
                      }
                    }}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-48 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <h3 className="text-lg font-bold text-foreground">No Leads Found</h3>
                    <p className="text-sm mt-1 text-muted-foreground">
                      {searchTerm ? 'Try adjusting your search or filters.' : 'There are no contact leads yet.'}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        
        {/* Pagination Controls */}
        {totalCount > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/20">
            <div className="text-sm text-muted-foreground">
              Showing <span className="font-medium text-foreground">{pagination.pageIndex * pagination.pageSize + 1}</span> to <span className="font-medium text-foreground">{Math.min((pagination.pageIndex + 1) * pagination.pageSize, totalCount)}</span> of <span className="font-medium text-foreground">{totalCount}</span> results
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage() || loading}
                className="cursor-pointer"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage() || loading}
                className="cursor-pointer"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
