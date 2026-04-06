'use client';

interface SectionCardProps {
  title: string;
  icon?: string;
  children: React.ReactNode;
}

export function SectionCard({ title, icon, children }: SectionCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-50">
        <h3 className="text-base font-semibold text-gray-800 flex items-center gap-2">
          {icon && <span>{icon}</span>}
          {title}
        </h3>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

export function SectionCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden animate-pulse">
      <div className="px-5 py-4 border-b border-gray-50">
        <div className="h-5 bg-gray-100 rounded w-40" />
      </div>
      <div className="p-5 space-y-4">
        <div className="h-4 bg-gray-100 rounded w-full" />
        <div className="h-4 bg-gray-100 rounded w-3/4" />
        <div className="h-32 bg-gray-50 rounded" />
      </div>
    </div>
  );
}
