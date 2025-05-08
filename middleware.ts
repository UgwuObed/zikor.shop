// middleware.ts
import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const hostname = req.headers.get('host') || ''
  const url = req.nextUrl.clone()
  
  console.log('Middleware running for hostname:', hostname)
  console.log('Request path:', req.nextUrl.pathname)
  
  // Detect zikor.shop domain with subdomain
  if (hostname.endsWith('zikor.shop') && hostname !== 'zikor.shop' && hostname !== 'www.zikor.shop') {
    console.log('Subdomain detected in middleware')
    
    // Extract the subdomain portion
    const subdomainPart = hostname.split('.zikor.shop')[0]
    const subdomain = subdomainPart.split('.').pop()
    
    console.log('Extracted subdomain:', subdomain)
    
    // Only handle the root path
    if (req.nextUrl.pathname === '/') {
      console.log(`Rewriting to /store/${subdomain}`)
      
      // Rewrite to your actual store page path
      url.pathname = `/store/${subdomain}`
      return NextResponse.rewrite(url)
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}