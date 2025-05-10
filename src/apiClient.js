import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
});

apiClient.interceptors.request.use(config => {
  const cartToken = localStorage.getItem('cart_token');
  if (cartToken) {
    config.headers['X-Cart-Token'] = cartToken;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// Add interceptor to save cart token from responses
apiClient.interceptors.response.use(response => {
  if (response.data && response.data.cart && response.data.cart.cart_token) {
    localStorage.setItem('cart_token', response.data.cart.cart_token);
  }
  return response;
}, error => {
  return Promise.reject(error);
});

apiClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {

    if (error.response) {
      console.error('API Error:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
    } else if (error.request) {
      console.error('API Error: No response received', error.request);
    } else {
      console.error('API Error:', error.message);
    }
    

    return Promise.reject(error);
  }
);

export default apiClient;