'use client';

import { useRouter } from 'next/navigation';
import { Blog } from '@/lib/api';
import { ArrowLeft, Calendar, User, Clock, Tag, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function getReadingTime(content: string) {
  const words = content ? content.split(/\s+/).length : 0;
  const mins = Math.ceil(words / 200);
  return `${mins} min read`;
}

interface BlogDetailClientProps {
  blog: Blog;
}

export default function BlogDetailClient({ blog }: BlogDetailClientProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <main className="flex-grow max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        
        {/* Back Navigation */}
        <button
          onClick={() => router.push('/blogs')}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 mb-8 transition-colors group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Blog Feed
        </button>

        {/* Article Container */}
        <article className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Article Content */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-md overflow-hidden"
            >
              
              {/* Category Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="inline-flex items-center text-[10px] uppercase tracking-wider font-bold bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 px-3.5 py-1.5 rounded-full">
                  {blog.category}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.15] mb-6 font-sans">
                {blog.title}
              </h1>

              {/* Mobile Meta (Hidden on Desktop) */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500 dark:text-slate-400 border-y border-slate-100 dark:border-slate-800/60 py-4 mb-8 lg:hidden">
                <span className="inline-flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />
                  {blog.author}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {formatDate(blog.createdAt)}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {getReadingTime(blog.content)}
                </span>
              </div>

              {/* Featured Image Frame */}
              <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden mb-8 bg-slate-100 dark:bg-slate-800">
                <img
                  src={blog.featuredImage}
                  alt={blog.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>

              {/* Short description / Intro paragraph */}
              <p className="text-lg text-slate-600 dark:text-slate-350 font-medium leading-relaxed mb-8 border-l-4 border-blue-600 pl-4.5">
                {blog.shortDescription}
              </p>

              {/* Main Content Body */}
              <div className="text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed whitespace-pre-line space-y-6">
                {blog.content}
              </div>

              {/* Tags Section */}
              {blog.tags && blog.tags.length > 0 && (
                <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800/60">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-blue-500" /> Tags
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {blog.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-350 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            </motion.div>
          </div>

          {/* Right Column: Desktop Sidebar Meta (Fixed Sticky layout) */}
          <div className="lg:col-span-4 hidden lg:block sticky top-28">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 p-6.5 shadow-md flex flex-col gap-6"
            >
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3.5">Author</h4>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-sm">
                    {blog.author.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{blog.author}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">Indux Contributor</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800/60 pt-5">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Published</h4>
                <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 font-semibold">
                  <Calendar className="w-4 h-4 text-blue-500" />
                  {formatDate(blog.createdAt)}
                </div>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800/60 pt-5">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Reading Time</h4>
                <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 font-semibold">
                  <Clock className="w-4 h-4 text-blue-500" />
                  {getReadingTime(blog.content)}
                </div>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800/60 pt-5">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Share</h4>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Article link copied to clipboard!');
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50/10 py-3 text-xs font-bold text-slate-700 dark:text-slate-300 transition-all cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5 text-blue-500" /> Copy Link
                </button>
              </div>

            </motion.div>
          </div>

        </article>
      </main>
    </div>
  );
}
