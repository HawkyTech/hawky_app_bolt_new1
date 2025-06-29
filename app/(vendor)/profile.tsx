import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { User, MapPin, Bell, CreditCard, CircleHelp as HelpCircle, Settings, Share, Star, ChartBar as BarChart3, Package, ChevronRight, CreditCard as Edit, LogOut, Info, Building, Clock, Eye } from 'lucide-react-native';
import ContactInfo from '@/components/ContactInfo';
import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';

interface MenuSection {
  title: string;
  items: MenuItem[];
}

interface MenuItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: any;
  color: string;
  action?: () => void;
}

export default function VendorProfileScreen() {
  const { user, signOut } = useAuth();

  const handleMenuPress = (itemTitle: string) => {
    Alert.alert('Feature', `${itemTitle} feature coming soon!`);
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive', 
          onPress: async () => {
            await signOut();
            router.replace('/');
          }
        },
      ]
    );
  };

  const menuSections: MenuSection[] = [
    {
      title: 'Business Management',
      items: [
        {
          id: '1',
          title: 'Business Profile',
          subtitle: 'Update business information and photos',
          icon: Building,
          color: '#4CAF50',
          action: () => handleMenuPress('Business Profile'),
        },
        {
          id: '2',
          title: 'Business Hours',
          subtitle: 'Set your operating hours',
          icon: Clock,
          color: '#66BB6A',
          action: () => handleMenuPress('Business Hours'),
        },
        {
          id: '3',
          title: 'Location Settings',
          subtitle: 'Update your business location',
          icon: MapPin,
          color: '#81C784',
          action: () => handleMenuPress('Location Settings'),
        },
      ],
    },
    {
      title: 'Analytics & Performance',
      items: [
        {
          id: '4',
          title: 'Sales Analytics',
          subtitle: 'View detailed sales reports',
          icon: BarChart3,
          color: '#A5D6A7',
          action: () => handleMenuPress('Sales Analytics'),
        },
        {
          id: '5',
          title: 'Product Performance',
          subtitle: 'See which products sell best',
          icon: Package,
          color: '#FFD700',
          action: () => handleMenuPress('Product Performance'),
        },
        {
          id: '6',
          title: 'Customer Reviews',
          subtitle: '23 reviews received',
          icon: Star,
          color: '#E91E63',
          action: () => handleMenuPress('Customer Reviews'),
        },
      ],
    },
    {
      title: 'Account Settings',
      items: [
        {
          id: '7',
          title: 'Profile Settings',
          subtitle: 'Update personal information',
          icon: Edit,
          color: '#FF9800',
          action: () => handleMenuPress('Profile Settings'),
        },
        {
          id: '8',
          title: 'Payment Settings',
          subtitle: 'Manage payment methods and payouts',
          icon: CreditCard,
          color: '#607D8B',
          action: () => handleMenuPress('Payment Settings'),
        },
        {
          id: '9',
          title: 'Notifications',
          subtitle: 'Order alerts and app notifications',
          icon: Bell,
          color: '#795548',
          action: () => handleMenuPress('Notifications'),
        },
      ],
    },
    {
      title: 'Support & Growth',
      items: [
        {
          id: '10',
          title: 'Help Center',
          subtitle: 'FAQ and vendor support',
          icon: HelpCircle,
          color: '#3F51B5',
          action: () => handleMenuPress('Help Center'),
        },
        {
          id: '11',
          title: 'Promote Business',
          subtitle: 'Marketing tools and tips',
          icon: Share,
          color: '#9C27B0',
          action: () => handleMenuPress('Promote Business'),
        },
      ],
    },
  ];

  const renderMenuItem = (item: MenuItem) => {
    const IconComponent = item.icon;
    return (
      <TouchableOpacity
        key={item.id}
        style={styles.menuItem}
        onPress={item.action}
        activeOpacity={0.8}
      >
        <View style={styles.menuItemLeft}>
          <View style={[styles.menuItemIcon, { backgroundColor: `${item.color}20` }]}>
            <IconComponent size={20} color={item.color} />
          </View>
          <View style={styles.menuItemContent}>
            <Text style={styles.menuItemTitle}>{item.title}</Text>
            {item.subtitle && (
              <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
            )}
          </View>
        </View>
        <ChevronRight size={20} color="#C7C7CC" />
      </TouchableOpacity>
    );
  };

  const renderMenuSection = (section: MenuSection) => (
    <View key={section.title} style={styles.menuSection}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
      <View style={styles.sectionContent}>
        {section.items.map(renderMenuItem)}
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Vendor Profile</Text>
      </View>

      {/* Profile Card */}
      <View style={styles.profileCard}>
        <View style={styles.profileImageContainer}>
          <Image
            source={{ uri: user?.avatar || 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg' }}
            style={styles.profileImage}
          />
          <TouchableOpacity style={styles.editImageButton}>
            <Edit size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{user?.fullName || 'Vendor Name'}</Text>
          <Text style={styles.profileEmail}>{user?.email || 'vendor@email.com'}</Text>
          <Text style={styles.profilePhone}>+91 98765 43210</Text>
          <Text style={styles.businessName}>Rajesh Chaat Corner</Text>
        </View>
        <View style={styles.profileStats}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>45</Text>
            <Text style={styles.statLabel}>Orders</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>4.8</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Products</Text>
          </View>
        </View>
      </View>

      {/* Business Status */}
      <View style={styles.businessStatus}>
        <View style={styles.statusHeader}>
          <Text style={styles.statusTitle}>Business Status</Text>
          <View style={styles.statusBadge}>
            <View style={styles.statusIndicator} />
            <Text style={styles.statusText}>Open</Text>
          </View>
        </View>
        <View style={styles.statusDetails}>
          <View style={styles.statusItem}>
            <Eye size={16} color="#8E8E93" />
            <Text style={styles.statusItemText}>Profile viewed 89 times this week</Text>
          </View>
          <View style={styles.statusItem}>
            <MapPin size={16} color="#8E8E93" />
            <Text style={styles.statusItemText}>Church Street, Bengaluru</Text>
          </View>
        </View>
      </View>

      {/* Menu Sections */}
      {menuSections.map(renderMenuSection)}

      {/* Contact Information */}
      <ContactInfo />

      {/* About Section */}
      <View style={styles.aboutSection}>
        <View style={styles.aboutHeader}>
          <Info size={20} color="#4CAF50" />
          <Text style={styles.aboutTitle}>About Hawky for Vendors</Text>
        </View>
        <Text style={styles.aboutDescription}>
          Hawky empowers street vendors and small businesses by providing a digital platform to reach more customers. 
          Manage your products, track orders, and grow your business with our vendor-focused tools and analytics.
        </Text>
        <Text style={styles.aboutMission}>
          Join thousands of vendors who are already growing their business with Hawky's digital marketplace.
        </Text>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <LogOut size={20} color="#FF3B30" />
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>

      {/* App Info */}
      <View style={styles.appInfo}>
        <Text style={styles.appVersion}>Hawky Vendor v1.0.0</Text>
        <Text style={styles.appTagline}>Empowering Street Vendors</Text>
        <Text style={styles.appSubtagline}>Grow Your Business Digitally</Text>
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
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 24,
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#1C1C1E',
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  profileInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileName: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#1C1C1E',
    marginBottom: 4,
  },
  profileEmail: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 2,
  },
  profilePhone: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 8,
  },
  businessName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#4CAF50',
  },
  profileStats: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#1C1C1E',
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#8E8E93',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#E5E5EA',
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
    fontSize: 16,
    color: '#1C1C1E',
  },
  statusBadge: {
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
  statusDetails: {
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
  menuSection: {
    marginTop: 24,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#8E8E93',
    marginHorizontal: 20,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionContent: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1C1C1E',
    marginBottom: 2,
  },
  menuItemSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8E8E93',
  },
  aboutSection: {
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
  aboutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  aboutTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#1C1C1E',
    marginLeft: 8,
  },
  aboutDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 20,
    marginBottom: 12,
  },
  aboutMission: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#4CAF50',
    lineHeight: 20,
    fontStyle: 'italic',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 24,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FF3B30',
  },
  logoutButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FF3B30',
    marginLeft: 8,
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingBottom: 100,
  },
  appVersion: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 4,
  },
  appTagline: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#4CAF50',
    textAlign: 'center',
    marginBottom: 4,
  },
  appSubtagline: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#C7C7CC',
    textAlign: 'center',
  },
});