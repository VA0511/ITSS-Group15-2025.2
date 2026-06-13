import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';
import useThemeStore from '@/store/useThemeStore';
import { useTranslation } from 'react-i18next';

const CustomTooltip = ({ active, payload, label, locale }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <p className="mb-1 text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
        <p className="text-base font-bold text-blue-600 dark:text-blue-400">
          {new Intl.NumberFormat(locale, { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

const defaultData = [
  { name: 'T1', total: 12000000 },
  { name: 'T2', total: 18000000 },
  { name: 'T3', total: 15000000 },
  { name: 'T4', total: 25000000 },
  { name: 'T5', total: 22000000 },
  { name: 'T6', total: 30000000 },
  { name: 'T7', total: 28000000 },
];

const RevenueChart = ({ data = defaultData, title, description, className }) => {
  const isDark = useThemeStore((state) => state.theme === 'dark');
  const { t, i18n } = useTranslation('owner');

  const displayTitle = title || t('dashboard.chart.revenue_title', { defaultValue: 'Doanh thu thống kê' });
  const displayDescription = description || t('dashboard.chart.revenue_desc', { defaultValue: 'Biểu đồ doanh thu 7 tháng gần nhất' });

  return (
    <div className={cn("rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950", className)}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-white">{displayTitle}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">{displayDescription}</p>
      </div>
      
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={isDark ? "#3b82f6" : "#2563eb"} stopOpacity={0.3} />
                <stop offset="95%" stopColor={isDark ? "#3b82f6" : "#2563eb"} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "#374151" : "#e5e7eb"} />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: isDark ? "#9ca3af" : "#6b7280" }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: isDark ? "#9ca3af" : "#6b7280" }}
              tickFormatter={(value) => `${value / 1000000}M`}
            />
            <Tooltip content={<CustomTooltip locale={i18n.language} />} />
            <Area 
              type="monotone" 
              dataKey="total" 
              stroke={isDark ? "#3b82f6" : "#2563eb"} 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorTotal)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueChart;
