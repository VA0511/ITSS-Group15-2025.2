import React from 'react';
import { Download, Award, Users, Clock } from 'lucide-react';
import Button from '@/components/Common/Button';
import StaffPerformanceChart from '@/components/Charts/StaffPerformanceChart';

const stats = [
  { title: 'Nhân sự tổng', value: '18', icon: Users },
  { title: 'PT đạt KPI', value: '92%', icon: Award },
  { title: 'Buổi hoàn thành', value: '384', icon: Clock },
];

const StaffPerformanceReport = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Báo cáo Nhân sự</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Đánh giá hiệu suất nhân viên, buổi tập đã hoàn thành và sự ổn định đội ngũ.
          </p>
        </div>
        <Button leftIcon={<Download className="h-4 w-4" />}>Xuất báo cáo</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((item) => {
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
        <StaffPerformanceChart />
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Nhân sự nổi bật</h2>
          <div className="mt-5 space-y-4 text-sm text-gray-600 dark:text-gray-300">
            <div className="rounded-2xl bg-green-50 p-4 dark:bg-green-950/30">
              <p className="font-semibold">PT Linh</p>
              <p>Đạt 95% hiệu suất với 42 buổi hoàn thành.</p>
            </div>
            <div className="rounded-2xl bg-blue-50 p-4 dark:bg-blue-950/30">
              <p className="font-semibold">Lễ tân Thu</p>
              <p>Giữ tỷ lệ hài lòng khách hàng 97% trong tháng.</p>
            </div>
            <div className="rounded-2xl bg-yellow-50 p-4 dark:bg-yellow-950/30">
              <p className="font-semibold">PT Minh</p>
              <p>Điều phối lịch linh hoạt, giảm xung đột phòng tập 30%.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffPerformanceReport;
