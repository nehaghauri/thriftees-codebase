export type Gender = 'men' | 'women';

export type Condition = 'Like New' | 'Excellent' | 'Good' | 'Gently Used';

export interface Category {
  slug: string;
  label: string;
  gender: Gender;
}

export interface Product {
  id: string;
  name: string;
  categorySlug: string;
  gender: Gender;
  /** Price in PKR */
  price: number;
  /** Original retail price in PKR, if you want to show a discount */
  originalPrice?: number;
  sizes: string[];
  /** Pieces available. 0 = sold out. 1 = one of one. */
  stock: number;
  condition: Condition;
  description: string;
  /** First image is the main one; the second is shown on hover and in the gallery */
  images: string[];
  /** ISO date (YYYY-MM-DD) */
  dateAdded: string;
  featured: boolean;
}

export interface Collection {
  id: string;
  title: string;
  blurb: string;
  tone: 'butter' | 'mint' | 'pink' | 'sky';
  productIds: string[];
}

/** What is stored in LocalStorage for the cart */
export interface CartItem {
  productId: string;
  size: string;
  quantity: number;
}

/** A cart item joined with its product, ready to render */
export interface CartLine {
  key: string;
  product: Product;
  size: string;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  size: string;
  quantity: number;
  unitPrice: number;
  image: string;
}

export interface CheckoutValues {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  instructions: string;
}

export interface Order {
  id: string;
  placedAt: string;
  customer: { fullName: string; email: string; phone: string };
  shipping: { address: string; city: string; province: string; postalCode: string; instructions: string };
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  paymentMethod: 'Cash on Delivery';
}

/** Generic row used by OrderSummary (works for cart lines and saved orders) */
export interface SummaryItem {
  id: string;
  productId: string;
  name: string;
  size: string;
  quantity: number;
  unitPrice: number;
  image: string;
}
