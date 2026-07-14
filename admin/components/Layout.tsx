'use client';

import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { usePathname } from 'next/navigation';
import { Globe, Bell, ChevronRight, User } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const pathname = usePathname();

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
            <button className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 transition relative">
              <Bell size={16} />
              <span className="absolute top-1 right-1 size-1.5 bg-indigo-500 rounded-full animate-ping" />
            </button>

            <div className="h-6 w-px bg-slate-200" />

            {/* Admin Badge */}
            <div className="flex items-center gap-2">
              <div className="size-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 border">
                <User size={14} />
              </div>
              <span className="text-xs font-bold text-slate-600">Operator</span>
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