"use client";

import { signIn, getCsrfToken } from "next-auth/react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { useState, useEffect } from "react";
import { SignInSchema } from "./schema";

const SignInPage = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [csrfToken, setCsrfToken] = useState<string | null>(null);

  useEffect(() => {

    const fetchCsrfToken = async () => {
      const token = await getCsrfToken();

      setCsrfToken(token);
    };
    fetchCsrfToken();
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  async function onSubmit(data: z.infer<typeof SignInSchema>) {
    setIsSubmitting(true);
    const result = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
      csrfToken: csrfToken ?? "", // CSRFトークンを追加
    });

    if (result?.error) {
      form.setError("root", {
        type: "manual",
        message:
          "メールアドレスまたはパスワードが間違っています。もう一度お試しください。",
      });
      toast({
        variant: "destructive",
        title: "Error",
        description:
          "メールアドレスまたはパスワードが間違っています。もう一度お試しください。",
      });
      setIsSubmitting(false);
    } else {
      toast({
        title: "Success",
        description: "ログインに成功しました。",
      });
      setIsSubmitting(false);
      router.push("/auth-redirect"); // トップ画面に遷移
    }
  }

  return (
    <>
      <div className="my-4 text-4xl font-bold">ログイン</div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-2/3 space-y-6"
        >
          <input name="csrfToken" type="hidden" value={csrfToken || ""} />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>メールアドレス</FormLabel>
                <FormControl>
                  <Input
                    placeholder="メールアドレス"
                    {...field}
                    autoComplete="email"
                  />
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
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="パスワード"
                    {...field}
                    autoComplete="current-password"
                  />
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
          {form.formState.errors.root && (
            <div className="text-red-500">
              {form.formState.errors.root.message}
            </div>
          )}
          <div className="flex justify-between">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "ログイン中..." : "ログイン"}
            </Button>
            <Button
              type="button"
              className="bg-green-500 hover:bg-green-600"
              onClick={() => router.push("/auth/signup")}
              disabled={isSubmitting}
            >
              新規登録
            </Button>
          </div>
        </form>
      </Form>
      <div className="mt-4">
        <a
          href="/auth/forgot-password"
          className="text-blue-500 hover:underline"
        >
          パスワードを忘れましたか？
        </a>
      </div>
    </>
  );
};

export default SignInPage;
