import React, { useState } from 'react';
import { User, Phone, Mail, MapPin, Calendar, Loader2, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useMyEmployee, useUpdateMyEmployee } from '@/hooks/queries/useEmployees';
import AvatarUpload from '@/components/Common/AvatarUpload';
import { toast } from '@/utils/toast';

const OwnerProfile = () => {
  const { t } = useTranslation('owner');
  const { data: employee, isLoading } = useMyEmployee();
  const updateMeMutation = useUpdateMyEmployee();
  const [saving, setSaving] = useState(false);

  const handleAvatarUploaded = (url) => {
    if (!employee) return;
    setSaving(true);
    updateMeMutation.mutate(
      { ...employee, avatar: url },
      {
        onSuccess: () => toast.success(t('profile.toast.avatar_success')),
        onError: () => toast.error(t('profile.toast.avatar_error')),
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
        <p className="text-gray-500">{t('profile.not_found')}</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4 pb-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">{t('profile.title')}</h1>
      </div>

      <div className="flex gap-4 items-start">
        {/* Left: profile card */}
        <div className="w-52 shrink-0">
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950">
            <div className="relative h-20 bg-gradient-to-r from-violet-600 to-purple-700">
              <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-md">
                <ShieldCheck className="h-3 w-3" />
                {t('profile.role')}
              </div>
            </div>
            <div className="flex flex-col items-center px-4 pb-5 pt-4">
              <AvatarUpload
                avatarUrl={employee.avatar || null}
                onUploaded={handleAvatarUploaded}
                size="md"
              />
              {saving && <p className="mt-1 text-xs text-blue-500">{t('profile.saving')}</p>}
              <h2 className="mt-3 text-base font-extrabold text-gray-900 dark:text-white text-center leading-tight">
                {employee.full_name || t('profile.not_updated')}
              </h2>
              <p className="mt-0.5 text-xs font-semibold tracking-wide text-violet-600">
                {employee.position || t('profile.position')}
              </p>
            </div>
          </div>
        </div>

        {/* Right: info */}
        <div className="flex-1 min-w-0">
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950 p-5">
            <h3 className="mb-4 text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              {t('profile.info.title')}
            </h3>
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">{t('profile.info.phone')}</p>
                <div className="flex items-center gap-2 font-semibold text-gray-800 dark:text-gray-200">
                  <Phone className="h-4 w-4 shrink-0 text-gray-400" />
                  <span>{employee.phone || t('profile.not_updated')}</span>
                </div>
              </div>
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">{t('profile.info.email')}</p>
                <div className="flex items-center gap-2 font-semibold text-gray-800 dark:text-gray-200">
                  <Mail className="h-4 w-4 shrink-0 text-gray-400" />
                  <span className="truncate">{employee.email || t('profile.not_updated')}</span>
                </div>
              </div>
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">{t('profile.info.gender')}</p>
                <div className="flex items-center gap-2 font-semibold text-gray-800 dark:text-gray-200">
                  <User className="h-4 w-4 shrink-0 text-gray-400" />
                  <span>{employee.gender || t('profile.not_updated')}</span>
                </div>
              </div>
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">{t('profile.info.dob')}</p>
                <div className="flex items-center gap-2 font-semibold text-gray-800 dark:text-gray-200">
                  <Calendar className="h-4 w-4 shrink-0 text-gray-400" />
                  <span>{employee.dob ? new Date(employee.dob).toLocaleDateString('vi-VN') : t('profile.not_updated')}</span>
                </div>
              </div>
              <div className="col-span-2">
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">{t('profile.info.address')}</p>
                <div className="flex items-center gap-2 font-semibold text-gray-800 dark:text-gray-200">
                  <MapPin className="h-4 w-4 shrink-0 text-gray-400" />
                  <span>{employee.address || t('profile.not_updated')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerProfile;
