import React from 'react';

const NewsletterSection = () => {
  return (
    <section className="py-20 bg-white text-center" data-purpose="newsletter-signup">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="flex items-center justify-center text-gray-500 text-sm font-medium mb-4">
          <span className="w-8 h-[2px] bg-brand-blue mr-3" />
          Our Newsletter
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-10 leading-tight">
          Subscribe <span className="text-brand-blue">For Expert IT<br/>Tips And Social Offer</span>
        </h2>
        <form className="flex flex-col sm:flex-row max-w-lg mx-auto gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <input 
              className="w-full pl-12 pr-4 py-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent" 
              placeholder="Enter Your Email" 
              required 
              type="email" 
            />
          </div>
          <button 
            className="bg-brand-blue hover:bg-blue-600 text-white font-medium px-8 py-4 rounded-full shadow-lg transition whitespace-nowrap" 
            type="submit"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
};

export default NewsletterSection;
