import { useQuery } from '@tanstack/react-query';
import { employeeService } from '@/services/employeeService';

// Hook lấy danh sách nhân viên với pagination
export const useEmployees = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['employees', page, limit],
    queryFn: () => employeeService.getEmployees(page, limit),
  });
};