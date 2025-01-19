// src/app/auth/reset-password/page.tsx

'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { resetPassword } from './action';
import { ResetPasswordSchema } from './schema';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

const ResetPasswordPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const storedEmail = Cookies.get('email');
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      toast({
        title: 'エラー',
        description: 'メールアドレスが見つかりません。再度やり直してください。',
      });
      router.push('/auth/forgot-password');
    }
  }, [router]);

  const form = useForm({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      code: '',
      password: '',
      confirmPassword: '',
    },
  });

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  async function onSubmit(data: { code: string, password: string, confirmPassword: string }) {
    setIsSubmitting(true);
    if (!email) {
      setIsSubmitting(false);
      toast({
        title: 'エラー',
        description: 'メールアドレスが設定されていません。',
      });
      return;
    }

    const result = await resetPassword(email, data.code, data.password);

    if (result?.type === "code") {
      // form.setError('code', { type: 'manual', message: result.error });
      form.setError('code', { type: 'manual', message: "認証コードに誤りがあります。" });
      toast({
        title: 'エラー',
        description: result.error,
      });
      setIsSubmitting(false);
    } else if (result?.type === "password") {
        // form.setError('code', { type: 'manual', message: result.error });
        form.setError('password', { type: 'manual', message: result.error });
        toast({
          title: 'エラー',
          description: result.error,
        });
        setIsSubmitting(false);
      } else {
      toast({
        title: '成功',
        description: 'パスワードが正常にリセットされました。',
      });
      setIsSubmitting(false);
      router.push('/auth/signin');
    }
  }

  return (
    <>
      <div className="my-4 text-4xl font-bold">パスワードリセット</div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>確認コード</FormLabel>
                <FormControl>
                  <Input placeholder="確認コード" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>新しいパスワード</FormLabel>
                <FormControl>
                  <Input type={showPassword ? 'text' : 'password'} placeholder="新しいパスワード" {...field} />
                </FormControl>
                <div className="mt-2 flex items-center">
                  <input
                    type="checkbox"
                    id="show-password"
                    className="mr-2"
                    checked={showPassword}
                    onChange={togglePasswordVisibility}
                  />
                  <label htmlFor="show-password">パスワードを表示する</label>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>パスワード確認</FormLabel>
                <FormControl>
                  <Input type={showPassword ? 'text' : 'password'} placeholder="パスワード確認" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-between">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'パスワードリセット中...' : 'パスワードリセット'}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default ResetPasswordPage;
