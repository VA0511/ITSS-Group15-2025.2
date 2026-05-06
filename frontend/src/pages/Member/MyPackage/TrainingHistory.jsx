import React from 'react';
import { CalendarCheck, Loader2 } from 'lucide-react';
import { useTrainingSessions } from '@/hooks/queries/useTraining';
import { format } from 'date-fns';

const TrainingHistory = () => {
  const { data: sessionsRes, isLoading } = useTrainingSessions();
  const sessions = (Array.isArray(sessionsRes) ? sessionsRes : []).filter(s => s.member_confirmed);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-lg mx-auto md:max-w-2xl pb-20 px-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Nhật ký Hoạt động</h1>
        <p className="text-gray-500 text-sm mt-1">Lịch sử các buổi tập đã xác nhận tham gia của bạn.</p>
      </div>

      {sessions.length === 0 ? (
        <div className="text-center py-10 text-gray-500 bg-gray-50 dark:bg-gray-900/30 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-800">
          Chưa có hoạt động nào được ghi lại.
        </div>
      ) : (
        <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-300 before:to-transparent dark:before:via-gray-700">
          {sessions.map((item, idx) => {
            const sessionDate = new Date(item.session_time);
            return (
              <div key={item.id || idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-white bg-blue-100 text-blue-500 shadow-sm shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 dark:bg-blue-900/40 dark:border-gray-950 z-10">
                  <CalendarCheck className="h-4 w-4" />
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-gray-200 bg-white shadow-sm flex flex-col dark:bg-gray-950 dark:border-gray-800 transition-all hover:border-blue-300 hover:shadow-md">
                  <span className="font-bold text-gray-900 dark:text-white">
                    {item.pt_feedback ? 'Buổi tập có PT' : 'Buổi tập cá nhân'}
                  </span>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded dark:bg-blue-900/30 dark:text-blue-400">
                      {format(sessionDate, 'HH:mm')}
                    </span>
                    <span className="text-xs text-gray-400 font-medium">
                      {format(sessionDate, 'dd/MM/yyyy')}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
export default TrainingHistory;
