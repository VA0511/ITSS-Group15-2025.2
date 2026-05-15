import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { trainingService } from '@/services/trainingService';

export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => trainingService.createBooking(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myBookings'] });
      toast.success('Đặt lịch thành công! Chờ PT xác nhận.');
    },
    onError: () => toast.error('Đặt lịch thất bại, vui lòng thử lại.'),
  });
};

export const useUpdateBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => trainingService.updateBooking(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myBookings'] });
      queryClient.invalidateQueries({ queryKey: ['trainingBookings'] });
      toast.success('Cập nhật lịch thành công!');
    },
    onError: () => toast.error('Có lỗi xảy ra, vui lòng thử lại.'),
  });
};

export const useConfirmAttendance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (sessionId) => trainingService.confirmAttendance(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainingSessions'] });
      toast.success('Đã xác nhận tham gia buổi tập!');
    },
    onError: () => toast.error('Xác nhận thất bại, vui lòng thử lại.'),
  });
};

export const useUpdatePTDetail = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => trainingService.updatePTDetail(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ptDetails'] });
      queryClient.invalidateQueries({ queryKey: ['myPTDetail'] });
      toast.success('Cập nhật thành công!');
    },
    onError: () => toast.error('Cập nhật thất bại, vui lòng thử lại.'),
  });
};

export const useUpdateTrainingSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => trainingService.updateSession(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainingSessions'] });
      toast.success('Đã lưu đánh giá buổi tập!');
    },
    onError: () => toast.error('Lưu thất bại, vui lòng thử lại.'),
  });
};

export const useUpdateMyPTDetail = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => trainingService.updateMyPTDetail(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myPTDetail'] });
      toast.success('Cập nhật lịch thành công!');
    },
    onError: () => toast.error('Cập nhật thất bại, vui lòng thử lại.'),
  });
};
