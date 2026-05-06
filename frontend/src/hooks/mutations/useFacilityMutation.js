import { useMutation, useQueryClient } from '@tanstack/react-query';
import { facilityService } from '@/services/facilityService';
import { toast } from '@/utils/toast';

export const useCreateFacility = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => facilityService.createFacility(data),
    onSuccess: () => {
      toast.success('Thêm phòng tập thành công!');
      queryClient.invalidateQueries({ queryKey: ['facilities'] });
    },
    onError: (error) => {
      toast.error('Lỗi khi thêm: ' + (error.message || 'Vui lòng thử lại'));
    },
  });
};

export const useUpdateFacility = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => facilityService.updateFacility(id, data),
    onSuccess: () => {
      toast.success('Cập nhật phòng tập thành công!');
      queryClient.invalidateQueries({ queryKey: ['facilities'] });
    },
    onError: (error) => {
      toast.error('Lỗi khi cập nhật: ' + (error.message || 'Vui lòng thử lại'));
    },
  });
};

export const useDeleteFacility = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => facilityService.deleteFacility(id),
    onSuccess: () => {
      toast.success('Xóa phòng tập thành công!');
      queryClient.invalidateQueries({ queryKey: ['facilities'] });
    },
    onError: (error) => {
      toast.error('Lỗi khi xóa: ' + (error.message || 'Vui lòng thử lại'));
    },
  });
};

export const useUpdateFacilityStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }) => facilityService.updateFacilityStatus(id, status),
    onSuccess: () => {
      toast.success('Cập nhật trạng thái thành công!');
      queryClient.invalidateQueries({ queryKey: ['facilities'] });
    },
    onError: (error) => {
      toast.error('Lỗi khi cập nhật trạng thái: ' + (error.message || 'Vui lòng thử lại'));
    },
  });
};