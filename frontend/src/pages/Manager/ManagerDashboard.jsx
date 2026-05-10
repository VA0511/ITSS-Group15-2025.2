import React from 'react';
import { Users, UserCheck, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '@/components/Common/Button';
import StatsCard from '@/components/Dashboard/StatsCard';
import { useMembers } from '@/hooks/queries/useMembers';
import { useEmployees } from '@/hooks/queries/useEmployees';
import { useTrainingBookings } from '@/hooks/queries/useTrainingBookings';

const ManagerDashboard = () => {
  const { data: memberResponse = {} } = useMembers(1, 1000);
  const { data: employeeResponse = {} } = useEmployees(1, 1000);
  const { data: bookingResponse = {} } = useTrainingBookings();

  const members = Array.isArray(memberResponse?.data) ? memberResponse.data : [];
  const employees = Array.isArray(employeeResponse?.data) ? employeeResponse.data : (Array.isArray(employeeResponse) ? employeeResponse : []);
  const bookings = Array.isArray(bookingResponse?.data) ? bookingResponse.data : (Array.isArray(bookingResponse) ? bookingResponse : []);
  const totalMembers = memberResponse?.total ?? members.length;
  const activeMembers = members.filter((member) => member?.is_active === true || member?.status === 'active').length;

  const getMemberCreatedDate = (member) => {
    const rawDate =
      member?.created_at ||
      member?.createdAt ||
      member?.registration_date ||
      member?.registered_at ||
      member?.joinDate ||
      member?.joined_at ||
      null;

    if (!rawDate) return null;
    const parsed = new Date(rawDate);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  };

  const startOfCurrentWeek = (() => {
    const now = new Date();
    const day = now.getDay();
    const diffToMonday = day === 0 ? -6 : 1 - day;
    const start = new Date(now);
    start.setDate(now.getDate() + diffToMonday);
    start.setHours(0, 0, 0, 0);
    return start;
  })();

  const endOfCurrentWeek = new Date(startOfCurrentWeek);
  endOfCurrentWeek.setDate(startOfCurrentWeek.getDate() + 7);

  const weeklyNewMembers = members
    .filter((member) => {
      const createdDate = getMemberCreatedDate(member);
      return createdDate && createdDate >= startOfCurrentWeek && createdDate < endOfCurrentWeek;
    })
    .sort((a, b) => {
      const dateA = getMemberCreatedDate(a)?.getTime() ?? 0;
      const dateB = getMemberCreatedDate(b)?.getTime() ?? 0;
      return dateB - dateA;
    });

  const recentWeeklyMembers = weeklyNewMembers.slice(0, 5);

  const getEmployeeNameById = (employeeId) => {
    const employee = employees.find((item) => item.id === employeeId);
    return employee?.full_name || employee?.name || `PT #${employeeId}`;
  };

  const getMemberNameById = (memberId) => {
    const member = members.find((item) => item.id === memberId);
    return member?.full_name || member?.name || `Member #${memberId}`;
  };

  const isSameDate = (dateA, dateB) =>
    dateA.getFullYear() === dateB.getFullYear() &&
    dateA.getMonth() === dateB.getMonth() &&
    dateA.getDate() === dateB.getDate();

  const getScheduleStatus = (booking) => {
    const rawStatus = String(booking?.status || '').toLowerCase();
    if (rawStatus === 'cancelled' || rawStatus === 'rejected') return 'Cancelled';

    const now = new Date();
    const start = new Date(booking?.requested_start);
    const end = new Date(booking?.requested_end);

    if (!Number.isNaN(end.getTime()) && end < now) return 'Done';
    if (!Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime()) && start <= now && now <= end) return 'InProgress';
    return 'Scheduled';
  };

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    if (Number.isNaN(date.getTime())) return '--:--';
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  const today = new Date();
  const todaySchedules = bookings
    .filter((booking) => {
      const start = new Date(booking?.requested_start);
      return !Number.isNaN(start.getTime()) && isSameDate(start, today);
    })
    .map((booking) => ({
      id: booking.id,
      time: formatTime(booking.requested_start),
      pt: getEmployeeNameById(booking.pt_id),
      member: getMemberNameById(booking.member_id),
      status: getScheduleStatus(booking),
    }))
    .sort((a, b) => a.time.localeCompare(b.time));

  const getRemainingSessions = (member) => {
    const rawValue =
      member?.sessionsRemaining ??
      member?.remaining_sessions ??
      member?.remainingSessions ??
      member?.session_remaining ??
      member?.sessions_remaining ??
      member?.remainingBuoi ??
      null;

    const parsed = Number(rawValue);
    return Number.isFinite(parsed) ? parsed : null;
  };

  const expiringMembers = members
    .map((member) => ({
      ...member,
      remainingSessions: getRemainingSessions(member),
    }))
    .filter((member) => member.remainingSessions !== null && member.remainingSessions < 7)
    .sort((a, b) => a.remainingSessions - b.remainingSessions)
    .slice(0, 5);

  const dashboardStats = [
    {
      title: 'Tổng hội viên',
      value: String(totalMembers),
      icon: Users,
      trend: 'up',
      trendValue: '+12',
      trendLabel: 'tháng này'
    },
    {
      title: 'Hội viên đang active',
      value: String(activeMembers),
      icon: UserCheck,
      trend: 'up',
      trendValue: '+8',
      trendLabel: 'so với tuần trước'
    },
    {
      title: 'Lịch PT hôm nay',
      value: String(todaySchedules.length),
      icon: Calendar,
      trend: 'neutral',
      trendValue: 'Bình thường'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Bảng Điều Khiển Quản Lý</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Theo dõi tổng quan thống kê phòng gym hôm nay
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {dashboardStats.map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Quick Lists */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

        {/* Hội viên mới */}
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Hội viên mới (tuần này)</h3>
            <Link to="/manager/members">
              <Button variant="ghost" size="sm">Xem tất cả</Button>
            </Link>
          </div>
          <div className="space-y-3">
            {recentWeeklyMembers.length === 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400">Chưa có hội viên đăng ký trong tuần hiện tại</p>
            )}
            {recentWeeklyMembers.map((member) => (
              <div key={member.id} className="flex items-start gap-3 border-b border-gray-100 pb-3 last:border-b-0 dark:border-gray-800">
                <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30"></div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 dark:text-white truncate">{member.full_name || member.name || `Member #${member.id}`}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{member.phone || 'N/A'} • {getMemberCreatedDate(member)?.toLocaleDateString('vi-VN') || 'N/A'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hội viên sắp hết hạn */}
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Sắp hết hạn (&lt; 7 buổi)</h3>
            <Link to="/manager/members">
              <Button variant="ghost" size="sm">Xem tất cả</Button>
            </Link>
          </div>
          <div className="space-y-3">
            {expiringMembers.length === 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400">Không có hội viên nào còn dưới 7 buổi tập</p>
            )}
            {expiringMembers.map((member) => (
              <div key={member.id} className="flex items-start gap-3 border-b border-gray-100 pb-3 last:border-b-0 dark:border-gray-800">
                <div className="h-8 w-8 rounded-full bg-red-100 dark:bg-red-900/30"></div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 dark:text-white truncate">{member.full_name || member.name || `Member #${member.id}`}</p>
                  <p className="text-xs text-red-600 dark:text-red-400 font-medium">Còn {member.remainingSessions} buổi</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lịch PT hôm nay */}
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Lịch PT hôm nay</h3>
            <Link to="/manager/schedule">
              <Button variant="ghost" size="sm">Xem lịch</Button>
            </Link>
          </div>
          <div className="space-y-3">
            {todaySchedules.length === 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400">Không có lịch PT trong hôm nay</p>
            )}
            {todaySchedules.map((schedule) => (
              <div key={schedule.id} className="flex items-start gap-3 border-b border-gray-100 pb-3 last:border-b-0 dark:border-gray-800">
                <div className="rounded-full bg-purple-100 px-2 py-1 text-xs font-medium text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                  {schedule.time}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 dark:text-white text-sm truncate">{schedule.pt} • {schedule.member}</p>
                  <span className={`text-xs font-medium ${schedule.status === 'Done' ? 'text-green-600 dark:text-green-400' :
                    schedule.status === 'InProgress' ? 'text-blue-600 dark:text-blue-400' :
                      schedule.status === 'Cancelled' ? 'text-red-600 dark:text-red-400' :
                        'text-gray-600 dark:text-gray-400'
                    }`}>
                    {schedule.status === 'Done' ? '✓ Hoàn thành' :
                      schedule.status === 'InProgress' ? '⏱ Đang diễn ra' :
                        schedule.status === 'Cancelled' ? '✕ Đã hủy' :
                          '○ Đã lên lịch'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Quick Actions */}
      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Hành động nhanh</h3>
        <div className="flex flex-wrap gap-3">
          <Link to="/manager/members">
            <Button>Quản lý hội viên</Button>
          </Link>
          <Link to="/manager/schedule">
            <Button variant="outline">Lịch PT</Button>
          </Link>
          <Link to="/manager/transactions">
            <Button variant="outline">Giao dịch</Button>
          </Link>
          <Link to="/manager/feedbacks">
            <Button variant="outline">Phản hồi</Button>
          </Link>
          <Link to="/manager/report">
            <Button variant="outline">Báo cáo</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
