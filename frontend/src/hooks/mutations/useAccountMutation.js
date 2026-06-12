import { useMutation, useQueryClient } from '@tanstack/react-query';
import { accountService } from '@/services/accountService';
import { toast } from '@/utils/toast';
import { useTranslation } from 'react-i18next';

export const useCreateAccount = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => accountService.createAccount(data),
    onSuccess: () => {
      toast.success(t('notifications.create_account_success'));
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
    onError: (error) => {
      toast.error(t('notifications.error_add') + (error.response?.data || error.message || t('notifications.error_try_again')));
    },
  });
};

export const useDeleteAccount = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => accountService.deleteAccount(id),
    onSuccess: () => {
      toast.success(t('notifications.delete_account_success'));
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
    onError: (error) => {
      toast.error(t('notifications.error_delete') + (error.response?.data || error.message || t('notifications.error_try_again')));
    },
  });
};

export const useRevealPassword = () => {
  return useMutation({
    mutationFn: ({ id, ownerPassword }) => accountService.revealPassword(id, ownerPassword),
  });
};
