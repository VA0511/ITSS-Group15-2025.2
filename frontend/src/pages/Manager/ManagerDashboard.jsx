import React from 'react';
import {
  Users, UserCheck, Calendar,
  MessageSquare, AlertTriangle, UserPlus,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '@/components/Common/Button';
import StatsCard from '@/components/Dashboard/StatsCard';
import { useMembers } from '@/hooks/queries/useMembers';
import { useEmployees } from '@/hooks/queries/useEmployees';
import { useTrainingBookings } from '@/hooks/queries/useTrainingBookings';
import { useFeedbacks } from '@/hooks/queries/useFeedbacks';
import { useTranslation } from 'react-i18next';
import {

  slideUpVariants, cardVariants, staggerContainerVariants, sectionStaggerVariants,
} from '@/lib/animations';

const ManagerDashboard = () => {
  const { t, i18n } = useTranslation('manager');
  const { data: memberResponse = {} } = useMembers(1, 1000);
  const { data: employeeResponse = {} } = useEmployees(1, 1000);
  const { data: bookingResponse = {} } = useTrainingBookings();
  const { data: feedbackResponse = {} } = useFeedbacks(1, 1000);

  const members = Array.isArray(memberResponse?.data) ? memberResponse.data : [];
  const employees = Array.isArray(employeeResponse?.data) ? employeeResponse.data : (Array.isArray(employeeResponse) ? employeeResponse : []);
  const bookings = Array.isArray(bookingResponse?.data) ? bookingResponse.data : (Array.isArray(bookingResponse) ? bookingResponse : []);
  const feedbacks = Array.isArray(feedbackResponse?.data) ? feedbackResponse.data : (Array.isArray(feedbackResponse) ? feedbackResponse : []);

  const totalMembers = memberResponse?.total ?? members.length;
  const activeMembers = members.filter(m => m?.is_active === true || m?.status === 'active').length;

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const getMemberJoinDate = (m) => {
    const raw = m?.joinDate || m?.join_date || m?.created_at || m?.registration_date || null;
    if (!raw) return null;
    const d = new Date(raw);
    return isNaN(d.getTime()) ? null : d;
  };

  const newThisMonth = members.filter(m => {
    const d = getMemberJoinDate(m);
    return d && d >= startOfMonth;
  }).length;

  const isSameDate = (a, b) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const getEmployeeName = (id) => {
    const e = employees.find(e => e.id === id);
    return e?.full_name || e?.name || `PT #${id}`;
  };

  const getMemberName = (id) => {
    const m = members.find(m => m.id === id);
    return m?.full_name || m?.name || `HV #${id}`;
  };

  const localeMap = {
    vi: 'vi-VN',
    en: 'en-US',
    ja: 'ja-JP',
  };
  const currentLocale = localeMap[i18n.language] || 'vi-VN';

  const formatTime = (iso) => {
    const d = new Date(iso);
    return isNaN(d.getTime()) ? '--:--' : d.toLocaleTimeString(currentLocale, { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (iso) => {
    const d = new Date(iso);
    return isNaN(d.getTime()) ? '--' : d.toLocaleDateString(currentLocale, { day: '2-digit', month: '2-digit' });
  };

  const getSessionStatus = (booking) => {
    const raw = String(booking?.status || '').toLowerCase();
    if (raw === 'cancelled' || raw === 'rejected') return 'Cancelled';
    const start = new Date(booking?.requested_start);
    const end = new Date(booking?.requested_end);
    if (!isNaN(end.getTime()) && end < now) return 'Done';
    if (!isNaN(start.getTime()) && start <= now && now <= end) return 'InProgress';
    return 'Scheduled';
  };

  const todaySchedules = bookings
    .filter(b => {
      const s = new Date(b?.requested_start);
      return !isNaN(s.getTime()) && isSameDate(s, now);
    })
    .map(b => ({
      id: b.id,
      time: formatTime(b.requested_start),
      pt: getEmployeeName(b.pt_id),
      member: getMemberName(b.member_id),
      status: getSessionStatus(b),
    }))
    .sort((a, b) => a.time.localeCompare(b.time));

  const pendingRequests = bookings
    .filter(b => b?.status === 'Pending')
    .map(b => ({
      id: b.id,
      member: getMemberName(b.member_id),
      pt: getEmployeeName(b.pt_id),
      date: formatDate(b.requested_start),
      time: formatTime(b.requested_start),
    }))
    .slice(0, 6);

  const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const expiringMembers = members
    .filter(m => {
      if (!m.expiryDate) return false;
      const d = new Date(m.expiryDate);
      return !isNaN(d.getTime()) && d >= now && d <= in30Days;
    })
    .sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate))
    .slice(0, 6);

  const pendingFeedbackCount = feedbacks.filter(f =>
    f?.status?.toLowerCase() === 'pending'
  ).length;

  const todayDone = todaySchedules.filter(s => s.status === 'Done').length;

  const stats = [
    {
      title: t('dashboard.total_members'),
      value: String(totalMembers),
      icon: Users,
      trend: 'neutral',
      trendValue: `${activeMembers} ${t('dashboard.active')}`,
      trendLabel: '',
    },
    {
      title: t('dashboard.active_members'),
      value: String(activeMembers),
      icon: UserCheck,
      trend: 'up',
      trendValue: totalMembers > 0 ? `${Math.round(activeMembers / totalMembers * 100)}%` : '0%',
      trendLabel: t('dashboard.total_label'),
    },
    {
      title: t('dashboard.new_this_month'),
      value: String(newThisMonth),
      icon: UserPlus,
      trend: newThisMonth > 0 ? 'up' : 'neutral',
      trendValue: newThisMonth > 0 ? `+${newThisMonth}` : t('dashboard.none_yet'),
      trendLabel: t('dashboard.members_label'),
    },
    {
      title: t('dashboard.pt_schedule_today'),
      value: String(todaySchedules.length),
      icon: Calendar,
      trend: 'neutral',
      trendValue: `${todayDone} ${t('dashboard.completed')}`,
      trendLabel: '',
    },
    {
      title: t('dashboard.pending_feedback'),
      value: String(pendingFeedbackCount),
      icon: MessageSquare,
      trend: pendingFeedbackCount > 0 ? 'down' : 'neutral',
      trendValue: pendingFeedbackCount > 0 ? t('dashboard.need_process') : t('dashboard.done'),
      trendLabel: '',
    },
  ];

  const statusStyle = {
    Done: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    InProgress: 'bg-blue-100  text-blue-700  dark:bg-blue-900/30  dark:text-blue-400',
    Cancelled: 'bg-red-100   text-red-700   dark:bg-red-900/30   dark:text-red-400',
    Scheduled: 'bg-gray-100  text-gray-600  dark:bg-gray-800     dark:text-gray-400',
  };
  const statusLabel = {
    Done: t('dashboard.status_done'),
    InProgress: t('dashboard.status_in_progress'),
    Cancelled: t('dashboard.status_cancelled'),
    Scheduled: t('dashboard.status_scheduled'),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div variants={slideUpVariants}>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {t('dashboard.title')}
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {now.toLocaleDateString(currentLocale, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </motion.div>

      {/* Stats – 5 cards with stagger */}
      <motion.div
        variants={staggerContainerVariants}
        className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5"
      >
        {stats.map((s, i) => (
          <motion.div
            key={s.title}
            variants={cardVariants}
            custom={i}
            whileHover={{ scale: 1.03, y: -3 }}
          >
            <StatsCard {...s} />
          </motion.div>
        ))}
      </motion.div>

      {/* Main content – 2-col grid */}
      <motion.div variants={slideUpVariants} className="grid grid-cols-1 gap-6 lg:grid-cols-2">

        {/* Today's schedule */}
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">{t('dashboard.pt_schedule_today')}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {todaySchedules.length} {t('dashboard.sessions')} · {todayDone} {t('dashboard.completed')}
              </p>
            </div>
            <Link to="/manager/schedule">
              <Button variant="ghost" size="sm">{t('dashboard.view_schedule')}</Button>
            </Link>
          </div>

          {todaySchedules.length === 0 ? (
            <div className="flex items-center justify-center py-12 text-sm text-gray-400 dark:text-gray-500">
              {t('dashboard.no_schedule_today')}
            </div>
          ) : (
            <div className="space-y-1.5 max-h-80 overflow-y-auto pr-1">
              {todaySchedules.map(s => (
                <div
                  key={s.id}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <span className="w-14 shrink-0 rounded-md bg-purple-50 dark:bg-purple-900/30 px-2 py-1 text-center text-xs font-semibold text-purple-700 dark:text-purple-300">
                    {s.time}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{s.pt}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {t('dashboard.with_member', { name: s.member })}
                    </p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyle[s.status]}`}>
                    {statusLabel[s.status]}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Expiring soon */}
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">{t('dashboard.expiring_soon')}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t('dashboard.in_next_30_days')}</p>
            </div>
            <Link to="/manager/members">
              <Button variant="ghost" size="sm">{t('dashboard.view_all')}</Button>
            </Link>
          </div>

          {expiringMembers.length === 0 ? (
            <div className="flex items-center justify-center py-8 text-sm text-gray-400 dark:text-gray-500">
              {t('dashboard.no_expiring_soon')}
            </div>
          ) : (
            <div className="space-y-1.5 max-h-96 overflow-y-auto pr-1">
              {expiringMembers.map(m => {
                const daysLeft = Math.ceil((new Date(m.expiryDate) - now) / 86400000);
                return (
                  <div
                    key={m.id}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <div className="h-8 w-8 shrink-0 rounded-full bg-red-50 dark:bg-red-900/30 flex items-center justify-center">
                      <AlertTriangle className="h-4 w-4 text-red-500 dark:text-red-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {m.full_name || m.name || `HV #${m.id}`}
                      </p>
                      <p className="text-xs font-medium text-red-500 dark:text-red-400">
                        {t('dashboard.days_left', { days: daysLeft })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        variants={slideUpVariants}
        className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-950"
      >
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
          {t('dashboard.quick_access')}
        </p>
        <div className="flex flex-wrap gap-2">
          <Link to="/manager/members">
            <Button size="sm">{t('dashboard.manage_members')}</Button>
          </Link>
          <Link to="/manager/schedule">
            <Button variant="outline" size="sm">{t('dashboard.pt_schedule')}</Button>
          </Link>
          <Link to="/manager/transactions">
            <Button variant="outline" size="sm">{t('dashboard.transactions')}</Button>
          </Link>
          <Link to="/manager/feedbacks">
            <Button variant="outline" size="sm">{t('dashboard.feedbacks')}</Button>
          </Link>
          <Link to="/manager/packages">
            <Button variant="outline" size="sm">{t('dashboard.packages')}</Button>
          </Link>
          <Link to="/manager/report">
            <Button variant="outline" size="sm">{t('dashboard.reports')}</Button>
          </Link>
        </div>
      </motion.div>

    </div>
  );
};

export default ManagerDashboard;
