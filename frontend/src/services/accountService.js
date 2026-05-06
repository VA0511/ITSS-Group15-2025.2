import axios from '@/lib/axios';

const IS_MOCK = false; // Set to false to use real API

export const accountService = {
  getAccounts: async (page = 1, limit = 6) => {
    if (IS_MOCK) {
      return { data: [], total: 0, page, limit };
    }
    const response = await axios.get(`/accounts?page=${page}&limit=${limit}`);
    return response;
  },

  createAccount: async (data) => {
    return axios.post('/accounts', data);
  },

  updateAccount: async (id, data) => {
    return axios.put(`/accounts/${id}`, data);
  },

  deleteAccount: async (id) => {
    return axios.delete(`/accounts/${id}`);
  },

  getAccountById: async (id) => {
    return axios.get(`/accounts/${id}`);
  },

  revealPassword: async (id, ownerPassword) => {
    return axios.post(`/accounts/${id}/reveal`, { owner_password: ownerPassword });
  },
};