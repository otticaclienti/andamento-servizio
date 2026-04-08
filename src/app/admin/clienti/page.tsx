'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { mockClients, mockSyncStatuses, getMockDashboardData } from '@/lib/mock-data';
import { getInitials, formatNumber, formatCurrency } from '@/lib/utils';
import { AdminSidebar, AdminMobileHeader } from '@/components/layout/admin-nav';
import {
  Search, ExternalLink, CheckCircle2, AlertCircle, MinusCircle,
  ArrowUpDown, Filter, Eye
} from 'lucide-react';
import { useAuth as useAuthCtx } from '@/lib/auth-context';

type SortKey = 'name' | 'leads' | 'appointments' | 'spend' | 'created';
type FilterStatus = 'all' | 'active' | 'inactive' | 'sync_error' | 'no_spend';

export default function ClientiPage() {
  const { user, loading: authLoading, setViewAsClientId } = useAuth();
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [sortKey, setSortKey] = useState<SortKey>('leads');
  const [sortAsc, setSortAsc] = useState(false);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');

  useEffect(() => {
    if (!authLoading) {
      if (!user) { router.replace('/login'); return; }
      if (user.role !== 'admin') { router.replace('/dashboard'); return; }
      setTimeout(() => setLoading(false), 400);
    }
  }, [user, authLoading, router]);

  // Pre-compute dashboard data for each client
  const clientsWithData = useMemo(() => {
    return mockClients.map((c) => {
      const dash = getMockDashboardData(c.id);
      const sync = mockSyncStatuses.find((s) => s.clientId === c.id);
      return {
        ...c,
        leads: dash?.ads.leads || 0,
        reach: dash?.ads.reach || 0,
        spend: dash?.ads.spend || 0,
        appointments: dash?.whatsapp.appointments || 0,
        emailSent: dash?.email.sent || 0,
        syncStatus: sync?.status || 'never',
        syncError: sync?.errorMessage,
      };
    });
  }, []);

  const filteredClients = useMemo(() => {
    let result = clientsWithData;

    // Search filter
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((c) =>
        c.businessName.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)
      );
    }

    // Status filter
    if (filterStatus === 'active') result = result.filter((c) => c.isActive);
    if (filterStatus === 'inactive') result = result.filter((c) => !c.isActive);
    if (filterStatus === 'sync_error') result = result.filter((c) => c.syncStatus === 'error');
    if (filterStatus === 'no_spend') result = result.filter((c) => c.isActive && c.spend === 0);

    // Sort
    result = [...result].sort((a, b) => {
      let cmp = 0;
      if (sortKey === 'name') cmp = a.businessName.localeCompare(b.businessName);
      else if (sortKey === 'leads') cmp = a.leads - b.leads;
      else if (sortKey === 'appointments') cmp = a.appointments - b.appointments;
      else if (sortKey === 'spend') cmp = a.spend - b.spend;
      else if (sortKey === 'created') cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      return sortAsc ? cmp : -cmp;
    });

    return result;
  }, [clientsWithData, search, filterStatus, sortKey, sortAsc]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(false); }
  };

  const handleViewAs = (clientId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setViewAsClientId(clientId);
    router.push('/dashboard');
  };

  if (authLoading || !user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
      </div>
    );
  }

  const getSyncIcon = (status: string) => {
    if (status === 'ok') return <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />;
    if (status === 'error') return <AlertCircle className="w-3.5 h-3.5 text-amber-500" />;
    return <MinusCircle className="w-3.5 h-3.5 text-gray-300" />;
  };

  const filters: { key: FilterStatus; label: string; count: number }[] = [
    { key: 'all', label: 'Tutti', count: clientsWithData.length },
    { key: 'active', label: 'Attivi', count: clientsWithData.filter((c) => c.isActive).length },
    { key: 'inactive', label: 'Inattivi', count: clientsWithData.filter((c) => !c.isActive).length },
    { key: 'sync_error', label: 'Errori sync', count: clientsWithData.filter((c) => c.syncStatus === 'error').length },
    { key: 'no_spend', label: 'Senza spesa', count: clientsWithData.filter((c) => c.isActive && c.spend === 0).length },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      <AdminMobileHeader />

      <main className="lg:ml-64 pb-8">
        <header className="bg-white border-b border-gray-100 px-4 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Clienti</h1>
              <p className="text-sm text-gray-500">{filteredClients.length} clienti{search || filterStatus !== 'all' ? ' (filtrati)' : ''}</p>
            </div>
            <Link
              href="/admin/clienti/nuovo"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              + Nuovo cliente
            </Link>
          </div>
        </header>

        <div className="px-4 lg:px-8 py-6 max-w-6xl">
          {/* Search + Filters */}
          <div className="space-y-3 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cerca cliente..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {filters.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setFilterStatus(f.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    filterStatus === f.key
                      ? 'bg-gray-900 text-white'
                      : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {f.label} ({f.count})
                </button>
              ))}
            </div>
          </div>

          {/* Sort controls */}
          <div className="flex gap-2 mb-4 text-xs overflow-x-auto">
            <span className="text-gray-400 py-1.5 shrink-0">Ordina:</span>
            {[
              { key: 'leads' as SortKey, label: 'Lead' },
              { key: 'appointments' as SortKey, label: 'Appuntamenti' },
              { key: 'spend' as SortKey, label: 'Spesa' },
              { key: 'name' as SortKey, label: 'Nome' },
              { key: 'created' as SortKey, label: 'Data creazione' },
            ].map((s) => (
              <button
                key={s.key}
                onClick={() => handleSort(s.key)}
                className={`px-2.5 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap ${
                  sortKey === s.key ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                {s.label} {sortKey === s.key && (sortAsc ? '↑' : '↓')}
              </button>
            ))}
          </div>

          {/* Client table */}
          {loading ? (
            <div className="space-y-3">
              {[1,2,3,4].map((i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 animate-pulse">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-100 rounded w-40" />
                      <div className="h-3 bg-gray-100 rounded w-56" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredClients.map((client) => (
                <Link
                  key={client.id}
                  href={`/admin/clienti/${client.id}`}
                  className="block bg-white rounded-xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-xs shrink-0"
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
                        {getSyncIcon(client.syncStatus)}
                      </div>
                      <p className="text-xs text-gray-400 truncate">{client.email}</p>
                    </div>

                    {/* Inline KPIs */}
                    <div className="hidden sm:flex items-center gap-5 shrink-0">
                      <div className="text-center w-16">
                        <p className="text-lg font-bold text-gray-900">{client.leads}</p>
                        <p className="text-xs text-gray-400">lead</p>
                      </div>
                      <div className="text-center w-16">
                        <p className="text-lg font-bold text-gray-900">{client.appointments}</p>
                        <p className="text-xs text-gray-400">appt.</p>
                      </div>
                      <div className="text-center w-20">
                        <p className="text-lg font-bold text-gray-900">{formatCurrency(client.spend)}</p>
                        <p className="text-xs text-gray-400">spesa</p>
                      </div>
                    </div>

                    {/* Quick view-as */}
                    <button
                      onClick={(e) => handleViewAs(client.id, e)}
                      className="p-2 rounded-lg text-gray-300 hover:text-gray-600 hover:bg-gray-50 transition-colors shrink-0"
                      title="Vedi come il cliente"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Mobile KPIs */}
                  <div className="sm:hidden flex items-center gap-4 mt-3 pt-3 border-t border-gray-50">
                    <div className="text-center flex-1">
                      <p className="text-sm font-bold text-gray-900">{client.leads}</p>
                      <p className="text-xs text-gray-400">lead</p>
                    </div>
                    <div className="text-center flex-1">
                      <p className="text-sm font-bold text-gray-900">{client.appointments}</p>
                      <p className="text-xs text-gray-400">appt.</p>
                    </div>
                    <div className="text-center flex-1">
                      <p className="text-sm font-bold text-gray-900">{formatCurrency(client.spend)}</p>
                      <p className="text-xs text-gray-400">spesa</p>
                    </div>
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
