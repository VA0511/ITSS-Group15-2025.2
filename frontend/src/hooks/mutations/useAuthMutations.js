import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { authService } from '@/services/authService';
import useAuthStore from '@/store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/utils/toast';

export const useLogin = () => {
  const loginAction = useAuthStore((state) => state.login);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (credentials) => authService.login(credentials),
    onSuccess: (data) => {
      loginAction(data.user, data.token, data.refreshToken);
      queryClient.setQueryData(['currentUser'], data.user);

      if (data.user.role === 'owner') navigate('/owner/dashboard');
      else if (data.user.role === 'manager') navigate('/manager/dashboard');
      else if (data.user.role === 'trainer') navigate('/trainer/profile');
      else navigate('/member/dashboard');
    },
  });
};

export const useChangePassword = () => {
  const { t } = useTranslation();
  const updateUser = useAuthStore((state) => state.updateUser);

  return useMutation({
    mutationFn: ({ oldPassword, newPassword }) =>
      authService.changePassword({ oldPassword, newPassword }),
    onSuccess: () => {
      updateUser({ isFirstLogin: false });
      toast.success(t('notifications.change_password_success'));
    },
    onError: (error) => {
      const msg =
        typeof error?.response?.data === 'string'
          ? error.response.data.trim()
          : error?.message || t('notifications.change_password_error');
      toast.error(msg);
    },
  });
};
