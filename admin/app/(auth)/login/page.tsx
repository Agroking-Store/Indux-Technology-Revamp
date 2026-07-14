'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Sparkles, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 relative overflow-hidden">
      
      {/* Decorative ambient glowing blur blobs */}
      <div className="absolute top-1/4 left-1/4 size-96 bg-indigo-500/15 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 size-96 bg-purple-500/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Login Container Box */}
      <div className="max-w-md w-full bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-800 shadow-2xl p-8 relative z-10 space-y-6">
        
        {/* Header Icon & Title */}
        <div className="text-center space-y-3">
          <div className="size-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center mx-auto shadow-xl shadow-indigo-500/20">
            <ShieldCheck className="size-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight leading-none">Control Login</h1>
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mt-2 block">Authorized Personnel Only</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          
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

          {/* Password field */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Access Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Lock size={16} />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-950/80 border border-slate-850 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-500 text-white placeholder-slate-600"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl transition shadow-lg shadow-indigo-650/20 disabled:opacity-50 text-sm"
          >
            {loading ? 'Decrypting Access...' : 'Authenticate'}
          </button>
        </form>

        {/* Footer info badge */}
        <div className="bg-slate-950/40 p-3.5 rounded-2xl border border-slate-850 flex items-start gap-2.5 text-slate-500 text-xs leading-relaxed">
          <Sparkles className="size-4.5 text-indigo-400 shrink-0 mt-0.5" />
          <p>
            Default credentials for testing: <strong className="text-slate-300">admin@example.com</strong> / <strong className="text-slate-300">password123</strong>
          </p>
        </div>

      </div>
    </div>
  );
}