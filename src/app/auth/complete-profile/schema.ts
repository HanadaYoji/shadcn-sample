import { z } from 'zod';

export const FormSchema = z.object({
  email: z.string().email('有効なメールアドレスを入力してください。'),
  family_name: z.string().min(1, '姓は必須です。'),
  given_name: z.string().min(1, '名は必須です。'),
  family_name_furigana: z.string().min(1, '姓（フリガナ）は必須です。'),
  given_name_furigana: z.string().min(1, '名（フリガナ）は必須です。'),
  nickname: z.string().optional(),
  birthdate: z.string().min(1, '生年月日は必須です。'),
  gender: z.enum(['male', 'female', 'other'], { required_error: '性別は必須です。' }),
  phone_number: z
    .string()
    .min(1, '電話番号は必須です。')
    .regex(/^0\d+$/, '電話番号は0から始まる数値で入力してください。'),
  postal_code: z
    .string()
    .min(1, '郵便番号は必須です。')
    .regex(/^\d+$/, '郵便番号は数値のみで入力してください。'),
  region: z.string().min(1, '都道府県は必須です。'),
  locality: z.string().min(1, '市区町村は必須です。'),
  street_address: z.string().min(1, '番地以下の住所は必須です。'),
  building_name: z.string().optional(),
});
