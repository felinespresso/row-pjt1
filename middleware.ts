import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
export { auth as middleware } from "./auth";

// export function middleware(request:NextRequest) {
//     const isLogin = false;
//     if(!isLogin) {
//         return NextResponse.redirect(new URL ("/login-signup", request.url));
//     }
// }

// export const config = {
//     matcher: [""],
// }
