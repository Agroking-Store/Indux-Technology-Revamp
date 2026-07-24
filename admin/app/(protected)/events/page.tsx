'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { Plus, Calendar, Users, UserPlus, Copy, Pencil, EyeOff, Trash2, Eye } from 'lucide-react';
import api, { ApiResponse, Event } from '@/lib/api';

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const isMounted = useRef(true);

  const fetchEvents = useCallback(async () => {
    try {
      const res = await api.get<ApiResponse<Event[]>>('/events');
      if (isMounted.current) {
        setEvents(res.data.data);
      }
    } catch (error) {
      // handled globally or silenced
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    isMounted.current = true;
    const timer = setTimeout(() => {
      fetchEvents();
    }, 0);
    return () => {
      isMounted.current = false;
      clearTimeout(timer);
    };
  }, [fetchEvents]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event? This will also delete all of its registrations.')) return;
    try {
      await api.delete(`/events/${id}`);
      toast.success('Event deleted successfully');
      await fetchEvents();
    } catch (error) {
      // handled
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'Published' ? 'Draft' : 'Published';
    try {
      await api.patch(`/events/${id}/status`, { status: newStatus });
      toast.success(`Event status updated to ${newStatus}`);
      await fetchEvents();
    } catch (error) {
      // handled
    }
  };

  const handleDuplicate = async (event: Event) => {
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
      await fetchEvents();
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
          href="/events/create"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-semibold text-sm rounded-xl transition shadow-md shadow-indigo-600/10 shrink-0"
        >
          <Plus size={18} />
          Create Event
        </Link>
      </div>

      {/* Table Container */}
      <div className="bg-white dark:bg-slate-900/60 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
            <thead className="bg-slate-50 dark:bg-slate-900/80">
              <tr>
                <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Cover
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Event Title
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Type / Category
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Registrations
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-900/40 divide-y divide-slate-100 dark:divide-slate-800/80">
              {events.map((event) => (
                <tr key={event._id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                  
                  <td className="px-6 py-4 whitespace-nowrap">
  <img
    src={
      event.coverImage ||
      `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="%2394a3b8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>`
    }
    alt={event.title || 'Event thumbnail'}
    onError={(e) => {
      const target = e.currentTarget as HTMLImageElement;
      target.onerror = null; // Unbind handler to prevent loops
      target.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="%2394a3b8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>`;
    }}
    className="w-12 h-12 object-cover rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800"
  />
</td>
                
                  {/* Title & Slug */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-slate-900 dark:text-slate-100">{event.title || 'Untitled Event'}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">/{event.slug || ''}</div>
                  </td>
                
                  {/* Type & Category */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{event.type || 'Standard'}</span>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{event.category || 'General'}</div>
                  </td>
                
                  {/* Date & Time */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="font-semibold text-slate-800 dark:text-slate-200">
                      {event.startDate
                        ? new Date(event.startDate).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })
                        : 'TBD'}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {event.startDate
                        ? new Date(event.startDate).toLocaleTimeString(undefined, {
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : ''}
                    </div>
                  </td>
                
                  {/* Registrations Count */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className="inline-flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 px-2.5 py-1 rounded-full text-xs font-bold border border-indigo-100 dark:border-indigo-900/50">
                      <Users size={12} />
                      {event.registrationsCount || 0}
                    </span>
                  </td>
                
                  {/* Status Badge */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2.5 py-1 inline-flex text-xs leading-5 font-bold rounded-full border ${
                        event.status === 'Published'
                          ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-800/50'
                          : 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border-amber-200/60 dark:border-amber-800/50'
                      }`}
                    >
                      {event.status || 'Draft'}
                    </span>
                  </td>
                
                  {/* Action Buttons */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                    <div className="flex items-center gap-1">
                      <Link
                        href={`/events/registrations?eventId=${event._id}`}
                        className="p-1.5 rounded-lg text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition"
                        title="View Registrations"
                        aria-label="View Registrations"
                      >
                        <UserPlus size={16} />
                      </Link>
                
                      <button
                        onClick={() => handleDuplicate(event)}
                        className="p-1.5 rounded-lg text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/50 transition"
                        title="Duplicate Event"
                        aria-label="Duplicate Event"
                      >
                        <Copy size={16} />
                      </button>
                
                      <Link
                        href={`/events/edit/${event._id}`}
                        className="p-1.5 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition"
                        title="Edit Event"
                        aria-label="Edit Event"
                      >
                        <Pencil size={16} />
                      </Link>
                
                      <button
                        onClick={() => handleToggleStatus(event._id, event.status)}
                        className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition"
                        title={event.status === 'Published' ? 'Unpublish Event' : 'Publish Event'}
                        aria-label={event.status === 'Published' ? 'Unpublish Event' : 'Publish Event'}
                      >
                        {event.status === 'Published' ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                
                      <button
                        onClick={() => handleDelete(event._id)}
                        className="p-1.5 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition"
                        title="Delete Event"
                        aria-label="Delete Event"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {events.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-500 dark:text-slate-400 text-sm italic">
                    No events found. Create your first event!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}