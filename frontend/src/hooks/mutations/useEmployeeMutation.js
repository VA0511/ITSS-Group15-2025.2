import { useMutation, useQueryClient } from '@tanstack/react-query';
import { employeeService } from '@/services/employeeService';
import { toast } from '@/utils/toast';

export const useCreateEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => employeeService.createEmployee(data),
    onSuccess: () => {
      toast.success('Thêm nhân viên thành công!');
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
    onError: (error) => {
      toast.error('Lỗi khi thêm: ' + (error.message || 'Vui lòng thử lại'));
    },
  });
};

export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => employeeService.updateEmployee(id, data),
    onSuccess: () => {
      toast.success('Cập nhật nhân viên thành công!');
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
    onError: (error) => {
      toast.error('Lỗi khi cập nhật: ' + (error.message || 'Vui lòng thử lại'));
    },
  });
};

export const useDeleteEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => employeeService.deleteEmployee(id),
    onSuccess: () => {
      toast.success('Xóa nhân viên thành công!');
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
    onError: (error) => {
      toast.error('Lỗi khi xóa: ' + (error.message || 'Vui lòng thử lại'));
    },
  });
};

export const useUpdateEmployeeStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }) => employeeService.updateEmployeeStatus(id, status),
    onSuccess: () => {
      toast.success('Cập nhật trạng thái thành công!');
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
    onError: (error) => {
      toast.error('Lỗi khi cập nhật trạng thái: ' + (error.message || 'Vui lòng thử lại'));
    },
  });
};