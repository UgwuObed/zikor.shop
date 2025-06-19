export interface Product {
    id: string | number
    name: string
    main_price: number
    discount_price?: number
    quantity: number
    category_id: string | number
    category?: {
      id: string | number
      name: string
    }
    image_urls?: string[]
    description?: string
    image?: string
    created_at?: string;
  }
  
  export interface ProductTableProps {
    products: Product[]
    onRefresh: () => void
  }
  