export function formatNumber(n: number): string {
  return n.toLocaleString('it-IT');
}

export function formatCurrency(n: number): string {
  return `€${n.toLocaleString('it-IT')}`;
}

export function formatPercent(n: number): string {
  return `${n}%`;
}

export function formatWeekLabel(weekStart: string): string {
  const months = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];
  // Handle YYYY-MM format (monthly data)
  if (/^\d{4}-\d{2}$/.test(weekStart)) {
    const [, month] = weekStart.split('-');
    return months[parseInt(month, 10) - 1];
  }
  const date = new Date(weekStart);
  const day = date.getDate();
  return `${day} ${months[date.getMonth()]}`;
}

export function getLeadMessage(leads: number): { text: string; color: string } {
  if (leads >= 20) return { text: 'Ottimo risultato! 🎯', color: 'text-green-600' };
  if (leads >= 10) return { text: 'Buoni numeri, si cresce! 📈', color: 'text-green-600' };
  return { text: 'La campagna si sta ottimizzando ⚙️', color: 'text-amber-600' };
}

export function getOpenRateMessage(rate: number): string {
  if (rate >= 30) return 'Ottimo risultato per il settore! 🎯';
  if (rate >= 20) return `Ogni ${Math.round(100 / rate)} email, una viene letta`;
  return 'Stiamo ottimizzando i contenuti ⚙️';
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .filter((w) => w.length > 2 || name.split(' ').length <= 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    in_conversazione: 'In conversazione',
    appuntamento_fissato: 'Appuntamento fissato',
    lead_caldo: 'Lead caldo',
    non_risposto: 'Non risposto',
  };
  return labels[status] || status;
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    in_conversazione: 'bg-blue-100 text-blue-700',
    appuntamento_fissato: 'bg-green-100 text-green-700',
    lead_caldo: 'bg-amber-100 text-amber-700',
    non_risposto: 'bg-gray-100 text-gray-600',
  };
  return colors[status] || 'bg-gray-100 text-gray-600';
}
