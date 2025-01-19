import { z } from 'zod';

export const ResetPasswordSchema = z.object({
  code: z.string()
    .min(1, '確認コードは必須です'), // nonemptyの代わりにmin(1)を使用
  password: z.string()
    .min(8, 'パスワードは8文字以上でなければなりません')
    .regex(/[0-9]/, 'パスワードには少なくとも1つの数字を含む必要があります')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'パスワードには少なくとも1つの特殊文字を含む必要があります')
    .regex(/[A-Z]/, 'パスワードには少なくとも1つの大文字を含む必要があります')
    .regex(/[a-z]/, 'パスワードには少なくとも1つの小文字を含む必要があります'),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: 'パスワードと確認用パスワードが一致しません',
  path: ['confirmPassword'],
});
