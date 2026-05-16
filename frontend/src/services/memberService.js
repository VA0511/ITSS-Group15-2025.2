import axios from '@/lib/axios';

export const memberService = {
  getMembers: (page = 1, limit = 6) =>
    axios.get(`/members?page=${page}&limit=${limit}`),

  getMemberDetail: (id) =>
    axios.get(`/members/${id}`),

  createMember: (data) =>
    axios.post('/members', data),

  updateMember: (id, data) =>
    axios.put(`/members/${id}`, data),

  getMemberSubscriptionHistory: (memberId, page = 1, limit = 5) =>
    axios.get(`/members/${memberId}/subscriptions?page=${page}&limit=${limit}`),

  updateMemberStatus: (id, isActive) =>
    axios.put(`/members/${id}/status`, { is_active: isActive }),

  deleteMember: (id) =>
    axios.delete(`/members/${id}`),

  getMemberByAccountId: (accountId) =>
    axios.get(`/members/account/${accountId}`),

  getAllMembers: () =>
    axios.get('/members'),
};
