import { useQuery } from '@tanstack/react-query';
import { facilityService } from '@/services/facilityService';

export const useFacilities = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['facilities', page, limit],
    queryFn: () => facilityService.getFacilities(page, limit),
  });
};

export const useFacilityById = (id) => {
  return useQuery({
    queryKey: ['facility', id],
    queryFn: () => facilityService.getFacilityById(id),
    enabled: !!id,
  });
};