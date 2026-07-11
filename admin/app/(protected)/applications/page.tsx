'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import api, { ApiResponse } from '@/lib/api';
import { Download, FileText, Trash2, Mail, Phone, Clock, FileQuestion } from 'lucide-react';

interface Application {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  experience: string;
  coverLetter?: string;
  resume: string; // Base64 Data URL
  status: 'Pending' | 'Reviewed' | 'Accepted' | 'Rejected';
  createdAt: string;
  careerId?: {
    _id: string;
    title: string;
    department: string;
    location: string;
  };
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<{ name: string; text: string } | null>(null);
  const isMounted = useRef(true);

  const fetchApplications = useCallback(async () => {
    try {
      const res = await api.get<ApiResponse<{ applications: Application[] }>>('/applications');
      if (isMounted.current) {
        setApplications(res.data.data.applications);
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
      fetchApplications();
    }, 0);

    return () => {
      isMounted.current = false;
      clearTimeout(timer);
    };
  }, [fetchApplications]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this job application?')) return;
    try {
      await api.delete(`/applications/${id}`);
      await fetchApplications();
    } catch (error) {
      // handled
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await api.patch(`/applications/${id}/status`, { status: newStatus });
      await fetchApplications();
    } catch (error) {
      // handled
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-650 animate-pulse">Loading job applications...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Job Applications</h1>
        <span className="text-xs font-semibold px-3.5 py-1.5 rounded-full bg-indigo-50 text-indigo-700 uppercase tracking-wide">
          {applications.length} Candidates Applied
        </span>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidate</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied Position</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Experience</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cover Letter</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resume</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {applications.map((app) => (
              <tr key={app._id}>
                
                {/* Candidate Info */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-gray-900">{app.fullName}</div>
                  <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                    <Mail size={12} /> {app.email}
                  </div>
                  <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                    <Phone size={12} /> {app.phone}
                  </div>
                </td>

                {/* Job Info */}
                <td className="px-6 py-4 whitespace-nowrap">
                  {app.careerId ? (
                    <>
                      <div className="text-sm font-medium text-gray-800">{app.careerId.title}</div>
                      <div className="text-xs text-slate-500">{app.careerId.department}</div>
                    </>
                  ) : (
                    <span className="text-xs text-red-500 font-semibold flex items-center gap-1">
                      <FileQuestion size={14} /> Closed Position
                    </span>
                  )}
                </td>

                {/* Experience Details */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {app.experience}
                </td>

                {/* Cover Letter Modal trigger */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {app.coverLetter ? (
                    <button
                      onClick={() => setSelectedMessage({ name: app.fullName, text: app.coverLetter || '' })}
                      className="text-xs font-semibold px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 rounded text-gray-700 transition"
                    >
                      View Message
                    </button>
                  ) : (
                    <span className="text-xs text-gray-400 italic">None</span>
                  )}
                </td>

                {/* Application Status Picker */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={app.status}
                    onChange={(e) => handleStatusChange(app._id, e.target.value)}
                    className={`text-xs font-bold rounded-full px-3 py-1.5 focus:outline-none cursor-pointer border ${
                      app.status === 'Accepted' ? 'bg-green-50 border-green-200 text-green-700' :
                      app.status === 'Rejected' ? 'bg-red-50 border-red-200 text-red-700' :
                      app.status === 'Reviewed' ? 'bg-blue-50 border-blue-200 text-blue-700' :
                      'bg-yellow-50 border-yellow-200 text-yellow-700'
                    }`}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Reviewed">Reviewed</option>
                    <option value="Accepted">Accepted</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </td>

                {/* PDF Resume Downloader */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <a
                    href={app.resume}
                    download={`Resume-${app.fullName.replace(/\s+/g, '_')}.pdf`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100/70 border border-indigo-150 px-3 py-1.5 rounded-lg transition"
                  >
                    <Download size={14} /> Resume PDF
                  </a>
                </td>

                {/* Delete applications */}
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleDelete(app._id)}
                    className="text-red-600 hover:text-red-900 inline-flex items-center gap-1"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </td>

              </tr>
            ))}
            {applications.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-500 font-mono text-sm">
                  No applications received yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* COVER LETTER MODAL DIALOG */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl border border-slate-100 p-6 max-w-lg w-full shadow-2xl animate-[fadeIn_0.2s_ease-out]">
            <div className="flex justify-between items-center mb-4 pb-2 border-b">
              <h3 className="font-bold text-gray-800 text-lg">Message from {selectedMessage.name}</h3>
              <button
                onClick={() => setSelectedMessage(null)}
                className="text-gray-400 hover:text-gray-600 font-bold text-lg"
              >
                ✕
              </button>
            </div>
            <p className="text-gray-650 text-sm leading-relaxed whitespace-pre-wrap max-h-96 overflow-y-auto bg-gray-50 p-4 rounded-xl">
              {selectedMessage.text}
            </p>
          </div>
        </div>
      )}

    </div>
  );
}