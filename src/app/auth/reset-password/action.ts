// src/app/auth/reset-password/actions.ts

'use server';

import { ConfirmForgotPasswordCommand } from '@aws-sdk/client-cognito-identity-provider';
import { ResetPasswordSchema } from './schema';
import { client, generateSecretHash, validateCurrentEmailAndPassword } from '@/lib/cognito';

export const resetPassword = async (email: string, code: string, newPassword: string) => {
  try {
    const parsedData = ResetPasswordSchema.safeParse({ code, password: newPassword, confirmPassword: newPassword });
    if (!parsedData.success) {
      console.error('Validation Error:', parsedData.error);
      return { success: false, error: '無効な入力です' };
    }

    // 現在のメールアドレスとパスワードの認証
    const authCheck = await validateCurrentEmailAndPassword(email, newPassword);
    // console.log(authCheck);

    // console.log("handlePasswordChange -- 5.1", authCheck.success);
    if (!authCheck.success) {
      return {
        type:"password",
        success: false,
        error: "現在のメールアドレスまたはパスワードが正しくありません。",
      };
    }

    const command = new ConfirmForgotPasswordCommand({
      ClientId: process.env.COGNITO_CLIENT_ID!,
      Username: email,
      ConfirmationCode: code,
      Password: newPassword,
      SecretHash: generateSecretHash(email),
    });

    const response = await client.send(command);
    return { success: true };
  } catch (error) {
    console.error('Error sending command:', error);
    return { type:"code", success: false, error: (error as Error).message || 'パスワードリセットに失敗しました' };
  }
};
