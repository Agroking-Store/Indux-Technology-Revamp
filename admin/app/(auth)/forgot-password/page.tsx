'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, ShieldCheck, ArrowLeft, Send } from 'lucide-react';
import api, { ApiResponse } from '@/lib/api';
import { toast } from 'react-toastify';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post<ApiResponse>('/auth/forgot-password', { email });
      if (res.data.success) {
        setSubmitted(true);
        toast.success(res.data.message || 'Reset link sent successfully!');
      }
    } catch (error) {
      console.error('Forgot password error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 relative overflow-hidden">
      
      {/* Decorative ambient glowing blur blobs */}
      <div className="absolute top-1/4 left-1/4 size-96 bg-indigo-500/15 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 size-96 bg-purple-500/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Forgot Password Container Box */}
      <div className="max-w-md w-full bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-800 shadow-2xl p-8 relative z-10 space-y-6">
        
        {/* Header Icon & Title */}
        <div className="text-center space-y-3">
          <div className="size-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center mx-auto shadow-xl shadow-indigo-500/20">
            <ShieldCheck className="size-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight leading-none">Forgot Password</h1>
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mt-2 block">Admin Access Recovery</span>
          </div>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <p className="text-slate-400 text-xs leading-relaxed">
              Enter your registered administrator email address below. If your account is found, we will send you a secure link to reset your access password.
            </p>

            {/* Email field */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail size={16} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-950/80 border border-slate-850 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-500 text-white placeholder-slate-600"
                  placeholder="operator@induxtech.com"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl transition shadow-lg shadow-indigo-650/20 disabled:opacity-50 text-sm flex items-center justify-center gap-2"
            >
              {loading ? 'Sending Recovery Link...' : (
                <>
                  <Send size={14} />
                  Send Reset Link
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="space-y-4 text-center">
            <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl text-emerald-400 text-xs leading-relaxed">
              An email has been sent to <strong className="text-emerald-300">{email}</strong> with a secure link to reset your password. Please check your inbox and spam folder.
            </div>
            <p className="text-slate-550 text-xs">
              The link is valid for 10 minutes.
            </p>
          </div>
        )}

        {/* Back to Login link */}
        <div className="text-center pt-2">
          <Link href="/login" className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 transition-colors font-semibold">
            <ArrowLeft size={12} />
            Back to Login
          </Link>
        </div>

      </div>
    </div>
  );
}
