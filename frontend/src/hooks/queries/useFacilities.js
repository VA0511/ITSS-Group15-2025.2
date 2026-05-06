import { useQuery } from '@tanstack/react-query';
import { facilityService } from '@/services/facilityService';

// Hook lấy danh sách cơ sở với pagination
export const useFacilities = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['facilities', page, limit],
    queryFn: () => facilityService.getFacilities(page, limit),
  });
};