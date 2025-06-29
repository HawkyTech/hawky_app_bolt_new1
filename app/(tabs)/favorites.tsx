import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import {
  Heart,
  MapPin,
  Star,
  Clock,
  Trash2,
  Phone,
  MessageCircle,
} from 'lucide-react-native';

interface Vendor {
  id: string;
  name: string;
  category: string;
  rating: number;
  distance: string;
  isOpen: boolean;
  image: string;
  description: string;
  estimatedTime: string;
  price: string;
  isFavorite: boolean;
}

const favoriteVendors: Vendor[] = [
  {
    id: '1',
    name: 'Rajesh Chaat Corner',
    category: 'Street Food',
    rating: 4.8,
    distance: '0.2 km',
    isOpen: true,
    image: 'https://images.pexels.com/photos/1633525/pexels-photo-1633525.jpeg',
    description: 'Famous for spicy chaat and pani puri',
    estimatedTime: '5-10 min',
    price: '₹50-150',
    isFavorite: true,
  },
  {
    id: '2',
    name: 'Fresh Fruit Hub',
    category: 'Fruits',
    rating: 4.6,
    distance: '0.5 km',
    isOpen: true,
    image: 'https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg',
    description: 'Fresh seasonal fruits daily',
    estimatedTime: '10-15 min',
    price: '₹30-200',
    isFavorite: true,
  },
  {
    id: '3',
    name: 'Tea Point',
    category: 'Beverages',
    rating: 4.7,
    distance: '0.4 km',
    isOpen: false,
    image: 'https://images.pexels.com/photos/1833306/pexels-photo-1833306.jpeg',
    description: 'Best masala chai in the area',
    estimatedTime: '5-8 min',
    price: '₹10-50',
    isFavorite: true,
  },
];

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState(favoriteVendors);

  const removeFavorite = (vendorId: string, vendorName: string) => {
    Alert.alert(
      'Remove Favorite',
      `Remove ${vendorName} from favorites?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setFavorites(prev => prev.filter(vendor => vendor.id !== vendorId));
          },
        },
      ]
    );
  };

  const contactVendor = (vendorName: string) => {
    Alert.alert('Contact Vendor', `Contact ${vendorName}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Call', onPress: () => console.log('Calling vendor') },
      { text: 'Message', onPress: () => console.log('Messaging vendor') },
    ]);
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Heart size={64} color="#E5E5EA" />
      <Text style={styles.emptyTitle}>No Favorites Yet</Text>
      <Text style={styles.emptyDescription}>
        Start exploring and add your favorite vendors to see them here
      </Text>
      <TouchableOpacity style={styles.exploreButton}>
        <Text style={styles.exploreButtonText}>Explore Vendors</Text>
      </TouchableOpacity>
    </View>
  );

  const renderVendorCard = ({ item: vendor }: { item: Vendor }) => (
    <TouchableOpacity style={styles.vendorCard} activeOpacity={0.8}>
      <Image source={{ uri: vendor.image }} style={styles.vendorImage} />
      <View style={styles.vendorInfo}>
        <View style={styles.vendorHeader}>
          <View style={styles.vendorTitleContainer}>
            <Text style={styles.vendorName} numberOfLines={1}>{vendor.name}</Text>
            <Text style={styles.vendorCategory}>{vendor.category}</Text>
          </View>
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={() => removeFavorite(vendor.id, vendor.name)}
          >
            <Heart size={20} color="#4CAF50" fill="#4CAF50" />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.vendorDescription} numberOfLines={2}>
          {vendor.description}
        </Text>
        
        <Text style={styles.priceRange}>{vendor.price}</Text>
        
        <View style={styles.vendorFooter}>
          <View style={styles.vendorStats}>
            <View style={styles.ratingContainer}>
              <Star size={14} color="#FFD700" fill="#FFD700" />
              <Text style={styles.rating}>{vendor.rating}</Text>
            </View>
            <View style={styles.distanceContainer}>
              <MapPin size={14} color="#8E8E93" />
              <Text style={styles.distance}>{vendor.distance}</Text>
            </View>
            <View style={styles.timeContainer}>
              <Clock size={14} color="#8E8E93" />
              <Text style={styles.time}>{vendor.estimatedTime}</Text>
            </View>
          </View>
          
          <View style={styles.statusContainer}>
            <View style={[styles.statusBadge, { backgroundColor: vendor.isOpen ? '#4CAF50' : '#FF5722' }]}>
              <Text style={styles.statusText}>{vendor.isOpen ? 'Open' : 'Closed'}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.contactButton]}
            onPress={() => contactVendor(vendor.name)}
          >
            <Phone size={16} color="#4CAF50" />
            <Text style={styles.contactButtonText}>Contact</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.messageButton]}>
            <MessageCircle size={16} color="#FFFFFF" />
            <Text style={styles.messageButtonText}>Message</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Favorites</Text>
        <Text style={styles.headerSubtitle}>
          {favorites.length} vendor{favorites.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {/* Favorites List */}
      {favorites.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={favorites}
          renderItem={renderVendorCard}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.favoritesList}
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
    paddingBottom: 24,
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
  favoritesList: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 100,
  },
  vendorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  vendorImage: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  vendorInfo: {
    padding: 16,
  },
  vendorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  vendorTitleContainer: {
    flex: 1,
  },
  vendorName: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#1C1C1E',
    marginBottom: 2,
  },
  vendorCategory: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#4CAF50',
  },
  favoriteButton: {
    padding: 4,
  },
  vendorDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 8,
    lineHeight: 20,
  },
  priceRange: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1C1C1E',
    marginBottom: 12,
  },
  vendorFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  vendorStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  rating: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#1C1C1E',
    marginLeft: 4,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  distance: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8E8E93',
    marginLeft: 4,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  time: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8E8E93',
    marginLeft: 4,
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#FFFFFF',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
  },
  contactButton: {
    backgroundColor: '#E8F5E8',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  contactButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#4CAF50',
    marginLeft: 8,
  },
  messageButton: {
    backgroundColor: '#4CAF50',
  },
  messageButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#FFFFFF',
    marginLeft: 8,
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
    marginBottom: 32,
  },
  exploreButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  exploreButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
});