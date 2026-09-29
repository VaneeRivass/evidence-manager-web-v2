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
  const { pathname } = request.nextUrl
  const signedIn = request.cookies.has(SESSION_COOKIE)
  const isAuthRoute = pathname === '/login' || pathname === '/register'

  if (!signedIn && !isAuthRoute) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  if (signedIn && isAuthRoute) {
    return NextResponse.redirect(new URL('/cases', request.url))
  }
  return NextResponse.next()
}

export const config = {
  // Everything except the API proxy, Next's assets and the favicon.
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
