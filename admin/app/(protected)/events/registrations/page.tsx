'use client';

import { useEffect, useState, useCallback, Suspense, useMemo, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { 
  Search, 
  Download, 
  Mail, 
  Phone, 
  User, 
  Check, 
  X, 
  Trash2, 
  Eye, 
  CalendarIcon,
  CheckCircle
} from 'lucide-react';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import api, { ApiResponse, EventRegistration, Event } from '@/lib/api';
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { format } from 'date-fns';

function RegistrationsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isMounted = useRef(true);
  
  // Theme State (Legacy check, kept from original file)
  const [isDarkMode, setIsDarkMode] = useState(false);
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Lists & Table State
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters State
  const [selectedEventId, setSelectedEventId] = useState(searchParams.get('eventId') || '');
  const [selectedEventTitle, setselectedEventTitle] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [dateFilter, setDateFilter] = useState<Date | undefined>();
  const [datePopoverOpen, setDatePopoverOpen] = useState(false);
  
  // Pagination State
  const [totalCount, setTotalCount] = useState(0);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  // Debounce search query (500ms for consistency)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPagination(prev => ({ ...prev, pageIndex: 0 }));
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Fetch events list for the filter dropdown
  useEffect(() => {
    api.get<ApiResponse<Event[]>>('/events')
      .then(res => setEvents(res.data.data))
      .catch(console.error);
  }, []);

  // Fetch registrations
  const fetchRegistrations = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = {
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
      };
      
      const formattedDate = dateFilter ? format(dateFilter, "yyyy-MM-dd") : "";
      
      if (selectedEventId) params.eventId = selectedEventId;
      if (statusFilter) params.status = statusFilter;
      if (debouncedSearch) params.search = debouncedSearch;
      if (dateFilter) params.date = formattedDate;

      const res = await api.get<ApiResponse<{ registrations: EventRegistration[], pagination: { total: number } }>>(
        '/event-registrations', 
        { params }
      );
      
      if (isMounted.current) {
        setRegistrations(res.data.data.registrations);
        setTotalCount(res.data.data.pagination.total);
      }
    } catch (error) {
      // handled globally or silenced
    } finally {
      if (isMounted.current) setLoading(false);
    }
  }, [pagination.pageIndex, pagination.pageSize, selectedEventId, statusFilter, debouncedSearch, dateFilter]);

  useEffect(() => {
    isMounted.current = true;
    fetchRegistrations();
    return () => { isMounted.current = false; };
  }, [fetchRegistrations]);

  // Actions
  const handleUpdateStatus = useCallback(async (id: string, newStatus: string) => {
    try {
      await api.patch(`/event-registrations/${id}/status`, { status: newStatus });
      toast.success(`Registration status updated to ${newStatus}`);
      fetchRegistrations();
    } catch (error) {
      // handled
    }
  }, [fetchRegistrations]);

  const handleDelete = useCallback(async (id: string) => {
    try {
      await api.delete(`/event-registrations/${id}`);
      toast.success('Registration deleted');
      fetchRegistrations();
    } catch (error) {
      // handled
    }
  }, [fetchRegistrations]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setDebouncedSearch('');
    setSelectedEventId('');
    setselectedEventTitle('ALL');
    setStatusFilter('');
    setDateFilter(undefined);
    setPagination({ pageIndex: 0, pageSize: 10 });
  };

  const handleExportCSV = async () => {
    if (!selectedEventId) {
      toast.warning('Please select a specific Event in the filters to export its registrations.');
      return;
    }
    try {
      const response = await api.get(`/event-registrations/export/${selectedEventId}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `registrations_${selectedEventId}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error('Failed to export registrations CSV.');
    }
  };

  const columns: ColumnDef<EventRegistration>[] = useMemo(() => [
    {
      id: "serial",
      header: () => <div className="text-center font-semibold">S.No</div>,
      cell: ({ row }) => (
        <div className="text-center text-muted-foreground font-medium text-sm pr-2">
          {pagination.pageIndex * pagination.pageSize + row.index + 1}
        </div>
      ),
    },
    {
      accessorKey: "attendee",
      header: () => <div className="text-left font-semibold">Attendee</div>,
      cell: ({ row }) => {
        const reg = row.original;
        return (
          <div className="text-left max-w-[220px]">
            <div className="text-sm font-semibold text-foreground truncate">{reg.name}</div>
            <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1 truncate" title={reg.email}>
              <Mail size={12} className="shrink-0" /> {reg.email}
            </div>
            <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5 truncate" title={reg.phone}>
              <Phone size={12} className="shrink-0" /> {reg.phone}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "event",
      header: () => <div className="text-left font-semibold">Event Details</div>,
      cell: ({ row }) => {
        const reg = row.original;
        const eventObj = reg.eventId as unknown as Event;
        return (
          <div className="text-left max-w-[180px]">
            <div className="text-sm font-semibold text-foreground truncate" title={eventObj?.title}>
              {eventObj?.title || 'Unknown Event'}
            </div>
            <div className="text-xs text-indigo-600 dark:text-indigo-400 font-medium mt-0.5 truncate">
              {eventObj?.type || 'Standard'}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: () => <div className="text-left font-semibold">Date</div>,
      cell: ({ row }) => {
        const reg = row.original;
        return (
          <div className="whitespace-nowrap text-sm text-muted-foreground text-left">
            {new Date(reg.createdAt).toLocaleDateString(undefined, {
              month: 'short', day: 'numeric', year: 'numeric',
            })}
          </div>
        );
      },
    },
    {
      accessorKey: "paymentStatus",
      header: () => <div className="text-center font-semibold">Payment</div>,
      cell: ({ row }) => {
        const reg = row.original;
        let colorClass = 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800';
        if (reg.paymentStatus === 'Paid') colorClass = 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/40';
        else if (reg.paymentStatus === 'Failed') colorClass = 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900/40';
        else if (reg.paymentStatus === 'Pending') colorClass = 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/40';

        return (
          <div className="text-center flex flex-col items-center gap-1">
            <Badge variant="outline" className={`whitespace-nowrap ${colorClass}`}>
              {reg.paymentStatus || 'None'}
            </Badge>
            {reg.amountPaid ? (
              <span className="text-xs font-medium text-muted-foreground">₹{reg.amountPaid}</span>
            ) : null}
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: () => <div className="text-center font-semibold">Status</div>,
      cell: ({ row }) => {
        const reg = row.original;
        let colorClass = 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950/40 dark:text-yellow-400 dark:border-yellow-900/40'; // Pending
        if (reg.status === 'Approved') colorClass = 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950/40 dark:text-green-400 dark:border-green-900/40';
        else if (reg.status === 'Rejected') colorClass = 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900/40';
        else if (reg.status === 'Attended') colorClass = 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900/40';

        return (
          <div className="text-center">
            <Badge variant="outline" className={`whitespace-nowrap ${colorClass}`}>
              {reg.status || 'Pending'}
            </Badge>
          </div>
        );
      },
    },
    {
      id: "actions",
      header: () => <div className="text-center font-semibold pl-2">Actions</div>,
      cell: ({ row }) => {
        const reg = row.original;
        return (
          <div className="flex items-center justify-center gap-1 pl-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger render={
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => { e.stopPropagation(); router.push(`/events/registrations/${reg._id}`); }}
                    className="h-8 w-8 p-1.5 rounded-lg text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition cursor-pointer"
                  >
                    <Eye size={16} />
                  </Button>
                }
                />
                <TooltipContent>View Details</TooltipContent>
              </Tooltip>

              {reg.status !== 'Approved' && reg.status !== 'Attended' && (
                <Tooltip>
                  <TooltipTrigger render={
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => { e.stopPropagation(); handleUpdateStatus(reg._id, 'Approved'); }}
                      className="h-8 w-8 p-1.5 rounded-lg text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-950/50 transition cursor-pointer"
                    >
                      <Check size={16} />
                    </Button>
                  }
                  />
<TooltipContent>Approve</TooltipContent>
                </Tooltip>
              )}

              {reg.status === 'Approved' && (
                <Tooltip>
                  <TooltipTrigger render={
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => { e.stopPropagation(); handleUpdateStatus(reg._id, 'Attended'); }}
                      className="h-8 w-8 p-1.5 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition cursor-pointer"
                    >
                      <CheckCircle size={16} />
                    </Button>
                  }
                  />
                  <TooltipContent>Mark Attended</TooltipContent>
                </Tooltip>
              )}

              {reg.status !== 'Approved' && reg.status !== 'Attended' && (
                <Tooltip>
                  <TooltipTrigger render={
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => { e.stopPropagation(); handleUpdateStatus(reg._id, 'Rejected'); }}
                      className="h-8 w-8 p-1.5 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 transition cursor-pointer"
                    >
                      <X size={16} />
                    </Button>
                  }
                  />
                  <TooltipContent>Reject</TooltipContent>
                </Tooltip>
              )}

              <Tooltip>
                <TooltipTrigger render={
                  <div onClick={(e) => e.stopPropagation()}>
                    <ConfirmDialog
                      title="Delete Registration?"
                      description="This action cannot be undone."
                      confirmText="Yes, delete"
                      onConfirm={() => handleDelete(reg._id)}
                      icon="trash"
                      trigger={
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 p-1.5 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition cursor-pointer"
                        >
                          <Trash2 size={16} />
                        </Button>
                      }
                    />
                  </div>
                }
                />
                <TooltipContent>Delete</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        );
      },
    },
  ], [handleDelete, handleUpdateStatus, pagination, router]);

  const table = useReactTable({
    data: registrations,
    columns,
    pageCount: Math.ceil(totalCount / pagination.pageSize),
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(),
  });

  const hasFilters = searchQuery || selectedEventId || statusFilter || dateFilter;

  return (
    <div className="space-y-6 text-slate-900 dark:text-slate-100 transition-colors duration-300 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
            Event Registrations
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Review registrations, manage statuses, and export CSV sheets.
          </p>
        </div>
        
        <Button
          onClick={handleExportCSV}
          
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white rounded-xl transition shadow-md shadow-indigo-600/10"
        >
          <Download size={16} /> Export CSV
        </Button>
      </div>

      <div className="space-y-4">
        {/* Filters Bar */}
        <Card className="p-3 rounded-xl border border-border shadow-sm flex flex-col md:flex-row gap-3 items-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 w-full">
            {/* Search */}
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-10 w-full border-slate-200 dark:border-slate-800 focus-visible:ring-indigo-500 shadow-sm"
              />
            </div>

            {/* Event Filter */}
            <Select
              value={selectedEventTitle}
              onValueChange={(value) => {
                if (!value) return;
                const [id, title] = value.split("|");
                setSelectedEventId(id === "ALL" ? "" : id);
                setselectedEventTitle(title || "ALL");
                setPagination(prev => ({ ...prev, pageIndex: 0 }));
              }}
            >
              <SelectTrigger className="h-10 w-full border-slate-200 dark:border-slate-800 shadow-sm cursor-pointer">
                <SelectValue placeholder="All Events" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL" className="cursor-pointer">All Events</SelectItem>
                {events.map((event) => (
                  <SelectItem key={event._id} value={`${event._id}|${event.title}`} className="cursor-pointer">
                    {event.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select
              value={statusFilter || "ALL"}
              onValueChange={(value) => { 
                setStatusFilter(!value || value === "ALL" ? "" : value); 
                setPagination(prev => ({ ...prev, pageIndex: 0 }));
              }}
            >
              <SelectTrigger className="h-10 w-full border-slate-200 dark:border-slate-800 shadow-sm cursor-pointer">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL" className="cursor-pointer">All Statuses</SelectItem>
                <SelectItem value="Pending" className="cursor-pointer">Pending</SelectItem>
                <SelectItem value="Approved" className="cursor-pointer">Approved</SelectItem>
                <SelectItem value="Attended" className="cursor-pointer">Attended</SelectItem>
                <SelectItem value="Rejected" className="cursor-pointer">Rejected</SelectItem>
              </SelectContent>
            </Select>

            {/* Date Picker */}
            <Popover open={datePopoverOpen} onOpenChange={setDatePopoverOpen}> 
              <PopoverTrigger 
              render={
                <Button
                  variant="outline"
                  className={`h-10 w-full justify-start text-left font-normal border-slate-200 dark:border-slate-800 shadow-sm cursor-pointer ${!dateFilter && "text-muted-foreground"}`}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateFilter ? format(dateFilter, "PPP") : "Select Date"}
                </Button>
              }
              />
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateFilter}
                  onSelect={(date) => {
                    if (date) {
                      setDateFilter(date);
                      setPagination(prev => ({ ...prev, pageIndex: 0 }));
                    }
                    setDatePopoverOpen(false);
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>

          {hasFilters && (
            <Button 
              variant="ghost" 
              onClick={handleClearFilters}
              className="text-muted-foreground hover:text-foreground md:shrink-0 h-10 w-full md:w-auto"
            >
              <X size={16} className="mr-1" /> Clear
            </Button>
          )}
        </Card>

        {/* Table Container */}
        <Card className="overflow-hidden border-border bg-card shadow-sm">
          <Table className="table-fixed w-full">
            <TableHeader className="bg-muted/50">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="hover:bg-transparent">
                  {headerGroup.headers.map((header) => {
                    let width = 'auto';
                    if (header.id === 'serial') width = '70px';
                    else if (header.id === 'attendee') width = '220px';
                    else if (header.id === 'event') width = '200px';
                    else if (header.id === 'createdAt') width = '120px';
                    else if (header.id === 'paymentStatus') width = '120px';
                    else if (header.id === 'status') width = '120px';
                    else if (header.id === 'actions') width = '180px';
                    
                    return (
                      <TableHead key={header.id} className="font-bold text-muted-foreground uppercase text-xs tracking-wider h-11 align-middle" style={{ width }}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
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
                    <TableCell>
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[160px]" />
                        <Skeleton className="h-3 w-[120px]" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[140px]" />
                        <Skeleton className="h-3 w-[100px]" />
                      </div>
                    </TableCell>
                    <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                    <TableCell><div className="flex flex-col items-center gap-1"><Skeleton className="h-6 w-16 rounded-full" /><Skeleton className="h-3 w-10" /></div></TableCell>
                    <TableCell><div className="flex justify-center"><Skeleton className="h-6 w-20 rounded-full" /></div></TableCell>
                    <TableCell><div className="flex justify-center gap-2"><Skeleton className="h-8 w-8 rounded-md" /><Skeleton className="h-8 w-8 rounded-md" /><Skeleton className="h-8 w-8 rounded-md" /></div></TableCell>
                  </TableRow>
                ))
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group"
                    onClick={() => router.push(`/events/registrations/${row.original._id}`)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-3 px-4" onClick={(e) => {
                        // Prevent row click if interacting with action buttons inside the cell
                        if ((e.target as HTMLElement).closest('button')) e.stopPropagation();
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
                      <User className="h-10 w-10 text-muted-foreground/30 mb-3" />
                      <h3 className="text-lg font-bold text-foreground">No Registrations Found</h3>
                      <p className="text-sm mt-1 text-muted-foreground">
                        {hasFilters ? 'Try adjusting your search or filters.' : 'There are no event registrations yet.'}
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
    </div>
  );
}

export default function RegistrationsPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
      </div>
    }>
      <RegistrationsContent />
    </Suspense>
  );
}