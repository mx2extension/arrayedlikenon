'use client';

import { useEffect, useState, ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const navItems = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/products', label: 'Products' },
  { href: '/admin/collections', label: 'Collections' },
  { href: '/admin/journal', label: 'Journal' },
  { href: '/admin/archive', label: 'Archive' },
  { href: '/admin/orders', label: 'Orders' },
  { href: '/admin/contact', label: 'Contact Inquiries' },
  { href: '/admin/newsletter', label: 'Newsletter' },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (pathname === '/admin/login') {
      setChecking(false);
      return;
    }

    const token = localStorage.getItem('aln-admin');
    if (token === 'true') {
      setAuthed(true);
    } else {
      setAuthed(false);
      router.push('/admin/login');
    }
    setChecking(false);
  }, [pathname, router]);

  // Close menu drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const logout = () => {
    localStorage.removeItem('aln-admin');
    setAuthed(false);
    router.push('/admin/login');
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-[#f5f2ea] flex items-center justify-center">
        <p className="font-mono text-[10px] tracking-[0.24em] uppercase text-black/40 animate-pulse">
          Authenticating Session...
        </p>
      </div>
    );
  }

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (!authed) return null;

  return (
    <div className="min-h-screen bg-[#f5f2ea] text-[#151515] flex relative">
      {/* Floating Mobile Toggle Button (Self-Contained) */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="md:hidden fixed bottom-6 right-6 z-50 bg-black text-[#f5f2ea] px-4 py-3 text-[10px] font-mono tracking-[0.2em] uppercase shadow-2xl border border-white/20 active:scale-95 transition-all"
        aria-label="Toggle Admin Navigation"
      >
        {mobileMenuOpen ? 'Close [×]' : 'Atelier Menu [≡]'}
      </button>

      {/* Backdrop for Mobile Menu */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-xs"
        />
      )}

      {/* Admin Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen z-50 w-64 border-r border-black/10 p-8 flex flex-col justify-between flex-shrink-0 bg-[#f5f2ea] transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="space-y-8">
          <div className="flex justify-between items-start">
            <div>
              <Link
                href="/admin"
                className="font-serif text-2xl font-light tracking-wide block uppercase"
              >
                ALN
              </Link>
              <span className="text-[8px] font-mono tracking-[0.24em] uppercase text-black/40 block mt-1">
                Atelier Control
              </span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden text-lg font-mono opacity-50 hover:opacity-100 p-1"
            >
              ×
            </button>
          </div>

          <nav className="space-y-1 font-mono">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block px-3 py-2.5 text-[10px] tracking-[0.16em] uppercase transition-all ${
                    isActive
                      ? 'bg-black text-[#f5f2ea] font-medium'
                      : 'text-black/60 hover:text-black hover:bg-black/5'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer actions */}
        <div className="space-y-4 pt-6 border-t border-black/10 font-mono">
          <Link
            href="/"
            target="_blank"
            className="block text-[9px] tracking-[0.16em] uppercase text-black/50 hover:text-black transition-colors"
          >
            ↗ Public Site
          </Link>
          <button
            onClick={logout}
            className="block w-full text-left text-[9px] tracking-[0.16em] uppercase text-red-700 hover:text-red-900 transition-colors"
          >
            Terminate Session
          </button>
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="flex-1 p-6 md:p-14 overflow-y-auto bg-white/40 min-h-screen">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
}