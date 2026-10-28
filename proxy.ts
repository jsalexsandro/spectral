import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const protectedPrefixes = ["/app", "/platform"]

function hasSessionCookie(request: NextRequest) {
  return (
    request.cookies.has("authjs.session-token") ||
    request.cookies.has("__Secure-authjs.session-token")
  )
}

export function proxy(request: NextRequest) {
  const { nextUrl } = request

  const isProtected = protectedPrefixes.some(
    (prefix) =>
      nextUrl.pathname === prefix ||
      nextUrl.pathname.startsWith(`${prefix}/`),
  )

  if (isProtected && !hasSessionCookie(request)) {
    const loginUrl = new URL("/login", nextUrl)
    loginUrl.searchParams.set(
      "callbackUrl",
      `${nextUrl.pathname}${nextUrl.search}`,
    )
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/app/:path*", "/platform/:path*"],
}
