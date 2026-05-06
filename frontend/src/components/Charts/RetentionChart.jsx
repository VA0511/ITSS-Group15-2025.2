import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';
import useThemeStore from '@/store/useThemeStore';

const data = [
  { name: 'Tuần 1', rate: 82 },
  { name: 'Tuần 2', rate: 85 },
  { name: 'Tuần 3', rate: 88 },
  { name: 'Tuần 4', rate: 90 },
  { name: 'Tuần 5', rate: 87 },
  { name: 'Tuần 6', rate: 91 },
  { name: 'Tuần 7', rate: 89 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <p className="mb-1 text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
        <p className="text-base font-bold text-blue-600 dark:text-blue-400">{payload[0].value}%</p>
      </div>
    );
  }
  return null;
};

const RetentionChart = ({ className }) => {
  const isDark = useThemeStore((state) => state.theme === 'dark');

  return (
    <div className={cn('rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950', className)}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-white">Tỷ lệ giữ chân</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">Tỷ lệ hội viên gia hạn so với tuần trước</p>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#374151' : '#e5e7eb'} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: isDark ? '#9ca3af' : '#6b7280' }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: isDark ? '#9ca3af' : '#6b7280' }} tickFormatter={(value) => `${value}%`} />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="rate" stroke={isDark ? '#60a5fa' : '#2563eb'} strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RetentionChart;
