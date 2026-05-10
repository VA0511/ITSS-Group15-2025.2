import axios from '@/lib/axios';

const IS_MOCK = false;

export const trainingBookingService = {
    // Lấy danh sách tất cả booking
    getTrainingBookings: async () => {
        if (IS_MOCK) {
            return { data: [], total: 0 };
        }
        const response = await axios.get('/training-bookings');
        return response.data || response;
    },

    // Lấy chi tiết booking theo ID
    getTrainingBookingById: async (id) => {
        if (IS_MOCK) {
            return null;
        }
        const response = await axios.get(`/training-bookings/${id}`);
        return response.data || response;
    },

    // Tạo booking mới
    createTrainingBooking: async (data) => {
        if (IS_MOCK) {
            return { ...data, id: Date.now() };
        }
        const response = await axios.post('/training-bookings', data);
        return response.data || response;
    },

    // Cập nhật booking (dùng cho hủy = đổi status)
    updateTrainingBooking: async (id, data) => {
        if (IS_MOCK) {
            return { id, ...data };
        }
        console.log(`[TrainingBooking] Updating booking ${id} with data:`, data);
        try {
            const response = await axios.put(`/training-bookings/${id}`, data);
            console.log(`[TrainingBooking] Update response:`, response);
            return response.data || response;
        } catch (error) {
            console.error(`[TrainingBooking] Update failed:`, error.response?.data || error.message);
            throw error;
        }
    },

    // Xóa booking
    deleteTrainingBooking: async (id) => {
        if (IS_MOCK) {
            return { success: true };
        }
        return axios.delete(`/training-bookings/${id}`);
    },

    // Hủy booking (cập nhật status thành Cancelled)
    cancelTrainingBooking: async (id, reason = '') => {
        console.log(`[CancelBooking] Fetching current booking ${id}`);

        // Lấy booking hiện tại trước
        const currentBooking = await trainingBookingService.getTrainingBookingById(id);
        console.log(`[CancelBooking] Current booking:`, currentBooking);

        if (!currentBooking) {
            throw new Error('Không tìm thấy lịch tập');
        }

        // Merge với dữ liệu mới
        const updatedData = {
            ...currentBooking,
            status: 'Cancelled',
            training_plan_note: reason || 'Hủy bởi quản lý',
        };

        console.log(`[CancelBooking] Updated data:`, updatedData);

        return trainingBookingService.updateTrainingBooking(id, updatedData);
    },
};
