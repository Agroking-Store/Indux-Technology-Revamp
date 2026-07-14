'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { getEvents, Event } from '@/lib/api';
import { Calendar, MapPin, Search, ArrowRight, Clock, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// High-quality fallback event image URLs
const fallbackEventImages = [
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1591115765373-5209768f73e7?auto=format&fit=crop&w=800&q=80',
];

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'Upcoming' | 'Past'>('Upcoming');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    getEvents()
      .then(setEvents)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Filter only Published events
  const publishedEvents = useMemo(() => events.filter((e) => e.status === 'Published'), [events]);

  // Separate upcoming and past based on current date
  const categorizedEvents = useMemo(() => {
    const now = new Date();
    return publishedEvents.reduce(
      (acc, event) => {
        const eventDate = new Date(event.startDate || event.date || '');
        if (eventDate >= now) {
          acc.upcoming.push(event);
        } else {
          acc.past.push(event);
        }
        return acc;
      },
      { upcoming: [] as Event[], past: [] as Event[] }
    );
  }, [publishedEvents]);

  // Apply search query to the selected tab list
  const filteredEvents = useMemo(() => {
    const list = activeTab === 'Upcoming' ? categorizedEvents.upcoming : categorizedEvents.past;
    
    // Sort upcoming events closest-first, past events recent-first
    const sorted = [...list].sort((a, b) => {
      const dateA = new Date(a.startDate || a.date || '').getTime();
      const dateB = new Date(b.startDate || b.date || '').getTime();
      return activeTab === 'Upcoming' ? dateA - dateB : dateB - dateA;
    });

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return sorted.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.location.toLowerCase().includes(q) ||
          (e.shortDescription || e.description || '').toLowerCase().includes(q)
      );
    }

    return sorted;
  }, [categorizedEvents, activeTab, searchQuery]);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <main className="flex-1">
        {/* ===== HERO SECTION ===== */}
        <section className="relative overflow-hidden pt-16 pb-20 lg:pt-20 lg:pb-28">
          <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full h-full opacity-40 dark:opacity-20 pointer-events-none bg-[radial-gradient(#cbd5e1_2px,transparent_2px)] dark:bg-[radial-gradient(#334155_2px,transparent_2px)] bg-[size:32px_32px]"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="flex flex-col gap-4 text-left max-w-xl"
              >
                <div className="text-blue-600 dark:text-blue-500 font-bold tracking-wider text-xs sm:text-sm uppercase flex items-center gap-2">
                  <Sparkles className="size-4 text-blue-500 animate-pulse" />
                  Events & Community
                </div>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
                  Indux Tech<br />
                  <span className="italic text-slate-600 dark:text-slate-400 font-serif font-light">Meetups.</span>
                </h1>
                <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed mt-2">
                  Join our conferences, developer hackathons, community webinars, and corporate showcases. Engage with experts and build the future together.
                </p>
              </motion.div>

              {/* Search Bar */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                className="relative max-w-md w-full lg:ml-auto"
              >
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                </div>
                <input
                  type="text"
                  placeholder="Search events by title, venue, or details..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-11 pr-4 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-500 transition-all text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 shadow-md dark:shadow-none"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* ===== TABS SECTION ===== */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-6">
          <div className="flex border-b border-slate-200 dark:border-slate-800 pb-4 justify-between items-center">
            <div className="flex gap-4">
              <button
                onClick={() => setActiveTab('Upcoming')}
                className={`relative px-4 py-2 text-sm font-bold transition-all cursor-pointer ${
                  activeTab === 'Upcoming' ? 'text-blue-650 dark:text-blue-500 font-extrabold' : 'text-slate-500 hover:text-slate-950 dark:hover:text-white'
                }`}
              >
                Upcoming Events ({categorizedEvents.upcoming.length})
                {activeTab === 'Upcoming' && (
                  <motion.span
                    layoutId="activeTabUnderline"
                    className="absolute bottom-[-17px] left-0 w-full h-[3px] bg-blue-600 dark:bg-blue-500 rounded-full"
                  />
                )}
              </button>

              <button
                onClick={() => setActiveTab('Past')}
                className={`relative px-4 py-2 text-sm font-bold transition-all cursor-pointer ${
                  activeTab === 'Past' ? 'text-blue-650 dark:text-blue-500 font-extrabold' : 'text-slate-500 hover:text-slate-950 dark:hover:text-white'
                }`}
              >
                Past Events ({categorizedEvents.past.length})
                {activeTab === 'Past' && (
                  <motion.span
                    layoutId="activeTabUnderline"
                    className="absolute bottom-[-17px] left-0 w-full h-[3px] bg-blue-600 dark:bg-blue-500 rounded-full"
                  />
                )}
              </button>
            </div>
          </div>
        </section>

        {/* ===== EVENTS LIST GRID ===== */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredEvents.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 text-slate-500"
            >
              <Calendar className="size-16 mx-auto mb-4 opacity-30 text-slate-400" />
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">No Events Found</h3>
              <p className="mt-1 text-sm text-slate-450 dark:text-slate-400">There are no events matching your criteria at this moment.</p>
            </motion.div>
          ) : (
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              <AnimatePresence mode="popLayout">
                {filteredEvents.map((event, idx) => {
                  const fallbackImg = fallbackEventImages[idx % fallbackEventImages.length];
                  return (
                    <Link href={`/events/${event.slug}`} key={event._id}>
                      <motion.div
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.5 }}
                        className="group flex flex-col justify-between overflow-hidden bg-white dark:bg-slate-900/60 rounded-3xl border border-slate-200/60 dark:border-slate-800 hover:shadow-xl dark:hover:shadow-none hover:border-blue-500/30 dark:hover:border-blue-500/20 transition-all duration-300 min-h-[460px] cursor-pointer"
                      >
                        {/* Image & Type Badge */}
                        <div className="relative h-56 overflow-hidden">
                          <img
                            src={event.coverImage || event.image || fallbackImg}
                            alt={event.title}
                            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent"></div>
                          
                          {/* Date Badge */}
                          <div className="absolute top-4 left-4 bg-blue-600 dark:bg-blue-500 text-white font-bold px-3 py-1.5 rounded-full text-xs flex items-center gap-1.5 shadow-md">
                            <Calendar className="size-3.5" />
                            {formatDate(event.startDate || event.date || '')}
                          </div>

                          {/* Event Type Badge */}
                          <div className="absolute bottom-4 left-4 bg-slate-950/60 backdrop-blur-md text-white border border-white/10 font-semibold px-2.5 py-1 rounded-lg text-[10px] tracking-wider uppercase">
                            {event.type || 'Workshop'}
                          </div>
                        </div>

                        {/* Content Card Body */}
                        <div className="p-6 flex-grow flex flex-col justify-between">
                          <div>
                            {/* Location & Time Row */}
                            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-3">
                              <span className="flex items-center gap-1">
                                <MapPin className="size-3.5 text-blue-500" />
                                {event.location}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="size-3.5 text-blue-500" />
                                {formatTime(event.startDate || event.date || '')}
                              </span>
                            </div>

                            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                              {event.title}
                            </h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mt-3 leading-relaxed line-clamp-3">
                              {event.shortDescription || event.description}
                            </p>
                          </div>

                          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-blue-600 dark:text-blue-400 font-bold text-sm">
                            <span>Register / RSVP</span>
                            <ArrowRight className="size-4 group-hover:translate-x-1.5 transition-transform" />
                          </div>
                        </div>
                      </motion.div>
                    </Link>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          )}
        </section>
      </main>
    </div>
  );
}
