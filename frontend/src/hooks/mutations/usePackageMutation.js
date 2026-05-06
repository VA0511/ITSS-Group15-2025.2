import { useMutation, useQueryClient } from '@tanstack/react-query';
import { packageService } from '@/services/packageService';
import { toast } from '@/utils/toast';

export const useCreatePackage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => packageService.createPackage(data),
    onSuccess: () => {
      toast.success('Thêm gói tập thành công!');
      queryClient.invalidateQueries({ queryKey: ['packages'] });
    },
    onError: (error) => {
      toast.error('Lỗi khi thêm: ' + (error.message || 'Vui lòng thử lại'));
    },
  });
};

export const useUpdatePackage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => packageService.updatePackage(id, data),
    onSuccess: () => {
      toast.success('Cập nhật gói tập thành công!');
      queryClient.invalidateQueries({ queryKey: ['packages'] });
    },
    onError: (error) => {
      toast.error('Lỗi khi cập nhật: ' + (error.message || 'Vui lòng thử lại'));
    },
  });
};

export const useDeletePackage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => packageService.deletePackage(id),
    onSuccess: () => {
      toast.success('Xóa gói tập thành công!');
      queryClient.invalidateQueries({ queryKey: ['packages'] });
    },
    onError: (error) => {
      toast.error('Lỗi khi xóa: ' + (error.message || 'Vui lòng thử lại'));
    },
  });
};

export const useUpdatePackageStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isActive }) => packageService.updatePackageStatus(id, isActive),
    onSuccess: () => {
      toast.success('Cập nhật trạng thái thành công!');
      queryClient.invalidateQueries({ queryKey: ['packages'] });
    },
    onError: (error) => {
      toast.error('Lỗi khi cập nhật trạng thái: ' + (error.message || 'Vui lòng thử lại'));
    },
  });
};