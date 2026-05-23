import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import useUIStore from '@/store/useUIStore';

const MainLayout = () => {
  const isSidebarOpen = useUIStore((state) => state.isSidebarOpen);
  const setSidebarOpen = useUIStore((state) => state.setSidebarOpen);
  const { pathname } = useLocation();

  // Tự động xử lý ẩn / hiện Sidebar phản ứng theo thiết bị Mobile (Responsive UX)
  useEffect(() => {
    const handleResize = () => {
      // 1024px là chuẩn Breakpoint LG của Tailwind
      window.innerWidth < 1024 ? setSidebarOpen(false) : setSidebarOpen(true);
    };
    
    // Validate lúc khởi chạy
    handleResize();

    // Bắt sự kiện người dùng kéo nhỏ to web trình duyệt
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setSidebarOpen]);

  // Tự động đóng Sidebar trên Điện thoại nếu bị bấm qua trang khác (Path thay đổi)
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  }, [pathname, setSidebarOpen]);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-50 dark:bg-gray-900 font-sans text-gray-900 dark:text-gray-100 transition-colors">
      
      {/* 1. Thanh Panel trái (Sidebar) */}
      <Sidebar />
      
      {/* Nền đen trong mờ mờ mờ chắn phía sau khi bật Sidebar ở trên Mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 2. Khay hiển thị Main Body (Chiếm hết diện tích còn lại) */}
      <div className="flex flex-1 flex-col overflow-hidden">
        
        {/* 2.1 Thanh điều khiển trên cùng */}
        <Header />
        
        {/* 2.2 Khu vực Bơm Component (Outlet) của React Router (Quan Trọng Nhất) */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900 relative">
          
          {/* Dùng div giới hạn chiều dài tối đa (max-w-7xl) để web không biến dạng với màn hình quá cong/to. Kèm hiệu ứng Fade-in ảo ma. */}
          <div className="w-full animate-in fade-in zoom-in-95 duration-500 ease-in-out pb-10">
            {/* The Outlet is where nested routes render their element */}
            <Outlet />
          </div>
          
        </main>
        
        {/* 2.3 Phân đoạn Copyright cuối cùng */}
        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;
