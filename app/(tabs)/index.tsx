import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Dimensions,
  Alert,
  Platform,
  FlatList,
  Animated,
} from 'react-native';
import {
  MapPin,
  Search,
  Star,
  Clock,
  Filter,
  Truck,
  Coffee,
  Apple,
  ShoppingBag,
  Navigation,
  RefreshCw,
  ShoppingCart,
  Plus,
  Heart,
  Zap,
  Package,
  Carrot,
  Eye,
} from 'lucide-react-native';
import { router } from 'expo-router';
import { useLocation } from '@/contexts/LocationContext';
import { useVendors } from '@/hooks/useVendors';
import { useCart } from '@/contexts/CartContext';
import LocationPermissionModal from '@/components/LocationPermissionModal';

const { width } = Dimensions.get('window');

const categories = [
  { id: '1', name: 'Street Food', icon: Coffee, color: '#4CAF50', available: true },
  { id: '2', name: 'Fruits', icon: Apple, color: '#FF9800', available: true },
  { id: '3', name: 'Vegetables', icon: Carrot, color: '#8BC34A', available: true },
  { id: '4', name: 'Clothing', icon: ShoppingBag, color: '#9C27B0', available: false },
  { id: '5', name: 'Essentials', icon: Package, color: '#2196F3', available: false },
];

