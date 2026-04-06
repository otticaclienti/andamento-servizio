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
import { Badge } from '@/components/ui/badge';
import { ConversationModal } from '@/components/ui/conversation-modal';
import { SimpleBarChart } from '@/components/charts/bar-chart';
import { DualBarChart } from '@/components/charts/dual-bar-chart';
import { Users, Target, Euro, Mail, MousePointerClick, MessageSquareReply, Eye } from 'lucide-react';
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
      // Simulate loading
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

  return (
    <div className="min-h-screen bg-gray-50">
      <ClientSidebar client={client} />
      <ClientBottomNav />

      <main className="lg:ml-64 pb-20 lg:pb-8">
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
            <h1 className="text-xl font-semibold text-gray-900">Questa settimana</h1>
            <p className="text-sm text-gray-500 mt-0.5">Ecco come stanno andando le cose</p>
          </div>
        </header>

        <div className="px-4 lg:px-8 py-6 space-y-5 lg:space-y-6 max-w-5xl">
          {/* Nota settimanale */}
          {loading ? (
            <SectionCardSkeleton />
          ) : data?.weeklyNote ? (
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
          ) : null}

          {/* Sezione Pubblicità */}
          {loading ? (
            <SectionCardSkeleton />
          ) : data ? (
            <SectionCard title="Pubblicità" icon="📣">
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <KpiCard
                  label="Persone raggiunte"
                  value={formatNumber(data.ads.reach)}
                  subtitle="Nella vostra zona"
                  icon={<Eye className="w-4 h-4" />}
                  accentColor={client.accentColor}
                />
                <KpiCard
                  label="Nuovi interessati"
                  value={data.ads.leads}
                  subtitle={leadMsg?.text}
                  subtitleColor={leadMsg?.color}
                  icon={<Target className="w-4 h-4" />}
                  accentColor={client.accentColor}
                />
                <KpiCard
                  label="Investimento"
                  value={formatCurrency(data.ads.spend)}
                  subtitle="Questa settimana"
                  icon={<Euro className="w-4 h-4" />}
                  accentColor={client.accentColor}
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
          ) : null}

          {/* Sezione WhatsApp */}
          {loading ? (
            <SectionCardSkeleton />
          ) : data ? (
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
                />
                <KpiCard
                  label="Appuntamenti fissati"
                  value={data.whatsapp.appointments}
                  subtitle="Pronti a venire da voi"
                  subtitleColor="text-green-600"
                  icon={<Users className="w-4 h-4" />}
                  accentColor={client.accentColor}
                />
                <KpiCard
                  label="In conversazione"
                  value={data.whatsapp.activeConversations}
                  subtitle="L'agente sta parlando con loro"
                  icon={<Target className="w-4 h-4" />}
                  accentColor={client.accentColor}
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
          ) : null}

          {/* Sezione Email */}
          {loading ? (
            <SectionCardSkeleton />
          ) : data ? (
            <SectionCard title="Email marketing" icon="📧">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <KpiCard
                  label="Email inviate"
                  value={formatNumber(data.email.sent)}
                  subtitle="Questa settimana"
                  icon={<Mail className="w-4 h-4" />}
                  accentColor={client.accentColor}
                />
                <KpiCard
                  label="Tasso apertura"
                  value={`${data.email.openRate}%`}
                  subtitle={getOpenRateMessage(data.email.openRate)}
                  subtitleColor={data.email.openRate >= 25 ? 'text-green-600' : 'text-amber-600'}
                  icon={<Eye className="w-4 h-4" />}
                  accentColor={client.accentColor}
                />
                <KpiCard
                  label="Hanno cliccato"
                  value={data.email.clicks}
                  subtitle="Vogliono saperne di più"
                  icon={<MousePointerClick className="w-4 h-4" />}
                  accentColor={client.accentColor}
                />
                <KpiCard
                  label="Risposte ricevute"
                  value={data.email.replies}
                  subtitle="Vi hanno scritto"
                  subtitleColor="text-green-600"
                  icon={<MessageSquareReply className="w-4 h-4" />}
                  accentColor={client.accentColor}
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
          ) : null}

          {/* WhatsApp CTA */}
          <div className="text-center py-4 lg:hidden">
            <a
              href="https://wa.me/393XXXXXXXXX"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-green-500 text-white text-sm font-medium hover:bg-green-600 transition-colors shadow-sm"
            >
              💬 Hai domande? Scrivici
            </a>
          </div>
        </div>
      </main>

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
