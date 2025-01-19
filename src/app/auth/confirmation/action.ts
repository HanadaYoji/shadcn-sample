"use server";

import { VerifySchema } from "./schema";
import { ConfirmSignUpCommand } from "@aws-sdk/client-cognito-identity-provider";
import { generateSecretHash, checkCode } from "@/lib/cognito";

export async function verifyCode(formData: FormData) {
  try {
    const email = formData.get("email") as string;
    const code = formData.get("code") as string;
    const validateData = { email, code };
    // バリデーションを行う
    const parsedData = VerifySchema.safeParse(validateData);

    if (!parsedData.success) {
      return { success: false, error: "無効な入力です" };
    }



    const returnChekcCode = await checkCode(email, code);
    // コードのチェック（新規メールでのチェック）
    if (!returnChekcCode.success) {
      return {
        success: false,
        error: "認証コードに誤りがあります。",
      };
    }

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "認証に失敗しました" };
  }
}
