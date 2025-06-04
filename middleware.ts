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
  
  if (!host) {
    return NextResponse.next();
  }
  

  const cleanHost = host.split(':')[0];
  const parts = cleanHost.split('.');
  

  if (parts.length <= 2) {
    return NextResponse.next();
  }
  
  const subdomain = parts[0];
  

  if (subdomain === 'www' || subdomain === 'api' || subdomain === 'prod') {
    return NextResponse.next();
  }
  

  const url = new URL(request.nextUrl.href);
  

  url.pathname = `/store/${subdomain}${url.pathname === '/' ? '' : url.pathname}`;
  
  console.log(`🏪 Store subdomain detected: ${subdomain} -> ${url.pathname}`);
  
  return NextResponse.rewrite(url);
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
};