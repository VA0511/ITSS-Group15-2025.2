import React from 'react';
import { useTranslation } from 'react-i18next';

const DAY_KEYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

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
  getCalendarDotClass,
  activeTab,
}) => {
  const { t } = useTranslation('member');

  return (
    <div className="p-5 sm:p-8 bg-white dark:bg-gray-950 h-full">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={prevMonth}
          className="w-9 h-9 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-lg"
        >
          ‹
        </button>
        <div className="text-base font-bold text-gray-800 dark:text-white capitalize">
          {monthName}
        </div>
        <button
          onClick={nextMonth}
          className="w-9 h-9 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-lg"
        >
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 mb-1">
        {DAY_KEYS.map((key) => (
          <div key={key} className="text-center text-xs font-bold text-gray-400 dark:text-gray-500 pb-2">
            {t(`schedule.calendar.days.${key}`)}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {calendarDays.map((dayObj, idx) => {
          const key = dayObj.isCurrentMonth
            ? dateKey(year, month, dayObj.day)
            : null;
          const evs = key ? displayData[key] || [] : [];
          const isSelected = selectedDate === key;

          const todayObj = new Date();
          const isToday = dayObj.isCurrentMonth
            && dayObj.day === todayObj.getDate()
            && month === todayObj.getMonth()
            && year === todayObj.getFullYear();
          const isPast = dayObj.isCurrentMonth
            && new Date(year, month, dayObj.day) < new Date(todayObj.getFullYear(), todayObj.getMonth(), todayObj.getDate());

          const isBookingTab = activeTab === 'booking';
          const pastLocked = isPast && isBookingTab;

          return (
            <div
              key={idx}
              onClick={() => dayObj.isCurrentMonth && !pastLocked && selectDay(dayObj.day)}
              className={`aspect-square flex flex-col items-center justify-center rounded-xl text-sm transition-all select-none ${
                isSelected
                  ? 'bg-blue-600 text-white font-bold cursor-pointer shadow-md shadow-blue-200 dark:shadow-none'
                  : pastLocked
                    ? 'text-gray-300 dark:text-gray-700 cursor-not-allowed'
                    : dayObj.isCurrentMonth
                      ? 'hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-700 dark:text-gray-300 cursor-pointer'
                      : 'text-gray-300 dark:text-gray-700 cursor-default'
              } ${isToday && !isSelected ? 'ring-2 ring-blue-500 ring-inset font-bold text-blue-600 dark:text-blue-400' : ''}`}
            >
              <span className="font-semibold leading-none">{dayObj.day}</span>
              {dayObj.isCurrentMonth && evs.length > 0 && (
                <div className="flex gap-0.5 mt-1.5">
                  {evs.slice(0, 3).map((item, i) => (
                    <div
                      key={i}
                      className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white/70' : getCalendarDotClass(item)}`}
                    />
                  ))}
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
