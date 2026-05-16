import { useQuery } from '@tanstack/react-query';
import { memberService } from '@/services/memberService';

// Hook lấy danh sách tất cả hội viên với pagination
export const useMembers = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['members', page, limit],
    queryFn: () => memberService.getMembers(page, limit),
  });
};

// Hook lấy lịch sử đăng ký gói tập của hội viên
export const useMemberSubscriptionHistory = (memberId, page = 1, limit = 5) => {
  return useQuery({
    queryKey: ['memberSubscriptions', memberId, page, limit],
    queryFn: () => memberService.getMemberSubscriptionHistory(memberId, page, limit),
    enabled: !!memberId,
  });
};

export const useMemberDetails = (id) => {
  return useQuery({
    queryKey: ['memberDetail', id],
    queryFn: () => memberService.getMemberDetail(id),
    enabled: !!id,
  });
};

export const useAllMembers = () => {
  return useQuery({
    queryKey: ['allMembers'],
    queryFn: () => memberService.getAllMembers(),
  });
};
