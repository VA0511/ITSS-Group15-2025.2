import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';
import useThemeStore from '@/store/useThemeStore';
import { useTranslation } from 'react-i18next';

const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#3b82f6'];
const DARK_COLORS = ['#34d399', '#fbbf24', '#f87171', '#60a5fa'];

const EquipmentStatusChart = ({ className, title, description }) => {
  const isDark = useThemeStore((state) => state.theme === 'dark');
  const colors = isDark ? DARK_COLORS : COLORS;
  const { t } = useTranslation('owner');

  const displayTitle = title || t('dashboard.chart.equipment_status_title', { defaultValue: 'Tình trạng thiết bị' });
  const displayDescription = description || t('dashboard.chart.equipment_status_desc', { defaultValue: 'Theo dõi số thiết bị đang hoạt động, bảo trì và đã hỏng' });

  const chartData = React.useMemo(() => {
    return [
      { name: t('dashboard.chart.equipment_ready', { defaultValue: 'Sẵn sàng' }), value: 18 },
      { name: t('dashboard.chart.equipment_maintenance', { defaultValue: 'Bảo trì' }), value: 4 },
      { name: t('dashboard.chart.equipment_broken', { defaultValue: 'Hỏng' }), value: 2 },
      { name: t('dashboard.chart.equipment_new', { defaultValue: 'Mới' }), value: 6 },
    ];
  }, [t]);

  return (
    <div className={cn('rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950', className)}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-white">{displayTitle}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">{displayDescription}</p>
      </div>

      <div className="h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="42%" innerRadius={55} outerRadius={90} paddingAngle={4}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ borderRadius: '12px', border: isDark ? '1px solid #374151' : '1px solid #e5e7eb', backgroundColor: isDark ? '#111827' : '#ffffff', color: isDark ? '#f9fafb' : '#111827' }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default EquipmentStatusChart;
