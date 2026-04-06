'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, TrendingUp, MessageCircle, LogOut } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { getInitials } from '@/lib/utils';
import type { Client } from '@/types';

interface ClientNavProps {
  client: Client;
}

export function ClientSidebar({ client }: ClientNavProps) {
  const pathname = usePathname();
  const { logout, user, viewAsClientId } = useAuth();
  const isViewAs = user?.role === 'admin' && viewAsClientId;

  const links = [
    { href: '/dashboard', label: 'Questa settimana', icon: Home, emoji: '🏠' },
    { href: '/andamento', label: 'Il nostro andamento', icon: TrendingUp, emoji: '📈' },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-100 h-screen fixed left-0 top-0 z-40">
      {/* Logo area */}
      <div className="p-5 border-b border-gray-50">
        <div className="flex items-center gap-3">
          {client.logoUrl ? (
            <img src={client.logoUrl} alt={client.businessName} className="w-10 h-10 rounded-lg object-cover" />
          ) : (
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm"
              style={{ backgroundColor: client.accentColor }}
            >
              {getInitials(client.businessName)}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{client.businessName}</p>
            <p className="text-xs text-gray-400">Dashboard</p>
          </div>
        </div>
      </div>

      {/* View-as banner */}
      {isViewAs && (
        <div className="px-4 py-2 bg-amber-50 border-b border-amber-100">
          <p className="text-xs text-amber-700 font-medium">👁️ Modalità anteprima</p>
          <Link href="/admin" className="text-xs text-amber-600 underline">
            Torna all&apos;admin
          </Link>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-gray-50 text-gray-900 font-medium'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <span className="text-base">{link.emoji}</span>
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-50 space-y-3">
        <a
          href="https://wa.me/393XXXXXXXXX"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          Hai domande? Scrivici
        </a>
        {!isViewAs && (
          <button
            onClick={logout}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors w-full"
          >
            <LogOut className="w-4 h-4" />
            Esci
          </button>
        )}
      </div>
    </aside>
  );
}

export function ClientBottomNav() {
  const pathname = usePathname();

  const links = [
    { href: '/dashboard', label: 'Questa settimana', emoji: '🏠' },
    { href: '/andamento', label: 'Andamento', emoji: '📈' },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-40 safe-area-bottom">
      <div className="flex justify-around py-2">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-lg text-xs transition-colors ${
                isActive ? 'text-gray-900 font-medium' : 'text-gray-400'
              }`}
            >
              <span className="text-xl">{link.emoji}</span>
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
