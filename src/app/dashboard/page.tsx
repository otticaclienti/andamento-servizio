'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { getMockDashboardData } from '@/lib/mock-data';
import { mockClients } from '@/lib/mock-data';
import { formatNumber, formatCurrency, getLeadMessage, getOpenRateMessage, getStatusLabel, getStatusColor } from '@/lib/utils';
import { ClientSidebar, ClientBottomNav } from '@/components/layout/client-nav';
import { KpiCard, KpiCardSkeleton } from '@/components/ui/kpi-card';
import { SectionCard, SectionCardSkeleton } from '@/components/ui/section-card';
import { ProgressBar } from '@/components/ui/progress-bar';
import { ProgressRing } from '@/components/ui/progress-ring';
import { Badge } from '@/components/ui/badge';
import { FadeIn } from '@/components/ui/fade-in';
import { ConversationModal } from '@/components/ui/conversation-modal';
import { SimpleBarChart } from '@/components/charts/bar-chart';
import { DualBarChart } from '@/components/charts/dual-bar-chart';
import { Users, Target, Euro, Mail, MousePointerClick, MessageSquareReply, Eye, RefreshCw, MessageCircle } from 'lucide-react';
import type { DashboardData, Conversation } from '@/types';

export default function DashboardPage() {
  const { user, loading: authLoading, viewAsClientId } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [noteRead, setNoteRead] = useState(false);

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
        const dashData = getMockDashboardData(effectiveClientId);
        setData(dashData);
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

  const client = data?.client || mockClients.find((c) => c.id === effectiveClientId);
  if (!client) return null;

  const leadMsg = data ? getLeadMessage(data.ads.leads) : null;

  const weekStart = data ? new Date(data.ads.weekStart) : null;
  const weekEnd = weekStart ? new Date(weekStart) : null;
  if (weekEnd) weekEnd.setDate(weekEnd.getDate() + 6);
  const weekLabel = weekStart && weekEnd
    ? `${weekStart.toLocaleDateString('it-IT', { day: 'numeric', month: 'short' })} — ${weekEnd.toLocaleDateString('it-IT', { day: 'numeric', month: 'short', year: 'numeric' })}`
    : null;

  const objectivesMonthLabel = new Date().toLocaleDateString('it-IT', { month: 'long' });
  const monthLabel = objectivesMonthLabel.charAt(0).toUpperCase() + objectivesMonthLabel.slice(1);
  const now = new Date();
  const monthLastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const remainingDays = Math.max(monthLastDay - now.getDate(), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <ClientSidebar client={client} />
      <ClientBottomNav />

      <main className="lg:ml-64 pb-24 lg:pb-8">
        {/* Header */}
        <header className="bg-white border-b border-gray-100 px-4 lg:px-8 py-4 sticky top-0 z-30">
          <div className="flex items-center gap-3 lg:hidden">
            {client.logoUrl ? (
              <img src={client.logoUrl} alt={client.businessName} className="w-8 h-8 rounded-lg object-cover" />
            ) : (
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs"
                style={{ backgroundColor: client.accentColor }}
              >
                {client.businessName.split(' ').map(w => w[0]).join('').slice(0, 2)}
              </div>
            )}
            <div className="min-w-0">
              <h1 className="text-base font-semibold text-gray-900 truncate">{client.businessName}</h1>
              <p className="text-xs text-gray-500">Aggiornamento settimanale</p>
            </div>
          </div>
          <div className="hidden lg:block">
            <h1 className="text-xl font-semibold text-gray-900">
              Buongiorno, {client.businessName.split(' ').slice(-1)[0]} 👋
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">Ecco come stanno andando le cose</p>
          </div>
        </header>

        <div className="px-4 lg:px-8 py-6 space-y-5 lg:space-y-6 max-w-5xl">
          {/* Week indicator + last sync */}
          <FadeIn>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">📅 {weekLabel ?? 'Settimana in corso'}</span>
              </div>
              {data?.lastSyncAt && (
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <RefreshCw className="w-3 h-3" />
                  Aggiornato {new Date(data.lastSyncAt).toLocaleDateString('it-IT', { day: 'numeric', month: 'short' })} alle {new Date(data.lastSyncAt).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}
                </div>
              )}
            </div>
          </FadeIn>

          {/* Nota settimanale */}
          {loading ? (
            <SectionCardSkeleton />
          ) : data?.weeklyNote ? (
            <FadeIn delay={100}>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
                  <h3 className="text-base lg:text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <span className="inline-block w-1.5 h-6 rounded-full" style={{ backgroundColor: client.accentColor }} />
                    <span>Il vostro aggiornamento settimanale</span>
                  </h3>
                  {!data.weeklyNote.isRead && !noteRead && <Badge text="Nuovo" variant="new" />}
                </div>
                <div className="p-5 lg:p-6">
                  <p className="text-gray-700 leading-relaxed text-[15px]">{data.weeklyNote.content}</p>
                  {!data.weeklyNote.isRead && !noteRead && (
                    <button
                      onClick={() => setNoteRead(true)}
                      className="mt-4 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      Segna come letto ✓
                    </button>
                  )}
                </div>
              </div>
            </FadeIn>
          ) : (
            <FadeIn delay={100}>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
                <span className="text-3xl mb-2 block">📝</span>
                <p className="text-sm font-medium text-gray-700">La prossima nota arriva lunedì mattina</p>
                <p className="text-xs text-gray-400 mt-1">Ogni lunedì prepariamo un riepilogo personalizzato per voi</p>
              </div>
            </FadeIn>
          )}

          {/* Obiettivi del mese */}
          {loading ? (
            <SectionCardSkeleton />
          ) : data?.objectives ? (
            <FadeIn delay={200}>
              <SectionCard title={`Obiettivi di ${monthLabel}`} icon="🎯">
                <div className="grid grid-cols-3 gap-6">
                  <ProgressRing
                    value={data.objectives.leadsCurrent}
                    target={data.objectives.leadsTarget}
                    label="Nuovi contatti"
                    accentColor={client.accentColor}
                  />
                  <ProgressRing
                    value={data.objectives.appointmentsCurrent}
                    target={data.objectives.appointmentsTarget}
                    label="Appuntamenti"
                    accentColor="#10B981"
                  />
                  <ProgressRing
                    value={Math.round(data.objectives.reachCurrent / 1000)}
                    target={Math.round(data.objectives.reachTarget / 1000)}
                    label="Persone (migliaia)"
                    accentColor="#F59E0B"
                  />
                </div>
                <p className="text-center text-sm text-gray-500 mt-4 italic">
                  Mancano ancora {remainingDays} {remainingDays === 1 ? 'giorno' : 'giorni'} alla fine del mese - siamo sulla buona strada!
                </p>
              </SectionCard>
            </FadeIn>
          ) : null}

          {/* Sezione Pubblicità */}
          {loading ? (
            <SectionCardSkeleton />
          ) : data ? (
            <FadeIn delay={300}>
              <SectionCard title="Pubblicità" icon="📣">
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  <KpiCard
                    label="Persone raggiunte"
                    value={formatNumber(data.ads.reach)}
                    subtitle="Nella vostra zona"
                    icon={<Eye className="w-4 h-4" />}
                    accentColor={client.accentColor}
                    previousValue={data.adsPreviousWeek.reach}
                    currentNumeric={data.ads.reach}
                  />
                  <KpiCard
                    label="Nuovi interessati"
                    value={data.ads.leads}
                    subtitle={leadMsg?.text}
                    subtitleColor={leadMsg?.color}
                    icon={<Target className="w-4 h-4" />}
                    accentColor={client.accentColor}
                    previousValue={data.adsPreviousWeek.leads}
                    currentNumeric={data.ads.leads}
                  />
                  <KpiCard
                    label="Investimento"
                    value={formatCurrency(data.ads.spend)}
                    subtitle="Questa settimana"
                    icon={<Euro className="w-4 h-4" />}
                    accentColor={client.accentColor}
                    previousValue={data.adsPreviousWeek.spend}
                    currentNumeric={data.ads.spend}
                  />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-3">Nuovi interessati per settimana</h4>
                  <SimpleBarChart
                    data={data.adsHistory.map((a) => ({ weekStart: a.weekStart, value: a.leads }))}
                    color={client.accentColor}
                    label="Lead"
                  />
                </div>
              </SectionCard>
            </FadeIn>
          ) : null}

          {/* Sezione WhatsApp */}
          {loading ? (
            <SectionCardSkeleton />
          ) : data ? (
            <FadeIn delay={400}>
              <SectionCard title="Riattivazione clienti" icon="💬">
                <div className="mb-6">
                  <ProgressBar
                    current={data.whatsapp.contacted}
                    total={data.whatsapp.totalDatabase}
                    label="Abbiamo contattato"
                    accentColor={client.accentColor}
                  />
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  <KpiCard
                    label="Hanno risposto"
                    value={formatNumber(data.whatsapp.replied)}
                    subtitle="Stanno mostrando interesse"
                    subtitleColor="text-green-600"
                    icon={<MessageSquareReply className="w-4 h-4" />}
                    accentColor={client.accentColor}
                    previousValue={data.whatsappPreviousWeek.replied}
                    currentNumeric={data.whatsapp.replied}
                  />
                  <KpiCard
                    label="Appuntamenti fissati"
                    value={data.whatsapp.appointments}
                    subtitle="Pronti a venire da voi"
                    subtitleColor="text-green-600"
                    icon={<Users className="w-4 h-4" />}
                    accentColor={client.accentColor}
                    previousValue={data.whatsappPreviousWeek.appointments}
                    currentNumeric={data.whatsapp.appointments}
                  />
                  <KpiCard
                    label="In conversazione"
                    value={data.whatsapp.activeConversations}
                    subtitle="L'agente sta parlando con loro"
                    icon={<Target className="w-4 h-4" />}
                    accentColor={client.accentColor}
                    previousValue={data.whatsappPreviousWeek.activeConversations}
                    currentNumeric={data.whatsapp.activeConversations}
                  />
                </div>

                {/* Conversazioni recenti */}
                {data.conversations.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-600 mb-3">Ultime conversazioni</h4>
                    <div className="space-y-2">
                      {data.conversations.map((conv) => (
                        <button
                          key={conv.id}
                          onClick={() => setSelectedConversation(conv)}
                          className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left border border-gray-50"
                        >
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium text-sm shrink-0"
                            style={{ backgroundColor: client.accentColor }}
                          >
                            {conv.contactName.split(' ').map(w => w[0]).join('')}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-sm font-medium text-gray-900 truncate">{conv.contactName}</span>
                              <span className="text-xs text-gray-400 shrink-0">{conv.time}</span>
                            </div>
                            <p className="text-sm text-gray-500 truncate">{conv.lastMessage}</p>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${getStatusColor(conv.status)}`}>
                              {getStatusLabel(conv.status)}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </SectionCard>
            </FadeIn>
          ) : null}

          {/* Sezione Email */}
          {loading ? (
            <SectionCardSkeleton />
          ) : data ? (
            <FadeIn delay={500}>
              <SectionCard title="Email marketing" icon="📧">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <KpiCard
                    label="Email inviate"
                    value={formatNumber(data.email.sent)}
                    subtitle="Questa settimana"
                    icon={<Mail className="w-4 h-4" />}
                    accentColor={client.accentColor}
                    previousValue={data.emailPreviousWeek.sent}
                    currentNumeric={data.email.sent}
                  />
                  <KpiCard
                    label="Tasso apertura"
                    value={`${data.email.openRate}%`}
                    subtitle={getOpenRateMessage(data.email.openRate)}
                    subtitleColor={data.email.openRate >= 25 ? 'text-green-600' : 'text-amber-600'}
                    icon={<Eye className="w-4 h-4" />}
                    accentColor={client.accentColor}
                    previousValue={data.emailPreviousWeek.openRate}
                    currentNumeric={data.email.openRate}
                  />
                  <KpiCard
                    label="Hanno cliccato"
                    value={data.email.clicks}
                    subtitle="Vogliono saperne di più"
                    icon={<MousePointerClick className="w-4 h-4" />}
                    accentColor={client.accentColor}
                    previousValue={data.emailPreviousWeek.clicks}
                    currentNumeric={data.email.clicks}
                  />
                  <KpiCard
                    label="Risposte ricevute"
                    value={data.email.replies}
                    subtitle="Vi hanno scritto"
                    subtitleColor="text-green-600"
                    icon={<MessageSquareReply className="w-4 h-4" />}
                    accentColor={client.accentColor}
                    previousValue={data.emailPreviousWeek.replies}
                    currentNumeric={data.email.replies}
                  />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-3">Email inviate e aperture per settimana</h4>
                  <DualBarChart
                    data={data.emailHistory.map((e) => ({
                      weekStart: e.weekStart,
                      value1: e.sent,
                      value2: Math.round(e.sent * e.openRate / 100),
                    }))}
                    color1={client.accentColor}
                    color2="#10B981"
                    label1="Inviate"
                    label2="Aperte"
                  />
                </div>
              </SectionCard>
            </FadeIn>
          ) : null}

          {/* Consigli della settimana */}
          {!loading && data?.suggestions && data.suggestions.length > 0 && (
            <FadeIn delay={600}>
              <SectionCard title="I nostri consigli" icon="💡">
                <div className="space-y-3">
                  {data.suggestions.map((s, i) => (
                    <div
                      key={i}
                      className={`flex items-start gap-3 p-4 rounded-xl ${
                        s.priority === 'high' ? 'bg-blue-50 border border-blue-100' :
                        s.priority === 'medium' ? 'bg-gray-50 border border-gray-100' :
                        'bg-gray-50 border border-gray-50'
                      }`}
                    >
                      <span className="text-xl shrink-0">{s.icon}</span>
                      <p className="text-sm text-gray-700 leading-relaxed">{s.text}</p>
                    </div>
                  ))}
                </div>
              </SectionCard>
            </FadeIn>
          )}
        </div>
      </main>

      {/* WhatsApp floating button - mobile */}
      <a
        href="https://wa.me/393XXXXXXXXX"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Apri WhatsApp e scrivici"
        className="lg:hidden fixed bottom-20 right-4 z-50 px-4 py-3 bg-green-500 rounded-full flex items-center gap-2 shadow-lg hover:bg-green-600 transition-colors"
      >
        <MessageCircle className="w-6 h-6 text-white" />
        <span className="text-sm font-medium text-white">Scrivici</span>
      </a>

      {/* Conversation Modal */}
      {selectedConversation && (
        <ConversationModal
          conversation={selectedConversation}
          onClose={() => setSelectedConversation(null)}
        />
      )}
    </div>
  );
}
