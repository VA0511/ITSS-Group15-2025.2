import { useQuery } from '@tanstack/react-query';
import { packageService } from '@/services/packageService';

// Hook lấy danh sách các gói dịch vụ
export const usePackages = () => {
  return useQuery({
    queryKey: ['packages'],
    queryFn: () => packageService.getPackages(),
  });
};

// Hook lấy chi tiết một gói
export const usePackageDetails = (id) => {
  return useQuery({
    queryKey: ['package', id],
    queryFn: () => packageService.getPackageById(id),
    enabled: !!id,
  });
};

export const useMemberPackages = () => {
  return useQuery({
    queryKey: ['memberPackages'],
    queryFn: () => packageService.getMemberPackages(),
  });
};
