import { useMutation, useQueryClient } from '@tanstack/react-query';
import { accountService } from '@/services/accountService';
import { toast } from '@/utils/toast';

export const useCreateAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => accountService.createAccount(data),
    onSuccess: () => {
      toast.success('Tạo tài khoản thành công!');
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
    onError: (error) => {
      toast.error('Lỗi: ' + (error.response?.data || error.message || 'Vui lòng thử lại'));
    },
  });
};

export const useDeleteAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => accountService.deleteAccount(id),
    onSuccess: () => {
      toast.success('Xóa tài khoản thành công!');
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
    onError: (error) => {
      toast.error('Lỗi khi xóa: ' + (error.response?.data || error.message || 'Vui lòng thử lại'));
    },
  });
};

export const useRevealPassword = () => {
  return useMutation({
    mutationFn: ({ id, ownerPassword }) => accountService.revealPassword(id, ownerPassword),
  });
};
