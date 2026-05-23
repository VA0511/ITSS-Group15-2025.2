import React from 'react';
import {
  Users, UserCheck, Calendar, ClipboardList,
  MessageSquare, Clock, AlertTriangle, UserPlus,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '@/components/Common/Button';
import StatsCard from '@/components/Dashboard/StatsCard';
import { useMembers } from '@/hooks/queries/useMembers';
import { useEmployees } from '@/hooks/queries/useEmployees';
import { useTrainingBookings } from '@/hooks/queries/useTrainingBookings';
import { useFeedbacks } from '@/hooks/queries/useFeedbacks';

const ManagerDashboard = () => {
  const { data: memberResponse = {} }   = useMembers(1, 1000);
  const { data: employeeResponse = {} } = useEmployees(1, 1000);
  const { data: bookingResponse = {} }  = useTrainingBookings();
  const { data: feedbackResponse = {} } = useFeedbacks(1, 1000);

  const members   = Array.isArray(memberResponse?.data)   ? memberResponse.data   : [];
  const employees = Array.isArray(employeeResponse?.data) ? employeeResponse.data : (Array.isArray(employeeResponse) ? employeeResponse : []);
  const bookings  = Array.isArray(bookingResponse?.data)  ? bookingResponse.data  : (Array.isArray(bookingResponse)  ? bookingResponse  : []);
  const feedbacks = Array.isArray(feedbackResponse?.data) ? feedbackResponse.data : (Array.isArray(feedbackResponse) ? feedbackResponse : []);

  const totalMembers  = memberResponse?.total ?? members.length;
  const activeMembers = members.filter(m => m?.is_active === true || m?.status === 'active').length;

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const getMemberJoinDate = (m) => {
    const raw = m?.joinDate || m?.join_date || m?.created_at || m?.registration_date || null;
    if (!raw) return null;
    const d = new Date(raw);
    return isNaN(d.getTime()) ? null : d;
  };

  const newThisMonth = members.filter(m => {
    const d = getMemberJoinDate(m);
    return d && d >= startOfMonth;
  }).length;

  const isSameDate = (a, b) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const getEmployeeName = (id) => {
    const e = employees.find(e => e.id === id);
    return e?.full_name || e?.name || `PT #${id}`;
  };

  const getMemberName = (id) => {
    const m = members.find(m => m.id === id);
    return m?.full_name || m?.name || `HV #${id}`;
  };

  const formatTime = (iso) => {
    const d = new Date(iso);
    return isNaN(d.getTime()) ? '--:--' : d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (iso) => {
    const d = new Date(iso);
    return isNaN(d.getTime()) ? '--' : d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
  };

  const getSessionStatus = (booking) => {
    const raw = String(booking?.status || '').toLowerCase();
    if (raw === 'cancelled' || raw === 'rejected') return 'Cancelled';
    const start = new Date(booking?.requested_start);
    const end   = new Date(booking?.requested_end);
    if (!isNaN(end.getTime())   && end < now)                         return 'Done';
    if (!isNaN(start.getTime()) && start <= now && now <= end)        return 'InProgress';
    return 'Scheduled';
  };

  const todaySchedules = bookings
    .filter(b => {
      const s = new Date(b?.requested_start);
      return !isNaN(s.getTime()) && isSameDate(s, now);
    })
    .map(b => ({
      id: b.id,
      time: formatTime(b.requested_start),
      pt: getEmployeeName(b.pt_id),
      member: getMemberName(b.member_id),
      status: getSessionStatus(b),
    }))
    .sort((a, b) => a.time.localeCompare(b.time));

  const pendingRequests = bookings
    .filter(b => b?.status === 'Pending')
    .map(b => ({
      id: b.id,
      member: getMemberName(b.member_id),
      pt: getEmployeeName(b.pt_id),
      date: formatDate(b.requested_start),
      time: formatTime(b.requested_start),
    }))
    .slice(0, 6);

  const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const expiringMembers = members
    .filter(m => {
      if (!m.expiryDate) return false;
      const d = new Date(m.expiryDate);
      return !isNaN(d.getTime()) && d >= now && d <= in30Days;
    })
    .sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate))
    .slice(0, 6);

  const pendingFeedbackCount = feedbacks.filter(f =>
    f?.status?.toLowerCase() === 'pending'
  ).length;

  const todayDone = todaySchedules.filter(s => s.status === 'Done').length;

  const stats = [
    {
      title: 'Tổng hội viên',
      value: String(totalMembers),
      icon: Users,
      trend: 'neutral',
      trendValue: `${activeMembers} đang hoạt động`,
      trendLabel: '',
    },
    {
      title: 'Hội viên hoạt động',
      value: String(activeMembers),
      icon: UserCheck,
      trend: 'up',
      trendValue: totalMembers > 0 ? `${Math.round(activeMembers / totalMembers * 100)}%` : '0%',
      trendLabel: 'tổng số',
    },
    {
      title: 'Mới tháng này',
      value: String(newThisMonth),
      icon: UserPlus,
      trend: newThisMonth > 0 ? 'up' : 'neutral',
      trendValue: newThisMonth > 0 ? `+${newThisMonth}` : 'Chưa có',
      trendLabel: 'hội viên',
    },
    {
      title: 'Lịch PT hôm nay',
      value: String(todaySchedules.length),
      icon: Calendar,
      trend: 'neutral',
      trendValue: `${todayDone} hoàn thành`,
      trendLabel: '',
    },
    {
      title: 'Chờ xét duyệt',
      value: String(pendingRequests.length),
      icon: ClipboardList,
      trend: pendingRequests.length > 0 ? 'down' : 'neutral',
      trendValue: pendingRequests.length > 0 ? 'Cần xử lý' : 'Đã xong',
      trendLabel: '',
    },
    {
      title: 'Phản hồi chờ xử lý',
      value: String(pendingFeedbackCount),
      icon: MessageSquare,
      trend: pendingFeedbackCount > 0 ? 'down' : 'neutral',
      trendValue: pendingFeedbackCount > 0 ? 'Cần xử lý' : 'Đã xong',
      trendLabel: '',
    },
  ];

  const statusStyle = {
    Done:       'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    InProgress: 'bg-blue-100  text-blue-700  dark:bg-blue-900/30  dark:text-blue-400',
    Cancelled:  'bg-red-100   text-red-700   dark:bg-red-900/30   dark:text-red-400',
    Scheduled:  'bg-gray-100  text-gray-600  dark:bg-gray-800     dark:text-gray-400',
  };
  const statusLabel = {
    Done: 'Hoàn thành', InProgress: 'Đang diễn ra', Cancelled: 'Đã hủy', Scheduled: 'Đã lên lịch',
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Bảng Điều Khiển
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {now.toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Stats – 6 cards */}
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 xl:grid-cols-6">
        {stats.map(s => <StatsCard key={s.title} {...s} />)}
      </div>

      {/* Main content – 5-col grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">

        {/* Today's schedule – 3 cols */}
        <div className="lg:col-span-3 rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">Lịch PT hôm nay</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {todaySchedules.length} buổi · {todayDone} hoàn thành
              </p>
            </div>
            <Link to="/manager/schedule">
              <Button variant="ghost" size="sm">Xem lịch →</Button>
            </Link>
          </div>

          {todaySchedules.length === 0 ? (
            <div className="flex items-center justify-center py-12 text-sm text-gray-400 dark:text-gray-500">
              Không có lịch PT hôm nay
            </div>
          ) : (
            <div className="space-y-1.5 max-h-80 overflow-y-auto pr-1">
              {todaySchedules.map(s => (
                <div
                  key={s.id}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <span className="w-14 shrink-0 rounded-md bg-purple-50 dark:bg-purple-900/30 px-2 py-1 text-center text-xs font-semibold text-purple-700 dark:text-purple-300">
                    {s.time}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{s.pt}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">với {s.member}</p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyle[s.status]}`}>
                    {statusLabel[s.status]}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right column – 2 cols */}
        <div className="lg:col-span-2 flex flex-col gap-6">

          {/* Pending requests */}
          <div className="flex-1 rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">Yêu cầu chờ duyệt</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{pendingRequests.length} yêu cầu</p>
              </div>
              <Link to="/manager/schedule">
                <Button variant="ghost" size="sm">Xem tất cả →</Button>
              </Link>
            </div>

            {pendingRequests.length === 0 ? (
              <div className="flex items-center justify-center py-8 text-sm text-gray-400 dark:text-gray-500">
                Không có yêu cầu chờ duyệt
              </div>
            ) : (
              <div className="space-y-1.5">
                {pendingRequests.map(r => (
                  <div
                    key={r.id}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <div className="h-8 w-8 shrink-0 rounded-full bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center">
                      <Clock className="h-4 w-4 text-amber-500 dark:text-amber-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{r.member}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{r.pt} · {r.date} {r.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Expiring soon */}
          <div className="flex-1 rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">Sắp hết hạn</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">trong 30 ngày tới</p>
              </div>
              <Link to="/manager/members">
                <Button variant="ghost" size="sm">Xem tất cả →</Button>
              </Link>
            </div>

            {expiringMembers.length === 0 ? (
              <div className="flex items-center justify-center py-8 text-sm text-gray-400 dark:text-gray-500">
                Không có hội viên sắp hết hạn
              </div>
            ) : (
              <div className="space-y-1.5">
                {expiringMembers.map(m => {
                  const daysLeft = Math.ceil((new Date(m.expiryDate) - now) / 86400000);
                  return (
                    <div
                      key={m.id}
                      className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <div className="h-8 w-8 shrink-0 rounded-full bg-red-50 dark:bg-red-900/30 flex items-center justify-center">
                        <AlertTriangle className="h-4 w-4 text-red-500 dark:text-red-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {m.full_name || m.name || `HV #${m.id}`}
                        </p>
                        <p className="text-xs font-medium text-red-500 dark:text-red-400">
                          Còn {daysLeft} ngày
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
          Truy cập nhanh
        </p>
        <div className="flex flex-wrap gap-2">
          <Link to="/manager/members">
            <Button size="sm">Quản lý hội viên</Button>
          </Link>
          <Link to="/manager/schedule">
            <Button variant="outline" size="sm">Lịch PT</Button>
          </Link>
          <Link to="/manager/transactions">
            <Button variant="outline" size="sm">Giao dịch</Button>
          </Link>
          <Link to="/manager/feedbacks">
            <Button variant="outline" size="sm">Phản hồi</Button>
          </Link>
          <Link to="/manager/report">
            <Button variant="outline" size="sm">Báo cáo</Button>
          </Link>
          <Link to="/manager/packages">
            <Button variant="outline" size="sm">Gói tập</Button>
          </Link>
        </div>
      </div>

    </div>
  );
};

export default ManagerDashboard;
