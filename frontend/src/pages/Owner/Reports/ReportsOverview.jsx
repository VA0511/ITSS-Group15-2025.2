import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, BarChart3, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const REPORT_CARDS = [
  { key: 'revenue', path: '/owner/reports/revenue', icon: BarChart3 },
  { key: 'member', path: '/owner/reports/members', icon: Users },
  { key: 'staff', path: '/owner/reports/staff', icon: FileText },
];

const ReportsOverview = () => {
  const { t } = useTranslation('owner');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{t('reports.title')}</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {t('reports.subtitle')}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {REPORT_CARDS.map(({ key, path, icon: Icon }) => (
          <Link key={key} to={path} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-gray-800 dark:bg-gray-950">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-300 mb-4">
              <Icon className="h-6 w-6" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t(`reports.${key}.title`)}</h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{t(`reports.${key}.description`)}</p>
            <div className="mt-6 text-sm font-medium text-blue-600 dark:text-blue-400">{t('reports.view_detail')}</div>
          </Link>
        ))}
      </div>

      <div className="rounded-3xl border border-dashed border-gray-200 bg-blue-50/50 p-6 text-sm text-gray-700 dark:border-gray-700 dark:bg-blue-950/30 dark:text-gray-300">
        <p className="font-semibold">{t('reports.advice.heading')}</p>
        <p className="mt-2">{t('reports.advice.text')}</p>
      </div>
    </div>
  );
};

export default ReportsOverview;
