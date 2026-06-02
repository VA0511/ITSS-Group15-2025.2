import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import RevenueChart from '@/components/Charts/RevenueChart';
import { Download, TrendingUp, ShoppingBag, ReceiptText, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Button from '@/components/Common/Button';
import { useTransactions } from '@/hooks/queries/useTransactions';

const parseArr = (raw) => {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw?.data?.data)) return raw.data.data;
  if (Array.isArray(raw?.data)) return raw.data;
  return [];
};

const fmt = (n) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(n);

const RevenueReport = () => {
  const { t } = useTranslation('owner');
  const [period, setPeriod] = useState('monthly');
  const { data: txRaw, isLoading } = useTransactions();
  const transactions = useMemo(() => parseArr(txRaw), [txRaw]);

  const now = new Date();
  const curMonth = now.getMonth();
  const curYear = now.getFullYear();

  // Monthly: last 12 months
  const monthlyData = useMemo(() => {
    const result = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date(curYear, curMonth - i, 1);
      const m = d.getMonth(); const y = d.getFullYear();
      const total = transactions
        .filter(t => { const td = new Date(t.date); return td.getMonth() === m && td.getFullYear() === y; })
        .reduce((s, t) => s + (t.amount || 0), 0);
      result.push({ name: `T${m + 1}/${String(y).slice(2)}`, total });
    }
    return result;
  }, [transactions, curMonth, curYear]);

  // Quarterly: last 8 quarters
  const quarterlyData = useMemo(() => {
    const result = [];
    for (let i = 7; i >= 0; i--) {
      const totalMonths = curYear * 12 + curMonth - i * 3;
      const y = Math.floor(totalMonths / 12);
      const startM = (totalMonths % 12) - 2;
      const qLabel = `Q${Math.floor(startM / 3) + 1}/${String(y).slice(2)}`;
      const total = transactions
        .filter(t => {
          const td = new Date(t.date);
          const tm = td.getMonth(); const ty = td.getFullYear();
          return ty === y && tm >= startM && tm <= startM + 2;
        })
        .reduce((s, t) => s + (t.amount || 0), 0);
      result.push({ name: qLabel, total });
    }
    return result;
  }, [transactions, curMonth, curYear]);

  // Yearly: last 5 years
  const yearlyData = useMemo(() => {
    const result = [];
    for (let i = 4; i >= 0; i--) {
      const y = curYear - i;
      const total = transactions
        .filter(t => new Date(t.date).getFullYear() === y)
        .reduce((s, t) => s + (t.amount || 0), 0);
      result.push({ name: String(y), total });
    }
    return result;
  }, [transactions, curYear]);

  const chartDataMap = { monthly: monthlyData, quarterly: quarterlyData, yearly: yearlyData };
  const selectedData = chartDataMap[period] || monthlyData;

  const totalRevenue = useMemo(() => selectedData.reduce((s, d) => s + d.total, 0), [selectedData]);
  const totalTransactions = useMemo(() => {
    if (period === 'monthly') {
      const d = new Date(curYear, curMonth - 11, 1);
      return transactions.filter(t => new Date(t.date) >= d).length;
    }
    return transactions.length;
  }, [transactions, period, curMonth, curYear]);

  // Recent transactions
  const recentTx = useMemo(() =>
    [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10),
  [transactions]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link to="/owner/reports" className="flex items-center justify-center rounded-lg border border-gray-200 bg-white p-2 text-gray-600 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{t('revenue_report.title')}</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t('revenue_report.subtitle')}</p>
          </div>
        </div>
        <Button leftIcon={<Download className="h-4 w-4" />} onClick={() => window.print()}>{t('revenue_report.export_btn')}</Button>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('revenue_report.stats.total_revenue')}</p>
            <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
              {isLoading ? '...' : fmt(totalRevenue)}
            </p>
          </div>
          <div className="h-14 w-14 bg-green-100 rounded-full flex items-center justify-center text-green-600 dark:bg-green-900/30 dark:text-green-500 shrink-0">
            <TrendingUp className="h-6 w-6" />
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('revenue_report.stats.transactions')}</p>
            <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
              {isLoading ? '...' : totalTransactions}
            </p>
          </div>
          <div className="h-14 w-14 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 dark:bg-blue-900/30 dark:text-blue-500 shrink-0">
            <ShoppingBag className="h-6 w-6" />
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <label className="text-sm font-medium text-gray-600 dark:text-gray-300">{t('revenue_report.filter.label')}</label>
          <select
            className="mt-3 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-slate-400 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          >
            <option value="monthly">{t('revenue_report.filter.monthly')}</option>
            <option value="quarterly">{t('revenue_report.filter.quarterly')}</option>
            <option value="yearly">{t('revenue_report.filter.yearly')}</option>
          </select>
        </div>
      </div>

      <div className="mt-2">
        <RevenueChart
          data={selectedData}
          title={t('revenue_report.chart.title')}
          description={t(`revenue_report.period.${period}`)}
        />
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <ReceiptText className="h-5 w-5 text-gray-400" />
          {t('revenue_report.history.title')}
        </h3>
        {isLoading ? (
          <p className="text-sm text-gray-400 text-center py-8">{t('revenue_report.loading')}</p>
        ) : recentTx.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">{t('revenue_report.no_data')}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <th className="pb-3 text-left font-semibold text-gray-500 dark:text-gray-400">{t('revenue_report.table.customer')}</th>
                  <th className="pb-3 text-left font-semibold text-gray-500 dark:text-gray-400">{t('revenue_report.table.package')}</th>
                  <th className="pb-3 text-left font-semibold text-gray-500 dark:text-gray-400">{t('revenue_report.table.type')}</th>
                  <th className="pb-3 text-right font-semibold text-gray-500 dark:text-gray-400">{t('revenue_report.table.amount')}</th>
                  <th className="pb-3 text-right font-semibold text-gray-500 dark:text-gray-400">{t('revenue_report.table.date')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800/60">
                {recentTx.map((tx, i) => (
                  <tr key={tx.id ?? i} className="hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors">
                    <td className="py-3 font-medium text-gray-900 dark:text-white">{tx.customerName || t('revenue_report.member_fallback', { id: tx.memberId })}</td>
                    <td className="py-3 text-gray-600 dark:text-gray-400">{tx.package || '—'}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${tx.type === 'renewal' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'}`}>
                        {tx.type === 'renewal' ? t('revenue_report.type.renew') : t('revenue_report.type.new_registration')}
                      </span>
                    </td>
                    <td className="py-3 text-right font-semibold text-gray-900 dark:text-white">
                      {new Intl.NumberFormat('vi-VN').format(tx.amount)}đ
                    </td>
                    <td className="py-3 text-right text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      {new Date(tx.date).toLocaleDateString('vi-VN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default RevenueReport;
