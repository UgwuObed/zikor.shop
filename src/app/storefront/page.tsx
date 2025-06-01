import Store from "../../components/Store/[slug]";
import "../../app/globals.css";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function StorefrontPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;

  if (!slug) return <div>No storefront slug provided</div>;

  return <Store slug={slug} />;
}