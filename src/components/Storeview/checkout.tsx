import { useState } from 'react';

interface CheckoutFormProps {
  cartId: number;
  onSuccess: () => void;
  themeColor?: string;
}

const CheckoutForm = ({ cartId, onSuccess, themeColor = '#6366f1' }: CheckoutFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await fetch('/api/cart/buyer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          cart_id: cartId
        })
      });

      if (!response.ok) {
        throw new Error(await response.text() || 'Failed to save buyer information');
      }

      onSuccess();
    } catch (error) {
      console.error('Error saving buyer info:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
      <div className="mb-4">
        <label htmlFor="name" className="block mb-2 font-medium">Full Name</label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          required
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-opacity-50"
          style={{
            borderColor: themeColor,
            boxShadow: `0 0 0 2px ${themeColor}`
          }}
        />
      </div>
      
      <div className="mb-4">
        <label htmlFor="phone" className="block mb-2 font-medium">Phone Number</label>
        <input
          type="tel"
          id="phone"
          value={formData.phone}
          onChange={(e) => setFormData({...formData, phone: e.target.value})}
          required
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-opacity-50"
          style={{
            borderColor: themeColor,
            boxShadow: `0 0 0 2px ${themeColor}`
          }}
        />
      </div>
      
      <div className="mb-6">
        <label htmlFor="email" className="block mb-2 font-medium">Email (Optional)</label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-opacity-50"
          style={{
            borderColor: themeColor,
            boxShadow: `0 0 0 2px ${themeColor}`
          }}
        />
      </div>
      
      {error && (
        <div className="mb-4 p-3 text-red-600 bg-red-50 rounded-lg">
          {error}
        </div>
      )}
      
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 px-4 rounded-lg font-medium text-white transition-colors"
        style={{
          backgroundColor: themeColor,
          opacity: isSubmitting ? 0.7 : 1,
          cursor: isSubmitting ? 'not-allowed' : 'pointer'
        }}
      >
        {isSubmitting ? 'Processing...' : 'Proceed to Payment'}
      </button>
    </form>
  );
};

export default CheckoutForm;