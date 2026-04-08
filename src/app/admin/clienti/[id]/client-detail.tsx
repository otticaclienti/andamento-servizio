'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { mockClients, mockSyncStatuses, getMockDashboardData, mockWeeklySpends } from '@/lib/mock-data';
import { getInitials, formatNumber, formatCurrency } from '@/lib/utils';
import { AdminSidebar, AdminMobileHeader } from '@/components/layout/admin-nav';
import { FadeIn } from '@/components/ui/fade-in';
import {
  ArrowLeft, Eye, RefreshCw, CheckCircle2, AlertCircle, Copy, Pencil, X, Check,
  Power, PowerOff, RotateCcw, Send, FileText, ChevronDown, ChevronUp
} from 'lucide-react';
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
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ phone: '', address: '', email: '', accentColor: '' });
  const [showNote, setShowNote] = useState(false);
  const [noteRegenerated, setNoteRegenerated] = useState(false);

  useEffect(() => {
    if (!authLoading) {
      if (!user || user.role !== 'admin') { router.replace('/login'); return; }
      const c = mockClients.find((c) => c.id === clientId);
      if (!c) { router.replace('/admin/clienti'); return; }
      setClient(c);
      setEditForm({ phone: c.phone, address: c.address, email: c.email, accentColor: c.accentColor });
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

  const handleSaveEdit = () => {
    // Mock save — in production this would call the API
    if (client) {
      setClient({ ...client, ...editForm });
    }
    setEditing(false);
  };

  const handleRegenerateNote = () => {
    setNoteRegenerated(true);
    setTimeout(() => setNoteRegenerated(false), 3000);
  };

  if (authLoading || !client) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
      </div>
    );
  }

  const sync = mockSyncStatuses.find((s) => s.clientId === clientId);
  const clientSpends = mockWeeklySpends.filter((s) => s.clientId === clientId).sort((a, b) => b.weekStart.localeCompare(a.weekStart));

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      <AdminMobileHeader />

      <main className="lg:ml-64 pb-8">
        <header className="bg-white border-b border-gray-100 px-4 lg:px-8 py-4">
          <Link href="/admin/clienti" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-3 transition-colors">
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
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-semibold text-gray-900">{client.businessName}</h1>
                  {client.isActive ? (
                    <span className="px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-700">Attivo</span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-500">Inattivo</span>
                  )}
                </div>
                <p className="text-sm text-gray-500">{client.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleViewAs}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                <Eye className="w-4 h-4" />
                Vedi come il cliente
              </button>
            </div>
          </div>
        </header>

        <div className="px-4 lg:px-8 py-6 max-w-5xl space-y-6">
          {/* Quick stats */}
          {!loading && dashData && (
            <FadeIn>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                  <span className="text-xs text-gray-400">Lead</span>
                  <p className="text-2xl font-bold text-gray-900">{dashData.ads.leads}</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                  <span className="text-xs text-gray-400">Reach</span>
                  <p className="text-2xl font-bold text-gray-900">{formatNumber(dashData.ads.reach)}</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                  <span className="text-xs text-gray-400">Spesa</span>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(dashData.ads.spend)}</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                  <span className="text-xs text-gray-400">Appuntamenti</span>
                  <p className="text-2xl font-bold text-gray-900">{dashData.whatsapp.appointments}</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                  <span className="text-xs text-gray-400">Email inviate</span>
                  <p className="text-2xl font-bold text-gray-900">{dashData.email.sent}</p>
                </div>
              </div>
            </FadeIn>
          )}

          {/* Info card with inline edit */}
          <FadeIn delay={100}>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-800">Informazioni</h3>
                {!editing ? (
                  <button onClick={() => setEditing(true)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors">
                    <Pencil className="w-3.5 h-3.5" /> Modifica
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button onClick={() => setEditing(false)} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-500 border border-gray-200 hover:bg-gray-50">
                      <X className="w-3 h-3" /> Annulla
                    </button>
                    <button onClick={handleSaveEdit} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-gray-900 hover:bg-gray-800">
                      <Check className="w-3 h-3" /> Salva
                    </button>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Email</span>
                  {editing ? (
                    <input value={editForm.email} onChange={(e) => setEditForm({...editForm, email: e.target.value})} className="w-full mt-1 px-3 py-1.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" />
                  ) : (
                    <p className="text-gray-900 mt-0.5">{client.email}</p>
                  )}
                </div>
                <div>
                  <span className="text-gray-400">Telefono</span>
                  {editing ? (
                    <input value={editForm.phone} onChange={(e) => setEditForm({...editForm, phone: e.target.value})} className="w-full mt-1 px-3 py-1.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" />
                  ) : (
                    <p className="text-gray-900 mt-0.5">{client.phone}</p>
                  )}
                </div>
                <div>
                  <span className="text-gray-400">Indirizzo</span>
                  {editing ? (
                    <input value={editForm.address} onChange={(e) => setEditForm({...editForm, address: e.target.value})} className="w-full mt-1 px-3 py-1.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" />
                  ) : (
                    <p className="text-gray-900 mt-0.5">{client.address}</p>
                  )}
                </div>
                <div>
                  <span className="text-gray-400">Accent color</span>
                  {editing ? (
                    <div className="flex items-center gap-2 mt-1">
                      <input type="color" value={editForm.accentColor} onChange={(e) => setEditForm({...editForm, accentColor: e.target.value})} className="w-8 h-8 rounded border-0 cursor-pointer" />
                      <input value={editForm.accentColor} onChange={(e) => setEditForm({...editForm, accentColor: e.target.value})} className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-gray-900" />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 mt-0.5">
                      <div className="w-5 h-5 rounded" style={{ backgroundColor: client.accentColor }} />
                      <span className="text-gray-900 font-mono text-xs">{client.accentColor}</span>
                    </div>
                  )}
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
          </FadeIn>

          {/* Nota settimanale */}
          <FadeIn delay={150}>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <button onClick={() => setShowNote(!showNote)} className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                  <FileText className="w-4 h-4 text-gray-400" />
                  Nota settimanale
                  {showNote ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                </button>
                <button
                  onClick={handleRegenerateNote}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  {noteRegenerated ? 'Rigenerata!' : 'Rigenera con AI'}
                </button>
              </div>
              {showNote && dashData?.weeklyNote && (
                <div className="bg-gray-50 rounded-lg p-4 mt-2">
                  <p className="text-sm text-gray-700 leading-relaxed">{dashData.weeklyNote.content}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    Generata: {new Date(dashData.weeklyNote.generatedAt).toLocaleString('it-IT')}
                    {' · '}
                    {dashData.weeklyNote.isRead ? 'Letta dal cliente' : 'Non ancora letta'}
                  </p>
                </div>
              )}
              {showNote && !dashData?.weeklyNote && (
                <p className="text-sm text-gray-400 italic mt-2">Nessuna nota generata per questa settimana</p>
              )}
            </div>
          </FadeIn>

          {/* Sync status */}
          <FadeIn delay={200}>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-800">Sincronizzazione GHL</h3>
                <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors">
                  <RefreshCw className="w-3.5 h-3.5" /> Sincronizza ora
                </button>
              </div>
              <div className="flex items-center gap-2">
                {sync?.status === 'ok' ? <CheckCircle2 className="w-5 h-5 text-green-500" /> :
                 sync?.status === 'error' ? <AlertCircle className="w-5 h-5 text-amber-500" /> :
                 <div className="w-5 h-5 rounded-full bg-gray-200" />}
                <div>
                  <p className="text-sm text-gray-900">
                    {sync?.status === 'ok' && 'Sincronizzazione completata'}
                    {sync?.status === 'error' && 'Errore nella sincronizzazione'}
                    {(!sync || sync.status === 'never') && 'Mai sincronizzato'}
                  </p>
                  {sync?.lastSync && <p className="text-xs text-gray-400">{new Date(sync.lastSync).toLocaleString('it-IT')}</p>}
                  {sync?.errorMessage && <p className="text-xs text-amber-600 mt-0.5">{sync.errorMessage}</p>}
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Spend history */}
          <FadeIn delay={250}>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <h3 className="text-sm font-semibold text-gray-800 mb-3">Storico spese ads</h3>
              {clientSpends.length > 0 ? (
                <div className="space-y-2">
                  {clientSpends.map((s) => (
                    <div key={s.weekStart} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                      <div>
                        <p className="text-sm text-gray-700">Settimana del {new Date(s.weekStart).toLocaleDateString('it-IT', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                        <p className="text-xs text-gray-400">Inserito {new Date(s.updatedAt).toLocaleDateString('it-IT')}</p>
                      </div>
                      <span className="text-sm font-bold text-gray-900">{formatCurrency(s.amount)}</span>
                    </div>
                  ))}
                  <p className="text-xs text-gray-400 pt-2">
                    Totale: <span className="font-medium text-gray-700">{formatCurrency(clientSpends.reduce((s, r) => s + r.amount, 0))}</span>
                  </p>
                </div>
              ) : (
                <p className="text-sm text-gray-400 italic">Nessuna spesa registrata</p>
              )}
            </div>
          </FadeIn>

          {/* Actions */}
          <FadeIn delay={300}>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <h3 className="text-sm font-semibold text-gray-800 mb-3">Azioni</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-left">
                  <Send className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Invia email di invito</p>
                    <p className="text-xs text-gray-400">Invia link di accesso al cliente</p>
                  </div>
                </button>
                <button className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-left">
                  <RotateCcw className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Resetta password</p>
                    <p className="text-xs text-gray-400">Genera nuova password e invia</p>
                  </div>
                </button>
                <button className={`flex items-center gap-3 p-3 rounded-lg border transition-colors text-left ${client.isActive ? 'border-amber-200 hover:bg-amber-50' : 'border-green-200 hover:bg-green-50'}`}>
                  {client.isActive ? <PowerOff className="w-4 h-4 text-amber-500" /> : <Power className="w-4 h-4 text-green-500" />}
                  <div>
                    <p className="text-sm font-medium text-gray-700">{client.isActive ? 'Disattiva cliente' : 'Riattiva cliente'}</p>
                    <p className="text-xs text-gray-400">{client.isActive ? 'Sospendi accesso alla dashboard' : 'Ripristina accesso alla dashboard'}</p>
                  </div>
                </button>
                <div className="flex items-center gap-2">
                  <input
                    readOnly
                    value={`https://app.oc-agenzia.it/login?email=${client.email}`}
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-xs text-gray-500 bg-gray-50"
                  />
                  <button onClick={handleCopyInvite} className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                    <Copy className="w-4 h-4 text-gray-400" />
                  </button>
                  {copied && <span className="text-xs text-green-600">Copiato!</span>}
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </main>
    </div>
  );
}
