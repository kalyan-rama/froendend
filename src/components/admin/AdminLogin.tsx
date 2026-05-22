import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, Loader2, Sparkles, ArrowRight } from 'lucide-react';
import { getApiUrl } from '../../utils/api';

interface AdminLoginProps {
  onLoginSuccess: (token: string, user: any) => void;
  onBackToStore: () => void;
}

export default function AdminLogin({ onLoginSuccess, onBackToStore }: AdminLoginProps) {
  const [email, setEmail] = useState('admin@spssarees.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(getApiUrl('/api/auth/login'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Invalid Admin Credentials');
      }

      if (data.user.role !== 'admin') {
        throw new Error('Access Denied. Standard client account detected.');
      }

      onLoginSuccess(data.token, data.user);
    } catch (err: any) {
      setError(err.message || 'Authentication sequence failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Absolute Decorative Golden Orbits in corners */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* Header spacer block */}
      <div className="text-center">
        <span className="font-serif text-3xl font-black text-amber-900 tracking-wider">SPS SAREES</span>
        <p className="text-[9px] uppercase tracking-[0.2em] text-amber-800 font-bold font-sans mt-0.5">Sri Praharsha Silk Sarees</p>
      </div>

      {/* Center login card */}
      <div className="my-auto max-w-md w-full mx-auto">
        <div className="bg-white border border-amber-900/15 rounded-[1.5rem] shadow-2xl overflow-hidden">
          
          {/* Accent decoration ribbon */}
          <div className="h-1.5 bg-gradient-to-r from-amber-800 via-amber-500 to-amber-900" />
          
          <div className="p-8 sm:p-10 space-y-6">
            <div className="text-center space-y-2">
              <div className="mx-auto w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-800">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">Boutique Administration Gate</h2>
              <p className="text-xs text-stone-500">Access secures loom registry controls and customer ledger tables.</p>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold rounded-lg leading-relaxed">
                🚨 {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1">Security Email *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
                  <input
                    type="email"
                    required
                    placeholder="admin@spssarees.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9 pr-4 py-2 w-full bg-stone-50 border border-stone-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-amber-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1">Weaver Security Password *</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9 pr-4 py-2 w-full bg-stone-50 border border-stone-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-amber-900"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-amber-900 border border-amber-950 text-stone-50 hover:bg-amber-950 font-bold text-xs py-2.5 rounded shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 mt-6"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying Loom Keys...</span>
                  </>
                ) : (
                  <>
                    <span>Decrypt Secure Session</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="text-center text-xs">
              <button 
                onClick={onBackToStore}
                className="text-stone-400 hover:text-stone-900 font-bold hover:underline"
              >
                ← Return to Client Storefront
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Foothold text details */}
      <div className="text-center text-[10px] text-stone-400 leading-normal max-w-sm mx-auto">
        <p>This workstation node is monitored. For demo testing purposes, the credentials are: <span className="font-mono text-stone-500">admin@spssarees.com / admin123</span></p>
      </div>

    </div>
  );
}
