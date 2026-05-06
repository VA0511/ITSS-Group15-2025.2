import { z } from 'zod';

export const equipmentSchema = z.object({
  name: z.string().min(2, "Tên tài sản máy móc không được để trống"),
  code: z.string().min(2, "Vui lòng cung cấp Mã tài sản nội bộ"),
  quantity: z.coerce.number().min(1, "Số lượng máy phải lớn hơn bằng 1"),
  status: z.enum(['New', 'Operating', 'Maintenance', 'Broken']),
  purchaseDate: z.string().optional(),
  warrantyUntil: z.string().optional(),
  facility_id: z.coerce.number().min(1, "Vui lòng chọn phòng tập/cơ sở"),
  origin: z.string().optional(),
});
