import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { trainingBookingService } from '@/services/trainingBookingService';

// Hook lấy danh sách tất cả training bookings
export const useTrainingBookings = () => {
    return useQuery({
        queryKey: ['trainingBookings'],
        queryFn: () => trainingBookingService.getTrainingBookings(),
    });
};

// Hook lấy chi tiết training booking
export const useTrainingBookingDetail = (id) => {
    return useQuery({
        queryKey: ['trainingBooking', id],
        queryFn: () => trainingBookingService.getTrainingBookingById(id),
        enabled: !!id,
    });
};

// Hook để cập nhật training booking
export const useUpdateTrainingBooking = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }) => trainingBookingService.updateTrainingBooking(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['trainingBookings'] });
            console.log('Cập nhật lịch tập thành công');
        },
        onError: (error) => {
            console.error('Cập nhật lịch tập thất bại:', error);
        },
    });
};

// Hook để hủy training booking
export const useCancelTrainingBooking = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, reason }) => {
            console.log('[useCancelTrainingBooking] Calling mutation with id:', id, 'reason:', reason);
            return trainingBookingService.cancelTrainingBooking(id, reason);
        },
        onSuccess: (data) => {
            console.log('[useCancelTrainingBooking] Success, invalidating query');
            queryClient.invalidateQueries({ queryKey: ['trainingBookings'] });
            console.log('Hủy lịch tập thành công');
        },
        onError: (error) => {
            console.error('[useCancelTrainingBooking] Error:', error);
            console.error('Hủy lịch tập thất bại:', error.message || error);
        },
    });
};

// Hook để xóa training booking
export const useDeleteTrainingBooking = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) => trainingBookingService.deleteTrainingBooking(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['trainingBookings'] });
            console.log('Xóa lịch tập thành công');
        },
        onError: (error) => {
            console.error('Xóa lịch tập thất bại:', error);
        },
    });
};
