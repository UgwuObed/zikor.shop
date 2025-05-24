import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { slug } = req.query;

  try {
    if (!slug || typeof slug !== 'string') {
      return res.status(400).json({ message: 'Invalid slug parameter' });
    }

    const backendUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/store/${slug}`;
  
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