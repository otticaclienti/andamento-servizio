'use client';

import { cn } from '@/lib/utils';

interface BadgeProps {
  text: string;
  variant?: 'new' | 'success' | 'warning' | 'neutral';
}

export function Badge({ text, variant = 'neutral' }: BadgeProps) {
  const styles = {
    new: 'bg-blue-100 text-blue-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-amber-100 text-amber-700',
    neutral: 'bg-gray-100 text-gray-600',
  };

  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', styles[variant])}>
      {variant === 'new' && <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-1.5 animate-pulse" />}
      {text}
    </span>
  );
}
