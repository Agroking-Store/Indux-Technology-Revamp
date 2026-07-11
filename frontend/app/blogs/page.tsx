'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { getBlogs, Blog } from '@/lib/api';
import Link from 'next/link';
import { Calendar, User, ArrowRight, Newspaper, Search, Clock } from 'lucide-react';
import { Space_Grotesk, Inter, IBM_Plex_Mono } from 'next/font/google';

// Direct font imports
const displayFont = Space_Grotesk({ subsets: ['latin'], weight: ['500', '700'] });
const bodyFont = Inter({ subsets: ['latin'], weight: ['400', '500', '600'] });
const monoFont = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '500'] });

// Fallback high-quality internet image URLs
const fallbackImages = [
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80', // MacBook with code
  'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80', // Tech server room
  'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=800&q=80', // Laptop workspace
];

/* ---------- scroll-reveal helper ---------- */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return { ref, visible };
}

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      className="transition-all duration-700 ease-out"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function getReadingTime(content: string) {
  const words = content ? content.split(/\s+/).length : 0;
  const mins = Math.ceil(words / 200);
  return `${mins} min read`;
}

/* ---------- page ---------- */
export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    getBlogs()
      .then(setBlogs)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const publishedBlogs = useMemo(() => blogs.filter((b) => b.status === 'Published'), [blogs]);

  const categories = useMemo(() => {
    const unique = Array.from(new Set(publishedBlogs.map((b) => b.category).filter(Boolean)));
    return ['All', ...unique];
  }, [publishedBlogs]);

  const filteredBlogs = useMemo(() => {
    let result = publishedBlogs;

    if (activeCategory !== 'All') {
      result = result.filter((b) => b.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.shortDescription.toLowerCase().includes(q) ||
          b.category.toLowerCase().includes(q)
      );
    }

    return result;
  }, [publishedBlogs, activeCategory, searchQuery]);

  const [featured, ...rest] = filteredBlogs;

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail('');
  };

  return (
    <main className={`${bodyFont.className} bg-white min-h-screen relative`}>
      {/* ===== HERO (Stark Black Theme) ===== */}
      <section className="bg-[#0c0c0c] text-white relative py-20 sm:py-28 overflow-hidden">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:20px_30px]" />
        
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <Reveal>
              <p className={`${monoFont.className} text-[10px] tracking-[0.25em] uppercase text-blue-500 mb-3`}>
                // Technical Articles
              </p>
              <h1 className={`${displayFont.className} text-4xl sm:text-6xl font-medium text-white tracking-tight leading-none`}>
                Our Blog & <span className="text-blue-500">Insights.</span>
              </h1>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed mt-4 max-w-lg font-normal">
                Stay updated with corporate announcements, technical guides, cloud updates, and modern engineering practices from the Indux team.
              </p>
            </Reveal>

            {/* Interactive Search Bar */}
            <Reveal delay={150}>
              <div className="relative max-w-md w-full md:ml-auto">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  type="text"
                  placeholder="Search articles by title or keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3.5 bg-black border border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-500 transition-all text-sm text-white placeholder-slate-500 shadow-xl"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ===== CATEGORY PILLS ===== */}
      {!loading && categories.length > 1 && (
        <section className="max-w-6xl mx-auto px-6 pt-12 pb-6">
          <Reveal>
            <div className="flex flex-wrap gap-2.5 pb-6 border-b border-slate-100">
              {categories.map((cat) => {
                const count = cat === 'All' 
                  ? publishedBlogs.length 
                  : publishedBlogs.filter(b => b.category === cat).length;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className="text-xs font-semibold px-4.5 py-2.5 rounded border transition-all duration-200 flex items-center gap-2"
                    style={{
                      backgroundColor: activeCategory === cat ? '#2563eb' : '#ffffff',
                      color: activeCategory === cat ? '#ffffff' : '#334155',
                      borderColor: activeCategory === cat ? '#2563eb' : '#cbd5e1'
                    }}
                  >
                    <span>{cat}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{
                      backgroundColor: activeCategory === cat ? 'rgba(255,255,255,0.2)' : '#f1f5f9',
                      color: activeCategory === cat ? '#ffffff' : '#64748b'
                    }}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </Reveal>
        </section>
      )}

      {/* ===== ARTICLES LIST ===== */}
      <section className="max-w-6xl mx-auto px-6 pb-24 pt-6">
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-xl border border-slate-200 bg-white overflow-hidden animate-pulse">
                <div className="h-48 bg-slate-100" />
                <div className="p-6">
                  <div className="h-4 bg-slate-100 rounded w-1/3 mb-3" />
                  <div className="h-5 bg-slate-100 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-slate-100 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredBlogs.length === 0 ? (
          <Reveal>
            <div className="text-center py-20 rounded-xl border border-dashed border-slate-200 bg-slate-50/50">
              <Newspaper className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className={`${displayFont.className} text-lg font-medium text-slate-800`}>
                No matching articles found
              </h3>
              <p className="text-slate-500 text-sm mt-1">Clear your search parameters or select another category.</p>
            </div>
          </Reveal>
        ) : (
          <>
            {/* Featured Post (Highlighted side-by-side design) */}
            {featured && !searchQuery && activeCategory === 'All' && (
              <Reveal>
                <Link
                  href={`/blogs/${featured.slug}`}
                  className="group grid md:grid-cols-12 gap-0 rounded-xl border border-slate-200 bg-white overflow-hidden hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 mb-12"
                >
                  <div className="md:col-span-7 overflow-hidden min-h-[280px] relative bg-slate-50">
                    <img
                      src={featured.featuredImage || fallbackImages[0]}
                      alt={featured.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
                    />
                  </div>
                  <div className="md:col-span-5 p-8 sm:p-10 flex flex-col justify-center bg-white">
                    <span className="inline-flex w-fit items-center text-[10px] uppercase tracking-wider font-bold bg-blue-50 text-blue-600 px-3 py-1 rounded mb-4">
                      {featured.category}
                    </span>
                    <h2 className={`${displayFont.className} text-2xl sm:text-3xl font-medium text-black mb-3 leading-snug group-hover:text-blue-600 transition-colors`}>
                      {featured.title}
                    </h2>
                    <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-3 font-normal">
                      {featured.shortDescription}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 mb-6 pb-6 border-b border-slate-100">
                      <span className="inline-flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        {featured.author}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {formatDate(featured.createdAt)}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {getReadingTime(featured.content)}
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 group-hover:gap-2.5 transition-all w-fit">
                      Read Full Article <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            )}

            {/* Standard Posts Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(searchQuery || activeCategory !== 'All' ? filteredBlogs : rest).map((blog, i) => (
                <Reveal key={blog._id} delay={(i % 3) * 100}>
                  <Link
                    href={`/blogs/${blog.slug}`}
                    className="group flex flex-col rounded-xl border border-slate-200 bg-white overflow-hidden hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300 h-full"
                  >
                    <div className="overflow-hidden h-48 relative bg-slate-50">
                      <img
                        src={blog.featuredImage || fallbackImages[i % fallbackImages.length]}
                        alt={blog.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
                      />
                    </div>
                    <div className="p-6 flex flex-col flex-1 bg-white">
                      <span className="inline-flex text-[10px] uppercase tracking-wider font-bold bg-blue-50 text-blue-600 px-2.5 py-1 rounded mb-3.5 w-fit">
                        {blog.category}
                      </span>
                      <h3 className={`${displayFont.className} text-lg font-medium text-black mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors leading-snug`}>
                        {blog.title}
                      </h3>
                      <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-2">
                        {blog.shortDescription}
                      </p>
                      
                      <div className="flex items-center justify-between pt-4 mt-auto border-t border-slate-100 text-xs text-slate-400">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDate(blog.createdAt)}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {getReadingTime(blog.content)}
                        </span>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </>
        )}
      </section>

      {/* ===== NEWSLETTER BANNER (Solid Black Theme) ===== */}
      <section className="bg-black text-white py-16 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:30px_30px]" />
        
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <Reveal>
            <p className={`${monoFont.className} text-[10px] tracking-[0.25em] uppercase text-blue-500 mb-3`}>
              // Newsletter Subscription
            </p>
            <h2 className={`${displayFont.className} text-3xl sm:text-4xl font-medium text-white tracking-tight`}>
              Get the latest updates in your inbox.
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed mt-3 mb-8 max-w-md mx-auto">
              Subscribe to stay up-to-date with our regular publications, developer tips, and technology deep-dives.
            </p>

            {subscribed ? (
              <div className="bg-blue-950/50 border border-blue-900/50 rounded-lg py-3 px-6 max-w-md mx-auto">
                <p className="text-blue-400 font-semibold text-sm">
                  ✓ Successfully subscribed! Thank you for joining.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubscribe}
                className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="flex-1 rounded border border-slate-800 bg-black px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-500 transition-all"
                />
                <button
                  type="submit"
                  className="rounded bg-blue-600 text-white text-sm font-semibold px-6 py-3 hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/10"
                >
                  Subscribe
                </button>
              </form>
            )}
          </Reveal>
        </div>
      </section>
    </main>
  );
}