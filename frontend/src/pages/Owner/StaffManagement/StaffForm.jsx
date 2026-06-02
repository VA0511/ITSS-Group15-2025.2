import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Button from '@/components/Common/Button';
import Input from '@/components/Common/Input';

const StaffFormPage = () => {
  const { t } = useTranslation('owner');
  const { id } = useParams();
  const isEditing = !!id;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
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

      <form className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm md:p-8 dark:border-gray-800 dark:bg-gray-950 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label={t('staff.form_page.name_label')}
            placeholder={t('staff.form_page.name_placeholder')}
            required
            defaultValue={isEditing ? "Trần Anh HLV" : ""}
          />
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-900 dark:text-gray-100">{t('staff.form_page.role_label')}</label>
            <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50">
              <option value="trainer">{t('staff.form_page.role_trainer')}</option>
              <option value="manager">{t('staff.form_page.role_manager')}</option>
            </select>
          </div>

          <Input
            label={t('staff.form_page.phone_label')}
            placeholder={t('staff.form_page.phone_placeholder')}
            type="tel"
            defaultValue={isEditing ? "0999666555" : ""}
          />
          <Input
            label={t('staff.form_page.email_label')}
            placeholder={t('staff.form_page.email_placeholder')}
            type="email"
            defaultValue={isEditing ? "pt.trananh@activegym.vn" : ""}
          />

          {!isEditing && (
            <div className="col-span-1 md:col-span-2">
              <Input
                label={t('staff.form_page.password_label')}
                placeholder={t('staff.form_page.password_placeholder')}
                type="password"
              />
            </div>
          )}
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-gray-800">
          <Link to="/owner/staffs">
             <Button variant="outline" className="mr-3">{t('staff.form_page.btn_cancel')}</Button>
          </Link>
          <Button leftIcon={<Save className="h-4 w-4" />}>
            {t('staff.form_page.btn_save')}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default StaffFormPage;
