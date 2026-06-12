import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, UserPlus, Loader2, CheckCircle } from 'lucide-react';
import { memberService } from '@/services/memberService';
import { packageService } from '@/services/packageService';
import { toast } from '@/utils/toast';
import Button from '@/components/Common/Button';

import { useTranslation } from 'react-i18next';
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const getEmailErrorMsg = (error, t) => {
  const status = error?.response?.status;
  const raw = error?.response?.data?.message || error?.response?.data || '';
  const msg = typeof raw === 'string' ? raw.toLowerCase() : '';
  if (msg.includes('email') || msg.includes('mail')) return raw;
  if (status === 409) return t('members.toast.email_in_use');
  return null;
};

const CreateMemberWithAccount = () => {
    const { t } = useTranslation('manager');
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    full_name: '',
    phone: '',
    email: '',
    gender: 'Male',
    dob: '',
    address: '',
    package_id: '',
  });

  const [emailError, setEmailError] = useState('');

  const { data: packagesData } = useQuery({
    queryKey: ['packages'],
    queryFn: () => packageService.getPackages(),
  });

  const packages = Array.isArray(packagesData)
    ? packagesData
    : Array.isArray(packagesData?.data)
      ? packagesData.data
      : [];

  const filteredPackages = packages.filter((pkg) => {
    if (form.gender === 'Male') {
      return !/nữ/i.test(pkg.package_name);
    }
    return true;
  });

  useEffect(() => {
    if (filteredPackages.length > 0 && !form.package_id) {
      setForm((prev) => ({ ...prev, package_id: String(filteredPackages[0].id) }));
    }
  }, [packages]);

  // Khi đổi giới tính, nếu gói đang chọn bị ẩn thì reset về gói đầu tiên còn lại
  useEffect(() => {
    const stillAvailable = filteredPackages.some((p) => String(p.id) === String(form.package_id));
    if (!stillAvailable && filteredPackages.length > 0) {
      setForm((prev) => ({ ...prev, package_id: String(filteredPackages[0].id) }));
    }
  }, [form.gender]);

  const mutation = useMutation({
    mutationFn: (data) => memberService.createMemberWithAccount(data),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      toast.success(
        result?.email_sent
          ? t('members.toast.create_success_email')
          : t('members.toast.create_success_no_email')
      );
      navigate('/manager/members');
    },
    onError: (error) => {
      const emailMsg = getEmailErrorMsg(error, t);
      if (emailMsg) {
        setEmailError(emailMsg);
      } else {
        toast.error(error?.response?.data?.message || error?.response?.data || error?.message || t('members.toast.create_error'));
      }
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === 'email') setEmailError('');
  };

  const handleEmailBlur = () => {
    if (form.email && !EMAIL_REGEX.test(form.email.trim())) {
      setEmailError(t('members.toast.email_format'));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.full_name.trim()) {
      toast.error(t('members.toast.enter_name'));
      return;
    }
    if (!form.email.trim()) {
      setEmailError(t('members.toast.email_required'));
      return;
    }
    if (!EMAIL_REGEX.test(form.email.trim())) {
      setEmailError(t('members.toast.email_format'));
      return;
    }
    setEmailError('');

    const payload = {
      ...form,
      package_id: form.package_id ? parseInt(form.package_id) : 0,
      dob: form.dob ? new Date(form.dob).toISOString() : new Date('2000-01-01').toISOString(),
    };
    mutation.mutate(payload);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          onClick={() => navigate('/manager/members')}
          variant="secondary"
          size="sm"
          leftIcon={<ArrowLeft className="h-4 w-4" />}
          className="bg-gray-400 text-white hover:bg-gray-500 dark:bg-gray-500 dark:hover:bg-gray-600"
        >
          Quay lại
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Tạo Tài Khoản Hội Viên</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Nhập thông tin hội viên — hệ thống sẽ tự tạo tài khoản và gửi mật khẩu qua email
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950 space-y-6">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Họ và tên <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="full_name"
              value={form.full_name}
              onChange={handleChange}
              required
              placeholder="Nguyễn Văn A"
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="email"
              value={form.email}
              onChange={handleChange}
              onBlur={handleEmailBlur}
              placeholder="member@example.com"
              className={`w-full rounded-lg border bg-gray-50 px-3 py-2.5 text-sm outline-none transition focus:ring-2 dark:bg-gray-900 dark:text-white ${
                emailError
                  ? 'border-red-400 focus:border-red-500 focus:ring-red-500/10'
                  : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500/10 dark:border-gray-700'
              }`}
            />
            {emailError && (
              <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                <span>⚠</span> {emailError}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Số điện thoại</label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="0912345678"
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Giới tính</label>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            >
              <option value="Male">Nam</option>
              <option value="Female">Nữ</option>
              <option value="Other">Khác</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Ngày sinh</label>
            <input
              type="date"
              name="dob"
              value={form.dob}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Địa chỉ</label>
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="123 Đường ABC, Quận X, TP. HCM"
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Gói tập đăng ký <span className="text-red-500">*</span>
            </label>
            <select
              name="package_id"
              value={form.package_id}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            >
              {filteredPackages.map((pkg) => (
                <option key={pkg.id} value={pkg.id}>
                  {pkg.package_name} — {pkg.duration_days} ngày —{' '}
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(pkg.price)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="rounded-lg bg-blue-50 border border-blue-100 p-4 text-sm text-blue-700 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300">
          <div className="flex items-start gap-2">
            <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Tự động thực hiện sau khi tạo:</p>
              <ul className="mt-1 space-y-0.5 list-disc list-inside text-blue-600 dark:text-blue-400">
                <li>Tạo tài khoản với email làm tên đăng nhập</li>
                <li>Tạo mật khẩu tạm thời ngẫu nhiên</li>
                <li>Gửi thông tin đăng nhập đến email hội viên</li>
                <li>Đăng ký gói tập đã chọn</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="submit"
            disabled={mutation.isPending}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-70"
          >
            {mutation.isPending ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Đang xử lý...</>
            ) : (
              <><UserPlus className="h-4 w-4" /> Tạo tài khoản</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateMemberWithAccount;
