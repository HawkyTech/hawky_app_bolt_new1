import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
} from 'react-native';
import { Search, Filter, MapPin, Star, Clock, SlidersHorizontal, Grid2x2 as Grid, List } from 'lucide-react-native';

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
}

const categories = [
  'All', 'Street Food', 'Fruits', 'Vegetables', 'Clothing', 'Electronics', 'Beverages'
];

const vendors: Vendor[] = [
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
  },
  {
    id: '3',
    name: 'Green Veggie Cart',
    category: 'Vegetables',
    rating: 4.4,
    distance: '0.3 km',
    isOpen: true,
    image: 'https://images.pexels.com/photos/1508666/pexels-photo-1508666.jpeg',
    description: 'Fresh farm vegetables',
    estimatedTime: '5-10 min',
    price: '₹20-100',
  },
  {
    id: '4',
    name: 'Style Street',
    category: 'Clothing',
    rating: 4.2,
    distance: '0.7 km',
    isOpen: true,
    image: 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg',
    description: 'Trendy clothes at great prices',
    estimatedTime: '10-15 min',
    price: '₹200-1000',
  },
  {
    id: '5',
    name: 'Tea Point',
    category: 'Beverages',
    rating: 4.7,
    distance: '0.4 km',
    isOpen: false,
    image: 'https://images.pexels.com/photos/1833306/pexels-photo-1833306.jpeg',
    description: 'Best masala chai in the area',
    estimatedTime: '5-8 min',
    price: '₹10-50',
  },
];

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isGridView, setIsGridView] = useState(false);
  const [filteredVendors, setFilteredVendors] = useState(vendors);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    filterVendors(query, selectedCategory);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    filterVendors(searchQuery, category);
  };

  const filterVendors = (query: string, category: string) => {
    let filtered = vendors;

    if (category !== 'All') {
      filtered = filtered.filter(vendor => vendor.category === category);
    }

    if (query.trim()) {
      filtered = filtered.filter(vendor =>
        vendor.name.toLowerCase().includes(query.toLowerCase()) ||
        vendor.category.toLowerCase().includes(query.toLowerCase()) ||
        vendor.description.toLowerCase().includes(query.toLowerCase())
      );
    }

    setFilteredVendors(filtered);
  };

  const renderCategoryPill = (category: string) => (
    <TouchableOpacity
      key={category}
      style={[
        styles.categoryPill,
        selectedCategory === category && styles.selectedCategoryPill
      ]}
      onPress={() => handleCategoryChange(category)}
    >
      <Text style={[
        styles.categoryPillText,
        selectedCategory === category && styles.selectedCategoryPillText
      ]}>
        {category}
      </Text>
    </TouchableOpacity>
  );

  const renderVendorCard = ({ item: vendor }: { item: Vendor }) => (
    <TouchableOpacity 
      style={[styles.vendorCard, isGridView && styles.gridVendorCard]}
      activeOpacity={0.8}
    >
      <Image source={{ uri: vendor.image }} style={[styles.vendorImage, isGridView && styles.gridVendorImage]} />
      <View style={styles.vendorInfo}>
        <View style={styles.vendorHeader}>
          <Text style={styles.vendorName} numberOfLines={1}>{vendor.name}</Text>
          <View style={[styles.statusBadge, { backgroundColor: vendor.isOpen ? '#4CAF50' : '#FF5722' }]}>
            <Text style={styles.statusText}>{vendor.isOpen ? 'Open' : 'Closed'}</Text>
          </View>
        </View>
        <Text style={styles.vendorCategory}>{vendor.category}</Text>
        <Text style={styles.vendorDescription} numberOfLines={isGridView ? 1 : 2}>
          {vendor.description}
        </Text>
        <Text style={styles.priceRange}>{vendor.price}</Text>
        <View style={styles.vendorFooter}>
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
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Search Vendors</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.viewToggle}
            onPress={() => setIsGridView(!isGridView)}
          >
            {isGridView ? <List size={20} color="#8E8E93" /> : <Grid size={20} color="#8E8E93" />}
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton}>
            <SlidersHorizontal size={20} color="#8E8E93" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color="#8E8E93" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search vendors, food, items..."
            value={searchQuery}
            onChangeText={handleSearch}
            placeholderTextColor="#8E8E93"
          />
        </View>
      </View>

      {/* Categories */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        {categories.map(renderCategoryPill)}
      </ScrollView>

      {/* Results */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsCount}>
          {filteredVendors.length} vendors found
        </Text>
      </View>

      {/* Vendors List */}
      <FlatList
        data={filteredVendors}
        renderItem={renderVendorCard}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.vendorsList}
        numColumns={isGridView ? 2 : 1}
        key={isGridView ? 'grid' : 'list'}
        columnWrapperStyle={isGridView ? styles.gridRow : undefined}
      />
    </View>
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
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#1C1C1E',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewToggle: {
    padding: 8,
    marginRight: 8,
  },
  filterButton: {
    padding: 8,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#1C1C1E',
    marginLeft: 12,
  },
  categoriesContainer: {
    backgroundColor: '#FFFFFF',
    paddingBottom: 16,
  },
  categoriesContent: {
    paddingHorizontal: 20,
  },
  categoryPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F2F2F7',
    marginRight: 12,
  },
  selectedCategoryPill: {
    backgroundColor: '#4CAF50',
  },
  categoryPillText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#8E8E93',
  },
  selectedCategoryPillText: {
    color: '#FFFFFF',
  },
  resultsHeader: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  resultsCount: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#8E8E93',
  },
  vendorsList: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  gridRow: {
    justifyContent: 'space-between',
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
  gridVendorCard: {
    width: '48%',
  },
  vendorImage: {
    width: '100%',
    height: 140,
    resizeMode: 'cover',
  },
  gridVendorImage: {
    height: 120,
  },
  vendorInfo: {
    padding: 16,
  },
  vendorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  vendorName: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#1C1C1E',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontFamily: 'Inter-Medium',
    fontSize: 10,
    color: '#FFFFFF',
  },
  vendorCategory: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#4CAF50',
    marginBottom: 4,
  },
  vendorDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 8,
  },
  priceRange: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#1C1C1E',
    marginBottom: 12,
  },
  vendorFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#1C1C1E',
    marginLeft: 4,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distance: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#8E8E93',
    marginLeft: 4,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  time: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#8E8E93',
    marginLeft: 4,
  },
});