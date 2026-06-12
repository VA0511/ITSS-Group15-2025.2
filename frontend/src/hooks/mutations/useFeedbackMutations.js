import { useMutation, useQueryClient } from '@tanstack/react-query';
import { feedbackService } from '@/services/feedbackService';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

export const useCreateFeedback = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => feedbackService.createFeedback(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedbacks'] });
      queryClient.invalidateQueries({ queryKey: ['myFeedbacks'] });
      toast.success(t('notifications.create_feedback_success'));
    },
  });
};

export const useUpdateFeedbackStatus = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status, responseText }) => feedbackService.updateFeedbackStatus(id, status, responseText),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedbacks'] });
      toast.success(t('notifications.update_feedback_status_success'));
    },
  });
};
