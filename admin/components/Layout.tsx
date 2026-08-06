'use client';

import { ReactNode, useState, useEffect, useRef } from 'react';
import { AppSidebar } from './Sidebar';
import { usePathname } from 'next/navigation';
import { Globe, Bell, ChevronRight, User, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import api, { ApiResponse } from '@/lib/api';
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel, DropdownMenuGroup } from '@/components/ui/dropdown-menu';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const pathname = usePathname();
  const { admin, logout } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 1. Raw notification data from API
  const [serverData, setServerData] = useState<{ leads: number; applications: number; registrations: number; total: number } | null>(null);
  
  // 2. Initialize clearedCounts from localStorage so it persists across refreshes
  const [clearedCounts, setClearedCounts] = useState<{ leads: number; applications: number; registrations: number }>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('admin_cleared_notifs');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error('Failed to parse cleared notifications', e);
        }
      }
    }
    return { leads: 0, applications: 0, registrations: 0 };
  });

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [hasViewed, setHasViewed] = useState(false);
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);
  const prevEffectiveTotalRef = useRef<number>(0);

  // Calculate effective counts by subtracting cleared counts from server data
  const effectiveLeads = Math.max(0, (serverData?.leads || 0) - clearedCounts.leads);
  const effectiveApplications = Math.max(0, (serverData?.applications || 0) - clearedCounts.applications);
  const effectiveRegistrations = Math.max(0, (serverData?.registrations || 0) - clearedCounts.registrations);
  const effectiveTotal = effectiveLeads + effectiveApplications + effectiveRegistrations;

  const notifData = serverData ? {
    leads: effectiveLeads,
    applications: effectiveApplications,
    registrations: effectiveRegistrations,
    total: effectiveTotal
  } : null;

  // Trigger red badge ping animation ONLY when NEW notifications arrive
  useEffect(() => {
    if (effectiveTotal > prevEffectiveTotalRef.current) {
      setHasViewed(false);
    }
    prevEffectiveTotalRef.current = effectiveTotal;
  }, [effectiveTotal]);

  useEffect(() => {
    if (admin) {
      const fetchNotifications = async () => {
        try {
          const res = await api.get<ApiResponse<{ leads: number; applications: number; registrations: number; total: number }>>('/dashboard/notifications');
          const newData = res.data.data;

          setServerData(newData);

          // If database count is lower than cleared count (e.g., cleared on backend), reset cleared count
          setClearedCounts((prev) => {
            const updated = {
              leads: Math.min(prev.leads, newData.leads),
              applications: Math.min(prev.applications, newData.applications),
              registrations: Math.min(prev.registrations, newData.registrations),
            };
            if (typeof window !== 'undefined') {
              localStorage.setItem('admin_cleared_notifs', JSON.stringify(updated));
            }
            return updated;
          });
        } catch (e) {
          console.error('Failed to load notifications counts:', e);
        }
      };

      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [admin, pathname]);

  const handleNotifClick = (type: 'leads' | 'applications' | 'registrations') => {
    setDropdownOpen(false);
    if (!serverData) return;

    // Save cleared state locally & persist in localStorage
    const updatedCleared = {
      ...clearedCounts,
      [type]: serverData[type]
    };

    setClearedCounts(updatedCleared);
    if (typeof window !== 'undefined') {
      localStorage.setItem('admin_cleared_notifs', JSON.stringify(updatedCleared));
    }
  };

  const toggleDropdown = () => {
    if (!dropdownOpen) {
      setHasViewed(true);
    }
    setDropdownOpen((prev) => !prev);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  const pathSegments = pathname.split('/').filter(Boolean);
  const sectionName = pathSegments.length > 0
    ? pathSegments[pathSegments.length - 1].charAt(0).toUpperCase() + pathSegments[pathSegments.length - 1].slice(1)
    : 'Dashboard';

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background text-foreground transition-colors duration-300">
        <AppSidebar />

        <SidebarInset className="flex flex-col flex-1 overflow-hidden">
          <header className="sticky top-0 h-16 border-b border-border bg-background/80 backdrop-blur-md flex items-center justify-between px-6 z-20 shadow-sm shrink-0">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <div className="hidden md:flex items-center gap-1.5 text-xs font-semibold text-muted-foreground select-none">
                <span>Admin</span>
                <ChevronRight size={12} />
                <span className="text-foreground font-bold">{sectionName}</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <a
                href={process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:flex items-center gap-1.5 px-3.5 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-lg text-xs font-bold transition-all"
              >
                <Globe size={13} />
                <span>View Main Site</span>
              </a>

              <ThemeToggle />

              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={toggleDropdown}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400 transition relative cursor-pointer flex items-center justify-center"
                  aria-label="Toggle notifications"
                >
                  <Bell size={18} />
                  {!hasViewed && notifData && notifData.total > 0 && (
                    <>
                      <span className="absolute top-1.5 right-1.5 size-1.5 bg-red-500 rounded-full animate-ping" />
                      <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white font-black text-[9px] size-4 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 shadow">
                        {notifData.total}
                      </span>
                    </>
                  )}
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-4 z-50 space-y-3">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                        Notifications
                      </span>
                      {notifData && notifData.total > 0 && (
                        <span className="bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-extrabold text-[10px] px-2 py-0.5 rounded-full">
                          {notifData.total} Total
                        </span>
                      )}
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                      {!notifData || notifData.total === 0 ? (
                        <p className="text-center py-6 text-slate-400 dark:text-slate-500 italic">
                          No new notifications.
                        </p>
                      ) : (
                        <>
                          {notifData.leads > 0 && (
                            <Link 
                              href="/leads" 
                              onClick={() => handleNotifClick('leads')}
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
                              onClick={() => handleNotifClick('applications')}
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
                              onClick={() => handleNotifClick('registrations')}
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
                )}
              </div>

              <div className="h-6 w-px bg-border hidden md:block" />

              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2 p-1 rounded-full hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer">
                  <div className="size-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground border border-border">
                    <User size={15} />
                  </div>
                  <span className="text-xs font-bold text-foreground hidden sm:block">
                    {admin?.name || 'Operator'}
                  </span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 mt-2">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{admin?.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {admin?.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={(e) => {
                      e.preventDefault();
                      setShowLogoutAlert(true);
                    }}
                    className="text-red-600 focus:bg-red-50 focus:text-red-600 dark:focus:bg-red-950/50 dark:focus:text-red-500 cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-6 md:p-10">
            <div className="max-w-6xl mx-auto h-full">
              {children}
            </div>
          </main>
        </SidebarInset>
      </div>

      <ConfirmDialog
        isOpen={showLogoutAlert}
        onOpenChange={setShowLogoutAlert}
        title="Are you sure you want to sign out?"
        description="You will be redirected to the login page and will need to enter your credentials to access the admin panel again."
        confirmText="Yes, Sign Out"
        onConfirm={logout}
        icon="logout"
      />

    </SidebarProvider>
  );
};