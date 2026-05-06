import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@/schemas/authSchemas';
import { useLogin } from '@/hooks/mutations/useAuthMutations';
import { Dumbbell, User, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import gigachadVideo from '@/assets/gigachad.mp4';


const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const loginMutation = useLogin();

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
          
          {/* Logo */}
          <div className="mb-10 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
              <Dumbbell className="h-7 w-7" />
            </div>
            <span className="text-2xl font-black tracking-tight uppercase">
              Active<span className="text-blue-600 dark:text-blue-500">Gym</span>
            </span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight">Đăng nhập tài khoản</h1>
          <p className="mt-3 text-gray-500 dark:text-gray-400">
            Vui lòng nhập thông tin để truy cập hệ thống quản lý phòng tập.
          </p>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            
            {/* Component báo lỗi trả về từ API Backend */}
            {loginMutation.isError && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400 animate-in shake">
                {loginMutation.error?.response?.data?.message || loginMutation.error?.message || 'Có lỗi xảy ra, vui lòng thử lại.'}
              </div>
            )}

            {/* Username Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Tên đăng nhập</label>
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
                  placeholder="owner, manager01, ..."
                />
              </div>
              {errors.username && <p className="text-sm text-red-500">{errors.username.message}</p>}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Mật khẩu</label>
                <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 hover:underline">
                  Quên mật khẩu?
                </a>
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
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
            </div>
            


            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3.5 text-sm font-semibold text-white transition-all hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-70 shadow-lg shadow-blue-600/20"
            >
              {loginMutation.isPending ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Đang khởi tạo phiên...
                </>
              ) : (
                'Đăng nhập ngay'
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
            Hệ thống quản lý chuẩn 5 sao
          </div>
          <h2 className="text-4xl font-bold leading-tight text-white max-w-lg mb-4">
            Quản trị phòng tập thông minh, chuyên nghiệp & hiệu quả.
          </h2>
          <p className="text-lg text-gray-300 max-w-md">
            Hệ thống cung cấp giải pháp toàn diện giúp kiểm soát nhân sự, gói tập và trải nghiệm khách hàng ở đẳng cấp cao nhất.
          </p>
        </div>
      </div>

    </div>
  );
};

export default Login;
