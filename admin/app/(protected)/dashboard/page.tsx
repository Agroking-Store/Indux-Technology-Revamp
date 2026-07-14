'use client';

import { useEffect, useState } from 'react';
import api, { ApiResponse } from '@/lib/api';
import Link from 'next/link';
import { FileText, Briefcase, MessageSquare, Calendar, PlusCircle, Sparkles, TrendingUp, CheckCircle, Clock, Inbox, UserCheck, Heart, UserMinus, MapPin } from 'lucide-react';

interface DashboardStats {
  blogs: { total: number; published: number; draft: number };
  careers: { total: number; active: number; closed: number };
  leads?: { total: number; new: number; contacted: number };
  events?: { total: number; upcoming: number };
}

interface AtsStats {
  summary: {
    totalJobs: number;
    activeJobs: number;
    totalApplications: number;
    newApplications: number;
    shortlisted: number;
    interviewsScheduled: number;
    hired: number;
  };
  charts: {
    appsPerJob: Array<{ jobTitle: string; count: number }>;
    appsByLocation: Array<{ location: string; count: number }>;
    hiringFunnel: Array<{ stage: string; count: number }>;
    appsOverTime: Array<{ month: string; count: number }>;
  };
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  // ATS Tab States
  const [activeTab, setActiveTab] = useState<'system' | 'ats'>('system');
  const [atsStats, setAtsStats] = useState<AtsStats | null>(null);
  const [loadingAts, setLoadingAts] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get<ApiResponse<DashboardStats>>('/dashboard/stats');
        setStats(res.data.data);
      } catch (error) {
        // Handled
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    if (activeTab === 'ats' && !atsStats) {
      setLoadingAts(true);
      api.get<ApiResponse<AtsStats>>('/dashboard/ats-stats')
        .then(res => setAtsStats(res.data.data))
        .catch(console.error)
        .finally(() => setLoadingAts(false));
    }
  }, [activeTab, atsStats]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const cardsData = [
    {
      title: 'Blogs & Articles',
      total: stats?.blogs.total || 0,
      icon: FileText,
      color: 'from-emerald-500/10 to-teal-500/5 text-emerald-600 dark:text-emerald-400 border-emerald-500/10',
      breakdowns: [
        { label: 'Published', count: stats?.blogs.published || 0, color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/30' },
        { label: 'Drafts', count: stats?.blogs.draft || 0, color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/30' }
      ]
    },
    {
      title: 'Careers & Openings',
      total: stats?.careers.total || 0,
      icon: Briefcase,
      color: 'from-blue-500/10 to-sky-500/5 text-blue-600 dark:text-blue-400 border-blue-500/10',
      breakdowns: [
        { label: 'Active', count: stats?.careers.active || 0, color: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/20 border-green-100 dark:border-green-900/30' },
        { label: 'Closed', count: stats?.careers.closed || 0, color: 'text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/30 border-slate-100 dark:border-slate-800' }
      ]
    },
    {
      title: 'Total Contact Leads',
      total: stats?.leads?.total || 0,
      icon: MessageSquare,
      color: 'from-purple-500/10 to-fuchsia-500/5 text-purple-600 dark:text-purple-400 border-purple-500/10',
      breakdowns: [
        { label: 'New Inbox', count: stats?.leads?.new || 0, color: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/20 border-indigo-100 dark:border-indigo-900/30' },
        { label: 'Contacted', count: stats?.leads?.contacted || 0, color: 'text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/20 border-violet-100 dark:border-violet-900/30' }
      ]
    },
    {
      title: 'Event Management',
      total: stats?.events?.total || 0,
      icon: Calendar,
      color: 'from-amber-500/10 to-orange-500/5 text-amber-600 dark:text-amber-400 border-amber-500/10',
      breakdowns: [
        { label: 'Upcoming', count: stats?.events?.upcoming || 0, color: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900/30' }
      ]
    }
  ];

  return (
    <div className="space-y-8 text-left">
      
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-8 rounded-3xl border border-slate-800 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="absolute top-0 right-0 w-80 h-full opacity-10 bg-[radial-gradient(#818cf8_2px,transparent_2px)] bg-[size:24px_24px] pointer-events-none" />
        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="size-4 animate-spin-slow" />
            Operations Overview
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight">Welcome back, Operator</h2>
          <p className="text-slate-400 text-xs font-medium">Control panel is synced and system status is active.</p>
        </div>
        <div className="flex gap-3 relative z-10">
          <Link
            href="/events/create"
            className="flex items-center gap-1.5 px-4.5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-indigo-600/15"
          >
            <PlusCircle size={14} /> New Event
          </Link>
          <Link
            href="/careers/create"
            className="flex items-center gap-1.5 px-4.5 py-2.5 bg-slate-800 hover:bg-slate-750 text-slate-200 rounded-xl text-xs font-bold transition border border-slate-700"
          >
            <PlusCircle size={14} /> Add Position
          </Link>
        </div>
      </div>

      {/* Tabs Selector */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('system')}
          className={`px-6 py-3 font-bold text-sm border-b-2 transition ${activeTab === 'system' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          System Overview
        </button>
        <button
          onClick={() => setActiveTab('ats')}
          className={`px-6 py-3 font-bold text-sm border-b-2 transition ${activeTab === 'ats' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          Recruiting ATS
        </button>
      </div>

      {activeTab === 'system' ? (
        /* SYSTEM STATS FEED */
        <>
          {/* Main Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cardsData.map((card, idx) => {
              const Icon = card.icon;
              return (
                <div 
                  key={idx} 
                  className="bg-white dark:bg-slate-900/60 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm p-5 hover:-translate-y-1 hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                        {card.title}
                      </span>
                      <div className={`p-2 rounded-xl bg-gradient-to-tr ${card.color} border`}>
                        <Icon size={16} />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white">
                        {card.total}
                      </h3>
                      <p className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                        <TrendingUp size={10} className="text-emerald-500" /> Database Entries Count
                      </p>
                    </div>
                  </div>

                  {/* Status Breakdown Pills */}
                  <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                    {card.breakdowns.map((b, bIdx) => (
                      <div 
                        key={bIdx} 
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[10px] font-bold ${b.color}`}
                      >
                        <span>{b.label}:</span>
                        <span>{b.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Shortcut Quick links Grid */}
            <div className="bg-white dark:bg-slate-900/60 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Management Shortcuts</h3>
              <div className="grid grid-cols-2 gap-3 text-xs font-bold">
                <Link 
                  href="/blogs" 
                  className="p-3 border rounded-xl hover:border-indigo-500 hover:bg-indigo-50/10 text-slate-700 dark:text-slate-300 flex flex-col gap-2 transition"
                >
                  <FileText className="text-emerald-500" size={18} />
                  <span>Review Blogs</span>
                </Link>
                <Link 
                  href="/careers" 
                  className="p-3 border rounded-xl hover:border-indigo-500 hover:bg-indigo-50/10 text-slate-700 dark:text-slate-300 flex flex-col gap-2 transition"
                >
                  <Briefcase className="text-blue-500" size={18} />
                  <span>Manage Jobs</span>
                </Link>
                <Link 
                  href="/events/registrations" 
                  className="p-3 border rounded-xl hover:border-indigo-500 hover:bg-indigo-50/10 text-slate-700 dark:text-slate-300 flex flex-col gap-2 transition"
                >
                  <Calendar className="text-amber-500" size={18} />
                  <span>RSVP Inbox</span>
                </Link>
                <Link 
                  href="/leads" 
                  className="p-3 border rounded-xl hover:border-indigo-500 hover:bg-indigo-50/10 text-slate-700 dark:text-slate-300 flex flex-col gap-2 transition"
                >
                  <MessageSquare className="text-purple-500" size={18} />
                  <span>Contact Leads</span>
                </Link>
              </div>
            </div>

            {/* System Logs / Action Feed Mockup */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-900/60 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Operations Log</h3>
                <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded-full border border-emerald-100">
                  <CheckCircle size={10} /> Sync Complete
                </span>
              </div>

              <div className="space-y-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <div className="flex items-start gap-3">
                  <Clock className="text-slate-400 mt-0.5 shrink-0" size={14} />
                  <div className="flex-1">
                    <span className="text-slate-800 dark:text-slate-200 font-bold">Admin session authenticated</span>
                    <p className="text-[10px] text-slate-450 mt-0.5">Console loaded successfully from 192.168.1.100</p>
                  </div>
                  <span className="text-[10px] text-slate-400">Just Now</span>
                </div>

                <div className="flex items-start gap-3 pt-3 border-t">
                  <Clock className="text-slate-400 mt-0.5 shrink-0" size={14} />
                  <div className="flex-1">
                    <span className="text-slate-800 dark:text-slate-200 font-bold">Events registration API initialized</span>
                    <p className="text-[10px] text-slate-450 mt-0.5">Dynamic registration fields validated and mounted</p>
                  </div>
                  <span className="text-[10px] text-slate-400">10m ago</span>
                </div>

                <div className="flex items-start gap-3 pt-3 border-t">
                  <Clock className="text-slate-400 mt-0.5 shrink-0" size={14} />
                  <div className="flex-1">
                    <span className="text-slate-800 dark:text-slate-200 font-bold">Database backups synced</span>
                    <p className="text-[10px] text-slate-450 mt-0.5">Daily automated backup completed with MongoDump</p>
                  </div>
                  <span className="text-[10px] text-slate-400">1h ago</span>
                </div>
              </div>
            </div>

          </div>
        </>
      ) : (
        /* RECRUITING ATS VIEW WITH INLINE STYLED CHARTS */
        <div className="space-y-6">
          {loadingAts ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : !atsStats ? (
            <div className="text-center py-20 text-gray-500">Failed to load ATS metrics.</div>
          ) : (
            <>
              {/* Summary ATS metrics cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                {[
                  { label: 'Total Jobs', count: atsStats.summary.totalJobs, color: 'text-slate-900 bg-slate-50 border-slate-200', icon: Briefcase },
                  { label: 'Active Openings', count: atsStats.summary.activeJobs, color: 'text-green-700 bg-green-50 border-green-200', icon: CheckCircle },
                  { label: 'Applications', count: atsStats.summary.totalApplications, color: 'text-indigo-700 bg-indigo-50 border-indigo-200', icon: Inbox },
                  { label: 'New Inbox', count: atsStats.summary.newApplications, color: 'text-blue-700 bg-blue-50 border-blue-200', icon: Clock },
                  { label: 'Shortlisted', count: atsStats.summary.shortlisted, color: 'text-yellow-700 bg-yellow-50 border-yellow-200', icon: StarIcon },
                  { label: 'Interviews', count: atsStats.summary.interviewsScheduled, color: 'text-purple-700 bg-purple-50 border-purple-200', icon: UserCheck },
                  { label: 'Hired Candidates', count: atsStats.summary.hired, color: 'text-emerald-700 bg-emerald-50 border-emerald-200', icon: Heart }
                ].map((card, idx) => {
                  const IconComponent = card.icon || Briefcase;
                  return (
                    <div key={idx} className={`p-4 rounded-2xl border flex flex-col justify-between shadow-sm ${card.color}`}>
                      <span className="text-[9px] uppercase font-extrabold opacity-60 tracking-wider leading-snug">{card.label}</span>
                      <h4 className="text-2xl font-black mt-2">{card.count}</h4>
                    </div>
                  );
                })}
              </div>

              {/* ATS Charts Grids */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* 1. Applications Per Job (Bar Chart) */}
                <div className="bg-white p-6 rounded-2xl border border-gray-200/85 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider text-left">Applications Per Job Opening</h3>
                  {atsStats.charts.appsPerJob.length === 0 ? (
                    <div className="py-20 text-center text-xs text-gray-400 italic">No job applications collected.</div>
                  ) : (
                    <div className="flex items-end justify-around h-60 pt-6 px-4">
                      {atsStats.charts.appsPerJob.slice(0, 5).map((item, idx) => {
                        const maxVal = Math.max(...atsStats.charts.appsPerJob.map(x => x.count), 1);
                        const heightPct = `${Math.round((item.count / maxVal) * 100)}%`;
                        return (
                          <div key={idx} className="flex flex-col items-center gap-2 group relative w-16">
                            <div className="flex-1 w-full bg-slate-50 rounded-xl relative overflow-hidden flex items-end min-h-[140px] border border-slate-100">
                              <div
                                style={{ height: heightPct }}
                                className="w-full bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-xl group-hover:scale-y-105 transition-all duration-300 origin-bottom"
                              />
                              <span className="absolute top-2 left-1/2 -translate-x-1/2 bg-slate-900 text-white font-extrabold text-[9px] px-1.5 py-0.5 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity">
                                {item.count}
                              </span>
                            </div>
                            <span className="text-[9px] font-bold text-gray-500 line-clamp-1 w-full text-center" title={item.jobTitle}>
                              {item.jobTitle}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* 2. Applications Over Time (Line Chart Trend) */}
                <div className="bg-white p-6 rounded-2xl border border-gray-200/85 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider text-left">Hiring Applications Trend (Past 6 Months)</h3>
                  {atsStats.charts.appsOverTime.length === 0 ? (
                    <div className="py-20 text-center text-xs text-gray-400 italic">No trend data available.</div>
                  ) : (
                    <div className="flex flex-col justify-between h-60 pt-6">
                      <div className="flex-1 relative flex items-center justify-center">
                        <svg className="w-full h-full max-h-[160px] overflow-visible" viewBox="0 0 360 120">
                          {/* Grid lines */}
                          <line x1="20" y1="20" x2="340" y2="20" stroke="#f1f5f9" strokeWidth="1" />
                          <line x1="20" y1="60" x2="340" y2="60" stroke="#f1f5f9" strokeWidth="1" />
                          <line x1="20" y1="100" x2="340" y2="100" stroke="#e2e8f0" strokeWidth="1.5" />

                          {/* Line Chart Path */}
                          {(() => {
                            const maxVal = Math.max(...atsStats.charts.appsOverTime.map(x => x.count), 1);
                            const points = atsStats.charts.appsOverTime.map((item, idx) => {
                              const x = idx * 60 + 30;
                              const y = 100 - (item.count / maxVal) * 80;
                              return `${x},${y}`;
                            }).join(' ');

                            return (
                              <>
                                <polyline
                                  fill="none"
                                  stroke="#4f46e5"
                                  strokeWidth="2.5"
                                  points={points}
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                {atsStats.charts.appsOverTime.map((item, idx) => {
                                  const x = idx * 60 + 30;
                                  const y = 100 - (item.count / maxVal) * 80;
                                  return (
                                    <g key={idx} className="group/dot cursor-pointer">
                                      <circle
                                        cx={x}
                                        cy={y}
                                        r="4"
                                        fill="#ffffff"
                                        stroke="#4f46e5"
                                        strokeWidth="2.5"
                                        className="hover:r-6 transition-all"
                                      />
                                      <text
                                        x={x}
                                        y={y - 8}
                                        textAnchor="middle"
                                        className="text-[9px] font-extrabold fill-slate-800 opacity-0 group-hover/dot:opacity-100 transition-opacity"
                                      >
                                        {item.count}
                                      </text>
                                    </g>
                                  );
                                })}
                              </>
                            );
                          })()}
                        </svg>
                      </div>
                      <div className="flex justify-between px-6 border-t pt-2 text-[9px] font-bold text-gray-400">
                        {atsStats.charts.appsOverTime.map((item, idx) => (
                          <span key={idx}>{item.month}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. Hiring Funnel Stages (Horizontal Progress Bars) */}
                <div className="bg-white p-6 rounded-2xl border border-gray-200/85 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider text-left">Recruiting Funnel Distribution</h3>
                  <div className="space-y-3.5 max-h-60 overflow-y-auto pr-2">
                    {atsStats.charts.hiringFunnel.map((item, idx) => {
                      const maxVal = Math.max(...atsStats.charts.hiringFunnel.map(x => x.count), 1);
                      const pct = Math.round((item.count / maxVal) * 100);
                      
                      return (
                        <div key={idx} className="space-y-1 text-left">
                          <div className="flex justify-between text-[10px] font-bold text-slate-700">
                            <span className="capitalize">{item.stage}</span>
                            <span>{item.count} Candidates ({pct}%)</span>
                          </div>
                          <div className="h-2 w-full bg-slate-50 border rounded-full overflow-hidden">
                            <div
                              style={{ width: `${pct}%` }}
                              className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 4. Applications By Location (Tag blocks) */}
                <div className="bg-white p-6 rounded-2xl border border-gray-200/85 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider text-left">Applications By Office Location</h3>
                  {atsStats.charts.appsByLocation.length === 0 ? (
                    <div className="py-20 text-center text-xs text-gray-400 italic">No location coordinates registered.</div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4 h-60 overflow-y-auto pt-2">
                      {atsStats.charts.appsByLocation.map((item, idx) => (
                        <div key={idx} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between shadow-sm">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100">
                              <MapPin size={14} />
                            </div>
                            <span className="text-xs font-bold text-slate-800 capitalize">{item.location}</span>
                          </div>
                          <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">{item.count} apps</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            </>
          )}
        </div>
      )}

    </div>
  );
}

// Inline fallback Star icon
function StarIcon({ size = 16, className = '' }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}