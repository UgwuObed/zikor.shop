// app/storefront/page.tsx
import Store from "../../components/Store/[slug]";
import "../../app/globals.css";

export default function StorefrontPage({ searchParams }: { searchParams: URLSearchParams }) {
  const slug = searchParams.get("slug");

  if (!slug) return <div>No storefront slug provided</div>;

  return <Store slug={slug} />;
}
