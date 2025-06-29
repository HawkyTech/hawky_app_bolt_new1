import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Linking,
  Alert,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ArrowLeft, Star, MapPin, Clock, Phone, MessageCircle, Heart, Share, ShoppingCart, CircleCheck as CheckCircle, Truck, CreditCard, Tag, Calendar, Navigation } from 'lucide-react-native';
import { useVendors } from '@/hooks/useVendors';
import { VendorProduct } from '@/types/vendor';
import { useCart } from '@/contexts/CartContext';
import AddToCartButton from '@/components/AddToCartButton';

const { width } = Dimensions.get('window');

export default function VendorProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getVendorById } = useVendors();
  const { totalItems } = useCart();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isFavorite, setIsFavorite] = useState(false);

  const vendor = getVendorById(id as string);

  if (!vendor) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Vendor not found</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const productCategories = ['All', ...Array.from(new Set(vendor.products.map(p => p.category)))];
  const filteredProducts = selectedCategory === 'All' 
    ? vendor.products 
    : vendor.products.filter(p => p.category === selectedCategory);

  const handleCall = () => {
    if (vendor.phoneNumber) {
      Linking.openURL(`tel:${vendor.phoneNumber}`);
    }
  };

  const handleWhatsApp = () => {
    if (vendor.whatsappNumber) {
      Linking.openURL(`whatsapp://send?phone=${vendor.whatsappNumber}`);
    }
  };

  const handleShare = () => {
    Alert.alert('Share Vendor', `Share ${vendor.name} with friends!`);
  };

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    Alert.alert(
      isFavorite ? 'Removed from Favorites' : 'Added to Favorites',
      `${vendor.name} ${isFavorite ? 'removed from' : 'added to'} your favorites`
    );
  };

  const handleGetDirections = () => {
    const url = `https://maps.google.com/?q=${vendor.location.latitude},${vendor.location.longitude}`;
    Linking.openURL(url);
  };

  const handleViewCart = () => {
    router.push('/(tabs)/cart');
  };

  const renderImageCarousel = () => (
    <View style={styles.imageCarousel}>
      <FlatList
        data={vendor.images}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          setSelectedImageIndex(index);
        }}
        renderItem={({ item }) => (
          <Image source={{ uri: item }} style={styles.carouselImage} />
        )}
        keyExtractor={(item, index) => index.toString()}
      />
      
      {/* Image Indicators */}
      <View style={styles.imageIndicators}>
        {vendor.images.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              index === selectedImageIndex && styles.activeIndicator
            ]}
          />
        ))}
      </View>

      {/* Header Actions */}
      <View style={styles.headerActions}>
        <TouchableOpacity style={styles.actionButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.rightActions}>
          <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
            <Share size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleFavorite}>
            <Heart size={20} color={isFavorite ? "#FF5722" : "#FFFFFF"} fill={isFavorite ? "#FF5722" : "none"} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Status Badge */}
      <View style={[styles.statusBadge, { backgroundColor: vendor.isOpen ? '#4CAF50' : '#FF5722' }]}>
        <Text style={styles.statusText}>{vendor.isOpen ? 'Open Now' : 'Closed'}</Text>
      </View>
    </View>
  );

  const renderVendorInfo = () => (
    <View style={styles.vendorInfo}>
      <View style={styles.vendorHeader}>
        <View style={styles.vendorTitleContainer}>
          <Text style={styles.vendorName}>{vendor.name}</Text>
          {vendor.isVerified && (
            <CheckCircle size={20} color="#4CAF50" style={styles.verifiedIcon} />
          )}
        </View>
        <Text style={styles.vendorCategory}>{vendor.category}</Text>
      </View>

      <Text style={styles.vendorDescription}>{vendor.description}</Text>

      {/* Rating and Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Star size={16} color="#FFD700" fill="#FFD700" />
          <Text style={styles.statText}>{vendor.averageRating}</Text>
          <Text style={styles.statSubtext}>({vendor.totalRatings} reviews)</Text>
        </View>
        <View style={styles.statItem}>
          <Clock size={16} color="#8E8E93" />
          <Text style={styles.statText}>{vendor.estimatedTime}</Text>
        </View>
        <View style={styles.statItem}>
          <Truck size={16} color="#8E8E93" />
          <Text style={styles.statText}>₹{vendor.deliveryFee} delivery</Text>
        </View>
      </View>

      {/* Special Offers */}
      {vendor.specialOffers && vendor.specialOffers.length > 0 && (
        <View style={styles.offersContainer}>
          <Text style={styles.offersTitle}>Special Offers</Text>
          {vendor.specialOffers.map((offer, index) => (
            <View key={index} style={styles.offerItem}>
              <Tag size={14} color="#FF5722" />
              <Text style={styles.offerText}>{offer}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Contact Actions */}
      <View style={styles.contactActions}>
        <TouchableOpacity style={styles.contactButton} onPress={handleCall}>
          <Phone size={20} color="#4CAF50" />
          <Text style={styles.contactButtonText}>Call</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.contactButton} onPress={handleWhatsApp}>
          <MessageCircle size={20} color="#25D366" />
          <Text style={styles.contactButtonText}>WhatsApp</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.contactButton} onPress={handleGetDirections}>
          <Navigation size={20} color="#2196F3" />
          <Text style={styles.contactButtonText}>Directions</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderLocationInfo = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Location & Hours</Text>
      <View style={styles.locationContainer}>
        <MapPin size={20} color="#4CAF50" />
        <View style={styles.locationTextContainer}>
          <Text style={styles.locationAddress}>{vendor.location.address}</Text>
          <Text style={styles.locationCity}>
            {vendor.location.city}, {vendor.location.state} {vendor.location.pincode}
          </Text>
          {vendor.location.landmark && (
            <Text style={styles.locationLandmark}>Near {vendor.location.landmark}</Text>
          )}
        </View>
      </View>

      {/* Business Hours */}
      <View style={styles.hoursContainer}>
        <Text style={styles.hoursTitle}>Business Hours</Text>
        {vendor.businessHours.map((hour, index) => (
          <View key={index} style={styles.hourItem}>
            <Text style={styles.dayText}>{hour.day}</Text>
            <Text style={[styles.timeText, !hour.isOpen && styles.closedText]}>
              {hour.isOpen ? `${hour.openTime} - ${hour.closeTime}` : 'Closed'}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderProductCategories = () => (
    <View style={styles.categoriesContainer}>
      <FlatList
        data={productCategories}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.categoryChip,
              selectedCategory === item && styles.selectedCategoryChip
            ]}
            onPress={() => setSelectedCategory(item)}
          >
            <Text style={[
              styles.categoryChipText,
              selectedCategory === item && styles.selectedCategoryChipText
            ]}>
              {item}
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item}
        contentContainerStyle={styles.categoriesList}
      />
    </View>
  );

  const renderProductCard = ({ item: product }: { item: VendorProduct }) => (
    <View style={styles.productCard}>
      {product.image && (
        <Image source={{ uri: product.image }} style={styles.productImage} />
      )}
      <View style={styles.productInfo}>
        <View style={styles.productHeader}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productPrice}>₹{product.price}</Text>
        </View>
        <Text style={styles.productDescription} numberOfLines={2}>
          {product.description}
        </Text>
        
        {/* Product Tags */}
        <View style={styles.productTags}>
          {product.isVegetarian && (
            <View style={[styles.dietTag, styles.vegTag]}>
              <Text style={styles.dietTagText}>VEG</Text>
            </View>
          )}
          {product.isVegan && (
            <View style={[styles.dietTag, styles.veganTag]}>
              <Text style={styles.dietTagText}>VEGAN</Text>
            </View>
          )}
          {product.spiceLevel && (
            <View style={styles.spiceTag}>
              <Text style={styles.spiceTagText}>{product.spiceLevel.toUpperCase()}</Text>
            </View>
          )}
        </View>

        <View style={styles.productFooter}>
          <View style={styles.productMeta}>
            <Clock size={14} color="#8E8E93" />
            <Text style={styles.prepTime}>{product.preparationTime} min</Text>
          </View>
          <AddToCartButton
            product={product}
            vendorId={vendor.id}
            vendorName={vendor.name}
            size="small"
          />
        </View>
      </View>
    </View>
  );

  const renderPaymentInfo = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Payment & Delivery</Text>
      <View style={styles.paymentContainer}>
        <View style={styles.paymentItem}>
          <CreditCard size={20} color="#4CAF50" />
          <View style={styles.paymentTextContainer}>
            <Text style={styles.paymentTitle}>Payment Methods</Text>
            <Text style={styles.paymentText}>{vendor.paymentMethods.join(', ')}</Text>
          </View>
        </View>
        <View style={styles.paymentItem}>
          <Truck size={20} color="#4CAF50" />
          <View style={styles.paymentTextContainer}>
            <Text style={styles.paymentTitle}>Delivery Info</Text>
            <Text style={styles.paymentText}>
              ₹{vendor.deliveryFee} fee • {vendor.deliveryRadius}km radius • Min order ₹{vendor.minimumOrder}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {renderImageCarousel()}
        {renderVendorInfo()}
        {renderLocationInfo()}
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Menu ({filteredProducts.length} items)</Text>
          {renderProductCategories()}
          <FlatList
            data={filteredProducts}
            renderItem={renderProductCard}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.productsList}
          />
        </View>

        {renderPaymentInfo()}
        
        {/* Bottom padding for floating cart button */}
        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Floating Cart Button */}
      {totalItems > 0 && (
        <TouchableOpacity 
          style={styles.floatingCartButton}
          onPress={handleViewCart}
          activeOpacity={0.8}
        >
          <View style={styles.cartButtonContent}>
            <View style={styles.cartButtonLeft}>
              <ShoppingCart size={20} color="#FFFFFF" />
              <Text style={styles.cartItemCount}>{totalItems} items</Text>
            </View>
            <Text style={styles.cartButtonText}>View Cart</Text>
          </View>
        </TouchableOpacity>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  errorText: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#FF3B30',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  imageCarousel: {
    position: 'relative',
    height: 300,
  },
  carouselImage: {
    width: width,
    height: 300,
    resizeMode: 'cover',
  },
  imageIndicators: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  activeIndicator: {
    backgroundColor: '#FFFFFF',
  },
  headerActions: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  rightActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusBadge: {
    position: 'absolute',
    top: 120,
    right: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    color: '#FFFFFF',
  },
  vendorInfo: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginTop: -20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  vendorHeader: {
    marginBottom: 16,
  },
  vendorTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  vendorName: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#1C1C1E',
  },
  verifiedIcon: {
    marginLeft: 8,
  },
  vendorCategory: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#4CAF50',
  },
  vendorDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#8E8E93',
    lineHeight: 24,
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    paddingVertical: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#1C1C1E',
    marginLeft: 6,
  },
  statSubtext: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#8E8E93',
    marginLeft: 4,
  },
  offersContainer: {
    marginBottom: 20,
  },
  offersTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1C1C1E',
    marginBottom: 12,
  },
  offerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  offerText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#FF5722',
    marginLeft: 8,
    flex: 1,
  },
  contactActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 12,
  },
  contactButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8F9FA',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  contactButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#1C1C1E',
    marginLeft: 8,
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginTop: 12,
    padding: 20,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#1C1C1E',
    marginBottom: 16,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  locationTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  locationAddress: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1C1C1E',
    marginBottom: 4,
  },
  locationCity: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 2,
  },
  locationLandmark: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#4CAF50',
  },
  hoursContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
  },
  hoursTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1C1C1E',
    marginBottom: 12,
  },
  hourItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dayText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#1C1C1E',
  },
  timeText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8E8E93',
  },
  closedText: {
    color: '#FF3B30',
  },
  categoriesContainer: {
    marginBottom: 20,
  },
  categoriesList: {
    paddingHorizontal: 0,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F2F2F7',
    marginRight: 12,
  },
  selectedCategoryChip: {
    backgroundColor: '#4CAF50',
  },
  categoryChipText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#8E8E93',
  },
  selectedCategoryChipText: {
    color: '#FFFFFF',
  },
  productsList: {
    paddingBottom: 20,
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  productImage: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
  },
  productInfo: {
    flex: 1,
    padding: 16,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  productName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1C1C1E',
    flex: 1,
  },
  productPrice: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#4CAF50',
  },
  productDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 20,
    marginBottom: 12,
  },
  productTags: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  dietTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  vegTag: {
    backgroundColor: '#4CAF50',
  },
  veganTag: {
    backgroundColor: '#8BC34A',
  },
  dietTagText: {
    fontFamily: 'Inter-Bold',
    fontSize: 10,
    color: '#FFFFFF',
  },
  spiceTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: '#FF5722',
  },
  spiceTagText: {
    fontFamily: 'Inter-Bold',
    fontSize: 10,
    color: '#FFFFFF',
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  prepTime: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#8E8E93',
    marginLeft: 4,
  },
  paymentContainer: {
    gap: 16,
  },
  paymentItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  paymentTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  paymentTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1C1C1E',
    marginBottom: 4,
  },
  paymentText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8E8E93',
  },
  bottomPadding: {
    height: 100,
  },
  floatingCartButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#4CAF50',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  cartButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cartButtonLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartItemCount: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 8,
  },
  cartButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
});