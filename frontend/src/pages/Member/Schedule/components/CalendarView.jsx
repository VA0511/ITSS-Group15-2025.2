import React from 'react';

const CalendarView = ({ 
  currentDate, 
  prevMonth, 
  nextMonth, 
  monthName, 
  calendarDays, 
  dateKey, 
  year, 
  month, 
  displayData, 
  selectedDate, 
  selectDay,
  getCalendarDotClass
}) => {
  return (
    <div className="p-4 sm:p-6 bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={prevMonth}
            className="w-7 h-7 rounded border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            ‹
          </button>
          <div className="text-sm font-bold text-gray-800 dark:text-white capitalize">
            {monthName}
          </div>
          <button
            onClick={nextMonth}
            className="w-7 h-7 rounded border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            ›
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map((d) => (
          <div key={d} className="text-center text-[10px] font-bold text-gray-400 dark:text-gray-500 py-1">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((dayObj, idx) => {
          const key = dayObj.isCurrentMonth
            ? dateKey(year, month, dayObj.day)
            : null;
          const evs = key ? displayData[key] || [] : [];
          const isSelected = selectedDate === key;
          const showSingleLessonDot = evs.length > 0;

          return (
            <div
              key={idx}
              onClick={() => dayObj.isCurrentMonth && selectDay(dayObj.day)}
              className={`h-14 flex flex-col items-center justify-center rounded text-xs cursor-pointer transition-all ${
                isSelected
                  ? "bg-blue-600 text-white font-bold"
                  : dayObj.isCurrentMonth
                    ? "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                    : "text-gray-300 dark:text-gray-600"
              }`}
            >
              <span className="text-sm font-semibold">{dayObj.day}</span>
              {dayObj.isCurrentMonth && evs.length > 0 && (
                <div className="flex gap-0.5 mt-1">
                  {showSingleLessonDot ? (
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${isSelected ? "bg-blue-200" : "bg-blue-500"}`}
                    />
                  ) : (
                    evs.map((item, i) => (
                      <div
                        key={i}
                        className={`w-1.5 h-1.5 rounded-full ${getCalendarDotClass(item)}`}
                      />
                    ))
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarView;
