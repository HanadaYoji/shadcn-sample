// src/app/auth/complete-profile/actions.ts
"use server";

import { updateUserAttributes } from "@/lib/cognito";
import { v4 as uuidv4 } from 'uuid';
// export async function handleSubmit(data: z.infer<typeof FormSchema>) {
export async function handleSubmit(formData: FormData) {
  try {
    const family_name = formData.get("family_name");
    const given_name = formData.get("given_name");
    const family_name_furigana = formData.get("family_name_furigana");
    const given_name_furigana = formData.get("given_name_furigana");
    const nickname = formData.get("nickname");
    const birthdate = formData.get("birthdate");
    const gender = formData.get("gender");
    let phone_number = formData.get("phone_number");
    const postal_code = formData.get("postal_code");
    const region = formData.get("region");
    const locality = formData.get("locality");
    const street_address = formData.get("street_address");
    const building_name = formData.get("building_name");
    const email = formData.get("email") as string;


    if (!email) {
      return {
        success: false,
        error: "メールアドレスが見つかりません。再度やり直してください。",
      };
    }

    // Phone number formatting
    if (phone_number) {
      // 日本の電話番号を想定して E.164 形式に変換
      phone_number = phone_number.toString().replace(/^0/, "+81");
    }
    const uuid = uuidv4();


    const attributes = [
      { Name: "email", Value: String(email) },
      { Name: "family_name", Value: String(family_name) },
      { Name: "given_name", Value: String(given_name) },
      {
        Name: "custom:family_name_furigana",
        Value: String(family_name_furigana),
      },
      {
        Name: "custom:given_name_furigana",
        Value: String(given_name_furigana),
      },
      { Name: "nickname", Value: String(nickname) },
      { Name: "birthdate", Value: String(birthdate) },
      { Name: "gender", Value: String(gender) },
      { Name: "phone_number", Value: String(phone_number) },
      { Name: "custom:postal_code", Value: String(postal_code) },
      { Name: "custom:region", Value: String(region) },
      { Name: "custom:locality", Value: String(locality) },
      { Name: "custom:street_address", Value: String(street_address) },
      { Name: "custom:building_name", Value: String(building_name) },
      { Name: "custom:email_org", Value: String(email) },
      { Name: "custom:uuid", Value: String(uuid) },
    ];

    const result = await updateUserAttributes(email, attributes);

    return { success: true };
  } catch (error) {
    console.error("Error updating user attributes:", error);
    return { success: false, error: "利用者情報の登録に失敗しました。" };
  }
}
