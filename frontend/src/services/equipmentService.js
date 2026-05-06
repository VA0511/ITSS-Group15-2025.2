import axios from '@/lib/axios';

const IS_MOCK = false; // Set to false to use real API
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const MOCK_EQUIPMENTS = [
  { id: 1, name: 'Máy chạy bộ KingSmith', status: 'active', maintainDate: '2026-05-10', room: 'Tầng 1' },
  { id: 2, name: 'Dàn tạ đa năng', status: 'maintenance', maintainDate: '2026-03-25', room: 'Tầng 2' },
  { id: 3, name: 'Xe đạp tập Elip', status: 'active', maintainDate: '2026-08-01', room: 'Tầng 1' },
];

export const equipmentService = {
  getEquipments: async (page = 1, limit = 6) => {
    if (IS_MOCK) {
      await delay(400);
      return { data: MOCK_EQUIPMENTS, total: MOCK_EQUIPMENTS.length, page, limit };
    }
    const response = await axios.get(`/equipments?page=${page}&limit=${limit}`);
    return response;
  },

  getEquipmentById: async (id) => {
    if (IS_MOCK) {
      await delay(300);
      return MOCK_EQUIPMENTS.find(e => e.id === parseInt(id));
    }
    return axios.get(`/equipments/${id}`);
  },

  createEquipment: async (data) => {
    if (IS_MOCK) {
      await delay(600);
      return { ...data, id: Date.now() };
    }
    return axios.post('/equipments', data);
  },

  updateEquipment: async (id, data) => {
    if (IS_MOCK) {
      await delay(600);
      return { id, ...data };
    }
    return axios.put(`/equipments/${id}`, data);
  },

  updateEquipmentStatus: async (id, status) => {
    if (IS_MOCK) {
      await delay(400);
      return { id, status };
    }
    return axios.put(`/equipments/${id}`, { status });
  },

  deleteEquipment: async (id) => {
    if (IS_MOCK) {
      await delay(400);
      return { success: true };
    }
    return axios.delete(`/equipments/${id}`);
  }
};
