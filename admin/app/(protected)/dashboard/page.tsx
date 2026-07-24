'use client';

import { useEffect, useState } from 'react';
import api, { ApiResponse } from '@/lib/api';
import Link from 'next/link';
import { 
  FileText, 
  Briefcase, 
  MessageSquare, 
  Calendar, 
  PlusCircle, 
  Sparkles, 
  TrendingUp, 
  CheckCircle, 
  Clock, 
  Inbox, 
  UserCheck, 
  Heart, 
  MapPin, 
  Users 
} from 'lucide-react';

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

  // Website Traffic Analytics States
  const [visitorRange, setVisitorRange] = useState<'week' | 'month'>('week');
  const [visitorData, setVisitorData] = useState<{ total: number; chartData: Array<{ label: string; count: number }> } | null>(null);
  const [loadingVisitors, setLoadingVisitors] = useState(false);

  useEffect(() => {
    setLoadingVisitors(true);
    api.get<ApiResponse<{ total: number; chartData: Array<{ label: string; count: number }> }>>(`/dashboard/visitor-stats?range=${visitorRange}`)
      .then(res => setVisitorData(res.data.data))
      .catch(console.error)
      .finally(() => setLoadingVisitors(false));
  }, [visitorRange]);

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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
      </div>
    );
  }

  const cardsData = [
    {
      title: 'Blogs & Articles',
      total: stats?.blogs.total || 0,
      icon: FileText,
      color: 'from-emerald-500/10 to-teal-500/5 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 dark:border-emerald-500/30',
      breakdowns: [
        { label: 'Published', count: stats?.blogs.published || 0, color: 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/40' },
        { label: 'Drafts', count: stats?.blogs.draft || 0, color: 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/40' }
      ]
    },
    {
      title: 'Careers & Openings',
      total: stats?.careers.total || 0,
      icon: Briefcase,
      color: 'from-blue-500/10 to-sky-500/5 text-blue-600 dark:text-blue-400 border-blue-500/20 dark:border-blue-500/30',
      breakdowns: [
        { label: 'Active', count: stats?.careers.active || 0, color: 'text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900/40' },
        { label: 'Closed', count: stats?.careers.closed || 0, color: 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800' }
      ]
    },
    {
      title: 'Total Contact Leads',
      total: stats?.leads?.total || 0,
      icon: MessageSquare,
      color: 'from-purple-500/10 to-fuchsia-500/5 text-purple-600 dark:text-purple-400 border-purple-500/20 dark:border-purple-500/30',
      breakdowns: [
        { label: 'New Inbox', count: stats?.leads?.new || 0, color: 'text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-900/40' },
        { label: 'Contacted', count: stats?.leads?.contacted || 0, color: 'text-violet-700 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/30 border-violet-200 dark:border-violet-900/40' }
      ]
    },
    {
      title: 'Event Management',
      total: stats?.events?.total || 0,
      icon: Calendar,
      color: 'from-amber-500/10 to-orange-500/5 text-amber-600 dark:text-amber-400 border-amber-500/20 dark:border-amber-500/30',
      breakdowns: [
        { label: 'Upcoming', count: stats?.events?.upcoming || 0, color: 'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900/40' }
      ]
    }
  ];

  return (
    <div className="space-y-8 text-left text-slate-900 dark:text-slate-100 transition-colors duration-300">
      
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-50/80 via-white to-slate-100 dark:from-slate-900 dark:via-indigo-950 dark:to-slate-900 p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-md dark:shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-colors duration-300">
  {/* Dot Pattern Overlay */}
  <div className="absolute top-0 right-0 w-80 h-full opacity-20 dark:opacity-10 bg-[radial-gradient(#6366f1_2px,transparent_2px)] dark:bg-[radial-gradient(#818cf8_2px,transparent_2px)] bg-[size:24px_24px] pointer-events-none" />

  {/* Header Text Section */}
  <div className="space-y-1 relative z-10">
    <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">
      Operations Overview
    </div>
    <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
      Welcome back, Operator
    </h2>
    <p className="text-slate-600 dark:text-slate-400 text-xs font-medium">
      Control panel is synced and system status is active.
    </p>
  </div>

  {/* Action Buttons */}
  <div className="flex gap-3 relative z-10">
    <Link
      href="/events/create"
      className="flex items-center gap-1.5 px-4.5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-indigo-600/20"
    >
      <PlusCircle size={14} /> New Event
    </Link>
    <Link
      href="/careers/create"
      className="flex items-center gap-1.5 px-4.5 py-2.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold transition shadow-sm"
    >
      <PlusCircle size={14} /> Add Position
    </Link>
  </div>
</div>

      {/* Tabs Selector */}
      <div className="flex border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('system')}
          className={`px-6 py-3 font-bold text-sm border-b-2 transition cursor-pointer ${
            activeTab === 'system' 
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' 
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          System Overview
        </button>
        <button
          onClick={() => setActiveTab('ats')}
          className={`px-6 py-3 font-bold text-sm border-b-2 transition cursor-pointer ${
            activeTab === 'ats' 
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' 
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
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
                  className="bg-white dark:bg-slate-900/60 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-5 hover:-translate-y-1 hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">
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
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-1">
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

          {/* Website Traffic & Visitors Card */}
          <div className="bg-white dark:bg-slate-900/60 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50">
                    <Users size={16} />
                  </div>
                  <h3 className="text-sm font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider">Website Traffic Analytics</h3>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Monitor real-time user visits and traffic history.</p>
              </div>
              
              {/* Filter Selector Tabs */}
              <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200/60 dark:border-slate-800">
                <button
                  onClick={() => setVisitorRange('week')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    visitorRange === 'week' 
                      ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  This Week
                </button>
                <button
                  onClick={() => setVisitorRange('month')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    visitorRange === 'month' 
                      ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  This Month
                </button>
              </div>
            </div>

            {loadingVisitors ? (
              <div className="flex justify-center items-center h-48">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
              </div>
            ) : !visitorData ? (
              <div className="py-12 text-center text-xs text-slate-500 dark:text-slate-400 italic">Failed to load traffic metrics.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left: Highlight Total */}
                <div className="space-y-4 flex flex-col justify-center border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800 pb-6 md:pb-0 md:pr-8">
                  <span className="text-[11px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">
                    Total Visitors ({visitorRange === 'week' ? 'Past 7 Days' : 'Past 30 Days'})
                  </span>
                  <div className="space-y-1">
                    <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                      {visitorData.total}
                    </h2>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold flex items-center gap-1">
                      <TrendingUp size={10} className="text-emerald-500 animate-pulse" /> Active user traffic log
                    </p>
                  </div>
                </div>

                {/* Right: Trend Chart (spans 2 columns) */}
                <div className="md:col-span-2 space-y-4">
                  <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider block text-left">Traffic Trend History</span>
                  
                  {visitorData.chartData.length === 0 ? (
                    <div className="h-32 flex items-center justify-center text-xs text-slate-400 italic">No traffic recorded yet.</div>
                  ) : (
                    <div className="flex items-end justify-around h-36 pt-6 px-2">
                      {visitorData.chartData.map((item, idx) => {
                        const maxVal = Math.max(...visitorData.chartData.map(x => x.count), 1);
                        const heightPct = `${Math.round((item.count / maxVal) * 100)}%`;
                        return (
                          <div key={idx} className="flex flex-col items-center gap-2 group relative flex-1 max-w-[64px]">
                            <div className="flex-1 w-full bg-slate-50 dark:bg-slate-950/40 rounded-xl relative overflow-hidden flex items-end min-h-[100px] border border-slate-100 dark:border-slate-800">
                              <div
                                style={{ height: heightPct }}
                                className="w-full bg-gradient-to-t from-indigo-600 to-indigo-400 dark:from-indigo-500 dark:to-indigo-300 rounded-t-xl group-hover:scale-y-105 transition-all duration-300 origin-bottom"
                              />
                              <span className="absolute top-1 left-1/2 -translate-x-1/2 bg-slate-900 text-white font-extrabold text-[9px] px-1.5 py-0.5 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                {item.count} views
                              </span>
                            </div>
                            <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 line-clamp-1 w-full text-center">
                              {item.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Shortcut Quick links Grid */}
            <div className="bg-white dark:bg-slate-900/60 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Management Shortcuts</h3>
              <div className="grid grid-cols-2 gap-3 text-xs font-bold">
                <Link 
                  href="/blogs" 
                  className="p-3 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-indigo-500 dark:hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 text-slate-700 dark:text-slate-300 flex flex-col gap-2 transition"
                >
                  <FileText className="text-emerald-500" size={18} />
                  <span>Review Blogs</span>
                </Link>
                <Link 
                  href="/careers" 
                  className="p-3 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-indigo-500 dark:hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 text-slate-700 dark:text-slate-300 flex flex-col gap-2 transition"
                >
                  <Briefcase className="text-blue-500" size={18} />
                  <span>Manage Jobs</span>
                </Link>
                <Link 
                  href="/events/registrations" 
                  className="p-3 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-indigo-500 dark:hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 text-slate-700 dark:text-slate-300 flex flex-col gap-2 transition"
                >
                  <Calendar className="text-amber-500" size={18} />
                  <span>RSVP Inbox</span>
                </Link>
                <Link 
                  href="/leads" 
                  className="p-3 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-indigo-500 dark:hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 text-slate-700 dark:text-slate-300 flex flex-col gap-2 transition"
                >
                  <MessageSquare className="text-purple-500" size={18} />
                  <span>Contact Leads</span>
                </Link>
              </div>
            </div>

            {/* System Logs / Action Feed Mockup */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-900/60 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Operations Log</h3>
                <span className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-900/40">
                  <CheckCircle size={10} /> Sync Complete
                </span>
              </div>

              <div className="space-y-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <div className="flex items-start gap-3">
                  <Clock className="text-slate-400 dark:text-slate-500 mt-0.5 shrink-0" size={14} />
                  <div className="flex-1">
                    <span className="text-slate-800 dark:text-slate-200 font-bold">Admin session authenticated</span>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Console loaded successfully from 192.168.1.100</p>
                  </div>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">Just Now</span>
                </div>

                <div className="flex items-start gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <Clock className="text-slate-400 dark:text-slate-500 mt-0.5 shrink-0" size={14} />
                  <div className="flex-1">
                    <span className="text-slate-800 dark:text-slate-200 font-bold">Events registration API initialized</span>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Dynamic registration fields validated and mounted</p>
                  </div>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">10m ago</span>
                </div>

                <div className="flex items-start gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <Clock className="text-slate-400 dark:text-slate-500 mt-0.5 shrink-0" size={14} />
                  <div className="flex-1">
                    <span className="text-slate-800 dark:text-slate-200 font-bold">Database backups synced</span>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Daily automated backup completed with MongoDump</p>
                  </div>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">1h ago</span>
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
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
            </div>
          ) : !atsStats ? (
            <div className="text-center py-20 text-slate-500 dark:text-slate-400">Failed to load ATS metrics.</div>
          ) : (
            <>
              {/* Summary ATS metrics cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                {[
                  { label: 'Total Jobs', count: atsStats.summary.totalJobs, color: 'text-slate-900 dark:text-slate-100 bg-slate-100/80 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800', icon: Briefcase },
                  { label: 'Active Openings', count: atsStats.summary.activeJobs, color: 'text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900/40', icon: CheckCircle },
                  { label: 'Applications', count: atsStats.summary.totalApplications, color: 'text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-900/40', icon: Inbox },
                  { label: 'New Inbox', count: atsStats.summary.newApplications, color: 'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900/40', icon: Clock },
                  { label: 'Shortlisted', count: atsStats.summary.shortlisted, color: 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/40', icon: StarIcon },
                  { label: 'Interviews', count: atsStats.summary.interviewsScheduled, color: 'text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-900/40', icon: UserCheck },
                  { label: 'Hired Candidates', count: atsStats.summary.hired, color: 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/40', icon: Heart }
                ].map((card, idx) => {
                  return (
                    <div key={idx} className={`p-4 rounded-2xl border flex flex-col justify-between shadow-sm ${card.color}`}>
                      <span className="text-[9px] uppercase font-extrabold opacity-70 tracking-wider leading-snug">{card.label}</span>
                      <h4 className="text-2xl font-black mt-2">{card.count}</h4>
                    </div>
                  );
                })}
              </div>

              {/* ATS Charts Grids */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* 1. Applications Per Job (Bar Chart) */}
                <div className="bg-white dark:bg-slate-900/60 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-left">Applications Per Job Opening</h3>
                  {atsStats.charts.appsPerJob.length === 0 ? (
                    <div className="py-20 text-center text-xs text-slate-400 italic">No job applications collected.</div>
                  ) : (
                    <div className="flex items-end justify-around h-60 pt-6 px-4">
                      {atsStats.charts.appsPerJob.slice(0, 5).map((item, idx) => {
                        const maxVal = Math.max(...atsStats.charts.appsPerJob.map(x => x.count), 1);
                        const heightPct = `${Math.round((item.count / maxVal) * 100)}%`;
                        return (
                          <div key={idx} className="flex flex-col items-center gap-2 group relative w-16">
                            <div className="flex-1 w-full bg-slate-50 dark:bg-slate-950/40 rounded-xl relative overflow-hidden flex items-end min-h-[140px] border border-slate-100 dark:border-slate-800">
                              <div
                                style={{ height: heightPct }}
                                className="w-full bg-gradient-to-t from-indigo-600 to-indigo-400 dark:from-indigo-500 dark:to-indigo-300 rounded-t-xl group-hover:scale-y-105 transition-all duration-300 origin-bottom"
                              />
                              <span className="absolute top-2 left-1/2 -translate-x-1/2 bg-slate-900 text-white font-extrabold text-[9px] px-1.5 py-0.5 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity">
                                {item.count}
                              </span>
                            </div>
                            <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 line-clamp-1 w-full text-center" title={item.jobTitle}>
                              {item.jobTitle}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* 2. Applications Over Time (Line Chart Trend) */}
                <div className="bg-white dark:bg-slate-900/60 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-left">Hiring Applications Trend (Past 6 Months)</h3>
                  {atsStats.charts.appsOverTime.length === 0 ? (
                    <div className="py-20 text-center text-xs text-slate-400 italic">No trend data available.</div>
                  ) : (
                    <div className="flex flex-col justify-between h-60 pt-6">
                      <div className="flex-1 relative flex items-center justify-center">
                        <svg className="w-full h-full max-h-[160px] overflow-visible" viewBox="0 0 360 120">
                          {/* Grid lines */}
                          <line x1="20" y1="20" x2="340" y2="20" className="stroke-slate-100 dark:stroke-slate-800" strokeWidth="1" />
                          <line x1="20" y1="60" x2="340" y2="60" className="stroke-slate-100 dark:stroke-slate-800" strokeWidth="1" />
                          <line x1="20" y1="100" x2="340" y2="100" className="stroke-slate-200 dark:stroke-slate-800" strokeWidth="1.5" />

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
                                  stroke="#6366f1"
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
                                        fill="#6366f1"
                                        stroke="#ffffff"
                                        strokeWidth="2.5"
                                        className="hover:r-6 transition-all"
                                      />
                                      <text
                                        x={x}
                                        y={y - 8}
                                        textAnchor="middle"
                                        className="text-[9px] font-extrabold fill-slate-800 dark:fill-slate-100 opacity-0 group-hover/dot:opacity-100 transition-opacity"
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
                      <div className="flex justify-between px-6 border-t border-slate-100 dark:border-slate-800 pt-2 text-[9px] font-bold text-slate-500 dark:text-slate-400">
                        {atsStats.charts.appsOverTime.map((item, idx) => (
                          <span key={idx}>{item.month}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. Hiring Funnel Stages (Horizontal Progress Bars) */}
                <div className="bg-white dark:bg-slate-900/60 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-left">Recruiting Funnel Distribution</h3>
                  <div className="space-y-3.5 max-h-60 overflow-y-auto pr-2">
                    {atsStats.charts.hiringFunnel.map((item, idx) => {
                      const maxVal = Math.max(...atsStats.charts.hiringFunnel.map(x => x.count), 1);
                      const pct = Math.round((item.count / maxVal) * 100);
                      
                      return (
                        <div key={idx} className="space-y-1 text-left">
                          <div className="flex justify-between text-[10px] font-bold text-slate-700 dark:text-slate-300">
                            <span className="capitalize">{item.stage}</span>
                            <span>{item.count} Candidates ({pct}%)</span>
                          </div>
                          <div className="h-2 w-full bg-slate-100 dark:bg-slate-950/80 border border-slate-200/50 dark:border-slate-800 rounded-full overflow-hidden">
                            <div
                              style={{ width: `${pct}%` }}
                              className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 dark:from-indigo-400 dark:to-indigo-500 rounded-full"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 4. Applications By Location (Tag blocks) */}
                <div className="bg-white dark:bg-slate-900/60 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-left">Applications By Office Location</h3>
                  {atsStats.charts.appsByLocation.length === 0 ? (
                    <div className="py-20 text-center text-xs text-slate-400 italic">No location coordinates registered.</div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4 h-60 overflow-y-auto pt-2">
                      {atsStats.charts.appsByLocation.map((item, idx) => (
                        <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-900/80 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center justify-between shadow-sm">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50">
                              <MapPin size={14} />
                            </div>
                            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 capitalize">{item.location}</span>
                          </div>
                          <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-2 py-1 rounded-full">{item.count} apps</span>
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