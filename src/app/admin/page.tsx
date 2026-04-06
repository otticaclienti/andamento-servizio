'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { mockClients, mockSyncStatuses } from '@/lib/mock-data';
import { getInitials } from '@/lib/utils';
import { AdminSidebar, AdminMobileHeader } from '@/components/layout/admin-nav';
import { Search, ExternalLink, CheckCircle2, AlertCircle, Clock, MinusCircle } from 'lucide-react';

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.replace('/login');
        return;
      }
      if (user.role !== 'admin') {
        router.replace('/dashboard');
        return;
      }
      const timer = setTimeout(() => setLoading(false), 400);
      return () => clearTimeout(timer);
    }
  }, [user, authLoading, router]);

  if (authLoading || !user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
      </div>
    );
  }

  const filteredClients = mockClients.filter((c) =>
    c.businessName.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  const getSyncIcon = (clientId: string) => {
    const sync = mockSyncStatuses.find((s) => s.clientId === clientId);
    if (!sync || sync.status === 'never') return <MinusCircle className="w-4 h-4 text-gray-300" />;
    if (sync.status === 'ok') return <CheckCircle2 className="w-4 h-4 text-green-500" />;
    if (sync.status === 'error') return <AlertCircle className="w-4 h-4 text-amber-500" />;
    return <Clock className="w-4 h-4 text-gray-400" />;
  };

  const getSyncLabel = (clientId: string) => {
    const sync = mockSyncStatuses.find((s) => s.clientId === clientId);
    if (!sync || sync.status === 'never') return 'Mai sincronizzato';
    if (sync.status === 'ok') return `Ultimo sync: ${new Date(sync.lastSync!).toLocaleDateString('it-IT')}`;
    if (sync.status === 'error') return sync.errorMessage || 'Errore sync';
    return 'In corso...';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      <AdminMobileHeader />

      <main className="lg:ml-64 pb-8">
        <header className="bg-white border-b border-gray-100 px-4 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Clienti</h1>
              <p className="text-sm text-gray-500">{mockClients.length} clienti gestiti</p>
            </div>
            <Link
              href="/admin/clienti/nuovo"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              + Nuovo cliente
            </Link>
          </div>
        </header>

        <div className="px-4 lg:px-8 py-6 max-w-5xl">
          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cerca cliente..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white"
            />
          </div>

          {/* Client list */}
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 animate-pulse">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-xl" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-100 rounded w-40" />
                      <div className="h-3 bg-gray-100 rounded w-56" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredClients.map((client) => (
                <Link
                  key={client.id}
                  href={`/admin/clienti/${client.id}`}
                  className="block bg-white rounded-xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0"
                      style={{ backgroundColor: client.accentColor }}
                    >
                      {getInitials(client.businessName)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-gray-900 truncate">{client.businessName}</h3>
                        {!client.isActive && (
                          <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-500">Inattivo</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 truncate">{client.email}</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        {getSyncIcon(client.id)}
                        <span className="text-xs text-gray-400">{getSyncLabel(client.id)}</span>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-300 shrink-0" />
                  </div>
                </Link>
              ))}

              {filteredClients.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-400">Nessun cliente trovato</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
