import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Clock, Users, AlertCircle, Loader2 } from 'lucide-react';
import Button from '@/components/Common/Button';
import Badge from '@/components/Common/Badge';
import { useTrainingBookings, useCancelTrainingBooking } from '@/hooks/queries/useTrainingBookings';
import { useEmployees } from '@/hooks/queries/useEmployees';
import { useMembers } from '@/hooks/queries/useMembers';

const ScheduleCalendarView = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [showCancelConfirm, setShowCancelConfirm] = useState(null);
    const [cancelError, setCancelError] = useState(null);

    // Fetch real data from API
    const { data: bookingsData, isLoading: bookingsLoading } = useTrainingBookings();
    const { data: employeesData, isLoading: employeesLoading } = useEmployees(1, 100);
    const { data: membersData, isLoading: membersLoading } = useMembers(1, 100);
    const cancelBookingMutation = useCancelTrainingBooking();

    // Helper functions
    const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const getFirstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    const formatDate = (date) => date.toISOString().split('T')[0];
    const formatTime = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    };

    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const monthYear = currentDate.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' });

    const previousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    };

    // Map API data to display format
    const getEmployeeNameById = (employeeId) => {
        const employees = Array.isArray(employeesData?.data) ? employeesData.data : [];
        const employee = employees.find(e => e.id === employeeId);
        return employee?.full_name || employee?.name || `PT #${employeeId}`;
    };

    const getMemberNameById = (memberId) => {
        const members = Array.isArray(membersData?.data) ? membersData.data : [];
        const member = members.find(m => m.id === memberId);
        return member?.full_name || member?.name || `Member #${memberId}`;
    };

    const mapStatusToUI = (apiStatus) => {
        switch (apiStatus?.toLowerCase()) {
            case 'accepted': return 'booked';
            case 'pending': return 'available';
            case 'rejected':
            case 'cancelled': return 'cancelled';
            default: return 'pending';
        }
    };

    const transformedBookings = useMemo(() => {
        const bookings = Array.isArray(bookingsData?.data) ? bookingsData.data : (Array.isArray(bookingsData) ? bookingsData : []);

        return bookings.map(booking => ({
            id: booking.id,
            date: formatDate(new Date(booking.requested_start)),
            time: formatTime(booking.requested_start),
            pt: getEmployeeNameById(booking.pt_id),
            member: getMemberNameById(booking.member_id),
            status: mapStatusToUI(booking.status),
            apiStatus: booking.status,
            capacity: '1/1', // Mỗi booking = 1 hội viên với 1 PT
            requestedStart: booking.requested_start,
            requestedEnd: booking.requested_end,
            trainingPlanNote: booking.training_plan_note,
        }));
    }, [bookingsData, employeesData, membersData]);

    // Group bookings by date
    const bookingsByDate = useMemo(() => {
        const grouped = {};
        transformedBookings.forEach(booking => {
            if (!grouped[booking.date]) {
                grouped[booking.date] = [];
            }
            grouped[booking.date].push(booking);
        });
        return grouped;
    }, [transformedBookings]);

    const weekDays = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    const calendarDays = [];

    for (let i = 0; i < firstDay; i++) calendarDays.push(null);
    for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i);

    const todaySchedules = bookingsByDate[selectedDate] || [];

    const getStatusColor = (status) => {
        switch (status) {
            case 'booked': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
            case 'available': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
            case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'booked': return 'Đã đặt lịch';
            case 'available': return 'Đang chờ';
            case 'cancelled': return 'Đã hủy';
            default: return 'Chưa xác định';
        }
    };

    const handleCancelBooking = async (bookingId) => {
        console.log('Opening cancel confirmation for booking:', bookingId);
        setCancelError(null);
        setShowCancelConfirm(bookingId);
    };

    const confirmCancel = async () => {
        if (showCancelConfirm) {
            try {
                console.log('Confirming cancel for booking:', showCancelConfirm);
                setCancelError(null);

                const response = await cancelBookingMutation.mutateAsync({
                    id: showCancelConfirm,
                    reason: 'Hủy bởi quản lý'
                });

                console.log('Cancel successful:', response);
                setShowCancelConfirm(null);
                setSelectedSchedule(null);
            } catch (error) {
                const errorMsg = error?.response?.data?.message || error?.message || 'Lỗi hủy lịch tập';
                console.error('Error canceling booking:', errorMsg, error);
                setCancelError(errorMsg);
            }
        }
    };

    const cancelCancel = () => {
        setShowCancelConfirm(null);
        setCancelError(null);
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
                                const hasSchedule = dateStr && bookingsByDate[dateStr];
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
                            {bookingsLoading || employeesLoading || membersLoading ? (
                                <div className="p-8 text-center">
                                    <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-2" />
                                    <p className="text-gray-500 dark:text-gray-400">Đang tải lịch tập...</p>
                                </div>
                            ) : todaySchedules.length === 0 ? (
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
                                                {schedule.status === 'cancelled' && (
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
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">Hội viên</p>
                                                        <p className="font-semibold text-gray-900 dark:text-white">{schedule.member}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">Trạng thái</p>
                                                        <p className="font-semibold text-gray-900 dark:text-white">{getStatusLabel(schedule.status)}</p>
                                                    </div>
                                                </div>

                                                {schedule.trainingPlanNote && (
                                                    <div>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">Ghi chú</p>
                                                        <p className="text-sm text-gray-700 dark:text-gray-300">{schedule.trainingPlanNote}</p>
                                                    </div>
                                                )}

                                                <div className="flex gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className={schedule.status === 'cancelled' ? 'text-red-600 dark:text-red-400' : 'text-red-600 dark:text-red-400'}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            if (schedule.status !== 'cancelled') {
                                                                handleCancelBooking(schedule.id);
                                                            }
                                                        }}
                                                        disabled={schedule.status === 'cancelled' || cancelBookingMutation.isPending}
                                                    >
                                                        {schedule.status === 'cancelled'
                                                            ? 'Đã hủy'
                                                            : cancelBookingMutation.isPending ? 'Đang xử lý...' : 'Hủy lịch'}
                                                    </Button>
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

            {/* Cancel Confirmation Modal */}
            {showCancelConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 max-w-sm mx-4">
                        <div className="flex items-center gap-3 mb-4">
                            <AlertCircle className="text-red-500" size={24} />
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Xác nhận hủy lịch</h3>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                            Bạn có chắc chắn muốn hủy lịch tập này không?
                        </p>

                        {cancelError && (
                            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-sm text-red-700 dark:text-red-400">
                                {cancelError}
                            </div>
                        )}

                        <div className="flex gap-3 justify-end">
                            <Button
                                variant="outline"
                                onClick={cancelCancel}
                                disabled={cancelBookingMutation.isPending}
                            >
                                Không
                            </Button>
                            <Button
                                className="bg-red-600 hover:bg-red-700 text-white"
                                onClick={confirmCancel}
                                disabled={cancelBookingMutation.isPending}
                            >
                                {cancelBookingMutation.isPending ? 'Đang xử lý...' : 'Xác nhận'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ScheduleCalendarView;
