import { useQuery } from '@tanstack/react-query';
import { feedbackService } from '@/services/feedbackService';

// Hook lấy danh sách khiếu nại/góp ý với pagination và status filter
export const useFeedbacks = (page = 1, limit = 10, status = '') => {
  return useQuery({
    queryKey: ['feedbacks', page, limit, status],
    queryFn: () => feedbackService.getFeedbacks(page, limit, status),
  });
};

export const useMyFeedbacks = () => {
  return useQuery({
    queryKey: ['myFeedbacks'],
    queryFn: () => feedbackService.getMyFeedbacks(),
    staleTime: 0,
  });
};
