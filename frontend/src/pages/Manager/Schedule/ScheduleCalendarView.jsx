import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Clock, Users, AlertCircle } from 'lucide-react';
import Button from '@/components/Common/Button';
import Badge from '@/components/Common/Badge';

// Mock schedule data
const scheduleMockData = {
    '2026-04-13': [ // Monday
        { id: 1, time: '06:00', pt: 'Hùng Gym', member: 'Nguyễn A', status: 'booked', capacity: '12/15' },
        { id: 2, time: '07:30', pt: 'Tùng PT', member: 'Trần B', status: 'booked', capacity: '15/15' },
        { id: 3, time: '09:00', pt: 'Lan Coach', member: 'Lê C', status: 'available', capacity: '8/15' },
        { id: 4, time: '10:30', pt: 'Hùng Gym', member: 'Phạm D', status: 'booked', capacity: '13/15' },
    ],
    '2026-04-14': [ // Tuesday
        { id: 5, time: '06:00', pt: 'Tùng PT', member: 'Hoàng E', status: 'booked', capacity: '14/15' },
        { id: 6, time: '07:30', pt: 'Lan Coach', member: 'Vũ F', status: 'available', capacity: '5/15' },
        { id: 7, time: '09:00', pt: 'Hùng Gym', member: 'Đỗ G', status: 'full', capacity: '15/15' },
    ],
    '2026-04-15': [ // Wednesday
        { id: 8, time: '06:00', pt: 'Lan Coach', member: 'Bùi H', status: 'booked', capacity: '10/15' },
        { id: 9, time: '07:30', pt: 'Hùng Gym', member: 'Ngô I', status: 'booked', capacity: '12/15' },
    ],
};

