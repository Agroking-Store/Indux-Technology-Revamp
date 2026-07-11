import React from "react";
import { Phone, Mail, MapPin, Pin } from "lucide-react";

export default function ContactUs() {
  return (
    <>
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
          opacity: 0;
        }
        .delay-100 { animation-delay: 100ms; }
        .delay-200 { animation-delay: 200ms; }
        .delay-300 { animation-delay: 300ms; }
      `}</style>

      <div className="min-h-screen bg-white font-sans text-slate-900">
        <section className="relative flex h-64 w-full flex-col items-center justify-center bg-slate-700 bg-cover bg-center">
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="animate-fade-in-up relative z-10 text-center">
            <h1 className="text-4xl font-bold text-white sm:text-5xl">
              Contact Us
            </h1>
            <p className="mt-3 text-sm font-medium text-slate-300">
              <span className="text-white transition-colors hover:cursor-pointer hover:underline">
                Home
              </span>{" "}
              / Contact Us
            </p>
          </div>
        </section>

        {/* Main Content Area */}
        <main className="mx-auto max-w-6xl px-6 py-16 sm:px-12 lg:px-8">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-24">
            
            {/* Left Column: Form */}
            <div className="animate-fade-in-up delay-100">
              <div className="mb-10 text-center">
                <h2 className="text-xl font-bold uppercase tracking-widest text-slate-900">
                  Get In Touch
                </h2>
                {/* Cyan Underline */}
                <div className="mx-auto mt-3 h-[2px] w-16 bg-sky-500 transition-all duration-300 hover:w-24"></div>
              </div>

              <form className="flex flex-col gap-6">
                <input
                  type="text"
                  placeholder="Company Name *"
                  className="w-full border-b border-sky-300 bg-transparent py-3 text-sm text-slate-900 placeholder-slate-400 transition-all duration-300 focus:border-sky-500 focus:outline-none focus:ring-0"
                />
                <input
                  type="email"
                  placeholder="Email *"
                  className="w-full border-b border-sky-300 bg-transparent py-3 text-sm text-slate-900 placeholder-slate-400 transition-all duration-300 focus:border-sky-500 focus:outline-none focus:ring-0"
                />
                <input
                  type="text"
                  placeholder="Name"
                  className="w-full border-b border-sky-300 bg-transparent py-3 text-sm text-slate-900 placeholder-slate-400 transition-all duration-300 focus:border-sky-500 focus:outline-none focus:ring-0"
                />
                <input
                  type="tel"
                  placeholder="Mobile No"
                  className="w-full border-b border-sky-300 bg-transparent py-3 text-sm text-slate-900 placeholder-slate-400 transition-all duration-300 focus:border-sky-500 focus:outline-none focus:ring-0"
                />
                <textarea
                  placeholder="Message"
                  rows={4}
                  className="w-full resize-none border-b border-sky-300 bg-transparent py-3 text-sm text-slate-900 placeholder-slate-400 transition-all duration-300 focus:border-sky-500 focus:outline-none focus:ring-0"
                ></textarea>
                
                <div className="mt-4 flex gap-4">
                  <button
                    type="submit"
                    className="rounded-full bg-black px-10 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-sky-500/20 active:translate-y-0"
                  >
                    Send
                  </button>
                  {/* Changed type to "reset" to natively clear the form */}
                  <button
                    type="reset"
                    className="rounded-full bg-black px-10 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-sky-500/20 active:translate-y-0"
                  >
                    Reset
                  </button>
                </div>
              </form>
            </div>

            {/* Right Column: Locations */}
            <div className="animate-fade-in-up delay-200">
              <div className="mb-10 text-center">
                <h2 className="text-xl font-bold uppercase tracking-widest text-slate-900">
                  Our Locations
                </h2>
                {/* Cyan Underline */}
                <div className="mx-auto mt-3 h-[2px] w-16 bg-sky-500 transition-all duration-300 hover:w-24"></div>
              </div>

              <p className="mb-10 text-sm leading-relaxed text-slate-700">
                If you have any questions, just fill in the contact form, and we will answer you shortly.
              </p>

              <div className="flex flex-col gap-8">
                {/* Head Office Block */}
                <div className="group rounded-xl border border-transparent p-4 transition-all duration-300 hover:border-slate-100 hover:bg-slate-50 hover:shadow-sm">
                  <h3 className="text-xl font-bold text-slate-900 underline decoration-slate-300 decoration-2 underline-offset-4 transition-colors group-hover:decoration-sky-500">
                    Head Office
                  </h3>
                  <h4 className="mt-4 font-semibold text-slate-900">Pune, India</h4>
                  <div className="mt-4 flex flex-col gap-4 text-sm text-sky-600">
                    <p className="flex items-center gap-3 transition-transform duration-300 hover:translate-x-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-100 text-sky-500">
                        <Phone size={16} />
                      </span>{" "}
                      +91 84215 38753
                    </p>
                    <p className="flex items-center gap-3 transition-transform duration-300 hover:translate-x-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-100 text-sky-500">
                        <Mail size={16} />
                      </span>{" "}
                      connect@induxtechnology.com
                    </p>
                    <p className="flex items-start gap-3 transition-transform duration-300 hover:translate-x-2">
                      <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sky-500">
                        <Pin size={16} />
                      </span>{" "}
                      <span className="leading-relaxed text-slate-700">
                        S. No 5, Geeta Paradise, opposite of Zensar IT Park, Rakshak Nagar, Kharadi, Pune, Maharashtra 411014
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </>
  );
}