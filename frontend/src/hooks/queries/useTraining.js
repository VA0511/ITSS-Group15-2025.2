import { useQuery } from '@tanstack/react-query';
import { trainingService } from '@/services/trainingService';

const toArray = (data) => (Array.isArray(data) ? data : []);

export const useTrainingSessions = () => {
  return useQuery({
    queryKey: ['trainingSessions'],
    queryFn: async () => toArray(await trainingService.getSessions()),
    staleTime: 0,
  });
};

export const useTrainingBookings = () => {
  return useQuery({
    queryKey: ['trainingBookings'],
    queryFn: async () => toArray(await trainingService.getBookings()),
  });
};

export const useMyBookings = () => {
  return useQuery({
    queryKey: ['myBookings'],
    queryFn: async () => toArray(await trainingService.getBookings()),
    staleTime: 0,
  });
};

export const useTrainingSessionDetails = (id) => {
  return useQuery({
    queryKey: ['trainingSession', id],
    queryFn: () => trainingService.getSessionById(id),
    enabled: !!id,
  });
};

export const usePTDetails = () => {
  return useQuery({
    queryKey: ['ptDetails'],
    queryFn: async () => toArray(await trainingService.getPTDetails()),
  });
};

export const useMyPTDetail = () => {
  return useQuery({
    queryKey: ['myPTDetail'],
    queryFn: () => trainingService.getMyPTDetail(),
  });
};
