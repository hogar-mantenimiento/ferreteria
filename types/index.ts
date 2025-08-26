export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
}

export interface Product {
  id: string;
  name: string;
  code: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  images: string[];
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

export interface StoreConfig {
  storeName: string;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  popups: PopupConfig[];
}

export interface PopupConfig {
  id: string;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'success' | 'promotion';
  enabled: boolean;
  showOnce: boolean;
  delay: number; // in milliseconds
  position: 'center' | 'top' | 'bottom';
  buttonText: string;
  buttonAction: 'close' | 'redirect';
  redirectUrl?: string;
}

export interface PaymentData {
  id: string;
  status: string;
  transaction_amount: number;
  currency_id: string;
  payment_method_id: string;
  payer: {
    email: string;
  };
  date_created: string;
  date_approved?: string;
}

export interface SellerApplication {
  id: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dni: string;
    birthDate: string;
  };
  businessInfo: {
    businessName: string;
    businessType: 'individual' | 'company';
    cuit: string;
    address: string;
    city: string;
    province: string;
    postalCode: string;
  };
  experience: {
    hasExperience: boolean;
    yearsExperience?: number;
    previousWork?: string;
    specialties: string[];
  };
  motivation: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}