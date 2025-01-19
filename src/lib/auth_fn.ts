// ユーザ認証
export const signInUser = async (email: string, password: string) => {
  // const secretHash = generateSecretHash(email);
  // const command = new InitiateAuthCommand({
  //   ClientId: process.env.COGNITO_CLIENT_ID!,
  //   AuthFlow: "USER_PASSWORD_AUTH",
  //   AuthParameters: {
  //     USERNAME: email,
  //     PASSWORD: password,
  //     SECRET_HASH: secretHash,
  //   },
  // });
  return {
    email,
    username: "Tanaka Ichiro",
  };
};
