import { useMutation, useQueryClient } from '@tanstack/react-query';
import { packageService } from '@/services/packageService';
import { toast } from 'sonner';

export const useCreatePackage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newPackage) => packageService.createPackage(newPackage),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['packages'] });
      toast.success('Thêm gói dịch vụ thành công!');
    },
  });
};

export const useUpdatePackage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => packageService.updatePackage(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['packages'] });
      toast.success('Cập nhật gói dịch vụ thành công!');
    },
  });
};

export const useDeletePackage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => packageService.deletePackage(id),
    onMutate: async (id) => {
      // Cancel ongoing queries
      await queryClient.cancelQueries({ queryKey: ['memberPackages'] });
      
      // Get the previous data
      const previousData = queryClient.getQueryData(['memberPackages']);
      
      // Optimistically update the cache
      queryClient.setQueryData(['memberPackages'], (oldData) => {
        if (!oldData) return oldData;
        return oldData.filter(pkg => pkg.id !== id);
      });
      
      // Return rollback context
      return { previousData };
    },
    onError: (err, id, context) => {
      // Rollback on error
      if (context?.previousData) {
        queryClient.setQueryData(['memberPackages'], context.previousData);
      }
      toast.error('Xóa gói dịch vụ thất bại. Vui lòng thử lại.');
    },
    onSuccess: () => {
      toast.success('Đã xóa gói dịch vụ');
    },
  });
};
export const useRegisterPackage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (packageData) => packageService.registerPackage(packageData),
    onMutate: async (packageData) => {
      // Cancel ongoing queries
      await queryClient.cancelQueries({ queryKey: ['memberPackages'] });
      
      // Get the previous data
      const previousData = queryClient.getQueryData(['memberPackages']);
      
      // Extract duration from package name (e.g., "Gói 1 Tháng", "Gói 6 Tháng", "Gói 12 Tháng")
      let duration = 1; // default to 1 month
      const durationMatch = packageData.name.match(/Gói\s+(\d+)\s+Tháng/);
      if (durationMatch) {
        duration = parseInt(durationMatch[1]);
      }
      
      // Calculate end date
      const startDate = new Date();
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + duration);
      
      // Optimistically update the cache with the new package
      queryClient.setQueryData(['memberPackages'], (oldData) => {
        const newPackage = {
          id: Date.now(),
          ...packageData,
          status: 'active',
          registeredDate: startDate.toISOString(),
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          duration: duration,
        };
        return [...(oldData || []), newPackage];
      });
      
      // Return rollback context
      return { previousData };
    },
    onError: (err, packageData, context) => {
      // Rollback on error
      if (context?.previousData) {
        queryClient.setQueryData(['memberPackages'], context.previousData);
      }
      toast.error('Đăng ký gói tập thất bại. Vui lòng thử lại.');
    },
    onSuccess: () => {
      toast.success('Đăng ký gói tập thành công!');
    },
  });
};

export const useRenewPackage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (renewalData) => packageService.renewPackage(renewalData),
    onMutate: async (renewalData) => {
      // Cancel ongoing queries
      await queryClient.cancelQueries({ queryKey: ['memberPackages'] });
      
      // Get the previous data
      const previousData = queryClient.getQueryData(['memberPackages']);
      
      // Optimistically update the cache
      queryClient.setQueryData(['memberPackages'], (oldData) => {
        if (!oldData) return oldData;
        return oldData.map(pkg => {
          if (pkg.id === renewalData.packageId) {
            return {
              ...pkg,
              endDate: renewalData.newEndDate,
              status: 'active',
            };
          }
          return pkg;
        });
      });
      
      // Return rollback context
      return { previousData };
    },
    onError: (err, renewalData, context) => {
      // Rollback on error
      if (context?.previousData) {
        queryClient.setQueryData(['memberPackages'], context.previousData);
      }
      toast.error('Gia hạn gói tập thất bại. Vui lòng thử lại.');
    },
    onSuccess: () => {
      toast.success('Gia hạn gói tập thành công!');
    },
  });
};
