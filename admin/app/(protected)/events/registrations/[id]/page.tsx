'use client';

import { useEffect, useState, useCallback, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { ArrowLeft, FileText, User, CreditCard, ShieldCheck } from 'lucide-react';
import api, { ApiResponse, EventRegistration, Event } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function RegistrationDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const [registration, setRegistration] = useState<EventRegistration | null>(null);
  const [loading, setLoading] = useState(true);
  const [adminNotes, setAdminNotes] = useState('');
  const [updatingNotes, setUpdatingNotes] = useState(false);

  const fetchRegistrationDetails = useCallback(async () => {
    try {
      const res = await api.get<ApiResponse<EventRegistration>>(`/event-registrations/${id}`);
      setRegistration(res.data.data);
      setAdminNotes(res.data.data.notes || '');
    } catch (error) {
      toast.error('Failed to load registration details.');
      router.push('/events/registrations');
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  const statusStyles: Record<string, string> = {
    Pending:
      "bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700",
    Approved:
      "bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-700",
    Attended:
      "bg-indigo-100 text-indigo-700 border-indigo-300 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-700",
    Rejected:
      "bg-rose-100 text-rose-700 border-rose-300 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-700",
  };

  useEffect(() => {
    fetchRegistrationDetails();
  }, [fetchRegistrationDetails]);

  const handleSaveNotes = async () => {
    if (!registration) return;
    setUpdatingNotes(true);
    try {
      await api.patch(`/event-registrations/${registration._id}/notes`, { notes: adminNotes });
      toast.success('Admin notes saved successfully');
      setRegistration({ ...registration, notes: adminNotes });
    } catch (error) {
      toast.error('Failed to save admin notes.');
    } finally {
      setUpdatingNotes(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
      </div>
    );
  }

  if (!registration) return null;

  const eventObj = registration.eventId as unknown as (Event & { formFields?: Array<{ name: string; label: string; type: string }> });

  return (
    <div className="max-w-7xl mx-auto space-y-6 text-slate-900 dark:text-slate-100 transition-colors duration-300 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" className="rounded-xl h-10 w-10" >
            <Link href="/events/registrations" title="Back to Registrations">
              <ArrowLeft size={20} />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Registration Details
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              Event: <span className="font-semibold text-slate-700 dark:text-slate-300">{eventObj?.title || 'Unknown Event'}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge
            variant="outline"
            className={`px-3 py-1.5 text-xs font-bold rounded-full ${
              registration.status === 'Approved' ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-800/50' :
              registration.status === 'Rejected' ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400 border-rose-200/60 dark:border-rose-800/50' :
              registration.status === 'Attended' ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 border-blue-200/60 dark:border-blue-800/50' :
              'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border-amber-200/60 dark:border-amber-800/50'
            }`}
          >
            {registration.status}
          </Badge>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Attendee Info & Custom Form Answers */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Attendee Base Information Card */}
          <Card className="bg-white dark:bg-slate-900/60 rounded-2xl border-slate-200/80 dark:border-slate-800 shadow-sm">
            <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-3">
              <CardTitle className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <User className="text-indigo-600 dark:text-indigo-400 size-5" />
                Attendee Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-50 dark:bg-slate-900/40 p-3.5 rounded-xl border border-slate-200/60 dark:border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">Full Name</span>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-1">{registration.name}</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900/40 p-3.5 rounded-xl border border-slate-200/60 dark:border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">Email Address</span>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-1">{registration.email}</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900/40 p-3.5 rounded-xl border border-slate-200/60 dark:border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">Phone Number</span>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-1">{registration.phone}</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900/40 p-3.5 rounded-xl border border-slate-200/60 dark:border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">Registration Date</span>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-1">{new Date(registration.createdAt).toLocaleString()}</p>
                </div>
              </div>

              {registration.paymentStatus && registration.paymentStatus !== 'None' && (
                <div className="pt-2">
                  <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <CreditCard size={14} className="text-indigo-600 dark:text-indigo-400" /> Payment Information
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-slate-50 dark:bg-slate-900/40 p-3.5 rounded-xl border border-slate-200/60 dark:border-slate-800">
                      <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">Payment Status</span>
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-1">{registration.paymentStatus}</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-900/40 p-3.5 rounded-xl border border-slate-200/60 dark:border-slate-800">
                      <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">Amount Paid</span>
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-1">{registration.amountPaid ? `₹${registration.amountPaid}` : '—'}</p>
                    </div>
                    {registration.razorpayOrderId && (
                      <div className="bg-slate-50 dark:bg-slate-900/40 p-3.5 rounded-xl border border-slate-200/60 dark:border-slate-800 sm:col-span-2">
                        <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">Razorpay Order ID</span>
                        <p className="text-xs font-mono text-slate-700 dark:text-slate-300 mt-1">{registration.razorpayOrderId}</p>
                      </div>
                    )}
                    {registration.razorpayPaymentId && (
                      <div className="bg-slate-50 dark:bg-slate-900/40 p-3.5 rounded-xl border border-slate-200/60 dark:border-slate-800 sm:col-span-2">
                        <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">Razorpay Payment ID</span>
                        <p className="text-xs font-mono text-slate-700 dark:text-slate-300 mt-1">{registration.razorpayPaymentId}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Dynamic Form Responses Card */}
          <Card className="bg-white dark:bg-slate-900/60 rounded-2xl border-slate-200/80 dark:border-slate-800 shadow-sm">
            <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-3">
              <CardTitle className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="text-indigo-600 dark:text-indigo-400 size-5" />
                Dynamic Field Answers
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              {Object.keys(registration.answers || {}).length === 0 ? (
                <p className="text-xs text-slate-400 dark:text-slate-500 italic py-4 text-center">No custom fields responses provided for this registration.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.entries(registration.answers).map(([key, val]) => {
                    const fieldSchema = eventObj?.formFields?.find((f) => f.name === key);
                    const displayLabel = fieldSchema?.label || key;
                    const displayType = fieldSchema?.type;

                    return (
                      <div key={key} className="bg-slate-50 dark:bg-slate-900/40 p-3.5 rounded-xl border border-slate-200/60 dark:border-slate-800">
                        <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">{displayLabel}</span>
                        
                        {displayType === 'file' && typeof val === 'string' && val.startsWith('data:') ? (
                          <a
                            href={val}
                            download={`uploaded_file_${key}`}
                            className="mt-1 flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-bold"
                          >
                            <FileText size={14} /> Download Uploaded File
                          </a>
                        ) : (
                          <p className="text-sm text-slate-800 dark:text-slate-200 mt-1 break-words font-medium">
                            {Array.isArray(val) ? val.join(', ') : String(val)}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

        </div>

        {/* Right Column: Review Actions & Admin Notes */}
        <div className="space-y-6">
          
          {/* Review Actions Card */}
          <Card className="bg-white dark:bg-slate-900/60 rounded-2xl border-slate-200/80 dark:border-slate-800 shadow-sm">
            <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-3">
              <CardTitle className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="text-indigo-600 dark:text-indigo-400 size-5" />
                Review Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Status</label>
                <div className="grid grid-cols-1">
                  <div className={`px-3 py-2 text-xs font-bold rounded-xl border text-center transition cursor-default ${
                    statusStyles[registration.status] ??
                    "bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-700"
                  }`}>
                    {registration.status}
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Internal Admin Notes</label>
                <Textarea
                  rows={4}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  className="w-full p-3.5 border border-slate-300 dark:border-slate-700 rounded-xl text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus-visible:ring-indigo-500 shadow-none resize-none"
                  placeholder="Enter internal reviews, interview marks, or notes..."
                />
                <Button
                  type="button"
                  disabled={updatingNotes}
                  onClick={handleSaveNotes}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold disabled:opacity-50 transition shadow-md shadow-indigo-600/10 cursor-pointer"
                >
                  {updatingNotes ? 'Saving Notes...' : 'Save Admin Notes'}
                </Button>
              </div>
            </CardContent>
          </Card>

        </div>

      </div>

    </div>
  );
}