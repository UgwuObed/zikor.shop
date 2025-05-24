// app/storefront/page.tsx
"use client"
import { useSearchParams } from "next/navigation";
import Store from "../../components/Store/[slug]";
import "../../app/globals.css";

export interface StoreProps {
  slug: string;
}

export default function StorefrontPage() {
  const searchParams = useSearchParams();
  const slug = searchParams?.get("slug");

  if (!slug) return <div>No storefront slug provided</div>;

  // Pass the slug to the Store component
  return <Store slug={slug} />;
}
