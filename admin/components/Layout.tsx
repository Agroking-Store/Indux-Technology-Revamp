'use client';

import { ReactNode, useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { usePathname } from 'next/navigation';
import { Globe, Bell, ChevronRight, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import api, { ApiResponse } from '@/lib/api';
import Link from 'next/link';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const pathname = usePathname();
  const { admin } = useAuth();

  // Notification States & Fetch Hook
  const [notifData, setNotifData] = useState<{ leads: number; applications: number; registrations: number; total: number } | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    if (admin) {
      const fetchNotifications = async () => {
        try {
          const res = await api.get<ApiResponse<{ leads: number; applications: number; registrations: number; total: number }>>('/dashboard/notifications');
          setNotifData(res.data.data);
        } catch (e) {
          console.error('Failed to load notifications counts:', e);
        }
      };

      fetchNotifications();
      // Poll every 30s
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [admin, pathname]);

  // Generate clean section name from path
  const pathSegments = pathname.split('/').filter(Boolean);
  const sectionName = pathSegments.length > 0
    ? pathSegments[pathSegments.length - 1].charAt(0).toUpperCase() + pathSegments[pathSegments.length - 1].slice(1)
    : 'Dashboard';

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      
      {/* Sleek Sidebar Navigation */}
      <Sidebar />

      {/* Main Container */}
      <div className="flex-1 ml-64 flex flex-col overflow-hidden">
        
        {/* Top Header navbar */}
        <header className="h-16 border-b border-slate-200/60 bg-white/80 dark:bg-slate-900/60 backdrop-blur-md flex items-center justify-between px-8 z-20 shadow-sm shadow-slate-100/10">
          
          {/* Path Breadcrumbs */}
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 select-none">
            <span>Admin</span>
            <ChevronRight size={12} />
            <span className="text-slate-700 dark:text-slate-200 font-bold">{sectionName}</span>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-4">
            
            {/* View Main Website Link */}
            <a
              href="http://localhost:3000"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 rounded-lg text-xs font-bold transition-all"
            >
              <Globe size={13} />
              <span>View Main Site</span>
            </a>

            {/* Notification Bell */}
            <div className="relative">
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 transition relative cursor-pointer flex items-center justify-center"
              >
                <Bell size={16} />
                {notifData && notifData.total > 0 && (
                  <>
                    <span className="absolute top-1 right-1 size-1.5 bg-red-500 rounded-full animate-ping" />
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white font-black text-[9px] size-4 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 shadow">
                      {notifData.total}
                    </span>
                  </>
                )}
              </button>

              {dropdownOpen && (
                <>
                  {/* Backdrop to close click-away */}
                  <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                  
                  <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-4 z-50 space-y-3">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Notifications</span>
                      {notifData && notifData.total > 0 && (
                        <span className="bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-extrabold text-[10px] px-2 py-0.5 rounded-full">
                          {notifData.total} New
                        </span>
                      )}
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                      {!notifData || notifData.total === 0 ? (
                        <p className="text-center py-6 text-slate-400 dark:text-slate-500 italic">No new notifications.</p>
                      ) : (
                        <>
                          {notifData.leads > 0 && (
                            <Link 
                              href="/leads" 
                              onClick={() => setDropdownOpen(false)}
                              className="flex items-center justify-between p-2.5 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl transition cursor-pointer text-slate-700 dark:text-slate-200 font-bold"
                            >
                              <span>New Contact Messages</span>
                              <span className="bg-slate-100 dark:bg-slate-800 font-extrabold px-2 py-0.5 rounded text-slate-600 dark:text-slate-400">
                                {notifData.leads}
                              </span>
                            </Link>
                          )}

                          {notifData.applications > 0 && (
                            <Link 
                              href="/applications" 
                              onClick={() => setDropdownOpen(false)}
                              className="flex items-center justify-between p-2.5 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl transition cursor-pointer text-slate-700 dark:text-slate-200 font-bold"
                            >
                              <span>New Job Applications</span>
                              <span className="bg-slate-100 dark:bg-slate-800 font-extrabold px-2 py-0.5 rounded text-slate-600 dark:text-slate-400">
                                {notifData.applications}
                              </span>
                            </Link>
                          )}

                          {notifData.registrations > 0 && (
                            <Link 
                              href="/events/registrations" 
                              onClick={() => setDropdownOpen(false)}
                              className="flex items-center justify-between p-2.5 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl transition cursor-pointer text-slate-700 dark:text-slate-200 font-bold"
                            >
                              <span>Pending RSVPs</span>
                              <span className="bg-slate-100 dark:bg-slate-800 font-extrabold px-2 py-0.5 rounded text-slate-600 dark:text-slate-400">
                                {notifData.registrations}
                              </span>
                            </Link>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="h-6 w-px bg-slate-200" />

            {/* Admin Badge */}
            <div className="flex items-center gap-2">
              <div className="size-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 border">
                <User size={14} />
              </div>
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{admin?.name || 'Operator'}</span>
            </div>

          </div>

        </header>

        {/* Dynamic page content wrapper */}
        <main className="flex-grow overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>

      </div>
    </div>
  );
};