import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Download, Users, Repeat, TrendingUp, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Button from '@/components/Common/Button';
import MemberStatsChart from '@/components/Charts/MemberStatsChart';
import { useMembers } from '@/hooks/queries/useMembers';
import { useTransactions } from '@/hooks/queries/useTransactions';

const parseArr = (raw) => {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw?.data?.data)) return raw.data.data;
  if (Array.isArray(raw?.data)) return raw.data;
  return [];
};

const monthLabel = (d) => `T${d.getMonth() + 1}`;

const MemberReport = () => {
  const { t } = useTranslation('owner');
  const { data: membersRaw, isLoading: loadingMembers } = useMembers(1, 1000);
  const { data: txRaw, isLoading: loadingTx } = useTransactions();
  const isLoading = loadingMembers || loadingTx;

  const members = useMemo(() => parseArr(membersRaw), [membersRaw]);
  const transactions = useMemo(() => parseArr(txRaw), [txRaw]);

  const now = new Date();
  const curMonth = now.getMonth();
  const curYear = now.getFullYear();

  // Hội viên mới tháng này (type = registration)
  const newThisMonth = useMemo(() =>
    transactions.filter(t => {
      const d = new Date(t.date);
      return t.type === 'registration' && d.getMonth() === curMonth && d.getFullYear() === curYear;
    }).length,
  [transactions, curMonth, curYear]);

  // Gia hạn thành công tháng này
  const renewalsThisMonth = useMemo(() =>
    transactions.filter(t => {
      const d = new Date(t.date);
      return t.type === 'renewal' && d.getMonth() === curMonth && d.getFullYear() === curYear;
    }).length,
  [transactions, curMonth, curYear]);

  // Tỷ lệ giữ chân
  const activeCount = useMemo(() =>
    members.filter(m => (m.status || '').toLowerCase() === 'active').length,
  [members]);
  const retentionRate = members.length > 0 ? Math.round(activeCount / members.length * 100) : 0;

  const summary = [
    { title: t('member_report.stats.new_members'), value: isLoading ? '...' : String(newThisMonth), icon: Users },
    { title: t('member_report.stats.renewals'), value: isLoading ? '...' : String(renewalsThisMonth), icon: Repeat },
    { title: t('member_report.stats.retention'), value: isLoading ? '...' : `${retentionRate}%`, icon: TrendingUp },
  ];

  // Giao dịch gần nhất
  const recentTransactions = useMemo(() =>
    [...transactions]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5),
  [transactions]);

  const txColors = ['bg-blue-50 dark:bg-blue-950/40', 'bg-green-50 dark:bg-green-950/40', 'bg-yellow-50 dark:bg-yellow-950/30', 'bg-purple-50 dark:bg-purple-950/30', 'bg-pink-50 dark:bg-pink-950/30'];

  // Chart data: last 7 months
  const memberChartData = useMemo(() => {
    const result = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(curYear, curMonth - i, 1);
      const m = d.getMonth(); const y = d.getFullYear();
      const newCount = transactions.filter(t => {
        const td = new Date(t.date);
        return t.type === 'registration' && td.getMonth() === m && td.getFullYear() === y;
      }).length;
      const endOfMonth = new Date(y, m + 1, 0);
      const active = members.filter(mb => {
        const reg = new Date(mb.registration_date || mb.created_at || 0);
        const exp = mb.end_date || mb.expiryDate;
        return reg <= endOfMonth && (!exp || new Date(exp) >= endOfMonth);
      }).length;
      const dropped = members.filter(mb => {
        const exp = mb.end_date || mb.expiryDate;
        if (!exp) return false;
        const expDate = new Date(exp);
        return expDate.getMonth() === m && expDate.getFullYear() === y;
      }).length;
      result.push({ name: monthLabel(d), new: newCount, active, dropped });
    }
    return result;
  }, [transactions, members, curMonth, curYear]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link to="/owner/reports" className="flex items-center justify-center rounded-lg border border-gray-200 bg-white p-2 text-gray-600 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{t('member_report.title')}</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {t('member_report.subtitle')}
            </p>
          </div>
        </div>
        <Button leftIcon={<Download className="h-4 w-4" />} onClick={() => window.print()}>{t('member_report.export_btn')}</Button>
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
        <MemberStatsChart data={memberChartData} />

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('member_report.history.title')}</h2>
          {isLoading ? (
            <p className="text-sm text-gray-400 text-center py-8">{t('member_report.loading')}</p>
          ) : recentTransactions.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">{t('member_report.no_data')}</p>
          ) : (
            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
              {recentTransactions.map((tx, i) => (
                <div key={tx.id ?? i} className={`rounded-2xl p-4 ${txColors[i % txColors.length]}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{tx.customerName || t('member_report.member_fallback', { id: tx.memberId })}</p>
                      <p className="mt-0.5">{tx.package || '—'}</p>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        {tx.type === 'renewal' ? t('member_report.type.renew') : t('member_report.type.new_registration')} · {new Date(tx.date).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <span className="shrink-0 font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap">
                      {new Intl.NumberFormat('vi-VN').format(tx.amount)}đ
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemberReport;
