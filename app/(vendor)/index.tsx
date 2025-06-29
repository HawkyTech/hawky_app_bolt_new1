import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { TrendingUp, DollarSign, ShoppingCart, Users, Eye, MapPin, Clock, Star, Package, CircleAlert as AlertCircle } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';

const { width } = Dimensions.get('window');

interface StatCard {
  id: string;
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: any;
  color: string;
}

interface RecentOrder {
  id: string;
  customerName: string;
  items: string;
  amount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered';
  time: string;
}

const statsData: StatCard[] = [
  {
    id: '1',
    title: 'Total Revenue',
    value: '₹12,450',
    change: '+15.3%',
    changeType: 'positive',
    icon: DollarSign,
    color: '#4CAF50',
  },
  {
    id: '2',
    title: 'Orders Today',
    value: '23',
    change: '+8.2%',
    changeType: 'positive',
    icon: ShoppingCart,
    color: '#2196F3',
  },
  {
    id: '3',
    title: 'Total Customers',
    value: '156',
    change: '+12.1%',
    changeType: 'positive',
    icon: Users,
    color: '#FF9800',
  },
  {
    id: '4',
    title: 'Profile Views',
    value: '89',
    change: '+5.7%',
    changeType: 'positive',
    icon: Eye,
    color: '#9C27B0',
  },
];

const recentOrders: RecentOrder[] = [
  {
    id: '1',
    customerName: 'Priya Sharma',
    items: 'Pani Puri, Bhel Puri',
    amount: 120,
    status: 'preparing',
    time: '10 min ago',
  },
  {
    id: '2',
    customerName: 'Rahul Kumar',
    items: 'Vada Pav, Chai',
    amount: 80,
    status: 'ready',
    time: '15 min ago',
  },
  {
    id: '3',
    customerName: 'Anita Patel',
    items: 'Dosa, Sambar',
    amount: 150,
    status: 'delivered',
    time: '25 min ago',
  },
  {
    id: '4',
    customerName: 'Vikram Singh',
    items: 'Chole Bhature',
    amount: 100,
    status: 'pending',
    time: '30 min ago',
  },
];

