// pages/store/[slug].tsx
import { GetServerSideProps } from 'next'
import StorefrontPage from '../../components/Store/[slug]'
import { getSubdomain } from '../../../lib/subdomain'

interface StorePageProps {
  slug: string
}

export default function StorePage({ slug }: StorePageProps) {
  return <StorefrontPage slug={slug} />
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.params!
  const { req } = context
  
  console.log('=== SERVER SIDE PROPS DEBUG ===')
  console.log('URL slug from params:', slug)
  console.log('Host header:', req.headers.host)
  
  // Try to get subdomain from request headers
  const subdomainFromHeaders = getSubdomain(req)
  console.log('Subdomain from headers:', subdomainFromHeaders)
  
  // Use slug from URL params, fallback to subdomain if needed
  const effectiveSlug = slug || subdomainFromHeaders
  
  if (!effectiveSlug) {
    return {
      notFound: true,
    }
  }
  
  console.log('Effective slug for SSR:', effectiveSlug)
  
  return {
    props: {
      slug: effectiveSlug,
    },
  }
}