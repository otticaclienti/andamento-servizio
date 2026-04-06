'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { formatWeekLabel } from '@/lib/utils';

interface DualBarChartProps {
  data: { weekStart: string; value1: number; value2: number }[];
  color1?: string;
  color2?: string;
  label1?: string;
  label2?: string;
}

export function DualBarChart({
  data,
  color1 = '#3B82F6',
  color2 = '#10B981',
  label1 = 'Inviate',
  label2 = 'Aperture',
}: DualBarChartProps) {
  const chartData = data.map((d) => ({
    name: formatWeekLabel(d.weekStart),
    [label1]: d.value1,
    [label2]: d.value2,
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
        <Legend wrapperStyle={{ fontSize: 12 }} iconType="circle" />
        <Bar dataKey={label1} fill={color1} radius={[4, 4, 0, 0]} />
        <Bar dataKey={label2} fill={color2} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
