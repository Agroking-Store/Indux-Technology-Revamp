'use client';

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
  service: string;
  message: string;
  status: 'New' | 'Contacted' | 'Closed';
  createdAt: string;
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
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

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this lead?')) return;
    try {
      await api.delete(`/leads/${id}`);
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
    const matchesQuoteOnly = !showOnlyQuotes || (l.service && l.service.trim() !== '');
    
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
                        {lead.service}
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
                  <p className="text-sm font-semibold capitalize text-slate-700">{selectedLead.service}</p>
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

          </div>
        </div>
      )}

    </div>
  );
}
