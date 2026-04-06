'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { getMockAndamentoData, mockClients } from '@/lib/mock-data';
import { formatNumber } from '@/lib/utils';
import { ClientSidebar, ClientBottomNav } from '@/components/layout/client-nav';
import { KpiCard, KpiCardSkeleton } from '@/components/ui/kpi-card';
import { SectionCard, SectionCardSkeleton } from '@/components/ui/section-card';
import { MultiLineChart } from '@/components/charts/line-chart';
import { Users, Target, Calendar, Mail } from 'lucide-react';
import type { AndamentoData } from '@/types';

export default function AndamentoPage() {
  const { user, loading: authLoading, viewAsClientId } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<AndamentoData | null>(null);
  const [loading, setLoading] = useState(true);

  const effectiveClientId = viewAsClientId || user?.clientId;

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.replace('/login');
        return;
      }
      if (user.role === 'admin' && !viewAsClientId) {
        router.replace('/admin');
        return;
      }
    }
  }, [user, authLoading, router, viewAsClientId]);

  useEffect(() => {
    if (effectiveClientId) {
      setLoading(true);
      const timer = setTimeout(() => {
        setData(getMockAndamentoData(effectiveClientId));
        setLoading(false);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [effectiveClientId]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
      </div>
    );
  }

  const client = mockClients.find((c) => c.id === effectiveClientId);
  if (!client) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <ClientSidebar client={client} />
      <ClientBottomNav />

      <main className="lg:ml-64 pb-20 lg:pb-8">
        <header className="bg-white border-b border-gray-100 px-4 lg:px-8 py-4 sticky top-0 z-30">
          <div className="flex items-center gap-3 lg:hidden">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs"
              style={{ backgroundColor: client.accentColor }}
            >
              {client.businessName.split(' ').map(w => w[0]).join('').slice(0, 2)}
            </div>
            <h1 className="text-base font-semibold text-gray-900">Il nostro andamento</h1>
          </div>
          <div className="hidden lg:block">
            <h1 className="text-xl font-semibold text-gray-900">Il nostro andamento</h1>
            <p className="text-sm text-gray-500 mt-0.5">I risultati dall&apos;inizio della collaborazione</p>
          </div>
        </header>

        <div className="px-4 lg:px-8 py-6 space-y-6 max-w-5xl">
          {/* Grafico storico */}
          {loading ? (
            <SectionCardSkeleton />
          ) : data ? (
            <SectionCard title="Andamento ultime 12 settimane" icon="📈">
              <MultiLineChart
                data={data.weeklyHistory.map((w) => ({
                  weekStart: w.weekStart,
                  lead: w.leads,
                  appuntamenti: w.appointments,
                  emailAperte: w.emailOpened,
                }))}
                lines={[
                  { dataKey: 'lead', color: client.accentColor, name: 'Nuovi interessati' },
                  { dataKey: 'appuntamenti', color: '#10B981', name: 'Appuntamenti' },
                  { dataKey: 'emailAperte', color: '#F59E0B', name: 'Email aperte' },
                ]}
              />
            </SectionCard>
          ) : null}

          {/* Totali */}
          <div>
            <h3 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
              🏆 I vostri risultati totali
            </h3>
            {loading ? (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <KpiCardSkeleton />
                <KpiCardSkeleton />
                <KpiCardSkeleton />
                <KpiCardSkeleton />
              </div>
            ) : data ? (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <KpiCard
                  label="Persone raggiunte"
                  value={formatNumber(data.totals.totalReach)}
                  subtitle="Dall'inizio della collaborazione"
                  icon={<Users className="w-4 h-4" />}
                  accentColor={client.accentColor}
                />
                <KpiCard
                  label="Nuovi interessati"
                  value={formatNumber(data.totals.totalLeads)}
                  subtitle="Hanno lasciato i contatti"
                  icon={<Target className="w-4 h-4" />}
                  accentColor={client.accentColor}
                />
                <KpiCard
                  label="Appuntamenti"
                  value={formatNumber(data.totals.totalAppointments)}
                  subtitle="Sono venuti da voi"
                  subtitleColor="text-green-600"
                  icon={<Calendar className="w-4 h-4" />}
                  accentColor={client.accentColor}
                />
                <KpiCard
                  label="Email inviate"
                  value={formatNumber(data.totals.totalEmailsSent)}
                  subtitle="Ai vostri contatti"
                  icon={<Mail className="w-4 h-4" />}
                  accentColor={client.accentColor}
                />
              </div>
            ) : null}
          </div>
        </div>
      </main>
    </div>
  );
}
