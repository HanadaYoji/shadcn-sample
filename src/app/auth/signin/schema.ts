import { z } from 'zod';

export const SignInSchema = z.object({
  // email: z.string().email('有効なメールアドレスを入力してください').nonempty('メールアドレスは必須です'),
  email: z.string().email('有効なメールアドレスを入力してください').min(1, '確認コードは必須です'), // nonemptyの代わりにmin(1)を使用
  password: z.string().min(1, 'パスワードは必須です'),
});
