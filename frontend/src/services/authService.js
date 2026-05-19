import axios from '@/lib/axios';
import axiosBase from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const authService = {
  login: async (credentials) => {
    const payload = {
      username: credentials?.username || credentials?.email,
      password: credentials?.password,
    };
    const data = await axios.post('/auth/login', payload);

    const user = data?.user
      ? { ...data.user, isFirstLogin: data?.is_first_login ?? false }
      : { id: data?.account_id, email: data?.username, role: data?.role, isFirstLogin: data?.is_first_login ?? false };

    return {
      user,
      token: data?.token || data?.access_token,
      refreshToken: data?.refresh_token,
    };
  },

  changePassword: async ({ oldPassword, newPassword }) => {
    return axios.put('/auth/change-password', {
      old_password: oldPassword,
      new_password: newPassword,
    });
  },

  getCurrentUser: async () => {
    const data = await axios.get('/auth/me');
    return data?.user || null;
  },

  // Called directly (not via the intercepted axios) to avoid infinite retry loops
  refreshToken: async (refreshToken) => {
    const res = await axiosBase.post(`${API_URL}/auth/refresh`, { refresh_token: refreshToken });
    return res.data;
  },
};
