import React, { useState } from 'react';
import { User, Phone, Mail, MapPin, Calendar, Loader2, ShieldCheck } from 'lucide-react';
import { useMyEmployee, useUpdateMyEmployee } from '@/hooks/queries/useEmployees';
import AvatarUpload from '@/components/Common/AvatarUpload';
import { toast } from '@/utils/toast';

import { useTranslation } from 'react-i18next';
const ManagerProfile = () => {
    const { t } = useTranslation('manager');
  const { data: employee, isLoading } = useMyEmployee();
  const updateMeMutation = useUpdateMyEmployee();
  const [saving, setSaving] = useState(false);

  const handleAvatarUploaded = (url) => {
    if (!employee) return;
    setSaving(true);
    updateMeMutation.mutate(
      { ...employee, avatar: url },
      {
        onSuccess: () => toast.success(t('profile.avatar_success')),
        onError: () => toast.error(t('profile.avatar_error')),
        onSettled: () => setSaving(false),
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">Không tìm thấy thông tin nhân viên.</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4 pb-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Hồ sơ cá nhân</h1>
      </div>

      <div className="flex gap-4 items-start">
        {/* Left: profile card */}
        <div className="w-52 shrink-0">
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950">
            <div className="relative h-20 bg-gradient-to-r from-emerald-600 to-teal-700">
              <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-md">
                <ShieldCheck className="h-3 w-3" />
                Manager
              </div>
            </div>
            <div className="flex flex-col items-center px-4 pb-5 pt-4">
              <AvatarUpload
                avatarUrl={employee.avatar || null}
                onUploaded={handleAvatarUploaded}
                size="md"
              />
              {saving && <p className="mt-1 text-xs text-blue-500">Đang lưu...</p>}
              <h2 className="mt-3 text-base font-extrabold text-gray-900 dark:text-white text-center leading-tight">
                {employee.full_name || 'Chưa cập nhật'}
              </h2>
              <p className="mt-0.5 text-xs font-semibold tracking-wide text-emerald-600">
                {employee.position || 'Manager'}
              </p>
            </div>
          </div>
        </div>

        {/* Right: info */}
        <div className="flex-1 min-w-0">
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950 p-5">
            <h3 className="mb-4 text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Thông tin cá nhân
            </h3>
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">Số điện thoại</p>
                <div className="flex items-center gap-2 font-semibold text-gray-800 dark:text-gray-200">
                  <Phone className="h-4 w-4 shrink-0 text-gray-400" />
                  <span>{employee.phone || 'Chưa cập nhật'}</span>
                </div>
              </div>
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">Email</p>
                <div className="flex items-center gap-2 font-semibold text-gray-800 dark:text-gray-200">
                  <Mail className="h-4 w-4 shrink-0 text-gray-400" />
                  <span className="truncate">{employee.email || 'Chưa cập nhật'}</span>
                </div>
              </div>
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">Giới tính</p>
                <div className="flex items-center gap-2 font-semibold text-gray-800 dark:text-gray-200">
                  <User className="h-4 w-4 shrink-0 text-gray-400" />
                  <span>{employee.gender || 'Chưa cập nhật'}</span>
                </div>
              </div>
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">Ngày sinh</p>
                <div className="flex items-center gap-2 font-semibold text-gray-800 dark:text-gray-200">
                  <Calendar className="h-4 w-4 shrink-0 text-gray-400" />
                  <span>{employee.dob ? new Date(employee.dob).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}</span>
                </div>
              </div>
              <div className="col-span-2">
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">Địa chỉ</p>
                <div className="flex items-center gap-2 font-semibold text-gray-800 dark:text-gray-200">
                  <MapPin className="h-4 w-4 shrink-0 text-gray-400" />
                  <span>{employee.address || 'Chưa cập nhật'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerProfile;
