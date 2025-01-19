'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { VerifySchema } from './schema';
import { verifyCode } from './action';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';

const VerifyPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(VerifySchema),
    defaultValues: {
      email: '',
      code: '',
    },
  });

  useEffect(() => {
    const storedEmail = Cookies.get('email');
    if (storedEmail) {
      setEmail(storedEmail);
      form.setValue('email', storedEmail);
    } else {
      toast({
        title: 'エラー',
        description: 'メールアドレスが見つかりません。再度やり直してください。',
      });
      router.push('/auth/signup');
    }
  }, [router, form]);

  async function onSubmit(data: { email: string; code: string }) {
    setIsSubmitting(true);
    // console.log('onSubmit (S)');
    const formData = new FormData();
    formData.append('email', data.email);
    formData.append('code', data.code);
    const result = await verifyCode(formData);
    // console.log(result);

    if (result?.error) {
      form.setError('code', { type: 'manual', message: result.error });
      toast({
        title: 'エラー',
        description: result.error,
      });
      setIsSubmitting(false);
    } else {
      setIsSubmitting(false);
      toast({
        title: '成功',
        description: '認証に成功しました。プロフィールを完成してください。',
      });
      router.push('/auth/complete-profile'); // 本人情報登録画面に遷移
    }
  }

  return (
    <>
      <div className="my-4 text-4xl font-bold">認証コードの確認</div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
          <input type="hidden" {...form.register('email')} />
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
          <div className="flex justify-between">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? '認証中...' : '認証'}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default VerifyPage;
