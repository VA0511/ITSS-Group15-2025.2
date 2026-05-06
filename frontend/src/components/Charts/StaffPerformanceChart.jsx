import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { cn } from '@/lib/utils';
import useThemeStore from '@/store/useThemeStore';

const data = [
  { name: 'PT Linh', sessions: 42, score: 95 },
  { name: 'PT Minh', sessions: 35, score: 91 },
  { name: 'PT Huy', sessions: 28, score: 88 },
  { name: 'Lễ tân Thu', sessions: 10, score: 97 },
];

const StaffPerformanceChart = ({ className }) => {
  const isDark = useThemeStore((state) => state.theme === 'dark');

  return (
    <div className={cn('rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950', className)}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-white">Hiệu suất nhân sự</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">Số buổi hoàn thành và điểm đánh giá hiệu suất</p>
      </div>

      <div className="h-[320px] w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#374151' : '#e5e7eb'} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: isDark ? '#9ca3af' : '#6b7280', fontSize: 12 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: isDark ? '#9ca3af' : '#6b7280', fontSize: 12 }} />
            <Tooltip cursor={{ fill: isDark ? '#1f2937' : '#f3f4f6' }} />
            <Legend wrapperStyle={{ paddingTop: '12px' }} />
            <Bar dataKey="sessions" name="Buổi hoàn thành" fill={isDark ? '#60a5fa' : '#2563eb'} radius={[8, 8, 0, 0]} />
            <Bar dataKey="score" name="Điểm KPI" fill={isDark ? '#34d399' : '#10b981'} radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StaffPerformanceChart;
