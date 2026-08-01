'use client';

import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { toast } from 'react-toastify';
import { Trash2, Search, X, CheckCircle, MessageSquare, Check, ChevronsUpDown } from 'lucide-react';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import api, { ApiResponse } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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

const servicesList = [
  { value: "product_engineering", label: "Product Engineering" },
  { value: "it_consulting", label: "IT Consulting" },
  { value: "managed_it_services", label: "Managed IT Services" },
  { value: "dedicated_team", label: "Dedicated Team" },
  { value: "web_development", label: "Web Development" },
  { value: "mobile_development", label: "Mobile Development" },
  { value: "ui_ux_design", label: "UI/UX Design" },
  { value: "digital_transformation", label: "Digital Transformation" },
  { value: "cloud_services", label: "Cloud Services" },
  { value: "digital_marketing", label: "Digital Marketing" },
  { value: "ai_ml_services", label: "AI/ML Services" },
  { value: "others", label: "Others" },
];

export default function QuotesTable() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'All' | 'New' | 'Contacted' | 'Closed'>('All');
  const [serviceFilter, setServiceFilter] = useState<string>('All');
  const [serviceOpen, setServiceOpen] = useState(false);
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

  const fetchQuotes = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = { 
        limit: pagination.pageSize,
        page: pagination.pageIndex + 1
      };
      
      if (statusFilter !== 'All') params.status = statusFilter;
      if (serviceFilter !== 'All') params.serviceInterest = serviceFilter;
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
  }, [statusFilter, serviceFilter, debouncedSearch, pagination.pageIndex, pagination.pageSize]);

  useEffect(() => {
    isMounted.current = true;
    fetchQuotes();
    return () => { isMounted.current = false; };
  }, [fetchQuotes]);

  const handleDelete = useCallback(async (id: string) => {
    try {
      await api.delete(`/quotes/${id}`);
      toast.success('Quote deleted successfully');
      fetchQuotes();
    } catch {
      // handled
    }
  }, [fetchQuotes]);

  const handleUpdateStatus = useCallback(async (id: string, currentStatus: string) => {
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
  }, [fetchQuotes]);

  const handleClearFilters = () => {
    setStatusFilter('All');
    setServiceFilter('All');
    setSearchTerm('');
    setDebouncedSearch('');
    setPagination({ pageIndex: 0, pageSize: 10 });
  };

  const columns: ColumnDef<Quote>[] = useMemo(() => [
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
      header: () => <div className="text-left font-semibold">Client Name</div>,
      cell: ({ row }) => {
        const quote = row.original;
        return (
          <div className="flex flex-col gap-1 w-full text-left">
            <div className="text-sm font-bold text-foreground truncate max-w-[180px]">{quote.name}</div>
            {quote.companyName && (
              <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mt-0.5 truncate max-w-[180px]">
                {quote.companyName}
              </div>
            )}
          </div>
        );
      },
    },
    {
      id: "contact",
      header: () => <div className="text-left font-semibold">Contact Info</div>,
      cell: ({ row }) => {
        const quote = row.original;
        return (
          <div className="flex flex-col gap-1 text-left max-w-[160px]">
            <div className="text-xs text-muted-foreground truncate" title={quote.workEmail}>{quote.workEmail}</div>
            <div className="text-xs text-muted-foreground font-mono truncate" title={quote.phone}>{quote.phone}</div>
          </div>
        );
      },
    },
    {
      accessorKey: "serviceInterest",
      header: () => <div className="text-left font-semibold">Service Interest</div>,
      cell: ({ row }) => {
        const rawValue = row.getValue("serviceInterest") as string;
        const mappedLabel = servicesList.find((s) => s.value === rawValue)?.label || rawValue;
        return (
          <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-900/40 font-bold whitespace-nowrap truncate max-w-[150px]">
            {mappedLabel}
          </Badge>
        );
      }
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
        const quote = row.original;
        const status = row.getValue("status") as string;
        return (
          <div className="flex items-center justify-center gap-2 pl-4">
            <TooltipProvider>
              
              {status !== "Closed" && (
                <Tooltip>
                  <TooltipTrigger render={
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={(e) => { e.stopPropagation(); handleUpdateStatus(quote._id, quote.status); }}
                      className="h-10 w-10 cursor-pointer bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors shadow-sm"
                    >
                      <CheckCircle size={15} />
                    </Button>
                  } />
                  <TooltipContent>Update Status</TooltipContent>
                </Tooltip>
              )}

              <Tooltip>
                <TooltipTrigger render={
                  <div onClick={(e) => e.stopPropagation()}>
                    <ConfirmDialog
                      title="Are you sure you want to delete this quote?"
                      description="This action cannot be undone."
                      confirmText="Yes, delete"
                      onConfirm={() => handleDelete(quote._id)}
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
                <TooltipContent>Delete Quote</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        );
      },
    },
  ], [handleDelete, handleUpdateStatus, pagination]);

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
              className="pl-9 h-9 border-blue-100 dark:border-blue-900/30 focus-visible:border-blue-300 focus-visible:ring-1 focus-visible:ring-blue-400/30 transition-all"
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

          <Popover open={serviceOpen} onOpenChange={setServiceOpen}>
            <PopoverTrigger render={
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={serviceOpen}
                className="w-[180px] h-9 justify-between font-normal cursor-pointer"
              />
            }>
              {serviceFilter === 'All'
                ? "All Services"
                : servicesList.find((service) => service.value === serviceFilter)?.label}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0" align="start">
              <Command>
                <CommandInput placeholder="Search service..." className="h-9" />
                <CommandList className="max-h-[300px] overflow-y-auto overflow-x-hidden custom-scrollbar">
                  <CommandEmpty>No service found.</CommandEmpty>
                  <CommandGroup>
                    <CommandItem
                      value="All"
                      onSelect={() => {
                        setServiceFilter("All");
                        setServiceOpen(false);
                        setPagination(prev => ({ ...prev, pageIndex: 0 }));
                      }}
                      className="cursor-pointer"
                    >
                      All Services
                      <Check
                        className={cn(
                          "ml-auto h-4 w-4",
                          serviceFilter === "All" ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                    {servicesList.map((service) => (
                      <CommandItem
                        key={service.value}
                        value={service.value}
                        onSelect={(currentValue) => {
                          setServiceFilter(currentValue === serviceFilter ? "All" : currentValue);
                          setServiceOpen(false);
                          setPagination(prev => ({ ...prev, pageIndex: 0 }));
                        }}
                        className="cursor-pointer"
                      >
                        {service.label}
                        <Check
                          className={cn(
                            "ml-auto h-4 w-4",
                            serviceFilter === service.value ? "opacity-100" : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {(statusFilter !== 'All' || serviceFilter !== 'All' || searchTerm !== '') && (
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
                  else if (header.id === 'serviceInterest') width = '20%';
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
                  <TableCell><Skeleton className="h-6 w-24 rounded-full" /></TableCell>
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
                  onClick={() => router.push(`/quotes/${row.original._id}`)}
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
