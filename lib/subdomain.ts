interface RequestLike {
  headers: {
    host?: string;
    'x-forwarded-host'?: string;
  };
}

export function getSubdomain(req: RequestLike): string | null {
  const host = req.headers.host || req.headers['x-forwarded-host'];
  
  if (!host) return null;
  
  const cleanHost = host.split(':')[0];
  const parts = cleanHost.split('.');
  
  if (parts.length <= 2) return null;
  
  const subdomain = parts[0];
  
  if (subdomain === 'www' || subdomain === 'api' || subdomain === 'prod') {
    return null;
  }
  
  return subdomain;
}

export function getSubdomainFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const parts = urlObj.hostname.split('.');
    
    if (parts.length <= 2) return null;
    
    const subdomain = parts[0];
    
    if (subdomain === 'www' || subdomain === 'api' || subdomain === 'prod') {
      return null;
    }
    
    return subdomain;
  } catch {
    return null;
  }
}


export function getSubdomainClient(): string | null {
  if (typeof window === 'undefined') return null;
  
  return getSubdomainFromUrl(window.location.href);
}


export function getSubdomainFromHostname(hostname: string): string | null {
  const parts = hostname.split('.');
  
  if (parts.length <= 2) return null;
  
  const subdomain = parts[0];
  
  if (subdomain === 'www' || subdomain === 'api' || subdomain === 'prod') {
    return null;
  }
  
  return subdomain;
}