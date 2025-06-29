import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
  Modal,
  ScrollView,
} from 'react-native';
import { Clock, CircleCheck as CheckCircle, Circle as XCircle, Package, Phone, MessageCircle, Filter, Search, Eye, MapPin, Calendar } from 'lucide-react-native';
import { Order } from '@/types/user';
import OrdersService from '@/services/orders';
import { OrderData } from '@/types/payment';

export default function OrdersScreen() {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  const statusFilters = [
    { id: 'all', label: 'All Orders' },
    { id: 'pending', label: 'Pending' },
    { id: 'confirmed', label: 'Confirmed' },
    { id: 'preparing', label: 'Preparing' },
    { id: 'out_for_delivery', label: 'Out for Delivery' },
    { id: 'delivered', label: 'Delivered' },
  ];

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const allOrders = OrdersService.getAllOrders();
      setOrders(allOrders);
    } catch (error) {
      console.error('Error loading orders:', error);
      Alert.alert('Error', 'Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredOrders = selectedStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === selectedStatus);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#FF9800';
      case 'confirmed': return '#2196F3';
      case 'preparing': return '#FF5722';
      case 'out_for_delivery': return '#4CAF50';
      case 'delivered': return '#8BC34A';
      case 'cancelled': return '#F44336';
      default: return '#8E8E93';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return Clock;
      case 'confirmed': return CheckCircle;
      case 'preparing': return Package;
      case 'out_for_delivery': return Package;
      case 'delivered': return CheckCircle;
      case 'cancelled': return XCircle;
      default: return Clock;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'confirmed': return 'Confirmed';
      case 'preparing': return 'Preparing';
      case 'out_for_delivery': return 'Out for Delivery';
      case 'delivered': return 'Delivered';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const orderDate = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - orderDate.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} min ago`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const success = await OrdersService.updateOrderStatus(orderId, newStatus as any);
      if (success) {
        setOrders(prev => 
          prev.map(order => 
            order.id === orderId 
              ? { ...order, status: newStatus as any }
              : order
          )
        );
        Alert.alert('Success', `Order status updated to ${getStatusText(newStatus)}`);
      } else {
        Alert.alert('Error', 'Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      Alert.alert('Error', 'Failed to update order status');
    }
  };

  const handleStatusUpdate = (order: OrderData) => {
    const nextStatus = {
      'pending': 'confirmed',
      'confirmed': 'preparing',
      'preparing': 'out_for_delivery',
      'out_for_delivery': 'delivered',
    };

    const next = nextStatus[order.status as keyof typeof nextStatus];
    if (next) {
      updateOrderStatus(order.id, next);
    }
  };

  const handleContactCustomer = (order: OrderData) => {
    Alert.alert('Contact Customer', `Contact ${order.customerDetails.customerName}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Call', onPress: () => console.log('Calling customer') },
      { text: 'Message', onPress: () => console.log('Messaging customer') },
    ]);
  };

  const handleViewOrderDetails = (order: OrderData) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const renderStatusFilter = (filter: any) => (
    <TouchableOpacity
      key={filter.id}
      style={[
        styles.statusFilter,
        selectedStatus === filter.id && styles.activeStatusFilter
      ]}
      onPress={() => setSelectedStatus(filter.id)}
    >
      <Text style={[
        styles.statusFilterText,
        selectedStatus === filter.id && styles.activeStatusFilterText
      ]}>
        {filter.label}
      </Text>
      <View style={[
        styles.statusCount,
        selectedStatus === filter.id && styles.activeStatusCount
      ]}>
        <Text style={[
          styles.statusCountText,
          selectedStatus === filter.id && styles.activeStatusCountText
        ]}>
          {filter.id === 'all' ? orders.length : orders.filter(o => o.status === filter.id).length}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderOrderCard = ({ item: order }: { item: OrderData }) => {
    const StatusIcon = getStatusIcon(order.status);
    const canUpdateStatus = ['pending', 'confirmed', 'preparing', 'out_for_delivery'].includes(order.status);
    
    return (
      <View style={styles.orderCard}>
        <View style={styles.orderHeader}>
          <Text style={styles.orderId}>Order #{order.id.slice(-6)}</Text>
          <Text style={styles.orderTime}>{getTimeAgo(order.createdAt)}</Text>
        </View>

        <View style={styles.orderStatus}>
          <View style={[styles.statusIcon, { backgroundColor: `${getStatusColor(order.status)}20` }]}>
            <StatusIcon size={16} color={getStatusColor(order.status)} />
          </View>
          <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>
            {getStatusText(order.status)}
          </Text>
        </View>

        <View style={styles.customerInfo}>
          <Text style={styles.customerName}>{order.customerDetails.customerName}</Text>
          <Text style={styles.customerPhone}>{order.customerDetails.phoneNumber}</Text>
        </View>

        <View style={styles.orderItems}>
          {order.items.slice(0, 2).map((item, index) => (
            <Text key={index} style={styles.orderItem}>
              {item.quantity}x {item.productName}
            </Text>
          ))}
          {order.items.length > 2 && (
            <Text style={styles.moreItems}>+{order.items.length - 2} more items</Text>
          )}
        </View>

        <View style={styles.orderAddress}>
          <MapPin size={14} color="#8E8E93" />
          <Text style={styles.addressText} numberOfLines={1}>
            {order.deliveryAddress.street}, {order.deliveryAddress.city}
          </Text>
        </View>

        <View style={styles.orderFooter}>
          <Text style={styles.orderTotal}>₹{order.totalAmount}</Text>
          
          <View style={styles.orderActions}>
            <TouchableOpacity
              style={styles.viewButton}
              onPress={() => handleViewOrderDetails(order)}
            >
              <Eye size={16} color="#4CAF50" />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.contactButton}
              onPress={() => handleContactCustomer(order)}
            >
              <Phone size={16} color="#2196F3" />
            </TouchableOpacity>
            
            {canUpdateStatus && (
              <TouchableOpacity
                style={styles.updateButton}
                onPress={() => handleStatusUpdate(order)}
              >
                <Text style={styles.updateButtonText}>
                  {order.status === 'pending' && 'Accept'}
                  {order.status === 'confirmed' && 'Start Preparing'}
                  {order.status === 'preparing' && 'Ready for Delivery'}
                  {order.status === 'out_for_delivery' && 'Mark Delivered'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  };

  const renderOrderDetailsModal = () => {
    if (!selectedOrder) return null;

    return (
      <Modal
        visible={showOrderDetails}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowOrderDetails(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowOrderDetails(false)}>
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Order Details</Text>
            <View style={styles.placeholder} />
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {/* Order Info */}
            <View style={styles.detailSection}>
              <Text style={styles.detailSectionTitle}>Order Information</Text>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Order ID:</Text>
                <Text style={styles.detailValue}>#{selectedOrder.id.slice(-6)}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Status:</Text>
                <Text style={[styles.detailValue, { color: getStatusColor(selectedOrder.status) }]}>
                  {getStatusText(selectedOrder.status)}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Order Date:</Text>
                <Text style={styles.detailValue}>
                  {new Date(selectedOrder.createdAt).toLocaleDateString()} at{' '}
                  {new Date(selectedOrder.createdAt).toLocaleTimeString()}
                </Text>
              </View>
            </View>

            {/* Customer Details */}
            <View style={styles.detailSection}>
              <Text style={styles.detailSectionTitle}>Customer Details</Text>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Name:</Text>
                <Text style={styles.detailValue}>{selectedOrder.customerDetails.customerName}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Phone:</Text>
                <Text style={styles.detailValue}>{selectedOrder.customerDetails.phoneNumber}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Email:</Text>
                <Text style={styles.detailValue}>{selectedOrder.customerDetails.email}</Text>
              </View>
            </View>

            {/* Delivery Address */}
            <View style={styles.detailSection}>
              <Text style={styles.detailSectionTitle}>Delivery Address</Text>
              <Text style={styles.addressDetail}>
                {selectedOrder.deliveryAddress.street}{'\n'}
                {selectedOrder.deliveryAddress.city}, {selectedOrder.deliveryAddress.state}{'\n'}
                {selectedOrder.deliveryAddress.pincode}
              </Text>
            </View>

            {/* Order Items */}
            <View style={styles.detailSection}>
              <Text style={styles.detailSectionTitle}>Order Items</Text>
              {selectedOrder.items.map((item, index) => (
                <View key={index} style={styles.itemDetail}>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemName}>{item.productName}</Text>
                    <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
                  </View>
                  <Text style={styles.itemPrice}>₹{item.price * item.quantity}</Text>
                </View>
              ))}
            </View>

            {/* Payment Details */}
            <View style={styles.detailSection}>
              <Text style={styles.detailSectionTitle}>Payment Details</Text>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Payment ID:</Text>
                <Text style={styles.detailValue}>{selectedOrder.paymentDetails.paymentId}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Amount:</Text>
                <Text style={styles.detailValue}>₹{selectedOrder.paymentDetails.amount}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Status:</Text>
                <Text style={[styles.detailValue, { color: '#4CAF50' }]}>
                  {selectedOrder.paymentDetails.status}
                </Text>
              </View>
            </View>

            {/* Special Instructions */}
            {selectedOrder.customerDetails.specialInstructions && (
              <View style={styles.detailSection}>
                <Text style={styles.detailSectionTitle}>Special Instructions</Text>
                <Text style={styles.instructionsText}>
                  {selectedOrder.customerDetails.specialInstructions}
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      </Modal>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Package size={64} color="#E5E5EA" />
      <Text style={styles.emptyTitle}>No Orders Yet</Text>
      <Text style={styles.emptyDescription}>
        Orders from customers will appear here
      </Text>
    </View>
  );

  return (
    <>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Orders</Text>
          <Text style={styles.headerSubtitle}>
            Manage your customer orders
          </Text>
        </View>

        {/* Status Filters */}
        <View style={styles.filtersContainer}>
          <FlatList
            data={statusFilters}
            renderItem={({ item }) => renderStatusFilter(item)}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersList}
          />
        </View>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          renderEmptyState()
        ) : (
          <FlatList
            data={filteredOrders}
            renderItem={renderOrderCard}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.ordersList}
            refreshControl={
              <RefreshControl
                refreshing={isLoading}
                onRefresh={loadOrders}
                colors={['#4CAF50']}
                tintColor="#4CAF50"
              />
            }
          />
        )}
      </View>

      {/* Order Details Modal */}
      {renderOrderDetailsModal()}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
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
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#1C1C1E',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#8E8E93',
  },
  filtersContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  filtersList: {
    paddingHorizontal: 20,
  },
  statusFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
  },
  activeStatusFilter: {
    backgroundColor: '#4CAF50',
  },
  statusFilterText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#8E8E93',
  },
  activeStatusFilterText: {
    color: '#FFFFFF',
  },
  statusCount: {
    backgroundColor: '#E5E5EA',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 8,
    minWidth: 20,
    alignItems: 'center',
  },
  activeStatusCount: {
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  statusCountText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    color: '#8E8E93',
  },
  activeStatusCountText: {
    color: '#FFFFFF',
  },
  ordersList: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 100,
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderId: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#1C1C1E',
  },
  orderTime: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8E8E93',
  },
  orderStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  statusText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
  },
  customerInfo: {
    marginBottom: 12,
  },
  customerName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1C1C1E',
    marginBottom: 2,
  },
  customerPhone: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8E8E93',
  },
  orderItems: {
    marginBottom: 12,
  },
  orderItem: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#1C1C1E',
    marginBottom: 2,
  },
  moreItems: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8E8E93',
    fontStyle: 'italic',
  },
  orderAddress: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  addressText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8E8E93',
    marginLeft: 8,
    flex: 1,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderTotal: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#1C1C1E',
  },
  orderActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  viewButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E8F5E8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E3F2FD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  updateButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  updateButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    color: '#FFFFFF',
  },
  emptyState: {
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
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  modalCloseText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#4CAF50',
  },
  modalTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#1C1C1E',
  },
  placeholder: {
    width: 50,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  detailSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  detailSectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#1C1C1E',
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8E8E93',
  },
  detailValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#1C1C1E',
    flex: 1,
    textAlign: 'right',
  },
  addressDetail: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#1C1C1E',
    lineHeight: 20,
  },
  itemDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#1C1C1E',
  },
  itemQuantity: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#8E8E93',
  },
  itemPrice: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#4CAF50',
  },
  instructionsText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#1C1C1E',
    lineHeight: 20,
    fontStyle: 'italic',
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 8,
  },
});