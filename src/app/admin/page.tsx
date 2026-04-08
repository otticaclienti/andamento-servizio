'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { mockClients, mockSyncStatuses, getMockDashboardData, mockWeeklySpends } from '@/lib/mock-data';
import { formatNumber, formatCurrency, getInitials } from '@/lib/utils';
import { AdminSidebar, AdminMobileHeader } from '@/components/layout/admin-nav';
import { FadeIn } from '@/components/ui/fade-in';
import {
  Users, Target, Euro, Calendar, AlertTriangle, CheckCircle2,
  ArrowRight, TrendingUp, RefreshCw, AlertCircle
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      if (!user) { router.replace('/login'); return; }
      if (user.role !== 'admin') { router.replace('/dashboard'); return; }
      setTimeout(() => setLoading(false), 400);
    }
  }, [user, authLoading, router]);

  if (authLoading || !user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
      </div>
    );
  }

  // Aggregate data across all active clients
  const activeClients = mockClients.filter((c) => c.isActive);
  const allDashData = activeClients.map((c) => getMockDashboardData(c.id)).filter(Boolean);

  const totalLeads = allDashData.reduce((sum, d) => sum + (d?.ads.leads || 0), 0);
  const totalReach = allDashData.reduce((sum, d) => sum + (d?.ads.reach || 0), 0);
  const totalAppointments = allDashData.reduce((sum, d) => sum + (d?.whatsapp.appointments || 0), 0);
  const totalSpend = allDashData.reduce((sum, d) => sum + (d?.ads.spend || 0), 0);
  const totalEmailsSent = allDashData.reduce((sum, d) => sum + (d?.email.sent || 0), 0);

  const syncErrors = mockSyncStatuses.filter((s) => s.status === 'error');
  const syncOk = mockSyncStatuses.filter((s) => s.status === 'ok');
  const syncNever = mockSyncStatuses.filter((s) => s.status === 'never' || !s.lastSync);

  // Clients missing spend this week
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const weekStart = new Date(now.setDate(diff)).toISOString().split('T')[0];
  const clientsWithSpend = mockWeeklySpends.filter((s) => s.weekStart === weekStart).map((s) => s.clientId);
  const clientsMissingSpend = activeClients.filter((c) => !clientsWithSpend.includes(c.id));

  // Top performers
  const clientPerformance = allDashData
    .filter(Boolean)
    .map((d) => ({ name: d!.client.businessName, leads: d!.ads.leads, color: d!.client.accentColor, id: d!.client.id }))
    .sort((a, b) => b.leads - a.leads);

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      <AdminMobileHeader />

      <main className="lg:ml-64 pb-8">
        <header className="bg-white border-b border-gray-100 px-4 lg:px-8 py-4">
          <h1 className="text-xl font-semibold text-gray-900">Panoramica</h1>
          <p className="text-sm text-gray-500">Situazione di tutti i clienti questa settimana</p>
        </header>

        <div className="px-4 lg:px-8 py-6 max-w-6xl space-y-6">
          {/* Global KPIs */}
          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              {[1,2,3,4,5].map((i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 animate-pulse">
                  <div className="h-4 bg-gray-100 rounded w-20 mb-3" />
                  <div className="h-8 bg-gray-100 rounded w-16" />
                </div>
              ))}
            </div>
          ) : (
            <FadeIn>
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-xs font-medium text-gray-500">Clienti attivi</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{activeClients.length}</p>
                  <p className="text-xs text-gray-400 mt-1">su {mockClients.length} totali</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-blue-500" />
                    <span className="text-xs font-medium text-gray-500">Lead totali</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{totalLeads}</p>
                  <p className="text-xs text-gray-400 mt-1">questa settimana</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-green-500" />
                    <span className="text-xs font-medium text-gray-500">Appuntamenti</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{totalAppointments}</p>
                  <p className="text-xs text-gray-400 mt-1">fissati totali</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Euro className="w-4 h-4 text-amber-500" />
                    <span className="text-xs font-medium text-gray-500">Spesa totale</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalSpend)}</p>
                  <p className="text-xs text-gray-400 mt-1">questa settimana</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-purple-500" />
                    <span className="text-xs font-medium text-gray-500">Reach totale</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{formatNumber(totalReach)}</p>
                  <p className="text-xs text-gray-400 mt-1">persone raggiunte</p>
                </div>
              </div>
            </FadeIn>
          )}

          {/* Alerts row */}
          {!loading && (
            <FadeIn delay={100}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Sync errors */}
                {syncErrors.length > 0 && (
                  <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="w-4 h-4 text-amber-600" />
                      <span className="text-sm font-semibold text-amber-800">Errori sync</span>
                    </div>
                    <div className="space-y-1.5">
                      {syncErrors.map((s) => {
                        const cl = mockClients.find((c) => c.id === s.clientId);
                        return (
                          <div key={s.clientId} className="flex items-center justify-between">
                            <span className="text-sm text-amber-700">{cl?.businessName}</span>
                            <span className="text-xs text-amber-500">{s.errorMessage}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Missing spend */}
                {clientsMissingSpend.length > 0 && (
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-semibold text-blue-800">Spesa da inserire</span>
                    </div>
                    <div className="space-y-1.5">
                      {clientsMissingSpend.map((c) => (
                        <div key={c.id} className="text-sm text-blue-700">{c.businessName}</div>
                      ))}
                    </div>
                    <Link href="/admin/spese" className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 mt-2 hover:text-blue-800">
                      Vai alle spese <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                )}

                {/* Sync status summary */}
                <div className="bg-white border border-gray-100 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <RefreshCw className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-semibold text-gray-800">Stato sync GHL</span>
                  </div>
                  <div className="space-y-1.5 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                      <span className="text-gray-600">{syncOk.length} sincronizzati</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                      <span className="text-gray-600">{syncErrors.length} con errori</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-gray-300" />
                      <span className="text-gray-600">{syncNever.length} mai sincronizzati</span>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          )}

          {/* Performance ranking */}
          {!loading && (
            <FadeIn delay={200}>
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-800">Classifica clienti — Lead questa settimana</h3>
                  <Link href="/admin/clienti" className="text-xs font-medium text-gray-500 hover:text-gray-700 flex items-center gap-1">
                    Vedi tutti <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
                <div className="divide-y divide-gray-50">
                  {clientPerformance.map((cp, i) => {
                    const maxLeads = clientPerformance[0]?.leads || 1;
                    return (
                      <Link key={cp.id} href={`/admin/clienti/${cp.id}`} className="flex items-center gap-4 px-5 py-3 hover:bg-gray-50 transition-colors">
                        <span className="text-sm font-bold text-gray-300 w-6">{i + 1}</span>
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs shrink-0"
                          style={{ backgroundColor: cp.color }}
                        >
                          {getInitials(cp.name)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{cp.name}</p>
                          <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1.5">
                            <div
                              className="h-1.5 rounded-full transition-all duration-500"
                              style={{ width: `${(cp.leads / maxLeads) * 100}%`, backgroundColor: cp.color }}
                            />
                          </div>
                        </div>
                        <span className="text-lg font-bold text-gray-900">{cp.leads}</span>
                        <span className="text-xs text-gray-400">lead</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </FadeIn>
          )}

          {/* Quick actions */}
          {!loading && (
            <FadeIn delay={300}>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <Link href="/admin/clienti" className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow text-center">
                  <Users className="w-5 h-5 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-700">Gestisci clienti</p>
                </Link>
                <Link href="/admin/spese" className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow text-center">
                  <Euro className="w-5 h-5 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-700">Inserisci spese</p>
                </Link>
                <Link href="/admin/clienti/nuovo" className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow text-center">
                  <Users className="w-5 h-5 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-700">Nuovo cliente</p>
                </Link>
                <button className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow text-center">
                  <RefreshCw className="w-5 h-5 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-700">Sync tutti</p>
                </button>
              </div>
            </FadeIn>
          )}
        </div>
      </main>
    </div>
  );
}
