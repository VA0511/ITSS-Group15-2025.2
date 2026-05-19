import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, UserPlus, Loader2, CheckCircle } from 'lucide-react';
import { memberService } from '@/services/memberService';
import { packageService } from '@/services/packageService';
import { toast } from '@/utils/toast';

const CreateMemberWithAccount = () => {
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

  const { data: packagesData } = useQuery({
    queryKey: ['packages'],
    queryFn: () => packageService.getPackages(),
  });

  const packages = Array.isArray(packagesData)
    ? packagesData
    : Array.isArray(packagesData?.data)
    ? packagesData.data
    : [];

  const mutation = useMutation({
    mutationFn: (data) => memberService.createMemberWithAccount(data),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      toast.success(
        result?.email_sent
          ? 'Tạo tài khoản thành công! Email đã được gửi đến hội viên.'
          : 'Tạo tài khoản thành công! (Không thể gửi email, vui lòng thông báo thủ công)'
      );
      navigate('/manager/members');
    },
    onError: (error) => {
      toast.error(error?.response?.data || error?.message || 'Tạo tài khoản thất bại');
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.full_name.trim() || !form.email.trim()) {
      toast.error('Vui lòng nhập họ tên và email');
      return;
    }

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
        <button
          onClick={() => navigate('/manager/members')}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại
        </button>
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
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="member@example.com"
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            />
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
              Gói tập đăng ký
            </label>
            <select
              name="package_id"
              value={form.package_id}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            >
              <option value="">-- Không chọn gói --</option>
              {packages.map((pkg) => (
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
                {form.package_id && <li>Đăng ký gói tập đã chọn</li>}
              </ul>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/manager/members')}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            Hủy
          </button>
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
