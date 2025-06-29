import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { User, Mail, Phone, MapPin, MessageCircle, CreditCard } from 'lucide-react-native';
import { CheckoutFormData } from '@/types/payment';

interface CheckoutFormProps {
  onSubmit: (formData: CheckoutFormData) => void;
  isLoading: boolean;
}

export default function CheckoutForm({ onSubmit, isLoading }: CheckoutFormProps) {
  const [formData, setFormData] = useState<CheckoutFormData>({
    customerName: '',
    phoneNumber: '',
    email: '',
    deliveryAddress: {
      street: '',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '',
      landmark: '',
    },
    specialInstructions: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Customer name validation
    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Name is required';
    } else if (formData.customerName.trim().length < 2) {
      newErrors.customerName = 'Name must be at least 2 characters';
    }

    // Phone number validation
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^[6-9]\d{9}$/.test(formData.phoneNumber.replace(/\s+/g, ''))) {
      newErrors.phoneNumber = 'Please enter a valid 10-digit phone number';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Address validation
    if (!formData.deliveryAddress.street.trim()) {
      newErrors.street = 'Street address is required';
    }

    if (!formData.deliveryAddress.pincode.trim()) {
      newErrors.pincode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(formData.deliveryAddress.pincode)) {
      newErrors.pincode = 'Please enter a valid 6-digit pincode';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const updateFormData = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof CheckoutFormData],
          [child]: value,
        },
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Delivery Information</Text>

      {/* Customer Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Customer Details</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Full Name *</Text>
          <View style={[styles.inputContainer, errors.customerName && styles.inputError]}>
            <User size={20} color="#8E8E93" style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              placeholder="Enter your full name"
              placeholderTextColor="#C7C7CC"
              value={formData.customerName}
              onChangeText={(text) => updateFormData('customerName', text)}
              autoCapitalize="words"
            />
          </View>
          {errors.customerName && <Text style={styles.errorText}>{errors.customerName}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Phone Number *</Text>
          <View style={[styles.inputContainer, errors.phoneNumber && styles.inputError]}>
            <Phone size={20} color="#8E8E93" style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              placeholder="Enter your phone number"
              placeholderTextColor="#C7C7CC"
              value={formData.phoneNumber}
              onChangeText={(text) => updateFormData('phoneNumber', text)}
              keyboardType="phone-pad"
              maxLength={10}
            />
          </View>
          {errors.phoneNumber && <Text style={styles.errorText}>{errors.phoneNumber}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Email Address *</Text>
          <View style={[styles.inputContainer, errors.email && styles.inputError]}>
            <Mail size={20} color="#8E8E93" style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              placeholder="Enter your email"
              placeholderTextColor="#C7C7CC"
              value={formData.email}
              onChangeText={(text) => updateFormData('email', text)}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        </View>
      </View>

      {/* Delivery Address */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Delivery Address</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Street Address *</Text>
          <View style={[styles.inputContainer, errors.street && styles.inputError]}>
            <MapPin size={20} color="#8E8E93" style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              placeholder="House/Flat no, Building, Street"
              placeholderTextColor="#C7C7CC"
              value={formData.deliveryAddress.street}
              onChangeText={(text) => updateFormData('deliveryAddress.street', text)}
              multiline
            />
          </View>
          {errors.street && <Text style={styles.errorText}>{errors.street}</Text>}
        </View>

        <View style={styles.rowInputs}>
          <View style={[styles.inputGroup, styles.halfWidth]}>
            <Text style={styles.inputLabel}>City</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                value={formData.deliveryAddress.city}
                onChangeText={(text) => updateFormData('deliveryAddress.city', text)}
                editable={false}
              />
            </View>
          </View>

          <View style={[styles.inputGroup, styles.halfWidth]}>
            <Text style={styles.inputLabel}>State</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                value={formData.deliveryAddress.state}
                onChangeText={(text) => updateFormData('deliveryAddress.state', text)}
                editable={false}
              />
            </View>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Pincode *</Text>
          <View style={[styles.inputContainer, errors.pincode && styles.inputError]}>
            <TextInput
              style={styles.textInput}
              placeholder="Enter 6-digit pincode"
              placeholderTextColor="#C7C7CC"
              value={formData.deliveryAddress.pincode}
              onChangeText={(text) => updateFormData('deliveryAddress.pincode', text)}
              keyboardType="numeric"
              maxLength={6}
            />
          </View>
          {errors.pincode && <Text style={styles.errorText}>{errors.pincode}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Landmark (Optional)</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Nearby landmark for easy delivery"
              placeholderTextColor="#C7C7CC"
              value={formData.deliveryAddress.landmark}
              onChangeText={(text) => updateFormData('deliveryAddress.landmark', text)}
            />
          </View>
        </View>
      </View>

      {/* Special Instructions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Special Instructions (Optional)</Text>
        <View style={styles.inputGroup}>
          <View style={[styles.inputContainer, styles.textAreaContainer]}>
            <MessageCircle size={20} color="#8E8E93" style={styles.inputIcon} />
            <TextInput
              style={[styles.textInput, styles.textArea]}
              placeholder="Any special instructions for delivery..."
              placeholderTextColor="#C7C7CC"
              value={formData.specialInstructions}
              onChangeText={(text) => updateFormData('specialInstructions', text)}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>
        </View>
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={isLoading}
      >
        <CreditCard size={20} color="#FFFFFF" />
        <Text style={styles.submitButtonText}>
          {isLoading ? 'Processing...' : 'Proceed to Payment'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#1C1C1E',
    marginBottom: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#1C1C1E',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1C1C1E',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#F2F2F7',
    paddingHorizontal: 16,
    minHeight: 56,
  },
  textAreaContainer: {
    alignItems: 'flex-start',
    paddingVertical: 16,
    minHeight: 80,
  },
  inputError: {
    borderColor: '#FF3B30',
  },
  inputIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#1C1C1E',
  },
  textArea: {
    textAlignVertical: 'top',
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#FF3B30',
    marginTop: 8,
  },
  rowInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    borderRadius: 16,
    paddingVertical: 16,
    marginTop: 20,
    marginBottom: 40,
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
    marginLeft: 8,
  },
});