const ScheduleCalendarView = () => {
    const [currentDate, setCurrentDate] = useState(new Date('2026-04-13'));
    const [selectedDate, setSelectedDate] = useState('2026-04-13');
    const [selectedSchedule, setSelectedSchedule] = useState(null);

    // Helper functions
    const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const getFirstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    const formatDate = (date) => date.toISOString().split('T')[0];
    const isSameDay = (date1, date2) => formatDate(date1) === date2;

    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const monthYear = currentDate.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' });

    const previousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    };

    const weekDays = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    const calendarDays = [];

    for (let i = 0; i < firstDay; i++) calendarDays.push(null);
    for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i);

    const todaySchedules = scheduleMockData[selectedDate] || [];

    const getStatusColor = (status) => {
        switch (status) {
            case 'booked': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
            case 'available': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
            case 'full': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'booked': return 'Đã đặt lịch';
            case 'available': return 'Còn chỗ';
            case 'full': return 'Đầy';
            default: return 'Chưa xác định';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Lịch PT</h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Xem và quản lý lịch tập của huấn luyện viên
                    </p>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Calendar */}
                <div className="rounded-xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950 lg:col-span-1">
                    {/* Calendar Header */}
                    <div className="border-b border-gray-100 p-4 dark:border-gray-800">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-gray-900 dark:text-white">{monthYear}</h3>
                            <div className="flex gap-2">
                                <button onClick={previousMonth} className="p-1 hover:bg-gray-100 rounded-lg dark:hover:bg-gray-800">
                                    <ChevronLeft size={18} />
                                </button>
                                <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded-lg dark:hover:bg-gray-800">
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Week days */}
                        <div className="grid grid-cols-7 gap-1 mb-2">
                            {weekDays.map(day => (
                                <div key={day} className="h-8 flex items-center justify-center text-xs font-semibold text-gray-600 dark:text-gray-400">
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Days */}
                        <div className="grid grid-cols-7 gap-1">
                            {calendarDays.map((day, index) => {
                                const dateStr = day ? formatDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day)) : null;
                                const hasSchedule = dateStr && scheduleMockData[dateStr];
                                const isSelected = dateStr === selectedDate;

                                return (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            if (dateStr) setSelectedDate(dateStr);
                                        }}
                                        className={`h-8 rounded text-xs font-medium transition-colors ${day ? 'cursor-pointer' : 'cursor-default'
                                            } ${isSelected
                                                ? 'bg-blue-600 text-white dark:bg-blue-500'
                                                : hasSchedule
                                                    ? 'bg-blue-50 text-blue-900 dark:bg-blue-900/20 dark:text-blue-400'
                                                    : day
                                                        ? 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                                                        : 'text-gray-300 dark:text-gray-600'
                                            }`}
                                    >
                                        {day}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="p-4 space-y-2">
                        <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">Chú thích:</p>
                        <div className="space-y-2 text-xs">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded bg-green-500"></div>
                                <span className="text-gray-600 dark:text-gray-400">Đã đặt lịch</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded bg-blue-500"></div>
                                <span className="text-gray-600 dark:text-gray-400">Còn chỗ</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded bg-red-500"></div>
                                <span className="text-gray-600 dark:text-gray-400">Đầy</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Schedule List */}
                <div className="lg:col-span-2">
                    <div className="rounded-xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950">
                        <div className="border-b border-gray-100 p-4 dark:border-gray-800">
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                                Lịch {new Date(selectedDate + 'T00:00:00').toLocaleDateString('vi-VN', { weekday: 'long', month: 'short', day: 'numeric' })}
                            </h3>
                        </div>

                        <div className="divide-y divide-gray-100 dark:divide-gray-800">
                            {todaySchedules.length === 0 ? (
                                <div className="p-8 text-center">
                                    <p className="text-gray-500 dark:text-gray-400">Không có lịch nào trong ngày</p>
                                </div>
                            ) : (
                                todaySchedules.map((schedule) => (
                                    <div
                                        key={schedule.id}
                                        onClick={() => setSelectedSchedule(selectedSchedule?.id === schedule.id ? null : schedule)}
                                        className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex gap-4 flex-1">
                                                <div className="rounded-lg bg-purple-100 dark:bg-purple-900/30 px-3 py-2 text-sm font-semibold text-purple-700 dark:text-purple-400 min-w-fit">
                                                    {schedule.time}
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-semibold text-gray-900 dark:text-white">{schedule.pt}</h4>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">{schedule.member}</p>
                                                    <div className="mt-2 flex items-center gap-2">
                                                        <Badge className={getStatusColor(schedule.status)}>
                                                            {getStatusLabel(schedule.status)}
                                                        </Badge>
                                                        <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                                            <Users size={14} />
                                                            {schedule.capacity}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex gap-2 ml-2">
                                                {schedule.status === 'full' && (
                                                    <AlertCircle className="text-red-500 flex-shrink-0" size={20} />
                                                )}
                                            </div>
                                        </div>

                                        {/* Expanded view */}
                                        {selectedSchedule?.id === schedule.id && (
                                            <div className="mt-4 border-t border-gray-200 pt-4 dark:border-gray-700 space-y-3">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">Giờ</p>
                                                        <p className="font-semibold text-gray-900 dark:text-white">{schedule.time}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">Huấn luyện viên</p>
                                                        <p className="font-semibold text-gray-900 dark:text-white">{schedule.pt}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">Hội viên đăng ký</p>
                                                        <p className="font-semibold text-gray-900 dark:text-white">{schedule.member}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">Dung lượng</p>
                                                        <p className="font-semibold text-gray-900 dark:text-white">{schedule.capacity}</p>
                                                    </div>
                                                </div>

                                                <div className="flex gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                                                    <Button variant="outline" size="sm">Chỉnh sửa</Button>
                                                    <Button variant="outline" size="sm" className="text-red-600 dark:text-red-400">Hủy lịch</Button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Hành động nhanh</h3>
                <div className="flex flex-wrap gap-3">
                    <Button>
                        <Clock size={16} />
                        Thêm lịch mới
                    </Button>
                    <Button variant="outline">Xuất lịch</Button>
                    <Button variant="outline">Gửi thông báo</Button>
                </div>
            </div>
        </div>
    );
};

export default ScheduleCalendarView;
