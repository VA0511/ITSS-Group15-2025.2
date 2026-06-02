import React, { useEffect, useState } from 'react';
import { User, Phone, Mail, MapPin, Edit3, ShieldCheck, Calendar, Loader2, Target, Clock, Lock, Eye, EyeOff, ChevronDown, ChevronUp } from 'lucide-react';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Button from '@/components/Common/Button';
import { memberService } from '@/services/memberService';
import { useChangePassword } from '@/hooks/mutations/useAuthMutations';
import useAuthStore from '@/store/useAuthStore';
import { toast } from '@/utils/toast';

const ProfileInfo = () => {
  const { t, i18n } = useTranslation('member');
  const { user } = useAuthStore();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPwForm, setShowPwForm] = useState(false);
  const [pwForm, setPwForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [pwShow, setPwShow] = useState({ old: false, new: false, confirm: false });
  const [pwError, setPwError] = useState('');
  const changePwMutation = useChangePassword();

  const locale = i18n.language === 'ja' ? 'ja-JP' : i18n.language === 'en' ? 'en-US' : 'vi-VN';

  useEffect(() => {
    const fetchMemberData = async () => {
      if (!user?.id) return;
      try {
        setLoading(true);
        const response = await memberService.getMemberByAccountId(user.id);
        setMember(response);
      } catch (error) {
        console.error('Error fetching member data:', error);
        toast.error(t('profile.error_load'));
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
        <p className="text-gray-500">{t('profile.not_found')}</p>
      </div>
    );
  }

  const pwFields = [
    { key: 'old', label: t('profile.pw_current'), field: 'oldPassword' },
    { key: 'new', label: t('profile.pw_new'), field: 'newPassword' },
    { key: 'confirm', label: t('profile.pw_confirm'), field: 'confirmPassword' },
  ];

  return (
    <div className="w-full space-y-4 pb-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">{t('profile.title')}</h1>
        <Link to="/member/profile/edit">
          <Button
            variant="outline"
            size="sm"
            className="rounded-full border-blue-200 px-5 font-semibold text-blue-600 shadow-sm hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-900/40"
            leftIcon={<Edit3 className="h-4 w-4" />}
          >
            {t('profile.edit_btn')}
          </Button>
        </Link>
      </div>

      {/* 2-column layout */}
      <div className="flex gap-4 items-start">

        {/* Left: Profile card */}
        <div className="w-52 shrink-0">
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950">
            <div className="relative h-20 bg-gradient-to-r from-blue-600 to-indigo-700">
              <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-md">
                <ShieldCheck className="h-3 w-3" />
                {member.is_active ? t('profile.verified') : t('profile.not_active')}
              </div>
            </div>
            <div className="flex flex-col items-center px-4 pb-5 pt-4">
              <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-4 border-gray-100 bg-gray-100 shadow-md dark:border-gray-800 dark:bg-gray-900">
                {member.avatar
                  ? <img src={`${API_URL}${member.avatar}`} alt="avatar" className="h-full w-full object-cover" />
                  : <User className="h-10 w-10 text-gray-400" />
                }
              </div>
              <h2 className="mt-3 text-base font-extrabold text-gray-900 dark:text-white text-center leading-tight">
                {member.full_name || t('profile.not_updated')}
              </h2>
              <p className="mt-0.5 font-mono text-sm font-semibold tracking-wide text-blue-600">MEM-{member.id}</p>
            </div>
          </div>
        </div>

        {/* Right: Info sections */}
        <div className="flex-1 min-w-0 space-y-4">

          {/* Personal Info */}
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950 p-5">
            <h3 className="mb-4 text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              {t('profile.personal_info')}
            </h3>
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">{t('profile.phone')}</p>
                <div className="flex items-center gap-2 font-semibold text-gray-800 dark:text-gray-200">
                  <Phone className="h-4 w-4 shrink-0 text-gray-400" />
                  <span>{member.phone || t('profile.not_updated')}</span>
                </div>
              </div>
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">{t('profile.email')}</p>
                <div className="flex items-center gap-2 font-semibold text-gray-800 dark:text-gray-200">
                  <Mail className="h-4 w-4 shrink-0 text-gray-400" />
                  <span className="truncate">{member.email || t('profile.not_updated')}</span>
                </div>
              </div>
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">{t('profile.gender')}</p>
                <div className="flex items-center gap-2 font-semibold text-gray-800 dark:text-gray-200">
                  <User className="h-4 w-4 shrink-0 text-gray-400" />
                  <span>{member.gender || t('profile.not_updated')}</span>
                </div>
              </div>
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">{t('profile.dob')}</p>
                <div className="flex items-center gap-2 font-semibold text-gray-800 dark:text-gray-200">
                  <Calendar className="h-4 w-4 shrink-0 text-gray-400" />
                  <span>{member.dob ? new Date(member.dob).toLocaleDateString(locale) : t('profile.not_updated')}</span>
                </div>
              </div>
              <div className="col-span-2">
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">{t('profile.address')}</p>
                <div className="flex items-center gap-2 font-semibold text-gray-800 dark:text-gray-200">
                  <MapPin className="h-4 w-4 shrink-0 text-gray-400" />
                  <span>{member.address || t('profile.not_updated')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Training Info */}
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950 p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              {t('profile.training_info')}
            </h3>
            <div className="flex items-start gap-3">
              <div className="shrink-0 rounded-xl bg-blue-50 p-2.5 text-blue-500 dark:bg-blue-900/30">
                <Target className="h-5 w-5" />
              </div>
              <div>
                <p className="mb-0.5 text-xs font-semibold text-gray-400 dark:text-gray-500">{t('profile.roadmap_goal')}</p>
                <p className="font-medium leading-snug text-gray-700 dark:text-gray-300">
                  {member.roadmap_goal || <span className="italic text-gray-400 dark:text-gray-600">{t('profile.not_updated')}</span>}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="shrink-0 rounded-xl bg-blue-50 p-2.5 text-blue-500 dark:bg-blue-900/30">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p className="mb-0.5 text-xs font-semibold text-gray-400 dark:text-gray-500">{t('profile.free_schedule')}</p>
                <p className="font-medium leading-snug text-gray-700 dark:text-gray-300">
                  {member.member_free_schedule || <span className="italic text-gray-400 dark:text-gray-600">{t('profile.not_updated')}</span>}
                </p>
              </div>
            </div>
          </div>

          {/* Change Password */}
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950">
            <button
              type="button"
              onClick={() => {
                setShowPwForm(v => !v);
                setPwError('');
                setPwForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
              }}
              className="flex w-full items-center justify-between px-5 py-4"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-gray-50 p-2.5 text-gray-500 dark:bg-gray-900">
                  <Lock className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{t('profile.change_password_title')}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">{t('profile.change_password_desc')}</p>
                </div>
              </div>
              {showPwForm ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
            </button>

            {showPwForm && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setPwError('');
                  if (pwForm.newPassword.length < 6) { setPwError(t('profile.pw_error_length')); return; }
                  if (pwForm.newPassword !== pwForm.confirmPassword) { setPwError(t('profile.pw_error_match')); return; }
                  changePwMutation.mutate(
                    { oldPassword: pwForm.oldPassword, newPassword: pwForm.newPassword },
                    { onSuccess: () => { setShowPwForm(false); setPwForm({ oldPassword: '', newPassword: '', confirmPassword: '' }); } }
                  );
                }}
                className="border-t border-gray-100 px-5 pb-5 pt-4 space-y-4 dark:border-gray-800"
              >
                {pwError && (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400">
                    {pwError}
                  </div>
                )}
                {pwFields.map(({ key, label, field }) => (
                  <div key={key} className="space-y-1.5">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
                    <div className="relative">
                      <input
                        type={pwShow[key] ? 'text' : 'password'}
                        value={pwForm[field]}
                        onChange={(e) => setPwForm(prev => ({ ...prev, [field]: e.target.value }))}
                        required
                        placeholder="••••••••"
                        className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-3 pr-10 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                      />
                      <button
                        type="button"
                        onClick={() => setPwShow(prev => ({ ...prev, [key]: !prev[key] }))}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                      >
                        {pwShow[key] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                ))}
                <div className="flex justify-end gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowPwForm(false)}
                    className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
                  >
                    {t('profile.pw_cancel')}
                  </button>
                  <button
                    type="submit"
                    disabled={changePwMutation.isPending}
                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-70"
                  >
                    {changePwMutation.isPending ? <><Loader2 className="h-4 w-4 animate-spin" /> {t('profile.pw_saving')}</> : t('profile.pw_save')}
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;
