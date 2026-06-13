import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';
import useThemeStore from '@/store/useThemeStore';
import { useTranslation } from 'react-i18next';

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#f43f5e', '#06b6d4'];
const DARK_COLORS = ['#60a5fa', '#a78bfa', '#34d399', '#fbbf24', '#fb7185', '#22d3ee'];

const CustomTooltip = ({ active, payload, unit }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <p className="font-medium text-gray-900 dark:text-gray-100">{payload[0].name}</p>
        <p className="mt-1 font-bold" style={{ color: payload[0].payload.fill }}>
          {payload[0].value} {unit}
        </p>
      </div>
    );
  }
  return null;
};

const PerformanceChart = ({ data: propData, className, title, description, unit }) => {
  const isDark = useThemeStore((state) => state.theme === 'dark');
  const colors = isDark ? DARK_COLORS : COLORS;
  const { t } = useTranslation('owner');

  const displayTitle = title || t('dashboard.chart.service_dist_title', { defaultValue: 'Phân phối Dịch vụ' });
  const displayDescription = description || t('dashboard.chart.service_dist_desc', { defaultValue: 'Tỷ lệ đăng ký dịch vụ của hội viên' });
  const displayUnit = unit || t('dashboard.chart.service_member_unit', { defaultValue: 'Hội viên' });

  const defaultData = React.useMemo(() => [
    { name: t('package.mock.basic', { defaultValue: 'Gói Cơ Bản' }), value: 400 },
    { name: t('package.mock.vip', { defaultValue: 'Gói VIP' }), value: 300 },
    { name: t('package.mock.trial', { defaultValue: 'Gói Trải Nghiệm' }), value: 200 },
  ], [t]);

  const data = (propData && propData.length > 0) ? propData : defaultData;

  return (
    <div className={cn("rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950", className)}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-white">{displayTitle}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">{displayDescription}</p>
      </div>

      <div className="h-[300px] w-full mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="45%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
              strokeWidth={0}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip unit={displayUnit} />} />
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

export default PerformanceChart;