export default function HomeScreen() {
  const { location, address, isLoading, error, requestLocation, calculateDistance, refreshLocation } = useLocation();
  const { vendors, getFeaturedVendors, getNearbyVendors, searchVendors } = useVendors();
  const { totalItems } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [scrollY] = useState(new Animated.Value(0));

  useEffect(() => {
    // Show location permission modal if location is not available and not loading
    if (!location && !isLoading && !error) {
      setShowLocationModal(true);
    }
  }, [location, isLoading, error]);

  const handleLocationAllow = async () => {
    setShowLocationModal(false);
    await requestLocation();
  };

  const handleLocationDeny = () => {
    setShowLocationModal(false);
    Alert.alert(
      'Location Disabled',
      'You can enable location services later in your device settings to get accurate vendor distances.',
      [{ text: 'OK' }]
    );
  };

  const handleRefreshLocation = async () => {
    await refreshLocation();
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      const results = searchVendors(searchQuery);
      Alert.alert('Search Results', `Found ${results.length} vendors matching "${searchQuery}"`);
    }
  };

  const handleCategoryPress = (category: any) => {
    if (!category.available) {
      Alert.alert(
        'Coming Soon',
        `${category.name} vendors will be available soon! We're working hard to bring you the best local ${category.name.toLowerCase()} vendors.`,
        [{ text: 'OK', style: 'default' }]
      );
    } else {
      Alert.alert('Category', `Browse ${category.name} vendors`);
    }
  };

  const handleVendorPress = (vendorId: string) => {
    router.push(`/(tabs)/vendor-profile/${vendorId}`);
  };

  const handleCartPress = () => {
    if (totalItems > 0) {
      Alert.alert('Cart', `You have ${totalItems} items in your cart`);
    } else {
      Alert.alert('Cart', 'Your cart is empty');
    }
  };

  const handleFavoritePress = (vendorId: string) => {
    Alert.alert('Favorite', 'Added to favorites!');
  };

  const featuredVendors = getFeaturedVendors();
  const nearbyVendors = getNearbyVendors();

  const renderCategoryCard = (category: any) => {
    const IconComponent = category.icon;
    return (
      <TouchableOpacity 
        key={category.id} 
        style={[styles.categoryCard, !category.available && styles.categoryCardDisabled]} 
        activeOpacity={0.8}
        onPress={() => handleCategoryPress(category)}
      >
        <View style={[
          styles.categoryIcon, 
          { backgroundColor: `${category.color}15` },
          !category.available && styles.categoryIconDisabled
        ]}>
          <IconComponent 
            size={28} 
            color={category.available ? category.color : '#C7C7CC'} 
          />
        </View>
        <Text style={[
          styles.categoryName,
          !category.available && styles.categoryNameDisabled
        ]}>
          {category.name}
        </Text>
        {!category.available && (
          <Text style={styles.comingSoonText}>Coming Soon</Text>
        )}
      </TouchableOpacity>
    );
  };

  const renderFeaturedVendor = ({ item: vendor }: { item: any }) => {
    const distance = location && calculateDistance 
      ? calculateDistance(vendor.location.latitude, vendor.location.longitude)
      : null;

    return (
      <TouchableOpacity 
        style={styles.featuredVendorCard}
        activeOpacity={0.9}
        onPress={() => handleVendorPress(vendor.id)}
      >
        <Image source={{ uri: vendor.image }} style={styles.featuredVendorImage} />
        
        {/* Favorite Button */}
        <TouchableOpacity 
          style={styles.favoriteButton}
          onPress={() => handleFavoritePress(vendor.id)}
        >
          <Heart size={16} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Special Offer Badge */}
        {vendor.specialOffers && vendor.specialOffers.length > 0 && (
          <View style={styles.offerBadge}>
            <Zap size={12} color="#FFFFFF" />
            <Text style={styles.offerText}>OFFER</Text>
          </View>
        )}

        <View style={styles.featuredVendorInfo}>
          <View style={styles.featuredVendorHeader}>
            <Text style={styles.featuredVendorName} numberOfLines={1}>{vendor.name}</Text>
            <View style={[styles.statusBadge, { backgroundColor: vendor.isOpen ? '#4CAF50' : '#FF5722' }]}>
              <Text style={styles.statusText}>{vendor.isOpen ? 'Open' : 'Closed'}</Text>
            </View>
          </View>
          
          <Text style={styles.featuredVendorCategory}>{vendor.category}</Text>
          <Text style={styles.featuredVendorDescription} numberOfLines={2}>{vendor.description}</Text>
          
          {vendor.specialOffers && vendor.specialOffers.length > 0 && (
            <Text style={styles.specialOfferText} numberOfLines={1}>{vendor.specialOffers[0]}</Text>
          )}
          
          <View style={styles.featuredVendorFooter}>
            <View style={styles.ratingContainer}>
              <Star size={14} color="#FFD700" fill="#FFD700" />
              <Text style={styles.rating}>{vendor.averageRating}</Text>
            </View>
            <View style={styles.distanceContainer}>
              <MapPin size={14} color="#8E8E93" />
              <Text style={styles.distance}>
                {distance ? `${distance} km` : vendor.estimatedTime}
              </Text>
            </View>
            <View style={styles.timeContainer}>
              <Clock size={14} color="#8E8E93" />
              <Text style={styles.time}>{vendor.estimatedTime}</Text>
            </View>
          </View>

          {/* View Profile Button */}
          <TouchableOpacity 
            style={styles.viewProfileButton}
            onPress={() => handleVendorPress(vendor.id)}
          >
            <Eye size={16} color="#4CAF50" />
            <Text style={styles.viewProfileText}>View Profile</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const renderNearbyVendor = ({ item: vendor }: { item: any }) => {
    const distance = location && calculateDistance 
      ? calculateDistance(vendor.location.latitude, vendor.location.longitude)
      : null;

    return (
      <TouchableOpacity 
        style={styles.nearbyVendorCard}
        activeOpacity={0.9}
        onPress={() => handleVendorPress(vendor.id)}
      >
        <Image source={{ uri: vendor.image }} style={styles.nearbyVendorImage} />
        <View style={styles.nearbyVendorInfo}>
          <View style={styles.nearbyVendorHeader}>
            <Text style={styles.nearbyVendorName} numberOfLines={1}>{vendor.name}</Text>
            <TouchableOpacity 
              style={styles.nearbyFavoriteButton}
              onPress={() => handleFavoritePress(vendor.id)}
            >
              <Heart size={14} color="#8E8E93" />
            </TouchableOpacity>
          </View>
          <Text style={styles.nearbyVendorCategory}>{vendor.category}</Text>
          <Text style={styles.nearbyVendorDescription} numberOfLines={1}>{vendor.description}</Text>
          <View style={styles.nearbyVendorFooter}>
            <View style={styles.ratingContainer}>
              <Star size={12} color="#FFD700" fill="#FFD700" />
              <Text style={styles.nearbyRating}>{vendor.averageRating}</Text>
            </View>
            <View style={styles.distanceContainer}>
              <MapPin size={12} color="#8E8E93" />
              <Text style={styles.nearbyDistance}>
                {distance ? `${distance} km` : vendor.estimatedTime}
              </Text>
            </View>
            <View style={[styles.nearbyStatusBadge, { backgroundColor: vendor.isOpen ? '#4CAF50' : '#FF5722' }]}>
              <Text style={styles.nearbyStatusText}>{vendor.isOpen ? 'Open' : 'Closed'}</Text>
            </View>
          </View>

          {/* View Profile Button */}
          <TouchableOpacity 
            style={styles.nearbyViewProfileButton}
            onPress={() => handleVendorPress(vendor.id)}
          >
            <Eye size={14} color="#4CAF50" />
            <Text style={styles.nearbyViewProfileText}>View Profile</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <View style={styles.container}>
        <Animated.ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.locationContainer}>
              <MapPin size={20} color="#4CAF50" />
              <View style={styles.locationTextContainer}>
                {isLoading ? (
                  <Text style={styles.locationText}>Detecting location...</Text>
                ) : error ? (
                  <Text style={styles.locationText}>Bengaluru, Karnataka</Text>
                ) : (
                  <Text style={styles.locationText} numberOfLines={1}>
                    {address || 'Bengaluru, Karnataka'}
                  </Text>
                )}
                <Text style={styles.locationSubtext}>Available only in Bengaluru</Text>
              </View>
              {location && (
                <TouchableOpacity 
                  style={styles.refreshButton} 
                  onPress={handleRefreshLocation}
                  disabled={isLoading}
                >
                  <RefreshCw size={16} color="#4CAF50" />
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity style={styles.filterButton}>
              <Filter size={20} color="#8E8E93" />
            </TouchableOpacity>
          </View>

          {/* Location Status Banner */}
          {error && (
            <View style={styles.locationBanner}>
              <Navigation size={16} color="#FF9800" />
              <Text style={styles.locationBannerText}>
                Location services disabled. Enable for accurate distances.
              </Text>
              <TouchableOpacity onPress={() => setShowLocationModal(true)}>
                <Text style={styles.locationBannerAction}>Enable</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <Search size={20} color="#8E8E93" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search vendors, food, items..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={handleSearch}
                placeholderTextColor="#8E8E93"
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Text style={styles.clearSearch}>✕</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Categories */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
              {categories.map(renderCategoryCard)}
            </ScrollView>
          </View>

          {/* Featured Vendors */}
          {featuredVendors.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Featured Vendors</Text>
                <TouchableOpacity>
                  <Text style={styles.seeAllText}>See All</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                data={featuredVendors}
                renderItem={renderFeaturedVendor}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.featuredVendorsList}
              />
            </View>
          )}

          {/* Explore Nearby Vendors */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Explore Nearby Vendors</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={nearbyVendors}
              renderItem={renderNearbyVendor}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.nearbyVendorsList}
            />
          </View>

          {/* Bottom Padding for Floating Button */}
          <View style={styles.bottomPadding} />
        </Animated.ScrollView>

        {/* Floating Cart Button */}
        <TouchableOpacity 
          style={styles.floatingCartButton}
          onPress={handleCartPress}
          activeOpacity={0.8}
        >
          <ShoppingCart size={24} color="#FFFFFF" />
          {totalItems > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{totalItems}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Location Permission Modal */}
      <LocationPermissionModal
        visible={showLocationModal}
        onAllow={handleLocationAllow}
        onDeny={handleLocationDeny}
        onClose={() => setShowLocationModal(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollView: {
    flex: 1,
  },
  header: {
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
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  locationTextContainer: {
    flex: 1,
    marginLeft: 8,
    marginRight: 8,
  },
  locationText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1C1C1E',
  },
  locationSubtext: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#8E8E93',
  },
  refreshButton: {
    padding: 4,
  },
  filterButton: {
    padding: 8,
  },
  locationBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#FFE0B2',
  },
  locationBannerText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#F57C00',
    flex: 1,
    marginLeft: 8,
  },
  locationBannerAction: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#FF9800',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 52,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#1C1C1E',
    marginLeft: 12,
  },
  clearSearch: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#8E8E93',
    padding: 4,
  },
  section: {
    marginTop: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 22,
    color: '#1C1C1E',
  },
  seeAllText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#4CAF50',
  },
  categoriesContainer: {
    paddingLeft: 20,
  },
  categoryCard: {
    alignItems: 'center',
    marginRight: 24,
    width: 90,
  },
  categoryCardDisabled: {
    opacity: 0.6,
  },
  categoryIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  categoryIconDisabled: {
    backgroundColor: '#F2F2F7',
  },
  categoryName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#1C1C1E',
    textAlign: 'center',
    marginBottom: 4,
  },
  categoryNameDisabled: {
    color: '#8E8E93',
  },
  comingSoonText: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    color: '#4CAF50',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  featuredVendorsList: {
    paddingLeft: 20,
    paddingRight: 20,
  },
  featuredVendorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    marginRight: 16,
    width: width * 0.8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  featuredVendorImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  favoriteButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  offerBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF5722',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  offerText: {
    fontFamily: 'Inter-Bold',
    fontSize: 10,
    color: '#FFFFFF',
    marginLeft: 4,
  },
  featuredVendorInfo: {
    padding: 20,
  },
  featuredVendorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  featuredVendorName: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#1C1C1E',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 11,
    color: '#FFFFFF',
  },
  featuredVendorCategory: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#4CAF50',
    marginBottom: 8,
  },
  featuredVendorDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: '#8E8E93',
    lineHeight: 22,
    marginBottom: 12,
  },
  specialOfferText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 13,
    color: '#FF5722',
    marginBottom: 16,
  },
  featuredVendorFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#1C1C1E',
    marginLeft: 4,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
  viewProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8F5E8',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  viewProfileText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#4CAF50',
    marginLeft: 8,
  },
  nearbyVendorsList: {
    paddingHorizontal: 20,
  },
  nearbyVendorCard: {
    flexDirection: 'row',
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
  nearbyVendorImage: {
    width: 100,
    height: 120,
    resizeMode: 'cover',
  },
  nearbyVendorInfo: {
    flex: 1,
    padding: 16,
  },
  nearbyVendorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  nearbyVendorName: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#1C1C1E',
    flex: 1,
  },
  nearbyFavoriteButton: {
    padding: 4,
  },
  nearbyVendorCategory: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    color: '#4CAF50',
    marginBottom: 6,
  },
  nearbyVendorDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 12,
  },
  nearbyVendorFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  nearbyRating: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    color: '#1C1C1E',
    marginLeft: 4,
  },
  nearbyDistance: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#8E8E93',
    marginLeft: 4,
  },
  nearbyStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  nearbyStatusText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 10,
    color: '#FFFFFF',
  },
  nearbyViewProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8F9FA',
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  nearbyViewProfileText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    color: '#4CAF50',
    marginLeft: 6,
  },
  bottomPadding: {
    height: 100,
  },
  floatingCartButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FF5722',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  cartBadgeText: {
    fontFamily: 'Inter-Bold',
    fontSize: 12,
    color: '#FFFFFF',
  },
});