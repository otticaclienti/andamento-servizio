'use client';

import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KpiCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  subtitleColor?: string;
  icon?: React.ReactNode;
  accentColor?: string;
  previousValue?: number;
  currentNumeric?: number;
}

export function KpiCard({ label, value, subtitle, subtitleColor, icon, accentColor, previousValue, currentNumeric }: KpiCardProps) {
  const diff = previousValue !== undefined && currentNumeric !== undefined
    ? currentNumeric - previousValue
    : null;

  const diffPercent = diff !== null && previousValue && previousValue > 0
    ? Math.round((diff / previousValue) * 100)
    : null;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex min-h-[150px] flex-col justify-between gap-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-600">{label}</span>
        {icon && (
          <span
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
            style={{ backgroundColor: accentColor || '#3B82F6' }}
          >
            {icon}
          </span>
        )}
      </div>
      <div>
        <span className="text-3xl font-bold text-gray-900 tracking-tight leading-none">{value}</span>
        {diff !== null && (
          <div className="flex items-center gap-1 mt-1.5">
            {diff > 0 ? (
              <TrendingUp className="w-3.5 h-3.5 text-green-500" />
            ) : diff < 0 ? (
              <TrendingDown className="w-3.5 h-3.5 text-amber-500" />
            ) : (
              <Minus className="w-3.5 h-3.5 text-gray-400" />
            )}
            <span className={cn(
              'text-xs font-medium',
              diff > 0 ? 'text-green-600' : diff < 0 ? 'text-amber-600' : 'text-gray-400'
            )}>
              {diff > 0 ? '+' : ''}{diff}
              {diffPercent !== null ? ` (${diff > 0 ? '+' : ''}${diffPercent}%)` : ''}
              <span className="text-gray-400 font-normal"> vs sett. scorsa</span>
            </span>
          </div>
        )}
      </div>
      {subtitle && (
        <span className={cn('text-sm italic', subtitleColor || 'text-gray-500')}>
          {subtitle}
        </span>
      )}
    </div>
  );
}

export function KpiCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex min-h-[150px] flex-col justify-between gap-2 animate-pulse">
      <div className="h-4 bg-gray-100 rounded w-28" />
      <div>
        <div className="h-9 bg-gray-100 rounded w-24" />
        <div className="h-3 bg-gray-100 rounded w-32 mt-2" />
      </div>
      <div className="h-4 bg-gray-100 rounded w-36" />
    </div>
  );
}
