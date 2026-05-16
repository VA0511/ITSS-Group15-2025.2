import React, { useEffect, useState } from 'react';
import { User, Phone, Mail, MapPin, Edit3, ShieldCheck, Calendar, Loader2, Target, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '@/components/Common/Button';
import { memberService } from '@/services/memberService';
import useAuthStore from '@/store/useAuthStore';
import { toast } from '@/utils/toast';

const ProfileInfo = () => {
  const { user } = useAuthStore();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMemberData = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        // Lấy thông tin member dựa trên account_id
        const response = await memberService.getMemberByAccountId(user.id);
        setMember(response);
      } catch (error) {
        console.error('Error fetching member data:', error);
        toast.error('Không thể tải thông tin cá nhân');
      } finally {
        setLoading(false);
      }
    };

    fetchMemberData();
  }, [user?.id]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!member) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">Không tìm thấy thông tin thành viên.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg space-y-6 pb-20 md:max-w-2xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tài Khoản</h1>
        <Link to="/member/profile/edit">
          <Button
            variant="outline"
            size="sm"
            className="rounded-full border-blue-200 px-5 font-semibold text-blue-600 shadow-sm hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-900/40"
            leftIcon={<Edit3 className="h-4 w-4" />}
          >
            Chỉnh sửa
          </Button>
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <div className="relative h-32 w-full bg-gradient-to-r from-blue-600 to-indigo-700">
          <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
            <ShieldCheck className="h-3 w-3" /> {member.is_active ? 'Đã xác thực' : 'Chưa kích hoạt'}
          </div>
          <div className="absolute -bottom-12 left-6 flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-[5px] border-white bg-gray-100 shadow-md dark:border-gray-950">
            <User className="h-14 w-14 text-gray-400" />
          </div>
        </div>

        <div className="px-6 pb-6 pt-16 sm:px-8">
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">{member.full_name || 'Chưa cập nhật'}</h2>
          <p className="mt-1 font-mono text-sm font-semibold tracking-wide text-blue-600">MEM-{member.id}</p>

          <div className="mt-8 space-y-5">
            <div className="flex items-center gap-4 text-gray-700 dark:text-gray-300">
              <div className="rounded-xl bg-gray-50 p-2.5 text-gray-500 dark:bg-gray-900">
                <Phone className="h-5 w-5" />
              </div>
              <span className="text-lg font-medium leading-none">{member.phone || 'Chưa cập nhật'}</span>
            </div>

            <div className="flex items-center gap-4 text-gray-700 dark:text-gray-300">
              <div className="rounded-xl bg-gray-50 p-2.5 text-gray-500 dark:bg-gray-900">
                <Mail className="h-5 w-5" />
              </div>
              <span className="font-medium leading-none text-gray-600 dark:text-gray-400">{member.email || 'Chưa cập nhật'}</span>
            </div>

            <div className="flex items-center gap-4 text-gray-700 dark:text-gray-300">
              <div className="rounded-xl bg-gray-50 p-2.5 text-gray-500 dark:bg-gray-900">
                <User className="h-5 w-5" />
              </div>
              <span className="font-medium leading-none text-gray-600 dark:text-gray-400">Giới tính: {member.gender || 'Chưa cập nhật'}</span>
            </div>

            <div className="flex items-center gap-4 text-gray-700 dark:text-gray-300">
              <div className="rounded-xl bg-gray-50 p-2.5 text-gray-500 dark:bg-gray-900">
                <Calendar className="h-5 w-5" />
              </div>
              <span className="font-medium leading-none text-gray-600 dark:text-gray-400">Ngày sinh: {member.dob ? new Date(member.dob).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}</span>
            </div>

            <div className="flex items-center gap-4 text-gray-700 dark:text-gray-300">
              <div className="shrink-0 rounded-xl bg-gray-50 p-2.5 text-gray-500 dark:bg-gray-900">
                <MapPin className="h-5 w-5" />
              </div>
              <span className="font-medium leading-snug text-gray-600 dark:text-gray-400">
                {member.address || 'Chưa cập nhật địa chỉ'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950 px-6 py-5 sm:px-8 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">Thông tin tập luyện</h3>

        <div className="flex items-start gap-4 text-gray-700 dark:text-gray-300">
          <div className="shrink-0 rounded-xl bg-gray-50 p-2.5 text-gray-500 dark:bg-gray-900">
            <Target className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 mb-0.5">Mục tiêu lộ trình</p>
            <p className="font-medium text-gray-600 dark:text-gray-400 leading-snug">
              {member.roadmap_goal || <span className="italic text-gray-400 dark:text-gray-600">Chưa cập nhật</span>}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4 text-gray-700 dark:text-gray-300">
          <div className="shrink-0 rounded-xl bg-gray-50 p-2.5 text-gray-500 dark:bg-gray-900">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 mb-0.5">Lịch rảnh</p>
            <p className="font-medium text-gray-600 dark:text-gray-400 leading-snug">
              {member.member_free_schedule || <span className="italic text-gray-400 dark:text-gray-600">Chưa cập nhật</span>}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;
