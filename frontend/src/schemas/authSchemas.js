import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string()
    .min(1, 'auth:validation.username_required'),
  password: z.string()
    .min(6, 'auth:validation.password_min'),
});
