import React from 'react';

const ScheduleTabs = ({ activeTab, setActiveTab, setSelectedDate, defaultRequestDate, openScheduledTab, todayKey }) => {
  return (
    <div className="flex gap-2 p-4 overflow-x-auto no-scrollbar border-b border-gray-100 dark:border-gray-800">
      <button
        onClick={openScheduledTab}
        className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors whitespace-nowrap ${
          activeTab === 'scheduled'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
        }`}
      >
        Lịch tập của tôi
      </button>
      <button
        onClick={() => {
          setActiveTab('booking');
          setSelectedDate(todayKey);
        }}
        className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors whitespace-nowrap ${
          activeTab === 'booking'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
        }`}
      >
        Đặt buổi tập
      </button>
      <button
        onClick={() => {
          setActiveTab('requests');
          setSelectedDate(defaultRequestDate);
        }}
        className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors whitespace-nowrap ${
          activeTab === 'requests'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
        }`}
      >
        Yêu cầu của tôi
      </button>
    </div>
  );
};

export default ScheduleTabs;
