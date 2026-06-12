import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { trainingService } from '@/services/trainingService';
import { useTranslation } from 'react-i18next';

export const useCreateBooking = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => trainingService.createBooking(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myBookings'] });
      toast.success(t('notifications.booking_success'));
    },
    onError: () => toast.error(t('notifications.booking_error')),
  });
};

export const useUpdateBooking = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => trainingService.updateBooking(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myBookings'] });
      queryClient.invalidateQueries({ queryKey: ['trainingBookings'] });
      toast.success(t('notifications.booking_update_success'));
    },
    onError: () => toast.error(t('notifications.booking_update_error')),
  });
};

export const useConfirmAttendance = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (sessionId) => trainingService.confirmAttendance(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainingSessions'] });
      toast.success(t('notifications.confirm_attendance_success'));
    },
    onError: () => toast.error(t('notifications.confirm_attendance_error')),
  });
};

export const useUpdatePTDetail = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => trainingService.updatePTDetail(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ptDetails'] });
      queryClient.invalidateQueries({ queryKey: ['myPTDetail'] });
      toast.success(t('notifications.update_profile_success'));
    },
    onError: () => toast.error(t('notifications.update_profile_error')),
  });
};

export const useUpdateTrainingSession = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => trainingService.updateSession(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainingSessions'] });
      toast.success(t('notifications.save_evaluation_success'));
    },
    onError: () => toast.error(t('notifications.save_evaluation_error')),
  });
};

export const useUpdateMyPTDetail = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => trainingService.updateMyPTDetail(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myPTDetail'] });
      toast.success(t('notifications.update_schedule_success'));
    },
    onError: () => toast.error(t('notifications.update_schedule_error')),
  });
};
