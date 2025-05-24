export function getSubdomain(hostname: string): string | null {
  // Remove protocol if present
  const cleanHostname = hostname.replace(/^https?:\/\//, '');
  
  // Split by dots
  const parts = cleanHostname.split('.');
  
  // For development (localhost)
  if (cleanHostname.includes('localhost') || cleanHostname.includes('127.0.0.1')) {
    return null;
  }
  
  // For your domain structure: subdomain.zikor.shop
  if (parts.length >= 3 && parts[parts.length - 2] === 'zikor' && parts[parts.length - 1] === 'shop') {
    const subdomain = parts[0];
    
    // Exclude common non-store subdomains
    if (['www', 'api', 'admin', 'mail', 'ftp'].includes(subdomain.toLowerCase())) {
      return null;
    }
    
    return subdomain;
  }
  
  return null;
}

// Helper function to construct subdomain URLs
export function buildSubdomainUrl(slug: string, path: string = ''): string {
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://zikor.shop' 
    : 'http://localhost:3000';
    
  if (process.env.NODE_ENV === 'production') {
    return `https://${slug}.zikor.shop${path}`;
  } else {
    // For development, use path-based routing
    return `${baseUrl}/store/${slug}${path}`;
  }
}