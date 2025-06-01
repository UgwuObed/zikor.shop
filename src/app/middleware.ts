import { NextResponse } from "next/server";

import { NextURL } from 'next/dist/server/web/next-url';

interface MiddlewareRequest {
  nextUrl: NextURL;
}

export function middleware(request: MiddlewareRequest) {
  const hostname = request.nextUrl.hostname; 
  const parts = hostname.split(".");
  const subdomain = parts[0];

 
  if (
    subdomain &&
    subdomain !== "www" &&
    subdomain !== "zikor" &&
    parts.length === 3
  ) {
    const url = request.nextUrl.clone();

    url.pathname = `/store/${subdomain}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}
