export interface Category {
  id: string | number
  name: string
}

export interface Product {
  id: string | number
  name: string
  main_price: number
  discount_price?: number
  quantity: number
  description?: string
  image_urls?: string[]
  category?: Category
}

export interface ProductTableProps {
  products: Product[]
  onRefresh?: () => void
}
