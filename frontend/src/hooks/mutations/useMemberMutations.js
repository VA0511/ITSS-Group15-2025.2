import { useMutation, useQueryClient } from '@tanstack/react-query';
import { memberService } from '@/services/memberService';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

export const useCreateMember = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newMember) => memberService.createMember(newMember),
    onSuccess: () => {
      // Xóa cache cũ đi để gọi lại danh sách mới nhất
      queryClient.invalidateQueries({ queryKey: ['members'] });
      toast.success(t('notifications.create_member_msg_success'));
    },
    onError: (error) => {
      toast.error(error.message || t('notifications.create_member_msg_error'));
    }
  });
};

export const useUpdateMember = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => memberService.updateMember(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      toast.success(t('notifications.update_member_msg_success'));
    },
  });
};

export const useDeleteMember = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => memberService.deleteMember(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      toast.success(t('notifications.delete_member_msg_success'));
    },
  });
};
