// app/middleware.ts
import { NextResponse } from "next/server";

export function middleware(request: { nextUrl: { hostname: any; clone: () => any; }; }) {
  const hostname = request.nextUrl.hostname; // e.g. theirslug.zikor.shop
  const subdomain = hostname.split(".")[0];

  // Ignore main domain and www
  if (subdomain && subdomain !== "www" && subdomain !== "zikor") {
    // Rewrite to /storefront with slug query param
    const url = request.nextUrl.clone();
    url.pathname = "/storefront";
    url.searchParams.set("slug", subdomain);
    return NextResponse.rewrite(url);
  }

  // Continue for main domain
  return NextResponse.next();
}
