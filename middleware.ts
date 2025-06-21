import { NextRequest, NextResponse } from "next/server"

// middleware.ts
export function middleware(request: NextRequest) {
  const token = request.cookies.get('catequesis_token')
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth')
  const isProtectedPage = request.nextUrl.pathname.startsWith('/dashboard')

  if (isProtectedPage && !token) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
}