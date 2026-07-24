'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
  LayoutDashboard, 
  FileText, 
  Briefcase, 
  Inbox,
  MessageSquare,
  Calendar,
  Users,
  LogOut,
  Sparkles
} from 'lucide-react';

export const Sidebar = () => {
  const pathname = usePathname();
  const { admin, logout } = useAuth();

  const groups = [
    {
      title: 'Overview',
      items: [
        { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      ]
    },
    {
      title: 'Marketing Feed',
      items: [
        { href: '/blogs', label: 'Blogs Feed', icon: FileText },
        { href: '/leads', label: 'Contact Leads', icon: MessageSquare },
      ]
    },
    {
      title: 'Recruiting ATS',
      items: [
        { href: '/careers', label: 'Job Openings', icon: Briefcase },
        { href: '/applications', label: 'Candidates List', icon: Inbox },
      ]
    },
    {
      title: 'Events Module',
      items: [
        { href: '/events', label: 'All Events', icon: Calendar },
        { href: '/events/registrations', label: 'Registrations', icon: Users },
      ]
    }
  ];

  // Helper to accurately identify active routes without sibling collisions
  const isItemActive = (href: string) => {
    if (pathname === href) return true;
    if (href === '/dashboard') return false;
    
    // Prevent /events from remaining active when on /events/registrations
    if (href === '/events' && pathname.startsWith('/events/registrations')) {
      return false;
    }
    
    return pathname.startsWith(href + '/');
  };

  // Extract initials for the profile avatar
  const getInitials = (name?: string) => {
    if (!name) return 'AD';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 text-gray-700 dark:text-slate-300 flex flex-col fixed h-full border-r border-gray-200 dark:border-slate-800 z-30 transition-colors duration-200">
      
      {/* Brand Logo Header */}
      <div className="p-6 border-b border-gray-100 dark:border-slate-800/60 flex items-center gap-2.5">
        <div className="size-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <Sparkles className="size-4.5 text-white animate-pulse" />
        </div>
        <div>
          <h1 className="text-base font-extrabold text-gray-900 dark:text-white tracking-tight leading-none">Indux Tech</h1>
          <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mt-1 block">Control Center</span>
        </div>
      </div>

      {/* Grouped Navigation Links */}
      <nav className="flex-1 p-4 space-y-6 overflow-y-auto mt-2">
        {groups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1.5">
            <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 dark:text-slate-500 px-3 select-none">
              {group.title}
            </span>
            <div className="space-y-0.5">
              {group.items.map(({ href, label, icon: Icon }) => {
                const active = isItemActive(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 text-xs font-semibold ${
                      active
                        ? 'bg-indigo-600 dark:bg-gradient-to-r dark:from-indigo-600/90 dark:to-indigo-500/80 text-white shadow-md shadow-indigo-600/20'
                        : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <Icon size={16} className={active ? 'text-white' : 'text-gray-400 dark:text-slate-400'} />
                    <span>{label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User profile Summary Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-slate-800/60 bg-gray-50/80 dark:bg-slate-950/20 flex flex-col gap-2 transition-colors">
        <div className="flex items-center gap-3 px-2 py-1">
          <div className="size-9 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-extrabold text-xs shrink-0">
            {getInitials(admin?.name)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-gray-900 dark:text-slate-200 truncate leading-none">
              {admin?.name || 'System Admin'}
            </p>
            <span className="text-[9px] text-gray-500 dark:text-slate-500 font-semibold truncate block mt-1">
              {admin?.email || 'admin@induxtech.com'}
            </span>
          </div>
        </div>

        <button
          onClick={logout}
          className="flex items-center justify-center gap-2 px-3 py-2 w-full rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-500/10 border border-transparent hover:border-rose-200 dark:hover:border-rose-500/20 transition-all duration-200 cursor-pointer"
        >
          <LogOut size={14} />
          <span>Sign Out</span>
        </button>
      </div>

    </aside>
  );
};