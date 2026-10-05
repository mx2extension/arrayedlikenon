'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        localStorage.setItem('aln-admin', 'true');
        router.push('/admin');
      } else {
        setError(data.error || 'Invalid atelier passcode.');
      }
    } catch {
      setError('Connection failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f2ea] text-[#151515] flex flex-col justify-between p-8 md:p-12">
      <div className="flex justify-between items-center">
        <Link 
          href="/" 
          className="font-serif-aln text-xl font-semibold tracking-[0.18em] uppercase"
        >
          ALN
        </Link>
        <span className="text-[9px] font-mono tracking-[0.2em] uppercase opacity-40">
          Management Portal
        </span>
      </div>

      <div className="w-full max-w-sm mx-auto space-y-8 my-auto">
        <div className="space-y-2">
          <span className="text-[9px] font-mono tracking-[0.24em] uppercase opacity-50 block">
            System Access
          </span>
          <h1 className="font-serif text-4xl md:text-5xl font-light tracking-wide">
            ATELIER
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[9px] font-mono tracking-[0.18em] uppercase opacity-60 block">
              Passcode
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              required
              autoComplete="current-password"
              placeholder="••••••••"
              autoFocus
              className="w-full bg-transparent border-b border-black/30 py-3 text-xs font-mono tracking-widest focus:outline-none focus:border-black transition-colors placeholder:text-black/20"
            />
          </div>

          {error && (
            <p className="text-[10px] font-mono tracking-wider text-red-600 uppercase">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[#151515] text-[#f5f2ea] text-[10px] font-mono tracking-[0.2em] uppercase hover:bg-black transition-colors disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Authenticate →'}
          </button>
        </form>
      </div>

      <div className="text-center">
        <Link
          href="/"
          className="text-[9px] font-mono tracking-[0.18em] uppercase opacity-40 hover:opacity-100 transition-opacity"
        >
          ← Return to public website
        </Link>
      </div>
    </div>
  );
}