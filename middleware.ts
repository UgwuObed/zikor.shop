import { NextResponse } from 'next/server';

interface RequestHeaders {
  get(name: string): string | null;
}

interface NextRequest {
  headers: RequestHeaders;
  nextUrl: URL;
}

export function middleware(request: NextRequest): NextResponse {
  const host = request.headers.get('host');
  console.log('🔍 Middleware - Host:', host);
  console.log('🔍 Middleware - URL:', request.nextUrl.href);
  console.log('🔍 Middleware - Pathname:', request.nextUrl.pathname);
  
  if (!host) {
    console.log('❌ No host header found');
    return NextResponse.next();
  }
  
  const cleanHost = host.split(':')[0];
  const parts = cleanHost.split('.');
  console.log('🔍 Host parts:', parts);
  
  if (parts.length <= 2) {
    console.log('✅ Main domain, no subdomain');
    return NextResponse.next();
  }
  
  const subdomain = parts[0];
  console.log('🔍 Subdomain detected:', subdomain);
  
  if (subdomain === 'www' || subdomain === 'api' || subdomain === 'prod') {
    console.log('✅ Ignoring reserved subdomain:', subdomain);
    return NextResponse.next();
  }
  
  const url = new URL(request.nextUrl.href);
  const originalPathname = url.pathname;
  
  // Don't rewrite if already going to /store/[slug]
  if (url.pathname.startsWith('/store/')) {
    console.log('✅ Already a store route, skipping rewrite');
    return NextResponse.next();
  }
  
  url.pathname = `/store/${subdomain}${url.pathname === '/' ? '' : url.pathname}`;
  
  console.log(`🏪 REWRITE: ${originalPathname} -> ${url.pathname}`);
  console.log(`🏪 Full rewrite URL: ${url.href}`);
  
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};