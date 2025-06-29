import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Alert,
} from 'react-native';
import { TrendingUp, DollarSign, ShoppingCart, Users, Eye, MapPin, Clock, Star, Package, CircleAlert as AlertCircle, Calendar, ChartBar as BarChart3, ChartPie as PieChart, Activity, ArrowUp, ArrowDown, Filter, Download } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { LineChart, BarChart, PieChart as RNPieChart } from 'react-native-chart-kit';
import OrdersService from '@/services/orders';
import { OrderData } from '@/types/payment';

const { width } = Dimensions.get('window');

interface StatCard {
  id: string;
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: any;
  color: string;
  subtitle?: string;
}

interface RevenueData {
  daily: number[];
  weekly: number[];
  monthly: number[];
  labels: string[];
}

interface ProductPerformance {
  name: string;
  sales: number;
  revenue: number;
  color: string;
}

export default function VendorDashboard() {
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month'>('today');
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [revenueData, setRevenueData] = useState<RevenueData>({
    daily: [1200, 1800, 1500, 2200, 1900, 2500, 2800],
    weekly: [8500, 12000, 15500, 18200],
    monthly: [45000, 52000, 48000, 65000, 58000, 72000],
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  });
  const [productPerformance, setProductPerformance] = useState<ProductPerformance[]>([
    { name: 'Pani Puri', sales: 45, revenue: 2700, color: '#4CAF50' },
    { name: 'Bhel Puri', sales: 32, revenue: 1600, color: '#2196F3' },
    { name: 'Vada Pav', sales: 28, revenue: 1120, color: '#FF9800' },
    { name: 'Masala Chai', sales: 67, revenue: 1340, color: '#9C27B0' },
    { name: 'Dosa', sales: 23, revenue: 2760, color: '#F44336' },
  ]);

  const periods = [
    { id: 'today', label: 'Today' },
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
  ];

  useEffect(() => {
    loadDashboardData();
  }, [selectedPeriod]);

  const loadDashboardData = async () => {
    try {
      const allOrders = OrdersService.getAllOrders();
      setOrders(allOrders);
      
      // Update revenue data based on selected period
      updateRevenueData();
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const updateRevenueData = () => {
    switch (selectedPeriod) {
      case 'today':
        setRevenueData(prev => ({
          ...prev,
          labels: ['6AM', '9AM', '12PM', '3PM', '6PM', '9PM', '12AM'],
        }));
        break;
      case 'week':
        setRevenueData(prev => ({
          ...prev,
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        }));
        break;
      case 'month':
        setRevenueData(prev => ({
          ...prev,
          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        }));
        break;
    }
  };

  const getStatsData = (): StatCard[] => {
    const totalRevenue = selectedPeriod === 'today' ? 2800 : 
                        selectedPeriod === 'week' ? 18200 : 72000;
    const totalOrders = selectedPeriod === 'today' ? 23 : 
                       selectedPeriod === 'week' ? 156 : 642;
    const totalCustomers = selectedPeriod === 'today' ? 18 : 
                          selectedPeriod === 'week' ? 89 : 324;
    const profileViews = selectedPeriod === 'today' ? 89 : 
                        selectedPeriod === 'week' ? 567 : 2340;

    return [
      {
        id: '1',
        title: 'Total Revenue',
        value: `₹${totalRevenue.toLocaleString()}`,
        change: '+15.3%',
        changeType: 'positive',
        icon: DollarSign,
        color: '#4CAF50',
        subtitle: `vs last ${selectedPeriod}`,
      },
      {
        id: '2',
        title: 'Orders',
        value: totalOrders.toString(),
        change: '+8.2%',
        changeType: 'positive',
        icon: ShoppingCart,
        color: '#2196F3',
        subtitle: `${Math.round(totalOrders * 0.85)} completed`,
      },
      {
        id: '3',
        title: 'Customers',
        value: totalCustomers.toString(),
        change: '+12.1%',
        changeType: 'positive',
        icon: Users,
        color: '#FF9800',
        subtitle: `${Math.round(totalCustomers * 0.3)} new`,
      },
      {
        id: '4',
        title: 'Profile Views',
        value: profileViews.toString(),
        change: '+5.7%',
        changeType: 'positive',
        icon: Eye,
        color: '#9C27B0',
        subtitle: 'Visibility metric',
      },
    ];
  };

  const getRecentOrders = () => {
    return orders.slice(0, 5).map(order => ({
      id: order.id,
      customerName: order.customerDetails.customerName,
      items: order.items.map(item => item.productName).join(', '),
      amount: order.totalAmount,
      status: order.status,
      time: getTimeAgo(order.createdAt),
    }));
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

  const handleExportData = () => {
    Alert.alert('Export Data', 'Revenue and order data will be exported to CSV format.');
  };

  const renderStatCard = (stat: StatCard) => {
    const IconComponent = stat.icon;
    const isPositive = stat.changeType === 'positive';
    
    return (
      <View key={stat.id} style={styles.statCard}>
        <View style={styles.statHeader}>
          <View style={[styles.statIcon, { backgroundColor: `${stat.color}15` }]}>
            <IconComponent size={24} color={stat.color} />
          </View>
          <View style={styles.statChange}>
            {isPositive ? (
              <ArrowUp size={16} color="#4CAF50" />
            ) : (
              <ArrowDown size={16} color="#FF3B30" />
            )}
            <Text style={[styles.statChangeText, { color: isPositive ? '#4CAF50' : '#FF3B30' }]}>
              {stat.change}
            </Text>
          </View>
        </View>
        <Text style={styles.statValue}>{stat.value}</Text>
        <Text style={styles.statTitle}>{stat.title}</Text>
        {stat.subtitle && (
          <Text style={styles.statSubtitle}>{stat.subtitle}</Text>
        )}
      </View>
    );
  };

  const renderRevenueChart = () => {
    const data = selectedPeriod === 'today' ? revenueData.daily :
                 selectedPeriod === 'week' ? revenueData.daily :
                 revenueData.weekly;

    return (
      <View style={styles.chartContainer}>
        <View style={styles.chartHeader}>
          <Text style={styles.chartTitle}>Revenue Trend</Text>
          <TouchableOpacity style={styles.exportButton} onPress={handleExportData}>
            <Download size={16} color="#4CAF50" />
            <Text style={styles.exportButtonText}>Export</Text>
          </TouchableOpacity>
        </View>
        
        <LineChart
          data={{
            labels: revenueData.labels,
            datasets: [{
              data: data,
              color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
              strokeWidth: 3,
            }],
          }}
          width={width - 60}
          height={220}
          yAxisLabel="₹"
          yAxisSuffix=""
          chartConfig={{
            backgroundColor: '#FFFFFF',
            backgroundGradientFrom: '#FFFFFF',
            backgroundGradientTo: '#FFFFFF',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(142, 142, 147, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: '6',
              strokeWidth: '2',
              stroke: '#4CAF50',
            },
            propsForBackgroundLines: {
              strokeDasharray: '',
              stroke: '#F2F2F7',
            },
          }}
          bezier
          style={styles.chart}
        />
      </View>
    );
  };

  const renderProductPerformanceChart = () => {
    const pieData = productPerformance.map((product, index) => ({
      name: product.name,
      population: product.sales,
      color: product.color,
      legendFontColor: '#8E8E93',
      legendFontSize: 12,
    }));

    return (
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Product Performance</Text>
        
        <RNPieChart
          data={pieData}
          width={width - 60}
          height={200}
          chartConfig={{
            color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
        
        <View style={styles.productLegend}>
          {productPerformance.map((product, index) => (
            <View key={index} style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: product.color }]} />
              <View style={styles.legendText}>
                <Text style={styles.legendName}>{product.name}</Text>
                <Text style={styles.legendValue}>{product.sales} orders • ₹{product.revenue}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderOrderItem = (order: any) => (
    <TouchableOpacity key={order.id} style={styles.orderItem}>
      <View style={styles.orderHeader}>
        <Text style={styles.customerName}>{order.customerName}</Text>
        <Text style={styles.orderTime}>{order.time}</Text>
      </View>
      <Text style={styles.orderItems} numberOfLines={1}>{order.items}</Text>
      <View style={styles.orderFooter}>
        <Text style={styles.orderAmount}>₹{order.amount}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
          <Text style={styles.statusText}>{getStatusText(order.status)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderQuickActions = () => (
    <View style={styles.quickActions}>
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.actionsGrid}>
        <TouchableOpacity style={styles.actionCard}>
          <Package size={24} color="#4CAF50" />
          <Text style={styles.actionText}>Add Product</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionCard}>
          <BarChart3 size={24} color="#2196F3" />
          <Text style={styles.actionText}>View Analytics</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionCard}>
          <Users size={24} color="#FF9800" />
          <Text style={styles.actionText}>Customer Reviews</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionCard}>
          <MapPin size={24} color="#9C27B0" />
          <Text style={styles.actionText}>Update Location</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderBusinessInsights = () => (
    <View style={styles.insightsSection}>
      <Text style={styles.sectionTitle}>Business Insights</Text>
      
      <View style={styles.insightCard}>
        <View style={styles.insightHeader}>
          <TrendingUp size={20} color="#4CAF50" />
          <Text style={styles.insightTitle}>Peak Hours</Text>
        </View>
        <Text style={styles.insightDescription}>
          Your busiest hours are between 12 PM - 2 PM and 7 PM - 9 PM. Consider offering special deals during off-peak hours.
        </Text>
        <View style={styles.insightMetrics}>
          <View style={styles.metricItem}>
            <Text style={styles.metricValue}>12-2 PM</Text>
            <Text style={styles.metricLabel}>Peak Lunch</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricValue}>7-9 PM</Text>
            <Text style={styles.metricLabel}>Peak Dinner</Text>
          </View>
        </View>
      </View>

      <View style={styles.insightCard}>
        <View style={styles.insightHeader}>
          <Star size={20} color="#FFD700" />
          <Text style={styles.insightTitle}>Customer Satisfaction</Text>
        </View>
        <Text style={styles.insightDescription}>
          Your average rating has improved by 0.3 points this month. Keep up the excellent service!
        </Text>
        <View style={styles.insightMetrics}>
          <View style={styles.metricItem}>
            <Text style={styles.metricValue}>4.8</Text>
            <Text style={styles.metricLabel}>Current Rating</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricValue}>+0.3</Text>
            <Text style={styles.metricLabel}>This Month</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const statsData = getStatsData();
  const recentOrders = getRecentOrders();

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
            onPress={() => setSelectedPeriod(period.id as any)}
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

      {/* Revenue Chart */}
      {renderRevenueChart()}

      {/* Product Performance Chart */}
      {renderProductPerformanceChart()}

      {/* Quick Actions */}
      {renderQuickActions()}

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

      {/* Business Insights */}
      {renderBusinessInsights()}

      {/* Bottom Padding */}
      <View style={styles.bottomPadding} />
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
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
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statChange: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statChangeText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    marginLeft: 4,
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
    marginBottom: 2,
  },
  statSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#C7C7CC',
  },
  chartContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 24,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  chartTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#1C1C1E',
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  exportButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#4CAF50',
    marginLeft: 4,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  productLegend: {
    marginTop: 16,
    gap: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  legendText: {
    flex: 1,
  },
  legendName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#1C1C1E',
  },
  legendValue: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#8E8E93',
  },
  quickActions: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: (width - 80) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
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
  },
  insightCard: {
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
  bottomPadding: {
    height: 100,
  },
});