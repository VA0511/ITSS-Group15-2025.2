import { z } from 'zod';

// Schema đăng nhập — dùng username (không phải email)
export const loginSchema = z.object({
  username: z.string()
    .min(1, 'Vui lòng nhập tên đăng nhập'),
  password: z.string()
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
});
