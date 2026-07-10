import React from 'react';

const HeroSection = () => {
  return (
    <section className="relative bg-brand-dark py-24" data-purpose="page-hero">
      <div 
        className="absolute inset-0 bg-cover bg-center" 
        style={{
          backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBarv2-VCzk4iLsFGpIuIFSW-ElfzSdPziu2QbT1TnpBXjmKC0qnFCILtBxqVaFV22l3cr4d_nLOrU5yAOo8gyG1myaECmL2r96sBLhYSitmzuTxhyal1kOR0IC6w2ESO2xPkxWufvfv7jjOUEHdF0RcHj6dlM6aio7BfOAL4lohntJmBi6_h-GMU-IiUALymnDwrIIyU1BUTAhqR3iLz4Xjbp0hwLMqTNTJNMTq0Y-IIeFhm62KLIz2U3RvgSCQLFd-w4')",
          opacity: 0.3
        }}
      />
      <div className="absolute inset-0 hero-overlay" />
      <div className="container mx-auto px-4 relative z-10 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Blogs</h1>
        <div className="flex items-center justify-center text-sm text-gray-300 space-x-2">
          <a className="hover:text-white transition" href="#">Home</a>
          <span>/</span>
          <span className="text-white font-medium">Blogs</span>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
