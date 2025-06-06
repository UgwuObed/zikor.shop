// Create this file: pages/store/[slug].tsx
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { getSubdomainClient } from '../../../lib/subdomain'

export default function StoreTestPage() {
  const router = useRouter()
  const { slug } = router.query
  const [clientSubdomain, setClientSubdomain] = useState<string | null>(null)
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setClientSubdomain(getSubdomainClient())
    }
  }, [])
  
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Store Page Test</h1>
      <div style={{ background: '#f0f0f0', padding: '15px', borderRadius: '5px', marginBottom: '10px' }}>
        <h3>Route Information:</h3>
        <p><strong>Slug from URL:</strong> {slug || 'undefined'}</p>
        <p><strong>Client Subdomain:</strong> {clientSubdomain || 'undefined'}</p>
        <p><strong>Router pathname:</strong> {router.pathname}</p>
        <p><strong>Router asPath:</strong> {router.asPath}</p>
        <p><strong>Full URL:</strong> {typeof window !== 'undefined' ? window.location.href : 'SSR'}</p>
      </div>
      
      <div style={{ background: '#e8f5e8', padding: '15px', borderRadius: '5px' }}>
        <h3>Expected Behavior:</h3>
        <p>When you visit <code>classicpro.zikor.shop</code>, the middleware should:</p>
        <ol>
          <li>Detect subdomain: "classicpro"</li>
          <li>Rewrite to: <code>/store/classicpro</code></li>
          <li>Show slug: "classicpro"</li>
        </ol>
      </div>
      
      {slug && (
        <div style={{ background: '#fff3cd', padding: '15px', borderRadius: '5px', marginTop: '10px' }}>
          <p>✅ Success! Store slug detected: <strong>{slug}</strong></p>
          <p>Your store routing is working. You can now replace this with your actual StorefrontPage component.</p>
        </div>
      )}
    </div>
  )
}