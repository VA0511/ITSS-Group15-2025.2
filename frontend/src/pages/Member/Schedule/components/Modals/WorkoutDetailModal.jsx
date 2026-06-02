import React from 'react';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const WorkoutDetailModal = ({
  selectedWorkout,
  setSelectedWorkout,
  activeTab,
  getWorkoutDisplayName,
  getStatusBadgeClass,
  setSelectedTrainer,
  setSelectedDeniedRequest
}) => {
  const { t } = useTranslation('member');

  if (!selectedWorkout) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40 p-4">
      <div className={`bg-white dark:bg-gray-950 rounded-xl w-full border border-gray-200 dark:border-gray-800 flex flex-col ${
        activeTab === 'requests' ? 'max-w-xs max-h-[78vh]' : 'max-w-md'
      }`}>
        <div className={`flex items-center justify-between border-b border-gray-200 dark:border-gray-800 ${
          activeTab === 'requests' ? 'p-4' : 'p-6'
        }`}>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {activeTab === 'requests'
              ? t('schedule.detail_modal.title_request')
              : t('schedule.detail_modal.title_session')}
          </h2>
          <button
            onClick={() => setSelectedWorkout(null)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className={`overflow-y-auto ${activeTab === 'requests' ? 'p-4 space-y-3 text-sm' : 'p-6 space-y-4'}`}>
          <div>
            <div className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase mb-2">
              {t('schedule.detail_modal.name_label')}
            </div>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{getWorkoutDisplayName(selectedWorkout)}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase mb-2">
                {t('schedule.detail_modal.start_label')}
              </div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{selectedWorkout.startTime}</p>
            </div>
            <div>
              <div className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase mb-2">
                {t('schedule.detail_modal.end_label')}
              </div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{selectedWorkout.endTime}</p>
            </div>
          </div>

          <div>
            <div className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase mb-2">
              {t('schedule.detail_modal.curriculum_label')}
            </div>
            <p className="text-sm text-blue-700 bg-blue-50 px-3 py-2 rounded-lg inline-block font-semibold">
              {activeTab === 'booking' ? t('schedule.detail_modal.pt_slot') : selectedWorkout.type}
            </p>
          </div>

          <div>
            <div className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase mb-2">
              {t('schedule.detail_modal.location_label')}
            </div>
            <p className="text-sm text-gray-900 bg-gray-100 px-3 py-2 rounded-lg">
              {selectedWorkout.location}
            </p>
          </div>

          <div>
            <div className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase mb-2">
              {t('schedule.detail_modal.trainer_label')}
            </div>
            <button
              onClick={() => {
                setSelectedWorkout(null);
                setSelectedTrainer(selectedWorkout.trainer);
              }}
              className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-blue-500 transition-colors flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                {selectedWorkout.trainer?.charAt(0)}
              </div>
              <span className="text-sm font-bold text-gray-800">{selectedWorkout.trainer}</span>
            </button>
          </div>

          {activeTab === 'requests' && (
            <div className="space-y-3 pt-2 border-t border-gray-100">
              {selectedWorkout.status && (
                <div>
                  <div className="text-xs font-bold text-gray-400 uppercase mb-1">
                    {t('schedule.detail_modal.status_label')}
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded ${getStatusBadgeClass(selectedWorkout.status)}`}>
                    {t(`schedule.status.${selectedWorkout.status}`, { defaultValue: selectedWorkout.status })}
                  </span>
                </div>
              )}
              {selectedWorkout.submittedAt && (
                <div>
                  <div className="text-xs font-bold text-gray-400 uppercase mb-1">
                    {t('schedule.detail_modal.submitted_label')}
                  </div>
                  <p className="text-xs font-semibold">{selectedWorkout.submittedAt}</p>
                </div>
              )}
              {selectedWorkout.requestDetails?.curriculum && (
                <div>
                  <div className="text-xs font-bold text-gray-400 uppercase mb-1">
                    {t('schedule.detail_modal.desired_curriculum')}
                  </div>
                  <p className="text-xs italic">{selectedWorkout.requestDetails.curriculum}</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-200 flex gap-2">
          <button
            onClick={() => setSelectedWorkout(null)}
            className="flex-1 px-4 py-2 bg-gray-100 text-gray-900 font-semibold rounded-lg hover:bg-gray-200"
          >
            {t('schedule.detail_modal.close_btn')}
          </button>
          {activeTab === 'requests' && selectedWorkout.status === 'Rejected' && (
            <button
              onClick={() => {
                setSelectedDeniedRequest(selectedWorkout);
                setSelectedWorkout(null);
              }}
              className="flex-1 px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700"
            >
              {t('schedule.detail_modal.deny_reason_btn')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkoutDetailModal;
