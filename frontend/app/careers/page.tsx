'use client';

import { useEffect, useState } from 'react';
import { getCareers, Career } from '@/lib/api';
import Link from 'next/link';
import { Briefcase, MapPin, DollarSign, Users, ArrowRight, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { NumberTicker } from '@/components/ui/number-ticker';

const heroImage =
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=900&q=80'; // team meeting around a table

const galleryImages = [
  {
    src: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=600&q=80',
    alt: 'Team collaborating at a desk',
  },
  {
    src: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80',
    alt: 'Team celebrating a win together',
  },
  {
    src: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=600&q=80',
    alt: 'Handshake during an interview',
  },
  {
    src: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=600&q=80',
    alt: 'Casual team discussion',
  },
];

export default function CareersPage() {
  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCareers()
      .then(setCareers)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const activeCareers = careers.filter((c) => c.status === 'Active');

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <main className="flex-1">
        {/* ===== HERO SECTION ===== */}
        <section className="relative overflow-hidden pt-16 pb-20 lg:pt-20 lg:pb-28">
          {/* Subtle dot pattern background */}
          <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full h-full opacity-40 dark:opacity-20 pointer-events-none bg-[radial-gradient(#cbd5e1_2px,transparent_2px)] dark:bg-[radial-gradient(#334155_2px,transparent_2px)] bg-[size:32px_32px]"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="flex flex-col gap-4 text-left max-w-xl"
              >
                <div className="text-blue-600 dark:text-blue-500 font-bold tracking-wider text-xs sm:text-sm uppercase flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                  Open Opportunities
                </div>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
                  Join Our <span className="text-blue-500">Team.</span>
                </h1>
                <p className="text-lg text-slate-505 dark:text-slate-400 leading-relaxed mt-2">
                  Build your engineering career with industry professionals who care about robust software and helping clients scale their digital infrastructure.
                </p>
                <Button
                  asChild
                  className="mt-8 bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 rounded-full font-medium text-base transition-all hover:scale-105 cursor-pointer w-max flex items-center gap-2"
                >
                  <a href="#open-positions">
                    View Open Positions <ArrowRight className="w-4 h-4" />
                  </a>
                </Button>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                className="relative group max-w-lg md:ml-auto"
              >
                {/* Thick border-8 frame matching home page aesthetic */}
                <img
                  src={heroImage}
                  alt="Team collaborating in a meeting"
                  className="rounded-[2.5rem] w-full h-72 sm:h-96 object-cover border-8 border-white dark:border-slate-900 shadow-2xl transition-transform duration-500 group-hover:scale-[1.01]"
                />
                <span className="absolute -bottom-4 -left-4 flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full px-4.5 py-3 shadow-xl">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
                  </span>
                  <span className="font-mono text-[10px] text-slate-650 dark:text-slate-300 uppercase tracking-wider">
                    We are hiring
                  </span>
                </span>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ===== STATS BANNER (Solid Deep Blue Theme) ===== */}
        <section className="bg-[#0f2e4a] dark:bg-slate-900 w-full py-12 md:py-16 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-3 gap-8 md:divide-x divide-blue-800/40 dark:divide-slate-800"
            >
              {[
                { value: 1800, label: 'Trusted Clients', suffix: '+' },
                { value: 98, label: 'Retention Rate', suffix: '%' },
                { value: 24, label: 'Systems Monitoring', suffix: '/7' },
              ].map((stat, idx) => (
                <div key={idx} className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-4 md:px-8 first:pl-0 last:pr-0">
                  <div className="w-14 h-14 rounded-full border-[1.5px] border-blue-400/20 flex items-center justify-center bg-blue-800/10">
                    <Trophy className="w-6 h-6 text-blue-300 opacity-80" strokeWidth={1.5} />
                  </div>
                  <div className="text-center md:text-left">
                    <h3 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-1">
                      <NumberTicker value={stat.value} className="text-white" />{stat.suffix}
                    </h3>
                    <p className="text-blue-100/70 font-medium text-[11px] md:text-xs tracking-wider uppercase">
                      {stat.label}
                    </p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ===== TEAM GALLERY ===== */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <p className="text-blue-600 dark:text-blue-500 font-bold tracking-wider text-xs sm:text-sm uppercase flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                Corporate Culture
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">
                Meet the engineering team behind our work.
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base leading-relaxed max-w-md mb-6">
                A collaborative group of systems engineers, backend developers, and UX designers dedicated to solving complex corporate challenges.
              </p>
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  {['JD', 'AK', 'SM', 'RB'].map((initials) => (
                    <div
                      key={initials}
                      className="font-mono w-11 h-11 rounded-full bg-white dark:bg-slate-800 border border-slate-205 dark:border-slate-700 shadow-sm flex items-center justify-center text-xs font-bold text-slate-700 dark:text-slate-350"
                    >
                      {initials}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-slate-505 dark:text-slate-450 font-semibold">+ 20 team members globally</p>
              </div>
            </motion.div>
            <div className="grid grid-cols-2 gap-4">
              {galleryImages.map((img, i) => (
                <motion.div
                  key={img.src}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className={`overflow-hidden rounded-[2rem] border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 shadow-md ${i % 2 === 1 ? 'mt-6' : ''}`}
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="w-full h-40 sm:h-48 object-cover transition-transform duration-700 ease-out hover:scale-105"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== OPEN POSITIONS ===== */}
        <section id="open-positions" className="bg-white dark:bg-slate-900/30 border-t border-slate-200 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex items-center justify-between mb-12 flex-wrap gap-4 border-b border-slate-200 dark:border-slate-800 pb-6"
            >
              <div>
                <p className="text-blue-600 dark:text-blue-500 font-bold tracking-wider text-xs sm:text-sm uppercase flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  Current Roles
                </p>
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
                  Currently open positions
                </h2>
              </div>
              <span className="font-mono text-[10px] font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-full uppercase tracking-wider">
                {activeCareers.length} openings available
              </span>
            </motion.div>

            {loading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="rounded-[2rem] border border-slate-205 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 animate-pulse">
                    <div className="h-5 bg-slate-100 dark:bg-slate-800 rounded w-3/4 mb-3" />
                    <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-1/2 mb-5" />
                    <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-full mb-2" />
                    <div className="h-8 bg-slate-100 dark:bg-slate-800 rounded w-24" />
                  </div>
                ))}
              </div>
            ) : activeCareers.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20 rounded-[2rem] border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
              >
                <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-850 dark:text-slate-200">
                  No open positions right now
                </h3>
                <p className="text-slate-500 text-sm mt-1">Check back later or register for notifications.</p>
              </motion.div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeCareers.map((job, i) => (
                  <motion.div
                    key={job._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
                  >
                    <div className="group flex flex-col rounded-[2rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 hover:border-blue-500 dark:hover:border-blue-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-500 ease-out h-full">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 group-hover:text-blue-600 transition-colors duration-300 leading-snug">
                        {job.title}
                      </h3>
                      <p className="font-mono text-[10px] text-slate-505 dark:text-slate-450 mb-4 uppercase tracking-wider">
                        {job.department}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full transition-transform duration-300 hover:scale-105">
                          <Briefcase className="w-3 h-3" />
                          {job.employmentType}
                        </span>
                        {job.location && (
                          <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-650 dark:text-slate-400 px-3 py-1 rounded-full transition-transform duration-300 hover:scale-105">
                            <MapPin className="w-3 h-3" />
                            {job.location}
                          </span>
                        )}
                        {job.salary && (
                          <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-650 dark:text-slate-400 px-3 py-1 rounded-full transition-transform duration-300 hover:scale-105">
                            <DollarSign className="w-3 h-3" />
                            {job.salary}
                          </span>
                        )}
                      </div>

                      <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6 line-clamp-3">
                        {job.description}
                      </p>

                      <div className="flex items-center justify-between pt-4 mt-auto border-t border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                          <Users className="w-4 h-4" />
                          <span>
                            {job.openings} opening{job.openings > 1 && 's'}
                          </span>
                        </div>
                        <Link
                          href={`/careers/${job._id}`}
                          className="group/btn inline-flex items-center justify-center gap-1.5 px-5 py-2.5 text-xs font-bold text-blue-600 border border-blue-600 rounded-full bg-transparent hover:bg-blue-600 hover:text-white hover:shadow-lg hover:shadow-blue-600/20 active:scale-[0.96] transition-all duration-300"
                        >
                          <span>Apply Now</span> 
                          <ArrowRight className="w-3.5 h-3.5 transform group-hover/btn:translate-x-1 transition-transform duration-300" />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ===== CTA BANNER (Solid Deep Blue Theme) ===== */}
        <section className="bg-[#0f2e4a] dark:bg-slate-900 w-full py-16 sm:py-20 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:30px_30px]" />
          
          <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-blue-300 mb-3">
                // General Applications
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight">
                Don&apos;t see the right role?
              </h2>
              <p className="text-blue-100/70 text-sm leading-relaxed mt-3 mb-8 max-w-md mx-auto">
                We are always looking for exceptional software engineers, designers, and project managers. Get in touch with us directly.
              </p>
              <Button
                asChild
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 rounded-full font-bold tracking-wider text-xs uppercase transition-all duration-300 shadow-lg shadow-blue-700/20 hover:scale-105 active:scale-95"
              >
                <Link href="/contact-us">
                  Get in Touch
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
}