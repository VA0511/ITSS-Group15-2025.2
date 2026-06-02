import React, { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Dumbbell, Lock, Eye, EyeOff, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import axios from '@/lib/axios';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') || '';
  const { t } = useTranslation('auth');

  const [form, setForm] = useState({ password: '', confirm: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.password) { setError(t('reset_password.error.password_required')); return; }
    if (form.password.length < 6) { setError(t('reset_password.error.password_min')); return; }
    if (form.password !== form.confirm) { setError(t('reset_password.error.password_mismatch')); return; }
    setError('');
    setIsLoading(true);
    try {
      await axios.post('/auth/reset-password', { token, new_password: form.password });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      const msg = err?.response?.data?.message || err?.response?.data || '';
      setError(typeof msg === 'string' && msg ? msg : t('reset_password.error.default'));
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 px-4 dark:bg-gray-900">
        <div className="w-full max-w-md rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm dark:border-red-900/50 dark:bg-gray-950">
          <AlertTriangle className="mx-auto h-14 w-14 text-red-500 mb-4" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {t('reset_password.invalid_token_title')}
          </h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {t('reset_password.invalid_token_desc')}
          </p>
          <Link to="/forgot-password" className="mt-6 inline-block text-sm font-medium text-blue-600 hover:underline dark:text-blue-400">
            {t('reset_password.request_new_link')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 px-4 dark:bg-gray-900">
      <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-700">
        {/* Logo */}
        <div className="mb-8 flex items-center justify-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
            <Dumbbell className="h-7 w-7" />
          </div>
          <span className="text-2xl font-black tracking-tight uppercase">
            Active<span className="text-blue-600 dark:text-blue-500">Gym</span>
          </span>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-950">
          {success ? (
            <div className="text-center">
              <CheckCircle2 className="mx-auto h-14 w-14 text-green-500 mb-4" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {t('reset_password.success_title')}
              </h2>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {t('reset_password.success_desc')}
              </p>
              <Link to="/login" className="mt-6 inline-block text-sm font-medium text-blue-600 hover:underline dark:text-blue-400">
                {t('reset_password.login_now')}
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {t('reset_password.title')}
                </h1>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {t('reset_password.subtitle')}
                </p>
              </div>

              {error && (
                <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {t('reset_password.new_password_label')}
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                      <Lock className="h-5 w-5" />
                    </div>
                    <input
                      type={showPwd ? 'text' : 'password'}
                      value={form.password}
                      onChange={(e) => { setForm(p => ({ ...p, password: e.target.value })); setError(''); }}
                      placeholder={t('reset_password.new_password_placeholder')}
                      className="block w-full rounded-xl border border-gray-200 bg-gray-50/50 py-3 pl-11 pr-11 text-sm outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 dark:border-gray-800 dark:bg-gray-900/50 dark:text-white dark:focus:border-blue-500"
                    />
                    <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600">
                      {showPwd ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {t('reset_password.confirm_password_label')}
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                      <Lock className="h-5 w-5" />
                    </div>
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      value={form.confirm}
                      onChange={(e) => { setForm(p => ({ ...p, confirm: e.target.value })); setError(''); }}
                      placeholder={t('reset_password.confirm_password_placeholder')}
                      className="block w-full rounded-xl border border-gray-200 bg-gray-50/50 py-3 pl-11 pr-11 text-sm outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 dark:border-gray-800 dark:bg-gray-900/50 dark:text-white dark:focus:border-blue-500"
                    />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600">
                      {showConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3.5 text-sm font-semibold text-white transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70 shadow-lg shadow-blue-600/20"
                >
                  {isLoading
                    ? <><Loader2 className="h-5 w-5 animate-spin" /> {t('reset_password.submitting')}</>
                    : t('reset_password.submit')
                  }
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
