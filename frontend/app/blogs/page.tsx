'use client';

import { useEffect, useMemo, useState } from 'react';
import { getBlogs, Blog } from '@/lib/api';
import Link from 'next/link';
import { Calendar, User, ArrowRight, Newspaper, Search, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

// Fallback high-quality internet image URLs
const fallbackImages = [
  '/images/unsplash/img-3be447cf.webp', // MacBook with code
  '/images/unsplash/img-0f36d5cf.webp', // Tech server room
  '/images/unsplash/img-8f08504f.webp', // Laptop workspace
];

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
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <main className="flex-1">
        {/* ===== HERO SECTION ===== */}
        <section className="relative overflow-hidden pt-16 pb-20 lg:pt-20 lg:pb-28">
          {/* Subtle dot pattern background */}
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
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                  Technical Articles
                </div>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
                  Our Blog &<br />
                  <span className="italic text-slate-600 dark:text-slate-400 font-serif">Insights.</span>
                </h1>
                <p className="text-lg text-slate-505 dark:text-slate-400 leading-relaxed mt-2">
                  Stay updated with corporate announcements, technical guides, cloud updates, and modern engineering practices from the Indux team.
                </p>
              </motion.div>

              {/* Interactive Search Bar */}
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
                  placeholder="Search articles by title or keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-11 pr-4 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-500 transition-all text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 shadow-md dark:shadow-none"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* ===== CATEGORY PILLS ===== */}
        {!loading && categories.length > 1 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-6">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-wrap gap-2.5 pb-6 border-b border-slate-200 dark:border-slate-800"
            >
              {categories.map((cat) => {
                const count = cat === 'All' 
                  ? publishedBlogs.length 
                  : publishedBlogs.filter(b => b.category === cat).length;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className="text-xs font-semibold px-5 py-2.5 rounded-full border transition-all duration-300 flex items-center gap-2 cursor-pointer hover:scale-103"
                    style={{
                      backgroundColor: activeCategory === cat ? '#2563eb' : 'transparent',
                      color: activeCategory === cat ? '#ffffff' : 'inherit',
                      borderColor: activeCategory === cat ? '#2563eb' : 'currentColor',
                      opacity: activeCategory === cat ? 1 : 0.6
                    }}
                  >
                    <span>{cat}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300" style={{
                      backgroundColor: activeCategory === cat ? 'rgba(255,255,255,0.2)' : undefined,
                      color: activeCategory === cat ? '#ffffff' : undefined
                    }}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </motion.div>
          </section>
        )}

        {/* ===== ARTICLES LIST ===== */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 pt-6">
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-[2rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden animate-pulse">
                  <div className="h-48 bg-slate-100 dark:bg-slate-800" />
                  <div className="p-6">
                    <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-1/3 mb-3" />
                    <div className="h-5 bg-slate-100 dark:bg-slate-800 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredBlogs.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 rounded-[2rem] border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
            >
              <Newspaper className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-850 dark:text-slate-200">
                No matching articles found
              </h3>
              <p className="text-slate-500 text-sm mt-1">Clear your search parameters or select another category.</p>
            </motion.div>
          ) : (
            <>
              {/* Featured Post (Highlighted side-by-side design) */}
              {featured && !searchQuery && activeCategory === 'All' && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <Link
                    href={`/blogs/${featured.slug}`}
                    className="group grid grid-cols-1 lg:grid-cols-12 gap-0 rounded-[2rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-xl dark:shadow-none transition-all duration-350 mb-12"
                  >
                    <div className="lg:col-span-7 overflow-hidden min-h-[300px] relative bg-slate-100 dark:bg-slate-850">
                      <img
                        src={featured.featuredImage || fallbackImages[0]}
                        alt={featured.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
                      />
                    </div>
                    <div className="lg:col-span-5 p-8 sm:p-10 flex flex-col justify-center">
                      <span className="inline-flex w-fit items-center text-[10px] uppercase tracking-wider font-bold bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 px-3 py-1 rounded mb-4">
                        {featured.category}
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3 leading-snug group-hover:text-blue-600 transition-colors">
                        {featured.title}
                      </h2>
                      <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6 line-clamp-3">
                        {featured.shortDescription}
                      </p>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 mb-6 pb-6 border-b border-slate-100 dark:border-slate-800">
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
                      <span className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 dark:text-blue-400 group-hover:gap-2.5 transition-all w-fit">
                        Read Full Article <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              )}

              {/* Standard Posts Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {(searchQuery || activeCategory !== 'All' ? filteredBlogs : rest).map((blog, i) => (
                  <motion.div
                    key={blog._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
                  >
                    <Link
                      href={`/blogs/${blog.slug}`}
                      className="group flex flex-col rounded-[2rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-lg transition-all duration-300 h-full"
                    >
                      <div className="overflow-hidden h-48 relative bg-slate-100 dark:bg-slate-850">
                        <img
                          src={blog.featuredImage || fallbackImages[i % fallbackImages.length]}
                          alt={blog.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
                        />
                      </div>
                      <div className="p-6 flex flex-col flex-1">
                        <span className="inline-flex text-[10px] uppercase tracking-wider font-bold bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 px-2.5 py-1 rounded mb-3.5 w-fit">
                          {blog.category}
                        </span>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors leading-snug">
                          {blog.title}
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6 line-clamp-2">
                          {blog.shortDescription}
                        </p>
                        
                        <div className="flex items-center justify-between pt-4 mt-auto border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400">
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
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </section>

        {/* ===== NEWSLETTER BANNER (Solid Deep Blue Theme) ===== */}
        <section className="bg-[#0f2e4a] dark:bg-slate-900 w-full py-16 md:py-20 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:30px_30px]" />
          
          <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-blue-300 mb-3">
                // Newsletter Subscription
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
                Get the latest updates in your inbox.
              </h2>
              <p className="text-blue-100/70 text-sm leading-relaxed mt-3 mb-8 max-w-md mx-auto">
                Subscribe to stay up-to-date with our regular publications, developer tips, and technology deep-dives.
              </p>

              {subscribed ? (
                <div className="bg-blue-900/30 border border-blue-500/20 rounded-full py-3.5 px-8 max-w-md mx-auto">
                  <p className="text-blue-300 font-semibold text-sm">
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
                    className="flex-1 rounded-full border border-blue-800/60 bg-blue-950/40 px-6 py-4 text-sm text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-all"
                  />
                  <Button
                    type="submit"
                    className="rounded-full bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 font-bold tracking-wider text-xs uppercase transition-all shadow-lg shadow-blue-700/20 active:scale-95"
                  >
                    Subscribe
                  </Button>
                </form>
              )}
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
}