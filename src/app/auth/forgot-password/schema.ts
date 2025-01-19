import { z } from 'zod';

export const ForgotPasswordSchema = z.object({
  email: z.string().email('有効なメールアドレスを入力してください').min(1, 'メールアドレスを入力してください'),
});
