import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";

type JwtPayload = {
  exp: number;
};

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  const { pathname } = request.nextUrl;

  const isPublic = pathname === "/" || pathname.startsWith("/preview");

  if (!token) {
    if (isPublic) return NextResponse.next();
    return NextResponse.redirect(new URL("/", request.url));
  }

  try {
    const decoded = jwtDecode<JwtPayload>(token);
    const isExpired = decoded.exp * 1000 < Date.now();

    if (isExpired) {
      const response = NextResponse.redirect(new URL("/", request.url));
      response.cookies.set("auth_token", "", { path: "/", maxAge: 0 });
      return response;
    }

    if (pathname === "/") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
  } catch {
    const response = NextResponse.redirect(new URL("/", request.url));
    response.cookies.set("auth_token", "", { path: "/", maxAge: 0 });
    return response;
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|.*\\.(?:ico|png|jpg|jpeg|svg|webp|txt|xml|json)).*)",
  ],
};
