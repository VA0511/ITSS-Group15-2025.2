import { z } from 'zod';

export const packageSchema = z.object({
  name: z.string().min(3, "Tên gói tập phải có ít nhất 3 ký tự (VD: Thể hình Cơ bản)"),
  durationMonths: z.coerce.number().min(1, "Thời hạn đăng ký tối thiểu là 1 tháng"),
  price: z.coerce.number().min(0, "Giá tiền không thể bé hơn 0"),
  description: z.string().optional(),
  type: z.enum(['VIP', 'Normal', 'Female-only'], {
    errorMap: () => ({ message: "Vui lòng phân loại hạng thẻ hợp lệ" })
  })
});
