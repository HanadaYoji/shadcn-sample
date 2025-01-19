// schemas.ts
import { z } from 'zod';

export const VerifySchema = z.object({
  email: z.string().min(1, 'メールアドレスは必須です'),
  code: z.string().min(1, '確認コードは必須です'),
});
