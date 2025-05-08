export function getSubdomain(host) {
    const hostname = host.split(':')[0];
    
    const parts = hostname.split('.');
    if (parts.length > 2) {
      return parts[0]; 
    }
    
    return null; 
  }