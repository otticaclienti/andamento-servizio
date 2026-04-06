'use client';

import { cn } from '@/lib/utils';

interface KpiCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  subtitleColor?: string;
  icon?: React.ReactNode;
  accentColor?: string;
}

export function KpiCard({ label, value, subtitle, subtitleColor, icon, accentColor }: KpiCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">{label}</span>
        {icon && (
          <span
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
            style={{ backgroundColor: accentColor || '#3B82F6' }}
          >
            {icon}
          </span>
        )}
      </div>
      <span className="text-3xl font-bold text-gray-900 tracking-tight">{value}</span>
      {subtitle && (
        <span className={cn('text-sm italic', subtitleColor || 'text-gray-400')}>
          {subtitle}
        </span>
      )}
    </div>
  );
}

export function KpiCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col gap-2 animate-pulse">
      <div className="h-4 bg-gray-100 rounded w-24" />
      <div className="h-9 bg-gray-100 rounded w-20" />
      <div className="h-4 bg-gray-100 rounded w-32" />
    </div>
  );
}
