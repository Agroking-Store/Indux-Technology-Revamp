'use client';

<<<<<<< HEAD
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
=======
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { 
  Mail, 
  Phone, 
  Tag, 
  Trash2, 
  Eye, 
  Search,
  Filter,
  CheckCircle2,
  Clock,
  X,
  MessageSquare
} from 'lucide-react';
import { toast } from 'react-toastify';

interface Lead {
  _id: string;
  name: string;
  email: string;
  phone: string;
  companyName?: string;
  service?: string;
  source?: 'Get Quote' | 'Contact Us';
  message: string;
  status: 'New' | 'Contacted' | 'Closed';
>>>>>>> main
  createdAt: string;
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
<<<<<<< HEAD
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
=======
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [showOnlyQuotes, setShowOnlyQuotes] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const res = await api.get('/leads');
      setLeads(res.data.data);
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: 'New' | 'Contacted' | 'Closed') => {
    try {
      await api.patch(`/leads/${id}/status`, { status: newStatus });
      toast.success(`Lead status updated to ${newStatus}`);
      setLeads(prev =>
        prev.map(l => (l._id === id ? { ...l, status: newStatus } : l))
      );
      if (selectedLead && selectedLead._id === id) {
        setSelectedLead(prev => prev ? { ...prev, status: newStatus } : null);
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

>>>>>>> main
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this lead?')) return;
    try {
      await api.delete(`/leads/${id}`);
<<<<<<< HEAD
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
=======
      toast.success('Lead deleted successfully');
      setLeads(prev => prev.filter(l => l._id !== id));
      if (selectedLead && selectedLead._id === id) {
        setSelectedLead(null);
      }
    } catch (error) {
      console.error('Error deleting lead:', error);
    }
  };

  const filteredLeads = leads.filter(l => {
    const matchesSearch = 
      (l.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (l.email || '').toLowerCase().includes(search.toLowerCase()) ||
      (l.phone || '').includes(search) ||
      (l.service || '').toLowerCase().includes(search.toLowerCase());
      
    const matchesStatus = statusFilter === 'All' || l.status === statusFilter;
    const matchesQuoteOnly = !showOnlyQuotes || l.source === 'Get Quote';
    
    return matchesSearch && matchesStatus && matchesQuoteOnly;
  });

  const getStatusBadge = (status: 'New' | 'Contacted' | 'Closed') => {
    switch (status) {
      case 'New':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
            <Clock size={12} /> New
          </span>
        );
      case 'Contacted':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-100">
            <Clock size={12} /> Contacted
          </span>
        );
      case 'Closed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
            <CheckCircle2 size={12} /> Closed
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Contact Leads</h1>
          <p className="text-gray-500 text-sm mt-1">Review contact inquiries and request submissions from your website.</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center text-left">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search name, email, or service..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-indigo-500"
          />
        </div>

        {/* Filters Right Side */}
        <div className="flex items-center gap-3 w-full md:w-auto flex-wrap sm:flex-nowrap">
          <button
            onClick={() => setShowOnlyQuotes(!showOnlyQuotes)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-colors whitespace-nowrap ${
              showOnlyQuotes 
                ? 'bg-indigo-50 text-indigo-700 border-indigo-200' 
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            Quotes Only
          </button>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="text-slate-400 hidden sm:block" size={18} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-40 px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-indigo-500 bg-white"
            >
              <option value="All">All Statuses</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
        </div>

      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-2xl shadow border border-gray-250/80 overflow-hidden">
        {loading ? (
          <div className="py-20 flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-650"></div>
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="py-20 text-center text-gray-500">
            <MessageSquare className="size-12 mx-auto mb-3 opacity-30 text-gray-400" />
            <h3 className="text-lg font-bold text-gray-800">No Contact Leads</h3>
            <p className="text-sm mt-1 text-gray-450">Contact form entries on main website will register here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-left">
              <thead className="bg-gray-50">
                <tr className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Submission Date</th>
                  <th className="px-6 py-4">Full Name</th>
                  <th className="px-6 py-4">Contact Info</th>
                  <th className="px-6 py-4">Service Required</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLeads.map((lead) => (
                  <tr key={lead._id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-medium">
                      {new Date(lead.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-bold text-slate-800">{lead.name}</div>
                      {lead.companyName && (
                        <div className="text-xs text-slate-500 font-medium mt-0.5">{lead.companyName}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1 text-xs">
                        <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                          <Mail size={12} className="text-slate-400" />
                          {lead.email}
                        </span>
                        <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                          <Phone size={12} className="text-slate-400" />
                          {lead.phone}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-slate-100 text-slate-700 text-xs font-bold border capitalize">
                        <Tag size={12} className="text-slate-400" />
                        {lead.service || "-"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(lead.status)}</td>
                    <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => setSelectedLead(lead)}
                        className="p-1.5 text-slate-500 hover:text-indigo-650 hover:bg-slate-100 rounded-lg transition inline-flex"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(lead._id)}
                        className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition inline-flex"
                        title="Delete Lead"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Details Modal Dialog */}
      {selectedLead && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh] text-left">
            
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-center relative">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">Lead Submission Details</h3>
                <p className="text-xs text-slate-400 mt-0.5">Submitted on {new Date(selectedLead.createdAt).toLocaleString()}</p>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="p-1.5 hover:bg-slate-100 rounded-xl transition text-slate-400 hover:text-slate-655 absolute top-6 right-6"
              >
                <X size={16} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-5 overflow-y-auto flex-grow">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Name</label>
                  <p className="text-sm font-semibold text-slate-800">{selectedLead.name}</p>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Company</label>
                  <p className="text-sm font-semibold text-slate-800">{selectedLead.companyName || "-"}</p>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Service Interest</label>
                  <p className="text-sm font-semibold capitalize text-slate-700">{selectedLead.service || "-"}</p>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Source</label>
                  <p className="text-sm font-semibold text-slate-800">{selectedLead.source || "-"}</p>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Email</label>
                  <a href={`mailto:${selectedLead.email}`} className="text-sm text-indigo-650 hover:underline font-semibold block">{selectedLead.email}</a>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Phone</label>
                  <a href={`tel:${selectedLead.phone}`} className="text-sm text-slate-800 font-semibold block">{selectedLead.phone}</a>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Message Context</label>
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-600 text-sm leading-relaxed whitespace-pre-wrap font-medium">
                  {selectedLead.message}
                </div>
              </div>

              {/* Status Actions */}
              <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Update Lead Status</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleUpdateStatus(selectedLead._id, 'New')}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold border transition ${
                      selectedLead.status === 'New'
                        ? 'bg-blue-50 text-blue-605 border-blue-200'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Set New
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedLead._id, 'Contacted')}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold border transition ${
                      selectedLead.status === 'Contacted'
                        ? 'bg-amber-50 text-amber-600 border-amber-200'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Set Contacted
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedLead._id, 'Closed')}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold border transition ${
                      selectedLead.status === 'Closed'
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Set Closed
                  </button>
                </div>
              </div>

            </div>

>>>>>>> main
          </div>
        </div>
      )}

    </div>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> main
