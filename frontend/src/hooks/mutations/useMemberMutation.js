import { useMutation, useQueryClient } from '@tanstack/react-query';
import { memberService } from '@/services/memberService';
import { toast } from '@/utils/toast';

export const useCreateMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => memberService.createMember(data),
    onSuccess: () => {
      toast.success('Thêm hội viên thành công!');
      queryClient.invalidateQueries({ queryKey: ['members'] });
    },
    onError: (error) => {
      toast.error('Lỗi khi thêm: ' + (error.message || 'Vui lòng thử lại'));
    },
  });
};

export const useUpdateMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => memberService.updateMember(id, data),
    onSuccess: () => {
      toast.success('Cập nhật hội viên thành công!');
      queryClient.invalidateQueries({ queryKey: ['members'] });
    },
    onError: (error) => {
      toast.error('Lỗi khi cập nhật: ' + (error.message || 'Vui lòng thử lại'));
    },
  });
};

export const useDeleteMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => memberService.deleteMember(id),
    onSuccess: () => {
      toast.success('Xóa hội viên thành công!');
      queryClient.invalidateQueries({ queryKey: ['members'] });
    },
    onError: (error) => {
      toast.error('Lỗi khi xóa: ' + (error.message || 'Vui lòng thử lại'));
    },
  });
};

export const useUpdateMemberStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }) => memberService.updateMemberStatus(id, status),
    onSuccess: () => {
      toast.success('Cập nhật trạng thái thành công!');
      queryClient.invalidateQueries({ queryKey: ['members'] });
    },
    onError: (error) => {
      toast.error('Lỗi khi cập nhật trạng thái: ' + (error.message || 'Vui lòng thử lại'));
    },
  });
};