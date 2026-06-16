import { z } from 'zod';

export const packageSchema = z.object({
  name: z.string().min(3, "Tên gói tập phải có ít nhất 3 ký tự (VD: Thể hình Cơ bản)"),
  categoryId: z.union([
    z.coerce.number().min(1),
    z.literal('NEW_CATEGORY')
  ], { errorMap: () => ({ message: "Vui lòng chọn Loại Dịch Vụ" }) }),
  pricingType: z.enum(['time_based', 'session_based']),
  durationMonths: z.coerce.number().optional().nullable(),
  totalSessions: z.coerce.number().optional().nullable(),
  price: z.coerce.number().min(0, "Giá tiền không thể bé hơn 0"),
  description: z.string().optional()
}).refine(data => {
  if (data.pricingType === 'time_based') {
    return data.durationMonths !== undefined && data.durationMonths !== null && data.durationMonths >= 1;
  }
  return true;
}, {
  message: "Thời hạn phải từ 1 tháng trở lên",
  path: ["durationMonths"]
}).refine(data => {
  if (data.pricingType === 'session_based') {
    return data.totalSessions !== undefined && data.totalSessions !== null && data.totalSessions >= 1;
  }
  return true;
}, {
  message: "Số buổi phải từ 1 buổi trở lên",
  path: ["totalSessions"]
});
