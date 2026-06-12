import { useMutation, useQueryClient } from '@tanstack/react-query';
import { employeeService } from '@/services/employeeService';
import { toast } from '@/utils/toast';
import { useTranslation } from 'react-i18next';

export const useCreateEmployee = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => employeeService.createEmployee(data),
    onSuccess: () => {
      toast.success(t('notifications.create_employee_success'));
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
    onError: (error) => {
      toast.error(t('notifications.error_add') + (error.message || t('notifications.error_try_again')));
    },
  });
};

export const useUpdateEmployee = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => employeeService.updateEmployee(id, data),
    onSuccess: () => {
      toast.success(t('notifications.update_employee_success'));
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
    onError: (error) => {
      toast.error(t('notifications.error_update') + (error.message || t('notifications.error_try_again')));
    },
  });
};

export const useDeleteEmployee = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => employeeService.deleteEmployee(id),
    onSuccess: () => {
      toast.success(t('notifications.delete_employee_success'));
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
    onError: (error) => {
      toast.error(t('notifications.error_delete') + (error.message || t('notifications.error_try_again')));
    },
  });
};

export const useUpdateEmployeeStatus = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }) => employeeService.updateEmployeeStatus(id, status),
    onSuccess: () => {
      toast.success(t('notifications.update_status_success'));
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
    onError: (error) => {
      toast.error(t('notifications.error_status') + (error.message || t('notifications.error_try_again')));
    },
  });
};