export default function VendorDashboard() {
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('today');

  const periods = [
    { id: 'today', label: 'Today' },
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#FF9800';
      case 'confirmed': return '#2196F3';
      case 'preparing': return '#FF5722';
      case 'ready': return '#4CAF50';
      case 'delivered': return '#8BC34A';
      default: return '#8E8E93';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'confirmed': return 'Confirmed';
      case 'preparing': return 'Preparing';
      case 'ready': return 'Ready';
      case 'delivered': return 'Delivered';
      default: return status;
    }
  };

  const renderStatCard = (stat: StatCard) => {
    const IconComponent = stat.icon;
    return (
      <View key={stat.id} style={styles.statCard}>
        <View style={styles.statHeader}>
          <View style={[styles.statIcon, { backgroundColor: `${stat.color}20` }]}>
            <IconComponent size={20} color={stat.color} />
          </View>
          <Text style={[styles.statChange, { color: stat.color }]}>
            {stat.change}
          </Text>
        </View>
        <Text style={styles.statValue}>{stat.value}</Text>
        <Text style={styles.statTitle}>{stat.title}</Text>
      </View>
    );
  };

  const renderOrderItem = (order: RecentOrder) => (
    <TouchableOpacity key={order.id} style={styles.orderItem}>
      <View style={styles.orderHeader}>
        <Text style={styles.customerName}>{order.customerName}</Text>
        <Text style={styles.orderTime}>{order.time}</Text>
      </View>
      <Text style={styles.orderItems}>{order.items}</Text>
      <View style={styles.orderFooter}>
        <Text style={styles.orderAmount}>₹{order.amount}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
          <Text style={styles.statusText}>{getStatusText(order.status)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.greeting}>Good morning,</Text>
          <Text style={styles.vendorName}>{user?.fullName || 'Vendor'}</Text>
          <View style={styles.locationContainer}>
            <MapPin size={16} color="#8E8E93" />
            <Text style={styles.locationText}>Church Street, Bengaluru</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <AlertCircle size={24} color="#4CAF50" />
        </TouchableOpacity>
      </View>

      {/* Business Status */}
      <View style={styles.businessStatus}>
        <View style={styles.statusHeader}>
          <Text style={styles.statusTitle}>Business Status</Text>
          <TouchableOpacity style={styles.statusToggle}>
            <View style={styles.statusIndicator} />
            <Text style={styles.statusText}>Open</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.statusInfo}>
          <View style={styles.statusItem}>
            <Clock size={16} color="#8E8E93" />
            <Text style={styles.statusItemText}>Open until 10:00 PM</Text>
          </View>
          <View style={styles.statusItem}>
            <Star size={16} color="#FFD700" />
            <Text style={styles.statusItemText}>4.8 rating (156 reviews)</Text>
          </View>
        </View>
      </View>

      {/* Period Selector */}
      <View style={styles.periodSelector}>
        {periods.map((period) => (
          <TouchableOpacity
            key={period.id}
            style={[
              styles.periodButton,
              selectedPeriod === period.id && styles.activePeriodButton
            ]}
            onPress={() => setSelectedPeriod(period.id)}
          >
            <Text style={[
              styles.periodButtonText,
              selectedPeriod === period.id && styles.activePeriodButtonText
            ]}>
              {period.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Stats Grid */}
      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>Overview</Text>
        <View style={styles.statsGrid}>
          {statsData.map(renderStatCard)}
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity style={styles.actionCard}>
            <Package size={24} color="#4CAF50" />
            <Text style={styles.actionText}>Add Product</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard}>
            <MapPin size={24} color="#2196F3" />
            <Text style={styles.actionText}>Update Location</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard}>
            <TrendingUp size={24} color="#FF9800" />
            <Text style={styles.actionText}>View Analytics</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Recent Orders */}
      <View style={styles.ordersSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Orders</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.ordersList}>
          {recentOrders.map(renderOrderItem)}
        </View>
      </View>

      {/* Performance Insights */}
      <View style={styles.insightsSection}>
        <Text style={styles.sectionTitle}>Performance Insights</Text>
        <View style={styles.insightCard}>
          <View style={styles.insightHeader}>
            <TrendingUp size={20} color="#4CAF50" />
            <Text style={styles.insightTitle}>Sales Trend</Text>
          </View>
          <Text style={styles.insightDescription}>
            Your sales have increased by 23% compared to last week. Keep up the great work!
          </Text>
          <View style={styles.insightMetrics}>
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>₹2,340</Text>
              <Text style={styles.metricLabel}>This Week</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>₹1,900</Text>
              <Text style={styles.metricLabel}>Last Week</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
  },
  headerContent: {
    flex: 1,
  },
  greeting: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#8E8E93',
  },
  vendorName: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#1C1C1E',
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8E8E93',
    marginLeft: 4,
  },
  notificationButton: {
    padding: 8,
  },
  businessStatus: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#1C1C1E',
  },
  statusToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    marginRight: 8,
  },
  statusText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#4CAF50',
  },
  statusInfo: {
    gap: 8,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusItemText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8E8E93',
    marginLeft: 8,
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  activePeriodButton: {
    backgroundColor: '#4CAF50',
  },
  periodButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#8E8E93',
  },
  activePeriodButtonText: {
    color: '#FFFFFF',
  },
  statsSection: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#1C1C1E',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: (width - 60) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statChange: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
  },
  statValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#1C1C1E',
    marginBottom: 4,
  },
  statTitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8E8E93',
  },
  quickActions: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: (width - 80) / 3,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#1C1C1E',
    marginTop: 8,
    textAlign: 'center',
  },
  ordersSection: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#4CAF50',
  },
  ordersList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  orderItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  customerName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1C1C1E',
  },
  orderTime: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#8E8E93',
  },
  orderItems: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 8,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderAmount: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#1C1C1E',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#FFFFFF',
  },
  insightsSection: {
    paddingHorizontal: 20,
    marginTop: 24,
    paddingBottom: 100,
  },
  insightCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  insightTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1C1C1E',
    marginLeft: 8,
  },
  insightDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 20,
    marginBottom: 16,
  },
  insightMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  metricItem: {
    alignItems: 'center',
  },
  metricValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#1C1C1E',
  },
  metricLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 4,
  },
});