import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/services/authService';
import useAuthStore from '@/store/useAuthStore';
import { useNavigate } from 'react-router-dom';

export const useLogin = () => {
  const loginAction = useAuthStore((state) => state.login);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (credentials) => authService.login(credentials),
    onSuccess: (data) => {
      // Lưu token + user vào Zustand (Local Storage)
      loginAction(data.user, data.token, data.refreshToken);

      // Cập nhật lại state cache của query hiện tại
      queryClient.setQueryData(['currentUser'], data.user);

      // Điều hướng dựa vào Role
      if (data.user.role === 'owner') navigate('/owner/dashboard');
      else if (data.user.role === 'manager') navigate('/manager/dashboard');
      else if (data.user.role === 'trainer') navigate('/trainer/profile');
      else navigate('/member/dashboard');
    },
  });
};
