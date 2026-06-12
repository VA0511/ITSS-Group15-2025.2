import { useMutation, useQueryClient } from '@tanstack/react-query';
import { equipmentService } from '@/services/equipmentService';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

export const useCreateEquipment = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => equipmentService.createEquipment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipment'] });
      toast.success(t('notifications.create_equipment_new_success'));
    },
  });
};

export const useUpdateEquipmentStatus = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }) => equipmentService.updateEquipmentStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipment'] });
      toast.success(t('notifications.update_equipment_status_success'));
    },
  });
};

export const useDeleteEquipment = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => equipmentService.deleteEquipment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipment'] });
      toast.success(t('notifications.delete_equipment_msg'));
    },
  });
};
