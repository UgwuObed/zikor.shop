import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  
  const host = request.headers.get('host')
  
  if (!host) {
    console.log('No host header found')
    return NextResponse.next()
  }
  
  const url = request.nextUrl.clone()
  const hostname = host.split(':')[0]
  const parts = hostname.split('.')
  
  if (parts.length <= 2) {
    console.log('Main domain, no subdomain detected')
    return NextResponse.next()
  }
  
  const subdomain = parts[0]
  console.log('Subdomain detected:', subdomain)
  

  if (subdomain === 'www' || subdomain === 'api' || subdomain === 'admin' || subdomain === 'prod') {
    console.log('System subdomain, skipping')
    return NextResponse.next()
  }
  
  if (url.pathname.startsWith('/store/')) {
    console.log('Already on store route, skipping rewrite')
    return NextResponse.next()
  }
  

  if (url.pathname.startsWith('/api/') || 
      url.pathname.startsWith('/_next/') || 
      url.pathname.includes('.')) {
    console.log('API or static file, skipping')
    return NextResponse.next()
  }
  

  console.log(`Rewriting ${url.pathname} to /store/${subdomain}`)
  url.pathname = `/store/${subdomain}`
  
  return NextResponse.rewrite(url)
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}