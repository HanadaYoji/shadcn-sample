"use server";

import { SignUpSchema } from "./schema";
import {
  checkUserExists,
  signUpUser as cognitoSignUp,
  deleteUser,
} from "@/lib/cognito";

export const signUpUser = async (formData: FormData) => {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const parsedData = SignUpSchema.safeParse({ email, password });
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
        // emailがすでに登録済み（確認が取れているもの含む）
        return {
          success: false,
          error: "このメールアドレスは既に登録されています",
        };
      } else {
        // emailの確認が取れない場合、（途中で諦めた等）
        // emailが確認、emailの検証ができない
        // 登録を実施するため、削除を行っていく。
        await deleteUser(email);
      }
    }    


    const res = await cognitoSignUp(email, password);

    return { success: true };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: (error as Error).message || "サインアップに失敗しました",
    };
  }
};
