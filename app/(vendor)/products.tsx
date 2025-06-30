import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  Switch,
} from 'react-native';
import { Plus, CreditCard as Edit, Trash2, Eye, EyeOff } from 'lucide-react-native';
import { Product } from '@/types/user';

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Pani Puri',
    description: 'Crispy puris filled with spicy water and chutneys',
    price: 60,
    category: 'Street Food',
    image: 'https://images.pexels.com/photos/1633525/pexels-photo-1633525.jpeg',
    isAvailable: true,
    preparationTime: 5,
  },
  {
    id: '2',
    name: 'Bhel Puri',
    description: 'Crunchy mix of puffed rice, vegetables, and tangy sauces',
    price: 50,
    category: 'Street Food',
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
    isAvailable: true,
    preparationTime: 3,
  },
  {
    id: '3',
    name: 'Vada Pav',
    description: 'Mumbai\'s favorite street food with spicy potato fritter',
    price: 25,
    category: 'Street Food',
    image: 'https://images.pexels.com/photos/1199957/pexels-photo-1199957.jpeg',
    isAvailable: false,
    preparationTime: 8,
  },
  {
    id: '4',
    name: 'Masala Chai',
    description: 'Traditional Indian spiced tea',
    price: 15,
    category: 'Beverages',
    image: 'https://images.pexels.com/photos/1833306/pexels-photo-1833306.jpeg',
    isAvailable: true,
    preparationTime: 2,
  },
];

export default function ProductsScreen() {
  const [products, setProducts] = useState(mockProducts);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Street Food', 'Beverages', 'Snacks'];

  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  const toggleAvailability = (productId: string) => {
    setProducts(prev => 
      prev.map(product => 
        product.id === productId 
          ? { ...product, isAvailable: !product.isAvailable }
          : product
      )
    );
  };

  const deleteProduct = (productId: string, productName: string) => {
    Alert.alert(
      'Delete Product',
      `Are you sure you want to delete "${productName}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setProducts(prev => prev.filter(product => product.id !== productId));
          },
        },
      ]
    );
  };

  const editProduct = (productId: string) => {
    Alert.alert('Edit Product', 'Product editing feature coming soon!');
  };

  const renderCategoryPill = (category: string) => (
    <TouchableOpacity
      key={category}
      style={[
        styles.categoryPill,
        selectedCategory === category && styles.selectedCategoryPill
      ]}
      onPress={() => setSelectedCategory(category)}
    >
      <Text style={[
        styles.categoryPillText,
        selectedCategory === category && styles.selectedCategoryPillText
      ]}>
        {category}
      </Text>
    </TouchableOpacity>
  );

  const renderProductCard = ({ item: product }: { item: Product }) => (
    <View style={styles.productCard}>
      <Image source={{ uri: product.image }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <View style={styles.productHeader}>
          <Text style={styles.productName} numberOfLines={1}>{product.name}</Text>
          <View style={styles.productActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => editProduct(product.id)}
            >
              <Edit size={16} color="#4CAF50" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => deleteProduct(product.id, product.name)}
            >
              <Trash2 size={16} color="#FF3B30" />
            </TouchableOpacity>
          </View>
        </View>
        
        <Text style={styles.productCategory}>{product.category}</Text>
        <Text style={styles.productDescription} numberOfLines={2}>
          {product.description}
        </Text>
        
        <View style={styles.productDetails}>
          <Text style={styles.productPrice}>₹{product.price}</Text>
          <Text style={styles.preparationTime}>{product.preparationTime} min</Text>
        </View>
        
        <View style={styles.productFooter}>
          <View style={styles.availabilityContainer}>
            {product.isAvailable ? (
              <Eye size={16} color="#4CAF50" />
            ) : (
              <EyeOff size={16} color="#8E8E93" />
            )}
            <Text style={[
              styles.availabilityText,
              { color: product.isAvailable ? '#4CAF50' : '#8E8E93' }
            ]}>
              {product.isAvailable ? 'Available' : 'Unavailable'}
            </Text>
          </View>
          
          <Switch
            value={product.isAvailable}
            onValueChange={() => toggleAvailability(product.id)}
            trackColor={{ false: '#E5E5EA', true: '#4CAF50' }}
            thumbColor={product.isAvailable ? '#FFFFFF' : '#FFFFFF'}
          />
        </View>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Plus size={64} color="#E5E5EA" />
      <Text style={styles.emptyTitle}>No Products Yet</Text>
      <Text style={styles.emptyDescription}>
        Start adding products to showcase your offerings to customers
      </Text>
      <TouchableOpacity style={styles.addFirstProductButton}>
        <Text style={styles.addFirstProductButtonText}>Add Your First Product</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Products</Text>
        <TouchableOpacity style={styles.addButton}>
          <Plus size={20} color="#FFFFFF" />
          <Text style={styles.addButtonText}>Add Product</Text>
        </TouchableOpacity>
      </View>

      {/* Categories */}
      <View style={styles.categoriesContainer}>
        <FlatList
          data={categories}
          renderItem={({ item }) => renderCategoryPill(item)}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      {/* Products Count */}
      <View style={styles.countContainer}>
        <Text style={styles.countText}>
          {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
          {selectedCategory !== 'All' && ` in ${selectedCategory}`}
        </Text>
      </View>

      {/* Products List */}
      {filteredProducts.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={filteredProducts}
          renderItem={renderProductCard}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.productsList}
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
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  addButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#FFFFFF',
    marginLeft: 4,
  },
  categoriesContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
  },
  categoriesList: {
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
  countContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  countText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#8E8E93',
  },
  productsList: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  productCard: {
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
  productImage: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  productInfo: {
    padding: 16,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  productName: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#1C1C1E',
    flex: 1,
  },
  productActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F8F9FA',
  },
  productCategory: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#4CAF50',
    marginBottom: 8,
  },
  productDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 20,
    marginBottom: 12,
  },
  productDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  productPrice: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#1C1C1E',
  },
  preparationTime: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8E8E93',
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  availabilityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  availabilityText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
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
  addFirstProductButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  addFirstProductButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
});