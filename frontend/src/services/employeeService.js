import axios from '@/lib/axios';

const IS_MOCK = false; // Set to false to use real API

export const employeeService = {
  getEmployees: async (page = 1, limit = 6) => {
    if (IS_MOCK) {
      // Mock data
      return { data: [], total: 0, page, limit };
    }
    const response = await axios.get(`/employees?page=${page}&limit=${limit}`);
    return response;
  },

  createEmployee: async (data) => {
    return axios.post('/employees', data);
  },

  updateEmployee: async (id, data) => {
    return axios.put(`/employees/${id}`, data);
  },

  deleteEmployee: async (id) => {
    return axios.delete(`/employees/${id}`);
  },

  getEmployeeById: async (id) => {
    return axios.get(`/employees/${id}`);
  },

  updateEmployeeStatus: async (id, status) => {
    return axios.put(`/employees/${id}`, { status });
  },
};