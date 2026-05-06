import axios from '@/lib/axios';

export const feedbackService = {
  getFeedbacks: (page = 1, limit = 6, status = '') => {
    const params = new URLSearchParams({ page, limit });
    if (status) params.append('status', status);
    return axios.get(`/feedbacks?${params.toString()}`);
  },

  createFeedback: (data) =>
    axios.post('/feedbacks', data),

  updateFeedbackStatus: (id, status, responseText) =>
    axios.put(`/feedbacks/${id}`, { status, response_text: responseText }),

  getMyFeedbacks: () =>
    axios.get('/members/me/feedbacks'),
};
