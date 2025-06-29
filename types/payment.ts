export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  notes: {
    address: string;
    vendor_ids: string;
  };
  theme: {
    color: string;
  };
  modal: {
    ondismiss: () => void;
  };
}

export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface PaymentDetails {
  orderId: string;
  paymentId: string;
  signature: string;
  amount: number;
  currency: string;
  status: 'success' | 'failed' | 'pending';
  timestamp: string;
}

export interface CheckoutFormData {
  customerName: string;
  phoneNumber: string;
  email: string;
  deliveryAddress: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    landmark?: string;
  };
  specialInstructions?: string;
}

export interface OrderData {
  id: string;
  customerId: string;
  customerDetails: CheckoutFormData;
  items: any[];
  vendorIds: string[];
  totalAmount: number;
  paymentDetails: PaymentDetails;
  deliveryAddress: CheckoutFormData['deliveryAddress'];
  status: 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
  createdAt: string;
  estimatedDeliveryTime: string;
}