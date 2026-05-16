import React, { useEffect, useState } from 'react';
import { QrCode, Calendar, Activity, Loader2, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import useAuthStore from '@/store/useAuthStore';
import { memberService } from '@/services/memberService';
import { packageService } from '@/services/packageService';
import { trainingService } from '@/services/trainingService';
import { toast } from '@/utils/toast';

const MemberDashboard = () => {
  const { user } = useAuthStore();
  const [member, setMember] = useState(null);
  const [activePackage, setActivePackage] = useState(null);
  const [nextWorkout, setNextWorkout] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        // 1. Lấy thông tin member (dữ liệu từ backend trả về qua .data)
        const memberRes = await memberService.getMemberByAccountId(user.id);
        setMember(memberRes);

        // 2. Lấy gói tập hiện tại
        const packagesRes = await packageService.getMemberPackages();
        // Backend trả về { data: [...], page, total } hoặc array
        const packages = Array.isArray(packagesRes)
          ? packagesRes
          : Array.isArray(packagesRes?.data?.data)
          ? packagesRes.data.data
          : Array.isArray(packagesRes?.data)
          ? packagesRes.data
          : [];
        const active = packages.find(pkg => pkg.status === 'active' || pkg.status === 'Active');
        setActivePackage(active);

        // 3. Lấy buổi tập tiếp theo (bỏ qua nếu lỗi - không ảnh hưởng dashboard)
        try {
          const sessionsRes = await trainingService.getSessions();
          const sessions = Array.isArray(sessionsRes?.data) ? sessionsRes.data : [];
          const now = new Date();
          const upcoming = sessions
            .filter(s => new Date(s.session_time) > now)
            .sort((a, b) => new Date(a.session_time) - new Date(b.session_time));
          if (upcoming.length > 0) setNextWorkout(upcoming[0]);
        } catch {
          // Training sessions không bắt buộc, bỏ qua lỗi
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Không thể tải dữ liệu tổng quan. Vui lòng đăng nhập lại.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user?.id]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const formatDateTime = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ' ' + 
           date.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit' });
  };

  return (
    <div className="space-y-6 max-w-lg mx-auto md:max-w-full pb-20">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Xin chào, {member?.full_name || user?.username} 👋
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Member ID: MEM-{member?.id || '...'}
        </p>
      </div>
      <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-6 shadow-lg text-white text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full blur-xl"></div>
        <h2 className="font-medium text-blue-100 mb-4 tracking-wider text-sm">THẺ HỘI VIÊN ĐIỆN TỬ</h2>
        <div className="bg-white p-4 rounded-xl inline-block mx-auto mb-4 shadow-sm">
          <QrCode className="h-40 w-40 text-gray-900" />
        </div>
        <p className="font-mono text-xl tracking-widest font-bold">MEM-{member?.id || '000000'}</p>
        <p className="text-sm text-blue-200 mt-2">Đưa mã này vào máy quét tại Quầy Lễ Tân</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Package Expiration Rectangle */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <Calendar className="h-8 w-8 text-blue-500 mb-3" />
          <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">GÓI TẬP HIỆN TẠI</p>
          <p className="font-bold text-gray-900 dark:text-white text-base mb-3 line-clamp-2">
            {activePackage?.package_name || activePackage?.name || 'Chưa đăng ký gói tập'}
          </p>
          {activePackage && (
            <div className="mb-4">
              <p className="text-xs text-gray-600 dark:text-gray-400">Hết hạn</p>
              <p className="font-bold text-gray-900 dark:text-white text-lg">
                {new Date(activePackage.end_date).toLocaleDateString('vi-VN')}
              </p>
            </div>
          )}
          <Link
            to="/member/register-package"
            className="inline-block text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-semibold underline"
          >
            {activePackage ? 'Gia hạn / Nâng cấp' : 'Đăng ký ngay'}
          </Link>
        </div>

        {/* Next Schedule Rectangle */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <Activity className="h-8 w-8 text-green-500 mb-3" />
          <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">BUỔI TẬP TIẾP THEO</p>
          {nextWorkout ? (
            <>
              <p className="font-bold text-gray-900 dark:text-white text-base mb-2">
                {formatDateTime(nextWorkout.session_time)}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                {nextWorkout.pt_feedback ? 'Có hướng dẫn mới' : 'Buổi tập cá nhân'}
              </p>
              
              {nextWorkout.member_confirmed ? (
                <div className="flex items-center gap-2 text-xs text-green-600 font-bold bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-lg w-fit mb-3">
                  <CheckCircle2 className="h-4 w-4" /> Đã xác nhận tham gia
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs text-amber-600 font-bold bg-amber-50 dark:bg-amber-900/20 px-3 py-1.5 rounded-lg w-fit">
                    <Activity className="h-4 w-4" /> Cần xác nhận tham gia
                  </div>
                  <Link
                    to="/member/schedule"
                    className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 rounded-lg transition-colors shadow-sm"
                  >
                    Xác nhận ngay
                  </Link>
                </div>
              )}
            </>
          ) : (
            <p className="text-sm text-gray-500 mb-4 italic">Chưa có lịch tập sắp tới</p>
          )}
          <Link
            to="/member/schedule"
            className="inline-block text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-semibold underline"
          >
            Xem lịch chi tiết
          </Link>
        </div>
      </div>
    </div>
  );
};
export default MemberDashboard;
