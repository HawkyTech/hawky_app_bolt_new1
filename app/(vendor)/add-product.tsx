import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Camera, Upload, ArrowRight, Check } from 'lucide-react-native';

export default function AddProductScreen() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    preparationTime: '',
    image: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const categories = [
    'Street Food',
    'Beverages',
    'Snacks',
    'Fruits',
    'Vegetables',
    'Sweets',
    'Other'
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.price.trim()) {
      newErrors.price = 'Price is required';
    } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = 'Please enter a valid price';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.preparationTime.trim()) {
      newErrors.preparationTime = 'Preparation time is required';
    } else if (isNaN(Number(formData.preparationTime)) || Number(formData.preparationTime) <= 0) {
      newErrors.preparationTime = 'Please enter a valid preparation time';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Success!',
        'Your product has been added successfully.',
        [{ text: 'OK', onPress: () => {
          // Reset form
          setFormData({
            name: '',
            description: '',
            price: '',
            category: '',
            preparationTime: '',
            image: '',
          });
        }}]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to add product. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
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

  const renderCategoryOption = (category: string) => (
    <TouchableOpacity
      key={category}
      style={[
        styles.categoryOption,
        formData.category === category && styles.selectedCategoryOption
      ]}
      onPress={() => updateFormData('category', category)}
    >
      <Text style={[
        styles.categoryOptionText,
        formData.category === category && styles.selectedCategoryOptionText
      ]}>
        {category}
      </Text>
      {formData.category === category && (
        <Check size={16} color="#FFFFFF" />
      )}
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Add New Product</Text>
          <Text style={styles.headerSubtitle}>
            Create a new product listing for your customers
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
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
                  <Text style={styles.uploadSubtext}>Tap to upload from camera or gallery</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Product Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Product Name *</Text>
            <TextInput
              style={[styles.textInput, errors.name && styles.inputError]}
              placeholder="Enter product name"
              placeholderTextColor="#C7C7CC"
              value={formData.name}
              onChangeText={(text) => updateFormData('name', text)}
              autoCapitalize="words"
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          </View>

          {/* Description */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Description *</Text>
            <TextInput
              style={[styles.textInput, styles.textArea, errors.description && styles.inputError]}
              placeholder="Describe your product..."
              placeholderTextColor="#C7C7CC"
              value={formData.description}
              onChangeText={(text) => updateFormData('description', text)}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
            {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
          </View>

          {/* Price and Preparation Time */}
          <View style={styles.rowInputs}>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.inputLabel}>Price (₹) *</Text>
              <TextInput
                style={[styles.textInput, errors.price && styles.inputError]}
                placeholder="0"
                placeholderTextColor="#C7C7CC"
                value={formData.price}
                onChangeText={(text) => updateFormData('price', text)}
                keyboardType="numeric"
              />
              {errors.price && <Text style={styles.errorText}>{errors.price}</Text>}
            </View>

            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.inputLabel}>Prep Time (min) *</Text>
              <TextInput
                style={[styles.textInput, errors.preparationTime && styles.inputError]}
                placeholder="0"
                placeholderTextColor="#C7C7CC"
                value={formData.preparationTime}
                onChangeText={(text) => updateFormData('preparationTime', text)}
                keyboardType="numeric"
              />
              {errors.preparationTime && <Text style={styles.errorText}>{errors.preparationTime}</Text>}
            </View>
          </View>

          {/* Category */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Category *</Text>
            <View style={styles.categoryGrid}>
              {categories.map(renderCategoryOption)}
            </View>
            {errors.category && <Text style={styles.errorText}>{errors.category}</Text>}
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            <Text style={styles.submitButtonText}>
              {isLoading ? 'Adding Product...' : 'Add Product'}
            </Text>
            {!isLoading && <ArrowRight size={20} color="#FFFFFF" />}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 24,
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#1C1C1E',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#8E8E93',
  },
  form: {
    paddingHorizontal: 20,
    paddingVertical: 24,
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
  inputError: {
    borderColor: '#FF3B30',
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#FF3B30',
    marginTop: 8,
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
  uploadSubtext: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    marginTop: 4,
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
    flexDirection: 'row',
    alignItems: 'center',
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
    flex: 1,
  },
  selectedCategoryOptionText: {
    color: '#FFFFFF',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    borderRadius: 16,
    paddingVertical: 16,
    marginTop: 32,
    marginBottom: 100,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#FFFFFF',
    marginRight: 8,
  },
});