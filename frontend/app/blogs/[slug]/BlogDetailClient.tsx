'use client';

import { useState } from 'react';
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
  const [isExpanded, setIsExpanded] = useState(false);

  const CONTENT_LIMIT = 1500; // Show enough text before truncating
  const isLongContent = blog.content && blog.content.length > CONTENT_LIMIT;
  const displayedContent = (!isExpanded && isLongContent) 
      ? blog.content.slice(0, CONTENT_LIMIT) + '...' 
      : blog.content;

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 font-sans transition-colors duration-300">
      
      {/* Top Navigation */}
      <div className="max-w-6xl mx-auto w-full px-6 pt-12 pb-6">
        <button
          onClick={() => router.push('/blogs')}
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Blog Feed
        </button>
      </div>

      <main className="flex-grow max-w-6xl mx-auto w-full px-6 pb-24 relative z-10">
        
        {/* Immersive Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative w-full h-[60vh] min-h-[450px] max-h-[600px] rounded-[2.5rem] overflow-hidden shadow-2xl mb-16 group"
        >
          <img
            src={blog.featuredImage}
            alt={blog.title}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
          
          <div className="absolute inset-0 p-8 md:p-12 lg:p-16 flex flex-col justify-end">
            <div className="flex gap-3 mb-6">
              <span className="inline-flex items-center text-xs uppercase tracking-widest font-extrabold bg-blue-600 text-white px-4 py-1.5 rounded-full shadow-lg">
                {blog.category}
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-8 max-w-4xl drop-shadow-lg">
              {blog.title}
            </h1>
            
            {/* Meta Row on Hero */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-300 font-medium">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-slate-800 border-2 border-slate-600 flex items-center justify-center text-white font-bold text-lg shadow-inner">
                  {blog.author.charAt(0)}
                </div>
                <div className="flex flex-col">
                  <span className="text-white font-bold text-base">{blog.author}</span>
                  <span className="text-xs text-slate-400">Indux Contributor</span>
                </div>
              </div>
              
              <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-slate-500" />
              
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-400" /> {formatDate(blog.createdAt)}
              </span>
              
              <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-slate-500" />
              
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-400" /> {getReadingTime(blog.content)}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Content Section */}
        <div className="w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Short description / Intro paragraph */}
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 font-medium leading-relaxed mb-12 border-l-4 border-blue-600 pl-6 italic">
              {blog.shortDescription}
            </p>

            {/* Main Content Body */}
            <div className={`text-lg text-slate-700 dark:text-slate-300 leading-loose whitespace-pre-line mb-16 relative ${!isExpanded && isLongContent ? 'pb-24 overflow-hidden' : ''}`}>
              {displayedContent}

              {!isExpanded && isLongContent && (
                <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-white dark:from-slate-950 via-white/80 dark:via-slate-950/80 to-transparent flex items-end justify-center pb-4">
                  <button
                    onClick={() => setIsExpanded(true)}
                    className="bg-slate-50 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700/80 text-sm font-semibold py-2 px-6 rounded-full transition-colors cursor-pointer shadow-sm backdrop-blur-sm"
                  >
                    Read More
                  </button>
                </div>
              )}
            </div>
          </motion.div>

          {/* Footer: Tags & Share */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-8 py-8 border-t border-slate-200 dark:border-slate-800"
          >
            {blog.tags && blog.tags.length > 0 ? (
              <div className="flex flex-col gap-3">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Tag className="w-4 h-4" /> Tags
                </h4>
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="text-sm font-semibold px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-900/50 text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-colors border border-transparent dark:border-slate-800"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            ) : <div />}

            <div className="flex flex-col gap-3 sm:items-end">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest hidden sm:block">
                Share this article
              </h4>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Article link copied to clipboard!');
                }}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 px-6 py-3 text-sm font-bold text-slate-700 dark:text-slate-300 transition-all shadow-sm cursor-pointer"
              >
                <Share2 className="w-4 h-4 text-blue-500" /> Copy Link
              </button>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
