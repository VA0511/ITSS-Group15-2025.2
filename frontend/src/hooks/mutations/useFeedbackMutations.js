import { useMutation, useQueryClient } from '@tanstack/react-query';
import { feedbackService } from '@/services/feedbackService';
import { toast } from 'sonner';

export const useCreateFeedback = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => feedbackService.createFeedback(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedbacks'] });
      queryClient.invalidateQueries({ queryKey: ['myFeedbacks'] });
      toast.success('Gửi phản hồi thành công! Cán bộ sẽ liên hệ bạn sớm nhất.');
    },
  });
};

export const useUpdateFeedbackStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status, responseText }) => feedbackService.updateFeedbackStatus(id, status, responseText),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedbacks'] });
      toast.success('Cập nhật xử lý phản hồi thành công!');
    },
  });
};
