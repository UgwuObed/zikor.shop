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
  
 
  if (parts.length <= 2) {
    console.log('Main domain, no subdomain')
    return NextResponse.next()
  }
  
  const subdomain = parts[0]
  console.log('Subdomain detected:', subdomain)
  
  
  if (subdomain === 'www' || subdomain === 'api' || subdomain === 'admin') {
    console.log('System subdomain, skipping')
    return NextResponse.next()
  }
  

  if (url.pathname.startsWith('/store/')) {
    console.log('Already store route')
    return NextResponse.next()
  }
  

  url.pathname = `/store/${subdomain}`
  
  console.log(`Rewriting to: ${url.pathname}`)
  
  return NextResponse.rewrite(url)
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}