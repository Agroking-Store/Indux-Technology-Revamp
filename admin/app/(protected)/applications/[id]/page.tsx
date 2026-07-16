'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'react-toastify';
import { ArrowLeft, User, Mail, Phone, Calendar, Briefcase, MapPin, DollarSign, Award, Link2, FileText, ChevronRight, CheckCircle2, AlertTriangle, Clock, MessageSquare, Download, Settings } from 'lucide-react';
import api, { ApiResponse, JobApplication } from '@/lib/api';

export default function CandidateDetailPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();

  const [application, setApplication] = useState<JobApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);

  const fetchCandidate = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get<ApiResponse<JobApplication>>(`/applications/${id}`);
      setApplication(res.data.data);
      setNotes(res.data.data.notes || '');
    } catch (error) {
      // handled
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) fetchCandidate();
  }, [id, fetchCandidate]);

  const handleStatusChange = async (newStatus: string) => {
    try {
      await api.patch(`/applications/${id}/status`, { status: newStatus });
      toast.success(`Candidate status updated to ${newStatus}`);
      fetchCandidate();
    } catch (error) {
      // handled
    }
  };

  const handleSaveNotes = async () => {
    setSavingNotes(true);
    try {
      await api.patch(`/applications/${id}/notes`, { notes });
      toast.success('Internal review notes updated successfully');
      fetchCandidate();
    } catch (error) {
      // handled
    } finally {
      setSavingNotes(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="text-center py-20 text-gray-500">
        <AlertTriangle className="size-16 mx-auto mb-4 text-rose-500 opacity-80" />
        <h3 className="text-xl font-bold text-gray-800">Candidate Not Found</h3>
        <p className="text-sm mt-1">This application may have been deleted or closed.</p>
        <button
          onClick={() => router.push('/applications')}
          className="mt-6 px-5 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition font-semibold text-xs uppercase"
        >
          Back to applications
        </button>
      </div>
    );
  }

  const job = application.jobId as any;
  const token = localStorage.getItem('token');
  const secureResumeUrl = `${process.env.NEXT_PUBLIC_API_URL}/applications/${application._id}/resume?token=${token}`;

  return (
    <div className="space-y-6">
      
      {/* Header Back Button */}
      <div className="flex items-center gap-4 border-b pb-4">
        <button
          type="button"
          onClick={() => router.push('/applications')}
          className="p-2 hover:bg-slate-100 rounded-xl transition text-slate-500"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Candidate Profile</h1>
          <p className="text-gray-500 text-sm mt-1">Review application details, custom answers, dynamic PDF resume, and evaluate candidate status.</p>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left">
        
        {/* Left Column: Candidate Info and PDF Resume */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Main Info Card */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-sm space-y-6">
            
            {/* Upper profile panel */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b border-gray-100">
              <div className="flex items-center gap-4">
                <div className="size-16 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-605 flex items-center justify-center">
                  <User size={32} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-gray-900 leading-tight">{application.candidateName || application.fullName || 'Candidate'}</h2>
                  <div className="flex flex-wrap gap-x-3 gap-y-1 items-center mt-1.5 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><Mail size={12} /> {application.email}</span>
                    <span className="h-3 w-px bg-slate-300" />
                    <span className="flex items-center gap-1"><Phone size={12} /> {application.phone}</span>
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <span className={`px-3 py-1.5 inline-flex text-xs leading-5 font-bold rounded-full border bg-slate-50 text-slate-700 capitalize`}>
                Current Status: {application.status}
              </span>
            </div>

            {/* Grid stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="p-3 bg-slate-50 border rounded-2xl">
                <span className="text-slate-400 block font-bold uppercase tracking-wider text-[9px]">Applied Position</span>
                <span className="text-gray-800 font-extrabold text-sm block mt-1 line-clamp-1">{job?.title || 'Unknown'}</span>
              </div>
              <div className="p-3 bg-slate-50 border rounded-2xl">
                <span className="text-slate-400 block font-bold uppercase tracking-wider text-[9px]">Department</span>
                <span className="text-gray-800 font-extrabold text-sm block mt-1">{job?.department || 'N/A'}</span>
              </div>
              <div className="p-3 bg-slate-50 border rounded-2xl">
                <span className="text-slate-400 block font-bold uppercase tracking-wider text-[9px]">Total Experience</span>
                <span className="text-gray-800 font-extrabold text-sm block mt-1">{application.experience}</span>
              </div>
              <div className="p-3 bg-slate-50 border rounded-2xl">
                <span className="text-slate-400 block font-bold uppercase tracking-wider text-[9px]">Expected CTC</span>
                <span className="text-gray-800 font-extrabold text-sm block mt-1">{application.expectedCTC || 'Not Disclosed'}</span>
              </div>
              <div className="p-3 bg-slate-50 border rounded-2xl">
                <span className="text-slate-400 block font-bold uppercase tracking-wider text-[9px]">Notice Period</span>
                <span className="text-gray-800 font-extrabold text-sm block mt-1">{application.noticePeriod || 'Not Disclosed'}</span>
              </div>
              <div className="p-3 bg-slate-50 border rounded-2xl">
                <span className="text-slate-400 block font-bold uppercase tracking-wider text-[9px]">Office Location</span>
                <span className="text-gray-800 font-extrabold text-sm block mt-1">{job?.location || 'N/A'}</span>
              </div>
              <div className="p-3 bg-slate-50 border rounded-2xl">
                <span className="text-slate-400 block font-bold uppercase tracking-wider text-[9px]">Submission Date</span>
                <span className="text-gray-800 font-extrabold text-sm block mt-1">
                  {new Date(application.createdAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              </div>
              <div className="p-3 bg-slate-50 border rounded-2xl">
                <span className="text-slate-400 block font-bold uppercase tracking-wider text-[9px]">Hiring Stage</span>
                <span className="text-gray-800 font-extrabold text-sm block mt-1 uppercase tracking-wide text-indigo-650">{application.status}</span>
              </div>
              {application.preferredLocation && (
                <div className="p-3 bg-slate-50 border rounded-2xl">
                  <span className="text-slate-400 block font-bold uppercase tracking-wider text-[9px]">Preferred Location</span>
                  <span className="text-gray-800 font-extrabold text-sm block mt-1 line-clamp-1">{application.preferredLocation}</span>
                </div>
              )}
              {application.skills && (
                <div className="p-3 bg-slate-50 border rounded-2xl col-span-2">
                  <span className="text-slate-400 block font-bold uppercase tracking-wider text-[9px]">Candidate Skills</span>
                  <span className="text-gray-800 font-extrabold text-sm block mt-1 line-clamp-1">{application.skills}</span>
                </div>
              )}
            </div>

            {/* Profile Socials Links */}
            <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-100">
              {application.portfolio && (
                <a
                  href={application.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-100 border px-3 py-2 rounded-xl hover:bg-slate-200 transition"
                >
                  <Link2 size={14} className="text-slate-500" /> Portfolio Website
                </a>
              )}
              {application.linkedin && (
                <a
                  href={application.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 border border-blue-100 px-3 py-2 rounded-xl hover:bg-blue-100 transition"
                >
                  <LinkedinIcon size={14} className="text-blue-500" /> LinkedIn
                </a>
              )}
              {application.github && (
                <a
                  href={application.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs font-bold text-gray-805 bg-slate-100 border px-3 py-2 rounded-xl hover:bg-slate-200 transition"
                >
                  <GithubIcon size={14} className="text-gray-700" /> GitHub
                </a>
              )}
            </div>

            {/* Cover Letter Block */}
            {application.coverLetter && (
              <div className="space-y-2 pt-4 border-t border-gray-100">
                <h4 className="text-sm font-bold text-gray-805 flex items-center gap-1.5">
                  <FileText className="text-indigo-600" size={16} /> Cover Letter / Pitch
                </h4>
                <div className="bg-slate-50 p-4 border rounded-2xl text-xs text-slate-655 leading-relaxed whitespace-pre-wrap font-medium">
                  {application.coverLetter}
                </div>
              </div>
            )}

            {/* Custom Answers Block */}
            {application.answers && Object.keys(application.answers).length > 0 && (
              <div className="space-y-3 pt-4 border-t border-gray-100">
                <h4 className="text-sm font-bold text-gray-805 flex items-center gap-1.5">
                  <MessageSquare className="text-indigo-600" size={16} /> Additional Dynamic Questions Responses
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(application.answers).map(([key, val]) => {
                    const fieldSchema = (job?.formFields)?.find((f: any) => f.name === key);
                    const labelStr = fieldSchema?.label || key;
                    return (
                      <div key={key} className="border-b pb-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{labelStr}</span>
                        <p className="text-sm font-semibold text-slate-800 mt-0.5">
                          {Array.isArray(val) ? val.join(', ') : String(val)}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>

          {/* Embedded Resume Viewer */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-sm space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-850 flex items-center gap-2">
                <FileText className="text-indigo-600" /> Resume PDF Document
              </h3>
              <a
                href={secureResumeUrl}
                download={`Resume-${(application.candidateName || application.fullName || 'Candidate').replace(/\s+/g, '_')}.pdf`}
                className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow transition"
              >
                <Download size={13} /> Download Resume PDF
              </a>
            </div>

            <div className="w-full h-[600px] rounded-2xl overflow-hidden bg-slate-100 border shadow-inner">
              <iframe
                src={`${secureResumeUrl}#toolbar=0`}
                className="w-full h-full"
                title="Candidate PDF Resume Viewer"
              />
            </div>
          </div>

        </div>

        {/* Right Column: Status Actions and Notes */}
        <div className="lg:col-span-4 space-y-6">

          {/* Match Score breakdown card */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-gray-800 flex items-center gap-1.5">
              <Award className="text-indigo-500" size={18} /> Candidate Match Score
            </h3>
            
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Experience Score</span>
                <span className="font-extrabold text-slate-800">
                  {application.scoreBreakdown?.experienceScore !== undefined 
                    ? `${application.scoreBreakdown.experienceScore}/${application.scoreBreakdown.experienceMax || 60}`
                    : `${application.matchScore ? Math.round(application.matchScore * 0.6) : 0}/60`}
                </span>
              </div>
              <div className="flex justify-between items-center border-t border-slate-100 pt-3">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Skills Score</span>
                <span className="font-extrabold text-slate-800">
                  {application.scoreBreakdown?.skillsScore !== undefined 
                    ? `${application.scoreBreakdown.skillsScore}/${application.scoreBreakdown.skillsMax || 40}`
                    : `${application.matchScore ? Math.round(application.matchScore * 0.4) : 0}/40`}
                </span>
              </div>
              <div className="flex justify-between items-center border-t border-slate-100 pt-3">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Total Score</span>
                <span className="font-black text-slate-900 text-sm">
                  {application.matchScore !== undefined ? `${application.matchScore}/100` : '0/100'}
                </span>
              </div>
              <div className="flex justify-between items-center border-t border-slate-100 pt-3">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Overall Rating</span>
                <span className="font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-100 flex items-center gap-1 w-fit">
                  ⭐ {application.rating !== undefined ? `${application.rating.toFixed(1)}/10` : '0.0/10'}
                </span>
              </div>
            </div>
          </div>
          
          {/* Status Pipeline Cards */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-gray-800 flex items-center gap-1.5">
              <Settings className="text-indigo-500" size={18} /> Hiring Pipeline Actions
            </h3>

            {/* Selector dropdown */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Change stage</label>
              <select
                value={application.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="mt-1.5 w-full px-3 py-2 border rounded-xl text-sm bg-white focus:outline-indigo-500 font-bold text-slate-700"
              >
                <option value="New">New</option>
                <option value="Reviewed">Reviewed</option>
                <option value="Shortlisted">Shortlisted</option>
                <option value="Interview Scheduled">Interview Scheduled</option>
                <option value="Interview Completed">Interview Completed</option>
                <option value="Offered">Offered</option>
                <option value="Hired">Hired</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            {/* Direct transition buttons */}
            <div className="flex flex-col gap-2 pt-2 border-t">
              <button
                onClick={() => handleStatusChange('Shortlisted')}
                disabled={application.status === 'Shortlisted'}
                className="w-full py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl text-xs font-extrabold shadow-sm shadow-yellow-500/10 transition disabled:opacity-50"
              >
                Shortlist Candidate
              </button>
              <button
                onClick={() => handleStatusChange('Interview Scheduled')}
                disabled={application.status === 'Interview Scheduled'}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-extrabold shadow-sm shadow-indigo-600/10 transition disabled:opacity-50"
              >
                Schedule Interview
              </button>
              <button
                onClick={() => handleStatusChange('Hired')}
                disabled={application.status === 'Hired'}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold shadow-sm shadow-emerald-600/10 transition disabled:opacity-50"
              >
                Hire Candidate
              </button>
              <button
                onClick={() => handleStatusChange('Rejected')}
                disabled={application.status === 'Rejected'}
                className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-extrabold shadow-sm shadow-rose-600/10 transition disabled:opacity-50"
              >
                Reject Candidate
              </button>
            </div>
          </div>

          {/* Internal Notes Panel */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-gray-800 flex items-center gap-1.5">
              <MessageSquare className="text-indigo-500" size={18} /> Internal Recruiter Reviews
            </h3>

            <div className="space-y-1.5 text-left">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Evaluator Notes</label>
              <textarea
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter review scores, notes, interview dates..."
                className="w-full p-3 border rounded-xl text-xs focus:outline-indigo-500 bg-slate-50 border-slate-200"
              />
            </div>

            <button
              onClick={handleSaveNotes}
              disabled={savingNotes}
              className="w-full py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 disabled:opacity-50 transition"
            >
              {savingNotes ? 'Saving Notes...' : 'Save Evaluation Notes'}
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}

function LinkedinIcon({ size = 16, className = '' }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
      <rect x="2" y="9" width="4" height="12"/>
      <circle cx="4" cy="4" r="2"/>
    </svg>
  );
}

function GithubIcon({ size = 16, className = '' }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
    </svg>
  );
}
