"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { useState, useEffect } from "react";
import { FormSchema } from "./schema";
import { handleSubmit } from "./action";
import { postalCode } from "@/lib/postal-api";
import { prefectures, Prefecture } from "@/data/prefectures";
import Cookies from "js-cookie";

const Page = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      family_name: "",
      given_name: "",
      family_name_furigana: "",
      given_name_furigana: "",
      nickname: "",
      birthdate: "",
      gender: undefined,
      phone_number: "",
      postal_code: "",
      region: "",
      locality: "",
      street_address: "",
      building_name: "",
    },
  });

  useEffect(() => {
    const storedEmail = Cookies.get("email");
    if (storedEmail) {
      setEmail(storedEmail);
      form.setValue("email", storedEmail);
      setIsLoading(false);
    } else {
      toast({
        title: "エラー",
        description: "メールアドレスが見つかりません。再度やり直してください。",
      });
      router.push("/auth/signup");
      setIsLoading(false);
    }
  }, [router, form]);

  const normalizePostalCode = (postalCode: string) => {
    return postalCode.replace(/-/g, "");
  };

  const handlePostalCodeSearch = async () => {
    let postalCodeValue = form.getValues("postal_code");
    if (!postalCodeValue) {
      toast({
        title: "エラー",
        description: "郵便番号を入力してください。",
      });
      return;
    }
    setIsSearching(true); // 検索開始
    // 郵便番号を正規化（ハイフンを削除）
    postalCodeValue = normalizePostalCode(postalCodeValue);

    try {
      const response = await postalCode(postalCodeValue);
      if (response.results && response.results.length > 0) {
        const { address1, address2, address3 } = response.results[0];
        form.setValue("region", address1);
        form.setValue("locality", address2);
        form.setValue("street_address", address3);
      } else {
        toast({
          title: "エラー",
          description: "住所情報が見つかりませんでした。",
        });
      }
    } catch (error) {
      toast({
        title: "エラー",
        description: "郵便番号検索に失敗しました。",
      });
    } finally {
      setIsSearching(false);
    }
  };

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("family_name", data.family_name);
    formData.append("given_name", data.given_name);
    formData.append("family_name_furigana", data.family_name_furigana);
    formData.append("given_name_furigana", data.given_name_furigana || "");
    formData.append("nickname", data.nickname || "");
    formData.append("birthdate", data.birthdate || "");
    formData.append("gender", data.gender || "");
    formData.append("phone_number", data.phone_number);
    formData.append("postal_code", data.postal_code);
    formData.append("region", data.region);
    formData.append("locality", data.locality);
    formData.append("street_address", data.street_address);
    formData.append("building_name", data.building_name || "");
    formData.append("email", Cookies.get("email") || "");
    // server action
    const result = await handleSubmit(formData);
    // const result = await handleSubmit({ ...data, email });

    if (result.success) {
      toast({
        title: "成功",
        description: "情報が正常に更新されました。",
      });
      setIsSubmitting(false);
      router.push("/auth/signin");
    } else {
      toast({
        title: "エラー",
        variant: "destructive",
        description: result.error,
      });
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return <>読込中...</>;
  }

  return (
    <>
      <div className="my-4 text-4xl font-bold">利用者情報</div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-6"
        >
          <input type="hidden" {...form.register("email")} value={email} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="family_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    姓<span className="text-red-500 ml-1">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="姓" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="given_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    名<span className="text-red-500 ml-1">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="名" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="family_name_furigana"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    姓（フリガナ）<span className="text-red-500 ml-1">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="姓（フリガナ）" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="given_name_furigana"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    名（フリガナ）<span className="text-red-500 ml-1">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="名（フリガナ）" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nickname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ニックネーム</FormLabel>
                  <FormControl>
                    <Input placeholder="ニックネーム" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="birthdate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    生年月日<span className="text-red-500 ml-1">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input type="date" placeholder="生年月日" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    性別<span className="text-red-500 ml-1">*</span>
                  </FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="性別を選択" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">男性</SelectItem>
                        <SelectItem value="female">女性</SelectItem>
                        <SelectItem value="other">その他</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    電話番号<span className="text-red-500 ml-1">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="電話番号" {...field} />
                  </FormControl>
                  <FormDescription>数値のみで設定してください</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-end space-x-2">
              <FormField
                control={form.control}
                name="postal_code"
                render={({ field }) => (
                  <FormItem className="flex-grow">
                    <FormLabel>
                      郵便番号<span className="text-red-500 ml-1">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="郵便番号"
                        {...field}
                        disabled={isSearching}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="button"
                onClick={handlePostalCodeSearch}
                disabled={isSearching}
              >
                検索
              </Button>
            </div>
            <FormField
              control={form.control}
              name="region"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    都道府県<span className="text-red-500 ml-1">*</span>
                  </FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isSearching}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="都道府県を選択" />
                      </SelectTrigger>
                      <SelectContent>
                        {prefectures.map((prefecture: Prefecture) => (
                          <SelectItem
                            key={prefecture.id}
                            value={prefecture.name}
                          >
                            {prefecture.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="locality"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    市区町村<span className="text-red-500 ml-1">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="○○市"
                      {...field}
                      disabled={isSearching}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="street_address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    町名・丁目以下<span className="text-red-500 ml-1">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="○○東町1-2-3"
                      {...field}
                      disabled={isSearching}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="building_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>建物名・部屋番号</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="○○マンション101号室"
                      {...field}
                      disabled={isSearching}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex justify-between mt-6">
            {/* <Button type="submit">更新</Button> */}
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "登録中..." : "登録"}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default Page;
