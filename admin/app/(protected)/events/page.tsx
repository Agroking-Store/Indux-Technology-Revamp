'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { toast } from 'react-toastify';
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Events</h1>
        <Link
          href="/events/create"
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
        >
          + Create Event
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cover
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Event Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type / Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date & Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Registrations
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {events.map((event) => (
              <tr key={event._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <img
                    src={event.coverImage || '/placeholder-event.jpg'}
                    alt={event.title}
                    className="w-12 h-12 object-cover rounded-md border"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-gray-900">{event.title}</div>
                  <div className="text-xs text-gray-500">/{event.slug}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className="font-medium text-gray-800">{event.type}</span>
                  <div className="text-xs text-gray-400">{event.category}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="font-medium text-gray-800">
                    {new Date(event.startDate).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </div>
                  <div className="text-xs text-gray-400">
                    {new Date(event.startDate).toLocaleTimeString(undefined, {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className="bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full text-xs font-bold border border-indigo-100">
                    {event.registrationsCount || 0}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      event.status === 'Published'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {event.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                  <Link
                    href={`/events/registrations?eventId=${event._id}`}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    View Registrations
                  </Link>
                  <button
                    onClick={() => handleDuplicate(event)}
                    className="text-amber-600 hover:text-amber-900"
                  >
                    Duplicate
                  </button>
                  <Link href={`/events/edit/${event._id}`} className="text-blue-600 hover:text-blue-900">
                    Edit
                  </Link>
                  <button
                    onClick={() => handleToggleStatus(event._id, event.status)}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    {event.status === 'Published' ? 'Unpublish' : 'Publish'}
                  </button>
                  <button onClick={() => handleDelete(event._id)} className="text-red-600 hover:text-red-900">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {events.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                  No events found. Create your first event!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
