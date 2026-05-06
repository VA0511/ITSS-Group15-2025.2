import React, { useMemo, useState } from 'react';
import RevenueChart from '@/components/Charts/RevenueChart';
import { Download, TrendingUp, Users } from 'lucide-react';
import Button from '@/components/Common/Button';

const revenueData = {
  monthly: [
    { name: 'T1', total: 12000000 },
    { name: 'T2', total: 18000000 },
    { name: 'T3', total: 15000000 },
    { name: 'T4', total: 25000000 },
    { name: 'T5', total: 22000000 },
    { name: 'T6', total: 30000000 },
    { name: 'T7', total: 28000000 },
  ],
  quarterly: [
    { name: 'Q1', total: 45000000 },
    { name: 'Q2', total: 62000000 },
    { name: 'Q3', total: 58000000 },
    { name: 'Q4', total: 72000000 },
  ],
  yearly: [
    { name: '2023', total: 320000000 },
    { name: '2024', total: 395000000 },
    { name: '2025', total: 440000000 },
  ],
};

const RevenueReport = () => {
  const [period, setPeriod] = useState('monthly');

  const selectedData = useMemo(() => revenueData[period] || revenueData.monthly, [period]);
  const totalRevenue = useMemo(() => selectedData.reduce((sum, item) => sum + item.total, 0), [selectedData]);
  const soldPackages = useMemo(() => Math.max(50, Math.round(selectedData.length * 12)), [selectedData]);

  const descriptionByPeriod = {
    monthly: 'Doanh thu theo tháng gần nhất',
    quarterly: 'Doanh thu theo quý',
    yearly: 'Doanh thu theo năm'
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Báo cáo Doanh thu</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Phân tích số liệu tài chính chuyên sâu.
          </p>
        </div>
        <Button leftIcon={<Download className="h-4 w-4" />}>
          Xuất báo cáo PDF
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Tổng doanh thu</p>
            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalRevenue)}
            </p>
          </div>
          <div className="h-14 w-14 bg-green-100 rounded-full flex items-center justify-center text-green-600 dark:bg-green-900/30 dark:text-green-500">
            <TrendingUp className="h-6 w-6" />
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Số gói bán được</p>
            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{soldPackages}</p>
          </div>
          <div className="h-14 w-14 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 dark:bg-blue-900/30 dark:text-blue-500">
            <Users className="h-6 w-6" />
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Lọc theo kỳ</label>
          <select
            className="mt-3 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-slate-400 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          >
            <option value="monthly">Theo tháng</option>
            <option value="quarterly">Theo quý</option>
            <option value="yearly">Theo năm</option>
          </select>
        </div>
      </div>

      <div className="mt-6">
        <RevenueChart data={selectedData} title="Báo cáo doanh thu" description={descriptionByPeriod[period]} />
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Lịch sử giao dịch gần nhất</h3>
        <p className="text-gray-500 text-sm text-center py-8">Tích hợp dữ liệu giao dịch chi tiết từ API Payment sau...</p>
      </div>
    </div>
  );
};

export default RevenueReport;
