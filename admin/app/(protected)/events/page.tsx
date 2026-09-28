'use client';

import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { 
  Plus, 
  Calendar, 
  Users, 
  Copy, 
  Pencil, 
  Trash2, 
  GlobeOff, 
  Globe, 
  Search, 
  X 
} from 'lucide-react';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import api, { ApiResponse, Event } from '@/lib/api';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
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
import { Button, buttonVariants } from "@/components/ui/button";
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

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'All' | 'Draft' | 'Published'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  
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
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch all events for frontend filtering
  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      // Pass a high limit so the API returns all events for local filtering
      const res = await api.get<any>('/events', { params: { limit: 1000 } });
      
      if (isMounted.current) {
        const payload = res.data.data;
        if (Array.isArray(payload)) {
          setEvents(payload);
        } else {
          setEvents(payload.events || payload.data || []);
        }
      }
    } catch (error) {
      // handled globally or silenced
    } finally {
      if (isMounted.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    isMounted.current = true;
    fetchEvents();
    return () => { isMounted.current = false; };
  }, [fetchEvents]);

  const handleDelete = useCallback(async (id: string) => {
    try {
      await api.delete(`/events/${id}`);
      toast.success('Event deleted successfully');
      fetchEvents();
    } catch (error) {
      // handled
    }
  }, [fetchEvents]);

  const handleToggleStatus = useCallback(async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'Published' ? 'Draft' : 'Published';
    try {
      await api.patch(`/events/${id}/status`, { status: newStatus });
      toast.success(`Event status updated to ${newStatus}`);
      fetchEvents();
    } catch (error) {
      // handled
    }
  }, [fetchEvents]);

  const handleDuplicate = useCallback(async (event: Event) => {
    try {
      const duplicatedData = {
        title: `Copy of ${event.title}`,
        type: event.type,
        category: event.category,
        shortDescription: event.shortDescription,
        description: event.description,
        startDate: event.startDate,
        endDate: event.endDate,
        registrationDeadline: event.registrationDeadline,
        organizer: event.organizer,
        location: event.location,
        status: 'Draft',
        formFields: event.formFields,
        speakers: event.speakers || [],
        schedule: event.schedule || [],
        faqs: event.faqs || [],
        coverImage: event.coverImage,
        bannerImage: event.bannerImage,
      };

      await api.post('/events', duplicatedData);
      toast.success('Event duplicated as Draft');
      fetchEvents();
    } catch (error) {
      // handled
    }
  }, [fetchEvents]);

  const handleClearFilters = () => {
    setStatusFilter('All');
    setSearchTerm('');
    setDebouncedSearch('');
    setPagination({ pageIndex: 0, pageSize: 10 });
  };

  // 1. Filter the events array purely on the frontend
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const searchLower = debouncedSearch.toLowerCase();
      
      const matchesSearch = !debouncedSearch || 
        event.title?.toLowerCase().includes(searchLower) ||
        event.type?.toLowerCase().includes(searchLower) ||
        event.category?.toLowerCase().includes(searchLower);
        
      const matchesStatus = statusFilter === 'All' || event.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [events, debouncedSearch, statusFilter]);

  const columns: ColumnDef<Event>[] = useMemo(() => [
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
      accessorKey: "title",
      header: () => <div className="text-left font-semibold">Event Title</div>,
      cell: ({ row }) => {
        const event = row.original;
        return (
          <div className="text-left max-w-[250px]">
            <div className="text-sm font-bold text-foreground truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {event.title || 'Untitled Event'}
            </div>
            <div className="text-xs text-muted-foreground font-mono mt-0.5 truncate">
              /{event.slug || ''}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "type",
      header: () => <div className="text-left font-semibold">Type / Category</div>,
      cell: ({ row }) => {
        const event = row.original;
        return (
          <div className="text-left text-sm max-w-[150px]">
            <div className="font-semibold text-foreground truncate">{event.type || 'Standard'}</div>
            <div className="text-xs text-muted-foreground truncate">{event.category || 'General'}</div>
          </div>
        );
      },
    },
    {
      accessorKey: "startDate",
      header: () => <div className="text-left font-semibold">Date & Time</div>,
      cell: ({ row }) => {
        const event = row.original;
        return (
          <div className="text-left text-sm max-w-[180px]">
            <div className="font-semibold text-foreground whitespace-nowrap">
              {event.startDate
                ? new Date(event.startDate).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : 'TBD'}
            </div>
            <div className="text-xs text-muted-foreground whitespace-nowrap">
              {event.startDate
                ? new Date(event.startDate).toLocaleTimeString(undefined, {
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : ''}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: () => <div className="text-center font-semibold">Status</div>,
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        let colorClass = 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/40'; // Draft
        if (status === 'Published') {
          colorClass = 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/40';
        }

        return (
          <div className="text-center">
            <Badge variant="outline" className={`whitespace-nowrap ${colorClass}`}>
              {status || 'Draft'}
            </Badge>
          </div>
        );
      },
    },
    {
      id: "actions",
      header: () => <div className="text-center font-semibold pl-4">Actions</div>,
      cell: ({ row }) => {
        const event = row.original;
      
        return (
          <div className="flex items-center justify-center gap-1 pl-4">
            <span className="inline-flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 px-2.5 py-1.5 rounded-full text-xs font-bold border border-indigo-100 dark:border-indigo-900/50 mr-1" title="Registrations">
              <Users size={12} />
              {event.registrationsCount || 0}
            </span>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => { e.stopPropagation(); handleDuplicate(event); }}
                      className="h-8 w-8 p-1.5 rounded-lg text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/50 transition cursor-pointer"
                    >
                      <Copy size={16} />
                    </Button>
                  }
                />
                <TooltipContent>Duplicate Event</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger
                  render={
                    <Link
                      href={`/events/${event._id}?mode=edit`}
                      onClick={(e) => e.stopPropagation()}
                      className={`${buttonVariants({ variant: "ghost", size: "icon" })} h-8 w-8 p-1.5 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition cursor-pointer`}
                    >                      
                      <Pencil size={16} />
                    </Link>
                  }
                />
                <TooltipContent>Edit Event</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger render={
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => { e.stopPropagation(); handleToggleStatus(event._id, event.status || 'Draft'); }}
                    className="h-8 w-8 p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition cursor-pointer"
                  >
                    {event.status === 'Published' ? <GlobeOff size={16} /> : <Globe size={16} />}
                  </Button>
                }
                />
                <TooltipContent>{event.status === 'Published' ? 'Unpublish Event' : 'Publish Event'}</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger render={
                  <div onClick={(e) => e.stopPropagation()}>
                    <ConfirmDialog
                      title="Are you sure you want to delete this event?"
                      description="This action cannot be undone. This will also delete all of its registrations."
                      confirmText="Yes, delete"
                      onConfirm={() => handleDelete(event._id)}
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
                } />
                <TooltipContent>Delete Event</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        );
      },
    },
  ], [handleDelete, handleToggleStatus, handleDuplicate, pagination]);

  // 2. Pass the pre-filtered data array and use the client-side PaginationRowModel
  const table = useReactTable({
    data: filteredEvents,
    columns,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Calendar className="text-indigo-600 dark:text-indigo-400 size-7" />
            Events
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Manage your upcoming schedule, view registrations, and publish new events.
          </p>
        </div>
        <Link
          href="/events/new"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-semibold text-sm rounded-xl transition shadow-md shadow-indigo-600/10 shrink-0"
        >
          <Plus size={18} />
          Create Event
        </Link>
      </div>

      <div className="space-y-4">
        {/* Filters Bar */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-card p-3 rounded-xl border border-border shadow-sm">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-[280px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search events..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-9 border-blue-100 dark:border-blue-900 focus-visible:border-blue-300 focus-visible:ring-1 focus-visible:ring-blue-400 transition-all"
              />
            </div>
            <Select 
              value={statusFilter} 
              onValueChange={(value) => { 
                setStatusFilter(value as 'All' | 'Draft' | 'Published'); 
                setPagination(prev => ({ ...prev, pageIndex: 0 })); 
              }}
            >
              <SelectTrigger className="w-[140px] h-9 cursor-pointer">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All" className="cursor-pointer">All Statuses</SelectItem>
                <SelectItem value="Draft" className="cursor-pointer">Draft</SelectItem>
                <SelectItem value="Published" className="cursor-pointer">Published</SelectItem>
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
                    else if (header.id === 'title') width = '250px';
                    else if (header.id === 'type') width = '150px';
                    else if (header.id === 'startDate') width = '180px';
                    else if (header.id === 'status') width = '120px';
                    else if (header.id === 'actions') width = '200px';
                    
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
                    <TableCell><Skeleton className="h-10 w-[200px]" /></TableCell>
                    <TableCell><Skeleton className="h-10 w-[120px]" /></TableCell>
                    <TableCell><Skeleton className="h-10 w-[140px]" /></TableCell>
                    <TableCell><div className="flex justify-center"><Skeleton className="h-6 w-16 rounded-full" /></div></TableCell>
                    <TableCell><div className="flex justify-center gap-2"><Skeleton className="h-8 w-8 rounded-md" /><Skeleton className="h-8 w-8 rounded-md" /><Skeleton className="h-8 w-8 rounded-md" /><Skeleton className="h-8 w-8 rounded-md" /></div></TableCell>
                  </TableRow>
                ))
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="hover:bg-slate-200 dark:hover:bg-slate-800/70 transition-colors cursor-pointer group"
                    onClick={() => router.push(`/events/${row.original._id}`)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-3 px-4" onClick={(e) => {
                        if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('a')) {
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
                      <h3 className="text-lg font-bold text-foreground">No Events Found</h3>
                      <p className="text-sm mt-1 text-muted-foreground">
                        {searchTerm ? 'Try adjusting your search or filters.' : 'There are no events yet. Create your first one!'}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          
          {/* Pagination Controls */}
          {filteredEvents.length > 0 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/20">
              <div className="text-sm text-muted-foreground">
                Showing <span className="font-medium text-foreground">{table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}</span> to <span className="font-medium text-foreground">{Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, filteredEvents.length)}</span> of <span className="font-medium text-foreground">{filteredEvents.length}</span> results
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