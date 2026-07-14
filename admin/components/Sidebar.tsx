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
  Settings,
  Sparkles
} from 'lucide-react';

export const Sidebar = () => {
  const pathname = usePathname();
  const { logout } = useAuth();

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

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col fixed h-full border-r border-slate-800 z-30">
      
      {/* Brand Logo Header */}
      <div className="p-6 border-b border-slate-800/60 flex items-center gap-2.5">
        <div className="size-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <Sparkles className="size-4.5 text-white animate-pulse" />
        </div>
        <div>
          <h1 className="text-base font-extrabold text-white tracking-tight leading-none">Indux Tech</h1>
          <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mt-1 block">Control Center</span>
        </div>
      </div>

      {/* Grouped Navigation Links */}
      <nav className="flex-1 p-4 space-y-6 overflow-y-auto mt-2">
        {groups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1.5">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 px-3 select-none">
              {group.title}
            </span>
            <div className="space-y-0.5">
              {group.items.map(({ href, label, icon: Icon }) => {
                const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href + '/'));
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 text-xs font-semibold ${
                      isActive
                        ? 'bg-gradient-to-r from-indigo-600/90 to-indigo-500/80 text-white shadow-md shadow-indigo-600/10'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                    }`}
                  >
                    <Icon size={16} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'} />
                    <span>{label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User profile Summary Footer */}
      <div className="p-4 border-t border-slate-800/60 bg-slate-950/20 flex flex-col gap-2">
        <div className="flex items-center gap-3 px-2 py-1">
          <div className="size-9 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-extrabold text-xs">
            AD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-200 truncate leading-none">System Admin</p>
            <span className="text-[9px] text-slate-500 font-semibold truncate block mt-1">admin@induxtech.com</span>
          </div>
        </div>

        <button
          onClick={logout}
          className="flex items-center justify-center gap-2 px-3 py-2 w-full rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/10 transition-all duration-200"
        >
          <LogOut size={14} />
          <span>Sign Out</span>
        </button>
      </div>

    </aside>
  );
};