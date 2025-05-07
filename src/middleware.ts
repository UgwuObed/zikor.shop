import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const hostname = request.headers.get('host') || '';
  
  // Check if we're on a store subdomain
  const storeSubdomainMatch = hostname.match(/^([^.]+)\.zikor\.shop$/);
  
  // Skip middleware for the main domain or special subdomains
  if (!storeSubdomainMatch || 
      ['www', 'api'].includes(storeSubdomainMatch[1])) {
    return NextResponse.next();
  }
  
  // Get the store slug from the subdomain
  const storeSlug = storeSubdomainMatch[1];
  
  // Rewrite the request to the store page 
  // But keep the original URL in the browser
  url.pathname = `/store/${storeSlug}${url.pathname === '/' ? '' : url.pathname}`;
  
  // Return rewritten URL while preserving the URL in the browser
  return NextResponse.rewrite(url);
}

// Only run the middleware on specific paths
export const config = {
  matcher: [
    // Skip Next.js internal paths
    '/((?!_next/|_vercel/|favicon.ico).*)',
  ],
};