// import { NextResponse } from 'next/server'
// import type { NextRequest } from 'next/server'
// import { auth } from "@/lib/auth"

// export default auth((req) => {
//   const isLoggedIn = !!req.auth
//   const isProtectedRoute = req.nextUrl.pathname.startsWith('/protected')

//   if (isProtectedRoute && !isLoggedIn) {
//     return NextResponse.redirect(new URL('/auth/signin', req.url))
//   }

//   return NextResponse.next()
// })

// // Read more: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
// export const config = {
//   matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
// };

import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isProtectedRoute = req.nextUrl.pathname.startsWith("/protected");

  // `req.auth.user` をセッション情報として取り扱い、必要な属性を確認
  const user = req.auth?.user;

  // ログイン済みかつ保護されたルートにアクセスする場合
  if (isProtectedRoute && isLoggedIn) {
    // 必須属性の確認
    if (!user?.family_name || !user?.email) {
      // 必須属性が不足している場合、'/auth/complete-profile' へリダイレクト
      return NextResponse.redirect(new URL("/auth/complete-profile", req.url));
    }
  } else if (isProtectedRoute && !isLoggedIn) {
    // ログインしていない場合はサインイン画面へリダイレクト
    return NextResponse.redirect(new URL("/auth/signin", req.url));
  }

  return NextResponse.next();
});

// Read more: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
