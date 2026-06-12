import { useMutation, useQueryClient } from '@tanstack/react-query';
import { equipmentService } from '@/services/equipmentService';
import { toast } from '@/utils/toast';
import { useTranslation } from 'react-i18next';

export const useCreateEquipment = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => equipmentService.createEquipment(data),
    onSuccess: () => {
      toast.success(t('notifications.create_equipment_success'));
      queryClient.invalidateQueries({ queryKey: ['equipment'] });
    },
    onError: (error) => {
      toast.error(t('notifications.error_add') + (error.message || t('notifications.error_try_again')));
    },
  });
};

export const useUpdateEquipment = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => equipmentService.updateEquipment(id, data),
    onSuccess: () => {
      toast.success(t('notifications.update_equipment_success'));
      queryClient.invalidateQueries({ queryKey: ['equipment'] });
    },
    onError: (error) => {
      toast.error(t('notifications.error_update') + (error.message || t('notifications.error_try_again')));
    },
  });
};

export const useDeleteEquipment = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => equipmentService.deleteEquipment(id),
    onSuccess: () => {
      toast.success(t('notifications.delete_equipment_success'));
      queryClient.invalidateQueries({ queryKey: ['equipment'] });
    },
    onError: (error) => {
      toast.error(t('notifications.error_delete') + (error.message || t('notifications.error_try_again')));
    },
  });
};

export const useUpdateEquipmentStatus = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }) => equipmentService.updateEquipmentStatus(id, status),
    onSuccess: () => {
      toast.success(t('notifications.update_equipment_status_success'));
      queryClient.invalidateQueries({ queryKey: ['equipment'] });
    },
    onError: (error) => {
      toast.error(t('notifications.error_status') + (error.message || t('notifications.error_try_again')));
    },
  });
};