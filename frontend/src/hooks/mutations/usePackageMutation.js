import { useMutation, useQueryClient } from '@tanstack/react-query';
import { packageService } from '@/services/packageService';
import { toast } from '@/utils/toast';
import { useTranslation } from 'react-i18next';

export const useCreatePackage = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => packageService.createPackage(data),
    onSuccess: () => {
      toast.success(t('notifications.create_package_new_success'));
      queryClient.invalidateQueries({ queryKey: ['packages'] });
    },
    onError: (error) => {
      toast.error(t('notifications.error_add') + (error.message || t('notifications.error_try_again')));
    },
  });
};

export const useUpdatePackage = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => packageService.updatePackage(id, data),
    onSuccess: () => {
      toast.success(t('notifications.update_package_new_success'));
      queryClient.invalidateQueries({ queryKey: ['packages'] });
    },
    onError: (error) => {
      toast.error(t('notifications.error_update') + (error.message || t('notifications.error_try_again')));
    },
  });
};

export const useDeletePackage = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => packageService.deletePackage(id),
    onSuccess: () => {
      toast.success(t('notifications.delete_package_new_success'));
      queryClient.invalidateQueries({ queryKey: ['packages'] });
    },
    onError: (error) => {
      toast.error(t('notifications.error_delete') + (error.message || t('notifications.error_try_again')));
    },
  });
};

export const useUpdatePackageStatus = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isActive }) => packageService.updatePackageStatus(id, isActive),
    onSuccess: () => {
      toast.success(t('notifications.update_status_success'));
      queryClient.invalidateQueries({ queryKey: ['packages'] });
    },
    onError: (error) => {
      toast.error(t('notifications.error_status') + (error.message || t('notifications.error_try_again')));
    },
  });
};