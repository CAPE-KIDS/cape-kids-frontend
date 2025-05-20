import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";

type JwtPayload = {
  exp: number;
};
let redirect = false;

export function middleware(request: NextRequest) {
  if (redirect) {
    redirect = false;
    return NextResponse.next();
  }

  const token = request.cookies.get("auth_token")?.value;
  const { pathname } = request.nextUrl;
  const isPublic = pathname === "/";
  if (!token) {
    redirect = true;
    return NextResponse.redirect(new URL("/", request.url));
  }

  const decoded = jwtDecode<JwtPayload>(token);
  const isExpired = decoded.exp * 1000 < Date.now();

  if (isExpired) {
    redirect = true;
    const response = NextResponse.redirect(new URL("/", request.url), 307);
    response.cookies.set("auth_token", "", { path: "/", maxAge: 0 });
    return response;
  }

  if (token && pathname === "/") {
    redirect = true;
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|.*\\.(?:ico|png|jpg|jpeg|svg|webp|txt|xml|json)).*)",
  ],
};
