'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
  LayoutDashboard, 
  FileText, 
  Briefcase, 
  Inbox,

  LogOut,
} from 'lucide-react';

export const Sidebar = () => {
  const pathname = usePathname();
  const { logout } = useAuth();

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/blogs', label: 'Blogs', icon: FileText },
    { href: '/careers', label: 'Careers', icon: Briefcase },
    { href: '/applications', label: 'Applications', icon: Inbox },
    { href: '/leads', label: 'Leads', icon: Briefcase },
  ];

  return (
    <aside className="w-64 bg-white shadow-md flex flex-col fixed h-full">
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold text-indigo-600">Indux Admin</h1>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${
              pathname === href || pathname.startsWith(href + '/')
                ? 'bg-indigo-50 text-indigo-700'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Icon size={20} />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-2 w-full rounded-lg text-red-600 hover:bg-red-50 transition"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};