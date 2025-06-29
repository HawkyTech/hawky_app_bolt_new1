import { Platform } from 'react-native';
import { RazorpayOptions, RazorpayResponse, PaymentDetails } from '@/types/payment';

declare global {
  interface Window {
    Razorpay: any;
  }
}

class RazorpayService {
  private static instance: RazorpayService;
  private razorpayKey: string = 'rzp_test_1234567890'; // Replace with your actual test key

  private constructor() {}

  public static getInstance(): RazorpayService {
    if (!RazorpayService.instance) {
      RazorpayService.instance = new RazorpayService();
    }
    return RazorpayService.instance;
  }

  private loadRazorpayScript(): Promise<boolean> {
    return new Promise((resolve) => {
      if (Platform.OS !== 'web') {
        // For mobile platforms, you would use react-native-razorpay
        // For now, we'll simulate the payment
        resolve(true);
        return;
      }

      // Check if Razorpay is already loaded
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }

  public async createOrder(amount: number, currency: string = 'INR'): Promise<string> {
    try {
      // In a real app, this would be an API call to your backend
      // which would create an order with Razorpay and return the order_id
      
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate a mock order ID
      const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      return orderId;
    } catch (error) {
      console.error('Error creating Razorpay order:', error);
      throw new Error('Failed to create payment order');
    }
  }

  public async initiatePayment(
    amount: number,
    orderId: string,
    customerDetails: {
      name: string;
      email: string;
      contact: string;
    },
    onSuccess: (response: RazorpayResponse) => void,
    onFailure: (error: any) => void
  ): Promise<void> {
    try {
      if (Platform.OS !== 'web') {
        // For mobile platforms, simulate payment
        await this.simulateMobilePayment(amount, orderId, customerDetails, onSuccess, onFailure);
        return;
      }

      const scriptLoaded = await this.loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Failed to load Razorpay script');
      }

      const options: RazorpayOptions = {
        key: this.razorpayKey,
        amount: amount * 100, // Razorpay expects amount in paise
        currency: 'INR',
        name: 'Hawky',
        description: 'Order Payment',
        order_id: orderId,
        handler: (response: RazorpayResponse) => {
          onSuccess(response);
        },
        prefill: {
          name: customerDetails.name,
          email: customerDetails.email,
          contact: customerDetails.contact,
        },
        notes: {
          address: 'Hawky Order Payment',
          vendor_ids: 'multiple',
        },
        theme: {
          color: '#4CAF50',
        },
        modal: {
          ondismiss: () => {
            onFailure(new Error('Payment cancelled by user'));
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Error initiating payment:', error);
      onFailure(error);
    }
  }

  private async simulateMobilePayment(
    amount: number,
    orderId: string,
    customerDetails: any,
    onSuccess: (response: RazorpayResponse) => void,
    onFailure: (error: any) => void
  ): Promise<void> {
    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate 90% success rate
    const isSuccess = Math.random() > 0.1;
    
    if (isSuccess) {
      const mockResponse: RazorpayResponse = {
        razorpay_payment_id: `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        razorpay_order_id: orderId,
        razorpay_signature: `sig_${Math.random().toString(36).substr(2, 20)}`,
      };
      onSuccess(mockResponse);
    } else {
      onFailure(new Error('Payment failed. Please try again.'));
    }
  }

  public async verifyPayment(
    paymentId: string,
    orderId: string,
    signature: string
  ): Promise<boolean> {
    try {
      // In a real app, this would be an API call to your backend
      // which would verify the payment signature with Razorpay
      
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // For demo purposes, always return true
      // In production, you would verify the signature
      return true;
    } catch (error) {
      console.error('Error verifying payment:', error);
      return false;
    }
  }

  public createPaymentDetails(
    response: RazorpayResponse,
    amount: number,
    currency: string = 'INR'
  ): PaymentDetails {
    return {
      orderId: response.razorpay_order_id,
      paymentId: response.razorpay_payment_id,
      signature: response.razorpay_signature,
      amount,
      currency,
      status: 'success',
      timestamp: new Date().toISOString(),
    };
  }
}

export default RazorpayService.getInstance();