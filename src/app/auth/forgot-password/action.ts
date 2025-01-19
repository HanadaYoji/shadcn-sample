"use server";


import { ForgotPasswordSchema } from "./schema";
import { checkUserExists, forgotPassword as cognitoForgotPassword } from "@/lib/cognito";

export const forgotPassword = async (email: string) => {
  try {
    const parsedData = ForgotPasswordSchema.safeParse({ email });
    if (!parsedData.success) {
      return { success: false, error: "無効な入力です" };
    }

    const userExists = await checkUserExists(email);
    if (userExists) {
      const emailVerifiedAttribute = userExists.UserAttributes?.find(
        (attr) => attr.Name === "email_verified"
      );
      const email_verified = emailVerifiedAttribute?.Value === "true";
      if (email_verified) {
        // メールチェックOK

        // 属性チェック（family_nameを指定）
        const familyNameAttribute = userExists.UserAttributes?.find(
          (attr) => attr.Name === "family_name"
        );

        if (familyNameAttribute) {

          // パスワード忘れ（メール、検証済み
          await cognitoForgotPassword(email);
          return { success: true };
        }

      }
    }  
    return {
      success: false,
      error: "入力されたメールアドレスは登録されていません",
    };


  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: (error as Error).message || "パスワードリセットに失敗しました",
    };
  }
};
