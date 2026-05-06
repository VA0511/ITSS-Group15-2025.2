import React from 'react';
import { ArrowUpRight, Users, ShieldCheck, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '@/components/Common/Button';
import StatsCard from '@/components/Dashboard/StatsCard';
import RevenueChart from '@/components/Charts/RevenueChart';
import MemberStatsChart from '@/components/Charts/MemberStatsChart';
import PerformanceChart from '@/components/Charts/PerformanceChart';
import RetentionChart from '@/components/Charts/RetentionChart';
import PackagePerformanceChart from '@/components/Charts/PackagePerformanceChart';
import EquipmentStatusChart from '@/components/Charts/EquipmentStatusChart';

const stats = [
  {
    title: 'Doanh thu tháng này',
    value: '124,500,000 đ',
    icon: ArrowUpRight,
    trend: 'up',
    trendValue: '+18%'
  },
  {
    title: 'Hội viên mới',
    value: '42',
    icon: Users,
    trend: 'up',
    trendValue: '+12%'
  },
  {
    title: 'Tỷ lệ giữ chân',
    value: '89%',
    icon: ShieldCheck,
    trend: 'up',
    trendValue: '+4%'
  },
  {
    title: 'Thiết bị cần bảo trì',
    value: '4',
    icon: Wrench,
    trend: 'neutral',
    trendValue: 'Không đổi'
  }
];

const OwnerDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Tổng quan Chủ phòng tập</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Xem nhanh doanh thu, hội viên, thiết bị và nhân sự để ra quyết định chiến lược.
          </p>
        </div>
        <Link to="/owner/reports" className="flex items-center justify-center">
          <Button variant="outline" size="lg">Xem báo cáo tổng hợp</Button>
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((card) => (
          <StatsCard key={card.title} title={card.title} value={card.value} icon={card.icon} trend={card.trend} trendValue={card.trendValue} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <RevenueChart />
        <RetentionChart />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <MemberStatsChart />
        <PackagePerformanceChart />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <EquipmentStatusChart />
        <PerformanceChart />
      </div>
    </div>
  );
};

export default OwnerDashboard;
