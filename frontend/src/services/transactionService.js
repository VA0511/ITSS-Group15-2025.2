import axios from '@/lib/axios';

export const transactionService = {
  getTransactions: async () => {
    return axios.get('/transactions');
  },
};