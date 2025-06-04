import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host')
  
  if (!hostname) return NextResponse.next()
  
  const subdomain = hostname.split('.')[0]
  
  console.log(`🌐 Host: ${hostname}, Subdomain: ${subdomain}`)
  

  if (subdomain && 
      subdomain !== 'www' && 
      subdomain !== 'zikor' &&
      subdomain !== 'production' && 
      !hostname.includes('elasticbeanstalk.com') &&
      !hostname.includes('localhost')) {
    
    const url = request.nextUrl.clone()
    url.pathname = `/store/${subdomain}`
    
    console.log(`🔄 Rewriting to: ${url.pathname}`)
    
    return NextResponse.rewrite(url)
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}