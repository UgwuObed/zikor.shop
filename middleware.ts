import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  console.log('🚨 MIDDLEWARE IS RUNNING! 🚨')
  console.log('Host:', request.headers.get('host'))
  console.log('URL:', request.url)
  console.log('Pathname:', request.nextUrl.pathname)
  
  const host = request.headers.get('host')
  
  if (!host) {
    console.log('No host header found')
    return NextResponse.next()
  }
  
  const url = request.nextUrl.clone()
  const hostname = host.split(':')[0]
  const parts = hostname.split('.')
  
  console.log('Host parts:', parts)
  console.log('Full hostname:', hostname)
  
  // Check if this is a subdomain (more than 2 parts means subdomain exists)
  if (parts.length <= 2) {
    console.log('Main domain, no subdomain detected')
    return NextResponse.next()
  }
  
  const subdomain = parts[0]
  console.log('Subdomain detected:', subdomain)
  
  // Skip system subdomains
  if (subdomain === 'www' || subdomain === 'api' || subdomain === 'admin') {
    console.log('System subdomain, skipping')
    return NextResponse.next()
  }
  
  // Skip if already on store route
  if (url.pathname.startsWith('/store/')) {
    console.log('Already on store route, skipping rewrite')
    return NextResponse.next()
  }
  
  // Skip API routes and static files
  if (url.pathname.startsWith('/api/') || 
      url.pathname.startsWith('/_next/') || 
      url.pathname.includes('.')) {
    console.log('API or static file, skipping')
    return NextResponse.next()
  }
  
  // Rewrite subdomain to store route
  console.log(`Rewriting ${url.pathname} to /store/${subdomain}`)
  url.pathname = `/store/${subdomain}`
  
  return NextResponse.rewrite(url)
}

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