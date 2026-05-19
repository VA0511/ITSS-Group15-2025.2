import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react';
import { useChangePassword } from '@/hooks/mutations/useAuthMutations';

const ChangePassword = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [show, setShow] = useState({ old: false, new: false, confirm: false });
  const [error, setError] = useState('');

  const mutation = useChangePassword();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (form.newPassword.length < 6) {
      setError('Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      setError('Mật khẩu mới và xác nhận không khớp');
      return;
    }

    mutation.mutate(
      { oldPassword: form.oldPassword, newPassword: form.newPassword },
      {
        onSuccess: () => navigate('/member/profile'),
      }
    );
  };

  const toggle = (field) => setShow((prev) => ({ ...prev, [field]: !prev[field] }));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/member/profile')}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại
        </button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Đổi Mật Khẩu</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Cập nhật mật khẩu đăng nhập của bạn</p>
        </div>
      </div>

      <div className="mx-auto max-w-md">
        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950 space-y-5"
        >
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400">
              {error}
            </div>
          )}

          {[
            { key: 'old', label: 'Mật khẩu hiện tại', field: 'oldPassword' },
            { key: 'new', label: 'Mật khẩu mới', field: 'newPassword' },
            { key: 'confirm', label: 'Xác nhận mật khẩu mới', field: 'confirmPassword' },
          ].map(({ key, label, field }) => (
            <div key={key} className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={show[key] ? 'text' : 'password'}
                  value={form[field]}
                  onChange={(e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))}
                  required
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-10 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => toggle(key)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                >
                  {show[key] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          ))}

          <button
            type="submit"
            disabled={mutation.isPending}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-70 mt-2"
          >
            {mutation.isPending ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Đang xử lý...</>
            ) : (
              'Đổi mật khẩu'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
