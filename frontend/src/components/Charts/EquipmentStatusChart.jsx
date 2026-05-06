import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';
import useThemeStore from '@/store/useThemeStore';

const data = [
  { name: 'Sẵn sàng', value: 18 },
  { name: 'Bảo trì', value: 4 },
  { name: 'Hỏng', value: 2 },
  { name: 'Mới', value: 6 },
];

const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#3b82f6'];
const DARK_COLORS = ['#34d399', '#fbbf24', '#f87171', '#60a5fa'];

const EquipmentStatusChart = ({ className }) => {
  const isDark = useThemeStore((state) => state.theme === 'dark');
  const colors = isDark ? DARK_COLORS : COLORS;

  return (
    <div className={cn('rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950', className)}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-white">Tình trạng thiết bị</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">Theo dõi số thiết bị đang hoạt động, bảo trì và đã hỏng</p>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="45%" innerRadius={55} outerRadius={95} paddingAngle={4}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ borderRadius: '12px', border: isDark ? '1px solid #374151' : '1px solid #e5e7eb', backgroundColor: isDark ? '#111827' : '#ffffff', color: isDark ? '#f9fafb' : '#111827' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default EquipmentStatusChart;
