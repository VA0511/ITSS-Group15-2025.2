import React from 'react';
import { Download, Users, Repeat, TrendingUp } from 'lucide-react';
import Button from '@/components/Common/Button';
import MemberStatsChart from '@/components/Charts/MemberStatsChart';

const summary = [
  { title: 'Hội viên mới tháng này', value: '58', icon: Users },
  { title: 'Gia hạn thành công', value: '72%', icon: Repeat },
  { title: 'Tỷ lệ giữ chân', value: '89%', icon: TrendingUp },
];

const MemberReport = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Báo cáo Hội viên</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Theo dõi lượng hội viên mới, tỷ lệ giữ chân và xu hướng đăng ký gói tập.
          </p>
        </div>
        <Button leftIcon={<Download className="h-4 w-4" />}>Xuất báo cáo</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {summary.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-300">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{item.title}</p>
                  <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">{item.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <MemberStatsChart />
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Giao dịch mới nhất</h2>
          <div className="mt-4 space-y-4 text-sm text-gray-600 dark:text-gray-300">
            <div className="rounded-2xl bg-blue-50 p-4 dark:bg-blue-950/40">
              <p className="font-semibold">Nguyễn Mai</p>
              <p>Đăng ký gói VIP 6 tháng</p>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Hôm qua - 14:12</p>
            </div>
            <div className="rounded-2xl bg-green-50 p-4 dark:bg-green-950/40">
              <p className="font-semibold">Trần Văn A</p>
              <p>Gia hạn gói 3 tháng</p>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Hôm nay - 08:40</p>
            </div>
            <div className="rounded-2xl bg-yellow-50 p-4 dark:bg-yellow-950/30">
              <p className="font-semibold">Lê Thị H</p>
              <p>Chuyển nhượng gói tập PT</p>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Hôm nay - 09:55</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberReport;
