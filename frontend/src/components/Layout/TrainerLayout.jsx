import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import useAuthStore from '@/store/useAuthStore';
import useUIStore from '@/store/useUIStore';
import { cn } from '@/lib/utils';
import {
  User, Users, Calendar, CheckSquare, Bell, Moon, LogOut, Menu, X, Settings
} from 'lucide-react';

const TrainerLayout = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const isSidebarOpen = useUIStore((state) => state.isSidebarOpen);
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);

  const trainerMenuItems = [
    { title: 'Thông tin cá nhân', path: '/trainer/profile', icon: User },
    { title: 'Học viên', path: '/trainer/students', icon: Users },
    { title: 'Lịch dạy', path: '/trainer/schedule', icon: Calendar },
    { title: 'Thiết lập lịch', path: '/trainer/availability', icon: Settings }
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-60 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 ease-in-out lg:static lg:translate-x-0',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="border-b border-gray-200 px-5 py-4.5">
          <div className="text-base font-semibold text-blue-600">ACTIVEGYM</div>
          <div className="text-xs text-gray-500 mt-0.5">Management System</div>
        </div>

        {/* Menu Section */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-gray-400 px-4 mb-3">
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
                    'flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors mb-1',
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  )
                }
              >
                <Icon className="w-4 h-4 opacity-70" />
                {item.title}
              </NavLink>
            );
          })}
        </nav>

        {/* Help Box */}
        <div className="border-t border-gray-200 p-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="font-medium text-sm text-gray-900">Cần hỗ trợ?</div>
            <div className="text-xs text-gray-600 mt-1">Hỗ trợ kỹ thuật hệ thống v2026.</div>
            <a href="mailto:support@activegym.vn" className="text-xs text-blue-600 font-medium mt-2 inline-block hover:underline">
              Gửi Ticket hỗ trợ →
            </a>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="h-13 bg-white border-b border-gray-200 flex items-center px-6 gap-4">
          {/* Menu Toggle (Mobile) */}
          <button
            onClick={toggleSidebar}
            className="lg:hidden text-gray-600 hover:text-gray-900"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="text-sm font-medium text-gray-900">Trang Quản Trị</div>

          <div className="ml-auto flex items-center gap-3">
            <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50">
              <Bell className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50">
              <Moon className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-medium text-blue-600">
                {user?.name?.charAt(0) || 'T'}
              </div>
              <div>
                <div className="text-xs font-medium text-gray-900">Người dùng TRAINER</div>
                <div className="text-xs text-gray-500">TRAINER</div>
              </div>
            </div>

            <button
              onClick={() => {
                logout();
                window.location.href = '/login';
              }}
              className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto bg-gray-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default TrainerLayout;
