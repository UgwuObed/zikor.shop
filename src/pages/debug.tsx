// pages/debug.tsx
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { getSubdomainClient } from '../../lib/subdomain'

export default function DebugPage() {
  const router = useRouter()
  const [debugInfo, setDebugInfo] = useState<any>({})
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const info = {
        hostname: window.location.hostname,
        href: window.location.href,
        pathname: window.location.pathname,
        subdomain: getSubdomainClient(),
        routerQuery: router.query,
        routerPathname: router.pathname,
        routerAsPath: router.asPath,
      }
      setDebugInfo(info)
      console.log('Debug info:', info)
    }
  }, [router])
  
  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>Debug Information</h1>
      <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '5px' }}>
        {JSON.stringify(debugInfo, null, 2)}
      </pre>
    </div>
  )
}