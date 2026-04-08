'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, Receipt, UserPlus, LogOut, LayoutDashboard, BarChart3 } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export function AdminSidebar() {
  const pathname = usePathname();
  const { logout, user } = useAuth();

  const links = [
    { href: '/admin', label: 'Panoramica', icon: BarChart3, exact: true },
    { href: '/admin/clienti', label: 'Clienti', icon: Users },
    { href: '/admin/spese', label: 'Spese ads', icon: Receipt },
    { href: '/admin/clienti/nuovo', label: 'Nuovo cliente', icon: UserPlus },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-100 h-screen fixed left-0 top-0 z-40">
      {/* Logo area */}
      <div className="p-5 border-b border-gray-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gray-900 flex items-center justify-center text-white font-bold text-sm">
            OC
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">APPLICAZIONE - OC</p>
            <p className="text-xs text-gray-400">Pannello Admin</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {links.map((link) => {
          const isActive = link.exact ? pathname === link.href : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-gray-900 text-white font-medium'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <link.icon className="w-4 h-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-50">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
            <LayoutDashboard className="w-4 h-4 text-gray-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">{user?.name}</p>
            <p className="text-xs text-gray-400">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors w-full"
        >
          <LogOut className="w-4 h-4" />
          Esci
        </button>
      </div>
    </aside>
  );
}

export function AdminMobileHeader() {
  const pathname = usePathname();

  const links = [
    { href: '/admin', label: 'Home', icon: BarChart3, exact: true },
    { href: '/admin/clienti', label: 'Clienti', icon: Users },
    { href: '/admin/spese', label: 'Spese', icon: Receipt },
    { href: '/admin/clienti/nuovo', label: 'Nuovo', icon: UserPlus },
  ];

  return (
    <div className="lg:hidden">
      <div className="bg-white border-b border-gray-100 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center text-white font-bold text-xs">
            OC
          </div>
          <span className="font-semibold text-gray-900 text-sm">APPLICAZIONE - OC</span>
        </div>
      </div>
      <nav className="bg-white border-b border-gray-100 px-2 py-1 flex gap-1 overflow-x-auto">
        {links.map((link) => {
          const isActive = link.exact ? pathname === link.href : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-gray-900 text-white font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <link.icon className="w-3.5 h-3.5" />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
