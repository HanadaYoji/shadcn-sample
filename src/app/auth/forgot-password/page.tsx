'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { ForgotPasswordSchema } from './schema'; 
import { forgotPassword } from './action'; 
import Cookies from 'js-cookie';
import { useState } from 'react';

const ForgotPasswordPage = () => {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);


  async function onSubmit(data: { email: string }) {
    setIsSubmitting(true);
    const result = await forgotPassword(data.email);

    if (result?.error) {
      setIsSubmitting(false);

      form.setError('email', { type: 'manual', message: result.error });
      toast({
        title: 'エラー',
        description: result.error,
      });
    } else {
      setIsSubmitting(false);

      toast({
        title: '成功',
        description: 'パスワードリセットがメールに送信されました。',
      });
      // emailをcookieに保存
      Cookies.set('email', data.email, { expires: 1 });
      router.push('/auth/reset-password');
    }
  }

  return (
    <>
      <div className="my-4 text-4xl font-bold">パスワードを忘れましたか？</div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>メールアドレス</FormLabel>
                <FormControl>
                  <Input placeholder="メールアドレス" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-between">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'リセットリンクを送信中...' : 'リセットリンクを送信'}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default ForgotPasswordPage;