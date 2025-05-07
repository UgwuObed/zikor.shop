import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Get slug from query params (for zikor.shop/store/[slug])
  let { slug } = req.query;

  try {
    // Check if we're on a subdomain (for [slug].zikor.shop)
    const host = req.headers.host || '';
    const subdomainMatch = host.match(/^([^.]+)\.zikor\.shop$/);
    
    // If we're on a subdomain, use that as the slug
    if (subdomainMatch && !['www', 'api'].includes(subdomainMatch[1])) {
      slug = subdomainMatch[1];
      console.log(`Detected subdomain store: ${slug}`);
    }

    if (!slug || typeof slug !== 'string') {
      return res.status(400).json({ message: 'Invalid slug parameter' });
    }

    const backendUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/store/${slug}`;
    console.log(`Fetching store data from: ${backendUrl}`);
  
    const response = await fetch(backendUrl);
    
    if (!response.ok) {
      console.error('Backend responded with error:', response.status);
      const errorData = await response.json().catch(() => ({}));
      return res.status(response.status).json({
        message: 'Error from backend',
        ...errorData
      });
    }

    const data = await response.json();
    return res.status(200).json(data);
    
  } catch (error) {
    console.error('Full error:', error);
    return res.status(500).json({ 
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}