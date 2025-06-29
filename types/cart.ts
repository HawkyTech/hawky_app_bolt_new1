export interface CartSummary {
  itemTotal: number;
  deliveryFee: number;
  platformFee: number;
  taxes: number;
  discount: number;
  finalTotal: number;
}

export interface DeliveryAddress {
  id: string;
  label: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export interface PaymentMethod {
  id: string;
  type: 'upi' | 'card' | 'cash' | 'wallet';
  label: string;
  details?: string;
  isDefault: boolean;
}

export interface OrderDetails {
  items: any[];
  deliveryAddress: DeliveryAddress;
  paymentMethod: PaymentMethod;
  summary: CartSummary;
  specialInstructions?: string;
  estimatedDeliveryTime: string;
}