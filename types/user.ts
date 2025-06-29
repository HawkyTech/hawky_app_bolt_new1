export interface User {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  role: 'consumer' | 'vendor';
  avatar?: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  location?: {
    latitude: number;
    longitude: number;
    address: string;
    timestamp: string;
  } | null;
}

export interface Consumer extends User {
  role: 'consumer';
  preferences: {
    favoriteCategories: string[];
    dietaryRestrictions: string[];
    maxDistance: number;
  };
  addresses: Address[];
  orderHistory: Order[];
}

export interface Vendor extends User {
  role: 'vendor';
  businessInfo: {
    businessName: string;
    category: string;
    description: string;
    businessLicense?: string;
    gstNumber?: string;
  };
  location: {
    latitude: number;
    longitude: number;
    address: string;
    isActive: boolean;
  };
  products: Product[];
  orders: Order[];
  rating: number;
  totalOrders: number;
  isApproved: boolean;
}

export interface Address {
  id: string;
  label: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  isAvailable: boolean;
  preparationTime: number;
}

export interface Order {
  id: string;
  consumerId: string;
  vendorId: string;
  products: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  deliveryAddress: Address;
  orderDate: string;
  estimatedDeliveryTime?: string;
  notes?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  specialInstructions?: string;
}