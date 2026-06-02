import React, { useState, useEffect } from 'react';
import { Save, Clock, Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useMyPTDetail } from '@/hooks/queries/useTraining';
import { useUpdateMyPTDetail } from '@/hooks/mutations/useTrainingMutations';
import { cn } from '@/lib/utils';

const DAY_KEYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const TIME_SLOTS = [
  '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00',
];

const TrainerAvailability = () => {
  const { t } = useTranslation('trainer');
  const { data: pt, isLoading, isError } = useMyPTDetail();
  const { mutate: updateMyPTDetail, isPending } = useUpdateMyPTDetail();

  const [availability, setAvailability] = useState({});

  useEffect(() => {
    if (pt?.available_schedule) {
      try {
        setAvailability(JSON.parse(pt.available_schedule));
      } catch {
        setAvailability({});
      }
    }
  }, [pt]);

  const toggleSlot = (day, slot) => {
    setAvailability((prev) => {
      const daySlots = prev[day] || [];
      if (daySlots.includes(slot)) {
        return { ...prev, [day]: daySlots.filter((s) => s !== slot) };
      } else {
        return { ...prev, [day]: [...daySlots, slot].sort() };
      }
    });
  };

  const handleSave = () => {
    if (!pt) return;
    updateMyPTDetail({
      ...pt,
      available_schedule: JSON.stringify(availability),
    });
  };

  const totalSelected = Object.values(availability).reduce((sum, slots) => sum + (slots?.length || 0), 0);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-64">
        <div className="text-gray-500 dark:text-gray-400 text-sm">{t('availability.loading')}</div>
      </div>
    );
  }

  if (isError || !pt) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-64">
        <div className="text-red-500 text-sm">{t('availability.error')}</div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 lg:p-6 w-full pb-20 no-scrollbar">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Calendar className="h-6 w-6 text-blue-600" />
            {t('availability.title')}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
            {t('availability.subtitle')}
            {totalSelected > 0 && (
              <span className="ml-2 text-blue-600 dark:text-blue-400 font-medium">{t('availability.selected_count', { count: totalSelected })}</span>
            )}
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={isPending}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all disabled:opacity-50 shadow-lg shadow-blue-200 dark:shadow-none shrink-0"
        >
          {isPending ? (
            <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {t('availability.save_btn')}
        </button>
      </div>

      {/* Schedule grid */}
      <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm">
        {/* Day headers with counts */}
        <div className="grid grid-cols-7 gap-2 mb-3">
          {DAY_KEYS.map((key) => {
            const count = (availability[key] || []).length;
            return (
              <div key={key} className="text-center">
                <div className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                  {t(`availability.days.${key}`)}
                </div>
                {count > 0 ? (
                  <div className="text-xs text-blue-600 dark:text-blue-400 font-medium mt-0.5">{count}</div>
                ) : (
                  <div className="text-xs text-gray-300 dark:text-gray-600 mt-0.5">—</div>
                )}
              </div>
            );
          })}
        </div>

        <div className="border-t border-gray-100 dark:border-gray-800 mb-3" />

        {/* Time slot chips — 7 columns */}
        <div className="grid grid-cols-7 gap-2">
          {DAY_KEYS.map((key) => {
            const daySlots = availability[key] || [];
            return (
              <div key={key} className="flex flex-col gap-1.5">
                {TIME_SLOTS.map((slot) => {
                  const isSelected = daySlots.includes(slot);
                  return (
                    <button
                      key={slot}
                      onClick={() => toggleSlot(key, slot)}
                      className={cn(
                        'py-3.5 px-1 text-xs rounded-lg font-medium text-center transition-all select-none',
                        isSelected
                          ? 'bg-blue-600 text-white shadow-sm shadow-blue-200 dark:shadow-none'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400',
                      )}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-5 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <div className="w-4 h-4 rounded bg-blue-600" />
          {t('availability.legend_selected')}
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <div className="w-4 h-4 rounded bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700" />
          {t('availability.legend_unselected')}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500 ml-auto">
          <Clock className="h-3.5 w-3.5" />
          {t('availability.legend_note')}
        </div>
      </div>
    </div>
  );
};

export default TrainerAvailability;
