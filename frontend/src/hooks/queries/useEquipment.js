import { useQuery } from '@tanstack/react-query';
import { equipmentService } from '@/services/equipmentService';

// Hook lấy trạng thái thiết bị phòng tập với pagination
export const useEquipment = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['equipment', page, limit],
    queryFn: () => equipmentService.getEquipments(page, limit),
  });
};
