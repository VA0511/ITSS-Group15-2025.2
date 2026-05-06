import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';
import useThemeStore from '@/store/useThemeStore';

const data = [
  { name: 'VIP', sold: 52 },
  { name: 'Gói 6 tháng', sold: 36 },
  { name: 'Gói 3 tháng', sold: 28 },
  { name: 'Gói PT', sold: 19 },
  { name: 'Lớp nhóm', sold: 15 },
];

const PackagePerformanceChart = ({ className }) => {
  const isDark = useThemeStore((state) => state.theme === 'dark');

  return (
    <div className={cn('rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950', className)}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-white">Gói tập bán chạy</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">Số lượng gói tập đã bán trong tháng</p>
      </div>

      <div className="h-[300px] w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#374151' : '#e5e7eb'} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: isDark ? '#9ca3af' : '#6b7280' }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: isDark ? '#9ca3af' : '#6b7280' }} />
            <Tooltip cursor={{ fill: isDark ? '#1f2937' : '#f3f4f6' }} />
            <Bar dataKey="sold" name="Số gói" fill={isDark ? '#a78bfa' : '#7c3aed'} radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PackagePerformanceChart;
