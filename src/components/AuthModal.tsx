import React, { useState } from 'react';
import { X, Lock, Mail, User, Phone, MapPin, Loader2, Sparkles, CheckCircle } from 'lucide-react';
import { getApiUrl } from '../utils/api';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (token: string, user: any) => void;
}

export default function AuthModal({ isOpen, onClose, onAuthSuccess }: AuthModalProps) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
    const payload = isRegister 
      ? { name, email, password, phone, address }
      : { email, password };

    try {
      const response = await fetch(getApiUrl(endpoint), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setSuccess(isRegister ? 'Account created successfully!' : 'Logged in, welcome back!');
      setTimeout(() => {
        onAuthSuccess(data.token, data.user);
        onClose();
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Connection failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center bg-stone-900/65 backdrop-blur-sm p-4">
      <div id="auth-modal" className="relative w-full max-w-md bg-stone-50 border border-amber-900/15 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300">
        
        {/* Decorative Golden Top Margin Band */}
        <div className="h-2 bg-gradient-to-r from-amber-800 via-amber-500 to-amber-900" />

        {/* Header Block */}
        <div className="px-6 pt-6 pb-4 flex justify-between items-center border-b border-stone-200">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-5 h-5 text-amber-600" />
            <h3 className="font-serif text-lg font-bold text-stone-950 uppercase tracking-wider">
              {isRegister ? 'Create Silk Guild Account' : 'Weaver Guild Portal'}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="text-stone-400 hover:text-stone-900 p-1.5 hover:bg-stone-100 rounded-full transition-all"
            aria-label="Close Auth Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Inner Content Block */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-rose-50 border-l-4 border-rose-500 text-rose-800 rounded text-xs font-semibold leading-relaxed flex items-center gap-2">
              <span className="shrink-0 bg-rose-500 text-white rounded-full w-4 h-4 text-[10px] flex items-center justify-center font-bold">!</span>
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-emerald-50 border-l-4 border-emerald-500 text-emerald-800 rounded text-xs font-semibold leading-relaxed flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">Full Name *</label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
                  <input
                    type="text"
                    required
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-9 pr-4 py-2 w-full bg-white border border-stone-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-amber-900 transition-shadow"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">Email Address *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9 pr-4 py-2 w-full bg-white border border-stone-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-amber-900"
                />
              </div>
            </div>

            {isRegister && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
                    <input
                      type="tel"
                      placeholder="+91 XXXXX XXXXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="pl-9 pr-4 py-2 w-full bg-white border border-stone-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-amber-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">Location City</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
                    <input
                      type="text"
                      placeholder="e.g. Hyderabad"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="pl-9 pr-4 py-2 w-full bg-white border border-stone-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-amber-900"
                    />
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">Password *</label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9 pr-4 py-2 w-full bg-white border border-stone-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-amber-900"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 bg-amber-900 text-stone-50 hover:bg-amber-950 font-bold text-xs py-2.5 rounded shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Configuring Session Keys...</span>
                </>
              ) : (
                <span>{isRegister ? 'Register & Accept Guarantee' : 'Authenticate Session'}</span>
              )}
            </button>
          </form>

          {/* Toggle Switch */}
          <div className="mt-5 text-center text-xs text-stone-500">
            {isRegister ? (
              <p>
                Already have an authentic account?{' '}
                <button 
                  onClick={() => setIsRegister(false)}
                  className="text-amber-800 hover:text-amber-950 hover:underline font-bold"
                >
                  Sign In Log
                </button>
              </p>
            ) : (
              <p>
                First time exploring Sri Praharsha?{' '}
                <button 
                  onClick={() => setIsRegister(true)}
                  className="text-amber-800 hover:text-amber-950 hover:underline font-bold"
                >
                  Create Master Register
                </button>
              </p>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-stone-200 text-center">
            <p className="text-[10px] text-stone-400 leading-normal">
              For immediate testing, you can log in as:<br />
              Customer: <span className="font-mono font-semibold text-stone-600">user@spssarees.com</span> / <span className="font-mono font-semibold text-stone-600">user123</span><br />
              Admin: <span className="font-mono font-semibold text-stone-600">admin@spssarees.com</span> / <span className="font-mono font-semibold text-stone-600">admin123</span>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
