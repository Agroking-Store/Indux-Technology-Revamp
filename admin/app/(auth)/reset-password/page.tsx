'use client';

import { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, ShieldCheck, ArrowLeft, KeyRound, Eye, EyeOff } from 'lucide-react';
import api, { ApiResponse } from '@/lib/api';
import { toast } from 'react-toastify';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast.error('Reset token is missing from the URL.');
      return;
    }

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post<ApiResponse>('/auth/reset-password', {
        token,
        password,
      });

      if (res.data.success) {
        toast.success('Password reset successfully! Redirecting to login...');
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      }
    } catch (error) {
      console.error('Reset password error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="space-y-4 text-center">
        <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl text-red-400 text-xs leading-relaxed">
          Invalid password reset request. The reset token is missing from the URL. Please request a new link.
        </div>
        <div className="text-center pt-2">
          <Link href="/forgot-password" className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 transition-colors font-semibold">
            Request New Link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-left">
      <p className="text-slate-400 text-xs leading-relaxed">
        Please enter and confirm your new access password below. Passwords must be at least 8 characters long.
      </p>

      {/* New Password field */}
      <div className="space-y-1.5">
        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">New Password</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
            <Lock size={16} />
          </div>
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 text-sm bg-slate-950/80 border border-slate-850 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-500 text-white placeholder-slate-600"
            placeholder="••••••••"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      {/* Confirm Password field */}
      <div className="space-y-1.5">
        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Confirm Password</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
            <Lock size={16} />
          </div>
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 text-sm bg-slate-950/80 border border-slate-850 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-500 text-white placeholder-slate-600"
            placeholder="••••••••"
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
          >
            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl transition shadow-lg shadow-indigo-650/20 disabled:opacity-50 text-sm flex items-center justify-center gap-2"
      >
        {loading ? 'Updating Password...' : (
          <>
            <KeyRound size={14} />
            Reset Password
          </>
        )}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 relative overflow-hidden">
      
      {/* Decorative ambient glowing blur blobs */}
      <div className="absolute top-1/4 left-1/4 size-96 bg-indigo-500/15 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 size-96 bg-purple-500/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Reset Password Container Box */}
      <div className="max-w-md w-full bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-800 shadow-2xl p-8 relative z-10 space-y-6">
        
        {/* Header Icon & Title */}
        <div className="text-center space-y-3">
          <div className="size-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center mx-auto shadow-xl shadow-indigo-500/20">
            <ShieldCheck className="size-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight leading-none">Reset Password</h1>
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mt-2 block">Set New Password</span>
          </div>
        </div>

        <Suspense fallback={<div className="text-center text-slate-400 text-xs">Loading form...</div>}>
          <ResetPasswordForm />
        </Suspense>

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
