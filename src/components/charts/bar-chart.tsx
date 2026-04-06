'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatWeekLabel } from '@/lib/utils';

interface SimpleBarChartProps {
  data: { weekStart: string; value: number }[];
  color?: string;
  label?: string;
}

export function SimpleBarChart({ data, color = '#3B82F6', label = 'Valore' }: SimpleBarChartProps) {
  const chartData = data.map((d) => ({
    name: formatWeekLabel(d.weekStart),
    [label]: d.value,
  }));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#9CA3AF' }} />
        <YAxis tick={{ fontSize: 12, fill: '#9CA3AF' }} />
        <Tooltip
          contentStyle={{
            borderRadius: 8,
            border: '1px solid #e5e7eb',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            fontSize: 13,
          }}
        />
        <Bar dataKey={label} fill={color} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
