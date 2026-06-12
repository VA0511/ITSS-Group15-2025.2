import { useMutation, useQueryClient } from '@tanstack/react-query';
import { memberService } from '@/services/memberService';
import { toast } from '@/utils/toast';
import { useTranslation } from 'react-i18next';

export const useCreateMember = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => memberService.createMember(data),
    onSuccess: () => {
      toast.success(t('notifications.create_member_success'));
      queryClient.invalidateQueries({ queryKey: ['members'] });
    },
    onError: (error) => {
      toast.error(t('notifications.error_add') + (error.message || t('notifications.error_try_again')));
    },
  });
};

export const useUpdateMember = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => memberService.updateMember(id, data),
    onSuccess: () => {
      toast.success(t('notifications.update_member_success'));
      queryClient.invalidateQueries({ queryKey: ['members'] });
    },
    onError: (error) => {
      toast.error(t('notifications.error_update') + (error.message || t('notifications.error_try_again')));
    },
  });
};

export const useDeleteMember = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => memberService.deleteMember(id),
    onSuccess: () => {
      toast.success(t('notifications.delete_member_success'));
      queryClient.invalidateQueries({ queryKey: ['members'] });
    },
    onError: (error) => {
      toast.error(t('notifications.error_delete') + (error.message || t('notifications.error_try_again')));
    },
  });
};

export const useUpdateMemberStatus = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }) => memberService.updateMemberStatus(id, status),
    onSuccess: () => {
      toast.success(t('notifications.update_status_success'));
      queryClient.invalidateQueries({ queryKey: ['members'] });
    },
    onError: (error) => {
      toast.error(t('notifications.error_status') + (error.message || t('notifications.error_try_again')));
    },
  });
};