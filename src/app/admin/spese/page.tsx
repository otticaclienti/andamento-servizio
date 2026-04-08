'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { mockClients, mockWeeklySpends } from '@/lib/mock-data';
import { getInitials, formatCurrency } from '@/lib/utils';
import { AdminSidebar, AdminMobileHeader } from '@/components/layout/admin-nav';
import { Save, Check, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';

interface SpendRow {
  clientId: string;
  businessName: string;
  accentColor: string;
  amount: string;
  saved: boolean;
  previousAmount: number | null;
}

function getMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export default function SpesePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<SpendRow[]>([]);
  const [selectedWeek, setSelectedWeek] = useState<Date>(() => getMonday(new Date()));
  const [savedAll, setSavedAll] = useState(false);

  const weekStart = selectedWeek.toISOString().split('T')[0];
  const weekEnd = new Date(selectedWeek.getTime() + 6 * 24 * 60 * 60 * 1000);
  const isCurrentWeek = getMonday(new Date()).getTime() === selectedWeek.getTime();

  useEffect(() => {
    if (!authLoading) {
      if (!user || user.role !== 'admin') { router.replace('/login'); return; }
      setLoading(true);
      const timer = setTimeout(() => {
        const prevWeekStart = new Date(selectedWeek.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        const initialRows = mockClients
          .filter((c) => c.isActive)
          .map((c) => {
            const existingSpend = mockWeeklySpends.find((s) => s.clientId === c.id && s.weekStart === weekStart);
            const prevSpend = mockWeeklySpends.find((s) => s.clientId === c.id && s.weekStart === prevWeekStart);
            return {
              clientId: c.id,
              businessName: c.businessName,
              accentColor: c.accentColor,
              amount: existingSpend ? existingSpend.amount.toString() : '',
              saved: !!existingSpend,
              previousAmount: prevSpend ? prevSpend.amount : null,
            };
          });
        setRows(initialRows);
        setLoading(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [user, authLoading, router, weekStart, selectedWeek]);

  const handleAmountChange = (clientId: string, value: string) => {
    setRows((prev) => prev.map((r) => r.clientId === clientId ? { ...r, amount: value, saved: false } : r));
    setSavedAll(false);
  };

  const handleSave = (clientId: string) => {
    setRows((prev) => prev.map((r) => r.clientId === clientId ? { ...r, saved: true } : r));
  };

  const handleSaveAll = () => {
    setRows((prev) => prev.map((r) => (r.amount ? { ...r, saved: true } : r)));
    setSavedAll(true);
    setTimeout(() => setSavedAll(false), 2000);
  };

  const handlePrevWeek = () => setSelectedWeek(new Date(selectedWeek.getTime() - 7 * 24 * 60 * 60 * 1000));
  const handleNextWeek = () => {
    const next = new Date(selectedWeek.getTime() + 7 * 24 * 60 * 60 * 1000);
    if (next <= getMonday(new Date())) setSelectedWeek(next);
  };
  const handleCurrentWeek = () => setSelectedWeek(getMonday(new Date()));

  const totalSpend = rows.reduce((sum, r) => sum + (parseFloat(r.amount) || 0), 0);
  const filledCount = rows.filter((r) => r.amount).length;

  if (authLoading || !user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      <AdminMobileHeader />

      <main className="lg:ml-64 pb-8">
        <header className="bg-white border-b border-gray-100 px-4 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Spese ads settimanali</h1>
              {/* Week navigation */}
              <div className="flex items-center gap-2 mt-2">
                <button onClick={handlePrevWeek} className="p-1 rounded hover:bg-gray-100 transition-colors">
                  <ChevronLeft className="w-4 h-4 text-gray-500" />
                </button>
                <span className="text-sm text-gray-600 min-w-[200px] text-center">
                  {selectedWeek.toLocaleDateString('it-IT', { day: 'numeric', month: 'short' })} — {weekEnd.toLocaleDateString('it-IT', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
                <button
                  onClick={handleNextWeek}
                  disabled={isCurrentWeek}
                  className="p-1 rounded hover:bg-gray-100 transition-colors disabled:opacity-30"
                >
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                </button>
                {!isCurrentWeek && (
                  <button onClick={handleCurrentWeek} className="text-xs text-blue-600 hover:text-blue-800 ml-2">
                    Settimana corrente
                  </button>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              {savedAll && (
                <span className="inline-flex items-center gap-1 text-sm text-green-600">
                  <CheckCircle2 className="w-4 h-4" /> Salvato!
                </span>
              )}
              <button
                onClick={handleSaveAll}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                <Save className="w-4 h-4" />
                Salva tutto
              </button>
            </div>
          </div>
        </header>

        <div className="px-4 lg:px-8 py-6 max-w-3xl">
          {/* Summary bar */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div>
                <span className="text-xs text-gray-400">Totale settimana</span>
                <p className="text-xl font-bold text-gray-900">{formatCurrency(totalSpend)}</p>
              </div>
              <div>
                <span className="text-xs text-gray-400">Compilate</span>
                <p className="text-xl font-bold text-gray-900">{filledCount}/{rows.length}</p>
              </div>
            </div>
            {filledCount < rows.length && (
              <span className="text-xs text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">
                {rows.length - filledCount} da inserire
              </span>
            )}
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 animate-pulse">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg" />
                    <div className="flex-1 h-10 bg-gray-100 rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="divide-y divide-gray-50">
                {rows.map((row) => (
                  <div key={row.clientId} className="flex items-center gap-4 px-5 py-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-xs shrink-0"
                      style={{ backgroundColor: row.accentColor }}
                    >
                      {getInitials(row.businessName)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{row.businessName}</p>
                      {row.previousAmount !== null && (
                        <p className="text-xs text-gray-400">Sett. prec.: {formatCurrency(row.previousAmount)}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">€</span>
                        <input
                          type="number"
                          value={row.amount}
                          onChange={(e) => handleAmountChange(row.clientId, e.target.value)}
                          placeholder={row.previousAmount !== null ? row.previousAmount.toString() : '0'}
                          className="w-28 pl-7 pr-3 py-2 rounded-lg border border-gray-200 text-sm text-right focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                        />
                      </div>
                      <button
                        onClick={() => handleSave(row.clientId)}
                        disabled={!row.amount || row.saved}
                        className={`p-2 rounded-lg transition-colors ${
                          row.saved
                            ? 'text-green-500 bg-green-50'
                            : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                        } disabled:opacity-50`}
                      >
                        {row.saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
