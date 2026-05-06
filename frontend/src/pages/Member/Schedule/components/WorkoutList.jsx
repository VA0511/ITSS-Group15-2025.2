import React from 'react';

const getDeadlineTime = (startTime) => {
  const [h, m] = startTime.split(':').map(Number);
  const dh = h - 3;
  return `${String(dh < 0 ? dh + 24 : dh).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
};

const WorkoutList = ({
  activeTab, 
  selectedDate, 
  selectedDateObject, 
  dayNames, 
  selectedWorkouts, 
  getWorkoutDisplayName, 
  setSelectedWorkout, 
  getStatusBadgeClass, 
  getAccentColor,
  setSelectedTrainer,
  setBookingForm,
  handleConfirmAttendance,
  setSelectedDeniedRequest,
  nextUpcomingWorkout,
  isPendingScheduledStatus
}) => {
  if (!selectedDate) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-gray-50 dark:bg-gray-900/20 rounded-xl m-4">
        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center text-xl mb-4 opacity-50">
          📅
        </div>
        <div className="text-sm text-gray-400 dark:text-gray-500">
          {activeTab === "requests"
            ? "Chọn một ngày để xem yêu cầu của bạn"
            : "Chọn một ngày để xem lịch tập"}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 bg-white dark:bg-gray-950">
      <div className="flex items-center justify-between mb-5">
        <div className="text-sm font-semibold text-gray-500 dark:text-gray-400">
          {selectedDateObject
            ? `${dayNames[selectedDateObject.getDay()]}, ${selectedDateObject.getDate()}/${String(selectedDateObject.getMonth() + 1).padStart(2, "0")}/${selectedDateObject.getFullYear()}`
            : ""}
        </div>
        {selectedWorkouts.length > 0 && (
          <div className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
            {selectedWorkouts.length} {activeTab === "requests" ? "yêu cầu" : "buổi"}
          </div>
        )}
      </div>

      {selectedWorkouts.length === 0 ? (
        <div className="text-sm text-gray-400 dark:text-gray-500 py-4 italic">
          {activeTab === "requests"
            ? "Chưa có yêu cầu nào"
            : "Không có buổi tập nào"}
        </div>
      ) : (
        <div className="space-y-3">
          {selectedWorkouts.map((workout, idx) => {
            const isNextUpcomingScheduledWorkout =
              activeTab === "scheduled" &&
              (nextUpcomingWorkout == null ||
                (nextUpcomingWorkout?.dateKey === selectedDate && nextUpcomingWorkout?.index === idx));
            const canConfirmAttendance =
              isNextUpcomingScheduledWorkout &&
              isPendingScheduledStatus(workout.status);

            return (
              <div
                key={idx}
                className={`${
                  activeTab === "booking" && !workout.isBookable
                    ? "bg-gray-100 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700"
                    : "bg-gray-50 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-800"
                } rounded-xl p-4 flex gap-3.5 relative overflow-hidden transition-all`}
              >
                <div
                  className="absolute left-0 top-0 bottom-0 w-1"
                  style={{ backgroundColor: getAccentColor(workout) }}
                />

                <div className="flex flex-col items-center min-w-12">
                  <div className="text-xs font-bold text-gray-700 dark:text-gray-300">
                    {workout.startTime}
                  </div>
                  <div className="w-px h-2 my-1 bg-gray-300 dark:bg-gray-600" />
                  <div className="text-xs text-gray-400 dark:text-gray-500">
                    {workout.endTime}
                  </div>
                </div>

                <div className="flex-1 ml-2">
                  <div
                    className={`text-sm font-bold mb-2 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors ${
                      activeTab === "booking" && !workout.isBookable
                        ? "text-gray-600 dark:text-gray-400"
                        : "text-gray-800 dark:text-white"
                    }`}
                    onClick={() => setSelectedWorkout(workout)}
                  >
                    {getWorkoutDisplayName(workout)}
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                      {workout.location}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                      {activeTab === "booking" ? "Khung giờ PT" : workout.type}
                    </span>
                  </div>
                  <div className="text-[10px] text-gray-500">
                    <button
                      onClick={() => setSelectedTrainer(workout.trainer)}
                      className="hover:text-blue-600 hover:underline transition-colors"
                    >
                      PT: {workout.trainer}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col items-end justify-between min-w-[80px]">
                  <div className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${getStatusBadgeClass(workout.status)}`}>
                    {workout.status}
                  </div>
                  
                  {activeTab === "booking" && workout.isBookable && (
                    <button
                      onClick={() => setBookingForm({ ...workout, requestDate: selectedDate })}
                      className="text-[10px] font-bold px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Đặt ngay
                    </button>
                  )}

                  {activeTab === "scheduled" && canConfirmAttendance && (
                    <div className="flex flex-col items-end gap-1">
                      <button
                        onClick={() => handleConfirmAttendance(selectedDate, idx)}
                        className="text-[10px] font-bold px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Xác nhận
                      </button>
                      <span className="text-[9px] text-orange-500 dark:text-orange-400 text-right leading-tight">
                        Hạn xác nhận trước {getDeadlineTime(workout.startTime)}
                      </span>
                    </div>
                  )}

                  {activeTab === "requests" && workout.status === "Từ chối" && (
                    <button
                      onClick={() => setSelectedDeniedRequest(workout)}
                      className="text-[10px] font-bold px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200"
                    >
                      Chi tiết
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default WorkoutList;
