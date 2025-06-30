import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Clock, CircleCheck as CheckCircle, Circle as XCircle, Package, Phone, MessageCircle } from 'lucide-react-native';
import { Order } from '@/types/user';

const mockOrders: Order[] = [
  {
    id: '1',
    consumerId: 'c1',
    vendorId: 'v1',
    products: [
      { productId: 'p1', productName: 'Pani Puri', quantity: 2, price: 60 },
      { productId: 'p2', productName: 'Bhel Puri', quantity: 1, price: 50 },
    ],
    totalAmount: 170,
    status: 'pending',
    deliveryAddress: {
      id: 'a1',
      label: 'Home',
      street: '123 MG Road',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560001',
      isDefault: true,
    },
    orderDate: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    notes: 'Extra spicy please',
  },
  {
    id: '2',
    consumerId: 'c2',
    vendorId: 'v1',
    products: [
      { productId: 'p3', productName: 'Vada Pav', quantity: 3, price: 25 },
      { productId: 'p4', productName: 'Masala Chai', quantity: 2, price: 15 },
    ],
    totalAmount: 105,
    status: 'preparing',
    deliveryAddress: {
      id: 'a2',
      label: 'Office',
      street: '456 Brigade Road',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560025',
      isDefault: false,
    },
    orderDate: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    estimatedDeliveryTime: '15 minutes',
  },
  {
    id: '3',
    consumerId: 'c3',
    vendorId: 'v1',
    products: [
      { productId: 'p1', productName: 'Pani Puri', quantity: 1, price: 60 },
    ],
    totalAmount: 60,
    status: 'ready',
    deliveryAddress: {
      id: 'a3',
      label: 'Home',
      street: '789 Commercial Street',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560001',
      isDefault: true,
    },
    orderDate: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    estimatedDeliveryTime: '5 minutes',
  },
  {
    id: '4',
    consumerId: 'c4',
    vendorId: 'v1',
    products: [
      { productId: 'p2', productName: 'Bhel Puri', quantity: 2, price: 50 },
      { productId: 'p4', productName: 'Masala Chai', quantity: 1, price: 15 },
    ],
    totalAmount: 115,
    status: 'delivered',
    deliveryAddress: {
      id: 'a4',
      label: 'Home',
      street: '321 Indiranagar',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560038',
      isDefault: true,
    },
    orderDate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
];

export default function OrdersScreen() {
  const [orders, setOrders] = useState(mockOrders);
  const [selectedStatus, setSelectedStatus] = useState('all');

  const statusFilters = [
    { id: 'all', label: 'All Orders', count: orders.length },
    { id: 'pending', label: 'Pending', count: orders.filter(o => o.status === 'pending').length },
    { id: 'preparing', label: 'Preparing', count: orders.filter(o => o.status === 'preparing').length },
    { id: 'ready', label: 'Ready', count: orders.filter(o => o.status === 'ready').length },
  ];

  const filteredOrders = selectedStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === selectedStatus);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#FF9800';
      case 'confirmed': return '#2196F3';
      case 'preparing': return '#FF5722';
      case 'ready': return '#4CAF50';
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
      case 'ready': return CheckCircle;
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
      case 'ready': return 'Ready for Pickup';
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

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders(prev => 
      prev.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus as any }
          : order
      )
    );
  };

  const handleStatusUpdate = (order: Order) => {
    const nextStatus = {
      'pending': 'confirmed',
      'confirmed': 'preparing',
      'preparing': 'ready',
      'ready': 'delivered',
    };

    const next = nextStatus[order.status as keyof typeof nextStatus];
    if (next) {
      updateOrderStatus(order.id, next);
    }
  };

  const handleContactCustomer = (orderId: string) => {
    Alert.alert('Contact Customer', 'Choose contact method:', [
      { text: 'Call', onPress: () => console.log('Calling customer') },
      { text: 'Message', onPress: () => console.log('Messaging customer') },
      { text: 'Cancel', style: 'cancel' },
    ]);
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
          {filter.count}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderOrderCard = ({ item: order }: { item: Order }) => {
    const StatusIcon = getStatusIcon(order.status);
    const canUpdateStatus = ['pending', 'confirmed', 'preparing', 'ready'].includes(order.status);
    
    return (
      <View style={styles.orderCard}>
        <View style={styles.orderHeader}>
          <Text style={styles.orderId}>Order #{order.id}</Text>
          <Text style={styles.orderTime}>{getTimeAgo(order.orderDate)}</Text>
        </View>

        <View style={styles.orderStatus}>
          <View style={[styles.statusIcon, { backgroundColor: `${getStatusColor(order.status)}20` }]}>
            <StatusIcon size={16} color={getStatusColor(order.status)} />
          </View>
          <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>
            {getStatusText(order.status)}
          </Text>
        </View>

        <View style={styles.orderItems}>
          {order.products.map((item, index) => (
            <Text key={index} style={styles.orderItem}>
              {item.quantity}x {item.productName}
            </Text>
          ))}
        </View>

        <View style={styles.orderAddress}>
          <Text style={styles.addressLabel}>Delivery to:</Text>
          <Text style={styles.addressText}>
            {order.deliveryAddress.street}, {order.deliveryAddress.city}
          </Text>
        </View>

        {order.notes && (
          <View style={styles.orderNotes}>
            <Text style={styles.notesLabel}>Notes:</Text>
            <Text style={styles.notesText}>{order.notes}</Text>
          </View>
        )}

        <View style={styles.orderFooter}>
          <Text style={styles.orderTotal}>₹{order.totalAmount}</Text>
          
          <View style={styles.orderActions}>
            <TouchableOpacity
              style={styles.contactButton}
              onPress={() => handleContactCustomer(order.id)}
            >
              <Phone size={16} color="#4CAF50" />
            </TouchableOpacity>
            
            {canUpdateStatus && (
              <TouchableOpacity
                style={styles.updateButton}
                onPress={() => handleStatusUpdate(order)}
              >
                <Text style={styles.updateButtonText}>
                  {order.status === 'pending' && 'Accept'}
                  {order.status === 'confirmed' && 'Start Preparing'}
                  {order.status === 'preparing' && 'Mark Ready'}
                  {order.status === 'ready' && 'Mark Delivered'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
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
        />
      )}
    </View>
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
  orderItems: {
    marginBottom: 16,
  },
  orderItem: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#1C1C1E',
    marginBottom: 4,
  },
  orderAddress: {
    marginBottom: 12,
  },
  addressLabel: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 4,
  },
  addressText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#1C1C1E',
  },
  orderNotes: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  notesLabel: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 4,
  },
  notesText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#1C1C1E',
    fontStyle: 'italic',
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
    gap: 12,
  },
  contactButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F5E8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  updateButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  updateButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
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
});