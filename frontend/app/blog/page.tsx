import React from 'react';
import HeroSection from '@/components/blog/HeroSection';
import BlogContent from '@/components/blog/BlogContent';
import TickerBar from '@/components/blog/TickerBar';
import NewsletterSection from '@/components/blog/NewsletterSection';

export default function BlogPage() {
  return (
    <div className="font-sans text-gray-800 antialiased bg-white">
      {/* TopBar & MainNav placeholders */}
      
      <HeroSection />
      <BlogContent />
      <TickerBar />
      <NewsletterSection />
      
      {/* Footer placeholder */}
    </div>
  );
}
