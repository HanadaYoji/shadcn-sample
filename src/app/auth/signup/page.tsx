'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { SignUpSchema } from './schema'; 
import { signUpUser } from './action';    // サーバーアクションをインポート
import Cookies from 'js-cookie';

const SignUpPage = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (data: z.infer<typeof SignUpSchema>) => {
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('email', data.email);
    formData.append('password', data.password);
    // server actionへ
    const result = await signUpUser(formData);

    if (result.success) {
      toast({
        title: '成功',
        description: 'アカウントを確認するためにメールを確認してください。',
      });
      Cookies.set('email', data.email, { expires: 1 });
      setIsSubmitting(false);
      router.push('/auth/confirmation'); // 新規登録確認ページに遷移
    } else {
      form.setError('email', { type: 'manual', message: result.error });
      toast({
        variant: "destructive",
        title: 'エラー',
        description: result.error,
      });
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="my-4 text-4xl font-bold">新規登録</div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="w-2/3 space-y-6">
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
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>パスワード</FormLabel>
                <FormControl className="relative">
                  <Input type={showPassword ? 'text' : 'password'} placeholder="パスワード" {...field} />
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
          <div className="flex justify-between">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? '登録中...' : '新規登録'}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default SignUpPage;
