import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Info, ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Button from '@/components/Common/Button';
import Input from '@/components/Common/Input';
import { useCreateEmployee } from '@/hooks/mutations/useEmployeeMutation';

const POSITIONS = ['PT', 'manager', 'staff', 'receptionist', 'cashier', 'cleaner', 'security'];

const StaffFormPage = () => {
  const { t } = useTranslation('owner');
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  const createMutation = useCreateEmployee();

  const [form, setForm] = useState({
    full_name: '',
    position: '',
    gender: '',
    dob: '',
    phone: '',
    email: '',
    address: '',
  });

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...form };
    if (payload.dob) {
      payload.dob = new Date(payload.dob).toISOString();
    } else {
      delete payload.dob;
    }
    
    if (!isEditing) {
      createMutation.mutate(payload, {
        onSuccess: () => navigate('/owner/staffs')
      });
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <Link to="/owner/staffs">
          <Button variant="outline" size="icon" className="shrink-0 h-10 w-10">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {isEditing ? t('staff.form_page.title_edit') : t('staff.form_page.title_create')}
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {t('staff.form_page.subtitle')}
          </p>
        </div>
      </div>

      {/* Info banner: PT / Manager account notice */}
      <div className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950/30">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-blue-500" />
        <div className="text-sm text-blue-800 dark:text-blue-300">
          <p className="font-semibold mb-1">{t('staff.form_page.account_notice_title')}</p>
          <p>{t('staff.form_page.account_notice_body')}</p>
          <Link
            to="/owner/accounts"
            className="mt-2 inline-flex items-center gap-1 font-medium underline underline-offset-2 hover:text-blue-600 dark:hover:text-blue-200"
          >
            {t('staff.form_page.account_notice_link')}
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm md:p-8 dark:border-gray-800 dark:bg-gray-950 space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Họ tên */}
          <div className="md:col-span-2">
            <Input
              label={t('staff.form_page.name_label')}
              placeholder={t('staff.form_page.name_placeholder')}
              required
              value={form.full_name}
              onChange={handleChange('full_name')}
            />
          </div>

          {/* Chức vụ */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {t('staff.form_page.position_label')}
            </label>
            <select
              value={form.position}
              onChange={handleChange('position')}
              required
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">{t('staff.form_page.position_placeholder')}</option>
              {POSITIONS.map((pos) => (
                <option key={pos} value={pos}>
                  {t(`staff.form_page.position_${pos}`, { defaultValue: pos })}
                </option>
              ))}
            </select>
          </div>

          {/* Giới tính */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {t('staff.form_page.gender_label')}
            </label>
            <select
              value={form.gender}
              onChange={handleChange('gender')}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">{t('staff.form_page.gender_placeholder')}</option>
              <option value="male">{t('staff.form_page.gender_male')}</option>
              <option value="female">{t('staff.form_page.gender_female')}</option>
            </select>
          </div>

          {/* Ngày sinh */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {t('staff.form_page.dob_label')}
            </label>
            <input
              type="date"
              value={form.dob}
              onChange={handleChange('dob')}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          {/* SĐT */}
          <Input
            label={t('staff.form_page.phone_label')}
            placeholder={t('staff.form_page.phone_placeholder')}
            type="tel"
            value={form.phone}
            onChange={handleChange('phone')}
          />

          {/* Email liên hệ */}
          <Input
            label={t('staff.form_page.email_label')}
            placeholder={t('staff.form_page.email_placeholder')}
            type="email"
            value={form.email}
            onChange={handleChange('email')}
          />

          {/* Địa chỉ */}
          <div className="col-span-1 md:col-span-2 space-y-1">
            <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {t('staff.form_page.address_label')}
            </label>
            <textarea
              value={form.address}
              onChange={handleChange('address')}
              rows={3}
              placeholder={t('staff.form_page.address_placeholder')}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-gray-800 gap-3">
          <Link to="/owner/staffs">
            <Button variant="outline">{t('staff.form_page.btn_cancel')}</Button>
          </Link>
          <Button
            type="submit"
            leftIcon={<Save className="h-4 w-4" />}
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? t('staff.form_page.btn_saving') : t('staff.form_page.btn_save')}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default StaffFormPage;
