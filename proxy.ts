import { NextResponse, type NextRequest } from 'next/server'

const SESSION_COOKIE = 'session'

// RF-14 · with no session, redirect BEFORE the page is served, so no protected
// content flashes. This is NOT a security boundary — the API checks the session
// and ownership on every request. It is better behaviour, nothing more.
//
// In Next 16 this file convention is called "proxy" (it used to be
// "middleware"; that name is deprecated). It lives at the project root, a
// sibling of app/: inside app/ Next does not run it.
export function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl
  const signedIn = request.cookies.has(SESSION_COOKIE)
  const isAuthRoute = pathname === '/login' || pathname === '/register'
  // A session the API rejected: the cookie is still there but no longer valid,
  // and the client cannot delete an httpOnly cookie. Without this marker, /login
  // would bounce back to /cases forever — a loop. With it, the form is reachable
  // so the person can sign in again.
  const sessionExpired =
    pathname === '/login' && searchParams.has('expirada')

  if (!signedIn && !isAuthRoute) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  if (signedIn && isAuthRoute && !sessionExpired) {
    return NextResponse.redirect(new URL('/cases', request.url))
  }
  return NextResponse.next()
}

export const config = {
  // Everything except the API proxy, Next's assets and the favicon.
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
