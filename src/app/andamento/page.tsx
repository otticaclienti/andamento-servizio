'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { getMockAndamentoData, mockClients } from '@/lib/mock-data';
import { formatNumber } from '@/lib/utils';
import { ClientSidebar, ClientBottomNav } from '@/components/layout/client-nav';
import { KpiCard, KpiCardSkeleton } from '@/components/ui/kpi-card';
import { SectionCard, SectionCardSkeleton } from '@/components/ui/section-card';
import { FadeIn } from '@/components/ui/fade-in';
import { MultiLineChart } from '@/components/charts/line-chart';
import { SimpleBarChart } from '@/components/charts/bar-chart';
import { Users, Target, Calendar, Mail, MessageCircle } from 'lucide-react';
import type { AndamentoData } from '@/types';

export default function AndamentoPage() {
  const { user, loading: authLoading, viewAsClientId } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<AndamentoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'settimane' | 'mesi'>('mesi');

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

  // Monthly comparison
  const currentMonth = data?.monthlyHistory?.[data.monthlyHistory.length - 1];
  const prevMonth = data?.monthlyHistory?.[data.monthlyHistory.length - 2];

  return (
    <div className="min-h-screen bg-gray-50">
      <ClientSidebar client={client} />
      <ClientBottomNav />

      <main className="lg:ml-64 pb-24 lg:pb-8">
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
          {/* Narrative hero */}
          {!loading && data && (
            <FadeIn>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:p-8">
                <div className="flex items-start gap-3 mb-4">
                  <span className="inline-block w-1.5 h-8 rounded-full shrink-0" style={{ backgroundColor: client.accentColor }} />
                  <div>
                    <h2 className="text-lg lg:text-xl font-bold text-gray-900">
                      In {data.collaborationMonths} mesi abbiamo portato {formatNumber(data.totals.totalLeads)} nuove persone interessate alla vostra ottica
                    </h2>
                    <p className="text-sm text-gray-500 mt-2">
                      Collaboriamo dal {new Date(data.collaborationStartDate).toLocaleDateString('it-IT', { month: 'long', year: 'numeric' })}.
                      {currentMonth && prevMonth && currentMonth.leads > prevMonth.leads
                        ? ` Questo mese state crescendo del ${Math.round(((currentMonth.leads - prevMonth.leads) / prevMonth.leads) * 100)}% rispetto al mese scorso.`
                        : ' Continuiamo a lavorare insieme per far crescere i risultati.'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </FadeIn>
          )}

          {/* Confronto mese corrente vs precedente */}
          {!loading && currentMonth && prevMonth && (
            <FadeIn delay={100}>
              <SectionCard title={`${currentMonth.label} vs ${prevMonth.label}`} icon="📊">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <KpiCard
                    label="Nuovi contatti"
                    value={currentMonth.leads}
                    subtitle={currentMonth.leads > prevMonth.leads ? 'In crescita!' : 'Stiamo ottimizzando'}
                    subtitleColor={currentMonth.leads > prevMonth.leads ? 'text-green-600' : 'text-amber-600'}
                    icon={<Target className="w-4 h-4" />}
                    accentColor={client.accentColor}
                    previousValue={prevMonth.leads}
                    currentNumeric={currentMonth.leads}
                  />
                  <KpiCard
                    label="Appuntamenti"
                    value={currentMonth.appointments}
                    subtitle="Sono venuti da voi"
                    subtitleColor="text-green-600"
                    icon={<Calendar className="w-4 h-4" />}
                    accentColor="#10B981"
                    previousValue={prevMonth.appointments}
                    currentNumeric={currentMonth.appointments}
                  />
                  <KpiCard
                    label="Persone raggiunte"
                    value={formatNumber(currentMonth.reach)}
                    subtitle="Nella vostra zona"
                    icon={<Users className="w-4 h-4" />}
                    accentColor={client.accentColor}
                    previousValue={prevMonth.reach}
                    currentNumeric={currentMonth.reach}
                  />
                  <KpiCard
                    label="Email inviate"
                    value={formatNumber(currentMonth.emailsSent)}
                    subtitle="Ai vostri contatti"
                    icon={<Mail className="w-4 h-4" />}
                    accentColor="#F59E0B"
                    previousValue={prevMonth.emailsSent}
                    currentNumeric={currentMonth.emailsSent}
                  />
                </div>
              </SectionCard>
            </FadeIn>
          )}

          {/* View toggle + Chart */}
          {loading ? (
            <SectionCardSkeleton />
          ) : data ? (
            <FadeIn delay={200}>
              <SectionCard title="Andamento nel tempo" icon="📈">
                {/* Toggle */}
                <div className="flex gap-1 p-1 bg-gray-100 rounded-lg w-fit mb-5">
                  <button
                    onClick={() => setView('mesi')}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      view === 'mesi' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
                    }`}
                  >
                    Per mese
                  </button>
                  <button
                    onClick={() => setView('settimane')}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      view === 'settimane' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
                    }`}
                  >
                    Per settimana
                  </button>
                </div>

                {view === 'settimane' ? (
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
                ) : data.monthlyHistory ? (
                  <MultiLineChart
                    data={data.monthlyHistory.map((m) => ({
                      weekStart: m.month,
                      lead: m.leads,
                      appuntamenti: m.appointments,
                      emailAperte: Math.round(m.emailsSent * 0.31),
                    }))}
                    lines={[
                      { dataKey: 'lead', color: client.accentColor, name: 'Nuovi contatti' },
                      { dataKey: 'appuntamenti', color: '#10B981', name: 'Appuntamenti' },
                      { dataKey: 'emailAperte', color: '#F59E0B', name: 'Email aperte' },
                    ]}
                  />
                ) : null}
              </SectionCard>
            </FadeIn>
          ) : null}

          {/* Investimento mensile */}
          {!loading && data?.monthlyHistory && (
            <FadeIn delay={300}>
              <SectionCard title="Investimento pubblicitario" icon="💶">
                <SimpleBarChart
                  data={data.monthlyHistory.map((m) => ({ weekStart: m.month, value: m.spend }))}
                  color={client.accentColor}
                  label="Spesa €"
                />
              </SectionCard>
            </FadeIn>
          )}

          {/* Totali */}
          {!loading && data && (
            <FadeIn delay={400}>
              <div>
                <h3 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  🏆 I vostri risultati totali
                </h3>
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
              </div>
            </FadeIn>
          )}
        </div>
      </main>

      {/* WhatsApp floating button - mobile */}
      <a
        href="https://wa.me/393XXXXXXXXX"
        target="_blank"
        rel="noopener noreferrer"
        className="lg:hidden fixed bottom-20 right-4 z-50 w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transition-colors"
      >
        <MessageCircle className="w-6 h-6 text-white" />
      </a>
    </div>
  );
}
