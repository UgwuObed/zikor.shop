import { useState, useEffect } from 'react';
import apiClient from '../apiClient';

interface StoreInfo {
  slug: string;
  business_name: string;
  logo?: string;
  id: number;
}

interface UseStoreInfoReturn {
  storeInfo: StoreInfo | null;
  loading: boolean;
  error: string | null;
  storeUrl: string;
  refreshStoreInfo: () => void;
}

export const useStoreInfo = (): UseStoreInfoReturn => {
  const [storeInfo, setStoreInfo] = useState<StoreInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStoreInfo = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        throw new Error('No access token found');
      }

      const response = await apiClient.get('/store/profile', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      
      if (response.data && response.data.storefront) {
        setStoreInfo({
          slug: response.data.storefront.slug,
          business_name: response.data.storefront.business_name,
          logo: response.data.storefront.logo,
          id: response.data.storefront.id
        });
      } else {
        throw new Error('Store information not found');
      }
    } catch (err) {
      console.error('Error fetching store info:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch store information');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStoreInfo();
  }, []);

  const storeUrl = storeInfo ? `https://${storeInfo.slug}.zikor.shop` : '';

  return {
    storeInfo,
    loading,
    error,
    storeUrl,
    refreshStoreInfo: fetchStoreInfo
  };
};