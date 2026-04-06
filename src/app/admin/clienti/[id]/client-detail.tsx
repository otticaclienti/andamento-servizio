'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { mockClients, mockSyncStatuses, getMockDashboardData } from '@/lib/mock-data';
import { getInitials, formatNumber, formatCurrency } from '@/lib/utils';
import { AdminSidebar, AdminMobileHeader } from '@/components/layout/admin-nav';
import { ArrowLeft, Eye, RefreshCw, CheckCircle2, AlertCircle, Copy } from 'lucide-react';
import type { Client, DashboardData } from '@/types';

export default function ClientDetailContent() {
  const { user, loading: authLoading, setViewAsClientId } = useAuth();
  const router = useRouter();
  const params = useParams();
  const clientId = params.id as string;
  const [client, setClient] = useState<Client | null>(null);
  const [dashData, setDashData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!authLoading) {
      if (!user || user.role !== 'admin') {
        router.replace('/login');
        return;
      }
      const c = mockClients.find((c) => c.id === clientId);
      if (!c) {
        router.replace('/admin');
        return;
      }
      setClient(c);
      const timer = setTimeout(() => {
        setDashData(getMockDashboardData(clientId));
        setLoading(false);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [user, authLoading, router, clientId]);

  const handleViewAs = () => {
    setViewAsClientId(clientId);
    router.push('/dashboard');
  };

  const handleCopyInvite = () => {
    navigator.clipboard.writeText(`https://app.oc-agenzia.it/login?email=${client?.email}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (authLoading || !client) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
      </div>
    );
  }

  const sync = mockSyncStatuses.find((s) => s.clientId === clientId);

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      <AdminMobileHeader />

      <main className="lg:ml-64 pb-8">
        <header className="bg-white border-b border-gray-100 px-4 lg:px-8 py-4">
          <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-3 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Torna ai clienti
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm"
                style={{ backgroundColor: client.accentColor }}
              >
                {getInitials(client.businessName)}
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">{client.businessName}</h1>
                <p className="text-sm text-gray-500">{client.email}</p>
              </div>
            </div>
            <button
              onClick={handleViewAs}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              <Eye className="w-4 h-4" />
              Vedi come il cliente
            </button>
          </div>
        </header>

        <div className="px-4 lg:px-8 py-6 max-w-5xl space-y-6">
          {/* Info card */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-gray-800 mb-4">Informazioni</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Telefono</span>
                <p className="text-gray-900 mt-0.5">{client.phone}</p>
              </div>
              <div>
                <span className="text-gray-400">Indirizzo</span>
                <p className="text-gray-900 mt-0.5">{client.address}</p>
              </div>
              <div>
                <span className="text-gray-400">Accent color</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="w-5 h-5 rounded" style={{ backgroundColor: client.accentColor }} />
                  <span className="text-gray-900">{client.accentColor}</span>
                </div>
              </div>
              <div>
                <span className="text-gray-400">Stato</span>
                <p className="mt-0.5">
                  {client.isActive ? (
                    <span className="text-green-600 font-medium">Attivo</span>
                  ) : (
                    <span className="text-gray-400">Inattivo</span>
                  )}
                </p>
              </div>
              <div>
                <span className="text-gray-400">Cliente dal</span>
                <p className="text-gray-900 mt-0.5">{new Date(client.createdAt).toLocaleDateString('it-IT', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
              <div>
                <span className="text-gray-400">GHL Location ID</span>
                <p className="text-gray-900 mt-0.5 font-mono text-xs">{client.ghlLocationId}</p>
              </div>
            </div>
          </div>

          {/* Sync status */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-800">Sincronizzazione GHL</h3>
              <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors">
                <RefreshCw className="w-3.5 h-3.5" />
                Sincronizza ora
              </button>
            </div>
            <div className="flex items-center gap-2">
              {sync?.status === 'ok' ? (
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              ) : sync?.status === 'error' ? (
                <AlertCircle className="w-5 h-5 text-amber-500" />
              ) : (
                <div className="w-5 h-5 rounded-full bg-gray-200" />
              )}
              <div>
                <p className="text-sm text-gray-900">
                  {sync?.status === 'ok' && 'Sincronizzazione completata'}
                  {sync?.status === 'error' && 'Errore nella sincronizzazione'}
                  {(!sync || sync.status === 'never') && 'Mai sincronizzato'}
                </p>
                {sync?.lastSync && (
                  <p className="text-xs text-gray-400">
                    {new Date(sync.lastSync).toLocaleString('it-IT')}
                  </p>
                )}
                {sync?.errorMessage && (
                  <p className="text-xs text-amber-600 mt-0.5">{sync.errorMessage}</p>
                )}
              </div>
            </div>
          </div>

          {/* Quick stats */}
          {!loading && dashData && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <h3 className="text-sm font-semibold text-gray-800 mb-4">Riepilogo settimana corrente</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <span className="text-xs text-gray-400">Lead</span>
                  <p className="text-2xl font-bold text-gray-900">{dashData.ads.leads}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-400">Reach</span>
                  <p className="text-2xl font-bold text-gray-900">{formatNumber(dashData.ads.reach)}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-400">Spesa ads</span>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(dashData.ads.spend)}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-400">Appuntamenti</span>
                  <p className="text-2xl font-bold text-gray-900">{dashData.whatsapp.appointments}</p>
                </div>
              </div>
            </div>
          )}

          {/* Invite link */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">Link di accesso</h3>
            <div className="flex items-center gap-2">
              <input
                readOnly
                value={`https://app.oc-agenzia.it/login?email=${client.email}`}
                className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 bg-gray-50"
              />
              <button
                onClick={handleCopyInvite}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <Copy className="w-4 h-4" />
                {copied ? 'Copiato!' : 'Copia'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
