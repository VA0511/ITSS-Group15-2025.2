import axios from '@/lib/axios';

const IS_MOCK = false;

export const facilityService = {
  getFacilities: async (page = 1, limit = 6) => {
    if (IS_MOCK) {
      return { data: [], total: 0, page, limit };
    }
    const response = await axios.get(`/facilities?page=${page}&limit=${limit}`);
    return response;
  },

  createFacility: async (data) => {
    return axios.post('/facilities', data);
  },

  updateFacility: async (id, data) => {
    return axios.put(`/facilities/${id}`, data);
  },

  deleteFacility: async (id) => {
    return axios.delete(`/facilities/${id}`);
  },

  getFacilityById: async (id) => {
    return axios.get(`/facilities/${id}`);
  },

  updateFacilityStatus: async (id, status) => {
    return axios.patch(`/facilities/${id}/status`, { status });
  },
};
