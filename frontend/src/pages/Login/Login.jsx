import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@/schemas/authSchemas';
import { useLogin } from '@/hooks/mutations/useAuthMutations';
import { Link } from 'react-router-dom';
import { Dumbbell, User, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import gigachadVideo from '@/assets/mp_.mp4';
import LanguageSwitcher from '@/components/Common/LanguageSwitcher';


const getLoginError = (error, t) => {
  const status = error?.response?.status;
  const serverMsg = error?.response?.data?.message || error?.response?.data?.error;
  if (serverMsg) return serverMsg;
  if (status === 401) return t('auth:login.error.unauthorized');
  if (status === 403) return t('auth:login.error.forbidden');
  if (status === 404) return t('auth:login.error.not_found');
  if (!navigator.onLine || error?.code === 'ERR_NETWORK') return t('auth:login.error.network');
  return t('auth:login.error.default');
};

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const loginMutation = useLogin();
  const { t } = useTranslation(['auth', 'common']);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: '', password: '' },
  });

  const onSubmit = (data) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="flex min-h-screen w-full font-sans text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-950">

      {/* Cột trái: Form Đăng nhập */}
      <div className="flex w-full flex-col justify-center px-4 sm:px-12 lg:w-1/2 lg:px-24 xl:px-32">
        <div className="mx-auto w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-700">

          {/* Logo + Language Switcher */}
          <div className="mb-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
                <Dumbbell className="h-7 w-7" />
              </div>
              <span className="text-2xl font-black tracking-tight uppercase">
                Active<span className="text-blue-600 dark:text-blue-500">Gym</span>
              </span>
            </div>
            <LanguageSwitcher />
          </div>

          <h1 className="text-3xl font-bold tracking-tight">{t('auth:login.title')}</h1>
          <p className="mt-3 text-gray-500 dark:text-gray-400">
            {t('auth:login.subtitle')}
          </p>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>

            {loginMutation.isError && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400 animate-in shake">
                {getLoginError(loginMutation.error, t)}
              </div>
            )}

            {/* Username Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {t('auth:login.username_label')}
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <User className="h-5 w-5" />
                </div>
                <input
                  type="text"
                  autoComplete="username"
                  {...register('username')}
                  className={`block w-full rounded-xl border bg-gray-50/50 py-3 pl-11 pr-4 text-sm outline-none transition-all placeholder:text-gray-400 focus:bg-white dark:bg-gray-900/50 dark:focus:bg-gray-900 ${
                    errors.username
                      ? 'border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
                      : 'border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-gray-800 dark:focus:border-blue-500'
                  }`}
                  placeholder={t('auth:login.username_placeholder')}
                />
              </div>
              {errors.username && (
                <p className="text-sm text-red-500">{t(errors.username.message)}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {t('auth:login.password_label')}
                </label>
                <Link to="/forgot-password" className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 hover:underline">
                  {t('auth:login.forgot_password')}
                </Link>
              </div>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  className={`block w-full rounded-xl border bg-gray-50/50 py-3 pl-11 pr-11 text-sm outline-none transition-all placeholder:text-gray-400 focus:bg-white dark:bg-gray-900/50 dark:focus:bg-gray-900 ${
                    errors.password
                      ? 'border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
                      : 'border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-gray-800 dark:focus:border-blue-500'
                  }`}
                  placeholder={t('auth:login.password_placeholder')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500">{t(errors.password.message)}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3.5 text-sm font-semibold text-white transition-all hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-70 shadow-lg shadow-blue-600/20"
            >
              {loginMutation.isPending ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  {t('auth:login.submitting')}
                </>
              ) : (
                t('auth:login.submit')
              )}
            </button>
          </form>

        </div>
      </div>

      {/* Cột phải: Hình ảnh Cover & Gradient */}
      <div className="relative hidden w-1/2 overflow-hidden lg:block bg-gray-900">
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
        <div className="absolute inset-0 z-10 bg-blue-600/10 mix-blend-multiply"></div>
        <video
          src={gigachadVideo}
          autoPlay
          muted
          loop
          playsInline
          className="h-full w-full object-cover object-center opacity-80"
        />

        {/* Quote overlay */}
        <div className="absolute bottom-0 left-0 z-20 w-full p-16 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
          <div className="inline-flex rounded-full bg-white/10 px-3 py-1 text-sm font-medium tracking-wide text-white backdrop-blur-md mb-6 border border-white/20">
            {t('auth:login.hero_badge')}
          </div>
          <h2 className="text-4xl font-bold leading-tight text-white max-w-lg mb-4">
            {t('auth:login.hero_title')}
          </h2>
          <p className="text-lg text-gray-300 max-w-md">
            {t('auth:login.hero_desc')}
          </p>
        </div>
      </div>

    </div>
  );
};

export default Login;
