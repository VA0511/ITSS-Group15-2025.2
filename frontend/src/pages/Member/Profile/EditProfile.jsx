import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Button from '@/components/Common/Button';
import Input from '@/components/Common/Input';
import AvatarUpload from '@/components/Common/AvatarUpload';
import { memberService } from '@/services/memberService';
import useAuthStore from '@/store/useAuthStore';
import { toast } from '@/utils/toast';

const EditProfile = () => {
  const { t } = useTranslation('member');
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    email: '',
    dob: '',
    address: '',
    gender: 'Nam',
    roadmap_goal: '',
    member_free_schedule: '',
    avatar: '',
  });

  useEffect(() => {
    const fetchMemberData = async () => {
      if (!user?.id) return;
      try {
        setLoading(true);
        const response = await memberService.getMemberByAccountId(user.id);
        const member = response;
        setFormData({
          id: member.id,
          full_name: member.full_name || '',
          phone: member.phone || '',
          email: member.email || '',
          dob: member.dob ? member.dob.split('T')[0] : '',
          address: member.address || '',
          gender: member.gender || 'Nam',
          account_id: member.account_id,
          is_active: member.is_active ?? true,
          roadmap_goal: member.roadmap_goal || '',
          member_free_schedule: member.member_free_schedule || '',
          avatar: member.avatar || '',
        });
      } catch (error) {
        console.error('Error fetching member data:', error);
        toast.error(t('edit_profile.error_load'));
      } finally {
        setLoading(false);
      }
    };
    fetchMemberData();
  }, [user?.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.id) return;
    try {
      setSaving(true);
      const payload = {
        ...formData,
        dob: formData.dob ? `${formData.dob}T00:00:00Z` : undefined,
      };
      await memberService.updateMember(formData.id, payload);
      toast.success(t('edit_profile.success_update'));
      navigate('/member/profile');
    } catch (error) {
      console.error('Error updating member:', error);
      toast.error(t('edit_profile.error_update'));
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="w-full space-y-4 pb-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/member/profile">
            <Button variant="outline" size="icon" className="h-10 w-10 shrink-0 rounded-full shadow-sm">
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">{t('edit_profile.title')}</h1>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/member/profile">
            <Button variant="outline" className="rounded-xl px-5">{t('edit_profile.cancel')}</Button>
          </Link>
          <Button
            type="submit"
            form="edit-profile-form"
            isLoading={saving}
            className="rounded-xl px-5 font-bold"
            leftIcon={<Save className="h-4 w-4" />}
          >
            {t('edit_profile.save')}
          </Button>
        </div>
      </div>

      <form id="edit-profile-form" onSubmit={handleSubmit}>
        <div className="flex gap-4 items-start">

          {/* Left column */}
          <div className="w-52 shrink-0 space-y-4">

            {/* Avatar */}
            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950 p-5">
              <p className="mb-3 text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                {t('edit_profile.avatar_section')}
              </p>
              <div className="flex flex-col items-center">
                <AvatarUpload
                  avatarUrl={formData.avatar}
                  onUploaded={(url) => setFormData(prev => ({ ...prev, avatar: url }))}
                  size="lg"
                />
                <p className="mt-2 text-center text-xs font-semibold text-blue-600">{t('edit_profile.avatar_format')}</p>
                <p className="text-center text-xs text-gray-400">{t('edit_profile.avatar_max_size')}</p>
              </div>
            </div>

            {/* Name + Member ID */}
            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950 p-5 space-y-4">
              <Input
                label={t('edit_profile.full_name_label')}
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                required
              />
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-900 dark:text-gray-100">{t('edit_profile.member_id_label')}</label>
                <input
                  value={formData.id ? `MEM-${formData.id}` : '---'}
                  disabled
                  className="flex h-12 w-full rounded-xl border border-gray-200 bg-gray-100 px-4 py-2 font-mono text-sm text-gray-500 cursor-not-allowed dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
                />
              </div>
            </div>

          </div>

          {/* Right column */}
          <div className="flex-1 min-w-0 space-y-4">

            {/* Personal Info */}
            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950 p-5">
              <h3 className="mb-4 text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                {t('edit_profile.personal_info')}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label={t('edit_profile.phone_label')}
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  type="tel"
                  required
                />
                <Input
                  label={t('edit_profile.email_label')}
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  type="email"
                />
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-900 dark:text-gray-100">{t('edit_profile.gender_label')}</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="flex h-12 w-full rounded-xl border border-gray-300 bg-white px-4 py-2 font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                  >
                    <option value="Nam">{t('edit_profile.gender_male')}</option>
                    <option value="Nữ">{t('edit_profile.gender_female')}</option>
                    <option value="Khác">{t('edit_profile.gender_other')}</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-900 dark:text-gray-100">{t('edit_profile.dob_label')}</label>
                  <input
                    name="dob"
                    type="date"
                    value={formData.dob}
                    onChange={handleChange}
                    className="flex h-12 w-full rounded-xl border border-gray-300 bg-white px-4 py-2 font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                  />
                </div>
              </div>
              <div className="mt-4">
                <Input
                  label={t('edit_profile.address_label')}
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Training Info */}
            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950 p-5">
              <h3 className="mb-4 text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                {t('edit_profile.training_info')}
              </h3>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-900 dark:text-gray-100">{t('edit_profile.roadmap_label')}</label>
                  <textarea
                    name="roadmap_goal"
                    value={formData.roadmap_goal}
                    onChange={handleChange}
                    placeholder={t('edit_profile.roadmap_placeholder')}
                    rows={3}
                    className="flex w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all dark:border-gray-700 dark:bg-gray-950 dark:text-white resize-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-900 dark:text-gray-100">{t('edit_profile.schedule_label')}</label>
                  <textarea
                    name="member_free_schedule"
                    value={formData.member_free_schedule}
                    onChange={handleChange}
                    placeholder={t('edit_profile.schedule_placeholder')}
                    rows={3}
                    className="flex w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all dark:border-gray-700 dark:bg-gray-950 dark:text-white resize-none"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
