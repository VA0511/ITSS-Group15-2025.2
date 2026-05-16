import React from 'react';
import { Users, UserCheck, UserX, Calendar, Dumbbell } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '@/components/Common/Button';
import StatsCard from '@/components/Dashboard/StatsCard';
import { useMembers } from '@/hooks/queries/useMembers';

// Mock Data - Stats
const dashboardStats = [
  {
    title: 'Tổng hội viên',
    value: '128',
    icon: Users,
    trend: 'up',
    trendValue: '+12',
    trendLabel: 'tháng này'
  },
  {
    title: 'Hội viên đang active',
    value: '102',
    icon: UserCheck,
    trend: 'up',
    trendValue: '+8',
    trendLabel: 'so với tuần trước'
  },
  {
    title: 'Lịch PT hôm nay',
    value: '24',
    icon: Calendar,
    trend: 'neutral',
    trendValue: 'Bình thường'
  },
  {
    title: 'PT đang làm việc',
    value: '12',
    icon: Dumbbell,
    trend: 'up',
    trendValue: '+3',
    trendLabel: 'hôm nay'
  }
];

// Mock Data - Hội viên mới
const newMembers = [
  { id: 1, name: 'Nguyễn Văn A', phone: '0901234567', package: 'Gói VIP', joinDate: '2026-04-10' },
  { id: 2, name: 'Trần Thị B', phone: '0912345678', package: 'Gói Cơ Bản', joinDate: '2026-04-11' },
  { id: 3, name: 'Lê Văn C', phone: '0923456789', package: 'Lớp Nhóm', joinDate: '2026-04-12' },
];

// Mock Data - Hội viên sắp hết hạn (tối đa 7 ngày nữa)
const expiringMembers = [
  { id: 10, name: 'Phạm Minh D', phone: '0934567890', package: 'Gói Nâng Cao', expiresIn: '2 ngày' },
  { id: 11, name: 'Hoàng Thị E', phone: '0945678901', package: 'Gói Cơ Bản', expiresIn: '5 ngày' },
  { id: 12, name: 'Vũ Văn F', phone: '0956789012', package: 'Gói VIP', expiresIn: '7 ngày' },
];

// Mock Data - Lịch PT hôm nay
const todaySchedules = [
  { id: 1, time: '06:00', pt: 'Hùng Gym', member: 'Nguyễn A', status: 'Done' },
  { id: 2, time: '07:30', pt: 'Tùng PT', member: 'Trần B', status: 'InProgress' },
  { id: 3, time: '09:00', pt: 'Lan Coach', member: 'Lê C', status: 'Scheduled' },
  { id: 4, time: '10:30', pt: 'Hùng Gym', member: 'Phạm D', status: 'Scheduled' },
];

const ManagerDashboard = () => {
  const { data: memberResponse = {} } = useMembers(1, 1000);

  const members = Array.isArray(memberResponse?.data) ? memberResponse.data : [];
  const totalMembers = memberResponse?.total ?? members.length;
  const activeMembers = members.filter((member) => member?.is_active === true || member?.status === 'active').length;

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
      value: '24',
      icon: Calendar,
      trend: 'neutral',
      trendValue: 'Bình thường'
    },
    {
      title: 'PT đang làm việc',
      value: '12',
      icon: Dumbbell,
      trend: 'up',
      trendValue: '+3',
      trendLabel: 'hôm nay'
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
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {dashboardStats.map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Quick Lists */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

        {/* Hội viên mới */}
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Hội viên mới</h3>
            <Link to="/manager/members">
              <Button variant="ghost" size="sm">Xem tất cả</Button>
            </Link>
          </div>
          <div className="space-y-3">
            {newMembers.map((member) => (
              <div key={member.id} className="flex items-start gap-3 border-b border-gray-100 pb-3 last:border-b-0 dark:border-gray-800">
                <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30"></div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 dark:text-white truncate">{member.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{member.phone} • {member.package}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hội viên sắp hết hạn */}
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Sắp hết hạn</h3>
            <Link to="/manager/members">
              <Button variant="ghost" size="sm">Xem tất cả</Button>
            </Link>
          </div>
          <div className="space-y-3">
            {expiringMembers.map((member) => (
              <div key={member.id} className="flex items-start gap-3 border-b border-gray-100 pb-3 last:border-b-0 dark:border-gray-800">
                <div className="h-8 w-8 rounded-full bg-red-100 dark:bg-red-900/30"></div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 dark:text-white truncate">{member.name}</p>
                  <p className="text-xs text-red-600 dark:text-red-400 font-medium">{member.expiresIn}</p>
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
            {todaySchedules.map((schedule) => (
              <div key={schedule.id} className="flex items-start gap-3 border-b border-gray-100 pb-3 last:border-b-0 dark:border-gray-800">
                <div className="rounded-full bg-purple-100 px-2 py-1 text-xs font-medium text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                  {schedule.time}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 dark:text-white text-sm truncate">{schedule.pt} • {schedule.member}</p>
                  <span className={`text-xs font-medium ${schedule.status === 'Done' ? 'text-green-600 dark:text-green-400' :
                    schedule.status === 'InProgress' ? 'text-blue-600 dark:text-blue-400' :
                      'text-gray-600 dark:text-gray-400'
                    }`}>
                    {schedule.status === 'Done' ? '✓ Hoàn thành' :
                      schedule.status === 'InProgress' ? '⏱ Đang diễn ra' :
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
