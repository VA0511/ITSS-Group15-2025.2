import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Button from '@/components/Common/Button';
import Input from '@/components/Common/Input';

const TrackProgress = () => {
  const { id } = useParams();
  const { t } = useTranslation('trainer');

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <Link to="/trainer/students">
          <Button variant="outline" size="icon" className="shrink-0 h-10 w-10">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{t('track_progress.title')}</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {t('track_progress.subtitle', { id })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1 border border-gray-200 bg-white p-6 rounded-xl shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">{t('track_progress.form_title')}</h3>
          <div className="space-y-4">
            <Input label={t('track_progress.weight_label')} placeholder={t('track_progress.weight_placeholder')} type="number" />
            <Input label={t('track_progress.bodyfat_label')} placeholder={t('track_progress.bodyfat_placeholder')} type="number" />
            <Input label={t('track_progress.muscle_label')} placeholder={t('track_progress.muscle_placeholder')} type="number" />
            <Button className="w-full" leftIcon={<Plus className="h-4 w-4" />}>{t('track_progress.save_btn')}</Button>
          </div>
        </div>

        <div className="col-span-1 md:col-span-2 border border-gray-200 bg-white p-6 rounded-xl shadow-sm dark:border-gray-800 dark:bg-gray-950 flex flex-col items-center justify-center text-gray-500">
          <p className="font-medium text-lg text-gray-700 dark:text-gray-300 mb-2">{t('track_progress.chart_title')}</p>
          <p className="text-sm">{t('track_progress.chart_note')}</p>
          <div className="h-64 w-full bg-gray-50 dark:bg-gray-900/50 rounded-lg mt-4 border border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center">
             Line Chart Here
          </div>
        </div>
      </div>
    </div>
  );
};
export default TrackProgress;
