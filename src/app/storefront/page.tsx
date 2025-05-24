// app/storefront/page.tsx
import Store from "../../components/Store/[slug]";
import "../../app/globals.css";

export default function StorefrontPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const slug = Array.isArray(searchParams.slug) ? searchParams.slug[0] : searchParams.slug;

  if (!slug) return <div>No storefront slug provided</div>;

  return <Store slug={slug} />;
}

