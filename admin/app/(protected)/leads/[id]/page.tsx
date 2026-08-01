'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, User, Phone, Mail, Building, Briefcase, Calendar, Info, Clock, CheckCircle, MessageSquare, Trash2 } from 'lucide-react';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'react-toastify';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';

interface Lead {
  _id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: 'New' | 'Contacted' | 'Closed';
  createdAt: string;
}

export default function LeadDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusUpdating, setStatusUpdating] = useState(false);

  useEffect(() => {
    const fetchLead = async () => {
      try {
        const res = await api.get(`/leads/${id}`);
        setLead(res.data.data);
      } catch (error: any) {
        toast.error(error?.response?.data?.message || 'Failed to fetch lead details');
        router.push('/leads');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchLead();
  }, [id, router]);

  const handleUpdateStatus = async (newStatus: string | null) => {
    if (!newStatus) return;
    setStatusUpdating(true);
    try {
      await api.patch(`/leads/${id}/status`, { status: newStatus });
      setLead((prev) => prev ? { ...prev, status: newStatus as any } : prev);
      toast.success(`Status updated to ${newStatus}`);
    } catch {
      toast.error('Failed to update status');
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/leads/${id}`);
      toast.success('Lead deleted successfully');
      router.push('/leads');
    } catch {
      toast.error('Failed to delete lead');
    }
  };

  if (loading) {
    return (
      <div className="w-full h-full flex flex-col space-y-6">
        <div className="flex justify-between items-center pb-4 border-b border-border">
          <div className="flex gap-3 items-center">
            <Skeleton className="h-10 w-10 rounded-md" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader className="pb-3 border-b border-border/50">
                <Skeleton className="h-5 w-24" />
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-3 space-y-6">
            <Card>
              <CardHeader className="pb-3 border-b border-border/50">
                <Skeleton className="h-5 w-32" />
              </CardHeader>
              <CardContent className="pt-4 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-6 w-32 rounded-full" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-6 w-24 rounded-full" />
                  </div>
                </div>
                <div className="space-y-2 pt-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-32 w-full rounded-xl" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!lead) return null;

  return (
    <div className="w-full h-full flex flex-col space-y-6 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => router.push('/leads')}
            className="hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 cursor-pointer shrink-0"
          >
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white leading-tight">Lead Details</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Submitted on {new Date(lead.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground font-medium">Status:</span>
          {lead.status === "Closed" ? (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950/40 dark:text-green-400 dark:border-green-900/40 px-3 py-1 text-sm font-semibold whitespace-nowrap">
              Closed
            </Badge>
          ) : (
            <Select 
              disabled={statusUpdating}
              value={lead.status} 
              onValueChange={handleUpdateStatus}
            >
              <SelectTrigger className="w-[140px] h-9 cursor-pointer">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="New" className="cursor-pointer">New</SelectItem>
                <SelectItem value="Contacted" className="cursor-pointer">Contacted</SelectItem>
                <SelectItem value="Closed" className="cursor-pointer">Closed</SelectItem>
              </SelectContent>
            </Select>
          )}

          <ConfirmDialog
            title="Delete Lead"
            description="Are you sure you want to delete this lead? This action cannot be undone."
            confirmText="Yes, Delete"
            onConfirm={handleDelete}
            icon="trash"
            trigger={
              <Button
                variant="outline"
                className="h-9 gap-2 text-rose-600 border-rose-200 hover:bg-rose-50 dark:border-rose-900/50 dark:hover:bg-rose-950/40 cursor-pointer"
              >
                <Trash2 size={16} /> Delete
              </Button>
            }
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Col - Client Details */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-card border-border shadow-sm">
            <CardHeader className="pb-3 border-b border-border/50">
              <CardTitle className="text-sm font-semibold flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                <User size={16} /> Contact Info
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div>
                <div className="text-xs text-muted-foreground mb-1">Full Name</div>
                <div className="font-semibold text-foreground text-sm">{lead.name}</div>
              </div>
              
              <div>
                <div className="text-xs text-muted-foreground mb-1">Email Address</div>
                <div className="font-medium text-foreground text-sm flex items-center gap-2">
                  <Mail size={14} className="text-muted-foreground" />
                  <a href={`mailto:${lead.email}`} className="hover:text-indigo-600 dark:hover:text-indigo-400 underline-offset-4 hover:underline select-all">
                    {lead.email}
                  </a>
                </div>
              </div>

              <div>
                <div className="text-xs text-muted-foreground mb-1">Phone Number</div>
                <div className="font-medium text-foreground text-sm flex items-center gap-2">
                  <Phone size={14} className="text-muted-foreground" />
                  <a href={`tel:${lead.phone}`} className="hover:text-indigo-600 dark:hover:text-indigo-400 underline-offset-4 hover:underline select-all font-mono">
                    {lead.phone}
                  </a>
                </div>
              </div>


            </CardContent>
          </Card>
        </div>

        {/* Right Col - Request Details */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="bg-card border-border shadow-sm">
            <CardHeader className="pb-3 border-b border-border/50">
              <CardTitle className="text-sm font-semibold flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                <Briefcase size={16} /> Inquiry Details
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-5">
              

              <div className="pt-2">
                <div className="text-sm text-muted-foreground flex items-center gap-1.5 mb-2">
                  <MessageSquare size={14} /> Comprehensive Message
                </div>
                <div className="bg-muted/30 border border-border/60 rounded-xl p-4 text-sm text-foreground whitespace-pre-wrap leading-relaxed shadow-inner min-h-[150px]">
                  {lead.message || <span className="text-muted-foreground italic">No additional message provided.</span>}
                </div>
              </div>

            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
