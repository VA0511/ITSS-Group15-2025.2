import { useQuery } from '@tanstack/react-query';
import { accountService } from '@/services/accountService';

export const useAccounts = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['accounts', page, limit],
    queryFn: () => accountService.getAccounts(page, limit),
  });
};
