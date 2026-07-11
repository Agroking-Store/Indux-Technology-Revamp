'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import api, { ApiResponse } from '@/lib/api'; // Assuming your axios/api instance is here
import { Trash2, Mail, Phone, Building2, Briefcase, FileText } from 'lucide-react';

interface Lead {
  _id: string;
  first_name: string;
  last_name?: string;
  company_name?: string;
  email: string;
  mobile_no: string;
  project_title?: string;
  project_description?: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Proposal Sent' | 'Negotiation' | 'Won' | 'Lost';
  priority: 'Low' | 'Medium' | 'High';
  createdAt: string;
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<{ name: string; text: string } | null>(null);
  const isMounted = useRef(true);

  // Fetch all leads
  const fetchLeads = useCallback(async () => {
    try {
      const res = await api.get('/leads'); 
      
      if (isMounted.current) {
        // 1. Log the response so you can see exactly what your backend is sending
        console.log("Raw API Response:", res.data);

        // 2. Safely extract the array based on common backend structures
        let leadsArray: Lead[] = [];
        
        if (Array.isArray(res.data)) {
          // If the backend sends the array directly: res.json(leads)
          leadsArray = res.data;
        } else if (res.data && Array.isArray(res.data.leads)) {
          // If the backend sends: res.json({ leads: [...] })
          leadsArray = res.data.leads;
        } else if (res.data && Array.isArray(res.data.data)) {
          // If the backend sends: res.json({ data: [...] })
          leadsArray = res.data.data;
        } else if (res.data?.data && Array.isArray(res.data.data.leads)) {
          // If the backend sends: res.json({ data: { leads: [...] } })
          leadsArray = res.data.data.leads;
        } else {
          console.warn("Could not find an array in the API response.");
        }

        // 3. Set the state with the guaranteed array
        setLeads(leadsArray);
      }
    } catch (error) {
      console.error("Failed to fetch leads:", error);
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    isMounted.current = true;
    const timer = setTimeout(() => {
      fetchLeads();
    }, 0);

    return () => {
      isMounted.current = false;
      clearTimeout(timer);
    };
  }, [fetchLeads]);

  // Delete Lead
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this lead?')) return;
    try {
      await api.delete(`/leads/${id}`);
      await fetchLeads(); // Refresh table after deletion
    } catch (error) {
      console.error("Failed to delete lead:", error);
    }
  };

  // Optional: Update Lead Status (Assumes a PATCH or PUT endpoint exists)
  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await api.patch(`/leads/${id}`, { status: newStatus });
      await fetchLeads();
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-500 animate-pulse">Loading leads data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Lead Management</h1>
        <span className="text-xs font-semibold px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-700 uppercase tracking-wide">
          {leads.length} Active Leads
        </span>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {leads.map((lead) => {
              const fullName = `${lead.first_name} ${lead.last_name || ''}`.trim();
              
              return (
                <tr key={lead._id}>
                  
                  {/* Client Info */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">{fullName}</div>
                    <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                      <Mail size={12} /> {lead.email}
                    </div>
                    <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                      <Phone size={12} /> {lead.mobile_no}
                    </div>
                  </td>

                  {/* Company Info */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {lead.company_name ? (
                      <div className="text-sm font-medium text-gray-800 flex items-center gap-1.5">
                        <Building2 size={14} className="text-gray-400" />
                        {lead.company_name}
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400 italic">Individual</span>
                    )}
                  </td>

                  {/* Project Details */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-800 flex items-center gap-1.5">
                      <Briefcase size={14} className="text-blue-500" />
                      {lead.project_title || 'General Inquiry'}
                    </div>
                    {lead.project_description && (
                      <button
                        onClick={() => setSelectedProject({ name: fullName, text: lead.project_description || '' })}
                        className="mt-1.5 inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-gray-600 transition"
                      >
                        <FileText size={12} /> View Requirements
                      </button>
                    )}
                  </td>

                  {/* Priority Badge */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold
                      ${lead.priority === 'High' ? 'bg-red-100 text-red-800' : 
                        lead.priority === 'Medium' ? 'bg-orange-100 text-orange-800' : 
                        'bg-gray-100 text-gray-800'}`}>
                      {lead.priority}
                    </span>
                  </td>

                  {/* Lead Status Picker */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={lead.status}
                      onChange={(e) => handleStatusChange(lead._id, e.target.value)}
                      className={`text-xs font-bold rounded-full px-3 py-1.5 focus:outline-none cursor-pointer border ${
                        lead.status === 'Won' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
                        lead.status === 'Lost' ? 'bg-red-50 border-red-200 text-red-700' :
                        lead.status === 'Qualified' || lead.status === 'Proposal Sent' || lead.status === 'Negotiation' ? 'bg-blue-50 border-blue-200 text-blue-700' :
                        'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Qualified">Qualified</option>
                      <option value="Proposal Sent">Proposal Sent</option>
                      <option value="Negotiation">Negotiation</option>
                      <option value="Won">Won</option>
                      <option value="Lost">Lost</option>
                    </select>
                  </td>

                  {/* Actions (Delete) */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleDelete(lead._id)}
                      className="text-red-600 hover:text-red-900 inline-flex items-center gap-1 transition-colors"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </td>

                </tr>
              );
            })}
            
            {/* Empty State */}
            {leads.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500 font-mono text-sm">
                  No leads found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PROJECT DESCRIPTION MODAL DIALOG */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl border border-slate-100 p-6 max-w-lg w-full shadow-2xl animate-[fadeIn_0.2s_ease-out]">
            <div className="flex justify-between items-center mb-4 pb-2 border-b">
              <h3 className="font-bold text-gray-800 text-lg">Project Details</h3>
              <button
                onClick={() => setSelectedProject(null)}
                className="text-gray-400 hover:text-gray-600 font-bold text-lg transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-400">
              Requirements from: <span className="text-blue-600">{selectedProject.name}</span>
            </div>
            
            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap max-h-96 overflow-y-auto bg-gray-50 p-4 rounded-xl border border-gray-100">
              {selectedProject.text}
            </p>
          </div>
        </div>
      )}

    </div>
  );
}