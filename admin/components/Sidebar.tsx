'use client';

import * as React from 'react';
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
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
    <Sidebar variant="sidebar" {...props}>
      <SidebarHeader className="border-b border-border p-4">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/20">
            <Sparkles className="size-4 animate-pulse" />
          </div>
          <div className="flex flex-col gap-0.5 leading-none">
            <span className="font-extrabold text-foreground tracking-tight">Indux Tech</span>
            <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Control Center</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {groups.map((group, gIdx) => (
          <SidebarGroup key={gIdx}>
            <SidebarGroupLabel className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
              {group.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const active = isItemActive(item.href);
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton 
                        render={<Link href={item.href} />}
                        isActive={active}
                        tooltip={item.label}
                        className={active ? 'bg-indigo-600 text-white hover:bg-indigo-700 hover:text-white dark:bg-indigo-600/90 dark:text-white dark:hover:bg-indigo-500' : 'text-muted-foreground'}
                      >
                        <item.icon className={active ? 'text-white' : ''} />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-border p-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Avatar className="size-9 rounded-full border border-indigo-200 dark:border-indigo-500/20">
              <AvatarImage src="" alt={admin?.name || 'Admin'} />
              <AvatarFallback className="bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 font-extrabold text-xs">
                {getInitials(admin?.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="truncate text-xs font-bold text-foreground">
                {admin?.name || 'System Admin'}
              </span>
              <span className="truncate text-[9px] font-semibold text-muted-foreground">
                {admin?.email || 'admin@induxtech.com'}
              </span>
            </div>
          </div>
          
          <ConfirmDialog
            title="Are you sure you want to sign out?"
            description="You will be redirected to the login page and will need to enter your credentials to access the admin panel again."
            confirmText="Yes, Sign Out"
            onConfirm={logout}
            icon="logout"
            trigger={
              <button className="flex items-center justify-center gap-2 rounded-xl border border-transparent px-3 py-2 text-xs font-semibold text-rose-600 transition-all duration-200 hover:border-rose-200 hover:bg-rose-50 dark:text-rose-400 dark:hover:border-rose-500/20 dark:hover:bg-rose-500/10 cursor-pointer">
                <LogOut size={14} />
                <span>Sign Out</span>
              </button>
            }
          />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}