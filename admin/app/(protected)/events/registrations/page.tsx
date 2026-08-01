'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { Search, Download, Mail, Phone, User, Check, X, Trash2, Eye, CalendarIcon } from 'lucide-react';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import api, { ApiResponse, EventRegistration, Event } from '@/lib/api';
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
import { format } from 'date-fns';

interface RegistrationQueryParams {
  page: number;
  limit: number;
  eventId?: string;
  status?: string;
  search?: string;
  date?: string;
}

function RegistrationsContent() {
  const searchParams = useSearchParams();
  
  // Theme State
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
  const router = useRouter();
  // Lists State
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [selectedEventId, setSelectedEventId] = useState(searchParams.get('eventId') || '');
  const [selectedEventTitle,setselectedEventTitle]=useState("ALL");
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [dateFilter, setDateFilter] = useState<Date | undefined>();
  
  // Pagination State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Debounce search query (300ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
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
      const params: RegistrationQueryParams = {
        page,
        limit: 10,
      };
      const formattedDate = dateFilter
      ? format(dateFilter, "yyyy-MM-dd")
      : "";
      if (selectedEventId) params.eventId = selectedEventId;
      if (statusFilter) params.status = statusFilter;
      if (debouncedSearch) params.search = debouncedSearch;
      if (dateFilter) params.date = formattedDate;

      const res = await api.get<ApiResponse<{ registrations: EventRegistration[], pagination: { pages: number; total: number } }>>(
        '/event-registrations', 
        { params }
      );
      setRegistrations(res.data.data.registrations);
      setTotalPages(res.data.data.pagination.pages);
      setTotalCount(res.data.data.pagination.total);
    } catch (error) {
      // handled globally or silenced
    } finally {
      setLoading(false);
    }
  }, [page, selectedEventId, statusFilter, debouncedSearch, dateFilter]);

  useEffect(() => {
    fetchRegistrations();
  }, [fetchRegistrations]);

  // Actions
  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await api.patch(`/event-registrations/${id}/status`, { status: newStatus });
      toast.success(`Registration status updated to ${newStatus}`);
      fetchRegistrations();
    } catch (error) {
      // handled
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/event-registrations/${id}`);
      toast.success('Registration deleted');
      fetchRegistrations();
    } catch (error) {
      // handled
    }
  };

  // Secure CSV Export using Blob Stream
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

  return (
    <div className="space-y-6 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 dark:border-gray-800 pb-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Event Registrations
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Review registrations, manage statuses, and export CSV sheets.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleExportCSV}
            disabled={!selectedEventId}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white rounded-xl transition font-semibold text-sm shadow-md shadow-indigo-600/10 cursor-pointer disabled:opacity-50"
          >
            <Download size={16} /> Export Registrations (CSV)
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200/80 dark:border-gray-700 shadow-sm grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-center transition-colors">
  {/* Search */}
  <div className="relative">
    <Search
      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 z-10"
      size={16}
    />
    <Input
      type="text"
      placeholder="Search by name or email..."
      value={searchQuery}
      onChange={(e) => {
        setSearchQuery(e.target.value);
        setPage(1);
      }}
      className="h-11 w-full pl-9 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-none"
    />
  </div>

  {/* Event */}
  <Select
    value={selectedEventTitle}
    onValueChange={(value) => {
      if (!value) return;

      const [id, title] = value.split("|");

      setSelectedEventId(id === "ALL" ? "" : id);
      setselectedEventTitle(title || "ALL");
      setPage(1);
    }}
  >
    <SelectTrigger className="h-11 w-full border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-none cursor-pointer">
      <SelectValue placeholder="All Events" />
    </SelectTrigger>

    <SelectContent>
      <SelectItem value="ALL">All Events</SelectItem>

      {events.map((event) => (
        <SelectItem
          key={event._id}
          value={`${event._id}|${event.title}`}
        >
          {event.title}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>

  <Select
            value={statusFilter || "ALL"}
            onValueChange={(value) => { 
              setStatusFilter(!value || value === "ALL" ? "" : value); 
              setPage(1); 
            }}
  >
    <SelectTrigger className="h-11 w-full border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-none cursor-pointer">
      <SelectValue placeholder="All Statuses" />
    </SelectTrigger>

    <SelectContent>
      <SelectItem value="ALL">All Statuses</SelectItem>
      <SelectItem value="Pending">Pending</SelectItem>
      <SelectItem value="Approved">Approved</SelectItem>
      <SelectItem value="Rejected">Rejected</SelectItem>
      <SelectItem value="Attended">Attended</SelectItem>
    </SelectContent>
  </Select>

  {/* Date */}
  <Popover>
  <PopoverTrigger>
    <Button
      variant="outline"
      className="h-11 w-full justify-start text-left font-normal border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-none cursor-pointer"
    >
      <CalendarIcon className="mr-2 h-4 w-4" />
      {dateFilter ? format(dateFilter, "PPP") : "Select Date"}
    </Button>
  </PopoverTrigger>

  <PopoverContent className="w-auto p-0" align="start">
  <Calendar
  mode="single"
  selected={dateFilter}
  onSelect={(date) => {
    if (date) {
      setDateFilter(date);
      setPage(1);
    }
  }}
/>
  </PopoverContent>
</Popover>
</div>

      {/* Main Registrations Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200/80 dark:border-gray-700 overflow-hidden transition-colors">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
          </div>
        ) : registrations.length === 0 ? (
          <div className="text-center py-20 text-gray-500 dark:text-gray-400">
            <User className="size-12 mx-auto mb-3 opacity-30 text-gray-400 dark:text-gray-500" />
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">No Registrations Found</h3>
            <p className="text-sm mt-1 text-gray-400 dark:text-gray-500">Try adjustments to your search queries or filter categories.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900/50">
                <tr >
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Attendee</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Event Details</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Registration Date</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Payment Status</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Paid Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {registrations.map((reg) => {
                  const eventObj = reg.eventId as unknown as Event;
                  return (
                    <tr key={reg._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors" >
                      <td className="px-6 py-4 whitespace-nowrap" onClick={()=>router.push(`/events/registrations/${reg._id}`)}>
                        <div className="text-sm font-semibold text-gray-900 dark:text-white">{reg.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5"><Mail size={12} /> {reg.email}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5"><Phone size={12} /> {reg.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <div className="font-semibold text-gray-800 dark:text-gray-200 line-clamp-1">{eventObj?.title || 'Unknown Event'}</div>
                        <div className="text-xs text-indigo-600 dark:text-indigo-400 font-medium mt-0.5">{eventObj?.type || 'Standard'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(reg.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-bold rounded-full border ${
                          reg.paymentStatus === 'Paid' ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800' :
                          reg.paymentStatus === 'Failed' ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border-rose-100 dark:border-rose-800' :
                          reg.paymentStatus === 'Pending' ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-100 dark:border-amber-800' :
                          'bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-100 dark:border-slate-800'
                        }`}>
                          {reg.paymentStatus || 'None'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 font-medium">
                        {reg.amountPaid ? `₹${reg.amountPaid}` : '—'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-bold rounded-full border ${
                          reg.status === 'Approved' ? 'bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400 border-green-100 dark:border-green-800' :
                          reg.status === 'Rejected' ? 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border-red-100 dark:border-red-800' :
                          reg.status === 'Attended' ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border-blue-100 dark:border-blue-800' :
                          'bg-yellow-50 dark:bg-yellow-950/40 text-yellow-700 dark:text-yellow-400 border-yellow-100 dark:border-yellow-800'
                        }`}>
                          {reg.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
  <div className="flex items-center gap-1.5">
    <Link
      href={`/events/registrations/${reg._id}`}
      className="text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 p-1.5 rounded-lg transition"
      title="View Details"
    >
      <Eye size={16} />
    </Link>

    {reg.status !== 'Approved' && reg.status!=='Attended' && (
      <button
        type="button"
        onClick={() => handleUpdateStatus(reg._id, 'Approved')}
        className="text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-950/50 p-1.5 rounded-lg transition"
        title="Approve registration"
      >
        <Check size={16} />
      </button>
    )}

    {reg.status === 'Approved' && (
      <button
        type="button"
        onClick={() => handleUpdateStatus(reg._id, 'Attended')}
        className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 px-2 py-1 rounded-lg transition text-xs font-bold"
        title="Mark as Attended"
      >
        <Check size={16} />
      </button>
    )}

    {(reg.status !== 'Approved' && reg.status!=='Attended') && (
      <button
        type="button"
        onClick={() => handleUpdateStatus(reg._id, 'Rejected')}
        className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 p-1.5 rounded-lg transition"
        title="Reject registration"
      >
        <X size={16} />
      </button>
    )}

    <ConfirmDialog
      title="Are you sure you want to delete this registration?"
      description="This action cannot be undone. This will permanently delete the registration."
      confirmText="Yes, delete"
      onConfirm={() => handleDelete(reg._id)}
      icon="trash"
      trigger={
        <button
          type="button"
          className="text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 p-1.5 rounded-lg transition cursor-pointer"
          title="Delete"
        >
          <Trash2 size={16} />
        </button>
      }
    />
  </div>
</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination footer */}
        {totalPages > 1 && (
          <div className="bg-gray-50 dark:bg-gray-900/50 px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Showing page {page} of {totalPages} ({totalCount} total registrations)
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 rounded-lg text-xs font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition disabled:opacity-50"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 rounded-lg text-xs font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
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