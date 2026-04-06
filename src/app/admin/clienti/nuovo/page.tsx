'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { AdminSidebar, AdminMobileHeader } from '@/components/layout/admin-nav';
import { ArrowLeft, Check } from 'lucide-react';

const ACCENT_COLORS = [
  '#3B82F6', '#0EA5E9', '#8B5CF6', '#10B981',
  '#F59E0B', '#EF4444', '#EC4899', '#6366F1',
];

export default function NuovoClientePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    businessName: '',
    email: '',
    phone: '',
    address: '',
    accentColor: '#3B82F6',
    ghlLocationId: '',
    ghlApiKey: '',
    sendInvite: true,
  });

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      router.replace('/login');
    }
  }, [user, authLoading, router]);

  const handleSubmit = () => {
    // Mock save
    setSuccess(true);
    setTimeout(() => {
      router.push('/admin');
    }, 2000);
  };

  if (authLoading || !user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminSidebar />
        <AdminMobileHeader />
        <main className="lg:ml-64 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Cliente creato!</h2>
            <p className="text-sm text-gray-500">
              {form.sendInvite
                ? `Email di invito inviata a ${form.email}`
                : 'Il cliente è stato aggiunto al sistema'}
            </p>
          </div>
        </main>
      </div>
    );
  }

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
          <h1 className="text-xl font-semibold text-gray-900">Nuovo cliente</h1>
          <p className="text-sm text-gray-500">Passo {step} di 3</p>
        </header>

        <div className="px-4 lg:px-8 py-6 max-w-2xl">
          {/* Progress */}
          <div className="flex gap-2 mb-8">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  s <= step ? 'bg-gray-900' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>

          {/* Step 1: Info base */}
          {step === 1 && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Informazioni base</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome attività *</label>
                <input
                  type="text"
                  value={form.businessName}
                  onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                  placeholder="es. Ottica Rossi"
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="info@ottica.it"
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefono</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+39 012 345XXXX"
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Indirizzo</label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="Via Roma 1, Città"
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>
              <button
                onClick={() => setStep(2)}
                disabled={!form.businessName || !form.email}
                className="w-full bg-gray-900 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continua
              </button>
            </div>
          )}

          {/* Step 2: Personalizzazione */}
          {step === 2 && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Personalizzazione</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Colore del brand</label>
                <div className="flex gap-3 flex-wrap">
                  {ACCENT_COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => setForm({ ...form, accentColor: color })}
                      className={`w-10 h-10 rounded-lg transition-transform ${
                        form.accentColor === color ? 'ring-2 ring-offset-2 ring-gray-900 scale-110' : ''
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Oppure inserisci un codice colore</label>
                <input
                  type="text"
                  value={form.accentColor}
                  onChange={(e) => setForm({ ...form, accentColor: e.target.value })}
                  placeholder="#3B82F6"
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>

              {/* Preview */}
              <div className="border border-gray-100 rounded-lg p-4 bg-gray-50">
                <p className="text-xs text-gray-400 mb-2">Anteprima</p>
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                    style={{ backgroundColor: form.accentColor }}
                  >
                    {form.businessName ? form.businessName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : 'OT'}
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {form.businessName || 'Nome attività'}
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Indietro
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 bg-gray-900 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                >
                  Continua
                </button>
              </div>
            </div>
          )}

          {/* Step 3: GHL + Invito */}
          {step === 3 && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Collegamento GHL</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">GHL Location ID</label>
                <input
                  type="text"
                  value={form.ghlLocationId}
                  onChange={(e) => setForm({ ...form, ghlLocationId: e.target.value })}
                  placeholder="loc_xxxxx"
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent font-mono"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">GHL API Key</label>
                <input
                  type="password"
                  value={form.ghlApiKey}
                  onChange={(e) => setForm({ ...form, ghlApiKey: e.target.value })}
                  placeholder="ghl_xxxxx"
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent font-mono"
                />
              </div>

              <div className="border-t border-gray-100 pt-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.sendInvite}
                    onChange={(e) => setForm({ ...form, sendInvite: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Invia email di invito</p>
                    <p className="text-xs text-gray-500">Il cliente riceverà un link per accedere alla dashboard</p>
                  </div>
                </label>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Indietro
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 bg-gray-900 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                >
                  Crea cliente
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
