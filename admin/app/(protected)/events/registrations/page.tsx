'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';
import { Search, Download, Mail, Phone, User, Check, X, FileText, Trash2, Eye, Sun, Moon } from 'lucide-react';
import api, { ApiResponse, EventRegistration, Event } from '@/lib/api';

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

  // Initialize Theme from localStorage or system preferences
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

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const nextTheme = !prev;
      if (nextTheme) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
      return nextTheme;
    });
  };

  // Lists State
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [selectedEventId, setSelectedEventId] = useState(searchParams.get('eventId') || '');
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  // Pagination State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Selected Detail Modal State
  const [selectedReg, setSelectedReg] = useState<EventRegistration | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [updatingNotes, setUpdatingNotes] = useState(false);

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
      if (selectedEventId) params.eventId = selectedEventId;
      if (statusFilter) params.status = statusFilter;
      if (debouncedSearch) params.search = debouncedSearch;
      if (dateFilter) params.date = dateFilter;

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
      if (selectedReg && selectedReg._id === id) {
        setSelectedReg({ ...selectedReg, status: newStatus as EventRegistration['status'] });
      }
    } catch (error) {
      // handled
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedReg) return;
    setUpdatingNotes(true);
    try {
      await api.patch(`/event-registrations/${selectedReg._id}/notes`, { notes: adminNotes });
      toast.success('Admin notes saved successfully');
      setSelectedReg({ ...selectedReg, notes: adminNotes });
      fetchRegistrations();
    } catch (error) {
      // handled
    } finally {
      setUpdatingNotes(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this registration?')) return;
    try {
      await api.delete(`/event-registrations/${id}`);
      toast.success('Registration deleted');
      fetchRegistrations();
      if (selectedReg && selectedReg._id === id) {
        setSelectedReg(null);
      }
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

  const handleOpenDetails = (reg: EventRegistration) => {
    setSelectedReg(reg);
    setAdminNotes(reg.notes || '');
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
            onClick={handleExportCSV}
            disabled={!selectedEventId}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition text-sm font-semibold shadow-md shadow-emerald-600/10 disabled:opacity-50 cursor-pointer"
          >
            <Download size={16} /> Export Registrations (CSV)
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200/80 dark:border-gray-700 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4 transition-colors">
        
        {/* Search */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
            <Search size={16} />
          </div>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-indigo-500"
          />
        </div>

        {/* Event Selector */}
        <div>
          <select
            value={selectedEventId}
            onChange={(e) => { setSelectedEventId(e.target.value); setPage(1); }}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-indigo-500 cursor-pointer"
          >
            <option value="">All Events</option>
            {events.map(event => (
              <option key={event._id} value={event._id}>{event.title}</option>
            ))}
          </select>
        </div>

        {/* Status Selector */}
        <div>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-indigo-500 cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="Attended">Attended</option>
          </select>
        </div>

        {/* Date Filter */}
        <div>
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => { setDateFilter(e.target.value); setPage(1); }}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-indigo-500"
          />
        </div>

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
                <tr>
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
                    <tr key={reg._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleOpenDetails(reg)}
                          className="text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 p-1.5 rounded-lg transition"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(reg._id, 'Approved')}
                          className="text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-950/50 p-1.5 rounded-lg transition"
                          title="Approve registration"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(reg._id, 'Rejected')}
                          className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 p-1.5 rounded-lg transition"
                          title="Reject registration"
                        >
                          <X size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(reg._id)}
                          className="text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 p-1.5 rounded-lg transition"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
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
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 rounded-lg text-xs font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition disabled:opacity-50"
              >
                Previous
              </button>
              <button
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

      {/* Details Dialog Modal */}
      {selectedReg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm" onClick={() => setSelectedReg(null)}></div>
          
          <div className="relative bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col justify-between">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900/60 rounded-t-2xl">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Registration Details</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Event: {(selectedReg.eventId as unknown as Event)?.title}</p>
              </div>
              <button onClick={() => setSelectedReg(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 flex-grow overflow-y-auto">
              
              {/* Box 1: Attendee Base Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-900/40 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500">Full Name</span>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mt-0.5">{selectedReg.name}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500">Email Address</span>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mt-0.5">{selectedReg.email}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500">Phone Number</span>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mt-0.5">{selectedReg.phone}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500">Registration Date</span>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mt-0.5">{new Date(selectedReg.createdAt).toLocaleString()}</p>
                </div>
                {selectedReg.paymentStatus && selectedReg.paymentStatus !== 'None' && (
                  <>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500">Payment Status</span>
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mt-0.5">{selectedReg.paymentStatus}</p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500">Amount Paid</span>
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mt-0.5">{selectedReg.amountPaid ? `₹${selectedReg.amountPaid}` : '—'}</p>
                    </div>
                    {selectedReg.razorpayOrderId && (
                      <div className="md:col-span-2">
                        <span className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500">Razorpay Order ID</span>
                        <p className="text-xs font-mono text-gray-700 dark:text-gray-300 mt-0.5">{selectedReg.razorpayOrderId}</p>
                      </div>
                    )}
                    {selectedReg.razorpayPaymentId && (
                      <div className="md:col-span-2">
                        <span className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500">Razorpay Payment ID</span>
                        <p className="text-xs font-mono text-gray-700 dark:text-gray-300 mt-0.5">{selectedReg.razorpayPaymentId}</p>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Box 2: Dynamic Custom Fields Answers */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-1">Dynamic Fields Answers</h4>
                
                {Object.keys(selectedReg.answers || {}).length === 0 ? (
                  <p className="text-xs text-gray-400 dark:text-gray-500 italic">No custom fields responses provided.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(selectedReg.answers).map(([key, val]) => {
                      const eventObj = selectedReg.eventId as unknown as { formFields?: Array<{ name: string; label: string; type: string }> };
                      const fieldSchema = eventObj?.formFields?.find((f) => f.name === key);
                      const displayLabel = fieldSchema?.label || key;
                      const displayType = fieldSchema?.type;

                      return (
                        <div key={key} className="border-b border-gray-100 dark:border-gray-700 pb-2">
                          <span className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500">{displayLabel}</span>
                          
                          {displayType === 'file' && typeof val === 'string' && val.startsWith('data:') ? (
                            <a
                              href={val}
                              download={`uploaded_file_${key}`}
                              className="mt-1 flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-bold"
                            >
                              <FileText size={14} /> Download Uploaded File
                            </a>
                          ) : (
                            <p className="text-sm text-gray-800 dark:text-gray-200 mt-0.5 break-words font-medium">
                              {Array.isArray(val) ? val.join(', ') : String(val)}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Box 3: Status Controls & Internal Admin Notes */}
              <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200">Review Actions</h4>
                
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-500 dark:text-gray-400">Update Status:</span>
                  <button
                    onClick={() => handleUpdateStatus(selectedReg._id, 'Approved')}
                    className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                      selectedReg.status === 'Approved' 
                        ? 'bg-green-600 text-white' 
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedReg._id, 'Rejected')}
                    className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                      selectedReg.status === 'Rejected' 
                        ? 'bg-red-600 text-white' 
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedReg._id, 'Attended')}
                    className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                      selectedReg.status === 'Attended' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    Attended
                  </button>
                </div>

                <div className="space-y-1.5 mt-4">
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Internal Admin Notes</label>
                  <textarea
                    rows={3}
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-indigo-500"
                    placeholder="Enter internal reviews, interview marks, or comments..."
                  />
                  <button
                    type="button"
                    disabled={updatingNotes}
                    onClick={handleSaveNotes}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold disabled:opacity-50 transition"
                  >
                    {updatingNotes ? 'Saving...' : 'Save Notes'}
                  </button>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end bg-gray-50 dark:bg-gray-900/60 rounded-b-2xl">
              <button
                onClick={() => setSelectedReg(null)}
                className="px-5 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 rounded-lg text-xs font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

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