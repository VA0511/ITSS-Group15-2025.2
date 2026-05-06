import axios from 'axios';
import useAuthStore from '@/store/useAuthStore';

// Lấy base URL từ biến môi trường. Fallback về localhost nếu chưa cấu hình.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Thêm Request Interceptor để nhét JWT Token vào Header của mọi request gửi đi
axiosInstance.interceptors.request.use(
  (config) => {
    // Rút Token từ Zustand Store
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Thêm Response Interceptor để xử lý lỗi chung (Ví dụ: 401 Unauthorized)
axiosInstance.interceptors.response.use(
  (response) => {
    // Trả về trực tiếp data từ Backend (Go) để code React gọn hơn
    return response.data;
  },
  (error) => {
    // Nếu token hết hạn (401), ép đăng xuất và chuyển về trang Login
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
