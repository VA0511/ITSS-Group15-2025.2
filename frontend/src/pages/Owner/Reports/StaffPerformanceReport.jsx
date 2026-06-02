import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Download, Award, Users, Clock, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Button from '@/components/Common/Button';
import StaffPerformanceChart from '@/components/Charts/StaffPerformanceChart';
import { useEmployees } from '@/hooks/queries/useEmployees';
import { useTrainingBookings } from '@/hooks/queries/useTraining';

const parseArr = (raw) => {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw?.data?.data)) return raw.data.data;
  if (Array.isArray(raw?.data)) return raw.data;
  return [];
};

const StaffPerformanceReport = () => {
  const { t } = useTranslation('owner');
  const { data: employeesRaw, isLoading: loadingEmp } = useEmployees(1, 200);
  const { data: bookingsRaw, isLoading: loadingBook } = useTrainingBookings();
  const isLoading = loadingEmp || loadingBook;

  const employees = useMemo(() => parseArr(employeesRaw), [employeesRaw]);
  const bookings = useMemo(() => Array.isArray(bookingsRaw) ? bookingsRaw : [], [bookingsRaw]);

  // Map trainer_id → accepted session count
  const sessionMap = useMemo(() => {
    const map = {};
    bookings.filter(b => b.status === 'Accepted').forEach(b => {
      map[b.pt_id] = (map[b.pt_id] || 0) + 1;
    });
    return map;
  }, [bookings]);

  const completedSessions = useMemo(() =>
    bookings.filter(b => b.status === 'Accepted').length,
  [bookings]);

  // Trainers (employees who have at least 1 booking as trainer)
  const trainerIds = useMemo(() => new Set(bookings.map(b => b.pt_id)), [bookings]);
  const trainers = useMemo(() =>
    employees.filter(e => trainerIds.has(e.id)),
  [employees, trainerIds]);

  // PT đạt KPI: có ít nhất 1 buổi hoàn thành / tổng PT
  const ptKpi = trainers.length > 0
    ? Math.round(trainers.filter(e => (sessionMap[e.id] || 0) > 0).length / trainers.length * 100)
    : 0;

  // Chart data: top 8 trainers by sessions
  const staffChartData = useMemo(() =>
    trainers
      .map(e => ({
        name: (e.full_name || e.name || `NV#${e.id}`).split(' ').slice(-2).join(' '),
        sessions: sessionMap[e.id] || 0,
      }))
      .filter(e => e.sessions > 0)
      .sort((a, b) => b.sessions - a.sessions)
      .slice(0, 8),
  [trainers, sessionMap]);

  // Top 3 performers
  const topPerformers = useMemo(() =>
    trainers
      .map(e => ({ ...e, sessions: sessionMap[e.id] || 0 }))
      .filter(e => e.sessions > 0)
      .sort((a, b) => b.sessions - a.sessions)
      .slice(0, 3),
  [trainers, sessionMap]);

  const topColors = [
    'bg-green-50 dark:bg-green-950/30',
    'bg-blue-50 dark:bg-blue-950/30',
    'bg-yellow-50 dark:bg-yellow-950/30',
  ];
  const topBadge = ['🥇', '🥈', '🥉'];

  const stats = [
    { title: t('staff_report.stats.total'), value: isLoading ? '...' : String(employees.length), icon: Users },
    { title: t('staff_report.stats.kpi_reached'), value: isLoading ? '...' : `${ptKpi}%`, icon: Award },
    { title: t('staff_report.stats.sessions'), value: isLoading ? '...' : String(completedSessions), icon: Clock },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link to="/owner/reports" className="flex items-center justify-center rounded-lg border border-gray-200 bg-white p-2 text-gray-600 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{t('staff_report.title')}</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {t('staff_report.subtitle')}
            </p>
          </div>
        </div>
        <Button leftIcon={<Download className="h-4 w-4" />} onClick={() => window.print()}>{t('staff_report.export_btn')}</Button>
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
        <StaffPerformanceChart data={staffChartData} />

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-5">{t('staff_report.top_performers.title')}</h2>
          {isLoading ? (
            <p className="text-sm text-gray-400 text-center py-8">{t('staff_report.loading')}</p>
          ) : topPerformers.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">{t('staff_report.no_data')}</p>
          ) : (
            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
              {topPerformers.map((emp, i) => (
                <div key={emp.id} className={`rounded-2xl p-4 ${topColors[i]}`}>
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white flex items-center gap-1.5">
                        <span>{topBadge[i]}</span>
                        {emp.full_name || emp.name || t('staff_report.fallback.staff', { id: emp.id })}
                      </p>
                      <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                        {emp.role || emp.position || t('staff_report.fallback.trainer')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900 dark:text-white text-lg">{emp.sessions}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{t('staff_report.sessions_label')}</p>
                    </div>
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

export default StaffPerformanceReport;
