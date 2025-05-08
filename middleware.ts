import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const hostname = req.headers.get('host') || ''
  const url = req.nextUrl.clone()
  
  const parts = hostname.split('.')
  
  // Check if it's a subdomain of zikor.shop and not www
  if (parts.length > 2 && parts[0] !== 'www') {
    const subdomain = parts[0]
    
    // Only handle the root path
    if (req.nextUrl.pathname === '/') {
      // Rewrite to your actual store page path
      url.pathname = `/store/${subdomain}`
      return NextResponse.rewrite(url)
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/']
}