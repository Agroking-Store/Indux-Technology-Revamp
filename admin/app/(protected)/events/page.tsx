'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import api, { ApiResponse } from '@/lib/api';

interface Event {
  _id: string;
  title: string;
  slug: string;
  date: string;
  location: string;
  status: 'Draft' | 'Published';
  createdAt: string;
}

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
    if (!confirm('Are you sure you want to delete this event?')) return;
    try {
      await api.delete(`/events/${id}`);
      await fetchEvents();
    } catch (error) {
      // handled
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'Published' ? 'Draft' : 'Published';
    try {
      await api.patch(`/events/${id}/status`, { status: newStatus });
      await fetchEvents();
    } catch (error) {
      // handled
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Loading events...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Events</h1>
        <Link
          href="/events/create"
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          + Create Event
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date & Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
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
              <tr key={event._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{event.title}</div>
                  <div className="text-xs text-gray-500">/{event.slug}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(event.date).toLocaleString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {event.location}
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
                  <Link href={`/events/edit/${event._id}`} className="text-indigo-600 hover:text-indigo-900">
                    Edit
                  </Link>
                  <button onClick={() => handleToggleStatus(event._id, event.status)} className="text-blue-600 hover:text-blue-900">
                    Toggle
                  </button>
                  <button onClick={() => handleDelete(event._id)} className="text-red-600 hover:text-red-900">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {events.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
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
