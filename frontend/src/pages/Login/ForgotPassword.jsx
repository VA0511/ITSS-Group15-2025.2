import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Dumbbell, ArrowLeft, Mail, Loader2, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import axios from '@/lib/axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const { t } = useTranslation('auth');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) { setError(t('forgot_password.error.email_required')); return; }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(email.trim())) { setError(t('forgot_password.error.email_invalid')); return; }
    setError('');
    setIsLoading(true);
    try {
      await axios.post('/auth/forgot-password', { email: email.trim() });
      setSent(true);
    } catch (err) {
      const msg = err?.response?.data?.message;
      if (typeof msg === 'string' && msg) {
        setError(msg);
      } else if (err?.response?.status === 404) {
        setError(t('forgot_password.error.not_found'));
      } else if (err?.response?.status >= 500) {
        setError(t('forgot_password.error.server_error'));
      } else {
        setError(t('forgot_password.error.default'));
      }
    } finally {
      setIsLoading(false);
    }
  };

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
          {sent ? (
            <div className="text-center">
              <CheckCircle2 className="mx-auto h-14 w-14 text-green-500 mb-4" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {t('forgot_password.success_title')}
              </h2>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {t('forgot_password.success_desc', { email })}
              </p>
              <Link to="/login" className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400">
                <ArrowLeft className="h-4 w-4" /> {t('forgot_password.back_to_login')}
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {t('forgot_password.title')}
                </h1>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {t('forgot_password.subtitle')}
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
                    {t('forgot_password.email_label')}
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                      <Mail className="h-5 w-5" />
                    </div>
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setError(''); }}
                      placeholder="example@gmail.com"
                      className="block w-full rounded-xl border border-gray-200 bg-gray-50/50 py-3 pl-11 pr-4 text-sm outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 dark:border-gray-800 dark:bg-gray-900/50 dark:text-white dark:focus:border-blue-500 dark:focus:bg-gray-900"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3.5 text-sm font-semibold text-white transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70 shadow-lg shadow-blue-600/20"
                >
                  {isLoading
                    ? <><Loader2 className="h-5 w-5 animate-spin" /> {t('forgot_password.submitting')}</>
                    : t('forgot_password.submit')
                  }
                </button>
              </form>

              <div className="mt-5 text-center">
                <Link to="/login" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                  <ArrowLeft className="h-4 w-4" /> {t('forgot_password.back_to_login')}
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
