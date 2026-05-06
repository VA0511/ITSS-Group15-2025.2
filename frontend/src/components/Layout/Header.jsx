import React, { useState } from 'react';
import { Menu, Sun, Moon, LogOut, User, Bell } from 'lucide-react';
import useAuthStore from '@/store/useAuthStore';
import useThemeStore from '@/store/useThemeStore';
import useUIStore from '@/store/useUIStore';
import { toast } from '@/utils/toast';
import axios from '@/lib/axios';
const Header = () => {
  // Lấy hàm xử lý đăng xuất và thông tin user từ Zustand Store
  const { user, logout, refreshToken } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);
  const [unreadCount, setUnreadCount] = useState(3); // Demo số thông báo

  const handleLogout = async () => {
    try {
      if (refreshToken) {
        // Gọi backend để revoke refresh token — fire-and-forget
        axios.post('/auth/logout', { refresh_token: refreshToken }).catch(() => {});
      }
    } finally {
      logout();
      toast.success('Đăng xuất thành công', { description: 'Hẹn gặp lại bạn' });
    }
  };

  const handleNotificationClick = () => {
    if (unreadCount > 0) {
      toast.info(`Bạn có ${unreadCount} thông báo mới`, {
        description: 'Vui lòng kiểm tra trung tâm thông báo.',
      });
      setUnreadCount(0); // Mark as read
    } else {
      toast.default('Không có thông báo mới vào lúc này');
    }
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white/90 px-4 backdrop-blur-md dark:border-gray-800 dark:bg-gray-950/90 transition-colors">
      <div className="flex items-center">
        {/* Nút Hamburger bật tắt Sidebar ở giao diện Mobile */}
        <button
          onClick={toggleSidebar}
          className="mr-4 rounded-md p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 lg:hidden focus:outline-none"
        >
          <Menu className="h-5 w-5" />
        </button>
        
        {/* Tên màn hình / Ứng dụng ở góc trái Header */}
      </div>

      <div className="flex items-center gap-4">
        {/* Nút Chuông Thông Báo */}
        <button
          onClick={handleNotificationClick}
          className="relative rounded-full p-2.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white focus:outline-none"
          title="Thông báo"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute right-2 top-2 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-950">
            </span>
          )}
        </button>

        {/* Nút Đổi màu Sáng/Tối (Light/Dark Mode) */}
        <button
          onClick={toggleTheme}
          className="rounded-full p-2.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white focus:outline-none"
          title="Đổi giao diện"
        >
          {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </button>

        {/* Khối quản lý User Profile (Hình ảnh + Tên + Logout) */}
        <div className="flex items-center gap-3 border-l border-gray-300 pl-4 dark:border-gray-700">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400 shadow-sm">
            <User className="h-5 w-5" />
          </div>
          
          <div className="hidden flex-col md:flex">
            <span className="text-sm font-semibold leading-none text-gray-900 dark:text-white">
              {user?.fullName || "Người dùng"}
            </span>
            <span className="mt-1.5 text-xs font-medium leading-none text-gray-500 dark:text-gray-400">
              {user?.role ? user.role.toUpperCase() : "GUEST"}
            </span>
          </div>
          
          <button
            onClick={handleLogout}
            className="ml-3 rounded-md p-2 text-red-500 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950/50 dark:hover:text-red-300 focus:outline-none transition-colors"
            title="Đăng xuất"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
