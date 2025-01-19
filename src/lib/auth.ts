import NextAuth from "next-auth";
import CognitoProvider from "next-auth/providers/cognito";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";
import { signInUser } from "@/lib/auth_fn";

export const config = {
  theme: {
    logo: "https://next-auth.js.org/img/logo/logo-sm.png",
  },
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "jsmith@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, request) {
        try {
          // console.log("authorize (S) ************** ");
          const userResponse = await signInUser(
            credentials.email as string,
            credentials.password as string
          );
          // console.log(userResponse);
          // if (userResponse.AuthenticationResult) {
          //   // console.log("authorize 1 ********** ");
          //   const attributes = await getUserAttributesData(
          //     credentials.email as string
          //   );
          //   // console.log("authorize 2 ********** ");
          //   return attributes;
          // }
          return userResponse;
        } catch (error) {
          console.error("Error in authorize: ", error);
          return null;
        }
      },
    }),
  ],
  basePath: "/api/auth",
  callbacks: {
    async jwt({ token, trigger, session, user }) {
      // console.log(`jwt ======================== ${trigger}`);
      // if (trigger === "update" && session) {
      //   // console.log("jwt trigger(S) --------------------------------------");
      //   // console.log(session);
      //   // token.family_name = session.family_name;
      //   // token.given_name = session.given_name;
      //   // token.family_name_furigana = session.family_name_furigana;
      //   // token.given_name_furigana = session.given_name_furigana;
      //   // token.nickname = session.nickname;
      //   // token.birthdate = session.birthdate;
      //   // token.gender = session.gender;
      //   // token.phone_number = session.phone_number;
      //   // token.postal_code = session.postal_code;
      //   // token.region = session.region;
      //   // token.locality = session.locality;
      //   // token.street_address = session.street_address;
      //   // token.building_name = session.building_name;
      //   // token = {
      //   //   ...token,
      //   //   ...session, // Make sure to spread all fields you want to update
      //   // };
      //   token = { ...token, ...session.user };
      // } else {
      //   if (user) {
      //     const attributes = await getUserAttributes(user.email!);
      //     if (attributes) {
      //       token = {
      //         ...token,
      //         id: attributes["sub"],
      //         email: attributes["email"],
      //         family_name: attributes["family_name"],
      //         given_name: attributes["given_name"],
      //         given_name_furigana: attributes["custom:given_name_furigana"],
      //         family_name_furigana: attributes["custom:family_name_furigana"],
      //         nickname: attributes["nickname"],
      //         birthdate: attributes["birthdate"],
      //         gender: attributes["gender"],
      //         phone_number: attributes["phone_number"],
      //         postal_code: attributes["custom:postal_code"],
      //         region: attributes["custom:region"],
      //         locality: attributes["custom:locality"],
      //         street_address: attributes["custom:street_address"],
      //         building_name: attributes["custom:building_name"],
      //         email_org: attributes["custom:email_org"],
      //         uuid: attributes["custom:uuid"],
      //         role: attributes["custom:role"] || "user",
      //       };
      //       // token.id = attributes["sub"];
      //       // token.email = attributes["email"];
      //       // token.family_name = attributes["family_name"];
      //       // token.given_name = attributes["given_name"];
      //       // token.given_name_furigana = attributes["custom:given_name_furigana"];
      //       // token.family_name_furigana =
      //       //   attributes["custom:family_name_furigana"];
      //       // token.nickname = attributes["nickname"];
      //       // token.birthdate = attributes["birthdate"];
      //       // token.gender = attributes["gender"];
      //       // token.phone_number = attributes["phone_number"];
      //       // token.postal_code = attributes["custom:postal_code"];
      //       // token.region = attributes["custom:region"];
      //       // token.locality = attributes["custom:locality"];
      //       // token.street_address = attributes["custom:street_address"];
      //       // token.building_name = attributes["custom:building_name"];
      //       // token.role = attributes["custom:role"] || "user";
      //     }
      //   }
      // }

      return token;
    },

    async session({ session, token, trigger, newSession }) {
      // console.log(`session ========================= ${trigger}`);
      // if (newSession) {
      //   // console.log("session trigger=update 0000000000000000");
      //   // console.log(newSession);
      //   session.user = { ...session.user, ...newSession };
      //   // session.user.family_name = newSession.family_name;
      //   // session.user.given_name = newSession.given_name;
      //   // session.user.family_name_furigana = newSession.family_name_furigana;
      //   // session.user.given_name_furigana = newSession.given_name_furigana;
      //   // session.user.nickname = newSession.nickname;
      //   // session.user.birthdate = newSession.birthdate;
      //   // session.user.gender = newSession.gender;
      //   // session.user.phone_number = newSession.phone_number;
      //   // session.user.postal_code = newSession.postal_code;
      //   // session.user.region = newSession.region;
      //   // session.user.locality = newSession.locality;
      //   // session.user.street_address = newSession.street_address;
      //   // session.user.building_name = newSession.building_name;
      // } else {
      //   session.user.id = token.id as string;
      //   session.user.email = token.email as string;
      //   session.user.family_name = token.family_name as string;
      //   session.user.given_name = token.given_name as string;
      //   session.user.given_name_furigana = token.given_name_furigana as string;
      //   session.user.family_name_furigana =
      //     token.family_name_furigana as string;
      //   session.user.nickname = token.nickname as string;
      //   session.user.birthdate = token.birthdate as string;
      //   session.user.gender = token.gender as string;
      //   session.user.phone_number = token.phone_number as string;
      //   session.user.postal_code = token.postal_code as string;
      //   session.user.region = token.region as string;
      //   session.user.locality = token.locality as string;
      //   session.user.street_address = token.street_address as string;
      //   session.user.building_name = token.building_name as string;
      //   session.user.email_org = token.email_org as string;
      //   session.user.uuid = token.uuid as string;
      //   session.user.role = token.role as string;
      // }
      return session;
    },

    async redirect({ url, baseUrl }) {
      try {
        const allowedHosts = process.env.ALLOWED_HOSTS?.split(",");
        // console.log('Allowed Hosts:', allowedHosts);
        // console.log('Redirect URL:', url);
        // console.log('Base URL:', baseUrl);

        if (url === "signOut") {
          const logoutEndpointUrl =
            process.env.COGNITO_LOGOUT_ENDPOINT_URL || "";
          const params = new URLSearchParams({
            client_id: process.env.COGNITO_CLIENT_ID || "",
            logout_uri: `${process.env.APP_URI}/logout`,
            response_type: "code",
          });
          // console.log(
          //   "SignOut Redirect URL:",
          //   `${logoutEndpointUrl}?${params.toString()}`
          // );
          return `${logoutEndpointUrl}?${params.toString()}`;
        }

        const urlObj = new URL(url);

        if (url.startsWith(baseUrl)) return url;

        if (url.startsWith("/")) return new URL(url, baseUrl).toString();

        if (allowedHosts?.includes(urlObj.origin)) {
          // console.log("Allowed Host Redirect URL:", url);
          return url;
        }

        // console.log('Default Redirect URL:', baseUrl);
        return baseUrl;
      } catch (error) {
        console.error("Error in redirect callback:", error);
        return baseUrl;
      }
    },
  },
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    newUser: undefined,
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut, unstable_update } =
  NextAuth(config);
