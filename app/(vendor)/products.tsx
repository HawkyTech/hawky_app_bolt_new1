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
  Modal,
  TextInput,
  ScrollView,
} from 'react-native';
import { Plus, CreditCard as Edit, Trash2, Eye, EyeOff, Search, Filter, SlidersHorizontal, Camera, X, Check } from 'lucide-react-native';
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
  {
    id: '5',
    name: 'Samosa',
    description: 'Crispy triangular pastry with spiced potato filling',
    price: 20,
    category: 'Street Food',
    image: 'https://images.pexels.com/photos/1199957/pexels-photo-1199957.jpeg',
    isAvailable: true,
    preparationTime: 6,
  },
  {
    id: '6',
    name: 'Fresh Lime Soda',
    description: 'Refreshing lime soda with mint',
    price: 30,
    category: 'Beverages',
    image: 'https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg',
    isAvailable: true,
    preparationTime: 2,
  },
];

interface EditProductModalProps {
  visible: boolean;
  product: Product | null;
  onClose: () => void;
  onSave: (product: Product) => void;
}

function EditProductModal({ visible, product, onClose, onSave }: EditProductModalProps) {
  const [formData, setFormData] = useState<Product>({
    id: '',
    name: '',
    description: '',
    price: 0,
    category: 'Street Food',
    image: '',
    isAvailable: true,
    preparationTime: 5,
  });

  const categories = ['Street Food', 'Beverages', 'Snacks', 'Sweets', 'Other'];

  React.useEffect(() => {
    if (product) {
      setFormData(product);
    } else {
      setFormData({
        id: Date.now().toString(),
        name: '',
        description: '',
        price: 0,
        category: 'Street Food',
        image: '',
        isAvailable: true,
        preparationTime: 5,
      });
    }
  }, [product]);

  const handleSave = () => {
    if (!formData.name.trim() || !formData.description.trim() || formData.price <= 0) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }
    onSave(formData);
    onClose();
  };

  const handleImageUpload = () => {
    Alert.alert(
      'Add Photo',
      'Choose how you want to add a photo',
      [
        { text: 'Camera', onPress: () => console.log('Camera selected') },
        { text: 'Gallery', onPress: () => console.log('Gallery selected') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={onClose}>
            <X size={24} color="#8E8E93" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>
            {product ? 'Edit Product' : 'Add New Product'}
          </Text>
          <TouchableOpacity onPress={handleSave}>
            <Check size={24} color="#4CAF50" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
          {/* Product Image */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Product Photo</Text>
            <TouchableOpacity style={styles.imageUpload} onPress={handleImageUpload}>
              {formData.image ? (
                <Image source={{ uri: formData.image }} style={styles.uploadedImage} />
              ) : (
                <View style={styles.uploadPlaceholder}>
                  <Camera size={32} color="#8E8E93" />
                  <Text style={styles.uploadText}>Add Photo</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Product Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Product Name *</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter product name"
              value={formData.name}
              onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
            />
          </View>

          {/* Description */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Description *</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              placeholder="Describe your product..."
              value={formData.description}
              onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
              multiline
              numberOfLines={3}
            />
          </View>

          {/* Price and Prep Time */}
          <View style={styles.rowInputs}>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.inputLabel}>Price (₹) *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="0"
                value={formData.price.toString()}
                onChangeText={(text) => setFormData(prev => ({ ...prev, price: parseInt(text) || 0 }))}
                keyboardType="numeric"
              />
            </View>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.inputLabel}>Prep Time (min) *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="0"
                value={formData.preparationTime.toString()}
                onChangeText={(text) => setFormData(prev => ({ ...prev, preparationTime: parseInt(text) || 0 }))}
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Category */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Category *</Text>
            <View style={styles.categoryGrid}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryOption,
                    formData.category === category && styles.selectedCategoryOption
                  ]}
                  onPress={() => setFormData(prev => ({ ...prev, category }))}
                >
                  <Text style={[
                    styles.categoryOptionText,
                    formData.category === category && styles.selectedCategoryOptionText
                  ]}>
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Availability */}
          <View style={styles.inputGroup}>
            <View style={styles.switchContainer}>
              <Text style={styles.inputLabel}>Available for orders</Text>
              <Switch
                value={formData.isAvailable}
                onValueChange={(value) => setFormData(prev => ({ ...prev, isAvailable: value }))}
                trackColor={{ false: '#E5E5EA', true: '#4CAF50' }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

export default function ProductsScreen() {
  const [products, setProducts] = useState(mockProducts);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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

  const editProduct = (product: Product) => {
    setEditingProduct(product);
    setShowEditModal(true);
  };

  const addProduct = () => {
    setEditingProduct(null);
    setShowEditModal(true);
  };

  const handleSaveProduct = (product: Product) => {
    if (editingProduct) {
      // Update existing product
      setProducts(prev => 
        prev.map(p => p.id === product.id ? product : p)
      );
    } else {
      // Add new product
      setProducts(prev => [...prev, product]);
    }
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
      {product.image && (
        <Image source={{ uri: product.image }} style={styles.productImage} />
      )}
      <View style={styles.productInfo}>
        <View style={styles.productHeader}>
          <Text style={styles.productName} numberOfLines={1}>{product.name}</Text>
          <View style={styles.productActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => editProduct(product)}
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
      <TouchableOpacity style={styles.addFirstProductButton} onPress={addProduct}>
        <Text style={styles.addFirstProductButtonText}>Add Your First Product</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Products</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.filterButton} onPress={() => setShowFilters(!showFilters)}>
              <SlidersHorizontal size={20} color="#8E8E93" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.addButton} onPress={addProduct}>
              <Plus size={20} color="#FFFFFF" />
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={20} color="#8E8E93" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search products..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#8E8E93"
            />
          </View>
        </View>

        {/* Categories */}
        {showFilters && (
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
        )}

        {/* Products Count */}
        <View style={styles.countContainer}>
          <Text style={styles.countText}>
            {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
            {selectedCategory !== 'All' && ` in ${selectedCategory}`}
          </Text>
          <Text style={styles.availableCount}>
            {filteredProducts.filter(p => p.isAvailable).length} available
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

      {/* Edit/Add Product Modal */}
      <EditProductModal
        visible={showEditModal}
        product={editingProduct}
        onClose={() => setShowEditModal(false)}
        onSave={handleSaveProduct}
      />
    </>
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#1C1C1E',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  filterButton: {
    padding: 8,
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
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
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
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  countText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#1C1C1E',
  },
  availableCount: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#4CAF50',
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
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  modalHeader: {
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
  modalTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#1C1C1E',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1C1C1E',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#F2F2F7',
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#1C1C1E',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  imageUpload: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#F2F2F7',
    borderStyle: 'dashed',
    height: 200,
    overflow: 'hidden',
  },
  uploadPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  uploadText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1C1C1E',
    marginTop: 12,
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  rowInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryOption: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#F2F2F7',
    paddingHorizontal: 16,
    paddingVertical: 12,
    minWidth: 100,
  },
  selectedCategoryOption: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  categoryOptionText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#1C1C1E',
    textAlign: 'center',
  },
  selectedCategoryOptionText: {
    color: '#FFFFFF',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#F2F2F7',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
});