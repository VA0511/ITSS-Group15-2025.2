import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,          // Lưu thông tin cơ bản: { id, name, role, email... }
      token: null,         // JWT Access Token dùng để gọi API
      refreshToken: null,  // JWT Refresh Token dùng để gia hạn access token
      isAuthenticated: false,

      // Gọi hàm này khi User login thành công
      login: (userData, accessToken, refreshToken = null) => set({ 
        user: userData, 
        token: accessToken,
        refreshToken,
        isAuthenticated: true 
      }),

      // Xóa toàn bộ dữ liệu khi Logout
      logout: () => set({ 
        user: null, 
        token: null,
        refreshToken: null,
        isAuthenticated: false 
      }),

      // Cập nhật 1 phần thông tin User (VD: khi user đổi tên/avatar)
      updateUser: (newData) => set((state) => ({ 
        user: state.user ? { ...state.user, ...newData } : null 
      })),
    }),
    {
      name: 'auth-storage', // Key lưu trên localStorage
    }
  )
);

export default useAuthStore;
