import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import useAuthStore from '@/store/useAuthStore';
import useUIStore from '@/store/useUIStore';
import useThemeStore from '@/store/useThemeStore';
import { cn } from '@/lib/utils';
import {
  Dumbbell, User, Users, CalendarCheck, ClipboardList,
  Moon, Sun, LogOut, Menu, X, Settings
} from 'lucide-react';
import NotificationBell from '@/components/Common/NotificationBell';

const TrainerLayout = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const isSidebarOpen = useUIStore((state) => state.isSidebarOpen);
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);
  const { theme, toggleTheme } = useThemeStore();

  const trainerMenuItems = [
    { title: 'Thông tin cá nhân', path: '/trainer/profile', icon: User },
    { title: 'Học viên', path: '/trainer/students', icon: Users },
    { title: 'Lịch dạy', path: '/trainer/schedule', icon: CalendarCheck },
    { title: 'Thiết lập lịch', path: '/trainer/availability', icon: Settings },
    { title: 'Đánh giá buổi tập', path: '/trainer/evaluation', icon: ClipboardList },
  ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-gray-200 bg-white transition-transform duration-300 ease-in-out dark:border-gray-800 dark:bg-gray-950 lg:static lg:translate-x-0 shadow-sm',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="flex h-16 shrink-0 items-center justify-center border-b border-gray-200 px-6 dark:border-gray-800">
          <div className="flex items-center gap-2.5 text-blue-600 dark:text-blue-500">
            <Dumbbell className="h-7 w-7" />
            <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white uppercase">
              Active<span className="text-blue-600 dark:text-blue-500">Gym</span>
            </span>
          </div>
        </div>

        {/* Menu Section */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto px-4 py-6 custom-scrollbar">
          <div className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
            Danh mục quản lý
          </div>
          {trainerMenuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400 font-semibold'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/60 dark:hover:text-gray-200'
                  )
                }
              >
                <Icon className="h-5 w-5" />
                {item.title}
              </NavLink>
            );
          })}
        </nav>

        {/* Help Box */}
        <div className="border-t border-gray-200 p-4 dark:border-gray-800">
          <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-900/60 border border-gray-100 dark:border-gray-800">
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Cần hỗ trợ?</p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">Hỗ trợ kỹ thuật hệ thống ITSS v2026.</p>
            <a href="mailto:support@activegym.vn" className="mt-2 inline-block text-xs font-medium text-blue-600 hover:underline dark:text-blue-400">
              Gửi Ticket hỗ trợ &rarr;
            </a>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white/90 px-4 backdrop-blur-md dark:border-gray-800 dark:bg-gray-950/90 transition-colors">
          <button
            onClick={toggleSidebar}
            className="mr-4 rounded-md p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 lg:hidden focus:outline-none"
          >
            {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <div className="flex-1" />

          <div className="flex items-center gap-3">
            <NotificationBell />

            <button
              onClick={toggleTheme}
              className="rounded-full p-2.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white focus:outline-none"
              title={theme === 'dark' ? 'Chế độ sáng' : 'Chế độ tối'}
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            <div className="flex items-center gap-2.5 px-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-xs font-bold text-blue-600 dark:text-blue-400">
                {user?.username?.charAt(0)?.toUpperCase() || 'T'}
              </div>
              <div className="hidden sm:block">
                <div className="text-xs font-semibold text-gray-900 dark:text-white">{user?.username || 'Huấn luyện viên'}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Trainer</div>
              </div>
            </div>

            <button
              onClick={() => { logout(); window.location.href = '/login'; }}
              className="rounded-full p-2.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-red-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-red-400 focus:outline-none"
              title="Đăng xuất"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default TrainerLayout;
