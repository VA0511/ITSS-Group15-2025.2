import { useMutation, useQueryClient } from '@tanstack/react-query';
import { facilityService } from '@/services/facilityService';
import { toast } from '@/utils/toast';
import { useTranslation } from 'react-i18next';

export const useCreateFacility = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => facilityService.createFacility(data),
    onSuccess: () => {
      toast.success(t('notifications.create_facility_success'));
      queryClient.invalidateQueries({ queryKey: ['facilities'] });
    },
    onError: (error) => {
      toast.error(t('notifications.error_add') + (error.message || t('notifications.error_try_again')));
    },
  });
};

export const useUpdateFacility = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => facilityService.updateFacility(id, data),
    onSuccess: () => {
      toast.success(t('notifications.update_facility_success'));
      queryClient.invalidateQueries({ queryKey: ['facilities'] });
    },
    onError: (error) => {
      toast.error(t('notifications.error_update') + (error.message || t('notifications.error_try_again')));
    },
  });
};

export const useDeleteFacility = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => facilityService.deleteFacility(id),
    onSuccess: () => {
      toast.success(t('notifications.delete_facility_success'));
      queryClient.invalidateQueries({ queryKey: ['facilities'] });
    },
    onError: (error) => {
      toast.error(t('notifications.error_delete') + (error.message || t('notifications.error_try_again')));
    },
  });
};

export const useUpdateFacilityStatus = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }) => facilityService.updateFacilityStatus(id, status),
    onSuccess: () => {
      toast.success(t('notifications.update_status_success'));
      queryClient.invalidateQueries({ queryKey: ['facilities'] });
    },
    onError: (error) => {
      toast.error(t('notifications.error_status') + (error.message || t('notifications.error_try_again')));
    },
  });
};