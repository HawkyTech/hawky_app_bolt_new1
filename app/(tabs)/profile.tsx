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
import { User, MapPin, Bell, CreditCard, CircleHelp as HelpCircle, Settings, Share, Star, Heart, ShoppingBag, ChevronRight, CreditCard as Edit, LogOut, Info } from 'lucide-react-native';
import ContactInfo from '@/components/ContactInfo';

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

export default function ProfileScreen() {
  const handleMenuPress = (itemTitle: string) => {
    Alert.alert('Feature', `${itemTitle} feature coming soon!`);
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: () => console.log('Logged out') },
      ]
    );
  };

  const menuSections: MenuSection[] = [
    {
      title: 'Account',
      items: [
        {
          id: '1',
          title: 'Edit Profile',
          subtitle: 'Update your personal information',
          icon: Edit,
          color: '#4CAF50',
          action: () => handleMenuPress('Edit Profile'),
        },
        {
          id: '2',
          title: 'My Addresses',
          subtitle: 'Manage delivery locations',
          icon: MapPin,
          color: '#66BB6A',
          action: () => handleMenuPress('My Addresses'),
        },
        {
          id: '3',
          title: 'Payment Methods',
          subtitle: 'Manage cards and payments',
          icon: CreditCard,
          color: '#81C784',
          action: () => handleMenuPress('Payment Methods'),
        },
      ],
    },
    {
      title: 'Activity',
      items: [
        {
          id: '4',
          title: 'Order History',
          subtitle: '12 orders completed',
          icon: ShoppingBag,
          color: '#A5D6A7',
          action: () => handleMenuPress('Order History'),
        },
        {
          id: '5',
          title: 'My Reviews',
          subtitle: '8 reviews written',
          icon: Star,
          color: '#FFD700',
          action: () => handleMenuPress('My Reviews'),
        },
        {
          id: '6',
          title: 'Favorites',
          subtitle: '5 vendors saved',
          icon: Heart,
          color: '#E91E63',
          action: () => handleMenuPress('Favorites'),
        },
      ],
    },
    {
      title: 'Preferences',
      items: [
        {
          id: '7',
          title: 'Notifications',
          subtitle: 'Push notifications, email alerts',
          icon: Bell,
          color: '#FF9800',
          action: () => handleMenuPress('Notifications'),
        },
        {
          id: '8',
          title: 'Settings',
          subtitle: 'App preferences and privacy',
          icon: Settings,
          color: '#607D8B',
          action: () => handleMenuPress('Settings'),
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          id: '9',
          title: 'Help Center',
          subtitle: 'FAQ and support articles',
          icon: HelpCircle,
          color: '#795548',
          action: () => handleMenuPress('Help Center'),
        },
        {
          id: '10',
          title: 'Share App',
          subtitle: 'Invite friends to Hawky',
          icon: Share,
          color: '#3F51B5',
          action: () => handleMenuPress('Share App'),
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
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      {/* Profile Card */}
      <View style={styles.profileCard}>
        <View style={styles.profileImageContainer}>
          <Image
            source={{ uri: 'https://images.pexels.com/photos/1382731/pexels-photo-1382731.jpeg' }}
            style={styles.profileImage}
          />
          <TouchableOpacity style={styles.editImageButton}>
            <Edit size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>Arjun Patel</Text>
          <Text style={styles.profileEmail}>arjun.patel@email.com</Text>
          <Text style={styles.profilePhone}>+91 98765 43210</Text>
        </View>
        <View style={styles.profileStats}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Orders</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>4.8</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>5</Text>
            <Text style={styles.statLabel}>Favorites</Text>
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
          <Text style={styles.aboutTitle}>About Hawky</Text>
        </View>
        <Text style={styles.aboutDescription}>
          Hawky connects you with local street vendors and small businesses in your area. We're committed to empowering India's street vendor economy by providing a digital platform that helps vendors reach more customers while offering you convenient access to authentic local products and services.
        </Text>
        <Text style={styles.aboutMission}>
          Our mission is to bridge the gap between traditional street commerce and modern convenience, supporting local entrepreneurs while serving our community.
        </Text>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <LogOut size={20} color="#FF3B30" />
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>

      {/* App Info */}
      <View style={styles.appInfo}>
        <Text style={styles.appVersion}>Hawky v1.0.0</Text>
        <Text style={styles.appTagline}>From Street Carts to Your Cart</Text>
        <Text style={styles.appSubtagline}>Empowering India's Street Vendor Economy</Text>
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