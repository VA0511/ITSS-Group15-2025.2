import { useMutation, useQueryClient } from '@tanstack/react-query';
import { equipmentService } from '@/services/equipmentService';
import { toast } from '@/utils/toast';

export const useCreateEquipment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => equipmentService.createEquipment(data),
    onSuccess: () => {
      toast.success('Thêm thiết bị thành công!');
      queryClient.invalidateQueries({ queryKey: ['equipment'] });
    },
    onError: (error) => {
      toast.error('Lỗi khi thêm thiết bị: ' + (error.message || 'Vui lòng thử lại'));
    },
  });
};

export const useUpdateEquipment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => equipmentService.updateEquipment(id, data),
    onSuccess: () => {
      toast.success('Cập nhật thiết bị thành công!');
      queryClient.invalidateQueries({ queryKey: ['equipment'] });
    },
    onError: (error) => {
      toast.error('Lỗi khi cập nhật: ' + (error.message || 'Vui lòng thử lại'));
    },
  });
};

export const useDeleteEquipment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => equipmentService.deleteEquipment(id),
    onSuccess: () => {
      toast.success('Xóa thiết bị thành công!');
      queryClient.invalidateQueries({ queryKey: ['equipment'] });
    },
    onError: (error) => {
      toast.error('Lỗi khi xóa: ' + (error.message || 'Vui lòng thử lại'));
    },
  });
};

export const useUpdateEquipmentStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }) => equipmentService.updateEquipmentStatus(id, status),
    onSuccess: () => {
      toast.success('Cập nhật trạng thái thành công!');
      queryClient.invalidateQueries({ queryKey: ['equipment'] });
    },
    onError: (error) => {
      toast.error('Lỗi khi cập nhật trạng thái: ' + (error.message || 'Vui lòng thử lại'));
    },
  });
};