import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const privatePaths = ["/homePage", "/listCard"];
const authPaths = ["/login", "/register"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const sessionToken = req.cookies.get("sessionToken")?.value;
  if (privatePaths.some((path) => pathname.startsWith(path)) && !sessionToken) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  // Đăng nhập rồi thì không cho vào login/register nữa
  if (authPaths.some((path) => pathname.startsWith(path)) && sessionToken) {
    return NextResponse.redirect(new URL("/homePage", req.url));
  }

  return NextResponse.next(); // Tiếp tục nếu người dùng có token hoặc đang ở trang /login
}

// Chỉ định các đường dẫn mà middleware sẽ được áp dụng
export const config = {
  matcher: ["/login", "/register", "/homePage/:path*", "/listCard"],
};
