import axios from '@/lib/axios';

export const serviceCategoryService = {
    getServiceCategories: async () => {
        return axios.get('/service-categories');
    },

    getServiceCategoryById: async (id) => {
        return axios.get(`/service-categories/${id}`);
    },

    createServiceCategory: async (data) => {
        return axios.post('/service-categories', data);
    },

    updateServiceCategory: async (id, data) => {
        return axios.put(`/service-categories/${id}`, data);
    },

    deleteServiceCategory: async (id) => {
        return axios.delete(`/service-categories/${id}`);
    }
};
