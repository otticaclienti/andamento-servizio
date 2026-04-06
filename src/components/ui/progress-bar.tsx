'use client';

interface ProgressBarProps {
  current: number;
  total: number;
  label: string;
  accentColor?: string;
}

export function ProgressBar({ current, total, label, accentColor = '#3B82F6' }: ProgressBarProps) {
  const percent = Math.min(Math.round((current / total) * 100), 100);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-600">{label}</span>
        <span className="text-sm font-medium text-gray-800">
          {current.toLocaleString('it-IT')} su {total.toLocaleString('it-IT')}
        </span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
        <div
          className="h-4 rounded-full transition-all duration-700 ease-out"
          style={{ width: `${percent}%`, backgroundColor: accentColor }}
        />
      </div>
      <div className="text-right mt-1">
        <span className="text-xs text-gray-400">{percent}%</span>
      </div>
    </div>
  );
}
