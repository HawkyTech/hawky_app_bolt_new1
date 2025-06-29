import { OrderData, CheckoutFormData, PaymentDetails } from '@/types/payment';
import { CartItem } from '@/contexts/CartContext';

class OrdersService {
  private static instance: OrdersService;
  private orders: OrderData[] = [];

  private constructor() {}

  public static getInstance(): OrdersService {
    if (!OrdersService.instance) {
      OrdersService.instance = new OrdersService();
    }
    return OrdersService.instance;
  }

  public async createOrder(
    customerDetails: CheckoutFormData,
    items: CartItem[],
    paymentDetails: PaymentDetails
  ): Promise<OrderData> {
    try {
      const orderId = `ORD_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const vendorIds = Array.from(new Set(items.map(item => item.vendorId)));
      
      const order: OrderData = {
        id: orderId,
        customerId: 'customer_123', // In real app, get from auth context
        customerDetails,
        items: items.map(item => ({
          productId: item.product.id,
          productName: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
          vendorId: item.vendorId,
          vendorName: item.vendorName,
        })),
        vendorIds,
        totalAmount: paymentDetails.amount,
        paymentDetails,
        deliveryAddress: customerDetails.deliveryAddress,
        status: 'pending',
        createdAt: new Date().toISOString(),
        estimatedDeliveryTime: this.calculateEstimatedDeliveryTime(),
      };

      // Store order (in real app, this would be saved to database)
      this.orders.push(order);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      return order;
    } catch (error) {
      console.error('Error creating order:', error);
      throw new Error('Failed to create order');
    }
  }

  public async getOrderById(orderId: string): Promise<OrderData | null> {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const order = this.orders.find(o => o.id === orderId);
      return order || null;
    } catch (error) {
      console.error('Error fetching order:', error);
      return null;
    }
  }

  public async getOrdersByCustomer(customerId: string): Promise<OrderData[]> {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return this.orders.filter(o => o.customerId === customerId);
    } catch (error) {
      console.error('Error fetching customer orders:', error);
      return [];
    }
  }

  public async updateOrderStatus(orderId: string, status: OrderData['status']): Promise<boolean> {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const orderIndex = this.orders.findIndex(o => o.id === orderId);
      if (orderIndex !== -1) {
        this.orders[orderIndex].status = status;
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating order status:', error);
      return false;
    }
  }

  private calculateEstimatedDeliveryTime(): string {
    const now = new Date();
    const deliveryTime = new Date(now.getTime() + (30 * 60 * 1000)); // 30 minutes from now
    return deliveryTime.toISOString();
  }

  // Method to get all orders (for vendor dashboard)
  public getAllOrders(): OrderData[] {
    return [...this.orders];
  }
}

export default OrdersService.getInstance();