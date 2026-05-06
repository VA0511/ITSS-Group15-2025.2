import { z } from 'zod';

export const roomSchema = z.object({
  facility_name: z.string().min(3, { message: 'Tên khu vực phải có ít nhất 3 ký tự' }),
  facility_type: z.string().min(1, { message: 'Vui lòng chọn loại khu vực' }),
  description: z.string().optional().default(''),
  max_capacity: z.coerce.number().min(1, { message: 'Sức chứa tối thiểu 1 người' }).max(1000, { message: 'Sức chứa tối đa 1000 người' }),
  current_capacity: z.coerce.number().min(0, { message: 'Không được nhỏ hơn 0' }).max(1000).optional().default(0),
  amenities: z.string().optional().default(''),
}).refine(data => (data.current_capacity ?? 0) <= data.max_capacity, {
  message: 'Số người hiện tại không được vượt quá sức chứa tối đa',
  path: ['current_capacity'],
});
