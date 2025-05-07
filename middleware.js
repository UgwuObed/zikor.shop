// middleware.js
import { NextResponse } from 'next/server'

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}

export function middleware(request) {
  const url = request.nextUrl.clone()
  const hostname = request.headers.get('host')
  
  // Skip if it's the main domain or already an API request
  if (
    hostname === 'zikor.shop' || 
    hostname === 'www.zikor.shop' ||
    url.pathname.startsWith('/api/')
  ) {
    return NextResponse.next()
  }

  // Extract subdomain (remove port if present)
  const subdomain = hostname
    .replace('.zikor.shop', '')
    .replace(/:.*$/, '')

  // Rewrite to your existing storefront page
  url.pathname = `/store/${subdomain}`
  return NextResponse.rewrite(url)
}