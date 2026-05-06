import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, BarChart3, Users, Download } from 'lucide-react';
import Button from '@/components/Common/Button';

const cards = [
  {
    title: 'Báo cáo doanh thu',
    description: 'Theo dõi tổng doanh thu, bán hàng gói tập và xu hướng dòng tiền.',
    path: '/owner/reports/revenue',
    icon: BarChart3,
  },
  {
    title: 'Báo cáo hội viên',
    description: 'Theo dõi hội viên mới, tỷ lệ gia hạn và hoạt động CRM.',
    path: '/owner/reports/members',
    icon: Users,
  },
  {
    title: 'Báo cáo nhân sự',
    description: 'Giám sát hiệu suất PT, quản lý nhân sự và KPI hàng tháng.',
    path: '/owner/reports/staff',
    icon: FileText,
  },
];

const ReportsOverview = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Báo cáo chủ phòng tập</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Tập trung tất cả các báo cáo chiến lược để ra quyết định nhanh và chính xác.
          </p>
        </div>
        <Button leftIcon={<Download className="h-4 w-4" />}>Xuất báo cáo tổng hợp</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.title} to={card.path} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-gray-800 dark:bg-gray-950">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-300 mb-4">
                <Icon className="h-6 w-6" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{card.title}</h2>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{card.description}</p>
              <div className="mt-6 text-sm font-medium text-blue-600 dark:text-blue-400">Xem chi tiết →</div>
            </Link>
          );
        })}
      </div>

      <div className="rounded-3xl border border-dashed border-gray-200 bg-blue-50/50 p-6 text-sm text-gray-700 dark:border-gray-700 dark:bg-blue-950/30 dark:text-gray-300">
        <p className="font-semibold">Lời khuyên:</p>
        <p className="mt-2">Chủ phòng tập nên sử dụng báo cáo doanh thu để đo lường KPI và phản hồi chiến lược. Báo cáo hội viên giúp phát hiện xu hướng giữ chân, còn báo cáo nhân sự hỗ trợ đánh giá hiệu suất và chi phí nhân lực.</p>
      </div>
    </div>
  );
};

export default ReportsOverview;
