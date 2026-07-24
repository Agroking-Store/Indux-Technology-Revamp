'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Blog } from '@/lib/api';
import Image from 'next/image';
import { ArrowLeft, Calendar, User, Clock, Tag, Share2, Search, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

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

/**
 * Converts Markdown/HTML body plain strings into fully formatted rich text markup.
 */
function renderRichContent(content: string) {
  if (!content) return "";

  // If content contains standard HTML tags, return it raw
  if (/<[a-z][\s\S]*>/i.test(content)) {
    return content;
  }

  // Otherwise, run lightweight regex conversions for Markdown
  let html = content;

  // Escape HTML entities to prevent XSS issues while parsing plain Markdown
  html = html
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Headers:
  // ### Title -> <h3>Title</h3>
  html = html.replace(/^### (.*?)$/gm, '<h3 class="text-lg sm:text-xl font-black text-slate-900 dark:text-white mt-6 mb-3 leading-snug">$1</h3>');
  // ## Title -> <h2>Title</h2>
  html = html.replace(/^## (.*?)$/gm, '<h2 class="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-8 mb-4 border-b border-slate-100 dark:border-slate-800 pb-2 leading-snug">$1</h2>');
  // # Title -> <h1>Title</h1>
  html = html.replace(/^# (.*?)$/gm, '<h1 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-10 mb-4 leading-tight">$1</h1>');

  // Bold: **text** -> <strong>text</strong>
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-extrabold text-slate-900 dark:text-white">$1</strong>');

  // Italic: *text* -> <em>text</em>
  html = html.replace(/\*(.*?)\*/g, '<em class="italic text-slate-800 dark:text-slate-200">$1</em>');

  // Code Blocks: ```code``` -> <pre><code>code</code></pre>
  html = html.replace(/```([\s\S]*?)```/g, '<pre class="bg-slate-105 dark:bg-slate-900 border dark:border-slate-800 p-4 rounded-2xl font-mono text-xs overflow-x-auto my-6 text-slate-850 dark:text-slate-200"><code>$1</code></pre>');

  // Inline Code: `code` -> <code>code</code>
  html = html.replace(/`(.*?)`/g, '<code class="bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 px-1.5 py-0.5 rounded-lg font-mono text-xs text-indigo-600 dark:text-indigo-400 font-bold">$1</code>');

  // Blockquotes: > text -> <blockquote>text</blockquote>
  html = html.replace(/^> (.*?)$/gm, '<blockquote class="border-l-4 border-blue-600 bg-slate-50 dark:bg-slate-900/40 p-5 rounded-r-2xl italic my-6 text-slate-700 dark:text-slate-350 font-medium pl-6 text-left">$1</blockquote>');

  // Bullet Lists: - item or * item -> <li>item</li>
  html = html.replace(/^\s*[-*]\s+(.*?)$/gm, '<li class="list-disc ml-6 mb-2 text-slate-700 dark:text-slate-300">$1</li>');

  // Numeric Lists: 1. item -> <li>item</li>
  html = html.replace(/^\s*\d+\.\s+(.*?)$/gm, '<li class="list-decimal ml-6 mb-2 text-slate-700 dark:text-slate-300">$1</li>');

  // Paragraphs
  const blocks = html.split(/\n\s*\n/);
  const blockElements = ['<h1', '<h2', '<h3', '<blockquote', '<pre', '<li', '<ul', '<ol'];

  const parsedBlocks = blocks.map(block => {
    const trimmed = block.trim();
    if (!trimmed) return "";
    if (blockElements.some(el => trimmed.startsWith(el))) {
      return trimmed;
    }
    return `<p class="mb-5 leading-relaxed text-slate-700 dark:text-slate-300 text-sm sm:text-base">${trimmed.replace(/\n/g, '<br />')}</p>`;
  });

  return parsedBlocks.filter(Boolean).join('\n');
}

interface BlogDetailClientProps {
  blog: Blog;
  relatedBlogs?: Blog[];
}

export default function BlogDetailClient({ blog, relatedBlogs = [] }: BlogDetailClientProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      
      {/* Solor Theme Inspired: Premium Breadcrumb & Page Title Header Banner */}
      <div className="relative w-full py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden border-b border-slate-900/50">
        {/* Subtle grid/dot decorative backgrounds */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-left">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs sm:text-sm text-slate-400 font-medium mb-6">
            <button 
              onClick={() => router.push('/')}
              className="hover:text-blue-400 transition-colors cursor-pointer"
            >
              Home
            </button>
            <span className="text-slate-600">/</span>
            <button 
              onClick={() => router.push('/blogs')}
              className="hover:text-blue-400 transition-colors cursor-pointer"
            >
              Blog
            </button>
            <span className="text-slate-600">/</span>
            <span className="text-slate-200 line-clamp-1">{blog.title}</span>
          </nav>

          {/* Category Badge */}
          <span className="inline-flex items-center text-[10px] sm:text-xs uppercase tracking-widest font-extrabold bg-blue-600/10 dark:bg-blue-500/10 text-blue-450 dark:text-blue-400 border border-blue-500/20 px-3.5 py-1.5 rounded-full mb-6">
            {blog.category}
          </span>

          {/* Blog Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-[1.15] tracking-tight mb-8 max-w-4xl">
            {blog.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-xs sm:text-sm text-slate-400 border-t border-slate-900/60 pt-6">
            <span className="inline-flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 text-xs font-extrabold uppercase">
                {blog.author.charAt(0)}
              </span>
              <span className="font-bold text-slate-200">By {blog.author}</span>
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-800" />
            <span className="inline-flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-400/80" />
              {formatDate(blog.createdAt)}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-800" />
            <span className="inline-flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-400/80" />
              {getReadingTime(blog.content)}
            </span>
          </div>
        </div>
      </div>

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        
        {/* Back Navigation */}
        <button
          onClick={() => router.push('/blogs')}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 mb-8 transition-colors group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Blog Feed
        </button>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Main Article content (8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200/80 dark:border-slate-800/80 p-6 sm:p-10 shadow-sm overflow-hidden flex flex-col gap-8"
            >
              
              {/* Featured Image with shine overlay on hover */}
              <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200/50 dark:border-slate-800 group cursor-pointer">
                <Image
                  src={blog.featuredImage}
                  alt={blog.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  unoptimized={typeof blog.featuredImage === 'string' && blog.featuredImage.startsWith('data:')}
                  className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-105"
                />
                {/* Swipe shine transition */}
                <div className="absolute top-0 -left-full w-[50%] h-full bg-gradient-to-r from-transparent via-white/25 to-transparent -skew-x-[25deg] pointer-events-none group-hover:animate-shine" />
              </div>

              {/* Short description Intro */}
              <div className="border-l-4 border-blue-600 pl-5 text-left">
                <p className="text-base sm:text-lg text-slate-800 dark:text-slate-200 font-semibold leading-relaxed">
                  {blog.shortDescription}
                </p>
              </div>

              {/* Rich Body Content */}
              <div 
                className="text-left select-text max-w-none text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed space-y-6 blog-body"
                dangerouslySetInnerHTML={{ __html: renderRichContent(blog.content) }}
              />

              {/* Tags Section */}
              {blog.tags && blog.tags.length > 0 && (
                <div className="pt-8 border-t border-slate-100 dark:border-slate-800/60 text-left">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-blue-500" /> Tags
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {blog.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="text-xs font-bold px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-blue-50 dark:hover:bg-blue-950/20 text-slate-655 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all border border-slate-100 dark:border-slate-850/40 cursor-pointer"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Right Column: Sidebar (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-6 sticky top-28">
            
            {/* Widget 1: Search Bar Widget */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-5 shadow-sm text-left"
            >
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search articles..."
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500 dark:text-slate-200"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </motion.div>

            {/* Widget 2: Author Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-6 shadow-sm text-left flex flex-col gap-4"
            >
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800/60 pb-3">
                About The Author
              </h3>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 font-black text-xl shadow-inner">
                  {blog.author.charAt(0)}
                </div>
                <div>
                  <h4 className="text-base font-black text-slate-900 dark:text-white leading-tight">
                    {blog.author}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 font-medium">
                    Indux Contributor
                  </p>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-slate-555 dark:text-slate-400 leading-relaxed font-sans">
                Expert in modern software development, business automation, and data security. Sharing insights to help businesses grow in 2026.
              </p>
            </motion.div>

            {/* Widget 3: Recent Articles Widget */}
            {relatedBlogs.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-6 shadow-sm text-left flex flex-col gap-4"
              >
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800/60 pb-3">
                  Recent Articles
                </h3>
                <div className="flex flex-col gap-4">
                  {relatedBlogs.slice(0, 3).map((item) => (
                    <div 
                      key={item._id}
                      onClick={() => router.push(`/blogs/${item.slug}`)}
                      className="flex gap-3 group cursor-pointer items-start"
                    >
                      {/* Mini image with hover shine & zoom */}
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/80 flex-shrink-0">
                        <Image 
                          src={item.featuredImage} 
                          alt={item.title}
                          fill
                          sizes="64px"
                          unoptimized={typeof item.featuredImage === 'string' && item.featuredImage.startsWith('data:')}
                          className="object-cover group-hover:scale-110 transition-transform duration-[800ms]"
                        />
                        <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-[25deg] pointer-events-none group-hover:animate-shine" />
                      </div>
                      <div className="flex flex-col gap-1 min-w-0">
                        <span className="text-[9px] font-extrabold uppercase text-blue-500 tracking-wider">
                          {item.category}
                        </span>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-500 transition-colors line-clamp-2 leading-snug">
                          {item.title}
                        </h4>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {formatDate(item.createdAt)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Widget 4: Categories Navigation List */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-6 shadow-sm text-left flex flex-col gap-4"
            >
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800/60 pb-3">
                Categories
              </h3>
              <div className="flex flex-col gap-2.5">
                {[
                  { name: 'Technology', count: 3 },
                  { name: 'ERP Systems', count: 1 },
                  { name: 'Business Automation', count: 2 },
                  { name: 'CRM Solutions', count: 1 },
                ].map((cat, i) => (
                  <div
                    key={i}
                    onClick={() => router.push('/blogs')}
                    className="flex justify-between items-center text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors cursor-pointer group"
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 group-hover:bg-blue-500 transition-colors" />
                      {cat.name}
                    </span>
                    <span className="text-[10px] bg-slate-50 dark:bg-slate-800/80 text-slate-400 dark:text-slate-500 px-2.5 py-0.5 rounded-md border border-slate-100 dark:border-slate-850 group-hover:bg-blue-50 dark:group-hover:bg-blue-950/20 group-hover:text-blue-500 transition-all">
                      {cat.count}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Widget 5: Share Link Widget */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-6 shadow-sm text-left flex flex-col gap-4"
            >
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800/60 pb-3">
                Share This Post
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
                If you found this article helpful, share it with your network!
              </p>
              <button
                onClick={() => {
                   navigator.clipboard.writeText(window.location.href);
                   toast.success('Article link copied to clipboard!');
                }}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/15 py-3 text-xs font-bold text-slate-700 dark:text-slate-350 transition-all cursor-pointer shadow-sm active:scale-98"
              >
                <Share2 className="w-3.5 h-3.5 text-blue-500" /> Copy Shareable Link
              </button>
            </motion.div>

          </div>
        </div>

        {/* Recommended / Related Articles Section (Bottom) */}
        {relatedBlogs.length > 0 && (
          <div className="mt-16 pt-12 border-t border-slate-200 dark:border-slate-800 space-y-8">
            <div className="text-left space-y-1">
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">Read Next</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">More insights and articles from Indux contributors.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedBlogs.map((item) => (
                <div 
                  key={item._id}
                  onClick={() => router.push(`/blogs/${item.slug}`)}
                  className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-4 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col justify-between group text-left"
                >
                  <div className="space-y-4">
                    {/* Image with shine overlay on hover */}
                    <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/40">
                      <Image 
                        src={item.featuredImage} 
                        alt={item.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        unoptimized={typeof item.featuredImage === 'string' && item.featuredImage.startsWith('data:')}
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-[25deg] pointer-events-none group-hover:animate-shine" />
                    </div>
                    {/* Details */}
                    <div className="space-y-2 px-1">
                      <span className="text-[9px] uppercase font-extrabold text-blue-500 bg-blue-50 dark:bg-blue-950/40 px-2.5 py-1 rounded-full w-fit block">
                        {item.category}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-blue-500 transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {item.shortDescription}
                      </p>
                    </div>
                  </div>
                  {/* Meta */}
                  <div className="flex items-center justify-between border-t border-slate-50 dark:border-slate-800/40 mt-4 pt-3.5 px-1 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    <span>{formatDate(item.createdAt)}</span>
                    <span>{getReadingTime(item.content || "")}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
