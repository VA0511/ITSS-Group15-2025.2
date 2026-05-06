import { useQuery } from '@tanstack/react-query';
import { serviceCategoryService } from '@/services/serviceCategoryService';

// Hook lấy danh sách các danh mục dịch vụ
export const useServiceCategories = () => {
    return useQuery({
        queryKey: ['serviceCategories'],
        queryFn: () => serviceCategoryService.getServiceCategories(),
    });
};

// Hook lấy chi tiết một danh mục dịch vụ
export const useServiceCategoryDetails = (id) => {
    return useQuery({
        queryKey: ['serviceCategory', id],
        queryFn: () => serviceCategoryService.getServiceCategoryById(id),
        enabled: !!id,
    });
};
