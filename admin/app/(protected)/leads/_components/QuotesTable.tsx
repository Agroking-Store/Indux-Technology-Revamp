'use client';

import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { toast } from 'react-toastify';
import { Trash2, Search, X, CheckCircle } from 'lucide-react';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import api, { ApiResponse } from '@/lib/api';
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

interface Quote {
  _id: string;
  name: string;
  workEmail: string;
  phone: string;
  companyName?: string;
  serviceInterest: string;
  message?: string;
  status: 'New' | 'Contacted' | 'Closed';
  createdAt: string;
}

export default function QuotesTable() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'All' | 'New' | 'Contacted' | 'Closed'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [totalCount, setTotalCount] = useState(0);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const isMounted = useRef(true);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPagination(prev => ({ ...prev, pageIndex: 0 })); 
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchQuotes = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = { 
        limit: pagination.pageSize,
        page: pagination.pageIndex + 1
      };
      
      if (statusFilter !== 'All') params.status = statusFilter;
      if (debouncedSearch) params.search = debouncedSearch;

      const res = await api.get<ApiResponse<{ quotes: Quote[]; pagination: { total: number } }>>(
        '/quotes',
        { params }
      );
      if (isMounted.current) {
        setQuotes(res.data.data.quotes);
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
    fetchQuotes();
    return () => { isMounted.current = false; };
  }, [fetchQuotes]);

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/quotes/${id}`);
      toast.success('Quote deleted successfully');
      fetchQuotes();
    } catch {
      // handled
    }
  };

  const handleUpdateStatus = async (id: string, currentStatus: string) => {
    let newStatus = 'New';
    if (currentStatus === 'New') newStatus = 'Contacted';
    else if (currentStatus === 'Contacted') newStatus = 'Closed';
    else newStatus = 'New';

    try {
      await api.patch(`/quotes/${id}/status`, { status: newStatus });
      toast.success(`Quote status updated to ${newStatus}`);
      fetchQuotes();
    } catch {
      // handled
    }
  };

  const handleClearFilters = () => {
    setStatusFilter('All');
    setSearchTerm('');
    setDebouncedSearch('');
    setPagination({ pageIndex: 0, pageSize: 10 });
  };

  const columns: ColumnDef<Quote>[] = useMemo(() => [
    {
      id: "serial",
      header: () => <div className="text-center">S.No</div>,
      cell: ({ row }) => (
        <span className="text-muted-foreground font-medium text-sm pl-2">
          {pagination.pageIndex * pagination.pageSize + row.index + 1}
        </span>
      ),
    },
    {
      accessorKey: "name",
      header: () => <div className="text-center">Client Details</div>,
      cell: ({ row }) => {
        const quote = row.original;
        return (
          <div className="flex flex-col gap-1 w-full pr-6">
            <div className="text-sm font-semibold text-foreground truncate">{quote.name}</div>
            <div className="text-xs text-muted-foreground truncate">{quote.workEmail}</div>
            <div className="text-xs text-muted-foreground font-mono truncate">{quote.phone}</div>
            {quote.companyName && (
              <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mt-0.5 truncate">
                {quote.companyName}
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "serviceInterest",
      header: () => <div className="text-center">Service Interest</div>,
      cell: ({ row }) => (
        <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-900/40 font-bold whitespace-nowrap truncate max-w-[150px]">
          {row.getValue("serviceInterest")}
        </Badge>
      ),
    },
    {
      accessorKey: "message",
      header: () => <div className="text-center">Message</div>,
      cell: ({ row }) => {
        const msg = row.getValue("message") as string;
        if (!msg) return <span className="text-muted-foreground text-sm">—</span>;
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger render={<div className="whitespace-nowrap text-sm text-muted-foreground truncate max-w-[150px] cursor-help">{msg}</div>} />
              <TooltipContent className="max-w-[300px] whitespace-normal">
                {msg}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      }
    },
    {
      accessorKey: "createdAt",
      header: () => <div className="text-center">Date</div>,
      cell: ({ row }) => (
        <div className="whitespace-nowrap text-sm text-muted-foreground">
          {new Date(row.getValue("createdAt")).toLocaleDateString(undefined, {
            month: 'short', day: 'numeric', year: 'numeric',
          })}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: () => <div className="text-center">Status</div>,
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        let colorClass = 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900/40'; // New
        if (status === 'Contacted') colorClass = 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/40';
        else if (status === 'Closed') colorClass = 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950/40 dark:text-green-400 dark:border-green-900/40';

        return (
          <Badge variant="outline" className={`whitespace-nowrap ${colorClass}`}>
            {status}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => {
        const quote = row.original;
        return (
          <div className="flex items-center justify-end gap-1">
            <TooltipProvider>
              
              <Tooltip>
                <TooltipTrigger render={
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleUpdateStatus(quote._id, quote.status)}
                    className="h-8 w-8 cursor-pointer text-indigo-600 dark:text-indigo-400 hover:text-indigo-700"
                  >
                    <CheckCircle size={16} />
                  </Button>
                } />
                <TooltipContent>Update Status</TooltipContent>
              </Tooltip>

              <ConfirmDialog
                title="Are you sure you want to delete this quote?"
                description="This action cannot be undone."
                confirmText="Yes, delete"
                onConfirm={() => handleDelete(quote._id)}
                icon="trash"
                trigger={
                  <div className="inline-block">
                    <Tooltip>
                      <TooltipTrigger render={
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-rose-600 dark:text-rose-400 hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-950/50 cursor-pointer"
                        >
                          <Trash2 size={16} />
                        </Button>
                      } />
                      <TooltipContent>Delete Quote</TooltipContent>
                    </Tooltip>
                  </div>
                }
              />
            </TooltipProvider>
          </div>
        );
      },
    },
  ], [handleDelete, pagination]);

  const table = useReactTable({
    data: quotes,
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
              placeholder="Search quotes..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={(value: any) => { setStatusFilter(value); setPagination(prev => ({ ...prev, pageIndex: 0 })); }}>
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
                  if (header.id === 'serial') width = '60px';
                  else if (header.id === 'name') width = '35%';
                  else if (header.id === 'actions') width = '100px';
                  
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
                  <TableCell><Skeleton className="h-6 w-8" /></TableCell>
                  <TableCell><Skeleton className="h-10 w-full" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-muted/50 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3 px-4">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-48 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <h3 className="text-lg font-bold text-foreground">No Quotes Found</h3>
                    <p className="text-sm mt-1 text-muted-foreground">
                      {searchTerm ? 'Try adjusting your search or filters.' : 'There are no quote requests yet.'}
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
