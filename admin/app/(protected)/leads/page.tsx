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
  X
} from 'lucide-react';
import { toast } from 'react-toastify';

interface Lead {
  _id: string;
  name: string;
  email: string;
  phone: string;
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
  
  // Modal states
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
      toast.success('Status updated successfully');
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
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: 'New' | 'Contacted' | 'Closed') => {
    switch (status) {
      case 'New':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
            <Clock size={12} /> New
          </span>
        );
      case 'Contacted':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
            <Clock size={12} /> Contacted
          </span>
        );
      case 'Closed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
            <CheckCircle2 size={12} /> Closed
          </span>
        );
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Contact Leads</h1>
          <p className="text-sm text-slate-500">View and manage form submissions from the homepage</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search leads..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/25"
          />
        </div>

        {/* Filter Dropdown */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Filter className="text-slate-400" size={18} />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full md:w-48 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/25"
          >
            <option value="All">All Statuses</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-slate-500">Loading Leads...</div>
        ) : filteredLeads.length === 0 ? (
          <div className="py-20 text-center text-slate-500 font-mono text-sm">// No contact leads found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-650 border-b border-slate-100 text-xs uppercase font-bold tracking-wider">
                  <th className="p-4">Date</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Contact Info</th>
                  <th className="p-4">Interest Service</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredLeads.map((lead) => (
                  <tr key={lead._id} className="hover:bg-slate-50/50 transition">
                    <td className="p-4 whitespace-nowrap text-slate-500">
                      {new Date(lead.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="p-4 font-bold text-slate-800">{lead.name}</td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1 text-xs">
                        <span className="flex items-center gap-1.5 text-slate-600">
                          <Mail size={12} className="text-slate-400" />
                          {lead.email}
                        </span>
                        <span className="flex items-center gap-1.5 text-slate-600">
                          <Phone size={12} className="text-slate-400" />
                          {lead.phone}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-slate-100 text-slate-700 text-xs font-semibold capitalize">
                        <Tag size={12} className="text-slate-400" />
                        {lead.service}
                      </span>
                    </td>
                    <td className="p-4">{getStatusBadge(lead.status)}</td>
                    <td className="p-4 text-right space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => setSelectedLead(lead)}
                        className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(lead._id)}
                        className="p-2 text-slate-500 hover:text-red-600 hover:bg-slate-100 rounded-lg transition"
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

      {/* Details Modal */}
      {selectedLead && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-slate-800">Lead Details</h3>
                <p className="text-xs text-slate-400">Submitted on {new Date(selectedLead.createdAt).toLocaleString()}</p>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-5 overflow-y-auto flex-grow">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Name</label>
                  <p className="text-sm font-semibold text-slate-800">{selectedLead.name}</p>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Service Interest</label>
                  <p className="text-sm font-semibold capitalize text-slate-700">{selectedLead.service}</p>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Email</label>
                  <a href={`mailto:${selectedLead.email}`} className="text-sm text-indigo-600 hover:underline">{selectedLead.email}</a>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Phone</label>
                  <a href={`tel:${selectedLead.phone}`} className="text-sm text-slate-850 font-semibold">{selectedLead.phone}</a>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Message</label>
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-slate-650 text-sm leading-relaxed whitespace-pre-wrap">
                  {selectedLead.message}
                </div>
              </div>

              {/* Status Actions */}
              <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Update Status</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleUpdateStatus(selectedLead._id, 'New')}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold border transition ${
                      selectedLead.status === 'New'
                        ? 'bg-blue-50 text-blue-600 border-blue-200'
                        : 'border-slate-200 text-slate-650 hover:bg-slate-50'
                    }`}
                  >
                    Set New
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedLead._id, 'Contacted')}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold border transition ${
                      selectedLead.status === 'Contacted'
                        ? 'bg-yellow-50 text-yellow-600 border-yellow-200'
                        : 'border-slate-200 text-slate-650 hover:bg-slate-50'
                    }`}
                  >
                    Set Contacted
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedLead._id, 'Closed')}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold border transition ${
                      selectedLead.status === 'Closed'
                        ? 'bg-green-50 text-green-600 border-green-200'
                        : 'border-slate-200 text-slate-650 hover:bg-slate-50'
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
