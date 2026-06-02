import React, { useMemo } from 'react';
import { ArrowUpRight, Users, ShieldCheck, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Button from '@/components/Common/Button';
import StatsCard from '@/components/Dashboard/StatsCard';
import RevenueChart from '@/components/Charts/RevenueChart';
import MemberStatsChart from '@/components/Charts/MemberStatsChart';
import PerformanceChart from '@/components/Charts/PerformanceChart';
import RetentionChart from '@/components/Charts/RetentionChart';
import PackagePerformanceChart from '@/components/Charts/PackagePerformanceChart';
import EquipmentStatusChart from '@/components/Charts/EquipmentStatusChart';
import { useMembers } from '@/hooks/queries/useMembers';
import { useTransactions } from '@/hooks/queries/useTransactions';
import { useEmployees } from '@/hooks/queries/useEmployees';
import { useTrainingBookings } from '@/hooks/queries/useTraining';
import {
  slideUpVariants, cardVariants, staggerContainerVariants, sectionStaggerVariants,
} from '@/lib/animations';

const parseArr = (raw) => {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw?.data?.data)) return raw.data.data;
  if (Array.isArray(raw?.data)) return raw.data;
  return [];
};

const fmt = (n) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(n);

const monthLabel = (d) => `T${d.getMonth() + 1}`;

const OwnerDashboard = () => {
  const { t } = useTranslation('owner');
  const { data: membersRaw } = useMembers(1, 1000);
  const { data: txRaw } = useTransactions();
  const { data: employeesRaw } = useEmployees(1, 200);
  const { data: bookingsRaw } = useTrainingBookings();

  const members = useMemo(() => parseArr(membersRaw), [membersRaw]);
  const transactions = useMemo(() => parseArr(txRaw), [txRaw]);
  const employees = useMemo(() => parseArr(employeesRaw), [employeesRaw]);
  const bookings = useMemo(() => Array.isArray(bookingsRaw) ? bookingsRaw : [], [bookingsRaw]);

  const now = new Date();
  const curMonth = now.getMonth();
  const curYear = now.getFullYear();

  const monthRevenue = useMemo(() =>
    transactions
      .filter(t => { const d = new Date(t.date); return d.getMonth() === curMonth && d.getFullYear() === curYear; })
      .reduce((s, t) => s + (t.amount || 0), 0),
  [transactions, curMonth, curYear]);

  const newMembersCount = useMemo(() =>
    transactions.filter(t => {
      const d = new Date(t.date);
      return t.type === 'registration' && d.getMonth() === curMonth && d.getFullYear() === curYear;
    }).length,
  [transactions, curMonth, curYear]);

  const activeCount = useMemo(() =>
    members.filter(m => (m.status || '').toLowerCase() === 'active').length,
  [members]);

  const retentionRate = members.length > 0 ? Math.round(activeCount / members.length * 100) : 0;

  const statsCards = [
    { title: t('dashboard.stats.revenue'), value: fmt(monthRevenue), icon: ArrowUpRight, trend: 'up', trendValue: t('dashboard.stats.current_month') },
    { title: t('dashboard.stats.new_members'), value: String(newMembersCount), icon: Users, trend: 'up', trendValue: t('dashboard.stats.this_month') },
    { title: t('dashboard.stats.retention'), value: `${retentionRate}%`, icon: ShieldCheck, trend: retentionRate >= 70 ? 'up' : 'down', trendValue: `${activeCount}/${members.length}` },
    { title: t('dashboard.stats.staff'), value: String(employees.length), icon: Briefcase, trend: 'neutral', trendValue: t('dashboard.stats.total') },
  ];

  const revenueChartData = useMemo(() => {
    const result = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(curYear, curMonth - i, 1);
      const m = d.getMonth(); const y = d.getFullYear();
      const total = transactions
        .filter(t => { const td = new Date(t.date); return td.getMonth() === m && td.getFullYear() === y; })
        .reduce((s, t) => s + (t.amount || 0), 0);
      result.push({ name: monthLabel(d), total });
    }
    return result;
  }, [transactions, curMonth, curYear]);

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

  const packageData = useMemo(() => {
    const counts = {};
    transactions.forEach(t => {
      const pkg = t.package || 'Khác';
      counts[pkg] = (counts[pkg] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [transactions]);

  const packageSoldData = useMemo(() => {
    const counts = {};
    transactions.forEach(t => {
      const pkg = t.package || 'Khác';
      counts[pkg] = (counts[pkg] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, sold]) => ({ name, sold }))
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 6);
  }, [transactions]);

  const staffChartData = useMemo(() => {
    const trainerSessionMap = {};
    bookings.filter(b => b.status === 'Accepted').forEach(b => {
      trainerSessionMap[b.pt_id] = (trainerSessionMap[b.pt_id] || 0) + 1;
    });
    return employees
      .filter(e => trainerSessionMap[e.id])
      .map(e => ({ name: (e.full_name || e.name || `NV#${e.id}`).split(' ').slice(-2).join(' '), sessions: trainerSessionMap[e.id] || 0 }))
      .sort((a, b) => b.sessions - a.sessions)
      .slice(0, 6);
  }, [employees, bookings]);

  return (
    <motion.div
      className="space-y-6"
      variants={sectionStaggerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={slideUpVariants} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{t('dashboard.title')}</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {t('dashboard.subtitle')}
          </p>
        </div>
        <Link to="/owner/reports" className="flex items-center justify-center">
          <Button variant="outline" size="lg">{t('dashboard.view_reports')}</Button>
        </Link>
      </motion.div>

      {/* Stats cards – staggered */}
      <motion.div
        variants={staggerContainerVariants}
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {statsCards.map((card, i) => (
          <motion.div
            key={card.title}
            variants={cardVariants}
            custom={i}
            whileHover={{ scale: 1.03, y: -3 }}
          >
            <StatsCard
              title={card.title}
              value={card.value}
              icon={card.icon}
              trend={card.trend}
              trendValue={card.trendValue}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Charts row 1 */}
      <motion.div variants={slideUpVariants} className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <RevenueChart data={revenueChartData} title={t('dashboard.chart.revenue_title')} description={t('dashboard.chart.revenue_desc')} />
        <RetentionChart />
      </motion.div>

      {/* Charts row 2 */}
      <motion.div variants={slideUpVariants} className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <MemberStatsChart data={memberChartData} />
        <PackagePerformanceChart data={packageSoldData} />
      </motion.div>

      {/* Charts row 3 */}
      <motion.div variants={slideUpVariants} className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <EquipmentStatusChart />
        <PerformanceChart data={packageData} />
      </motion.div>
    </motion.div>
  );
};

export default OwnerDashboard;
