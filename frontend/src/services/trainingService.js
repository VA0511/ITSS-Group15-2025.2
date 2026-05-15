import axios from '@/lib/axios';

export const trainingService = {
  getBookings: async () => {
    return axios.get('/training-bookings');
  },
  getBookingById: async (id) => {
    return axios.get(`/training-bookings/${id}`);
  },
  createBooking: async (data) => {
    return axios.post('/training-bookings', data);
  },
  updateBooking: async (id, data) => {
    return axios.put(`/training-bookings/${id}`, data);
  },
  deleteBooking: async (id) => {
    return axios.delete(`/training-bookings/${id}`);
  },
  getSessions: async () => {
    return axios.get('/training-sessions');
  },
  getSessionById: async (id) => {
    return axios.get(`/training-sessions/${id}`);
  },
  createSession: async (data) => {
    return axios.post('/training-sessions', data);
  },
  updateSession: async (id, data) => {
    return axios.put(`/training-sessions/${id}`, data);
  },
  confirmAttendance: async (id) => {
    return axios.post(`/training-sessions/${id}/confirm`);
  },
  getPTDetails: async () => {
    return axios.get('/pt-details');
  },
  getMyPTDetail: async () => {
    return axios.get('/pt-details/me');
  },
  getPTDetailById: async (id) => {
    return axios.get(`/pt-details/${id}`);
  },
  updatePTDetail: async (id, data) => {
    return axios.put(`/pt-details/${id}`, data);
  },
  updateMyPTDetail: async (data) => {
    return axios.put('/pt-details/me', data);
  },
};
