export interface CartItem {
  uid: string;
  productId: string;
  title: string;
  number: string | null;
  price: number;
  color: string;
  colorName: string;
  size: string;
  quantity: number;
  image: string;
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  year: string | null;
  cover_image: string | null;
  is_active: boolean;
  order_index: number;
  created_at: string;
}

export interface Product {
  id: string;
  collection_id: string | null;
  number: string | null;
  title: string;
  slug: string;
  description: string | null;
  cut: string | null;
  fabric: string | null;
  price: number;
  cover_image: string | null;
  gender: string[];     // e.g., ['unisex', 'men', 'women']
  categories: string[]; // e.g., ['tops', 'accessories', 'headwear', 'cap']
  tags?: string[];       // e.g., ['archive', 'limited-edition', 'summer-2026']
  is_active: boolean;
  order_index: number;
  created_at: string;
  collection?: Collection;
  images?: ProductImage[];
  colors?: ProductColor[];
  sizes?: ProductSize[];
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  alt_text: string | null;
  order_index: number;
}

export interface ProductColor {
  id: string;
  product_id: string;
  color_name: string;
  color_hex: string | null;
  image_url: string | null;
  order_index: number;
}

export interface ProductSize {
  id: string;
  product_id: string;
  size_name: string;
  stock: number;
}

export interface JournalEntry {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  cover_image: string | null;
  date: string | null;
  is_published: boolean;
  created_at: string;
}

export interface ArchiveItem {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  year: string | null;
  cover_image: string | null;
  order_index: number;
  created_at: string;
}

export interface Order {
  id: string;
  tracking_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address: string;
  city: string | null;
  state: string | null;
  country: string;
  total_amount: number;
  currency: string;
  status: string;
  payment_reference: string | null;
  flutterwave_transaction_id: string | null;
  created_at: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  product_title: string;
  product_number: string | null;
  color: string | null;
  size: string | null;
  price: number;
  quantity: number;
}