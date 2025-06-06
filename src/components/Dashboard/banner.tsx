import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import apiClient from '../../apiClient'; 
import { FiCopy, FiExternalLink, FiCheck } from 'react-icons/fi';

interface StoreInfo {
  slug: string;
  business_name: string;
}

const DashboardBanner = () => {
  const [storeInfo, setStoreInfo] = useState<StoreInfo | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStoreInfo = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await apiClient.get('/store/profile', {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
        
        if (response.data && response.data.storefront) {
          setStoreInfo({
            slug: response.data.storefront.slug,
            business_name: response.data.storefront.business_name
          });
        }
      } catch (error) {
        console.error('Error fetching store info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStoreInfo();
  }, []);

  const storeUrl = storeInfo ? `https://${storeInfo.slug}.zikor.shop` : '';

  const handleViewStore = () => {
    if (storeUrl) {
      window.open(storeUrl, '_blank');
    }
  };

  const handleCopyLink = async () => {
    if (storeUrl) {
      try {
        await navigator.clipboard.writeText(storeUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
        const textArea = document.createElement('textarea');
        textArea.value = storeUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6 text-white shadow-lg"
    >
      <div className="flex justify-between items-center">
        <div className="flex-1">
          <h1 className="text-2xl font-bold">
            Welcome back{storeInfo ? `, ${storeInfo.business_name}!` : '!'}
          </h1>
          <p className="mt-2 opacity-90">Here's what's happening with your store today.</p>
          
          {/* Store URL Display */}
          {storeInfo && (
            <div className="mt-4 bg-white bg-opacity-20 rounded-lg p-3 max-w-md">
              <p className="text-sm opacity-80 mb-1">Your store URL:</p>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium truncate flex-1">
                  {storeUrl}
                </span>
                <button
                  onClick={handleCopyLink}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded-md transition-all duration-200 flex items-center justify-center"
                  title="Copy store link"
                >
                  {copied ? (
                    <FiCheck className="text-green-300" />
                  ) : (
                    <FiCopy className="text-white" />
                  )}
                </button>
              </div>
              {copied && (
                <motion.p
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-green-300 mt-1"
                >
                  Link copied to clipboard!
                </motion.p>
              )}
            </div>
          )}
        </div>
        
        <div className="flex space-x-3">
          {/* Copy Store Link Button */}
          <button
            onClick={handleCopyLink}
            disabled={!storeInfo || loading}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {copied ? <FiCheck /> : <FiCopy />}
            <span className="hidden sm:inline">
              {copied ? 'Copied!' : 'Copy Link'}
            </span>
          </button>
          
          {/* View Store Button */}
          <button
            onClick={handleViewStore}
            disabled={!storeInfo || loading}
            className="bg-white text-purple-600 px-4 py-2 rounded-lg font-medium hover:bg-opacity-90 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiExternalLink />
            <span>View Store</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardBanner;