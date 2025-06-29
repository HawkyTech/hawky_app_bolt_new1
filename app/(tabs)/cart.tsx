import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  FlatList,
  Modal,
} from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, Trash2, Plus, Minus, MapPin, Clock, CreditCard, Truck, Tag, ShoppingBag, CircleAlert as AlertCircle, CheckCircle } from 'lucide-react-native';
import { useCart } from '@/contexts/CartContext';
import { CartItem } from '@/contexts/CartContext';
import CheckoutForm from '@/components/CheckoutForm';
import { CheckoutFormData, PaymentDetails } from '@/types/payment';
import RazorpayService from '@/services/razorpay';
import OrdersService from '@/services/orders';

export default function CartScreen() {
  const { items, totalItems, totalAmount, updateQuantity, removeFromCart, clearCart } = useCart();
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderDetails, setOrderDetails] = useState<any>(null);

  // Group items by vendor
  const itemsByVendor = items.reduce((acc, item) => {
    if (!acc[item.vendorId]) {
      acc[item.vendorId] = {
        vendorName: item.vendorName,
        items: [],
        subtotal: 0,
      };
    }
    acc[item.vendorId].items.push(item);
    acc[item.vendorId].subtotal += item.product.price * item.quantity;
    return acc;
  }, {} as Record<string, { vendorName: string; items: CartItem[]; subtotal: number }>);

  const deliveryFee = 25; // Base delivery fee
  const platformFee = 5;
  const taxes = Math.round((totalAmount + deliveryFee + platformFee) * 0.05); // 5% tax
  const finalTotal = totalAmount + deliveryFee + platformFee + taxes;

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      Alert.alert(
        'Remove Item',
        'Are you sure you want to remove this item from cart?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Remove', style: 'destructive', onPress: () => removeFromCart(itemId) },
        ]
      );
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

  const handleRemoveItem = (itemId: string, itemName: string) => {
    Alert.alert(
      'Remove Item',
      `Remove ${itemName} from cart?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => removeFromCart(itemId) },
      ]
    );
  };

  const handleClearCart = () => {
    Alert.alert(
      'Clear Cart',
      'Are you sure you want to remove all items from cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear All', style: 'destructive', onPress: clearCart },
      ]
    );
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      Alert.alert('Empty Cart', 'Please add items to cart before checkout');
      return;
    }
    setShowCheckoutModal(true);
  };

  const handleCheckoutSubmit = async (formData: CheckoutFormData) => {
    setIsProcessingPayment(true);
    
    try {
      // Create Razorpay order
      const orderId = await RazorpayService.createOrder(finalTotal);
      
      // Initiate payment
      await RazorpayService.initiatePayment(
        finalTotal,
        orderId,
        {
          name: formData.customerName,
          email: formData.email,
          contact: formData.phoneNumber,
        },
        async (response) => {
          // Payment successful
          try {
            // Verify payment
            const isVerified = await RazorpayService.verifyPayment(
              response.razorpay_payment_id,
              response.razorpay_order_id,
              response.razorpay_signature
            );

            if (isVerified) {
              // Create payment details
              const paymentDetails: PaymentDetails = RazorpayService.createPaymentDetails(
                response,
                finalTotal
              );

              // Create order in database
              const order = await OrdersService.createOrder(
                formData,
                items,
                paymentDetails
              );

              setOrderDetails(order);
              setOrderSuccess(true);
              setShowCheckoutModal(false);
              clearCart();
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (error) {
            console.error('Error processing successful payment:', error);
            Alert.alert('Error', 'Payment successful but order creation failed. Please contact support.');
          } finally {
            setIsProcessingPayment(false);
          }
        },
        (error) => {
          // Payment failed
          console.error('Payment failed:', error);
          Alert.alert('Payment Failed', error.message || 'Payment was unsuccessful. Please try again.');
          setIsProcessingPayment(false);
        }
      );
    } catch (error) {
      console.error('Error initiating payment:', error);
      Alert.alert('Error', 'Failed to initiate payment. Please try again.');
      setIsProcessingPayment(false);
    }
  };

  const handleOrderSuccessClose = () => {
    setOrderSuccess(false);
    setOrderDetails(null);
    router.replace('/(tabs)');
  };

  const renderCartItem = ({ item }: { item: CartItem }) => (
    <View style={styles.cartItem}>
      {item.product.image && (
        <Image source={{ uri: item.product.image }} style={styles.itemImage} />
      )}
      <View style={styles.itemInfo}>
        <View style={styles.itemHeader}>
          <Text style={styles.itemName} numberOfLines={1}>{item.product.name}</Text>
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => handleRemoveItem(item.id, item.product.name)}
          >
            <Trash2 size={16} color="#FF3B30" />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.itemDescription} numberOfLines={1}>
          {item.product.description}
        </Text>
        
        <View style={styles.itemFooter}>
          <Text style={styles.itemPrice}>₹{item.product.price}</Text>
          
          <View style={styles.quantityControls}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => handleQuantityChange(item.id, item.quantity - 1)}
            >
              <Minus size={16} color="#4CAF50" />
            </TouchableOpacity>
            
            <Text style={styles.quantityText}>{item.quantity}</Text>
            
            <TouchableOpacity
              style={[styles.quantityButton, styles.increaseButton]}
              onPress={() => handleQuantityChange(item.id, item.quantity + 1)}
            >
              <Plus size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
        
        <Text style={styles.itemTotal}>Total: ₹{item.product.price * item.quantity}</Text>
      </View>
    </View>
  );

  const renderVendorSection = (vendorId: string, vendorData: any) => (
    <View key={vendorId} style={styles.vendorSection}>
      <View style={styles.vendorHeader}>
        <View style={styles.vendorInfo}>
          <Truck size={20} color="#4CAF50" />
          <Text style={styles.vendorName}>{vendorData.vendorName}</Text>
        </View>
        <Text style={styles.vendorSubtotal}>₹{vendorData.subtotal}</Text>
      </View>
      
      <FlatList
        data={vendorData.items}
        renderItem={renderCartItem}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );

  const renderEmptyCart = () => (
    <View style={styles.emptyCart}>
      <ShoppingBag size={64} color="#E5E5EA" />
      <Text style={styles.emptyTitle}>Your cart is empty</Text>
      <Text style={styles.emptyDescription}>
        Add items from vendors to see them here
      </Text>
      <TouchableOpacity
        style={styles.browseButton}
        onPress={() => router.replace('/(tabs)')}
      >
        <Text style={styles.browseButtonText}>Browse Vendors</Text>
      </TouchableOpacity>
    </View>
  );

  const renderOrderSuccessModal = () => (
    <Modal
      visible={orderSuccess}
      transparent
      animationType="fade"
      onRequestClose={handleOrderSuccessClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.successModal}>
          <View style={styles.successIcon}>
            <CheckCircle size={64} color="#4CAF50" />
          </View>
          
          <Text style={styles.successTitle}>Order Placed Successfully!</Text>
          <Text style={styles.successMessage}>
            Your order has been confirmed and will be delivered soon.
          </Text>
          
          {orderDetails && (
            <View style={styles.orderSummary}>
              <Text style={styles.orderIdText}>Order ID: {orderDetails.id}</Text>
              <Text style={styles.orderAmountText}>Amount: ₹{orderDetails.totalAmount}</Text>
              <Text style={styles.estimatedTimeText}>
                Estimated delivery: 25-35 minutes
              </Text>
            </View>
          )}
          
          <TouchableOpacity
            style={styles.successButton}
            onPress={handleOrderSuccessClose}
          >
            <Text style={styles.successButtonText}>Continue Shopping</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  if (items.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={24} color="#1C1C1E" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Cart</Text>
          <View style={styles.placeholder} />
        </View>
        {renderEmptyCart()}
      </View>
    );
  }

  return (
    <>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={24} color="#1C1C1E" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Cart ({totalItems} items)</Text>
          <TouchableOpacity style={styles.clearButton} onPress={handleClearCart}>
            <Text style={styles.clearButtonText}>Clear</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Cart Items by Vendor */}
          <View style={styles.cartContent}>
            {Object.entries(itemsByVendor).map(([vendorId, vendorData]) =>
              renderVendorSection(vendorId, vendorData)
            )}
          </View>

          {/* Bill Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Bill Details</Text>
            <View style={styles.billCard}>
              <View style={styles.billRow}>
                <Text style={styles.billLabel}>Item Total</Text>
                <Text style={styles.billValue}>₹{totalAmount}</Text>
              </View>
              <View style={styles.billRow}>
                <Text style={styles.billLabel}>Delivery Fee</Text>
                <Text style={styles.billValue}>₹{deliveryFee}</Text>
              </View>
              <View style={styles.billRow}>
                <Text style={styles.billLabel}>Platform Fee</Text>
                <Text style={styles.billValue}>₹{platformFee}</Text>
              </View>
              <View style={styles.billRow}>
                <Text style={styles.billLabel}>Taxes & Charges</Text>
                <Text style={styles.billValue}>₹{taxes}</Text>
              </View>
              <View style={[styles.billRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Total Amount</Text>
                <Text style={styles.totalValue}>₹{finalTotal}</Text>
              </View>
            </View>
          </View>

          {/* Delivery Info */}
          <View style={styles.section}>
            <View style={styles.deliveryInfo}>
              <Clock size={16} color="#4CAF50" />
              <Text style={styles.deliveryText}>
                Estimated delivery in 25-35 minutes
              </Text>
            </View>
          </View>

          {/* Bottom Padding */}
          <View style={styles.bottomPadding} />
        </ScrollView>

        {/* Checkout Button */}
        <View style={styles.checkoutContainer}>
          <View style={styles.checkoutInfo}>
            <Text style={styles.checkoutTotal}>₹{finalTotal}</Text>
            <Text style={styles.checkoutSubtext}>Total amount</Text>
          </View>
          <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
            <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Checkout Modal */}
      <Modal
        visible={showCheckoutModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowCheckoutModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowCheckoutModal(false)}
            >
              <ArrowLeft size={24} color="#1C1C1E" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Checkout</Text>
            <View style={styles.placeholder} />
          </View>
          
          <CheckoutForm
            onSubmit={handleCheckoutSubmit}
            isLoading={isProcessingPayment}
          />
        </View>
      </Modal>

      {/* Order Success Modal */}
      {renderOrderSuccessModal()}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#1C1C1E',
  },
  clearButton: {
    padding: 8,
  },
  clearButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FF3B30',
  },
  placeholder: {
    width: 24,
  },
  scrollView: {
    flex: 1,
  },
  cartContent: {
    paddingTop: 20,
  },
  vendorSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  vendorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  vendorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vendorName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1C1C1E',
    marginLeft: 8,
  },
  vendorSubtotal: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#4CAF50',
  },
  cartItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  itemName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1C1C1E',
    flex: 1,
  },
  removeButton: {
    padding: 4,
  },
  itemDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 8,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemPrice: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1C1C1E',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  quantityButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  increaseButton: {
    backgroundColor: '#4CAF50',
  },
  quantityText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1C1C1E',
    paddingHorizontal: 16,
  },
  itemTotal: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    color: '#4CAF50',
    textAlign: 'right',
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#1C1C1E',
    marginBottom: 16,
  },
  billCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  billLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#8E8E93',
  },
  billValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1C1C1E',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    paddingTop: 12,
    marginBottom: 0,
  },
  totalLabel: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#1C1C1E',
  },
  totalValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#4CAF50',
  },
  deliveryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E8',
    padding: 16,
    borderRadius: 12,
  },
  deliveryText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#4CAF50',
    marginLeft: 8,
  },
  bottomPadding: {
    height: 100,
  },
  checkoutContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  checkoutInfo: {
    flex: 1,
  },
  checkoutTotal: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#1C1C1E',
  },
  checkoutSubtext: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8E8E93',
  },
  checkoutButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  checkoutButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  emptyCart: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#1C1C1E',
    marginTop: 24,
    marginBottom: 12,
  },
  emptyDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  browseButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  browseButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  modalCloseButton: {
    padding: 8,
  },
  modalTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#1C1C1E',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  successModal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    maxWidth: 400,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
  },
  successIcon: {
    marginBottom: 24,
  },
  successTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#1C1C1E',
    textAlign: 'center',
    marginBottom: 12,
  },
  successMessage: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  orderSummary: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    marginBottom: 24,
  },
  orderIdText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#1C1C1E',
    marginBottom: 4,
  },
  orderAmountText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#4CAF50',
    marginBottom: 4,
  },
  estimatedTimeText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8E8E93',
  },
  successButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    width: '100%',
  },
  successButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
  },
});