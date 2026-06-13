import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';
import useThemeStore from '@/store/useThemeStore';
import { useTranslation } from 'react-i18next';

const defaultData = [
  { name: 'T2', new: 40, active: 240, dropped: 20 },
  { name: 'T3', new: 30, active: 139, dropped: 10 },
  { name: 'T4', new: 20, active: 980, dropped: 50 },
  { name: 'T5', new: 27, active: 390, dropped: 30 },
  { name: 'T6', new: 18, active: 480, dropped: 15 },
  { name: 'T7', new: 23, active: 380, dropped: 25 },
  { name: 'CN', new: 34, active: 430, dropped: 10 },
];

const MemberStatsChart = ({ data: propData, className, title, description }) => {
  const data = (propData && propData.length > 0) ? propData : defaultData;
  const isDark = useThemeStore((state) => state.theme === 'dark');
  const { t } = useTranslation('owner');

  const displayTitle = title || t('dashboard.chart.member_stats_title', { defaultValue: 'Thống kê hội viên' });
  const displayDescription = description || t('dashboard.chart.member_stats_desc', { defaultValue: 'Tình trạng hội viên trong tuần' });

  return (
    <div className={cn("rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950", className)}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-white">{displayTitle}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">{displayDescription}</p>
      </div>
      
      <div className="h-[300px] w-full mt-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "#374151" : "#e5e7eb"} />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: isDark ? "#9ca3af" : "#6b7280", fontSize: 12 }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: isDark ? "#9ca3af" : "#6b7280", fontSize: 12 }}
            />
            <Tooltip 
              cursor={{ fill: isDark ? '#1f2937' : '#f3f4f6' }}
              contentStyle={{ 
                borderRadius: '8px', 
                border: isDark ? '1px solid #374151' : '1px solid #e5e7eb',
                backgroundColor: isDark ? '#111827' : '#ffffff',
                color: isDark ? '#f9fafb' : '#111827',
              }}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="circle"
            />
            <Bar dataKey="active" name={t('dashboard.chart.member_active', { defaultValue: 'Hoạt động' })} fill={isDark ? "#818cf8" : "#6366f1"} radius={[4, 4, 0, 0]} />
            <Bar dataKey="new" name={t('dashboard.chart.member_new', { defaultValue: 'Đăng ký mới' })} fill={isDark ? "#34d399" : "#10b981"} radius={[4, 4, 0, 0]} />
            <Bar dataKey="dropped" name={t('dashboard.chart.member_expired', { defaultValue: 'Hết hạn' })} fill={isDark ? "#f87171" : "#ef4444"} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MemberStatsChart;
